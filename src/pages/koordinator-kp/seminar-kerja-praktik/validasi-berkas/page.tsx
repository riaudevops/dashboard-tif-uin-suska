import { useState, useMemo, useEffect, type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Search,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  CalendarCheck2Icon,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ValidasiPendaftaranModal from "@/components/koordinator-kp/seminar/validasi-pendaftaran-modal";
import ValidasiIdModal from "@/components/koordinator-kp/seminar/validasi-id-modal";
import ValidasiSuratUndanganModal from "@/components/koordinator-kp/seminar/validasi-suratUndangan-modal";
import ValidasipascaSeminarModal from "@/components/koordinator-kp/seminar/validasi-pascaSeminar-modal";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

// Type definitions
type Stage = "pendaftaran" | "idSurat" | "suratUndangan" | "pascaSeminar";
type Status = "Baru" | "Lanjut";

interface Dosen {
  nip: string;
  nama: string;
}

interface Instansi {
  pembimbing_instansi: { nama: string }[];
}

interface PendaftaranKP {
  id: string;
  status: Status;
  dosen_pembimbing: Dosen;
  dosen_penguji: Dosen;
  tahun_ajaran: string | null;
  instansi: Instansi;
}

interface Dokumen {
  id: string;
  jenis_dokumen: string;
  link_path: string;
  tanggal_upload: string;
  status: string;
  komentar: string | null;
  id_pendaftaran_kp: string;
}

interface DokumenStep {
  step1: Dokumen[];
  step2: Dokumen[];
  step3: Dokumen[];
  step5: Dokumen[];
}

interface MahasiswaDetail {
  nim: string;
  nama: string;
  email: string;
  pendaftaran_kp: PendaftaranKP[];
  nilai: any[];
  semester: number;
  dokumen: DokumenStep;
}

interface Student {
  id: number;
  nim: string;
  name: string;
  status: string;
  timeAgo: string;
  stage: Stage;
  semester: number;
  dosenPembimbing: string;
  dosenPenguji: string;
  pembimbingInstansi: string;
  nilaiInstansi: string;
  dokumen: DokumenStep;
  step_sekarang: number;
  last_status: string;
  id_pendaftaran_kp?: string;
}

interface MahasiswaResponse {
  nim: string;
  nama: string;
  email: string;
  step_sekarang: number;
  last_status: string;
  last_submission: string;
  dokumen?: DokumenStep;
  pendaftaran_kp?: PendaftaranKP[];
}

interface StatisticsResponse {
  total_mahasiswa: number;
  status: {
    terkirim: number;
    divalidasi: number;
    ditolak: number;
  };
  step: {
    step1: number;
    step2: number;
    step3: number;
    step4: number;
    step5: number;
  };
}

interface TahunAjaran {
  id: number;
  nama: string;
}

interface ApiResponse {
  response: boolean;
  message: string;
  data: {
    statistics: StatisticsResponse;
    mahasiswa: MahasiswaResponse[];
    tahun_ajaran: TahunAjaran;
  };
}

interface MahasiswaDetailResponse {
  response: boolean;
  message: string;
  data: MahasiswaDetail;
}

// Badge variants and colors
const stageBadgeConfig: Record<
  Stage,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    darkBgColor: string;
    darkTextColor: string;
    darkBorderColor: string;
  }
> = {
  pendaftaran: {
    label: "Pendaftaran",
    bgColor: "bg-blue-100/70",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
    darkBorderColor: "dark:border-blue-800",
  },
  idSurat: {
    label: "ID Surat",
    bgColor: "bg-purple-100/70",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
    darkBorderColor: "dark:border-purple-800",
  },
  suratUndangan: {
    label: "Surat Undangan",
    bgColor: "bg-emerald-100/70",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    darkBorderColor: "dark:border-emerald-800",
  },
  pascaSeminar: {
    label: "Pasca Seminar",
    bgColor: "bg-amber-100/70",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    darkBgColor: "dark:bg-amber-900/30",
    darkTextColor: "dark:text-amber-300",
    darkBorderColor: "dark:border-amber-800",
  },
};

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
};

const mapStepToStage = (step: number): Stage => {
  switch (step) {
    case 1:
      return "pendaftaran";
    case 2:
      return "idSurat";
    case 3:
      return "suratUndangan";
    case 5:
      return "pascaSeminar";
    default:
      return "pascaSeminar";
  }
};

const emptyDokumenStep: DokumenStep = {
  step1: [],
  step2: [],
  step3: [],
  step5: [],
};

const KoordinatorValidasiBerkasPage: FC = () => {
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<
    number | null
  >(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Stage>("pendaftaran");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedNim, setSelectedNim] = useState<string | null>(null);
  const [isValidatedStudentModal, setIsValidatedStudentModal] =
    useState<boolean>(false);

  // Fetch daftar tahun ajaran
  const {
    data: tahunAjaranData,
    isLoading: isTahunAjaranLoading,
    isError: isTahunAjaranError,
    error: tahunAjaranError,
  } = useQuery<TahunAjaran[]>({
    queryKey: ["tahun-ajaran"],
    queryFn: APISeminarKP.getTahunAjaran,
  });

  // Fetch data mahasiswa berdasarkan tahun ajaran yang dipilih
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["koordinator-seminar-kp-dokumen", selectedTahunAjaranId],
    queryFn: () =>
      APISeminarKP.getDataMahasiswa(selectedTahunAjaranId ?? undefined),
    enabled: selectedTahunAjaranId !== null,
  });

  const { data: detailData, isLoading: isDetailLoading } =
    useQuery<MahasiswaDetailResponse>({
      queryKey: ["koordinator-seminar-kp-detail", selectedNim],
      queryFn: () => APISeminarKP.getDataMahasiswaByNIM(selectedNim!),
      enabled: !!selectedNim,
    });

  // Set tahun ajaran default ke yang pertama dari API saat data tersedia
  useEffect(() => {
    if (
      tahunAjaranData &&
      tahunAjaranData.length > 0 &&
      selectedTahunAjaranId === null
    ) {
      setSelectedTahunAjaranId(tahunAjaranData[0].id);
    }
  }, [tahunAjaranData, selectedTahunAjaranId]);

  // Sinkronisasi tahun ajaran dengan respons API dari getDataMahasiswa
  useEffect(() => {
    if (
      data?.data?.tahun_ajaran?.id &&
      data.data.tahun_ajaran.id !== selectedTahunAjaranId &&
      tahunAjaranData?.some((tahun) => tahun.id === data.data.tahun_ajaran.id)
    ) {
      setSelectedTahunAjaranId(data.data.tahun_ajaran.id);
    }
  }, [data, tahunAjaranData, selectedTahunAjaranId]);

  const { students, totalMahasiswa, validasiDitolak, validasiSelesai } =
    useMemo(() => {
      if (!data?.data || !data.data.mahasiswa || !data.data.statistics) {
        return {
          students: [],
          totalMahasiswa: 0,
          validasiDitolak: 0,
          validasiSelesai: 0,
        };
      }

      const students: Student[] = data.data.mahasiswa.map((mhs, index) => {
        const pendaftaranKpId = mhs.pendaftaran_kp?.[0]?.id || "";
        return {
          id: index + 1,
          nim: mhs.nim,
          name: mhs.nama,
          status: mhs.last_status || "",
          timeAgo: mhs.last_submission,
          stage: mapStepToStage(mhs.step_sekarang),
          semester: 6,
          dosenPembimbing: "Tidak tersedia",
          dosenPenguji: "Tidak tersedia",
          pembimbingInstansi: "Tidak tersedia",
          nilaiInstansi: "Tidak tersedia",
          dokumen: mhs.dokumen || emptyDokumenStep,
          step_sekarang: mhs.step_sekarang,
          last_status: mhs.last_status || "",
          id_pendaftaran_kp: pendaftaranKpId,
        };
      });

      const totalMahasiswa = data.data.statistics.total_mahasiswa || 0;
      const validasiDitolak = data.data.statistics.status.ditolak || 0;
      const validasiSelesai = data.data.statistics.status.divalidasi || 0;

      return { students, totalMahasiswa, validasiDitolak, validasiSelesai };
    }, [data]);

  const detailedStudent: Student | null = useMemo(() => {
    if (!detailData?.data || !selectedStudent) return null;

    const pendaftaran = detailData.data.pendaftaran_kp?.[0];
    const pembimbingInstansi =
      pendaftaran?.instansi?.pembimbing_instansi?.[0]?.nama || "Tidak tersedia";

    // Define nilaiInstansi here, adjust the logic as needed
    const nilaiInstansi =
      (detailData.data.nilai && detailData.data.nilai.length > 0
        ? detailData.data.nilai[0]?.nilai_instansi
        : undefined) || "Tidak tersedia";

    return {
      ...selectedStudent,
      status: pendaftaran?.status || "",
      semester: detailData.data.semester ?? 0,
      dosenPembimbing: pendaftaran?.dosen_pembimbing?.nama || "Tidak tersedia",
      dosenPenguji: pendaftaran?.dosen_penguji?.nama || "Tidak tersedia",
      pembimbingInstansi,
      nilaiInstansi: nilaiInstansi || "Tidak tersedia",
      dokumen: detailData.data.dokumen || emptyDokumenStep,
      id_pendaftaran_kp: pendaftaran?.id || "",
    };
  }, [detailData, selectedStudent]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nim.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = student.stage === activeTab;
      const isPending = ["Terkirim", "Ditolak"].includes(student.last_status);

      return matchesSearch && matchesTab && isPending;
    });
  }, [students, searchQuery, activeTab]);

  const validatedStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesTab = student.stage === activeTab;
      const isValidated = student.last_status === "Divalidasi";

      return matchesTab && isValidated;
    });
  }, [students, activeTab]);

  const handleOpenDialog = (student: Student) => {
    setSelectedStudent(student);
    setSelectedNim(student.nim);
    setIsValidatedStudentModal(false);
    setIsDialogOpen(true);
  };

  const handleOpenDialogRiwayat = (student: Student) => {
    setSelectedStudent(student);
    setSelectedNim(student.nim);
    setIsValidatedStudentModal(true);
    setIsDialogOpen(true);
  };

  const renderModal = () => {
    if (isDetailLoading) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      );
    }
    if (!detailedStudent) return null;

    const modalStage = isValidatedStudentModal
      ? activeTab
      : detailedStudent.stage;

    switch (modalStage) {
      case "pendaftaran":
        return (
          <ValidasiPendaftaranModal
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedNim(null);
              setIsValidatedStudentModal(false);
            }}
            student={detailedStudent}
          />
        );
      case "idSurat":
        return (
          <ValidasiIdModal
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedNim(null);
              setIsValidatedStudentModal(false);
            }}
            student={detailedStudent}
          />
        );
      case "suratUndangan":
        return (
          <ValidasiSuratUndanganModal
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedNim(null);
              setIsValidatedStudentModal(false);
            }}
            student={detailedStudent}
          />
        );
      case "pascaSeminar":
        return (
          <ValidasipascaSeminarModal
            isOpen={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedNim(null);
              setIsValidatedStudentModal(false);
            }}
            student={detailedStudent}
          />
        );
      default:
        return null;
    }
  };

  const SkeletonCard: FC = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border-none shadow-md rounded-lg p-4 animate-pulse"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  };

  const SkeletonTable: FC = () => {
    return (
      <div className="bg-white dark:bg-gray-900 shadow-none rounded-none animate-pulse">
        <Table>
          <TableHeader className="bg-gray-200 dark:bg-gray-700">
            <TableRow>
              <TableHead className="text-center">
                <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
              <TableHead className="text-center">
                <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
              <TableHead className="text-center">
                <div className="h-4 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
              <TableHead className="text-center">
                <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
              <TableHead className="text-center">
                <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
              <TableHead className="text-center">
                <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="dark:border-gray-700">
                <TableCell className="text-center">
                  <div className="h-4 w-8 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-20 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-4 w-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-6 w-16 mx-auto bg-gray-200 dark:bg-gray-700 rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (isTahunAjaranError) {
    toast.error(
      `Gagal mengambil daftar tahun ajaran: ${
        (tahunAjaranError as Error).message
      }`,
      {
        duration: 3000,
      }
    );
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat daftar tahun ajaran. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    toast.error(`Gagal mengambil data mahasiswa: ${(error as Error).message}`, {
      duration: 3000,
    });
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat data mahasiswa. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between">
              <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
                <span className="inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400" />
                <CalendarCheck2Icon className="w-4 h-4 mr-1.5" />
                Validasi Permohonan Seminar KP Mahasiswa
              </span>
              {/* Dropdown Tahun Ajaran */}
              <div className="flex items-center gap-2 dark:text-gray-200">
                <div className="relative">
                  <select
                    className="px-3 py-1 pr-8 text-sm bg-white border focus:outline-none active:outline-none rounded-lg shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0 disabled:opacity-50"
                    value={selectedTahunAjaranId ?? ""}
                    onChange={(e) =>
                      setSelectedTahunAjaranId(Number(e.target.value))
                    }
                    disabled={isTahunAjaranLoading || !tahunAjaranData}
                  >
                    {isTahunAjaranLoading ? (
                      <option value="">Memuat tahun ajaran...</option>
                    ) : tahunAjaranData && tahunAjaranData.length > 0 ? (
                      tahunAjaranData.map((year) => (
                        <option key={year.id} value={year.id}>
                          {year.nama}
                        </option>
                      ))
                    ) : (
                      <option value="">Tidak ada tahun ajaran tersedia</option>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLoading || isTahunAjaranLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Permohonan Validasi
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-blue-200 p-1.5 rounded-full dark:bg-blue-800"
                    >
                      <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-2xl font-bold text-blue-800 dark:text-white"
                    >
                      {totalMahasiswa ?? 0}
                    </motion.div>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">
                      Mahasiswa
                    </p>
                    <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-2">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: totalMahasiswa > 0 ? "100%" : "0%",
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-1.5 bg-blue-500 rounded-full"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
                      Validasi Ditolak
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-red-200 p-1.5 rounded-full dark:bg-red-800"
                    >
                      <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-2xl font-bold text-red-800 dark:text-white"
                    >
                      {validasiDitolak ?? 0}
                    </motion.div>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">
                      Mahasiswa
                    </p>
                    <div className="h-1.5 w-full bg-red-100 dark:bg-red-900 rounded-full mt-2">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: totalMahasiswa
                            ? `${(validasiDitolak / totalMahasiswa) * 100}%`
                            : "0%",
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-1.5 bg-red-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
                      Validasi Selesai
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-green-200 p-1.5 rounded-full dark:bg-green-800"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-2xl font-bold text-green-800 dark:text-white"
                    >
                      {validasiSelesai ?? 0}
                    </motion.div>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-0.5">
                      Mahasiswa
                    </p>
                    <div className="h-1.5 w-full bg-green-100 dark:bg-green-900 rounded-full mt-2">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: totalMahasiswa
                            ? `${(validasiSelesai / totalMahasiswa) * 100}%`
                            : "0%",
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-1.5 bg-green-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs
              defaultValue="pendaftaran"
              onValueChange={(value) => setActiveTab(value as Stage)}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
                <TabsList className="dark:bg-gray-700">
                  <TabsTrigger
                    value="pendaftaran"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Pendaftaran
                  </TabsTrigger>
                  <TabsTrigger
                    value="idSurat"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    ID Surat Undangan
                  </TabsTrigger>
                  <TabsTrigger
                    value="suratUndangan"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Surat Undangan
                  </TabsTrigger>
                  <TabsTrigger
                    value="pascaSeminar"
                    className="dark:data-[state=active]:bg-gray-800"
                  >
                    Pasca Seminar
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center w-full relative">
                  <Search className="h-4 w-4 absolute left-3 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              {["pendaftaran", "idSurat", "suratUndangan", "pascaSeminar"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    {isLoading || isTahunAjaranLoading ? (
                      <SkeletonTable />
                    ) : (
                      <StudentTable
                        students={filteredStudents}
                        validatedStudents={validatedStudents}
                        onViewDetail={handleOpenDialog}
                        onViewDetailRiwayat={handleOpenDialogRiwayat}
                        activeTab={activeTab}
                      />
                    )}
                  </TabsContent>
                )
              )}
            </Tabs>
          </div>
        </div>
      </div>

      {renderModal()}
    </DashboardLayout>
  );
};

const StudentTable: FC<{
  students: Student[];
  validatedStudents: Student[];
  onViewDetail: (student: Student) => void;
  onViewDetailRiwayat: (student: Student) => void;
  activeTab: Stage;
}> = ({
  students = [],
  validatedStudents = [],
  onViewDetail,
  onViewDetailRiwayat,
  activeTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Main Table */}
      <Card className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700">
        <Table>
          <TableHeader className="bg-gray-200 dark:bg-gray-700">
            <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
              <TableHead className="text-center max-w-4 font-semibold dark:text-gray-200">
                No.
              </TableHead>
              <TableHead className="text-center font-semibold dark:text-gray-200">
                Nama Mahasiswa
              </TableHead>
              <TableHead className="text-center font-semibold dark:text-gray-200">
                NIM
              </TableHead>
              <TableHead className="text-center font-semibold dark:text-gray-200">
                Tahap
              </TableHead>
              <TableHead className="text-center font-semibold dark:text-gray-200">
                Waktu Pengajuan
              </TableHead>
              <TableHead className="text-center font-semibold dark:text-gray-200">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow className="dark:border-gray-700 dark:hover:bg-gray-700">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground dark:text-gray-400"
                >
                  Tidak ada data yang ditemukan
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <TableCell className="text-center dark:text-gray-300 text-xs font-semibold">
                    {index + 1}.
                  </TableCell>
                  <TableCell className="dark:text-gray-300 text-xs text-center">
                    {student.name}
                  </TableCell>
                  <TableCell className="font-medium text-center dark:text-gray-300 text-xs">
                    {student.nim}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stageBadgeConfig[student.stage].bgColor
                      } ${stageBadgeConfig[student.stage].textColor} ${
                        stageBadgeConfig[student.stage].darkBgColor
                      } ${stageBadgeConfig[student.stage].darkTextColor}`}
                    >
                      {stageBadgeConfig[student.stage].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground dark:text-gray-400">
                    {student.timeAgo}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mx-auto dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                      onClick={() => onViewDetail(student)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Validated Table - Conditionally Rendered */}
      {validatedStudents.length > 0 && (
        <div className="shadow-none rounded-none dark:bg-gray-950 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Tervalidasi
          </h2>
          <Table>
            <TableBody className="border">
              {validatedStudents.map((student, index) => (
                <TableRow
                  key={student.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <TableCell className="text-center dark:text-gray-300 text-xs font-semibold">
                    {index + 1}.
                  </TableCell>
                  <TableCell className="dark:text-gray-300 text-xs text-center">
                    {student.name}
                  </TableCell>
                  <TableCell className="font-medium text-center dark:text-gray-300 text-xs">
                    {student.nim}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${stageBadgeConfig[activeTab].bgColor} ${stageBadgeConfig[activeTab].textColor} ${stageBadgeConfig[activeTab].darkBgColor} ${stageBadgeConfig[activeTab].darkTextColor}`}
                    >
                      {stageBadgeConfig[activeTab].label}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-xs text-muted-foreground dark:text-gray-400">
                    {student.timeAgo}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white mx-auto dark:from-emerald-600 dark:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 border-0 transition-all flex items-center gap-1.5 py-1 rounded-md text-xs"
                      onClick={() => onViewDetailRiwayat(student)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Detail</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default KoordinatorValidasiBerkasPage;
