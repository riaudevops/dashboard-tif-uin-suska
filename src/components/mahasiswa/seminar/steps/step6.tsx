import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, LayoutGridIcon } from "lucide-react";
import React from "react";
import {
  Map,
  UserRound,
  Book,
  User,
  Clock,
  Phone,
  Info,
  CalendarDays,
  DoorOpen,
} from "lucide-react";

import Stepper from "@/components/mahasiswa/seminar/stepper";
import Status from "../status";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import toast from "react-hot-toast";

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
  nilai_penguji?: string;
  nilai_instansi?: string;
  nilai_pembimbing?: string;
  nilai_huruf?: string;
  [key: string]: string | undefined;
}

// Define the props type for InfoCard component
interface InfoCardProps {
  data: InfoData;
  displayItems?: string[];
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = React.memo(
  ({ data, displayItems = [], className = "" }) => {
    const iconMap: Record<string, React.ReactNode> = {
      judul: <Book className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lokasi: <Map className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lamaKerjaPraktek: (
        <Clock className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      dosenPembimbing: (
        <UserRound className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      kontakPembimbing: (
        <Phone className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      dosenPenguji: (
        <User className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      kontakPenguji: (
        <Phone className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      jadwal: (
        <CalendarDays className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      ruangan: (
        <DoorOpen className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
      nilai: (
        <Award className="size-4 text-emerald-500 dark:text-emerald-400" />
      ),
    };

    // Map of titles for each info item
    const titleMap: Record<string, string> = {
      judul: "Judul Laporan",
      lokasi: "Lokasi Kerja Praktik",
      lamaKerjaPraktek: "Lama Kerja Praktik",
      dosenPembimbing: "Dosen Pembimbing",
      kontakPembimbing: "Kontak Pembimbing",
      dosenPenguji: "Dosen Penguji",
      kontakPenguji: "Kontak Penguji",
      jadwal: "Jadwal",
      ruangan: "Ruangan",
      nilai: "Nilai Mata Kuliah KP Anda",
    };

    // Separate judul and nilai from other display items
    const judulItem = displayItems.includes("judul") ? "judul" : null;
    const nilaiItem = displayItems.includes("nilai") ? "nilai" : null;
    const otherItems = displayItems.filter(
      (item) => item !== "judul" && item !== "nilai"
    );

    // Jika data kosong, tampilkan placeholder
    if (!data || Object.keys(data).length === 0) {
      return <div>Data tidak tersedia</div>;
    }

    return (
      <div
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-none rounded-lg p-4 ${className}`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Nilai section - 1/5 of container width */}
          {nilaiItem && (
            <div className="md:w-1/5 w-full">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-md p-4 h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center w-full">
                  <h3 className="text-sm font-semibold text-emerald-600 dark:text-emerald-300 text-center mb-2">
                    Nilai Akhir Matkul KP Kamu
                  </h3>
                  <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {typeof data[nilaiItem] === "string"
                      ? data[nilaiItem]
                      : "-"} <span className="text-[1.35rem]">({data.nilai_huruf})</span>
                  </p>
                  {/* Menampilkan nilai penguji, instansi, dan pembimbing */}
                  <div className="mt-3 text-left text-xs text-emerald-600 dark:text-emerald-300 w-full">
                    <p className="flex justify-between items-center gap-2">
                      <span className="font-medium">Nilai Instansi (40%)</span>
                      <span className="inline-flex items-center justify-end px-2 py-0.5  text-emerald-600 dark:text-emerald-300  text-xs font-medium">
                        {data.nilai_instansi || "-"}
                      </span>
                    </p>
                    <hr className="my-2 border-emerald-200 dark:border-emerald-700" />
                    <p className="flex justify-between items-center gap-2">
                      <span className="font-medium">Nilai Penguji (40%)</span>
                      <span className="inline-flex items-center justify-end px-2 py-0.5  text-emerald-600 dark:text-emerald-300  text-xs font-medium">
                        {data.nilai_penguji || "-"}
                      </span>
                    </p>
                    <hr className="my-2 border-emerald-200 dark:border-emerald-700" />
                    <p className="flex justify-between items-center gap-2">
                      <span className="font-medium">Nilai Pembimbing (20%)</span>
                      <span className="inline-flex items-center justify-end px-2 py-0.5  text-emerald-600 dark:text-emerald-300  text-xs font-medium">
                        {data.nilai_pembimbing || "-"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right side content - 4/5 of container width */}
          <div className="flex-1 md:w-4/5">
            {/* Judul Laporan - Full Row */}
            {judulItem && (
              <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-md p-3 w-full">
                <div className="flex items-center">
                  {iconMap[judulItem]}
                  <h3 className="ml-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                    {titleMap[judulItem]}
                  </h3>
                </div>
                <p className="pl-6 text-sm font-medium text-gray-800 dark:text-gray-200 break-words mt-1">
                  {typeof data[judulItem] === "string"
                    ? data[judulItem]
                    : "Belum diisi"}
                </p>
              </div>
            )}

            {/* Other items in a single row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {otherItems.map((key) => {
                const icon = iconMap[key] || (
                  <Info className="size-4 text-emerald-500 dark:text-emerald-400" />
                );
                const title = titleMap[key] || key;

                return (
                  <div
                    key={key}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-3"
                  >
                    <div className="flex items-center">
                      {icon}
                      <h3 className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                        {title}
                      </h3>
                    </div>
                    <p className="pl-6 text-xs text-gray-700 dark:text-gray-300 break-words mt-1">
                      {typeof data[key] === "string"
                        ? data[key]
                        : "Belum diisi"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data === nextProps.data &&
      prevProps.displayItems === nextProps.displayItems &&
      prevProps.className === nextProps.className
    );
  }
);

// Step6 Component
interface Step6Props {
  activeStep: number;
}

export default function Step6({ activeStep }: Step6Props) {
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

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["seminar-kp-my-documents"],
    queryFn: APISeminarKP.getDataMydokumen,
  });

  if (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data seminar KP.";
    toast.error(errorMessage);
  }

  const status = apiData?.data?.nilai[0]?.validasi_nilai ? "validasi" : "belum";

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
        nilai_penguji: apiData.data.nilai[0]?.nilai_penguji
          ? String(apiData.data.nilai[0].nilai_penguji)
          : "Belum diisi",
        nilai_instansi: apiData.data.nilai[0]?.nilai_instansi
          ? String(apiData.data.nilai[0].nilai_instansi)
          : "Belum diisi",
        nilai_pembimbing: apiData.data.nilai[0]?.nilai_pembimbing
          ? String(apiData.data.nilai[0].nilai_pembimbing)
          : "Belum diisi",
        nilai_huruf: apiData.data.nilai[0]?.nilai_huruf ? String(apiData.data.nilai[0].nilai_huruf) : "Belum diisi",
      }
    : {};

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
      </div>
    );
  }

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
      <div className="flex mb-5">
        <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
          <span className="inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400" />
          <LayoutGridIcon className="w-4 h-4 mr-1.5" />
          Validasi Kelengkapan Berkas Seminar Kerja Praktik Mahasiswa
        </span>
      </div>

      <Stepper activeStep={activeStep} />

      <div className="p-0 pt-2.5">
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

        {/* Status and InfoCard rendering */}
        <Status
          status={status}
          title={
            status === "belum"
              ? "Nilai anda masih diproses"
              : "Nilai anda sudah tersedia di IRAISE"
          }
          subtitle={status === "belum" ? "Mohon bersabar" : ""}
        />

        <InfoCard
          data={infoData}
          displayItems={informasiSeminarFields}
          className="mt-4"
        />
      </div>
    </div>
  );
}
