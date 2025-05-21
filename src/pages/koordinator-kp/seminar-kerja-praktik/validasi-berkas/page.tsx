import { useState, type FC, useMemo, useEffect } from "react"; // Added useEffect
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { Search, Eye, Users, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
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
import { Badge } from "@/components/ui/badge";
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

interface ApiResponse {
  response: boolean;
  message: string;
  data: {
    statistics: StatisticsResponse;
    mahasiswa: MahasiswaResponse[];
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

const mapStageToStep = (stage: Stage): number => {
  switch (stage) {
    case "pendaftaran":
      return 1;
    case "idSurat":
      return 2;
    case "suratUndangan":
      return 3;
    case "pascaSeminar":
      return 5;
    default:
      return 1;
  }
};

const emptyDokumenStep: DokumenStep = {
  step1: [],
  step2: [],
  step3: [],
  step5: [],
};

const KoordinatorValidasiBerkasPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Stage>("pendaftaran");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedNim, setSelectedNim] = useState<string | null>(null);
  const [isValidatedStudentModal, setIsValidatedStudentModal] =
    useState<boolean>(false);

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["koordinator-seminar-kp-dokumen"],
    queryFn: APISeminarKP.getDataMahasiswa,
  });

  const {
    data: detailData,
    isLoading: isDetailLoading,
    isSuccess,
  } = useQuery<MahasiswaDetailResponse>({
    queryKey: ["koordinator-seminar-kp-detail", selectedNim],
    queryFn: () => APISeminarKP.getDataMahasiswaByEmail(selectedNim!),
    enabled: !!selectedNim,
  });

  // Moved onSuccess logic to useEffect
  useEffect(() => {
    if (isSuccess && detailData) {
      console.log("Detail Data:", detailData);
    }
  }, [isSuccess, detailData]);

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

    return {
      ...selectedStudent,
      status: pendaftaran?.status || "",
      semester: detailData.data.semester ?? 0,
      dosenPembimbing: pendaftaran?.dosen_pembimbing?.nama || "Tidak tersedia",
      dosenPenguji: pendaftaran?.dosen_penguji?.nama || "Tidak tersedia",
      pembimbingInstansi,
      nilaiInstansi: "Tidak tersedia",
      dokumen: detailData.data.dokumen || emptyDokumenStep,
      id_pendaftaran_kp: pendaftaran?.id || "",
    };
  }, [detailData, selectedStudent]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
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

  if (isError) {
    toast({
      title: "❌ Gagal",
      description: `Gagal mengambil data: ${(error as Error).message}`,
      duration: 3000,
    });
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat data. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
              Validasi Permohonan Seminar KP Mahasiswa
            </h1>
            <div>
              <span className="mr-2 text-gray-600 dark:text-gray-300">
                Tahun Ajaran
              </span>
              <Badge
                variant="outline"
                className="bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
              >
                2023-2024 Ganjil
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">
              Memuat statistik...
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-blue-800 dark:text-blue-300">
                      Permohonan Validasi
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-blue-200 p-2 rounded-full dark:bg-blue-800"
                    >
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-5xl font-bold text-blue-800 dark:text-white"
                    >
                      {totalMahasiswa ?? 0}
                    </motion.div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Mahasiswa
                    </p>
                    <div className="h-2 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-3">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-2 bg-blue-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-red-800 dark:text-red-300">
                      Validasi Ditolak
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-red-200 p-2 rounded-full dark:bg-red-800"
                    >
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-5xl font-bold text-red-800 dark:text-white"
                    >
                      {validasiDitolak ?? 0}
                    </motion.div>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      Mahasiswa
                    </p>
                    <div className="h-2 w-full bg-red-100 dark:bg-red-900 rounded-full mt-3">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: totalMahasiswa
                            ? `${(validasiDitolak / totalMahasiswa) * 100}%`
                            : "0%",
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-2 bg-red-500 rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950 dark:to-gray-900">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-green-800 dark:text-green-300">
                      Validasi Selesai
                    </CardTitle>
                    <motion.div
                      whileHover={{ rotate: 15 }}
                      className="bg-green-200 p-2 rounded-full dark:bg-green-800"
                    >
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="text-5xl font-bold text-green-800 dark:text-white"
                    >
                      {validasiSelesai ?? 0}
                    </motion.div>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      Mahasiswa
                    </p>
                    <div className="h-2 w-full bg-green-100 dark:bg-green-900 rounded-full mt-3">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: totalMahasiswa
                            ? `${(validasiSelesai / totalMahasiswa) * 100}%`
                            : "0%",
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-2 bg-green-500 rounded-full"
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
                    Id Surat Undangan
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
                    placeholder="Cari nama mahasiswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder:text-gray-400"
                  />
                </div>
              </div>

              {["pendaftaran", "idSurat", "suratUndangan", "pascaSeminar"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab} className="mt-4">
                    <StudentTable
                      students={filteredStudents}
                      validatedStudents={validatedStudents}
                      onViewDetail={handleOpenDialog}
                      onViewDetailRiwayat={handleOpenDialogRiwayat}
                      activeTab={activeTab}
                    />
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
              <TableHead className="w-12 text-center font-semibold dark:text-gray-200">
                No
              </TableHead>
              <TableHead className="font-semibold dark:text-gray-200">
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
              students.map((student) => (
                <TableRow
                  key={student.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium text-center dark:text-gray-300">
                    {student.id}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {student.name}
                  </TableCell>
                  <TableCell className="font-medium text-center dark:text-gray-300">
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

      {/* Validated Table */}
      <div className="shadow-none rounded-none dark:bg-gray-950 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Tervalidasi
        </h2>
        <Table>
          <TableBody className="border">
            {validatedStudents.length === 0 ? (
              <TableRow className="dark:border-gray-700 dark:hover:bg-gray-700">
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground dark:text-gray-400"
                >
                  Belum ada data tervalidasi
                </TableCell>
              </TableRow>
            ) : (
              validatedStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <TableCell className="font-medium text-center dark:text-gray-300">
                    {student.id}
                  </TableCell>
                  <TableCell className="dark:text-gray-300">
                    {student.name}
                  </TableCell>
                  <TableCell className="font-medium text-center dark:text-gray-300">
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default KoordinatorValidasiBerkasPage;
