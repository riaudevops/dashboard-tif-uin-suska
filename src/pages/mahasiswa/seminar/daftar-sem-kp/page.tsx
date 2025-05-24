import { useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import { LayoutGridIcon } from "lucide-react";

export default function MahasiswaSeminarDaftarPage() {
  const navigate = useNavigate();
  const [step1Accessible, setStep1Accessible] = useState(false);

  // Fetch data from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["seminar-kp-data"],
    queryFn: APISeminarKP.getDataMydokumen,
  });

  useEffect(() => {
    if (data?.data?.steps_info?.step1_accessible !== undefined) {
      setStep1Accessible(data.data.steps_info.step1_accessible);
    }
  }, [data]);

  const handleNavigation = () => {
    if (step1Accessible) {
      navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas");
    }
  };

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
          step: 0,
          checkItems: {
            hapalan: true,
            kerja_praktik: true,
            bimbingan: true,
            nilaiInstansi: true,
            dailyReport: true,
          },
        }}
        navigateFunction={handleNavigation}
        step1Accessible={step1Accessible} // Tambahkan prop ini
      />
    </DashboardLayout>
  );
}
