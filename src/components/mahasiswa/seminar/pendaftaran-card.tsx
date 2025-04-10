import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/magic-ui/terminal";
import { Textarea } from "@/components/ui/textarea";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import { useNavigate } from "react-router-dom";

interface PendaftaranCardProps {
  days: number;
  infoPengajuanSeminar: {
    step: number;
    status?: "diterima" | "ditolak" | "default";
  };
  navigateFunction?: () => void;
}

const PendaftaranCard: React.FC<PendaftaranCardProps> = ({
  days,
  infoPengajuanSeminar,
  navigateFunction,
}) => {
  const status = infoPengajuanSeminar.status || "default";

  // Define thresholds for color changes
  const getColorScheme = (daysLeft: number) => {
    if (daysLeft > 20) {
      return {
        textColor: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-600 dark:bg-green-400",
        iconColor: "text-green-500 dark:text-green-400",
      };
    } else if (daysLeft > 10) {
      return {
        textColor: "text-yellow-500",
        bgColor: "bg-yellow-500",
        iconColor: "text-yellow-400",
      };
    } else {
      return {
        textColor: "text-red-600",
        bgColor: "bg-red-600",
        iconColor: "text-red-500",
      };
    }
  };

  const colorScheme = getColorScheme(days);
  const progressPercentage = Math.min(100, (days / 30) * 100);

  const navigate = useNavigate();

  // Default Card Content
  const DefaultCardContent = () => (
    <CardContent className="flex gap-4">
      <Card className="shadow-none border-none dark:bg-slate-800 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col h-full">
          <Terminal className="shadow-none border-none dark:bg-slate-800 flex-1 h-full flex flex-col min-h-64">
            <TypingAnimation>&gt; tif seminar@latest</TypingAnimation>
            <AnimatedSpan delay={1500} className="text-green-500">
              <span>✔ Setoran Hapalan 1-16.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={2000} className="text-green-500">
              <span>✔ Sudah melakukan minimal 5 kali bimbingan Dosen PA.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={2500} className="text-green-500">
              <span>✔ Sudah mendapatkan nilai dari pembimbing instansi.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={3000} className="text-green-500">
              <span>✔ Daily report sudah di approve Pembimbing.</span>
            </AnimatedSpan>
            <AnimatedSpan delay={3500} className="py-2 text-green-500">
              <span>ℹ Updated 1 file:</span>
              <span className="pl-2">- lib/seminar-kerja-praktik.ts</span>
            </AnimatedSpan>
            <AnimatedSpan delay={4000} className="text-yellow-500">
              Success! Sistem siap digunakan.
            </AnimatedSpan>
            <AnimatedSpan delay={4500} className="text-muted-foreground">
              Silahkan mulai pendaftaram seminar kerja praktik Anda.
            </AnimatedSpan>
          </Terminal>
        </div>
      </Card>

      <Card className="shadow-none border-none dark:bg-slate-800 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-center dark:text-white">
            Batas waktu Proses Pendaftaran Seminar KP Periode ini:
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span
                  className={`font-bold text-sm ${colorScheme.textColor} mr-2`}
                >
                  SISA
                </span>
                <div
                  className={`${colorScheme.bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}
                >
                  <span className="font-bold text-4xl">{days}</span>
                </div>
                <span
                  className={`font-bold text-sm ${colorScheme.textColor} ml-2`}
                >
                  HARI
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-4">
                Batas Akhir: Senin/ 21-Maret-2025
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
            <div
              className={`${colorScheme.bgColor} h-2.5 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </CardContent>

        <CardFooter className="justify-center text-sm">
          <p className="font-semibold dark:text-gray-200">
            Silahkan lakukan Pengajuan Pendaftaran KP Sebelum batas waktu yang
            telah ditentukan!
          </p>
        </CardFooter>
      </Card>
    </CardContent>
  );

  // Accepted Card Content
  const AcceptedCardContent = () => (
    <CardContent className="flex gap-4">
      <Card className="shadow-none border-none dark:bg-slate-800 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-center dark:text-white text-lg">
            Batas waktu Proses Pendaftaran Seminar KP Periode ini:
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center flex-1 justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span
                  className={`font-bold text-sm ${colorScheme.textColor} mr-2`}
                >
                  SISA
                </span>
                <div
                  className={`${colorScheme.bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}
                >
                  <span className="font-bold text-4xl">{days}</span>
                </div>
                <span
                  className={`font-bold text-sm ${colorScheme.textColor} ml-2`}
                >
                  HARI
                </span>
              </div>
              <p className="text-sm text-gray-500  dark:text-gray-300 mt-4">
                Batas Akhir: Senin/ 21-Maret-2025
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 ">
            <div
              className={`${colorScheme.bgColor} h-2.5 rounded-full`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </CardContent>

        <CardFooter className="text-center text-sm">
          <p className="font-semibold dark:text-gray-200">
            Silahkan Selesaikan Proses Kelengkapan Berkas Sebelum batas waktu
            yang telah ditentukan!
          </p>
        </CardFooter>
      </Card>

      <Card className="shadow-none border-none dark:bg-slate-800 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-center dark:text-white text-lg">
            Progress Terkini Pendaftaran Seminar KP:
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center flex-1">
          <div className="w-full max-w-xl mx-auto">
            <Stepper activeStep={infoPengajuanSeminar.step} variant="section" />
          </div>
        </CardContent>
      </Card>
    </CardContent>
  );

  // Rejected Card Content
  const RejectedCardContent = () => (
    <CardContent className="flex gap-4">
      <Card className="shadow-none border-none dark:bg-slate-800 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-center dark:text-white text-lg">
            Progress Terkini Pendaftaran Seminar KP:
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center flex-1">
          <div className="w-full max-w-xl mx-auto">
            <Stepper activeStep={infoPengajuanSeminar.step} variant="section" />
          </div>
        </CardContent>
      </Card>

      <div className="w-[50%]">
        <h2 className="text-red-700 font-semibold">Alasan ditolak:</h2>
        <Textarea
          placeholder="Masa Waktu Seminar Periode ini Telah Habis, Jika ingin melanjutkannya, silahkan daftar ulang."
          className="w-full text-black border border-red-900 bg-white dark:bg-secondary resize-none"
          readOnly
        />
      </div>
    </CardContent>
  );

  // Conditional Footer based on status
  const renderFooter = () => {
    switch (status) {
      case "diterima":
        return (
          <CardFooter className="justify-center">
            <div className="flex border border-green-400 dark:border-green-400 rounded-full px-7 py-2 gap-4 items-center">
              <p className="text-xs">
                Silahkan Lanjut untuk Validasi Kelengkapan Berkas !
              </p>
              <Button
                className="text-xs rounded-full px-4 bg-green-600 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500"
                onClick={() => navigate("/mahasiswa/seminar/validasi-berkas")}
              >
                Lanjut
              </Button>
            </div>
          </CardFooter>
        );
      case "ditolak":
        return (
          <CardFooter className="justify-center">
            <div className="flex border border-red-400 dark:border-red-600 rounded-full px-7 py-2 gap-4 items-center">
              <p className="text-xs">
                Silahkan Daftar Ulang Pada Periode Berikutnya!
              </p>
              <Button
                className="text-xs rounded-full px-4 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                onClick={navigateFunction}
              >
                Daftar Ulang
              </Button>
            </div>
          </CardFooter>
        );
      default:
        return (
          <CardFooter>
            <Button className="bg-green-600 size-full hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-500">
              Buat Permohonan <CircleFadingPlus />
            </Button>
          </CardFooter>
        );
    }
  };

  // Title based on status
  const getCardTitle = () => {
    switch (status) {
      case "diterima":
        return "📃 Permohonan Seminar Kerja Praktik Diterima";
      case "ditolak":
        return "📃 Permohonan Seminar Kerja Praktik Ditolak";
      default:
        return "📃 Permohonan Pendaftaran Seminar Kerja Praktik";
    }
  };

  return (
    <Card
      className={`bg-[#F5F9F4] dark:bg-slate-700 border ${
        status === "ditolak"
          ? "border-red-400 dark:border-red-500"
          : "border-green-400 dark:border-green-500"
      } shadow-none`}
    >
      <CardHeader>
        <CardTitle className="text-2xl dark:text-white">
          {getCardTitle()}
        </CardTitle>
        {status === "ditolak" && (
          <CardDescription className="text-red-600 dark:text-red-400">
            Maaf, permohonan pendaftaran seminar KP Anda ditolak. Silahkan
            periksa detail alasan penolakan.
          </CardDescription>
        )}
        {status === "diterima" && (
          <CardDescription>
            Silahkan Lakukan Pengecekan Berkala untuk Progres Seminar Kerja
            Praktik Anda!
          </CardDescription>
        )}
      </CardHeader>

      {status === "default" && <DefaultCardContent />}
      {status === "diterima" && <AcceptedCardContent />}
      {status === "ditolak" && <RejectedCardContent />}

      {renderFooter()}
    </Card>
  );
};

export default PendaftaranCard;
