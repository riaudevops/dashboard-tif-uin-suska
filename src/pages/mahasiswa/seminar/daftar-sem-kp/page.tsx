import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";

interface SeminarData {
  persyaratan_seminar_kp: {
    masih_terdaftar_kp: boolean;
    minimal_lima_bimbingan: boolean;
    daily_report_sudah_approve: boolean;
    sudah_mendapat_nilai_instansi: boolean;
    semua_syarat_terpenuhi: boolean;
  };
  steps_info: {
    step1_accessible: boolean;
    step2_accessible: boolean;
    step3_accessible: boolean;
    step4_accessible: boolean;
    step5_accessible: boolean;
    step6_accessible: boolean;
  };
  dokumen_seminar_kp: {
    step1: any[];
  };
}

export default function MahasiswaSeminarDaftarPage() {
  const navigate = useNavigate();
  const [seminarStarted, setSeminarStarted] = useState(
    localStorage.getItem("seminarProcessStarted") === "true"
  );

  // Fetch data from API
  const { data, isLoading, isError, error } = useQuery<{
    data: SeminarData;
  }>({
    queryKey: ["seminar-kp-data"],
    queryFn: APISeminarKP.getDataMydokumen,
  });

  // Check step accessibility and requirements
  const step1Accessible = data?.data?.steps_info?.step1_accessible || false;
  const semuaSyaratTerpenuhi =
    data?.data?.persyaratan_seminar_kp?.semua_syarat_terpenuhi || false;
  const hasSubmittedDocuments =
    (data?.data?.dokumen_seminar_kp?.step1?.length || 0) > 0;

  // Redirect logic
  useEffect(() => {
    if (
      (seminarStarted && semuaSyaratTerpenuhi) ||
      (step1Accessible && semuaSyaratTerpenuhi && hasSubmittedDocuments)
    ) {
      navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas", {
        replace: true,
      });
    }
  }, [
    seminarStarted,
    step1Accessible,
    semuaSyaratTerpenuhi,
    hasSubmittedDocuments,
    navigate,
  ]);

  const handleNavigation = () => {
    if (semuaSyaratTerpenuhi && step1Accessible) {
      // Mark seminar process as started
      localStorage.setItem("seminarProcessStarted", "true");
      setSeminarStarted(true);
      navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300">
          Memuat data seminar...
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 dark:text-red-300">
          Gagal mengambil data: {(error as Error).message}
        </div>
      </DashboardLayout>
    );
  }

  // Redirect if conditions are met
  if (
    (seminarStarted && semuaSyaratTerpenuhi) ||
    (step1Accessible && semuaSyaratTerpenuhi && hasSubmittedDocuments)
  ) {
    return (
      <Navigate to="/mahasiswa/kerja-praktik/seminar/validasi-berkas" replace />
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold">
          Pendaftaran Seminar Kerja Praktik
        </h1>
        <p className="text-xs">
          Berikut Detail Progress Seminar Pendaftaran Kerja Praktik Anda,
          Semangat terus ya....
        </p>
      </div>

      <PendaftaranCard
        infoPengajuanSeminar={{
          step: 0,
          checkItems: {
            hapalan: true, // Dummy for murojaah 1-16
            kerja_praktik:
              data?.data?.persyaratan_seminar_kp?.masih_terdaftar_kp ?? false,
            bimbingan:
              data?.data?.persyaratan_seminar_kp?.minimal_lima_bimbingan ??
              false,
            dailyReport:
              data?.data?.persyaratan_seminar_kp?.daily_report_sudah_approve ??
              false,
            nilaiInstansi:
              data?.data?.persyaratan_seminar_kp
                ?.sudah_mendapat_nilai_instansi ?? false,
          },
        }}
        navigateFunction={handleNavigation}
        step1Accessible={step1Accessible}
        semuaSyaratTerpenuhi={semuaSyaratTerpenuhi}
      />
    </DashboardLayout>
  );
}
