import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
	User,
	BookOpen,
	Building,
	Calendar,
	FileText,
	AlertTriangle,
	ChevronLeft,
	ChevronRight,
	AlertTriangleIcon,
	CheckCircle,
	Eye,
	XCircle,
	LayoutGridIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import DetailDailyReportModal from "@/components/dosen/kerja-praktik/mahasiswa-bimbing/DetailDailyReportModal";
import DetailBimbinganModal from "@/components/dosen/kerja-praktik/mahasiswa-bimbing/DetailBimbinganModal";
import APIKerjaPraktik from "@/services/api/koordinator-kp/daily-report.service";
import {
	Bimbingan,
	CalendarDay,
	DailyReport,
	MahasiswaDetailResponse,
} from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const KoordinatorKerjaPraktikDailyReportDetailPage: React.FC = () => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [agendaEntries, setAgendaEntries] = useState<DailyReport[]>([]);
	const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
	const [activeTab, setActiveTab] = useState<string>("daily-report");
	const [isDailyReportModalOpen, setDailyReportModalOpen] =
		useState<boolean>(false);
	const [isBimbinganModalOpen, setBimbinganModalOpen] =
		useState<boolean>(false);
	const [selectedDailyReport, setSelectedDailyReport] =
		useState<DailyReport | null>(null);
	const [selectedBimbingan, setSelectedBimbingan] = useState<Bimbingan | null>(
		null
	);

	const {
		data: detailMahasiswa,
		isLoading,
		error,
	} = useQuery<MahasiswaDetailResponse, Error>({
		queryKey: ["detail-mahasiswa", id],
		queryFn: () =>
			APIKerjaPraktik.getAllDetailMahasiswa(id!).then((res) => res.data),
		staleTime: Infinity,
		enabled: !!id,
	});

	useEffect(() => {
		if (detailMahasiswa?.daily_report && detailMahasiswa.tanggal_mulai) {
			const entries: DailyReport[] = detailMahasiswa.daily_report.map(
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
	}, [detailMahasiswa]);

	useEffect(() => {
		if (detailMahasiswa?.tanggal_mulai && detailMahasiswa?.tanggal_selesai) {
			const today = new Date(
				Date.UTC(
					new Date().getUTCFullYear(),
					new Date().getUTCMonth(),
					new Date().getUTCDate()
				)
			);
			const startDate = new Date(detailMahasiswa.tanggal_mulai);
			const endDate = new Date(detailMahasiswa.tanggal_selesai);

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
	}, [detailMahasiswa]);

	useEffect(() => {
		if (detailMahasiswa?.tanggal_mulai && detailMahasiswa?.tanggal_selesai) {
			setCalendarDays(
				generateCalendarDays(
					currentMonth,
					detailMahasiswa.tanggal_mulai,
					detailMahasiswa.tanggal_selesai
				)
			);
		}
	}, [currentMonth, agendaEntries, detailMahasiswa]);

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
		if (!detailMahasiswa?.tanggal_mulai) return true;
		const startDate = new Date(detailMahasiswa.tanggal_mulai.split("T")[0]);
		const prevMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() - 1, 1)
		);
		return (
			prevMonth <
			new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
		);
	};

	const isNextDisabled = () => {
		if (!detailMahasiswa?.tanggal_selesai) return true;
		const endDate = new Date(detailMahasiswa.tanggal_selesai.split("T")[0]);
		const nextMonth = new Date(
			Date.UTC(currentMonth.getUTCFullYear(), currentMonth.getUTCMonth() + 1, 1)
		);
		return (
			nextMonth >
			new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))
		);
	};

	const getStatusMahasiswa = (status: string): string => {
		switch (status) {
			case "Lanjut":
				return "bg-amber-500";
			case "Selesai":
				return "bg-blue-500";
			case "Gagal":
				return "bg-red-500";
			default:
				return "bg-green-500";
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
			return 1;
		}
	};

	// const calculateDay = (
	//   tanggalPresensi: string,
	//   tanggalMulai: string
	// ): number => {
	//   try {
	//     const presensiDate = new Date(tanggalPresensi);
	//     const mulaiDate = new Date(tanggalMulai);
	//     const diffTime = presensiDate.getTime() - mulaiDate.getTime();
	//     return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
	//   } catch {
	//     return 0;
	//   }
	// };

	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="flex items-center justify-center min-h-screen">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ repeat: Infinity, duration: 1 }}
						className="w-8 h-8 border-t-2 border-blue-500 rounded-full"
					></motion.div>
				</div>
			</DashboardLayout>
		);
	}

	if (error || !detailMahasiswa) {
		return (
			<DashboardLayout>
				<div className="flex flex-col items-center justify-center min-h-screen">
					<AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
					<p className="text-lg font-medium text-gray-700 dark:text-gray-300">
						Gagal memuat data: {error?.message || "Data tidak ditemukan"}
					</p>
					<Button className="mt-4" onClick={() => window.location.reload()}>
						Coba Lagi
					</Button>
				</div>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-4">
				<div className="flex">
					<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
						<span
							className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
						/>
						<LayoutGridIcon className="w-4 h-4 mr-1.5" />
						Detail Progres Kerja Praktik Mahasiswa
					</span>
				</div>
				{/* Biodata Section */}
				<Card className="overflow-hidden border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
					<div className="flex items-center justify-between p-6 text-white bg-gradient-to-br from-indigo-600 to-purple-700">
						<div className="flex items-center gap-4">
							<div className="flex items-center justify-center border rounded-full shadow-inner w-14 h-14 bg-white/10 border-white/20">
								<User className="w-8 h-8 text-white" />
							</div>
							<div className="space-y-1">
								<h3 className="text-xl font-bold text-white">
									{detailMahasiswa.mahasiswa.nama || "-"}
								</h3>
								<div className="flex items-center gap-3 text-sm">
									<Badge className="text-white bg-white/20 border-white/30">
										Semester {getSemester(detailMahasiswa.mahasiswa.nim)}
									</Badge>
									<span className="flex items-center text-white">
										<span
											className={`inline-block w-3 h-3 animate-pulse rounded-full mr-1.5 ${getStatusMahasiswa(
												detailMahasiswa.status
											)}`}
										></span>
										{detailMahasiswa.status || "-"}
									</span>
								</div>
							</div>
						</div>
						<Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5 text-sm font-medium">
							{detailMahasiswa.mahasiswa.nim || "-"}
						</Badge>
					</div>
					{/* Info Cards */}
					<CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/20 dark:to-gray-800">
						<div className="grid grid-cols-1">
							{/* Judul Laporan Card */}
							{/* <Card className="p-6 border shadow-sm bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 rounded-xl">
              <div className="flex gap-3">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Judul Kerja Praktik
                  </h3>
                  <p className="mt-1 text-base font-semibold text-gray-900 uppercase dark:text-white">
                    {detailMahasiswa.judul_kp || "Tidak ada judul"}
                  </p>
                </div>
              </div>
            </Card> */}
							{/* Informasi Kerja Praktik */}
							<Card className="p-4 border shadow-sm bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 rounded-xl">
								{/* <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                Informasi Kerja Praktik
              </h3> */}
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="flex gap-3">
										<Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Instansi
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{detailMahasiswa.instansi.nama || "-"}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<User className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Pembimbing Instansi
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{detailMahasiswa.pembimbing_instansi.nama || "-"}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Mulai KP
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{formatDate(detailMahasiswa.tanggal_mulai)}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Selesai KP
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{formatDate(detailMahasiswa.tanggal_selesai)}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<User className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Dosen Pembimbing
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{detailMahasiswa.dosen_pembimbing.nama || "-"}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
										<div>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												Judul KP
											</p>
											<p className="text-sm font-medium text-gray-900 dark:text-white">
												{detailMahasiswa.judul_kp || "Tidak ada judul"}{" "}
											</p>
										</div>
									</div>
								</div>
							</Card>
						</div>
					</CardContent>
				</Card>
				{/* Tabs and Table */}
				<Tabs
					defaultValue="daily-report"
					className="w-full space-y-4"
					onValueChange={setActiveTab}
					value={activeTab}
				>
					<TabsList className="grid w-full max-w-md grid-cols-2 p-1 mb-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
						<TabsTrigger
							value="daily-report"
							className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-700 rounded-lg"
						>
							<Calendar className="w-4 h-4 mr-2" />
							Daily Report
						</TabsTrigger>
						<TabsTrigger
							value="riwayat-bimbingan"
							className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white dark:data-[state=active]:bg-indigo-700 rounded-lg"
						>
							<FileText className="w-4 h-4 mr-2" />
							Riwayat Bimbingan
						</TabsTrigger>
					</TabsList>
					<TabsContent value="daily-report" className="rounded-md">
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
											onClick={
												day.hasEntry && day.entry
													? () => {
															setSelectedDailyReport(day.entry);
															setDailyReportModalOpen(true);
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
																		className={`text-xs py-0.5 rounded-sm w-fit ${getStatusValidasi(
																			day.entry.status
																		)}`}
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
					<TabsContent value="riwayat-bimbingan">
						<Card className="p-0 border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
							<CardContent className="p-4 border rounded-md">
								<Card className="overflow-hidden border-none shadow-sm rounded-xl">
									<Table className="border dark:border-gray-700">
										<TableHeader className="bg-indigo-50 dark:bg-indigo-900/20">
											<TableRow>
												<TableHead className="max-w-16 font-semibold text-center text-gray-700 dark:text-gray-200">
													Bimbingan Ke-
												</TableHead>
												<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
													Tanggal
												</TableHead>
												<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
													Status
												</TableHead>
												<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
													Aksi
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{(detailMahasiswa.bimbingan ?? []).length > 0 ? (
												detailMahasiswa.bimbingan?.map((bimbingan, index) => (
													<TableRow
														key={bimbingan.id}
														className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20 ${
															index % 2 === 0 ? "bg-muted/30" : ""
														}`}
													>
														<TableCell className="font-medium text-center text-gray-900 dark:text-white">
															{index + 1}
														</TableCell>
														<TableCell className="text-center text-gray-900 dark:text-white">
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
																className="text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800"
																onClick={() => {
																	setSelectedBimbingan(bimbingan);
																	setBimbinganModalOpen(true);
																}}
															>
																<FileText className="w-4 h-4 mr-1" />
																Lihat Detail
															</Button>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={4}
														className="py-6 text-center text-gray-500 dark:text-gray-400"
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
				</Tabs>
			</div>
			<DetailDailyReportModal
				isOpen={isDailyReportModalOpen}
				onClose={() => setDailyReportModalOpen(false)}
				dailyReportData={selectedDailyReport || undefined}
			/>
			<DetailBimbinganModal
				isOpen={isBimbinganModalOpen}
				onClose={() => setBimbinganModalOpen(false)}
				bimbinganData={selectedBimbingan || undefined}
			/>
		</DashboardLayout>
	);
};

export default KoordinatorKerjaPraktikDailyReportDetailPage;
