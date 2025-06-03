import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import { LayoutGridIcon } from "lucide-react";

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
    step2: any[];
    step3: any[];
    step5: any[];
  };
  jadwal: {
    status: string;
  }[];
  nilai: {
    validasi_nilai: {
      is_approve: boolean;
    };
  }[];
}

interface ApiResponse {
  response: boolean;
  message: string;
  data?: SeminarData;
}

export default function MahasiswaSeminarDaftarPage() {
  const navigate = useNavigate();
  const [seminarStarted, setSeminarStarted] = useState(
    localStorage.getItem("seminarProcessStarted") === "true"
  );

  // Fetch data from API
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["seminar-kp-data"],
    queryFn: async () => {
      try {
        const response = await APISeminarKP.getDataMydokumen();
        return response;
      } catch (err) {
        return {
          response: false,
          message: (err as Error).message || "Gagal mengambil data",
        };
      }
    },
  });

  // Check step accessibility and requirements
  const step1Accessible =
    apiResponse?.data?.steps_info?.step1_accessible || false;
  const semuaSyaratTerpenuhi =
    apiResponse?.data?.persyaratan_seminar_kp?.semua_syarat_terpenuhi || false;

  // Determine the current step based on API data
  const determineCurrentStep = () => {
    let currentStep = 0;

    // Step 1: Check if step1 documents are validated
    const step1Docs = apiResponse?.data?.dokumen_seminar_kp?.step1 || [];
    if (step1Docs.every((doc) => doc.status === "Divalidasi")) {
      currentStep = 1;
    }

    // Step 2: Check if step2 documents are validated
    const step2Docs = apiResponse?.data?.dokumen_seminar_kp?.step2 || [];
    if (
      currentStep === 1 &&
      step2Docs.every((doc) => doc.status === "Divalidasi")
    ) {
      currentStep = 2;
    }

    // Step 3: Check if step3 documents are validated
    const step3Docs = apiResponse?.data?.dokumen_seminar_kp?.step3 || [];
    if (
      currentStep === 2 &&
      step3Docs.every((doc) => doc.status === "Divalidasi")
    ) {
      currentStep = 3;
    }

    // Step 4: Check if seminar is completed
    const seminarStatus = apiResponse?.data?.jadwal?.[0]?.status;
    if (currentStep === 3 && seminarStatus === "Selesai") {
      currentStep = 4;
    }

    // Step 5: Check if step5 documents are validated
    const step5Docs = apiResponse?.data?.dokumen_seminar_kp?.step5 || [];
    if (
      currentStep === 4 &&
      step5Docs.every((doc) => doc.status === "Divalidasi")
    ) {
      currentStep = 5;
    }

    // Step 6: Check if validation is approved
    const isValidationApproved =
      apiResponse?.data?.nilai?.[0]?.validasi_nilai?.is_approve;
    if (currentStep === 5 && isValidationApproved) {
      currentStep = 5; // Already at the final step
    }

    return currentStep;
  };

  const currentStep = determineCurrentStep();

  const handleNavigation = () => {
    if (semuaSyaratTerpenuhi && step1Accessible) {
      // Mark seminar process as started
      localStorage.setItem("seminarProcessStarted", "true");
      setSeminarStarted(true);
      navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas", {
        replace: true,
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300">
          Mengambil data...
        </div>
      </DashboardLayout>
    );
  }

  // Handle error state (e.g., network error, not 404)
  if (isError && apiResponse?.response !== false) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 dark:text-red-300">
          Gagal mengambil data: {(error as Error).message}
        </div>
      </DashboardLayout>
    );
  }

  // Render PendaftaranCard
  return (
    <DashboardLayout>
      <div className="flex mb-3">
        <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
          <span
            className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
          />
          <LayoutGridIcon className="w-4 h-4 mr-1.5" />
          Pengajuan Seminar Kerja Praktik Mahasiswa
        </span>
      </div>

      <PendaftaranCard
        infoPengajuanSeminar={{
          step: currentStep,
          checkItems: {
            hapalan: true, // Dummy for murojaah 1-16
            kerja_praktik:
              apiResponse?.data?.persyaratan_seminar_kp?.masih_terdaftar_kp ??
              false,
            bimbingan:
              apiResponse?.data?.persyaratan_seminar_kp
                ?.minimal_lima_bimbingan ?? false,
            dailyReport:
              apiResponse?.data?.persyaratan_seminar_kp
                ?.daily_report_sudah_approve ?? false,
            nilaiInstansi:
              apiResponse?.data?.persyaratan_seminar_kp
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
