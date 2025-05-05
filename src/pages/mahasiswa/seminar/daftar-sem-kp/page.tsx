import { useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function MahasiswaSeminarDaftarPage() {
  const navigate = useNavigate();

  // Toggle untuk item yang tidak terpenuhi
  const [itemNilaiTerpenuhi, setItemNilaiTerpenuhi] = useState(false);

  // Checkitems information
  const checkItems = {
    hapalan: true,
    kerja_praktik: true,
    bimbingan: true,
    nilaiInstansi: itemNilaiTerpenuhi,
    dailyReport: true,
  };

  const infoPengajuanSeminar = {
    step: 0,
    checkItems: checkItems,
  };

  const handleNavigation = () => {
    navigate("/mahasiswa/kerja-praktik/seminar/validasi-berkas");
  };

  return (
    <>
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
          infoPengajuanSeminar={infoPengajuanSeminar}
          navigateFunction={handleNavigation}
        />

        {/* Demo controls - remove in production */}
        <Separator className="mt-96" />
        <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
          <p className="mb-2 font-medium">Demo status selector:</p>
          <div className="flex gap-2">
            <Button
              variant={itemNilaiTerpenuhi ? "default" : "outline"}
              onClick={() => setItemNilaiTerpenuhi(!itemNilaiTerpenuhi)}
            >
              {itemNilaiTerpenuhi
                ? "Semua Ceklis Terpenuhi"
                : "Ada Item Belum Terpenuhi"}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
