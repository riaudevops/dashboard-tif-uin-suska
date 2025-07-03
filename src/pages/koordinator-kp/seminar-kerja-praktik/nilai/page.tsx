import { useState, useEffect, type FC } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import {
  Search,
  Eye,
  Users,
  Check,
  CheckCircle,
  AlertCircle,
  CalendarCheck2Icon,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailNilaiModal from "@/components/koordinator-kp/seminar/detail-nilai-modal";
import { motion } from "framer-motion";
import APISeminarKP from "@/services/api/koordinator-kp/mahasiswa.service";

type NilaiStatus = "nilaiBelumValid" | "nilaiValid" | "nilaiApprove";
type StatusDaftarKP = "Baru" | "Lanjut" | "Selesai";

interface Mahasiswa {
  nim: string;
  nama: string;
  kelas: string;
  status_daftar_kp: StatusDaftarKP;
  status_nilai: string;
  semester: string;
  instansi: string;
  pembimbing_instansi: string;
  dosen_pembimbing: string;
  dosen_penguji: string;
  id_nilai?: string;
  nilai_instansi?: number;
  nilai_pembimbing?: number;
  nilai_penguji?: number;
  nilai_akhir?: number;
  nilai_huruf?: string;
  validasi_nilai_is_approve?: boolean;
}

interface NilaiResponse {
  tahunAjaran: {
    id: number;
    nama: string;
  };
  jumlahNilaiBelumValid: number;
  jumlahNilaiValid: number;
  jumlahNilaiApprove: number;
  detailMahasiswa: Mahasiswa[];
}

interface TahunAjaran {
  id: number;
  nama: string;
}

const nilaiStatusBadgeConfig: Record<
  NilaiStatus,
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
  nilaiBelumValid: {
    label: "Nilai Belum Valid",
    bgColor: "bg-blue-100/70",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkBgColor: "dark:bg-blue-900/30",
    darkTextColor: "dark:text-blue-300",
    darkBorderColor: "dark:border-blue-800",
  },
  nilaiValid: {
    label: "Nilai Valid",
    bgColor: "bg-purple-100/70",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkBgColor: "dark:bg-purple-900/30",
    darkTextColor: "dark:text-purple-300",
    darkBorderColor: "dark:border-purple-800",
  },
  nilaiApprove: {
    label: "Nilai Approve",
    bgColor: "bg-emerald-100/70",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkBgColor: "dark:bg-emerald-900/30",
    darkTextColor: "dark:text-emerald-300",
    darkBorderColor: "dark:border-emerald-800",
  },
};

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

// Skeleton Components
const SkeletonCard: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3" aria-busy="true">
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

const SkeletonFilter: FC = () => {
  return (
    <div
      className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 w-full animate-pulse"
      aria-busy="true"
    >
      <div className="flex items-center gap-2">
        <div className="h-9 w-[180px] bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
      <div className="flex items-center w-full gap-2 relative">
        <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
    </div>
  );
};

const SkeletonRadioGroup: FC = () => {
  return (
    <div className="flex flex-wrap gap-4 py-2 animate-pulse" aria-busy="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};

const SkeletonTable: FC = () => {
  return (
    <div
      className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700 border border-gray-200 animate-pulse"
      aria-busy="true"
    >
      <Table>
        <TableHeader className="bg-gray-200 dark:bg-gray-700">
          <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
            <TableHead className="w-12 text-center">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center max-w-4">
              <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow
              key={index}
              className="dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <TableCell className="text-center">
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const KoordinatorNilaiPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"semua" | NilaiStatus>(
    "semua"
  );
  const [selectedTahunAjaranId, setSelectedTahunAjaranId] = useState<
    number | undefined
  >(undefined);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Mahasiswa | null>(
    null
  );
  const [selectedKelas, setSelectedKelas] = useState<string>("semua");

  const queryClient = useQueryClient();

  const {
    data: tahunAjaranData,
    isLoading: isTahunAjaranLoading,
    isError: isTahunAjaranError,
  } = useQuery<TahunAjaran[]>({
    queryKey: ["tahun-ajaran"],
    queryFn: APISeminarKP.getTahunAjaran,
  });

  const { data, isLoading, isError, error } = useQuery<NilaiResponse>({
    queryKey: ["koordinator-nilai", selectedTahunAjaranId],
    queryFn: () => APISeminarKP.getNilai(selectedTahunAjaranId),
    enabled: selectedTahunAjaranId !== undefined,
  });

  const validateMutation = useMutation({
    mutationFn: (idNilai: string) => APISeminarKP.validasiNilai({ idNilai }),
    onSuccess: () => {
      // No toast here, handled in handleConfirmValidate
    },
    onError: (error: any) => {
      toast.error(
        `Gagal memvalidasi nilai: ${error.message || "Terjadi kesalahan"}`,
        {
          duration: 4000,
        }
      );
    },
  });

  useEffect(() => {
    if (
      tahunAjaranData &&
      tahunAjaranData.length > 0 &&
      selectedTahunAjaranId === undefined
    ) {
      setSelectedTahunAjaranId(tahunAjaranData[0].id);
    }
  }, [tahunAjaranData, selectedTahunAjaranId]);

  const uniqueKelas = Array.from(
    new Set(data?.detailMahasiswa.map((student) => student.kelas) || [])
  ).sort();

  const students: Mahasiswa[] =
    data?.detailMahasiswa.map((student) => ({
      nim: student.nim,
      nama: student.nama,
      kelas: student.kelas,
      status_daftar_kp: student.status_daftar_kp as StatusDaftarKP,
      status_nilai: student.status_nilai,
      semester: student.semester,
      instansi: student.instansi,
      pembimbing_instansi: student.pembimbing_instansi,
      dosen_pembimbing: student.dosen_pembimbing,
      dosen_penguji: student.dosen_penguji,
      id_nilai: student.id_nilai,
      nilai_instansi: student.nilai_instansi,
      nilai_pembimbing: student.nilai_pembimbing,
      nilai_penguji: student.nilai_penguji,
      nilai_akhir: student.nilai_akhir,
      nilai_huruf: student.nilai_huruf,
      validasi_nilai_is_approve: student.validasi_nilai_is_approve,
    })) || [];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nim.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "semua" ||
      (statusFilter === "nilaiBelumValid" &&
        student.status_nilai === "Nilai Belum Valid") ||
      (statusFilter === "nilaiValid" &&
        student.status_nilai === "Nilai Valid") ||
      (statusFilter === "nilaiApprove" &&
        student.status_nilai === "Nilai Approve");
    const matchesKelas =
      selectedKelas === "semua" || student.kelas === selectedKelas;
    return matchesSearch && matchesStatus && matchesKelas;
  });

  const totalStudents = students.length || 0;
  const belumValidCount = data?.jumlahNilaiBelumValid || 0;
  const validCount = data?.jumlahNilaiValid || 0;
  const approveCount = data?.jumlahNilaiApprove || 0;

  const handleOpenDialog = (student: Mahasiswa) => {
    const fullStudentData = data?.detailMahasiswa.find(
      (s) => s.nim === student.nim
    );
    setSelectedStudent(fullStudentData || student);
    setIsDialogOpen(true);
  };

  const handleCheckboxChange = (nim: string) => {
    setSelectedStudents((prev) =>
      prev.includes(nim) ? prev.filter((id) => id !== nim) : [...prev, nim]
    );
  };

  const handleValidate = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmValidate = async () => {
    const idNilaiList = students
      .filter((student) => selectedStudents.includes(student.nim))
      .map((student) => student.id_nilai)
      .filter((id): id is string => id !== undefined);

    try {
      await Promise.all(
        idNilaiList.map((idNilai) => validateMutation.mutateAsync(idNilai))
      );
      queryClient.invalidateQueries({
        queryKey: ["koordinator-nilai", selectedTahunAjaranId],
      });
      setSelectedStudents([]);
      setIsConfirmModalOpen(false);
      toast.success(`Berhasil memvalidasi ${idNilaiList.length} mahasiswa!`, {
        duration: 3000,
      });
    } catch (error) {
      // Error handling is managed in onError of useMutation
    }
  };

  const renderModal = () => {
    return (
      <DetailNilaiModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        student={selectedStudent}
      />
    );
  };

  const renderConfirmModal = () => {
    const selectedData = students.filter((student) =>
      selectedStudents.includes(student.nim)
    );

    const formatFinalGrade = (
      nilai_akhir: number | undefined,
      nilai_huruf: string | undefined
    ) => {
      if (!nilai_akhir) return "-";
      const formattedScore = parseFloat(String(nilai_akhir)).toFixed(2);
      const letterGrade = nilai_huruf ? ` (${nilai_huruf})` : "";
      return `${formattedScore}${letterGrade}`;
    };

    return (
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-3xl xl:max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6">
          <DialogHeader className="pb-4 border-b dark:border-gray-700">
            <DialogTitle className="text-lg font-semibold dark:text-gray-100 flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              Konfirmasi Nilai Mahasiswa
            </DialogTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Pastikan data sudah benar sebelum melakukan konfirmasi
            </p>
          </DialogHeader>

          <div className="py-4 h-[calc(90vh-200px)] flex flex-col gap-4 overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">
                    {selectedData.length}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-emerald-800 dark:text-emerald-200 text-sm sm:text-base">
                    {selectedData.length} Mahasiswa akan divalidasi
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                    Proses ini akan mengonfirmasi semua nilai yang telah diinput
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 border dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto max-h-full">
                <Table className="min-w-full">
                  <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
                    <TableRow className="border-b dark:border-gray-700">
                      <TableHead className="text-xs font-semibold dark:text-gray-200 py-2 px-2 sm:py-3 sm:px-4 text-left whitespace-nowrap">
                        Mahasiswa
                      </TableHead>
                      <TableHead className="text-xs font-semibold dark:text-gray-200 py-2 px-2 sm:py-3 sm:px-4 text-center whitespace-nowrap">
                        Kelas
                      </TableHead>
                      <TableHead className="text-xs font-semibold dark:text-gray-200 py-2 px-2 sm:py-3 sm:px-4 text-center whitespace-nowrap">
                        Instansi
                      </TableHead>
                      <TableHead className="text-xs font-semibold dark:text-gray-200 py-2 px-2 sm:py-3 sm:px-4 text-center whitespace-nowrap">
                        Pembimbing
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-center whitespace-nowrap dark:text-gray-200 py-2 px-2 sm:px-4">
                        Penguji
                      </TableHead>
                      <TableHead className="text-xs font-semibold dark:text-gray-200 py-2 px-2 sm:px-4 text-center whitespace-nowrap">
                        Nilai Akhir
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedData.map((student, index) => (
                      <TableRow
                        key={student.nim}
                        className={`dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                          index % 2
                            ? "bg-emerald-100 dark:bg-gray-800"
                            : "bg-gray-50/50 dark:bg-gray-900/30"
                        }`}
                      >
                        <TableCell className="py-2 px-2 sm:p-4 sm:px-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {student.nama}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {student.nim}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:p-3 sm:px-4 text-center">
                          <span className="inline-flex items-center px-1 sm:px-2 sm:p-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {student.kelas}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:p-3 sm:px-4 text-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student.nilai_instansi ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:p-3 sm:px-4 text-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student.nilai_pembimbing ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:p-3 sm:px-4 text-center">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {student.nilai_penguji ?? "-"}
                          </span>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:p-3 sm:px-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {formatFinalGrade(
                                student.nilai_akhir,
                                student.nilai_huruf
                              )}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 py-4 border-t dark:border-gray-700 flex gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
              className="flex-1 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              disabled={validateMutation.isPending}
            >
              Batalkan
            </Button>
            <Button
              onClick={handleConfirmValidate}
              disabled={validateMutation.isPending}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-medium text-sm"
            >
              {validateMutation.isPending ? (
                <div className="flex items-center gap-1.5">
                  <svg
                    className="animate-spin h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 2 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </div>
              ) : (
                "Konfirmasi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (isTahunAjaranError) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-600 dark:text-gray-300 py-10">
          Gagal memuat daftar tahun ajaran. Silakan coba lagi nanti.
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-600 dark:text-red-300">
          Gagal mengambil data: {(error as Error).message}
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading || isTahunAjaranLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex">
              <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
                <span className="inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400" />
                <CalendarCheck2Icon className="w-4 h-4 mr-1.5" />
                Nilai Kerja Praktik Mahasiswa
              </span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-200">
              <div className="relative">
                <div className="px-3 py-1 pr-8 text-sm bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-8 w-32 animate-pulse" />
              </div>
            </div>
          </div>
          <SkeletonCard />
          <div className="flex flex-col gap-4">
            <SkeletonFilter />
            <SkeletonRadioGroup />
            <SkeletonTable />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="transition-colors duration-300">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex">
              <span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
                <span className="inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400" />
                <CalendarCheck2Icon className="w-4 h-4 mr-1.5" />
                Nilai Kerja Praktik Mahasiswa
              </span>
            </div>

            <div className="flex items-center gap-2 dark:text-gray-200">
              <div className="relative">
                <select
                  className="px-3 py-1 pr-8 text-sm bg-white border focus:outline-none active:outline-none rounded-lg shadow-sm appearance-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0 disabled:opacity-50"
                  value={selectedTahunAjaranId ?? ""}
                  onChange={(e) =>
                    setSelectedTahunAjaranId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
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

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between pt-3 px-3 pb-1">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Nilai Belum Valid
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-blue-200 p-1.5 rounded-full dark:bg-blue-800"
                  >
                    <AlertCircle className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                  </motion.div>
                </div>
                <div className="px-3 pb-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-2xl font-bold text-blue-800 dark:text-white"
                  >
                    {belumValidCount}
                  </motion.div>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mt-0.5">
                    Mahasiswa
                  </p>
                  <div className="h-1.5 w-full bg-blue-100 dark:bg-blue-900 rounded-full mt-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(belumValidCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-1.5 bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between pt-3 px-3 pb-1">
                  <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                    Nilai Valid
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-purple-200 p-1.5 rounded-full dark:bg-purple-800"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
                  </motion.div>
                </div>
                <div className="px-3 pb-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-2xl font-bold text-purple-800 dark:text-white"
                  >
                    {validCount}
                  </motion.div>
                  <p className="text-xs text-purple-600 dark:text-purple-300 mt-0.5">
                    Mahasiswa
                  </p>
                  <div className="h-1.5 w-full bg-purple-100 dark:bg-purple-900 rounded-full mt-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(validCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-1.5 bg-purple-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-gray-900">
                <div className="flex flex-row items-center justify-between pt-3 px-3 pb-1">
                  <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    Nilai Approve
                  </h3>
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="bg-emerald-200 p-1.5 rounded-full dark:bg-emerald-800"
                  >
                    <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" />
                  </motion.div>
                </div>
                <div className="px-3 pb-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-2xl font-bold text-emerald-800 dark:text-white"
                  >
                    {approveCount}
                  </motion.div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-0.5">
                    Mahasiswa
                  </p>
                  <div className="h-1.5 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full mt-2">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: totalStudents
                          ? `${(approveCount / totalStudents) * 100}%`
                          : "0%",
                      }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-1.5 bg-emerald-500 rounded-full"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 w-full">
              <div className="flex items-center gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "semua" | NilaiStatus)
                  }
                >
                  <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:border-gray-700">
                    <SelectValue placeholder="Filter Status Nilai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Status</SelectItem>
                    <SelectItem value="nilaiBelumValid">
                      Nilai Belum Valid
                    </SelectItem>
                    <SelectItem value="nilaiValid">Nilai Valid</SelectItem>
                    <SelectItem value="nilaiApprove">Nilai Approve</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center w-full gap-2 relative">
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

            <div className="flex justify-between gap-4">
              <RadioGroup
                value={selectedKelas}
                onValueChange={setSelectedKelas}
                className="flex flex-wrap gap-4 py-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="semua"
                    id="semua"
                    className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                  />
                  <Label
                    htmlFor="semua"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Semua Kelas
                  </Label>
                </div>
                {uniqueKelas.map((kelas) => (
                  <div key={kelas} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={kelas}
                      id={kelas}
                      className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    />
                    <Label
                      htmlFor={kelas}
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      {kelas}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {selectedStudents.length > 0 ? (
                <Button
                  onClick={handleValidate}
                  className="bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                  size="sm"
                  title="Konfirmasi Nilai"
                >
                  <Check className="h-4 w-4 dark:text-white" />
                </Button>
              ) : null}
            </div>

            <StudentTable
              students={filteredStudents}
              onViewDetail={handleOpenDialog}
              selectedStudents={selectedStudents}
              onCheckboxChange={handleCheckboxChange}
            />
          </div>
        </div>
      </div>

      {renderModal()}
      {renderConfirmModal()}
    </DashboardLayout>
  );
};

const StudentTable: FC<{
  students: Mahasiswa[];
  onViewDetail: (student: Mahasiswa) => void;
  selectedStudents: string[];
  onCheckboxChange: (nim: string) => void;
}> = ({ students, onViewDetail, selectedStudents, onCheckboxChange }) => {
  return (
    <Card className="shadow-none rounded-none dark:bg-gray-900 dark:border-gray-700">
      <Table>
        <TableHeader className="bg-gray-200 dark:bg-gray-700">
          <TableRow className="hover:bg-gray-300 dark:hover:bg-gray-600">
            <TableHead className="w-12 text-center font-semibold dark:text-gray-200">
              {/* Kosongkan header untuk kolom checkbox */}
            </TableHead>
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
              Status KP
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Kelas
            </TableHead>
            <TableHead className="text-center font-semibold dark:text-gray-200">
              Status Nilai
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
                colSpan={9}
                className="text-center py-6 text-muted-foreground dark:text-gray-400"
              >
                Tidak ada data yang ditemukan
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow
                key={student.nim}
                className="dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <TableCell className="text-center">
                  {student.status_nilai === "Nilai Valid" ? (
                    <Checkbox
                      checked={selectedStudents.includes(student.nim)}
                      onCheckedChange={() => onCheckboxChange(student.nim)}
                      className="h-4 w-4"
                    />
                  ) : student.validasi_nilai_is_approve ? (
                    <span className="text-xs text-green-500 dark:text-green-400">
                      ✓
                    </span>
                  ) : (
                    <Checkbox
                      disabled
                      className="h-4 w-4 opacity-100"
                      title="Hanya nilai dengan status 'Nilai Valid' yang dapat dikonfirmasi"
                    />
                  )}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs font-semibold">
                  {index + 1}.
                </TableCell>
                <TableCell className="dark:text-gray-300 text-xs font-semibold text-center">
                  {student.nama}
                </TableCell>
                <TableCell className="text-center dark:text-gray-300 text-xs">
                  {student.nim}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      student.status_daftar_kp === "Baru"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      student.status_daftar_kp === "Baru"
                        ? "dark:bg-gray-700 dark:text-gray-200"
                        : "dark:border-gray-600 dark:text-gray-300"
                    }
                  >
                    {student.status_daftar_kp}
                  </Badge>
                </TableCell>
                <TableCell className="dark:text-gray-300 text-center text-xs">
                  {student.kelas}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].bgColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].textColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].darkBgColor
                    } ${
                      nilaiStatusBadgeConfig[
                        student.status_nilai === "Nilai Belum Valid"
                          ? "nilaiBelumValid"
                          : student.status_nilai === "Nilai Valid"
                          ? "nilaiValid"
                          : "nilaiApprove"
                      ].darkTextColor
                    }`}
                  >
                    {student.status_nilai}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold mx-auto dark:text-white rounded-sm transition-colors duration-150 flex items-center"
                    onClick={() => onViewDetail(student)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default KoordinatorNilaiPage;
