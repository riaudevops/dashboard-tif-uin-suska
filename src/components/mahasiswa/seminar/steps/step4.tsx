import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import { PartyPopper, Calendar, Clock, LayoutGridIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import InfoCard from "../informasi-seminar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";

// Types
interface Step4Props {
  activeStep: number;
}

interface CardHeaderProps {
  title: string;
}

// Constants
const SEMINAR_REQUIREMENTS = [
  "Hubungi Dosen Pembimbing dan Dosen Penguji Terkait Seminar dan Jadwal (Konfirmasi)",
  "Serahkan Dokumen Seminar KP : Printed dan Soft File (Via Telegram) Daily Report, Laporan Tambahan dan Undangan Seminar KP Kepada Dosen Pembimbing dan Penguji KP Maksimal 3 Hari SEBELUM Seminar KP",
  "Persiapkan Infokus dll ketika seminar pada Hari H",
  "Konfirmasi ke Koordinator KP jika ada kendala dll",
  "Menyiapkan form Berita Acara dan Lembar Pengesahan KP",
];

// Component for gradient card header
const CardHeaderGradient: FC<CardHeaderProps> = ({ title }) => (
  <div className="bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4">
    <CardTitle className="text-white text-lg font-medium">{title}</CardTitle>
  </div>
);

// Decorative particles component
const BackgroundParticles: FC = () => (
  <motion.div
    className="absolute top-0 left-0 w-full h-full"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-white/30"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </motion.div>
);

// Animated clock component
const AnimatedClock: FC = () => (
  <div className="relative flex justify-center">
    <div className="size-16 rounded-full flex items-center justify-center mb-2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Clock className="w-10 h-10 text-white drop-shadow-md" />
      </motion.div>
    </div>
  </div>
);

// CountdownCard component with isToday and isPast props
const CountdownCard: FC<{
  countdownDays: number;
  isToday: boolean;
  isPast: boolean;
}> = ({ countdownDays, isToday, isPast }) => {
  const todayBgClass =
    "from-purple-500 to-violet-600 dark:from-purple-600 dark:to-violet-700";
  const countdownBgClass =
    "from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700";
  const pastBgClass =
    "from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700";
  const bgClass = isPast
    ? pastBgClass
    : isToday
    ? todayBgClass
    : countdownBgClass;

  return (
    <motion.div
      className="h-56 w-56 lg:h-auto flex-shrink-0"
      transition={{ type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${bgClass} rounded-xl p-6 text-center flex flex-col justify-center items-center transform-gpu shadow-lg`}
      >
        <BackgroundParticles />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/10 blur-xl" />

        <AnimatedClock />

        <h2
          className={`font-bold text-white mt-3 drop-shadow-lg ${
            isToday ? "text-4xl" : "text-6xl"
          }`}
        >
          {isPast ? "Telah Lewat" : isToday ? "Hari Ini" : `H-${countdownDays}`}
        </h2>

        <motion.div
          className="absolute w-32 h-12 rounded-full bg-white/10 blur-md"
          style={{ top: "60%" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <span className="relative text-xs text-emerald-100 uppercase tracking-wider font-medium mt-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          {isPast ? "SEMINAR" : isToday ? "SEMINAR" : "MENUJU SEMINAR"}
        </span>

        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
      </div>
    </motion.div>
  );
};

// AnnouncementCard component
const AnnouncementCard: FC = () => (
  <motion.div
    className="flex-1 rounded-xl overflow-hidden relative border border-gray-100 dark:border-none bg-white dark:bg-black min-h-56"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 dark:from-purple-600/20 dark:via-transparent via-transparent to-purple-100/60 dark:to-blue-600/20"></div>

    <motion.div
      className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-400/20 dark:bg-purple-500/30 blur-md"
      animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
    />

    <motion.div
      className="absolute top-1/2 -right-4 w-12 h-12 rounded-full bg-purple-400/20 dark:bg-blue-500/30 blur-md"
      animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
    />

    <motion.div
      className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-pink-400/20 dark:bg-pink-500/30 blur-md"
      animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    />

    <motion.div
      className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-indigo-400/10 dark:bg-indigo-500/20 blur-xl"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
    />

    <motion.div
      className="absolute bottom-1/3 right-1/5 w-16 h-16 rounded-full bg-blue-400/10 dark:bg-blue-500/20 blur-lg"
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
    />

    <div className="relative h-full p-6 sm:p-8 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100/80 text-blue-700 hover:bg-blue-200/80 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur-sm">
            Seminar-KP
          </Badge>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          }}
          className="relative"
        >
          <PartyPopper
            className="w-8 h-8 text-blue-500 dark:text-pink-300"
            strokeWidth={1.5}
          />
          <motion.div
            className="absolute inset-0 bg-blue-400/20 dark:bg-pink-300/20 rounded-full blur-md"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 text-gray-800 dark:text-white">
        <span className="text-blue-600 dark:text-purple-300">
          Semoga Sukses Dalam
        </span>{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-pink-300 dark:to-blue-300">
          Pelaksanaan Seminar! ✨
        </span>
      </h1>

      <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 mt-2 max-w-xl border border-blue-100 dark:border-transparent">
        <p className="text-gray-700 dark:text-white/80 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          Jadwal & informasi Dosen Penguji Anda sudah siap
        </p>
      </div>

      <div className="w-24 h-1 bg-gradient-to-l from-blue-500 dark:from-purple-500 to-transparent rounded-full self-end"></div>
    </div>
  </motion.div>
);

// Requirements list component
const RequirementsList: FC = () => (
  <Card className="border dark:border-none shadow-sm rounded-lg overflow-hidden dark:bg-gray-900">
    <CardHeaderGradient title="Sebelum Seminar KP Mahasiswa Wajib Sudah:" />

    <CardContent className="p-4 sm:p-5">
      <ol className="space-y-2 text-sm sm:text-base">
        {SEMINAR_REQUIREMENTS.map((text, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/10 dark:hover:text-emerald-200 transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-emerald-400/30 dark:bg-emerald-800/50 rounded-md font-semibold text-emerald-700 dark:text-emerald-300 text-sm">
              {index + 1}
            </div>
            <div className="flex-1 text-gray-700 dark:text-gray-200 text-base">
              {text}
            </div>
          </li>
        ))}
      </ol>
    </CardContent>
  </Card>
);

// Main component
const Step4: FC<Step4Props> = ({ activeStep }) => {
  // Fetch data menggunakan TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["seminar-kp-step4"],
    queryFn: APISeminarKP.getDataMydokumen,
    staleTime: Infinity,
  });

  // Gunakan nilai countdown langsung dari API
  const { countdownDays, isToday, isPast } = useMemo(() => {
    if (
      !data?.data?.jadwal ||
      !Array.isArray(data.data.jadwal) ||
      data.data.jadwal.length === 0
    ) {
      return { countdownDays: 5, isToday: false, isPast: false }; // Default jika jadwal tidak ada
    }

    const countdown = data.data.jadwal[0].countdown || "H-5"; // Default jika countdown tidak ada
    let countdownDays = 5;
    let isToday = false;
    let isPast = false;

    if (countdown === "Hari ini") {
      countdownDays = 0;
      isToday = true;
      isPast = false;
    } else if (countdown === "Telah Lewat") {
      countdownDays = 0;
      isToday = false;
      isPast = true;
    } else if (countdown.startsWith("H-")) {
      const days = parseInt(countdown.replace("H-", ""), 10);
      countdownDays = isNaN(days) ? 5 : days; // Fallback ke 5 jika parsing gagal
      isToday = false;
      isPast = false;
    }

    return { countdownDays, isToday, isPast };
  }, [data]);

  // Data untuk InfoCard
  const infoData = useMemo(() => {
    if (!data?.data) {
      return {};
    }

    return {
      judul: data.data.pendaftaran_kp?.[0]?.judul_kp || "Belum diisi",
      jadwal: data.data.jadwal?.[0]?.tanggal
        ? (() => {
            const seminarDate = new Date(data.data.jadwal[0].tanggal);
            const datePart = seminarDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            });
            const timeStart = data.data.jadwal[0]?.waktu_mulai
              ? new Date(data.data.jadwal[0].waktu_mulai).toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  }
                )
              : "Waktu belum ditentukan";
            const timeEnd = data.data.jadwal[0]?.waktu_selesai
              ? new Date(data.data.jadwal[0].waktu_selesai).toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  }
                )
              : null;
            return timeEnd
              ? `${datePart}, ${timeStart} - ${timeEnd}`
              : `${datePart}, ${timeStart}`;
          })()
        : "Belum diisi",
      ruangan: data.data.jadwal?.[0]?.ruangan?.nama || "Belum diisi",
      dosenPembimbing:
        data.data.pendaftaran_kp?.[0]?.dosen_pembimbing?.nama || "Belum diisi",
      dosenPenguji:
        data.data.pendaftaran_kp?.[0]?.dosen_penguji?.nama || "Belum diisi",
      lokasi: data.data.pendaftaran_kp?.[0]?.instansi?.nama || "Belum diisi",
      lamaKerjaPraktik: `${
        data.data.pendaftaran_kp?.[0]?.tanggal_mulai
          ? new Date(
              data.data.pendaftaran_kp[0].tanggal_mulai
            ).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            })
          : "Belum diisi"
      } - ${
        data.data.pendaftaran_kp?.[0]?.tanggal_selesai
          ? new Date(
              data.data.pendaftaran_kp[0].tanggal_selesai
            ).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              timeZone: "Asia/Jakarta",
            })
          : "Belum diisi"
      }`,
      kontakPembimbing:
        data.data.pendaftaran_kp?.[0]?.dosen_pembimbing?.no_hp || "Belum diisi",
      kontakPenguji:
        data.data.pendaftaran_kp?.[0]?.dosen_penguji?.no_hp || "Belum diisi",
    };
  }, [data]);

  const informasiSeminarFields = [
    "judul",
    "jadwal",
    "ruangan",
    "dosenPembimbing",
    "dosenPenguji",
    "lokasi",
    "lamaKerjaPraktik",
    "kontakPembimbing",
    "kontakPenguji",
  ];

  // Penanganan error fetching
  if (isError) {
    toast.error(`Gagal mengambil data: ${error.message}`, {
      duration: 3000,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex mb-5">
        <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
          <span
            className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
          />
          <LayoutGridIcon className="w-4 h-4 mr-1.5" />
          Validasi Kelengkapan Berkas Seminar Kerja Praktik Mahasiswa
        </span>
      </div>

      <Stepper activeStep={activeStep} />

      <div className="space-y-4">
        {/* Header section with countdown and announcement */}
        <div className="flex flex-col lg:flex-row gap-4 relative overflow-hidden w-full">
          <CountdownCard
            countdownDays={countdownDays}
            isToday={isToday}
            isPast={isPast}
          />
          <AnnouncementCard />
        </div>

        {isLoading ? (
          <div>Loading InfoCard...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <InfoCard
            displayItems={informasiSeminarFields}
            data={infoData}
            className="mb-4"
          />
        )}

        {/* Requirements section */}
        <RequirementsList />
      </div>
    </div>
  );
};

export default Step4;
