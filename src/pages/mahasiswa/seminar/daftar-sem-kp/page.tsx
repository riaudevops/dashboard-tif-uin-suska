import { useState, useEffect } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";

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
