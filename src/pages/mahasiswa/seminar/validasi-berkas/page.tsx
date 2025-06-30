import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router-dom";
import Step1 from "@/components/mahasiswa/seminar/steps/step1";
import Step2 from "@/components/mahasiswa/seminar/steps/step2";
import Step3 from "@/components/mahasiswa/seminar/steps/step3";
import Step4 from "@/components/mahasiswa/seminar/steps/step4";
import Step5 from "@/components/mahasiswa/seminar/steps/step5";
import Step6 from "@/components/mahasiswa/seminar/steps/step6";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { LayoutGridIcon } from "lucide-react";

interface SeminarData {
  persyaratan_seminar_kp: {
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
    [key in `step${1 | 2 | 3 | 4 | 5 | 6}`]: any[];
  };
}

interface ApiResponse {
  response: boolean;
  message: string;
  data?: SeminarData;
}

const stepComponents: any = [Step1, Step2, Step3, Step4, Step5, Step6];

export default function MahasiswaSeminarValidasiBerkasPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const {
    data: apiResponse,
    isLoading,
    isError,
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

  // Check step accessibility
  const step1Accessible =
    apiResponse?.data?.steps_info?.step1_accessible || false;

  // Redirect if response is false, error, or step1 is not accessible
  useEffect(() => {
    if (!isLoading) {
      if (apiResponse?.response === false || isError || !step1Accessible) {
        navigate("/mahasiswa/kerja-praktik/seminar", { replace: true });
      }
    }
  }, [apiResponse, isError, isLoading, navigate, step1Accessible]);

  // Set active step based on accessible steps
  useEffect(() => {
    if (apiResponse?.data?.steps_info) {
      const accessibleSteps = Object.entries(apiResponse.data.steps_info)
        .filter(([key, value]) => key.endsWith("_accessible") && value)
        .map(
          ([key]) =>
            parseInt(key.replace("step", "").replace("_accessible", "")) - 1
        );
      const highestAccessibleStep = Math.max(...accessibleSteps, -1);
      setStep(highestAccessibleStep >= 0 ? highestAccessibleStep : 0);
    }
  }, [apiResponse]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex mb-3">
          <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
            <span
              className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
            />
            <LayoutGridIcon className="w-4 h-4 mr-1.5" />
            Validasi Kelengkapan Berkas Seminar Kerja Praktik Mahasiswa
          </span>
        </div>
        <div className="bg-foreground/5 flex justify-center items-center w-full border border-gray-300 dark:border-gray-700 shadow-sm rounded-xl h-full">
          <div className="p-4 bg-yellow-100 dark:bg-gray-800 border border-yellow-300 dark:border-gray-700 rounded-md shadow-md">
            <div className="flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-yellow-900 dark:text-emerald-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 014.293-7.293l1.414 1.414A6 6 0 006 12H4zm2 5.293A8 8 0 0112 20v-2a6 6 0 00-4.293-5.707l-1.414 1.414z"
                ></path>
              </svg>
              <span className="text-gray-600 dark:text-gray-300 text-lg">
                Sedang Proses Memuat Data! 🔥
              </span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback redirect if conditions are not met
  if (apiResponse?.response === false || isError || !step1Accessible) {
    return <Navigate to="/mahasiswa/kerja-praktik/seminar" replace />;
  }

  const StepComponent = stepComponents[step];

  const getStepStatus = () => {
    const stepKey = `step${
      step + 1
    }` as keyof SeminarData["dokumen_seminar_kp"];
    if (
      !apiResponse?.data?.dokumen_seminar_kp ||
      !apiResponse.data.dokumen_seminar_kp[stepKey]
    ) {
      return "belum";
    }
    return apiResponse.data.dokumen_seminar_kp[stepKey].some(
      (doc: any) => doc.status === "Ditolak"
    )
      ? "ditolak"
      : "validasi";
  };

  return (
    <DashboardLayout>
      <div className="">
        <StepComponent activeStep={step} status={getStepStatus()} />
        {/* No manual step navigation buttons */}
      </div>
    </DashboardLayout>
  );
}
