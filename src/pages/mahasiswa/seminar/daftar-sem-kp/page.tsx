import { useState } from "react";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import PendaftaranCard from "@/components/mahasiswa/seminar/pendaftaran-card";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClipboardIcon, MapPinHouseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MahasiswaSeminarDaftarPage() {
  const navigate = useNavigate();
  const days = 26;

  interface entry {
    id: number;
    status: string;
    company: string;
    date: string;
    progress: string;
  }

  const entry = {
    id: 1,
    status: "Baru",
    company: "PT RAPP",
    date: "2025-02-28",
    progress: "Kelengkapan Berkas",
  };

  // Example state to demonstrate different card variants
  const [cardStatus, setCardStatus] = useState<
    "default" | "diterima" | "ditolak"
  >("default");

  const infoPengajuanSeminar = {
    step: 0,
    status: cardStatus,
  };

  // Navigation handlers
  const handleNavigation = () => {
    switch (cardStatus) {
      case "diterima":
        navigate("/mahasiswa/seminar/detail-jadwal");
        break;
      case "ditolak":
        navigate("/mahasiswa/seminar/daftar-ulang");
        break;
      default:
        navigate("/mahasiswa/seminar/validasi-berkas");
        break;
    }
  };

  const KPCard = ({ entry }: { entry: entry }) => (
    <Card className="bg-[#F5F9F4] dark:bg-slate-700 border border-green-400 shadow-none dark:border-emerald-500">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap gap-8 items-center text-sm">
          <div className="flex items-center gap-1">
            <ClipboardIcon className="h-4 w-4" />
            <span>Status KP: {entry.status}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPinHouseIcon className="h-4 w-4" />
            <span>{entry.company}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            <span>{entry.date}</span>
          </div>
          <div className="ml-auto text-right">Progress: {entry.progress}</div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center pt-2">
        <CardTitle className="text-xl font-semibold">
          Seminar Kerja Praktik #{entry.id}
        </CardTitle>
      </CardContent>
    </Card>
  );

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
          days={days}
          infoPengajuanSeminar={infoPengajuanSeminar}
          navigateFunction={handleNavigation}
        />

        <div className="mt-5 px-5 space-y-3">
          <h2 className="text-xl font-bold">Detail Riwayat</h2>
          <h3 className="font-medium text-base">Aktif</h3>
          <Separator />
          <p>
            {cardStatus === "diterima" ? (
              <KPCard entry={entry} />
            ) : (
              <div className="font-bold text-sm px-5 text-green-900 bg-[#E0F2DE] dark:bg-emerald-100 text-center py-2">
                Anda sekarang tidak sedang melakukan pendaftaran atau
                pelaksanaan KP...
              </div>
            )}
          </p>
        </div>
        {/* Demo controls - remove in production */}
        <Separator className="mt-96" />
        <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-md">
          <p className="mb-2 font-medium">Demo status selector:</p>
          <div className="flex gap-2">
            <Button
              variant={cardStatus === "default" ? "default" : "outline"}
              onClick={() => setCardStatus("default")}
            >
              Default
            </Button>
            <Button
              variant={cardStatus === "diterima" ? "default" : "outline"}
              onClick={() => setCardStatus("diterima")}
            >
              Diterima
            </Button>
            <Button
              variant={cardStatus === "ditolak" ? "default" : "outline"}
              onClick={() => setCardStatus("ditolak")}
            >
              Ditolak
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
