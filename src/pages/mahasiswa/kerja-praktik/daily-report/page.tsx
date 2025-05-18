import L from "leaflet";
import jsPDF from "jspdf";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import uinSuskaLogo from "@/assets/uin_suska_logo.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIKerjaPraktik from "@/services/api/mahasiswa/daily-report.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GeistSansBold,
  GeistSansRegular,
} from "@/components/mahasiswa/setoran-hafalan/detail-riwayat/jsPDFCustomFont.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Printer,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Lock,
  ClipboardCheck,
  User,
  Building,
  ContactRound,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangleIcon,
} from "lucide-react";
import {
  CalendarDay,
  DailyReport,
  DailyReportSayaResponse,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";

const MahasiswaKerjaPraktikDailyReportPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [agendaEntries, setAgendaEntries] = useState<DailyReport[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [isModalPresensiOpen, setIsModalPresensiOpen] = useState(false);
  const [isModalNilaiOpen, setIsModalNilaiOpen] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isWithinRadius, setIsWithinRadius] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [mahasiswaLocation, setMahasiswaLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const {
    data: dailyReportSaya,
    isLoading,
    isError,
    error,
  } = useQuery<DailyReportSayaResponse>({
    queryKey: ["daily-report-saya"],
    queryFn: async () => {
      try {
        const response = await APIKerjaPraktik.getDailyReportSaya();
        return response;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw new Error(err.response.data.message);
        }
        throw err;
      }
    },
    staleTime: Infinity,
  });

  const instansiLocation = {
    lat: dailyReportSaya?.data?.instansi?.latitude ?? 0,
    lng: dailyReportSaya?.data?.instansi?.longitude ?? 0,
  };

  useEffect(() => {
    if (
      dailyReportSaya?.data?.daily_report &&
      dailyReportSaya.data.tanggal_mulai
    ) {
      const entries: DailyReport[] = dailyReportSaya.data.daily_report.map(
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
  }, [dailyReportSaya]);

  useEffect(() => {
    if (
      dailyReportSaya?.data?.tanggal_mulai &&
      dailyReportSaya?.data?.tanggal_selesai
    ) {
      const today = new Date();
      const startDate = new Date(dailyReportSaya.data.tanggal_mulai);
      const endDate = new Date(dailyReportSaya.data.tanggal_selesai);

      if (today >= startDate && today <= endDate) {
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
      } else {
        setCurrentMonth(
          new Date(startDate.getFullYear(), startDate.getMonth(), 1)
        );
      }
    }
  }, [dailyReportSaya]);

  useEffect(() => {
    if (
      dailyReportSaya?.data?.tanggal_mulai &&
      dailyReportSaya?.data?.tanggal_selesai
    ) {
      setCalendarDays(
        generateCalendarDays(
          currentMonth,
          new Date(dailyReportSaya.data.tanggal_mulai),
          new Date(dailyReportSaya.data.tanggal_selesai)
        )
      );
    }
  }, [currentMonth, agendaEntries, dailyReportSaya]);

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
      new Date(dailyReportSaya!.data!.tanggal_mulai).getFullYear() * 12 +
      new Date(dailyReportSaya!.data!.tanggal_mulai).getMonth();
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
      new Date(dailyReportSaya!.data!.tanggal_selesai).getFullYear() * 12 +
      new Date(dailyReportSaya!.data!.tanggal_selesai).getMonth();
    const nextMonthIndex = nextMonth.getFullYear() * 12 + nextMonth.getMonth();
    if (nextMonthIndex <= endMonth) {
      setCurrentMonth(nextMonth);
    }
  };

  const isPrevDisabled = () => {
    if (!dailyReportSaya?.data?.tanggal_mulai) return true;
    const prevMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const startMonth =
      new Date(dailyReportSaya.data.tanggal_mulai).getFullYear() * 12 +
      new Date(dailyReportSaya.data.tanggal_mulai).getMonth();
    return prevMonth.getFullYear() * 12 + prevMonth.getMonth() < startMonth;
  };

  const isNextDisabled = () => {
    if (!dailyReportSaya?.data?.tanggal_selesai) return true;
    const nextMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    const endMonth =
      new Date(dailyReportSaya.data.tanggal_selesai).getFullYear() * 12 +
      new Date(dailyReportSaya.data.tanggal_selesai).getMonth();
    return nextMonth.getFullYear() * 12 + nextMonth.getMonth() > endMonth;
  };

  const handleDateClick = (day: CalendarDay): void => {
    if (day.hasEntry && day.entry) {
      navigate(
        `/mahasiswa/kerja-praktik/daily-report/detail?id=${day.entry.id}`
      );
    }
  };

  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (isModalPresensiOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMahasiswaLocation({ lat: latitude, lng: longitude });
          setLocationError(null);

          if (instansiLocation.lat && instansiLocation.lng) {
            const distance = haversineDistance(
              latitude,
              longitude,
              instansiLocation.lat,
              instansiLocation.lng
            );
            setIsWithinRadius(distance <= 500);
          } else {
            setLocationError("Lokasi instansi tidak ditemukan.");
            setIsWithinRadius(false);
          }
        },
        (err) => {
          setLocationError(
            "Gagal mendapatkan lokasi nih, Pastikan izin lokasi kamu aktif! 😉"
          );
          setMahasiswaLocation(null);
          setIsWithinRadius(false);
          console.error("Geolocation:", err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [isModalPresensiOpen, instansiLocation.lat, instansiLocation.lng]);

  const formatDate = (date: string): string => {
    try {
      return new Date(date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const getSemester = (nim: string): number => {
    try {
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
    } catch {
      return 0;
    }
  };

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

  const getStatusKP = (status: string): string => {
    switch (status) {
      case "Lanjut":
        return "bg-amber-500";
      case "Gagal":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const handlePresensiClick = () => {
    setIsModalPresensiOpen(true);
  };

  const today = new Date().toISOString().split("T")[0];

  const hasAttendedToday =
    dailyReportSaya?.data?.daily_report?.some(
      (report: { tanggal_presensi: string }) =>
        report.tanggal_presensi.split("T")[0] === today
    ) || false;

  const handleConfirmPresensi = async () => {
    if (!mahasiswaLocation) {
      toast.error("Lokasi kamu ga dapet nih, silakan coba lagi! 😮‍💨");
      return;
    }

    setIsSubmitting(true);
    try {
      await APIKerjaPraktik.postDailyReport({
        latitude: mahasiswaLocation.lat,
        longitude: mahasiswaLocation.lng,
      });
      toast.success("Presensi berhasil!", {
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10B981",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["daily-report-saya"] });
      setIsModalPresensiOpen(false);
      setMahasiswaLocation(null);
      setIsWithinRadius(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Presensi gagal!";
      toast.error(errorMessage, {
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#EF4444",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLihatNilaiClick = () => {
    setIsModalNilaiOpen(true);
  };

  const approvedCount =
    dailyReportSaya?.data?.daily_report?.filter(
      (report: { status: string }) => report.status === "Disetujui"
    ).length || 0;

  const hasNilai =
    dailyReportSaya?.data?.nilai &&
    dailyReportSaya.data.nilai.some(
      (nilai) => typeof nilai.nilai_instansi === "number"
    ) &&
    dailyReportSaya.data.nilai.some((nilai) => !isNaN(nilai.nilai_instansi));

  const handleCetakClick = async () => {
    if (!dailyReportSaya?.data || approvedCount < 22) return;

    setIsPrinting(true);
    try {
      const doc = new jsPDF();
      doc.addFileToVFS("GeistSansBold.ttf", GeistSansBold);
      doc.addFileToVFS("GeistSansRegular.ttf", GeistSansRegular);
      doc.addFont("GeistSansBold.ttf", "GeistSans", "bold");
      doc.addFont("GeistSansRegular.ttf", "GeistSans", "normal");

      // Add Logo
      const logoWidth = 30;
      const logoHeight = 30;
      doc.addImage(uinSuskaLogo, "JPEG", 15, 10, logoWidth, logoHeight);

      // Header
      doc.setFont("GeistSans", "bold");
      doc.setFontSize(16);
      doc.setTextColor("#111827");
      doc.text("Laporan Harian Kerja Praktik Mahasiswa", 50, 20);
      doc.setFontSize(12);
      doc.setFont("GeistSans", "normal");
      doc.text("Universitas Islam Negeri Sultan Syarif Kasim Riau", 50, 28);
      doc.text("Fakultas Sains dan Teknologi", 50, 34);

      // Biodata Section
      doc.setFont("GeistSans", "bold");
      doc.setFontSize(14);
      doc.text("Biodata Mahasiswa", 15, 50);
      doc.setLineWidth(0.5);
      doc.setDrawColor("#4F46E5");
      doc.line(15, 52, 195, 52);

      const biodata = [
        [
          { content: "Nama", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.mahasiswa?.nama || "-",
        ],
        [
          { content: "NIM", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.mahasiswa?.nim || "-",
        ],
        [
          { content: "Tahun Ajaran", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.tahun_ajaran?.nama || "-",
        ],
        [
          { content: "Judul Kerja Praktik", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.judul_kp || "-",
        ],
        [
          { content: "Instansi", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.instansi?.nama || "-",
        ],
        [
          { content: "Pembimbing Instansi", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.pembimbing_instansi?.nama || "-",
        ],
        [
          { content: "Dosen Pembimbing", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.dosen_pembimbing?.nama || "-",
        ],
        [
          { content: "Periode", styles: { fontStyle: "bold" } },
          `${formatDate(dailyReportSaya.data.tanggal_mulai)} - ${formatDate(
            dailyReportSaya.data.tanggal_selesai
          )}`,
        ],
        [
          { content: "Status", styles: { fontStyle: "bold" } },
          dailyReportSaya.data.status || "-",
        ],
      ];

      autoTable(doc, {
        startY: 55,
        body: biodata.map((row) =>
          row.map((cell) =>
            typeof cell === "string"
              ? cell
              : {
                  ...cell,
                  styles: {
                    ...cell.styles,
                    fontStyle: cell.styles.fontStyle as
                      | "bold"
                      | "italic"
                      | "normal",
                  },
                }
          )
        ),
        theme: "plain",
        styles: { font: "GeistSans", fontSize: 10, textColor: "#111827" },
        columnStyles: {
          0: { cellWidth: 50, fontStyle: "bold" },
          1: { cellWidth: 130 },
        },
        margin: { left: 15, right: 15 },
      });

      // Daily Report Table
      let finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("GeistSans", "bold");
      doc.setFontSize(14);
      doc.text("Daftar Laporan Harian", 15, finalY);
      doc.setLineWidth(0.5);
      doc.setDrawColor("#4F46E5");
      doc.line(15, finalY + 2, 195, finalY + 2);
      finalY += 8;

      const dailyReportData = (dailyReportSaya.data.daily_report || []).map(
        (report, index) => ({
          no: index + 1,
          tanggal: formatDate(report.tanggal_presensi),
          status: report.status || "Menunggu",
          catatan: report.catatan_evaluasi || "-",
          details: report.detail_daily_report || [],
        })
      );

      dailyReportData.forEach((report, index) => {
        autoTable(doc, {
          startY: finalY,
          head: [["Hari Ke-", "Tanggal", "Status", "Catatan Evaluasi"]],
          body: [
            [
              report.no,
              report.tanggal,
              {
                content: report.status,
                styles: {
                  fillColor: getStatusValidasi(report.status),
                  textColor: "#FFFFFF",
                  halign: "center",
                  cellPadding: { top: 2, bottom: 2, left: 4, right: 4 },
                },
              },
              report.catatan,
            ],
          ],
          theme: "striped",
          styles: { font: "GeistSans", fontSize: 10, textColor: "#111827" },
          headStyles: {
            fillColor: "#4F46E5",
            textColor: "#FFFFFF",
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: index % 2 === 0 ? "#F3F4F6" : "#FFFFFF",
          },
          margin: { left: 15, right: 15 },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 50 },
            2: { cellWidth: 30 },
            3: { cellWidth: 60 },
          },
        });

        finalY = (doc as any).lastAutoTable.finalY + 5;

        if (report.details.length > 0) {
          autoTable(doc, {
            startY: finalY,
            head: [
              [
                "Waktu Mulai",
                "Waktu Selesai",
                "Judul Agenda",
                "Deskripsi Agenda",
              ],
            ],
            body: report.details.map((detail) => [
              detail.waktu_mulai || "-",
              detail.waktu_selesai || "-",
              detail.judul_agenda || "-",
              detail.deskripsi_agenda || "-",
            ]),
            theme: "striped",
            styles: { font: "GeistSans", fontSize: 9, textColor: "#111827" },
            headStyles: {
              fillColor: "#6B7280",
              textColor: "#FFFFFF",
              fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: "#F9FAFB" },
            margin: { left: 25, right: 15 },
            columnStyles: {
              0: { cellWidth: 30 },
              1: { cellWidth: 30 },
              2: { cellWidth: 50 },
              3: { cellWidth: 60 },
            },
          });
          finalY = (doc as any).lastAutoTable.finalY + 10;
        }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("GeistSans", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#6B7280");
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 25,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
        doc.text(
          `Generated on ${formatDate(new Date().toISOString())}`,
          15,
          doc.internal.pageSize.height - 10
        );
      }

      // Save PDF
      const nim = dailyReportSaya.data.mahasiswa?.nim || "Unknown";
      const nama =
        dailyReportSaya.data.mahasiswa?.nama.replace(/\s+/g, "_") || "Unknown";
      doc.save(`[Daily Report Kerja Praktik] - ${nim} - ${nama}.pdf`);
      toast.success("PDF berhasil diunduh!", {
        style: {
          background: "#10B981",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } catch (err) {
      toast.error("Gagal membuat PDF!", {
        style: {
          background: "#EF4444",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const mahasiswaMarker = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <DashboardLayout>
      <Toaster position="top-right" />
      <CardHeader className="pb-2">
        <CardTitle className="mb-2 text-2xl font-bold sm:text-3xl sm:mb-0">
          Daily Report Kerja Praktik
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Error Message */}
        {isError && (
          <Card className="inline-block border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700">
            <CardContent className="flex items-center gap-2.5 p-4 font-medium text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              {error?.message}
            </CardContent>
          </Card>
        )}
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800/30 dark:border-gray-700">
              <div className="flex items-center justify-between p-4 mb-4 border-b border-gray-100 rounded-t-lg bg-gradient-to-br from-purple-600/40 to-indigo-700/40 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="w-40 h-5 mb-2" />
                    <div className="flex items-center">
                      <Skeleton className="w-20 h-4 mr-2" />
                      <Skeleton className="w-16 h-4" />
                    </div>
                  </div>
                </div>
                <Skeleton className="w-24 h-8 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Skeleton className="w-full h-24 rounded-lg" />
                <Skeleton className="w-full h-24 rounded-lg" />
                <Skeleton className="w-full h-24 rounded-lg" />
              </div>
            </div>
            <div className="p-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <Skeleton className="w-64 h-5 rounded" />
                <div className="flex w-full gap-2 sm:w-auto">
                  <Skeleton className="w-24 h-10 rounded" />
                  <Skeleton className="w-24 h-10 rounded" />
                  <Skeleton className="w-24 h-10 rounded" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <Skeleton className="w-48 h-8 mx-auto mb-4" />
              <div className="grid grid-cols-7 gap-2">
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-8 rounded-md" />
                  ))}
              </div>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {Array(42)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={`day-${i}`} className="h-24 rounded-md" />
                  ))}
              </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        {!isLoading && !isError && dailyReportSaya?.data && (
          <div className="space-y-6">
            {/* Biodata Section */}
            <div className="overflow-hidden border border-gray-100 rounded-lg shadow-md bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 dark:border-gray-700">
              <div className="flex items-center justify-between p-4 text-white border-b border-gray-100 bg-gradient-to-br from-purple-600 to-indigo-700 dark:border-gray-700">
                <div className="flex items-center gap-3 py-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-white border rounded-full shadow-inner dark:bg-gray-800 border-primary/20">
                    <User className="w-8 h-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-50 dark:text-gray-100">
                      {dailyReportSaya.data.mahasiswa?.nama}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-white text-gray-600 dark:text-gray-300 dark:bg-gray-800 px-2 py-0.5 rounded-md border dark:border-gray-700 text-xs font-medium mr-2">
                        {dailyReportSaya.data.mahasiswa?.nim}
                      </span>
                      <span className="bg-white text-gray-600 dark:text-gray-300 dark:bg-gray-800 px-2 py-0.5 rounded-md border dark:border-gray-700 text-xs font-medium mr-2">
                        Semester{" "}
                        {getSemester(dailyReportSaya.data.mahasiswa?.nim)}
                      </span>
                      <span className="flex items-center text-white">
                        <span
                          className={`inline-block animate-pulse w-3 h-3 rounded-full mr-1.5 ${getStatusKP(
                            dailyReportSaya.data.status
                          )}`}
                        />
                        {dailyReportSaya.data.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-0.5 bg-white border border-gray-200 rounded-full shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {dailyReportSaya.data.tahun_ajaran?.nama}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="relative p-4 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md group">
                    <div className="absolute top-0 right-0 w-16 h-16 transition-transform duration-300 translate-x-6 -translate-y-6 bg-blue-100 rounded-bl-full dark:bg-blue-900/20 group-hover:translate-y-0 group-hover:translate-x-0"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2.5">
                        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          Instansi
                        </p>
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {dailyReportSaya.data.instansi?.nama}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative p-4 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md group">
                    <div className="absolute top-0 right-0 w-16 h-16 transition-transform duration-300 translate-x-6 -translate-y-6 rounded-bl-full bg-emerald-100 dark:bg-emerald-900/20 group-hover:translate-y-0 group-hover:translate-x-0"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-2.5">
                        <ContactRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          Pembimbing Instansi
                        </p>
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {dailyReportSaya.data.pembimbing_instansi?.nama}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative p-4 overflow-hidden transition-all duration-300 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800/50 dark:border-gray-700 hover:shadow-md group">
                    <div className="absolute top-0 right-0 w-16 h-16 transition-transform duration-300 translate-x-6 -translate-y-6 bg-purple-100 rounded-bl-full dark:bg-purple-900/20 group-hover:translate-y-0 group-hover:translate-x-0"></div>
                    <div className="relative z-10 flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2.5">
                        <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                          Dosen Pembimbing
                        </p>
                        <p className="text-base font-bold text-gray-800 dark:text-gray-200">
                          {dailyReportSaya.data.dosen_pembimbing?.nama}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons Section */}
            <div className="p-4 border border-gray-100 rounded-lg shadow-md bg-gradient-to-r from-white to-gray-50 dark:from-gray-800/40 dark:to-gray-800/20 dark:border-gray-700">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-md text-primary">
                    {formatDate(dailyReportSaya.data.tanggal_mulai)}
                  </span>
                  <span> - </span>
                  <span className="text-md text-primary">
                    {formatDate(dailyReportSaya.data.tanggal_selesai)}
                  </span>
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  {/* Tombol Presensi */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className={`flex items-center w-full gap-2 text-white sm:w-auto ${
                            hasAttendedToday
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                          }`}
                          onClick={handlePresensiClick}
                          disabled={hasAttendedToday}
                        >
                          {hasAttendedToday ? (
                            <>
                              <Lock className="w-4 h-4" />
                              Presensi
                            </>
                          ) : (
                            <>
                              <ClipboardCheck className="w-4 h-4" />
                              Presensi
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {hasAttendedToday
                          ? "Kamu sudah presensi hari ini..."
                          : "Presensi harian kerja praktik..."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* Tombol Cetak Daily Report */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={
                            approvedCount >= 22 ? "secondary" : "outline"
                          }
                          className={`flex items-center w-full gap-2 sm:w-auto ${
                            approvedCount < 22
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          disabled={approvedCount < 22 || isPrinting}
                          onClick={handleCetakClick}
                        >
                          {approvedCount >= 22 ? (
                            <>
                              <Printer className="w-4 h-4 text-green-500" />
                              {isPrinting ? "Mencetak..." : "Cetak"}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              Cetak
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {approvedCount >= 22
                          ? "Cetak daily report..."
                          : `Min. (${approvedCount}/22) hari yang telah disetujui...`}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {/* Tombol Lihat Nilai */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full sm:w-auto">
                          <Button
                            variant={hasNilai ? "secondary" : "outline"}
                            className={`flex items-center w-full gap-2 sm:w-auto ${
                              hasNilai ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                            disabled={!hasNilai}
                            onClick={handleLihatNilaiClick}
                          >
                            {hasNilai ? (
                              <>
                                <Eye className="w-4 h-4 text-blue-500" />
                                Nilai
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                Nilai
                              </>
                            )}
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {hasNilai
                          ? "Lihat nilai dari pembimbing instansi..."
                          : "Nilai belum diberikan pembimbing instansi..."}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            {/* Calendar Section */}
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
                    day.date <= new Date(new Date().setHours(23, 59, 59, 999));

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
                      onClick={() => day.hasEntry && handleDateClick(day)}
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
                                      ${getStatusValidasi(day.entry.status)}
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
                {/* <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Menunggu</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Revisi</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Hari Libur</span>
                </div> */}
                {agendaEntries.length === 0 && (
                  <div className="ml-auto text-sm text-gray-500">
                    <Calendar className="inline-block w-4 h-4 mr-1 opacity-50" />
                    <span>Klik tombol "Presensi" untuk menambahkan.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {/* Modal Presensi */}
      <Dialog open={isModalPresensiOpen} onOpenChange={setIsModalPresensiOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Presensi Daily Report
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {locationError ? (
              <p className="text-center text-red-500">{locationError}</p>
            ) : mahasiswaLocation ? (
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[mahasiswaLocation.lat, mahasiswaLocation.lng]}
                  zoom={50}
                  style={{ height: "100%", width: "100%" }}
                  className="animate-fade-in"
                >
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                  <Marker
                    position={[mahasiswaLocation.lat, mahasiswaLocation.lng]}
                    icon={mahasiswaMarker}
                  >
                    <Popup>Lokasi Kamu</Popup>
                  </Marker>
                  {instansiLocation.lat !== 0 && instansiLocation.lng !== 0 && (
                    <Circle
                      center={[instansiLocation.lat, instansiLocation.lng]}
                      radius={500}
                      pathOptions={{
                        color: "blue",
                        fillColor: "blue",
                        fillOpacity: 0.1,
                        weight: 2,
                      }}
                    />
                  )}
                </MapContainer>
              </div>
            ) : (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            )}
            {!locationError && mahasiswaLocation && (
              <p
                className={`text-center mt-4 ${
                  isWithinRadius ? "text-green-500" : "text-red-500"
                }`}
              >
                {isWithinRadius
                  ? "Kamu berada dalam radius instansi."
                  : "Kamu berada di luar radius instansi. Harap mendekati lokasi instansi."}
              </p>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalPresensiOpen(false)}
              className="mr-2"
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmPresensi}
              className="text-white bg-emerald-500 hover:bg-emerald-600"
              disabled={!mahasiswaLocation || !isWithinRadius || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Mengirim...
                </span>
              ) : (
                "Konfirmasi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Modal Lihat Nilai */}
      <Dialog open={isModalNilaiOpen} onOpenChange={setIsModalNilaiOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-gray-50 to-gray-200 shadow-xl rounded-lg p-6 animate-in fade-in">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Detail Nilai
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {dailyReportSaya?.data?.nilai ? (
              <>
                {/* Nilai dari Pembimbing Instansi */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      Nilai dari Pembimbing Instansi:
                    </span>
                    {dailyReportSaya.data.nilai.some(
                      (nilai) => nilai.nilai_instansi
                    ) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                {/* Komponen Penilaian Pembimbing Instansi */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Komponen Penilaian Pembimbing Instansi
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {dailyReportSaya.data.nilai.map((nilai, index) =>
                      nilai.komponen_penilaian_instansi
                        ? Object.entries(nilai.komponen_penilaian_instansi).map(
                            ([key, value]) => (
                              <div
                                key={`${index}-${key}`}
                                className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm"
                              >
                                <span className="font-medium capitalize">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                {value ? (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            )
                          )
                        : null
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">
                Nilai belum diberikan oleh Pembimbing Instansi!
              </p>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="text-white bg-emerald-500 hover:bg-emerald-600"
              onClick={() => setIsModalNilaiOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MahasiswaKerjaPraktikDailyReportPage;
