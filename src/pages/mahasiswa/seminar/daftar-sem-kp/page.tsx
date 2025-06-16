import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import { LayoutGridIcon } from "lucide-react";

interface SeminarData {
  persyaratan_seminar_kp: {
    sudah_selesai_murojaah: boolean;
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
    const stepState = apiResponse?.data?.steps_info

    if (stepState?.step1_accessible) {
      currentStep = 0
    }

    if (stepState?.step2_accessible) {
      currentStep = 1
    }

    if (stepState?.step3_accessible) {
      currentStep = 2
    }

    if (stepState?.step4_accessible) {
      currentStep = 3
    }

    if (stepState?.step5_accessible) {
      currentStep = 4
    }

    if (stepState?.step6_accessible) {
      currentStep = 5
    }

    return currentStep;
  };

  const currentStep = determineCurrentStep();

  useEffect(() => {
    // Redirect if seminar process has already started
    if (seminarStarted && step1Accessible) {  
      navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas", {
        replace: true,
      });
    }
  }, [seminarStarted, step1Accessible]);

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
        <div className="flex mb-3">
          <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
            <span
              className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
            />
            <LayoutGridIcon className="w-4 h-4 mr-1.5" />
            Pengajuan Seminar Kerja Praktik Mahasiswa
          </span>
        </div>
        <div className="bg-foreground/5 flex justify-center items-center w-full border border-gray-300 dark:border-gray-700 shadow-sm rounded-xl h-full">
          <div className="p-4 bg-yellow-100 dark:bg-gray-800 border border-yellow-300 dark:border-gray-700 rounded-md shadow-md">
            <div className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-yellow-900 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 014.293-7.293l1.414 1.414A6 6 0 006 12H4zm2 5.293A8 8 0 0112 20v-2a6 6 0 00-4.293-5.707l-1.414 1.414z"></path>
              </svg>
              <span className="text-gray-600 dark:text-gray-300 text-lg">Sedang Proses Memuat Data! 🔥</span>
            </div>
          </div>
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
      {(!seminarStarted || !step1Accessible) && <div>
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
              hapalan: apiResponse?.data?.persyaratan_seminar_kp?.sudah_selesai_murojaah ?? false, // Dummy for murojaah 1-16
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
      </div>}
    </DashboardLayout>
  );
}
