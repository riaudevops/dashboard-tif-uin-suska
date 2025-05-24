import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import InfoCard from "../informasi-seminar";
import Status from "../status";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import toast from "react-hot-toast";

// Define TypeScript interface for component props
interface Step6Props {
  activeStep: number;
  status: string;
}

// Define the data structure for InfoCard
interface InfoData {
  judul?: string;
  lokasi?: string;
  dosenPembimbing?: string;
  dosenPenguji?: string;
  lamaKerjaPraktek?: string;
  kontakPembimbing?: string;
  kontakPenguji?: string;
  jadwal?: string;
  ruangan?: string;
  nilai?: string;
  [key: string]: string | undefined;
}

/**
 * Step6 component - Displays the final step of the seminar validation process
 *
 * @param {number} activeStep - Current active step in the stepper
 * @param {string} status - Current validation status ('belum' or 'validasi')
 */
export default function Step6({ activeStep, status }: Step6Props) {
  // Define constants outside the component
  const informasiSeminarFields = [
    "judul",
    "nilai",
    "lokasi",
    "lamaKerjaPraktek",
    "dosenPembimbing",
    "dosenPenguji",
    "kontakPembimbing",
    "kontakPenguji",
    "jadwal",
    "ruangan",
  ];

  // Fetch data using useQuery
  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seminar-kp-my-documents"],
    queryFn: APISeminarKP.getDataMydokumen,
    // Hapus onError dari sini
  });

  // Tangani error menggunakan properti error
  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data seminar KP.";
    toast.error(errorMessage);
  }

  // Map API response to InfoData
  const infoData: InfoData = apiData?.data
    ? {
        judul: apiData.data.pendaftaran_kp[0]?.judul_kp || "Belum diisi",
        lokasi: apiData.data.pendaftaran_kp[0]?.instansi?.nama || "Belum diisi",
        dosenPembimbing:
          apiData.data.pendaftaran_kp[0]?.dosen_pembimbing?.nama ||
          "Belum diisi",
        dosenPenguji:
          apiData.data.pendaftaran_kp[0]?.dosen_penguji?.nama || "Belum diisi",
        kontakPembimbing:
          apiData.data.pendaftaran_kp[0]?.dosen_pembimbing?.no_hp ||
          "Belum diisi",
        kontakPenguji:
          apiData.data.pendaftaran_kp[0]?.dosen_penguji?.no_hp || "Belum diisi",
        lamaKerjaPraktek: (() => {
          const start = apiData.data.pendaftaran_kp[0]?.tanggal_mulai
            ? new Date(apiData.data.pendaftaran_kp[0].tanggal_mulai)
            : null;
          const end = apiData.data.pendaftaran_kp[0]?.tanggal_selesai
            ? new Date(apiData.data.pendaftaran_kp[0].tanggal_selesai)
            : null;
          if (start && end) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} hari`;
          }
          return start ? "Sedang berlangsung" : "Belum diisi";
        })(),
        jadwal: apiData.data.jadwal[0]
          ? new Date(apiData.data.jadwal[0].tanggal).toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            ) +
            " " +
            new Date(apiData.data.jadwal[0].waktu_mulai).toLocaleTimeString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ) +
            " - " +
            new Date(apiData.data.jadwal[0].waktu_selesai).toLocaleTimeString(
              "id-ID",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          : "Belum diisi",
        ruangan: apiData.data.jadwal[0]?.ruangan?.nama || "Belum diisi",
        nilai: apiData.data.nilai[0]?.nilai_akhir
          ? String(apiData.data.nilai[0].nilai_akhir)
          : "-",
      }
    : {};

  // Animation variants for consistent motion effects
  const fadeInAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.1 },
  };

  // Different bubble animations
  const bubbleAnimations = {
    first: {
      animate: { y: [0, -10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 5, ease: "easeInOut" },
    },
    second: {
      animate: { y: [0, 10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 7, ease: "easeInOut" },
    },
    third: {
      animate: { x: [0, 10, 0], scale: [1, 1.1, 1] },
      transition: { repeat: Infinity, duration: 6, ease: "easeInOut" },
    },
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500 dark:text-red-400">
          Gagal memuat data seminar KP.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        Validasi Kelengkapan Berkas Seminar Kerja Praktik
      </h1>

      <Stepper activeStep={activeStep} />

      <div className="p-4">
        <div className="flex flex-col gap-12 mb-4">
          {/* Success banner */}
          <motion.div
            className="relative overflow-hidden bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-xl text-gray-800 dark:text-white py-8 px-6 border border-gray-100 dark:border-none"
            {...fadeInAnimation}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 dark:from-purple-600/20 dark:via-transparent via-transparent to-purple-100/60 dark:to-blue-600/20"></div>

            {/* Decorative bubbles */}
            <motion.div
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-blue-400/20 dark:bg-purple-500/30 blur-md"
              {...bubbleAnimations.first}
            />
            <motion.div
              className="absolute top-1/2 -right-4 w-12 h-12 rounded-full bg-purple-400/20 dark:bg-blue-500/30 blur-md"
              {...bubbleAnimations.second}
            />
            <motion.div
              className="absolute bottom-6 left-10 w-8 h-8 rounded-full bg-pink-400/20 dark:bg-pink-500/30 blur-md"
              {...bubbleAnimations.third}
            />

            {/* Header with award icon */}
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="relative"
              >
                <Award
                  className="w-12 h-12 text-blue-600 dark:text-yellow-300"
                  strokeWidth={1.5}
                />
                <motion.div
                  className="absolute inset-0 bg-blue-400/20 dark:bg-yellow-300/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>

              <div className="w-12 h-1 bg-gradient-to-l from-blue-500 dark:from-purple-500 to-transparent rounded-full"></div>
            </div>

            {/* Congratulations message */}
            <h1 className="text-center text-2xl font-bold mb-3">
              <span className="text-blue-600 dark:text-purple-300">
                Selamat!
              </span>{" "}
              Proses Seminar Kerja Praktik Anda
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-yellow-300 dark:to-orange-400">
                {" "}
                Berhasil
              </span>
            </h1>

            {/* Info message */}
            <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-transparent">
              <p className="text-center text-xs font-medium text-gray-700 dark:text-white/80">
                Silakan Cek Berkala Untuk Progress Nilai Anda
              </p>
            </div>
          </motion.div>
        </div>

        {/* Conditional rendering based on status */}
        {status === "belum" ? (
          <>
            <Status
              status="belum"
              title="Nilai Anda Masih dalam Proses Validasi"
              subtitle="Mohon bersabar"
            />

            <InfoCard
              data={infoData}
              displayItems={informasiSeminarFields}
              className="mt-4"
            />
          </>
        ) : (
          status === "validasi" && (
            <InfoCard data={infoData} displayItems={informasiSeminarFields} />
          )
        )}
      </div>
    </div>
  );
}
