import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
	UserRoundPenIcon,
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
			const today = new Date(
				Date.UTC(
					new Date().getUTCFullYear(),
					new Date().getUTCMonth(),
					new Date().getUTCDate()
				)
			);
			const startDate = new Date(detailMahasiswaSaya.tanggal_mulai);
			const endDate = new Date(detailMahasiswaSaya.tanggal_selesai);

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
	}, [detailMahasiswaSaya]);

	useEffect(() => {
		if (
			detailMahasiswaSaya?.tanggal_mulai &&
			detailMahasiswaSaya?.tanggal_selesai
		) {
			setCalendarDays(
				generateCalendarDays(
					currentMonth,
					detailMahasiswaSaya.tanggal_mulai,
					detailMahasiswaSaya.tanggal_selesai
				)
			);
		}
	}, [currentMonth, agendaEntries, detailMahasiswaSaya]);

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

	const formatMonthYear = (date: Date): string => {
		return date.toLocaleDateString("id-ID", {
			month: "long",
			year: "numeric",
		});
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
		if (!detailMahasiswaSaya?.tanggal_mulai) return true;
		const startDate = new Date(detailMahasiswaSaya.tanggal_mulai.split("T")[0]);
		const prevMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)
		);
		return (
			prevMonth <
			new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
		);
	};

	const isNextDisabled = () => {
		if (!detailMahasiswaSaya?.tanggal_selesai) return true;
		const endDate = new Date(detailMahasiswaSaya.tanggal_selesai.split("T")[0]);
		const nextMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)
		);
		return (
			nextMonth >
			new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))
		);
	};

	useEffect(() => {
		if (
			detailMahasiswaSaya?.nilai?.[0]?.komponen_penilaian_pembimbing &&
			!isEditingNilai
		) {
			const komponen =
				detailMahasiswaSaya.nilai[0].komponen_penilaian_pembimbing;
			const getValue = (key: string) => {
				if (Array.isArray(komponen)) {
					return typeof komponen[0] === "number" ? komponen[0] : 0;
				} else if (typeof komponen === "object" && komponen !== null) {
					return typeof komponen[key] === "number" ? komponen[key] : 0;
				}
				return 0;
			};
			setEvaluationValues({
				penyelesaian_masalah: getValue("penyelesaian_masalah"),
				bimbingan_sikap: getValue("bimbingan_sikap"),
				kualitas_laporan: getValue("kualitas_laporan"),
				catatan: Array.isArray(komponen)
					? komponen[0] &&
					  typeof komponen[0] === "object" &&
					  "catatan" in komponen[0]
						? (komponen[0] as { catatan?: string }).catatan ?? ""
						: ""
					: komponen && typeof komponen === "object" && "catatan" in komponen
					? (komponen as { catatan?: string }).catatan ?? ""
					: "",
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
			toast.success("Bimbingan berhasil disimpan!");
			setOpenModalBimbingan(false);
		},
		onError: (error) => {
			console.error("Error post bimbingan:", error);
			toast.error("Gagal menyimpan bimbingan. Silakan coba lagi.");
		},
	});

	const postNilaiMutation = useMutation({
		mutationFn: (data: {
			penyelesaian_masalah: number;
			bimbingan_sikap: number;
			kualitas_laporan: number;
			catatan: string;
		}) => {
			const nilaiId = detailMahasiswaSaya?.nilai?.[0]?.id;
			if (!nilaiId) throw new Error("Id nilai is missing...");
			return APIKerjaPraktik.postNilai(nilaiId, data);
		},
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
			toast.success("Nilai berhasil disimpan!");
		},
		onError: (error) => {
			console.error("Error posting nilai:", error);
			toast.error("Gagal menyimpan nilai. Silakan coba lagi.");
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
			toast.success("Nilai berhasil diperbarui!");
		},
		onError: (error) => {
			console.error("Error updating nilai:", error);
			toast.error("Gagal memperbarui nilai. Silakan coba lagi.");
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
		return Math.round(weightedSum * 100) / 100;
	};

	const handleSaveNilai = () => {
		if (!validateForm()) return;
		if (!id) {
			toast.error("Pendaftaran KP ID tidak ditemukan.");
			return;
		}

		const data = {
			penyelesaian_masalah: evaluationValues.penyelesaian_masalah,
			bimbingan_sikap: evaluationValues.bimbingan_sikap,
			kualitas_laporan: evaluationValues.kualitas_laporan,
			catatan: evaluationValues.catatan,
		};

		if (
			!detailMahasiswaSaya?.nilai?.[0]?.komponen_penilaian_pembimbing?.length
		) {
			postNilaiMutation.mutate(data);
		} else if (isEditingNilai && detailMahasiswaSaya?.nilai?.[0]?.id) {
			putNilaiMutation.mutate(data);
		} else {
			toast.error("Tidak dapat menyimpan nilai.");
		}
	};

	const handleResetNilai = () => {
		const komponen =
			detailMahasiswaSaya?.nilai?.[0]?.komponen_penilaian_pembimbing;
		const getValue = (key: string) => {
			if (Array.isArray(komponen)) {
				return typeof komponen[0] === "number" ? komponen[0] : 0;
			} else if (typeof komponen === "object" && komponen !== null) {
				return typeof komponen[key] === "number" ? komponen[key] : 0;
			}
			return 0;
		};
		setEvaluationValues({
			penyelesaian_masalah: getValue("penyelesaian_masalah"),
			bimbingan_sikap: getValue("bimbingan_sikap"),
			kualitas_laporan: getValue("kualitas_laporan"),
			catatan: Array.isArray(komponen)
				? komponen[0] &&
				  typeof komponen[0] === "object" &&
				  "catatan" in komponen[0]
					? (komponen[0] as { catatan?: string }).catatan ?? ""
					: ""
				: komponen && typeof komponen === "object" && "catatan" in komponen
				? (komponen as { catatan?: string }).catatan ?? ""
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
				"Tidak ada nilai untuk diedit. Silakan simpan nilai terlebih dahulu."
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
			<div className="min-h-screen">
				{/* Page Title */}
				<div className="flex items-center gap-4 mb-3">
					<div className="flex">
						<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
							<span
								className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
							/>
							<UserRoundPenIcon className="w-4 h-4 mr-1.5" />
							Detail Mahasiswa Bimbingan Kerja Praktik
						</span>
					</div>
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
					<div className="-mt-4">
						<Tabs
							defaultValue="daily-report"
							className="w-full"
							onValueChange={setActiveTab}
							value={activeTab}
						>
							<TabsList className="grid w-full max-w-2xl grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-800">
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
												day.date.getUTCDay() === 0 ||
												day.date.getUTCDay() === 6;
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
													onClick={
														day.hasEntry && day.entry
															? () => {
																	setSelectedDailyReport(day.entry);
																	setOpenModalDailyReportDetail(true);
															  }
															: undefined
													}
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
									<div className="p-6 pb-3.5 pt-4 flex justify-between items-center">
										<span className="font-semibold text-bsae tracking-tight text-foreground/90">
											🔥 Riwayat Bimbingan Mahasiswa
										</span>
										<Button
											className="bg-blue-500 border text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:border-gray-700 dark:hover:bg-blue-600"
											onClick={() => setOpenModalBimbingan(true)}
										>
											<FilePlus2 className="w-4 h-4" />
											Tambah Bimbingan
										</Button>
									</div>
									<CardContent>
										<Card className="overflow-hidden border-none rounded-lg shadow-sm">
											<Table className="border dark:border-gray-700">
												<TableHeader className="bg-gray-200 border dark:border-gray-700 dark:bg-gray-800/10">
													<TableRow>
														<TableHead className="max-w-16 text-center">
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
									{detailMahasiswaSaya.nilai?.length &&
									detailMahasiswaSaya.nilai.length > 0 ? (
										<>
											<CardHeader className="pb-2">
												<CardDescription>
													{(() => {
														const komponen =
															detailMahasiswaSaya.nilai?.[0]
																?.komponen_penilaian_pembimbing;
														const hasKomponen =
															komponen &&
															((Array.isArray(komponen) &&
																komponen.length > 0) ||
																(typeof komponen === "object" &&
																	!Array.isArray(komponen) &&
																	Object.keys(komponen).length > 0));
														return hasKomponen && !isEditingNilai
															? "Hasil Penilaian KP Mahasiswa"
															: "Formulir Penilaian KP Mahasiswa";
													})()}
												</CardDescription>
											</CardHeader>
											<CardContent>
												{(() => {
													const komponen =
														detailMahasiswaSaya.nilai?.[0]
															?.komponen_penilaian_pembimbing;
													const hasKomponen =
														komponen &&
														((Array.isArray(komponen) && komponen.length > 0) ||
															(typeof komponen === "object" &&
																!Array.isArray(komponen) &&
																Object.keys(komponen).length > 0));
													return hasKomponen && !isEditingNilai ? (
														<div className="p-0 md:p-2">
															<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
																{/* Left: Komponen Penilaian */}
																<div className="flex flex-col gap-4 p-6 border border-gray-200 shadow-lg rounded-2xl bg-white/80 dark:bg-gray-800/70 dark:border-gray-700">
																	<h4 className="flex items-center gap-2 mb-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
																		<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
																		Komponen Penilaian
																	</h4>
																	<div className="flex flex-col gap-4">
																		{(() => {
																			const komponen =
																				detailMahasiswaSaya.nilai?.[0]
																					?.komponen_penilaian_pembimbing;
																			return evaluationCriteria.map(
																				(criteria) => {
																					let value = "Belum dinilai...";
																					let percent = 0;
																					if (komponen) {
																						if (Array.isArray(komponen)) {
																							value =
																								komponen[0] &&
																								(criteria.id as keyof KomponenPenilaianPembimbing) in
																									komponen[0]
																									? String(
																											komponen[0][
																												criteria.id as keyof KomponenPenilaianPembimbing
																											]
																									  )
																									: "Belum dinilai...";
																							percent =
																								(komponen[0]?.[
																									criteria.id as keyof KomponenPenilaianPembimbing
																								] as number) || 0;
																						} else if (
																							typeof komponen === "object" &&
																							komponen !== null
																						) {
																							value =
																								komponen[criteria.id] ??
																								"Belum dinilai...";
																							percent =
																								komponen[criteria.id] || 0;
																						}
																					}
																					return (
																						<div
																							key={criteria.id}
																							className="mb-2"
																						>
																							<div className="flex items-center justify-between mb-1">
																								<span className="font-medium text-gray-700 dark:text-gray-200">
																									{criteria.label}
																								</span>
																								<span className="text-sm font-bold text-blue-700 dark:text-blue-300">
																									{value !== undefined &&
																									value !== null &&
																									value !== "Belum dinilai..."
																										? `${value} / 100`
																										: value}
																								</span>
																							</div>
																							<div className="w-full h-2 overflow-hidden bg-blue-100 rounded-full dark:bg-blue-900/30">
																								<div
																									className={`h-2 rounded-full transition-all duration-500 ${
																										percent >= 80
																											? "bg-green-400"
																											: percent >= 60
																											? "bg-yellow-400"
																											: percent > 0
																											? "bg-red-400"
																											: "bg-gray-300 dark:bg-gray-700"
																									}`}
																									style={{
																										width: `${percent}%`,
																									}}
																								></div>
																							</div>
																						</div>
																					);
																				}
																			);
																		})()}
																	</div>
																</div>
																{/* Right: Nilai Akhir & Catatan */}
																<div className="flex flex-col gap-6">
																	<div className="flex flex-col items-center justify-center p-6 border border-blue-200 shadow-lg rounded-2xl bg-gradient-to-br from-blue-100/80 to-blue-300/40 dark:from-blue-900/40 dark:to-blue-800/60 dark:border-blue-700">
																		<h4 className="flex items-center gap-2 mb-2 text-base font-semibold text-blue-700 dark:text-blue-200">
																			Total Nilai
																		</h4>
																		<div className="flex items-center gap-3">
																			<span className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 drop-shadow-lg">
																				{detailMahasiswaSaya.nilai[0]
																					?.nilai_pembimbing || "-"}
																			</span>
																			{/* {detailMahasiswaSaya.nilai[0]?.nilai_pembimbing && (
                                            <span className="px-3 py-1 text-lg font-semibold text-blue-700 border border-blue-300 rounded-full bg-blue-500/10 dark:bg-blue-800/40 dark:text-blue-200 dark:border-blue-700">
                                                {getGrade(detailMahasiswaSaya.nilai[0]?.nilai_pembimbing) || "-"}
                                            </span>
                                      )} */}
																		</div>
																	</div>
																	<div className="p-6 border border-gray-200 shadow-lg rounded-2xl bg-white/80 dark:bg-gray-800/70 dark:border-gray-700">
																		<h4 className="flex items-center gap-2 mb-2 text-base font-semibold text-blue-700 dark:text-blue-200">
																			<span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
																			Catatan
																		</h4>
																		<div className="p-3 border border-blue-200 border-dashed rounded-lg bg-blue-50/60 dark:bg-blue-900/20 dark:border-blue-700">
																			<p className="leading-relaxed text-gray-700 dark:text-gray-200 text-base min-h-[48px]">
																				{(() => {
																					const komponen =
																						detailMahasiswaSaya.nilai?.[0]
																							?.komponen_penilaian_pembimbing;
																					if (komponen) {
																						if (Array.isArray(komponen)) {
																							return (
																								komponen[0]?.catatan ??
																								"Belum ada catatan..."
																							);
																						} else if (
																							typeof komponen === "object" &&
																							komponen !== null
																						) {
																							return (
																								(
																									komponen as KomponenPenilaianPembimbing
																								).catatan ??
																								"Belum ada catatan..."
																							);
																						}
																					}
																					return "Belum ada catatan...";
																				})()}
																			</p>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													) : (
														<div className="p-0 md:p-2">
															<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
																{/* Left: Komponen Penilaian Form */}
																<div className="flex flex-col gap-6">
																	{evaluationCriteria.map((criteria) => (
																		<div
																			key={criteria.id}
																			className="p-6 transition-all border border-gray-200 shadow-lg group dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/70 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500"
																		>
																			<div className="flex items-center justify-between mb-3">
																				<div className="flex-1">
																					<Label
																						htmlFor={criteria.id}
																						className="text-base font-semibold text-gray-800 dark:text-gray-100"
																					>
																						{criteria.label}
																					</Label>
																					<span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
																						{Math.round(criteria.weight * 100)}%
																					</span>
																				</div>
																				<div className="flex items-center">
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
																						className="w-16 h-10 text-base text-center transition-all bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
																						aria-label={criteria.label}
																					/>
																				</div>
																			</div>
																			<div className="flex items-center gap-4 mt-2">
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
																						handleSliderChange(
																							criteria.id,
																							value
																						)
																					}
																				/>
																			</div>
																			{formErrors[
																				criteria.id as keyof typeof formErrors
																			] && (
																				<p className="mt-2 text-sm text-red-600">
																					{
																						formErrors[
																							criteria.id as keyof typeof formErrors
																						]
																					}
																				</p>
																			)}
																		</div>
																	))}
																</div>
																{/* Right: Catatan, Total Nilai */}
																<div className="flex flex-col justify-center gap-6">
																	<div className="p-6 border border-gray-200 shadow-lg dark:border-gray-700 rounded-2xl bg-white/80 dark:bg-gray-800/70">
																		<Label
																			htmlFor="catatan"
																			className="text-base font-semibold text-gray-800 dark:text-gray-100"
																		>
																			Catatan
																		</Label>
																		<Textarea
																			id="catatan"
																			placeholder="Masukkan catatan untuk mahasiswa..."
																			className="mt-3 transition-all border-gray-300 rounded-lg shadow-sm h-28 dark:border-gray-600 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400"
																			value={evaluationValues.catatan}
																			onChange={handleTextAreaChange}
																			aria-label="Catatan"
																		/>
																	</div>
																	<div className="flex flex-col items-center justify-center p-6 border border-blue-200 shadow-lg bg-gradient-to-br from-blue-100/80 to-blue-300/40 dark:from-blue-900/40 dark:to-blue-800/60 dark:border-blue-700 rounded-2xl">
																		<h3 className="mb-2 text-base font-semibold text-blue-700 dark:text-blue-200">
																			Total Nilai
																		</h3>
																		<p className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 drop-shadow-lg">
																			{calculateFinalScore()}
																		</p>
																	</div>
																</div>
															</div>
														</div>
													);
												})()}
											</CardContent>
											<CardFooter className="flex justify-end gap-2 mr-2">
												{(() => {
													const komponen =
														detailMahasiswaSaya.nilai?.[0]
															?.komponen_penilaian_pembimbing;
													const hasKomponen =
														komponen &&
														((Array.isArray(komponen) && komponen.length > 0) ||
															(typeof komponen === "object" &&
																!Array.isArray(komponen) &&
																Object.keys(komponen).length > 0));
													return hasKomponen && !isEditingNilai ? (
														<Button
															className="text-white bg-yellow-700 hover:bg-yellow-800"
															onClick={handleEditNilai}
															aria-label="Edit Nilai"
														>
															<FileText className="w-4 h-4 mr-1" />
															Perbarui Nilai
														</Button>
													) : (
														<>
															<Button
																variant="outline"
																onClick={handleResetNilai}
																aria-label="Reset Form"
															>
																Batal
															</Button>
															<Button
																className="text-white bg-green-600 hover:bg-green-700"
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
													);
												})()}
											</CardFooter>
										</>
									) : (
										<CardHeader className="p-6">
											<CardDescription className="text-base font-normal text-center text-foreground/80">
												❌ Penilaian belum bisa dilakukan untuk mahasiswa ini...
											</CardDescription>
										</CardHeader>
									)}
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
