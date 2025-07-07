import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, EyeIcon, LayoutGridIcon } from "lucide-react";
import React, { useState, type FC, type ReactNode } from "react";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Stepper from "@/components/mahasiswa/seminar/stepper";
import Status from "../status";
import APISeminarKP from "@/services/api/mahasiswa/seminar-kp.service";
import { toast } from "sonner";

// Define the detailed score components
interface ScoreDetails {
  komponen_penilaian_pembimbing?: {
    catatan: string;
    bimbingan_sikap: number;
    kualitas_laporan: number;
    penyelesaian_masalah: number;
  };
  komponen_penilaian_penguji?: {
    catatan: string;
    penguasaan_keilmuan: number;
    kemampuan_presentasi: number;
    kesesuaian_urgensi: number;
  };
  komponen_penilaian_instansi?: {
    masukan: string;
    deliverables: number;
    ketepatan_waktu: number;
    kedisiplinan: number;
    attitude: number;
    kerjasama_tim: number;
    inisiatif: number;
  };
}

// Define the data structure for InfoCard
interface InfoData {
  judul?: string;
  lokasi?: string;
  dosenPembimbing?: string;
  dosenPenguji?: string;
  lamaKerjaPraktik?: string;
  kontakPembimbing?: string;
  kontakPenguji?: string;
  jadwal?: string;
  ruangan?: string;
  nilai?: string;
  nilai_penguji?: string;
  nilai_instansi?: string;
  nilai_pembimbing?: string;
  nilai_huruf?: string;
  scoreDetails?: ScoreDetails;
  [key: string]: string | ScoreDetails | undefined;
}

// Define the props type for InfoCard component
interface InfoCardProps {
  data: InfoData;
  displayItems?: string[];
  className?: string;
}

const InfoCard: FC<InfoCardProps> = React.memo(
  ({ data, displayItems = [], className = "" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const iconMap: Record<string, React.ReactNode> = {
      judul: <Book className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lokasi: <Map className="size-4 text-emerald-500 dark:text-emerald-400" />,
      lamaKerjaPraktik: (
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

    const titleMap: Record<string, string> = {
      judul: "Judul Laporan",
      lokasi: "Instansi Kerja Praktik",
      lamaKerjaPraktik: "Lama Kerja Praktik",
      dosenPembimbing: "Dosen Pembimbing",
      kontakPembimbing: "Kontak Pembimbing",
      dosenPenguji: "Dosen Penguji",
      kontakPenguji: "Kontak Penguji",
      jadwal: "Jadwal",
      ruangan: "Ruangan",
      nilai: "Nilai Mata Kuliah KP Anda",
    };

    const instansiLabels = {
      deliverables: "Deliverables",
      ketepatan_waktu: "Ketepatan Waktu",
      kedisiplinan: "Kedisiplinan",
      attitude: "Attitude",
      kerjasama_tim: "Kerjasama Tim",
      inisiatif: "Inisiatif",
      masukan: "Masukan",
    };

    const pembimbingLabels = {
      penyelesaian_masalah: "Penyelesaian Masalah",
      bimbingan_sikap: "Bimbingan Sikap",
      kualitas_laporan: "Kualitas Laporan",
      catatan: "Catatan",
    };

    const pengujiLabels = {
      penguasaan_keilmuan: "Penguasaan Materi",
      kemampuan_presentasi: "Teknik Presentasi",
      kesesuaian_urgensi: "Kesesuaian Laporan dan Presentasi",
      catatan: "Catatan",
    };

    const renderKomponenGrid = (
      komponenData: { [key: string]: string | number | undefined },
      labels: { [key: string]: string }
    ): ReactNode => {
      const regularComponents = Object.entries(komponenData)
        .filter(
          ([key]) => key !== "masukan" && key !== "catatan" && key !== "id"
        )
        .map(([key, value]) => ({ key, value }));
      const noteComponent = Object.entries(komponenData)
        .filter(([key]) => key === "masukan" || key === "catatan")
        .map(([key, value]) => ({ key, value }))[0];

      return (
        <div className="space-y-2">
          {regularComponents.map(({ key, value }) => (
            <div
              key={key}
              className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {labels[key] ||
                  key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </span>
              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {value || 0}
              </span>
            </div>
          ))}
          {noteComponent && (
            <div
              key={noteComponent.key}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3"
            >
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                {labels[noteComponent.key] ||
                  noteComponent.key.charAt(0).toUpperCase() +
                    noteComponent.key.slice(1).replace(/_/g, " ")}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {noteComponent.value ||
                  "Tidak ada " +
                    (noteComponent.key === "masukan" ? "masukan" : "catatan")}
              </div>
            </div>
          )}
        </div>
      );
    };

    const judulItem = displayItems.includes("judul") ? "judul" : null;
    const nilaiItem = displayItems.includes("nilai") ? "nilai" : null;
    const otherItems = displayItems.filter(
      (item) => item !== "judul" && item !== "nilai"
    );

    if (!data || Object.keys(data).length === 0) {
      return <div>Data tidak ada</div>;
    }

    return (
      <>
        <div
          className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-none rounded-lg p-4 ${className}`}
        >
          <div className="flex flex-col md:flex-row gap-4">
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
                        : "-"}{" "}
                      <span className="text-[1.35rem]">
                        ({data.nilai_huruf})
                      </span>
                    </p>
                    <div className="mt-3 text-left text-xs text-emerald-600 dark:text-emerald-300 w-full">
                      <p className="flex justify-between items-center gap-2">
                        <span className="font-medium">
                          Nilai Instansi (40%)
                        </span>
                        <span className="inline-flex items-center justify-end px-2 py-0.5 text-emerald-600 dark:text-emerald-300 text-xs font-medium">
                          {data.nilai_instansi || "-"}
                        </span>
                      </p>
                      <hr className="my-2 border-emerald-200 dark:border-emerald-700" />
                      <p className="flex justify-between items-center gap-2">
                        <span className="font-medium">Nilai Penguji (40%)</span>
                        <span className="inline-flex items-center justify-end px-2 py-0.5 text-emerald-600 dark:text-emerald-300 text-xs font-medium">
                          {data.nilai_penguji || "-"}
                        </span>
                      </p>
                      <hr className="my-2 border-emerald-200 dark:border-emerald-700" />
                      <p className="flex justify-between items-center gap-2">
                        <span className="font-medium">
                          Nilai Pembimbing (20%)
                        </span>
                        <span className="inline-flex items-center justify-end px-2 py-0.5 text-emerald-600 dark:text-emerald-300 text-xs font-medium">
                          {data.nilai_pembimbing || "-"}
                        </span>
                      </p>
                    </div>
                    <button
                      className="flex active:scale-95 gap-1 justify-center items-center mt-4 bg-gradient-to-r from-violet-700/85 via-orange-700/85 to-pink-700/85 dark:from-violet-700 dark:via-orange-700 dark:to-pink-700 text-white px-4 py-2 rounded-md hover:bg-gradient-to-br transition-colors text-xs font-medium w-full"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Detail Nilai KP Kamu</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 md:w-4/5">
              {judulItem && (
                <div className="mb-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-md px-3 py-7 w-full">
                  <div className="flex items-center">
                    {iconMap[judulItem]}
                    <h3 className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                      {titleMap[judulItem]}
                    </h3>
                  </div>
                  <p className="pl-6 text-base font-medium text-gray-800 dark:text-gray-200 break-words mt-1">
                    {typeof data[judulItem] === "string"
                      ? data[judulItem]
                      : "Belum diisi"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {otherItems.map((key) => {
                  const icon = iconMap[key] || (
                    <Info className="size-4 text-emerald-500 dark:text-emerald-400" />
                  );
                  const title = titleMap[key] || key;

                  return (
                    <div
                      key={key}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-md px-3 py-4"
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[100vh] overflow-hidden flex flex-col p-0 rounded-xl bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-10">
              <div className="w-full space-y-3">
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4">
                    <div className="text-center">
                      <div className="text-xs font-medium opacity-90 mb-1">
                        NILAI AKHIR
                      </div>
                      <div className="text-2xl font-bold mb-0.5">
                        {data.nilai ? Number(data.nilai).toFixed(2) : "0.0"} (
                        {data.nilai_huruf || "N/A"})
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Nilai Pembimbing Instansi Card */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 text-center">
                          <h3 className="font-semibold text-xs">
                            Pembimbing Instansi
                          </h3>
                        </div>
                        <div className="p-4 text-center">
                          {data.nilai_instansi !== "-" ? (
                            <>
                              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                {data.nilai_instansi}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                ✓ Sudah Dinilai
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                                Belum Dinilai
                              </div>
                              <div className="text-xs text-red-500 dark:text-red-400">
                                Menunggu Penilaian
                              </div>
                            </>
                          )}
                        </div>
                        {data.scoreDetails?.komponen_penilaian_instansi && (
                          <div className="px-3 pb-3">
                            {renderKomponenGrid(
                              data.scoreDetails.komponen_penilaian_instansi,
                              instansiLabels
                            )}
                          </div>
                        )}
                      </div>

                      {/* Nilai Dosen Pembimbing Card */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 text-center">
                          <h3 className="font-semibold text-xs">
                            Dosen Pembimbing
                          </h3>
                        </div>
                        <div className="p-4 text-center">
                          {data.nilai_pembimbing !== "-" ? (
                            <>
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                {data.nilai_pembimbing}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                ✓ Sudah Dinilai
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                                Belum Dinilai
                              </div>
                              <div className="text-xs text-red-500 dark:text-red-400">
                                Menunggu Penilaian
                              </div>
                            </>
                          )}
                        </div>
                        {data.scoreDetails?.komponen_penilaian_pembimbing && (
                          <div className="px-3 pb-3">
                            {renderKomponenGrid(
                              data.scoreDetails.komponen_penilaian_pembimbing,
                              pembimbingLabels
                            )}
                          </div>
                        )}
                      </div>

                      {/* Nilai Dosen Penguji Card */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 text-center">
                          <h3 className="font-semibold text-xs">
                            Dosen Penguji
                          </h3>
                        </div>
                        <div className="p-4 text-center">
                          {data.nilai_penguji !== "-" ? (
                            <>
                              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                {data.nilai_penguji}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                ✓ Sudah Dinilai
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="text-lg font-bold text-red-500 dark:text-red-400 mb-1">
                                Belum Dinilai
                              </div>
                              <div className="text-xs text-red-500 dark:text-red-400">
                                Menunggu Penilaian
                              </div>
                            </>
                          )}
                        </div>
                        {data.scoreDetails?.komponen_penilaian_penguji && (
                          <div className="px-3 pb-3">
                            {renderKomponenGrid(
                              data.scoreDetails.komponen_penilaian_penguji,
                              pengujiLabels
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
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
  const informasiSeminarFields = [
    "judul",
    "nilai",
    "lokasi",
    "lamaKerjaPraktik",
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

  const status = apiData?.data?.nilai[0]?.validasi_nilai?.is_approve ? "validasi" : "belum";

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
        lamaKerjaPraktik: (() => {
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
          : "-",
        nilai_instansi: apiData.data.nilai[0]?.nilai_instansi
          ? String(apiData.data.nilai[0].nilai_instansi)
          : "-",
        nilai_pembimbing: apiData.data.nilai[0]?.nilai_pembimbing
          ? String(apiData.data.nilai[0].nilai_pembimbing)
          : "-",
        nilai_huruf: apiData.data.nilai[0]?.nilai_huruf
          ? String(apiData.data.nilai[0].nilai_huruf)
          : "-",
        scoreDetails: {
          komponen_penilaian_pembimbing:
            apiData.data.nilai[0]?.komponen_penilaian_pembimbing,
          komponen_penilaian_penguji:
            apiData.data.nilai[0]?.komponen_penilaian_penguji,
          komponen_penilaian_instansi:
            apiData.data.nilai[0]?.komponen_penilaian_instansi,
        },
      }
    : {};

  const fadeInAnimation = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.1 },
  };

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
          <motion.div
            className="relative overflow-hidden bg-white dark:bg-black rounded-xl shadow-sm dark:shadow-xl text-gray-800 dark:text-white py-8 px-6 border border-gray-100 dark:border-none"
            {...fadeInAnimation}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 dark:from-purple-600/20 dark:via-transparent via-transparent to-purple-100/60 dark:to-blue-600/20"></div>
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
            <div className="bg-blue-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-blue-100 dark:border-transparent">
              <p className="text-center text-xs font-medium text-gray-700 dark:text-white/80">
                Silakan Cek Berkala Untuk Progress Nilai Anda
              </p>
            </div>
          </motion.div>
        </div>

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
