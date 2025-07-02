import L from "leaflet";
import jsPDF from "jspdf";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import uinSuskaLogo from "@/assets/uin_suska_logo.jpg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIKerjaPraktik from "@/services/api/mahasiswa/daily-report.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { CardContent, CardHeader } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
	CheckCircle,
	XCircle,
	Eye,
	AlertTriangleIcon,
	BookOpen,
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
					const error = new Error(err.response.data.message);
					(error as any).status = err.response.status;
					throw error;
				}
				throw err;
			}
		},
		staleTime: Infinity,
		retry: (failureCount, error: any) => {
			if (error.status === 404) {
				return false;
			}
			return failureCount < 3;
		},
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
			console.log(dailyReportSaya.data.daily_report);
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
			const today = new Date(
				Date.UTC(
					new Date().getUTCFullYear(),
					new Date().getUTCMonth(),
					new Date().getUTCDate()
				)
			);
			const startDate = new Date(dailyReportSaya.data.tanggal_mulai);
			const endDate = new Date(dailyReportSaya.data.tanggal_selesai);

			if (today >= startDate && today <= endDate) {
				setCurrentMonth(
					new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
				);
			} else {
				setCurrentMonth(
					new Date(
						Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1)
					)
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
					dailyReportSaya.data.tanggal_mulai,
					dailyReportSaya.data.tanggal_selesai
				)
			);
		}
	}, [currentMonth, agendaEntries, dailyReportSaya]);

	const generateCalendarDays = (
		monthDate: Date,
		startDate: string,
		endDate: string
	): CalendarDay[] => {
		const year = monthDate.getUTCFullYear();
		const month = monthDate.getUTCMonth();

		// Extract YYYY-MM-DD from API dates
		const startDateStr = startDate.split("T")[0];
		const endDateStr = endDate.split("T")[0];

		// Create start and end dates at midnight UTC
		const start = new Date(
			Date.UTC(
				parseInt(startDateStr.split("-")[0]),
				parseInt(startDateStr.split("-")[1]) - 1,
				parseInt(startDateStr.split("-")[2])
			)
		);
		const end = new Date(
			Date.UTC(
				parseInt(endDateStr.split("-")[0]),
				parseInt(endDateStr.split("-")[1]) - 1,
				parseInt(endDateStr.split("-")[2])
			)
		);

		const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
		const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0));
		const firstDayWeekday = firstDayOfMonth.getUTCDay();
		const daysFromPrevMonth = firstDayWeekday;

		const prevMonthLastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
		const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
			const date = new Date(
				Date.UTC(year, month - 1, prevMonthLastDay - daysFromPrevMonth + i + 1)
			);
			const dateStr = date.toISOString().split("T")[0];
			const isWithinPeriod = date >= start && date <= end;
			const entry = agendaEntries.find(
				(entry) => entry.tanggal_presensi === dateStr
			);

			return {
				date,
				isCurrentMonth: false,
				isWithinPeriod,
				hasEntry: !!entry,
				entry: entry || null,
				isStartDate: dateStr === startDateStr,
				isEndDate: dateStr === endDateStr,
			};
		});

		const currentMonthDays = Array.from(
			{ length: lastDayOfMonth.getUTCDate() },
			(_, i) => {
				const date = new Date(Date.UTC(year, month, i + 1));
				const dateStr = date.toISOString().split("T")[0];
				const isWithinPeriod = date >= start && date <= end;
				const entry = agendaEntries.find(
					(entry) => entry.tanggal_presensi === dateStr
				);

				return {
					date,
					isCurrentMonth: true,
					isWithinPeriod,
					hasEntry: !!entry,
					entry: entry || null,
					isStartDate: dateStr === startDateStr,
					isEndDate: dateStr === endDateStr,
				};
			}
		);

		const totalDaysShown = 42;
		const daysFromNextMonth =
			totalDaysShown - prevMonthDays.length - currentMonthDays.length;

		const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => {
			const date = new Date(Date.UTC(year, month + 1, i + 1));
			const dateStr = date.toISOString().split("T")[0];
			const isWithinPeriod = date >= start && date <= end;
			const entry = agendaEntries.find(
				(entry) => entry.tanggal_presensi === dateStr
			);

			return {
				date,
				isCurrentMonth: false,
				isWithinPeriod,
				hasEntry: !!entry,
				entry: entry || null,
				isStartDate: dateStr === startDateStr,
				isEndDate: dateStr === endDateStr,
			};
		});

		return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
	};

	const handlePrevMonth = () => {
		setCurrentMonth(
			new Date(
				Date.UTC(
					currentMonth.getUTCFullYear(),
					currentMonth.getUTCMonth() - 1,
					1
				)
			)
		);
	};

	const handleNextMonth = () => {
		setCurrentMonth(
			new Date(
				Date.UTC(
					currentMonth.getUTCFullYear(),
					currentMonth.getUTCMonth() + 1,
					1
				)
			)
		);
	};

	const isPrevDisabled = () => {
		if (!dailyReportSaya?.data?.tanggal_mulai) return true;
		const startDate = new Date(
			dailyReportSaya.data.tanggal_mulai.split("T")[0]
		);
		const prevMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)
		);
		return (
			prevMonth <
			new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
		);
	};

	const isNextDisabled = () => {
		if (!dailyReportSaya?.data?.tanggal_selesai) return true;
		const endDate = new Date(
			dailyReportSaya.data.tanggal_selesai.split("T")[0]
		);
		const nextMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)
		);
		return (
			nextMonth >
			new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))
		);
	};

	const formatMonthYear = (date: Date): string => {
		return date.toLocaleDateString("id-ID", {
			month: "long",
			year: "numeric",
		});
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

	const formatCetakDate = (date: string): string => {
		try {
			return new Date(date).toLocaleDateString("id-ID", {
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

	const isWithinPeriod =
		dailyReportSaya?.data?.tanggal_mulai &&
		dailyReportSaya?.data?.tanggal_selesai
			? today >= dailyReportSaya.data.tanggal_mulai.split("T")[0] &&
			  today <= dailyReportSaya.data.tanggal_selesai.split("T")[0]
			: false;

	const isPresensiDisabled = hasAttendedToday || !isWithinPeriod;

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
			toast.success("Presensi berhasil!");
			queryClient.invalidateQueries({ queryKey: ["daily-report-saya"] });
			setIsModalPresensiOpen(false);
			setMahasiswaLocation(null);
			setIsWithinRadius(false);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Presensi gagal!";
			toast.error(errorMessage);
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
		);

	const handleCetakClick = () => {
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
			doc.setTextColor("#000000");
			doc.text("Daily Report Kerja Praktik Mahasiswa", 50, 18);
			doc.setFontSize(12);
			doc.setFont("GeistSans", "normal");
			doc.text("Teknik Informatika", 50, 26);
			doc.text("Fakultas Sains dan Teknologi", 50, 32);
			doc.text("Universitas Islam Negeri Sultan Syarif Kasim Riau", 50, 38);

			// Biodata Section
			doc.setLineWidth(0.5);
			doc.setDrawColor("#000000");
			doc.line(15, 46, 195, 46);

			const biodata = [
				[
					{ content: "Nama", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.mahasiswa?.nama || "-"}`,
				],
				[
					{ content: "NIM", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.mahasiswa?.nim || "-"}`,
				],

				[
					{ content: "Instansi", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.instansi?.nama || "-"}`,
				],
				[
					{ content: "Pembimbing Instansi", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.pembimbing_instansi?.nama || "-"}`,
				],
				[
					{ content: "Dosen Pembimbing", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.dosen_pembimbing?.nama || "-"}`,
				],
				[
					{ content: "Judul Kerja Praktik", styles: { fontStyle: "bold" } },
					`:   ${dailyReportSaya.data.judul_kp || "-"}`,
				],
				[
					{ content: "Periode Kerja Praktik", styles: { fontStyle: "bold" } },
					`:   ${formatCetakDate(
						dailyReportSaya.data.tanggal_mulai
					)} - ${formatCetakDate(dailyReportSaya.data.tanggal_selesai)}`,
				],
			];

			autoTable(doc, {
				startY: 50,
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
				styles: { font: "GeistSans", fontSize: 10, textColor: "#000000" },
				columnStyles: {
					0: { cellWidth: 50, fontStyle: "bold" },
					1: { cellWidth: 130 },
				},
				margin: { left: 15, right: 15 },
			});

			// Daily Report Table
			let finalY = (doc as any).lastAutoTable.finalY + 6;
			const dailyReportData = (dailyReportSaya.data.daily_report || []).map(
				(report, index) => {
					const details = report.detail_daily_report || [];
					const waktu = details
						.map(
							(detail) =>
								`${detail.waktu_mulai || "-"} - ${detail.waktu_selesai || "-"}`
						)
						.join("\n\n");
					const kegiatan = details
						.map((detail) => detail.deskripsi_agenda || "-")
						.join("\n\n");

					return {
						hariKe: index + 1,
						tanggal: formatCetakDate(report.tanggal_presensi),
						waktu,
						kegiatan,
						catatanEvaluasi: report.catatan_evaluasi || "-",
					};
				}
			);

			// Single Daily Report Table
			autoTable(doc, {
				startY: finalY,
				head: [
					["Hari Ke-", "Tanggal", "Waktu", "Kegiatan", "Catatan Evaluasi"],
				],
				body: dailyReportData.map((report) => [
					report.hariKe,
					report.tanggal,
					report.waktu,
					report.kegiatan,
					report.catatanEvaluasi,
				]),
				theme: "striped",
				styles: {
					font: "GeistSans",
					fontSize: 8,
					textColor: "#000000",
					cellPadding: 3,
					overflow: "linebreak",
				},
				headStyles: {
					fillColor: "#000000",
					textColor: "#ffffff",
					halign: "center",
					fontStyle: "bold",
					fontSize: 9,
				},
				margin: { left: 15, right: 15 },
				columnStyles: {
					0: { cellWidth: 25, halign: "center" }, // Hari Ke-
					1: { cellWidth: 25, halign: "center" }, // Tanggal
					2: { cellWidth: 30, halign: "center" }, // Waktu
					3: { cellWidth: 65 }, // Kegiatan
					4: { cellWidth: 35 }, // Catatan Evaluasi
				},
			});

			finalY = (doc as any).lastAutoTable.finalY + 20;

			const currentY = finalY;
			const pageHeight = doc.internal.pageSize.height - 20; // Subtract margin from bottom
			if (currentY > pageHeight - 100) {
				// Check if there's enough space (adjust 100 based on content height)
				doc.addPage();
				finalY = 20; // Reset Y position for new page
			}

			doc.setFont("GeistSans", "bold");
			doc.setFontSize(10);
			doc.text("KESIMPULAN KEGIATAN KERJA PRAKTIK", 15, finalY);
			finalY += 4;
			doc.setLineWidth(0.5);
			doc.setDrawColor("#000000");
			doc.rect(15, finalY, 180, 65);

			doc.setFont("GeistSans", "normal");
			doc.setFontSize(10);
			doc.text(
				"Berdasarkan daily report dan kesimpulan kegiatan KP yang telah selesai dilaksanakan oleh mahasiswa, maka yang bersangkutan dinyatakan telah selesai melaksanakan KP dan mendapatkan persetujuan untuk mendaftar Diseminasi KP.",
				15,
				finalY + 65 + 10, // Start below the rectangle with some padding
				{ maxWidth: 180, align: "justify" }
			);
			finalY += 95;

			// First Row: Pembimbing Instansi and Mahasiswa
			doc.setFont("GeistSans", "normal");
			doc.setFontSize(10);
			doc.text("Mengetahui,", 15, finalY);
			doc.text(
				"Pekanbaru, " + formatCetakDate(new Date().toISOString()),
				135,
				finalY
			);
			finalY += 5;
			doc.text("Pembimbing Instansi KP", 15, finalY);
			doc.text("Mahasiswa yang bersangkutan,", 135, finalY);
			finalY += 30;

			// Signature placeholders for Pembimbing Instansi and Mahasiswa
			if (finalY > pageHeight - 40) {
				// Check space for signature lines
				doc.addPage();
				finalY = 20;
			}
			doc.setLineWidth(0.5);
			doc.setDrawColor("#000000");
			doc.line(15, finalY, 75, finalY); // Line for Pembimbing Instansi
			doc.line(135, finalY, 195, finalY); // Line for Mahasiswa
			finalY += 5;

			// Names under signature lines
			if (finalY > pageHeight - 20) {
				// Check space for names
				doc.addPage();
				finalY = 20;
			}
			doc.setFont("GeistSans", "normal");
			doc.setFontSize(10);
			doc.text(
				dailyReportSaya.data.pembimbing_instansi?.nama || "-",
				15,
				finalY
			);
			doc.text(dailyReportSaya.data.mahasiswa?.nama || "-", 135, finalY);
			finalY += 5;

			// NIK/NIM under names
			if (finalY > pageHeight - 20) {
				// Check space for NIK/NIM
				doc.addPage();
				finalY = 20;
			}
			doc.setFontSize(10);
			doc.text(
				"NIP/NIK. " + (dailyReportSaya.data.pembimbing_instansi?.id || "-"),
				15,
				finalY
			);
			doc.text(
				"NIM. " + (dailyReportSaya.data.mahasiswa?.nim || "-"),
				135,
				finalY
			);

			// Second Row: Dosen Pembimbing
			finalY += 25;
			if (finalY > pageHeight - 80) {
				// Check space for the next block
				doc.addPage();
				finalY = 20;
			}
			doc.setFont("GeistSans", "normal");
			doc.setFontSize(10);
			doc.text("Menyetujui,", 75, finalY);
			finalY += 5;
			doc.text("Dosen Pembimbing KP", 75, finalY);
			finalY += 30;

			// Signature placeholder for Dosen Pembimbing
			if (finalY > pageHeight - 40) {
				// Check space for signature line
				doc.addPage();
				finalY = 20;
			}
			doc.setLineWidth(0.5);
			doc.setDrawColor("#000000");
			doc.line(75, finalY, 135, finalY); // Line for Dosen Pembimbing
			finalY += 5;

			// Name under signature line
			if (finalY > pageHeight - 20) {
				// Check space for name
				doc.addPage();
				finalY = 20;
			}
			doc.setFont("GeistSans", "normal");
			doc.setFontSize(10);
			doc.text(dailyReportSaya.data.dosen_pembimbing?.nama || "-", 75, finalY);
			finalY += 5;

			// NIP under name
			if (finalY > pageHeight - 20) {
				// Check space for NIP
				doc.addPage();
				finalY = 20;
			}
			doc.setFontSize(10);
			doc.text(
				"NIP. " + (dailyReportSaya.data.dosen_pembimbing?.nip || "-"),
				75,
				finalY
			);
			finalY += 10;

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
					`${formatDate(new Date().toISOString())}`,
					15,
					doc.internal.pageSize.height - 10
				);
			}

			// Save PDF
			const nim = dailyReportSaya.data.mahasiswa?.nim || "-";
			const nama =
				dailyReportSaya.data.mahasiswa?.nama.replace(/\s+/g, "_") || "-";
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
			console.error("PDF creation error:", err);
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

	const calculateGrade = (score: number) => {
		if (score >= 85) return { grade: "A", color: "text-green-600" };
		if (score >= 80) return { grade: "A-", color: "text-green-600" };
		if (score >= 75) return { grade: "B+", color: "text-blue-600" };
		if (score >= 70) return { grade: "B", color: "text-blue-600" };
		if (score >= 65) return { grade: "B-", color: "text-blue-600" };
		if (score >= 60) return { grade: "C+", color: "text-yellow-600" };
		if (score >= 55) return { grade: "C", color: "text-yellow-600" };
		if (score >= 50) return { grade: "C-", color: "text-yellow-600" };
		if (score >= 40) return { grade: "D", color: "text-orange-600" };
		return { grade: "E", color: "text-red-600" };
	};

	const nilaiSaya = dailyReportSaya?.data?.nilai?.[0];
	const nilai_instansi = nilaiSaya?.nilai_instansi;
	const nilai_pembimbing = nilaiSaya?.nilai_pembimbing;
	const komponen_penilaian_instansi = nilaiSaya?.komponen_penilaian_instansi;
	const komponen_penilaian_pembimbing =
		nilaiSaya?.komponen_penilaian_pembimbing;
	const instansiGrade = calculateGrade(nilai_instansi ?? 0);
	const pembimbingGrade = calculateGrade(nilai_pembimbing ?? 0);

	return (
		<DashboardLayout>
			<CardHeader className="p-0 pt-0 pb-2 sm:pb-3 sm:pt-0">
				<div className="flex">
					<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
						<span
							className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
						/>
						<BookOpen className="w-4 h-4 mr-1.5" />
						Daily Report Kerja Praktik Mahasiswa
					</span>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				{/* Error Message */}
				{isError && (
					<div className="relative flex items-center justify-center h-[83vh] overflow-hidden">
						<div className="absolute inset-0 z-0 backdrop-blur-3xl border border-gray-200 dark:border-gray-700 rounded-xl border-foreground/30"></div>
						<div className="relative z-50 max-w-sm w-full p-6 rounded-2xl border border-yellow-400/30 bg-yellow-100/50 dark:bg-yellow-900/20 dark:border-yellow-500/30 shadow-2xl backdrop-blur-md">
							<div className="flex flex-col items-center text-center">
								<div className="p-3 rounded-full bg-yellow-100/80 dark:bg-yellow-900/50 shadow-md">
									<Lock className="w-10 h-10 text-yellow-600 dark:text-yellow-300" />
								</div>
								<p className="mt-4 text-sm text-yellow-700 dark:text-yellow-300 font-medium">
									{error?.message}
								</p>
							</div>
						</div>
					</div>
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
						<div className="py-4">
							<Skeleton className="w-full h-8 mx-auto mb-4 -mt-5" />
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
					<div className="space-y-5">
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
								<div className="px-3 hidden sm:block py-0.5 bg-white border border-gray-200 rounded-full shadow-sm dark:bg-gray-800 dark:border-gray-700">
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
														isPresensiDisabled
															? "bg-gray-400 cursor-not-allowed"
															: "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
													}`}
													onClick={handlePresensiClick}
													disabled={isPresensiDisabled}
												>
													{isPresensiDisabled ? (
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
													: !isWithinPeriod
													? "Presensi hanya bisa dilakukan selama periode kerja praktik..."
													: "Presensi harian kerja praktik..."}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									{/* Tombol Cetak Daily Report */}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="outline"
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
										day.date.getUTCDay() === 0 || day.date.getUTCDay() === 6;
									const isToday =
										day.date.toISOString().split("T")[0] ===
										new Date().toISOString().split("T")[0];
									const isMissingAttendance =
										day.isWithinPeriod &&
										!day.hasEntry &&
										!isWeekend &&
										day.date <=
											new Date(
												Date.UTC(
													new Date().getUTCFullYear(),
													new Date().getUTCMonth(),
													new Date().getUTCDate()
												)
											);

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
												{day.date.getUTCDate()}
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
								{agendaEntries.length === 0 && (
									<div className="ml-auto text-sm text-gray-500">
										<Calendar className="inline-block w-4 h-4 mr-1 opacity-50" />
										<span>Klik tombol "Presensi" untuk menambahkan...</span>
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
				<DialogContent className="sm:max-w-[700px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 animate-in zoom-in-90">
					<DialogHeader>
						<DialogTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
							Detail Penilaian
						</DialogTitle>
					</DialogHeader>
					<Tabs defaultValue="instansi" className="mt-6">
						<TabsList className="grid w-full grid-cols-2 p-1 bg-gray-200 rounded-lg dark:bg-gray-700">
							<TabsTrigger
								value="instansi"
								className="py-1 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-gray-200 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
							>
								Pembimbing Instansi
							</TabsTrigger>
							<TabsTrigger
								value="pembimbing"
								className="py-1 text-sm font-medium rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-gray-200 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
							>
								Dosen Pembimbing
							</TabsTrigger>
						</TabsList>
						{/* Tab Instansi */}
						<TabsContent value="instansi" className="mt-6 space-y-6">
							{nilai_instansi ? (
								<>
									<div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
										<div>
											<span className="text-3xl font-bold text-gray-800 dark:text-white">
												{nilai_instansi.toFixed(2)}
											</span>
											<span
												className={`ml-2 text-lg font-semibold ${instansiGrade?.color}`}
											>
												({instansiGrade?.grade})
											</span>
										</div>
									</div>
									<div>
										<h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
											Komponen Penilaian:
										</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{komponen_penilaian_instansi &&
												Object.entries(komponen_penilaian_instansi)
													.filter(([key]) => key !== "id" && key !== "masukan")
													.map(([key, value], index) => (
														<div
															key={`${index}-${key}`}
															className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800"
														>
															<span className="font-medium text-gray-600 capitalize dark:text-gray-300">
																{key.replace(/_/g, " ")}
															</span>
															<div className="flex items-center gap-2">
																<span className="font-semibold text-gray-800 dark:text-white">
																	{typeof value === "object"
																		? JSON.stringify(value)
																		: value}
																</span>
																<CheckCircle className="w-5 h-5 text-green-500" />
															</div>
														</div>
													))}
										</div>
										{komponen_penilaian_instansi &&
											Object.entries(komponen_penilaian_instansi)
												.filter(([key]) => key === "masukan")
												.map(([key, value], index) => (
													<div key={`${index}-${key}`} className="mt-4">
														<h4 className="font-semibold text-gray-700 dark:text-gray-200 text-md">
															Masukan:
														</h4>
														<p className="p-3 mt-2 text-gray-600 rounded-lg dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
															{typeof value === "object"
																? JSON.stringify(value)
																: value}
														</p>
													</div>
												))}
									</div>
								</>
							) : (
								<p className="py-6 text-center text-gray-500 dark:text-gray-400">
									❌ Nilai belum diberikan oleh Pembimbing Instansi...
								</p>
							)}
						</TabsContent>
						{/* Tab Pembimbing */}
						<TabsContent value="pembimbing" className="mt-6 space-y-6">
							{nilai_pembimbing ? (
								<>
									<div className="flex items-center justify-center gap-4 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
										<div>
											<span className="text-3xl font-bold text-gray-800 dark:text-white">
												{nilai_pembimbing.toFixed(2)}
											</span>
											<span
												className={`ml-2 text-lg font-semibold ${pembimbingGrade?.color}`}
											>
												({pembimbingGrade?.grade})
											</span>
										</div>
									</div>
									<div>
										<h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
											Komponen Penilaian:
										</h3>
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
											{komponen_penilaian_pembimbing &&
												Object.entries(komponen_penilaian_pembimbing)
													.filter(([key]) => key !== "id" && key !== "catatan")
													.map(([key, value], index) => (
														<div
															key={`${index}-${key}`}
															className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800"
														>
															<span className="font-medium text-gray-600 capitalize dark:text-gray-300">
																{key.replace(/_/g, " ")}
															</span>
															<div className="flex items-center gap-2">
																<span className="font-semibold text-gray-800 dark:text-white">
																	{typeof value === "object"
																		? JSON.stringify(value)
																		: value}
																</span>
																<CheckCircle className="w-5 h-5 text-green-500" />
															</div>
														</div>
													))}
										</div>
										{komponen_penilaian_pembimbing &&
											Object.entries(komponen_penilaian_pembimbing)
												.filter(([key]) => key === "catatan")
												.map(([key, value], index) => (
													<div key={`${index}-${key}`} className="mt-4">
														<h4 className="font-semibold text-gray-700 dark:text-gray-200 text-md">
															Catatan:
														</h4>
														<p className="p-3 mt-2 text-gray-600 rounded-lg dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
															{typeof value === "object"
																? JSON.stringify(value)
																: value}
														</p>
													</div>
												))}
									</div>
								</>
							) : (
								<p className="py-6 text-center text-gray-500 dark:text-gray-400">
									❌ Nilai belum diberikan oleh Dosen Pembimbing...
								</p>
							)}
						</TabsContent>
					</Tabs>
					<div className="flex justify-end mt-6">
						<Button
							variant="outline"
							className="px-6 py-2 font-semibold text-white transition-all rounded-lg bg-emerald-600 hover:bg-emerald-700 hover:text-white"
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
