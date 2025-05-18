import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import APIKerjaPraktik from "@/services/api/dosen/bimbingan-kp.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TambahBimbinganModal from "@/components/dosen/kerja-praktik/mahasiswa-bimbing/TambahBimbinganModal";
import DetailBimbinganModal from "@/components/dosen/kerja-praktik/mahasiswa-bimbing/DetailBimbinganModal";
import DetailDailyReportModal from "@/components/dosen/kerja-praktik/mahasiswa-bimbing/DetailDailyReportModal";
import {
  Calendar,
  GraduationCap,
  User,
  ClipboardCheck,
  Building,
  FilePlus2,
  FileText,
  BookOpen,
  Save,
  AlertTriangle,
  CheckCircle,
  AlertTriangleIcon,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DailyReport,
  Bimbingan,
  CalendarDay,
  DetailMahasiswaSayaResponse,
  KomponenPenilaianPembimbing,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";

const DosenKerjaPraktikMahasiswaBimbingDetailPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [agendaEntries, setAgendaEntries] = useState<DailyReport[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [activeTab, setActiveTab] = useState("daily-report");
  const [isModalBimbingan, setOpenModalBimbingan] = useState(false);
  const [isEditingNilai, setIsEditingNilai] = useState(false);
  const [isModalBimbinganDetail, setOpenModalBimbinganDetail] = useState(false);
  const [isModalDailyReportDetail, setOpenModalDailyReportDetail] =
    useState(false);
  const [selectedBimbingan, setSelectedBimbingan] = useState<Bimbingan | null>(
    null
  );
  const [selectedDailyReport, setSelectedDailyReport] =
    useState<DailyReport | null>(null);
  const [evaluationValues, setEvaluationValues] = useState({
    penyelesaian_masalah: 0,
    bimbingan_sikap: 0,
    kualitas_laporan: 0,
    catatan: "",
  });
  const [formErrors, setFormErrors] = useState({
    penyelesaian_masalah: "",
    bimbingan_sikap: "",
    kualitas_laporan: "",
  });

  const {
    data: detailMahasiswaSaya,
    isLoading,
    isError,
    error,
  } = useQuery<DetailMahasiswaSayaResponse>({
    queryKey: ["detail-mahasiswa-saya", id],
    queryFn: () =>
      APIKerjaPraktik.getDetailMahasiswaBimbinganSaya(id!).then(
        (data) => data.data
      ),
    staleTime: Infinity,
    enabled: !!id,
  });

  useEffect(() => {
    if (
      detailMahasiswaSaya?.daily_report &&
      detailMahasiswaSaya.tanggal_mulai
    ) {
      const entries: DailyReport[] = detailMahasiswaSaya.daily_report.map(
        (report, index) => ({
          id: report.id,
          hari_ke: index + 1,
          tanggal_presensi: report.tanggal_presensi.split("T")[0],
          status: report.status,
          catatan_evaluasi: report.catatan_evaluasi,
          detail_daily_report: report.detail_daily_report?.map((detail) => ({
            id: detail.id,
            waktu_mulai: detail.waktu_mulai,
            waktu_selesai: detail.waktu_selesai,
            judul_agenda: detail.judul_agenda,
            deskripsi_agenda: detail.deskripsi_agenda,
          })),
        })
      );
      setAgendaEntries(entries);
    }
  }, [detailMahasiswaSaya]);

  useEffect(() => {
    if (
      detailMahasiswaSaya?.tanggal_mulai &&
      detailMahasiswaSaya?.tanggal_selesai
    ) {
      const today = new Date();
      const startDate = new Date(detailMahasiswaSaya.tanggal_mulai);
      const endDate = new Date(detailMahasiswaSaya.tanggal_selesai);

      if (today >= startDate && today <= endDate) {
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      } else {
        setCurrentMonth(
          new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        );
      }
    }
  }, [detailMahasiswaSaya]);

  useEffect(() => {
    if (
      detailMahasiswaSaya?.tanggal_mulai &&
      detailMahasiswaSaya?.tanggal_selesai
    ) {
      setCalendarDays(
        generateCalendarDays(
          currentMonth,
          new Date(detailMahasiswaSaya.tanggal_mulai),
          new Date(detailMahasiswaSaya.tanggal_selesai)
        )
      );
    }
  }, [currentMonth, agendaEntries, detailMahasiswaSaya]);

  const generateCalendarDays = (
    monthDate: Date,
    startDate: Date,
    endDate: Date
  ): CalendarDay[] => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysFromPrevMonth = firstDayWeekday;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
      const date = new Date(
        year,
        month - 1,
        prevMonthLastDay - daysFromPrevMonth + i + 1
      );
      const dateStr = date.toISOString().split("T")[0];
      const isWithinPeriod =
        date >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(endDate.setHours(23, 59, 59, 999));
      const entry = agendaEntries.find(
        (entry) => entry.tanggal_presensi === dateStr
      );

      return {
        date,
        isCurrentMonth: false,
        isWithinPeriod,
        hasEntry: !!entry,
        entry: entry || null,
        isStartDate: dateStr === startDate.toISOString().split("T")[0],
        isEndDate: dateStr === endDate.toISOString().split("T")[0],
      };
    });

    const currentMonthDays = Array.from(
      { length: lastDayOfMonth.getDate() },
      (_, i) => {
        const date = new Date(year, month, i + 1);
        const dateStr = date.toISOString().split("T")[0];
        const isWithinPeriod =
          date >= new Date(startDate.setHours(0, 0, 0, 0)) &&
          date <= new Date(endDate.setHours(23, 59, 59, 999));
        const entry = agendaEntries.find(
          (entry) => entry.tanggal_presensi === dateStr
        );

        return {
          date,
          isCurrentMonth: true,
          isWithinPeriod,
          hasEntry: !!entry,
          entry: entry || null,
          isStartDate: dateStr === startDate.toISOString().split("T")[0],
          isEndDate: dateStr === endDate.toISOString().split("T")[0],
        };
      }
    );

    const totalDaysShown = 42;
    const daysFromNextMonth =
      totalDaysShown - prevMonthDays.length - currentMonthDays.length;

    const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => {
      const date = new Date(year, month + 1, i + 1);
      const dateStr = date.toISOString().split("T")[0];
      const isWithinPeriod =
        date >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(endDate.setHours(23, 59, 59, 999));
      const entry = agendaEntries.find(
        (entry) => entry.tanggal_presensi === dateStr
      );

      return {
        date,
        isCurrentMonth: false,
        isWithinPeriod,
        hasEntry: !!entry,
        entry: entry || null,
        isStartDate: dateStr === startDate.toISOString().split("T")[0],
        isEndDate: dateStr === endDate.toISOString().split("T")[0],
      };
    });

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  };

  const handlePrevMonth = (): void => {
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const startMonth =
      new Date(detailMahasiswaSaya!.tanggal_mulai).getFullYear() * 12 +
      new Date(detailMahasiswaSaya!.tanggal_mulai).getMonth();
    const prevMonthIndex = prevMonth.getFullYear() * 12 + prevMonth.getMonth();
    if (prevMonthIndex >= startMonth) {
      setCurrentMonth(prevMonth);
    }
  };

  const handleNextMonth = (): void => {
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    const endMonth =
      new Date(detailMahasiswaSaya!.tanggal_selesai).getFullYear() * 12 +
      new Date(detailMahasiswaSaya!.tanggal_selesai).getMonth();
    const nextMonthIndex = nextMonth.getFullYear() * 12 + nextMonth.getMonth();
    if (nextMonthIndex <= endMonth) {
      setCurrentMonth(nextMonth);
    }
  };

  const isPrevDisabled = () => {
    if (!detailMahasiswaSaya?.tanggal_mulai) return true;
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const startMonth =
      new Date(detailMahasiswaSaya.tanggal_mulai).getFullYear() * 12 +
      new Date(detailMahasiswaSaya.tanggal_mulai).getMonth();
    return prevMonth.getFullYear() * 12 + prevMonth.getMonth() < startMonth;
  };

  const isNextDisabled = () => {
    if (!detailMahasiswaSaya?.tanggal_selesai) return true;
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    const endMonth =
      new Date(detailMahasiswaSaya.tanggal_selesai).getFullYear() * 12 +
      new Date(detailMahasiswaSaya.tanggal_selesai).getMonth();
    return nextMonth.getFullYear() * 12 + nextMonth.getMonth() > endMonth;
  };

  useEffect(() => {
    if (
      detailMahasiswaSaya?.nilai?.[0]?.komponen_penilaian_pembimbing &&
      !isEditingNilai
    ) {
      setEvaluationValues({
        penyelesaian_masalah:
          detailMahasiswaSaya.nilai[0].komponen_penilaian_pembimbing[0]
            ?.penyelesaian_masalah || 0,
        bimbingan_sikap:
          detailMahasiswaSaya.nilai[0].komponen_penilaian_pembimbing[0]
            ?.bimbingan_sikap || 0,
        kualitas_laporan:
          detailMahasiswaSaya.nilai[0].komponen_penilaian_pembimbing[0]
            ?.kualitas_laporan || 0,
        catatan:
          detailMahasiswaSaya.nilai[0].komponen_penilaian_pembimbing[0]
            ?.catatan || "",
      });
    }
  }, [detailMahasiswaSaya, isEditingNilai]);

  const postBimbinganMutation = useMutation({
    mutationFn: (data: { catatan_bimbingan: string; nim: string }) =>
      APIKerjaPraktik.postBimbingan(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detail-mahasiswa-saya", id],
      });
      toast.success("Bimbingan berhasil disimpan!", {
        style: {
          background: "#10B981",
          color: "#fff",
          border: "1px solid #10B981",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "⭐",
        duration: 3000,
        position: "top-right",
      });
      setOpenModalBimbingan(false);
    },
    onError: (error) => {
      console.error("Error post bimbingan:", error);
      toast.error("Gagal menyimpan bimbingan. Silakan coba lagi.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          border: "1px solid #ef4444",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "❌",
        duration: 4000,
        position: "top-right",
      });
    },
  });

  const postNilaiMutation = useMutation({
    mutationFn: (data: {
      penyelesaian_masalah: number;
      bimbingan_sikap: number;
      kualitas_laporan: number;
      catatan: string;
    }) => APIKerjaPraktik.postNilai(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detail-mahasiswa-saya", id],
      });
      setEvaluationValues({
        penyelesaian_masalah: 0,
        bimbingan_sikap: 0,
        kualitas_laporan: 0,
        catatan: "",
      });
      setIsEditingNilai(false);
      toast.success("Nilai berhasil disimpan!", {
        style: {
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid #3b82f6",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "✅",
        duration: 3000,
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Error posting nilai:", error);
      toast.error("Gagal menyimpan nilai. Silakan coba lagi.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          border: "1px solid #ef4444",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "❌",
        duration: 4000,
        position: "top-right",
      });
    },
  });

  const putNilaiMutation = useMutation({
    mutationFn: (data: {
      penyelesaian_masalah: number;
      bimbingan_sikap: number;
      kualitas_laporan: number;
      catatan: string;
    }) => {
      const nilaiId = detailMahasiswaSaya?.nilai?.[0]?.id;
      if (!nilaiId) throw new Error("Id nilai is missing...");
      return APIKerjaPraktik.putNilai(nilaiId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["detail-mahasiswa-saya", id],
      });
      setIsEditingNilai(false);
      toast.success("Nilai berhasil diperbarui!", {
        style: {
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid #3b82f6",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "✅",
        duration: 3000,
        position: "top-right",
      });
    },
    onError: (error) => {
      console.error("Error updating nilai:", error);
      toast.error("Gagal memperbarui nilai. Silakan coba lagi.", {
        style: {
          background: "#ffffff",
          color: "#1f2937",
          border: "1px solid #ef4444",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: "❌",
        duration: 4000,
        position: "top-right",
      });
    },
  });

  const getStatusValidasi = (status: string): string => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Revisi":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Ditolak":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else {
      return name.substring(0, 2).toUpperCase();
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getSemester = (nim: string): number => {
    const tahunAngkatan = parseInt("20" + nim.substring(1, 3), 10);
    const now = new Date();
    const tahunSekarang = now.getFullYear();
    const bulanSekarang = now.getMonth();

    let tahunBerjalan = tahunSekarang - tahunAngkatan;
    let semester = tahunBerjalan * 2;

    if (bulanSekarang >= 7) {
      semester += 1;
    }

    return Math.max(semester, 1);
  };

  const getStatusAvatarColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700";
      case "Baru":
        return "from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700";
      case "Lanjut":
        return "from-yellow-500 to-yellow-500 dark:from-yellow-600 dark:to-yellow-500";
      case "Gagal":
        return "from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700";
      default:
        return "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700";
    }
  };

  const evaluationCriteria = [
    {
      id: "penyelesaian_masalah",
      label: "Kemampuan Penyelesaian Masalah",
      weight: 0.4,
    },
    {
      id: "bimbingan_sikap",
      label: "Keaktifan Bimbingan dan Sikap",
      weight: 0.35,
    },
    { id: "kualitas_laporan", label: "Kualitas Laporan KP", weight: 0.25 },
  ];

  const handleSliderChange = (name: string, value: number[]) => {
    setEvaluationValues((prev) => ({
      ...prev,
      [name]: value[0],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Math.min(100, Math.max(0, parseInt(value) || 0));
    setEvaluationValues((prev) => ({
      ...prev,
      [name]: numValue,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]:
        value && (isNaN(numValue) || numValue < 0 || numValue > 100)
          ? "Nilai harus antara 0 dan 100"
          : "",
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEvaluationValues((prev) => ({
      ...prev,
      catatan: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {
      penyelesaian_masalah: "",
      bimbingan_sikap: "",
      kualitas_laporan: "",
    };
    let isValid = true;

    evaluationCriteria.forEach(({ id }) => {
      const value = evaluationValues[
        id as keyof typeof evaluationValues
      ] as number;
      if (!value || value < 0 || value > 100) {
        errors[id as keyof typeof errors] = "Nilai harus antara 0 dan 100";
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const calculateFinalScore = () => {
    let weightedSum = 0;
    weightedSum +=
      evaluationValues.penyelesaian_masalah * evaluationCriteria[0].weight;
    weightedSum +=
      evaluationValues.bimbingan_sikap * evaluationCriteria[1].weight;
    weightedSum +=
      evaluationValues.kualitas_laporan * evaluationCriteria[2].weight;
    return Math.round(weightedSum);
  };

  const getGrade = (score: number) => {
    if (score >= 85) return "A";
    if (score >= 80) return "A-";
    if (score >= 75) return "B+";
    if (score >= 70) return "B";
    if (score >= 65) return "B-";
    if (score >= 60) return "C+";
    if (score >= 55) return "C";
    if (score >= 50) return "C-";
    if (score >= 40) return "D";
    return "E";
  };

  const handleSaveNilai = () => {
    if (!validateForm()) return;
    if (!id) {
      toast.error("Pendaftaran KP ID tidak ditemukan.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          border: "1px solid #ef4444",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    const data = {
      penyelesaian_masalah: evaluationValues.penyelesaian_masalah,
      bimbingan_sikap: evaluationValues.bimbingan_sikap,
      kualitas_laporan: evaluationValues.kualitas_laporan,
      catatan: evaluationValues.catatan,
    };

    if (!detailMahasiswaSaya?.nilai?.length) {
      postNilaiMutation.mutate(data);
    } else if (isEditingNilai && detailMahasiswaSaya?.nilai?.[0]?.id) {
      putNilaiMutation.mutate(data);
    } else {
      toast.error("Tidak dapat menyimpan nilai: ID nilai tidak valid.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          border: "1px solid #ef4444",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const handleResetNilai = () => {
    setEvaluationValues({
      penyelesaian_masalah: detailMahasiswaSaya?.nilai?.length
        ? detailMahasiswaSaya.nilai?.[0]?.komponen_penilaian_pembimbing?.[0]
            ?.penyelesaian_masalah ?? 0
        : 0,
      bimbingan_sikap: detailMahasiswaSaya?.nilai?.length
        ? detailMahasiswaSaya.nilai?.[0]?.komponen_penilaian_pembimbing?.[0]
            ?.bimbingan_sikap ?? 0
        : 0,
      kualitas_laporan: detailMahasiswaSaya?.nilai?.length
        ? detailMahasiswaSaya.nilai?.[0]?.komponen_penilaian_pembimbing?.[0]
            ?.kualitas_laporan ?? 0
        : 0,
      catatan: detailMahasiswaSaya?.nilai?.length
        ? detailMahasiswaSaya.nilai?.[0]?.komponen_penilaian_pembimbing?.[0]
            ?.catatan ?? ""
        : "",
    });
    setFormErrors({
      penyelesaian_masalah: "",
      bimbingan_sikap: "",
      kualitas_laporan: "",
    });
    setIsEditingNilai(false);
  };

  const handleEditNilai = () => {
    if (detailMahasiswaSaya?.nilai?.length) {
      setIsEditingNilai(true);
    } else {
      toast.error(
        "Tidak ada nilai untuk diedit. Silakan simpan nilai terlebih dahulu.",
        {
          style: {
            background: "#ef4444",
            color: "#fff",
            border: "1px solid #ef4444",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          duration: 4000,
          position: "top-right",
        }
      );
    }
  };

  const handleSaveBimbingan = (catatan_bimbingan: string) => {
    postBimbinganMutation.mutate({
      catatan_bimbingan,
      nim: detailMahasiswaSaya?.mahasiswa.nim || "",
    });
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 ">
        <Toaster />
        {/* Page Title */}
        <div className="flex items-center gap-4 mb-6">
          {/* <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="text-gray-600 dark:text-gray-300"
          >
            Kembali
          </Button> */}
          <h1 className="text-2xl font-bold">Detail Mahasiswa Bimbingan</h1>
        </div>
        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-700"
          >
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertTriangle className="w-5 h-5" />
              <p>{error?.message || "Gagal memuat data mahasiswa."}</p>
            </div>
          </motion.div>
        )}
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 animate-pulse">
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800"></div>
            <div className="flex flex-col items-center -mt-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="w-32 h-6 mt-3 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="w-24 h-4 mt-2 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg dark:bg-gray-800"></div>
          </div>
        )}
        {/* Profile Section */}
        {!isLoading && !isError && detailMahasiswaSaya && (
          <div className="mb-8 overflow-hidden bg-white border shadow-md dark:bg-gray-800 dark:border-gray-700 rounded-xl">
            <div
              className={`bg-gradient-to-r ${getStatusAvatarColor(
                detailMahasiswaSaya.status
              )} h-24`}
            ></div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Left Column - Report Title */}
                <div className="mt-8 space-y-4">
                  <div className="flex flex-col justify-center h-full p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex items-center mb-2 space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <h2 className="text-sm font-medium text-gray-500 uppercase dark:text-gray-400">
                          Judul Laporan
                        </h2>
                      </div>
                      <Card className="w-full px-4 py-4 overflow-hidden border rounded-lg shadow-sm dark:bg-gray-800/30 dark:border-gray-700">
                        <div className="overflow-y-auto max-h-24 custom-scrollbar">
                          <p className="text-sm font-semibold text-gray-900 uppercase dark:text-white">
                            {detailMahasiswaSaya.judul_kp}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                {/* Center Column - Profile */}
                <div className="flex flex-col items-center -mt-12">
                  <div
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-3xl bg-gradient-to-br ${getStatusAvatarColor(
                      detailMahasiswaSaya.status
                    )} shadow-md`}
                  >
                    {getInitials(detailMahasiswaSaya.mahasiswa.nama)}
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-center text-gray-800 dark:text-white">
                    {detailMahasiswaSaya.mahasiswa.nama}
                  </h2>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    {detailMahasiswaSaya.mahasiswa.nim}
                  </p>
                  <div className="flex items-center mt-4 space-x-2">
                    <span className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full dark:bg-gray-700">
                      <GraduationCap className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>
                        Semester{" "}
                        {getSemester(detailMahasiswaSaya.mahasiswa.nim)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 rounded-full dark:bg-gray-700">
                      <ClipboardCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>
                        {detailMahasiswaSaya.bimbingan?.length} Bimbingan
                      </span>
                    </span>
                  </div>
                </div>
                {/* Right Column - KP Info */}
                <div className="mt-8 space-y-4">
                  <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
                    {/* <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase dark:text-gray-400">
                      Informasi Kerja Praktik
                    </h3> */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex gap-2">
                        <Building className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Instansi/Perusahaan
                          </p>
                          <p className="text-sm font-medium">
                            {detailMahasiswaSaya.instansi.nama}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Pembimbing Instansi
                          </p>
                          <p className="text-sm font-medium">
                            {detailMahasiswaSaya.pembimbing_instansi.nama}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Mulai KP
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(detailMahasiswaSaya.tanggal_mulai)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Selesai KP
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(detailMahasiswaSaya.tanggal_selesai)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Tabs and Table */}
        {!isLoading && !isError && detailMahasiswaSaya && (
          <div className="mt-4">
            <Tabs
              defaultValue="daily-report"
              className="w-full"
              onValueChange={setActiveTab}
              value={activeTab}
            >
              <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-2 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="daily-report"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Daily Report
                </TabsTrigger>
                <TabsTrigger
                  value="riwayat-bimbingan"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Riwayat Bimbingan
                </TabsTrigger>
                <TabsTrigger
                  value="penilaian"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500"
                >
                  <ClipboardCheck className="w-4 h-4 mr-2" />
                  Penilaian
                </TabsTrigger>
              </TabsList>
              <TabsContent value="daily-report" className="space-y-4">
                <div className="overflow-hidden border border-gray-100 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
                  <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 dark:border-gray-700 dark:bg-gray-800/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevMonth}
                      className="flex items-center gap-1"
                      disabled={isPrevDisabled()}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </Button>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {formatMonthYear(currentMonth)}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextMonth}
                      className="flex items-center gap-1"
                      disabled={isNextDisabled()}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700">
                    {[
                      "Minggu",
                      "Senin",
                      "Selasa",
                      "Rabu",
                      "Kamis",
                      "Jumat",
                      "Sabtu",
                    ].map((day, index) => (
                      <div
                        key={day}
                        className={`py-3 text-center text-sm font-semibold ${
                          index === 0 || index === 6
                            ? "text-red-500 dark:text-red-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 bg-white dark:bg-gray-800/20">
                    {calendarDays.map((day, index) => {
                      const isWeekend =
                        day.date.getDay() === 0 || day.date.getDay() === 6;
                      const isToday =
                        day.date.toDateString() === new Date().toDateString();
                      const isMissingAttendance =
                        day.isWithinPeriod &&
                        !day.hasEntry &&
                        !isWeekend &&
                        day.date <=
                          new Date(new Date().setHours(23, 59, 59, 999));

                      return (
                        <div
                          key={index}
                          className={`
                          min-h-28 p-2 border-t border-l border-gray-100 dark:border-gray-700
                          transition-colors duration-200
                          ${
                            day.isWithinPeriod
                              ? day.isStartDate
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : day.isEndDate
                                ? "bg-purple-50 dark:bg-purple-900/20"
                                : isMissingAttendance
                                ? "bg-red-50 dark:bg-red-900/20"
                                : day.hasEntry
                                ? "bg-green-50 dark:bg-green-900/20 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30"
                                : isWeekend
                                ? "bg-gray-50 dark:bg-gray-800/30 opacity-50"
                                : "bg-white dark:bg-gray-800/20"
                              : !day.isCurrentMonth
                              ? "bg-gray-50 dark:bg-gray-800/40 opacity-30"
                              : "bg-white dark:bg-gray-800/20"
                          }
                          ${index % 7 === 0 ? "border-l-0" : ""}
                          ${index < 7 ? "border-t-0" : ""}
                          relative
                        `}
                          onClick={() => {
                            setSelectedDailyReport(day.entry);
                            setOpenModalDailyReportDetail(true);
                          }}
                        >
                          <div
                            className={`
                            absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full
                            font-semibold text-sm
                            ${
                              day.isStartDate
                                ? "bg-blue-500 text-white"
                                : day.isEndDate
                                ? "bg-purple-500 text-white"
                                : day.hasEntry && day.entry
                                ? day.entry.status === "Disetujui"
                                  ? "bg-green-500 text-white"
                                  : day.entry.status === "Revisi"
                                  ? "bg-amber-500 text-white"
                                  : day.entry.status === "Ditolak"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                                : isMissingAttendance
                                ? "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                : isToday
                                ? "bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : day.isCurrentMonth
                                ? "text-gray-700 dark:text-gray-400"
                                : "text-gray-400 dark:text-gray-600"
                            }
                          `}
                          >
                            {day.date.getDate()}
                          </div>
                          {day.hasEntry && day.entry && (
                            <div className="p-2 mt-8">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`
                                      rounded-lg p-2 text-xs border
                                      ${
                                        day.entry.status === "Disetujui"
                                          ? "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-900/50"
                                          : day.entry.status === "Revisi"
                                          ? "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900/50"
                                          : day.entry.status === "Ditolak"
                                          ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-900/50"
                                          : "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-900/50"
                                      }
                                    `}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                          Hari Ke-{day.entry.hari_ke}
                                        </span>
                                        {day.entry.status === "Disetujui" ? (
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                        ) : day.entry.status === "Revisi" ? (
                                          <AlertTriangleIcon className="w-3 h-3 text-amber-500" />
                                        ) : day.entry.status === "Ditolak" ? (
                                          <XCircle className="w-3 h-3 text-red-500" />
                                        ) : (
                                          <Eye className="w-3 h-3 text-yellow-500" />
                                        )}
                                      </div>
                                      <div
                                        className={`
                                                      text-xs py-0.5 rounded-sm w-fit
                                                      ${getStatusValidasi(
                                                        day.entry.status
                                                      )}
                                                    `}
                                      >
                                        {day.entry.status}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Klik untuk "Detail Agenda"
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          )}
                          {isToday && (
                            <div className="absolute w-2 h-2 bg-blue-500 rounded-full bottom-2 left-2"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 p-4 bg-white border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Tanggal Mulai</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>Tanggal Selesai</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Ada Agenda</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Tidak Ada Agenda</span>
                    </div>

                    {agendaEntries.length === 0 && (
                      <div className="ml-auto text-sm text-gray-500">
                        <Calendar className="inline-block w-4 h-4 mr-1 opacity-50" />
                        <span>Klik tombol "Presensi" untuk menambahkan.</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="riwayat-bimbingan" className="space-y-4">
                <Card>
                  <CardHeader className="flex items-end">
                    <Button
                      className="w-1/5 bg-blue-500 border text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:border-gray-700 dark:hover:bg-blue-600"
                      onClick={() => setOpenModalBimbingan(true)}
                    >
                      <FilePlus2 className="w-4 h-4 mr-2" />
                      Tambah Bimbingan
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Card className="overflow-hidden border-none rounded-lg shadow-sm">
                      <Table className="border dark:border-gray-700">
                        <TableHeader className="bg-gray-200 border dark:border-gray-700 dark:bg-gray-800/10">
                          <TableRow>
                            <TableHead className="text-center">
                              Bimbingan Ke-
                            </TableHead>
                            <TableHead className="text-center">
                              Tanggal
                            </TableHead>
                            <TableHead className="text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(detailMahasiswaSaya.bimbingan ?? []).length > 0 ? (
                            detailMahasiswaSaya.bimbingan?.map(
                              (bimbingan, index) => (
                                <TableRow
                                  key={bimbingan.id}
                                  className={
                                    index % 2 !== 0
                                      ? "bg-background dark:bg-gray-700/30 cursor-pointer"
                                      : "bg-secondary dark:bg-gray-700/10 cursor-pointer"
                                  }
                                >
                                  <TableCell className="font-medium text-center">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {formatDate(bimbingan.tanggal_bimbingan)}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Badge className="text-green-800 bg-green-100 border-green-200 hover:bg-green-200">
                                      {bimbingan.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Button
                                      size="sm"
                                      className="bg-blue-500 border text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:border-gray-700 dark:hover:bg-blue-600"
                                      onClick={() => {
                                        setSelectedBimbingan(bimbingan);
                                        setOpenModalBimbinganDetail(true);
                                      }}
                                    >
                                      <FileText className="w-4 h-4 mr-2" />
                                      Lihat Catatan
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              )
                            )
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="py-4 text-center"
                              >
                                Belum ada bimbingan nih...
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="penilaian" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>
                      {detailMahasiswaSaya.nilai?.length && !isEditingNilai
                        ? "Detail Penilaian KP Mahasiswa (Dosen Pembimbing - 40%)"
                        : "Formulir Penilaian KP Mahasiswa (Dosen Pembimbing - 40%)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {detailMahasiswaSaya.nilai?.length && !isEditingNilai ? (
                      <div className="p-4 space-y-6 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700/30 dark:border-gray-600">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nilai Akhir
                            </h4>
                            <p className="text-gray-900 dark:text-gray-100">
                              {detailMahasiswaSaya.nilai[0]?.nilai_pembimbing ||
                                "-"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Grade
                            </h4>
                            <p className="text-gray-900 dark:text-gray-100">
                              {getGrade(
                                detailMahasiswaSaya.nilai[0]?.nilai_pembimbing
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Status
                            </h4>
                            <Badge
                              className={
                                detailMahasiswaSaya.nilai[0]
                                  ?.nilai_pembimbing >= 55
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {detailMahasiswaSaya.nilai[0]?.nilai_pembimbing >=
                              55
                                ? "Lulus"
                                : "Tidak Lulus"}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Komponen Penilaian
                          </h4>
                          <div className="mt-2 space-y-2">
                            {evaluationCriteria.map((criteria) => (
                              <div
                                key={criteria.id}
                                className="flex items-center justify-between"
                              >
                                <span className="text-gray-700 dark:text-gray-300">
                                  {criteria.label}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {
                                    detailMahasiswaSaya.nilai?.[0]
                                      ?.komponen_penilaian_pembimbing?.[0]?.[
                                      criteria.id as keyof KomponenPenilaianPembimbing
                                    ]
                                  }
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Catatan
                          </h4>
                          <div className="p-3 bg-white border border-gray-300 border-dashed rounded-lg dark:bg-gray-800 dark:border-gray-600">
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                              {detailMahasiswaSaya.nilai?.[0]
                                ?.komponen_penilaian_pembimbing?.[0]?.catatan ??
                                ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {evaluationCriteria.map((criteria) => (
                          <div
                            key={criteria.id}
                            className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <Label
                                  htmlFor={criteria.id}
                                  className="text-sm font-bold text-gray-700 dark:text-gray-300"
                                >
                                  {criteria.label}
                                </Label>
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                                  {Math.round(criteria.weight * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  name={criteria.id}
                                  value={
                                    evaluationValues[
                                      criteria.id as keyof typeof evaluationValues
                                    ] as number
                                  }
                                  onChange={handleInputChange}
                                  className="w-16 text-sm text-center bg-white border border-gray-300 rounded-md h-9 dark:border-gray-600 dark:bg-gray-800"
                                  aria-label={criteria.label}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="w-6 text-xs text-gray-500 dark:text-gray-400">
                                0
                              </span>
                              <Slider
                                id={criteria.id}
                                max={100}
                                step={1}
                                className="flex-grow"
                                value={[
                                  evaluationValues[
                                    criteria.id as keyof typeof evaluationValues
                                  ] as number,
                                ]}
                                onValueChange={(value) =>
                                  handleSliderChange(criteria.id, value)
                                }
                              />
                              <span className="w-6 text-xs text-gray-500 dark:text-gray-400">
                                100
                              </span>
                            </div>
                            {formErrors[
                              criteria.id as keyof typeof formErrors
                            ] && (
                              <p className="mt-1 text-sm text-red-600">
                                {
                                  formErrors[
                                    criteria.id as keyof typeof formErrors
                                  ]
                                }
                              </p>
                            )}
                          </div>
                        ))}
                        <div>
                          <Label
                            htmlFor="catatan"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Catatan Evaluasi
                          </Label>
                          <Textarea
                            id="catatan"
                            placeholder="Masukkan catatan atau umpan balik untuk mahasiswa"
                            className="h-24 mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            value={evaluationValues.catatan}
                            onChange={handleTextAreaChange}
                            aria-label="Catatan Evaluasi"
                          />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Nilai Akhir
                              </h3>
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {calculateFinalScore()}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                (40% dari Total Nilai)
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Grade
                              </h3>
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {getGrade(calculateFinalScore())}
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Status
                              </h3>
                              <Badge
                                className={
                                  calculateFinalScore() >= 55
                                    ? "bg-green-100 text-green-800 mt-2 text-sm"
                                    : "bg-red-100 text-red-800 mt-2 text-sm"
                                }
                              >
                                {calculateFinalScore() >= 55
                                  ? "Lulus"
                                  : "Tidak Lulus"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {detailMahasiswaSaya.nilai?.length && !isEditingNilai ? (
                      <Button
                        className="text-white bg-blue-500 hover:bg-blue-600"
                        onClick={handleEditNilai}
                        aria-label="Edit Penilaian"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Edit Penilaian
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleResetNilai}
                          aria-label="Reset Form"
                        >
                          Reset
                        </Button>
                        <Button
                          className="text-white bg-blue-500 hover:bg-blue-600"
                          onClick={handleSaveNilai}
                          disabled={
                            postNilaiMutation.isPending ||
                            putNilaiMutation.isPending
                          }
                          aria-label={
                            isEditingNilai
                              ? "Simpan Perubahan"
                              : "Simpan Penilaian"
                          }
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {postNilaiMutation.isPending ||
                          putNilaiMutation.isPending
                            ? "Menyimpan..."
                            : isEditingNilai
                            ? "Simpan Perubahan"
                            : "Simpan Penilaian"}
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      <TambahBimbinganModal
        isOpen={isModalBimbingan}
        onClose={() => setOpenModalBimbingan(false)}
        onSave={handleSaveBimbingan}
      />
      <DetailBimbinganModal
        isOpen={isModalBimbinganDetail}
        onClose={() => setOpenModalBimbinganDetail(false)}
        bimbinganData={selectedBimbingan || undefined}
      />
      <DetailDailyReportModal
        isOpen={isModalDailyReportDetail}
        onClose={() => setOpenModalDailyReportDetail(false)}
        dailyReportData={selectedDailyReport || undefined}
      />
    </DashboardLayout>
  );
};

export default DosenKerjaPraktikMahasiswaBimbingDetailPage;
