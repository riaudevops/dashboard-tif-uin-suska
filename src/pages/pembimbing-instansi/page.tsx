import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import APIKerjaPraktik from "@/services/api/pembimbing-instansi/daily-report.service";
import { MahasiswaInstansiSayaResponse } from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";
import {
	Search,
	Calendar,
	User,
	Building,
	AlertTriangle,
	ChevronDown,
	ChevronUp,
	Eye,
	EyeClosed,
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
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const PembimbingInstansiKerjaPraktikMahasiswaPage = () => {
	const { id } = useParams<{ id: string }>();

	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [isProfileExpanded, setIsProfileExpanded] = useState<boolean>(false);
	const [hoveredButton, setHoveredButton] = useState<string | null>(null);
	const itemsPerPage = 10;
	const [showAktivasiModal, setShowAktivasiModal] = useState<boolean>(false);
	const [isActivating, setIsActivating] = useState<boolean>(false);

	const {
		data: mahasiswaInstansiSaya,
		isLoading,
		refetch,
	} = useQuery<MahasiswaInstansiSayaResponse, Error>({
		queryKey: ["mahasiswa-instansi-saya", id],
		queryFn: () =>
			APIKerjaPraktik.getMahasiswaInstansiSaya(id!).then((res) => res.data),
		staleTime: Infinity,
		enabled: !!id,
	});

	useEffect(() => {
		if (
			mahasiswaInstansiSaya?.pembimbing_instansi?.status &&
			mahasiswaInstansiSaya.pembimbing_instansi.status === "Pending"
		) {
			setShowAktivasiModal(true);
		} else {
			setShowAktivasiModal(false);
		}
	}, [mahasiswaInstansiSaya]);

	const handleAktivasiAkun = async () => {
		if (!id) return;
		setIsActivating(true);
		try {
			await APIKerjaPraktik.putAktivasiAkun(id);
			toast.success("Akun berhasil diaktifkan!");
			setShowAktivasiModal(false);
			refetch();
		} catch (err) {
			toast.error("Gagal mengaktifkan akun. Silakan coba lagi.");
		} finally {
			setIsActivating(false);
		}
	};

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

	const filteredStudents = (mahasiswaInstansiSaya?.mahasiswa || []).filter(
		(student) =>
			student.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
			student.nim.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredStudents.slice(
		indexOfFirstItem,
		indexOfLastItem
	);

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const today = new Date();
	const formatDateToday = today.toLocaleDateString("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	const renderPaginationItems = () => {
		const items = [];

		items.push(
			<PaginationItem key="prev">
				<PaginationPrevious
					className={`border rounded-md ${
						currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
					} transition-all duration-300 hover:shadow-md`}
					onClick={() => handlePageChange(currentPage - 1)}
					tabIndex={currentPage === 1 ? -1 : 0}
				/>
			</PaginationItem>
		);

		if (totalPages <= 5) {
			for (let i = 1; i <= totalPages; i++) {
				items.push(
					<PaginationItem key={i}>
						<PaginationLink
							isActive={currentPage === i}
							className={
								currentPage === i
									? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
									: "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
							}
							onClick={() => handlePageChange(i)}
						>
							{i}
						</PaginationLink>
					</PaginationItem>
				);
			}
		} else {
			items.push(
				<PaginationItem key={1}>
					<PaginationLink
						isActive={currentPage === 1}
						className={
							currentPage === 1
								? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
								: "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
						}
						onClick={() => handlePageChange(1)}
					>
						1
					</PaginationLink>
				</PaginationItem>
			);

			if (currentPage > 3) {
				items.push(
					<PaginationItem key="ellipsis1">
						<PaginationLink className="border text-slate-700 hover:border-teal-200 hover:text-teal-700">
							...
						</PaginationLink>
					</PaginationItem>
				);
			}

			const startPage = Math.max(2, currentPage - 1);
			const endPage = Math.min(totalPages - 1, currentPage + 1);

			for (let i = startPage; i <= endPage; i++) {
				if (i !== 1 && i !== totalPages) {
					items.push(
						<PaginationItem key={i}>
							<PaginationLink
								isActive={currentPage === i}
								className={
									currentPage === i
										? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
										: "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
								}
								onClick={() => handlePageChange(i)}
							>
								{i}
							</PaginationLink>
						</PaginationItem>
					);
				}
			}

			if (currentPage < totalPages - 2) {
				items.push(
					<PaginationItem key="ellipsis2">
						<PaginationLink className="border text-slate-700 hover:border-teal-200 hover:text-teal-700">
							...
						</PaginationLink>
					</PaginationItem>
				);
			}

			if (totalPages > 1) {
				items.push(
					<PaginationItem key={totalPages}>
						<PaginationLink
							isActive={currentPage === totalPages}
							className={
								currentPage === totalPages
									? "bg-teal-50 text-teal-700 border-teal-200 transform scale-110 shadow-sm transition-all duration-300"
									: "text-slate-700 border hover:border-teal-200 hover:text-teal-700 transition-all duration-300 hover:scale-110"
							}
							onClick={() => handlePageChange(totalPages)}
						>
							{totalPages}
						</PaginationLink>
					</PaginationItem>
				);
			}
		}

		items.push(
			<PaginationItem key="next">
				<PaginationNext
					className={`border rounded-md ${
						currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
					} transition-all duration-300 hover:shadow-md`}
					onClick={() => handlePageChange(currentPage + 1)}
					tabIndex={currentPage === totalPages ? -1 : 0}
				/>
			</PaginationItem>
		);

		return items;
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
				<div className="w-10 h-10 border-t-2 border-indigo-500 rounded-full" />
			</div>
		);
	}

	if (!mahasiswaInstansiSaya) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
				<AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
				<p className="mb-4 text-lg font-medium text-gray-700 dark:text-gray-300">
					Waduh, data tidak ditemukan nih! 😭
				</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
			<Dialog open={showAktivasiModal} onOpenChange={setShowAktivasiModal}>
				<DialogContent className="max-w-md rounded-xl shadow-2xl bg-white dark:bg-gray-800">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
							Aktivasi Akun Pembimbing Instansi
						</DialogTitle>
						<DialogDescription className="mt-2 text-gray-600 dark:text-gray-300">
							Akun Anda masih{" "}
							<span className="font-semibold text-yellow-600">Pending</span>.
							Silakan aktifkan akun untuk melanjutkan akses dashboard.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 mt-1">
						<Button
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
							onClick={handleAktivasiAkun}
							disabled={isActivating}
						>
							{isActivating ? "Mengaktifkan..." : "Aktifkan Akun"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			{/* Top Section */}
			<motion.div
				className="flex items-center justify-between mb-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.7 }}
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-white">
						Pembimbing Instansi Kerja Praktik
					</h1>
					<p className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
						<Calendar size={16} className="mr-2" />
						{formatDateToday}
					</p>
				</div>
			</motion.div>
			{/* Pembimbing Biodata Card */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3, duration: 0.7 }}
			>
				<Card className="mb-8 border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
					<div className="flex items-center justify-between p-6 text-white bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl">
						<div className="flex items-center gap-4">
							<div className="flex items-center justify-center border rounded-full shadow-inner w-14 h-14 bg-white/10 border-white/20">
								<User className="w-8 h-8 text-white" />
							</div>
							<div>
								<h3 className="text-xl font-bold">
									{mahasiswaInstansiSaya.pembimbing_instansi.nama || "-"}
								</h3>
								<p className="text-sm text-white/80">
									{mahasiswaInstansiSaya.pembimbing_instansi.jabatan || "-"}
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							className="text-white bg-white/20 hover:bg-white/30"
							onClick={() => setIsProfileExpanded(!isProfileExpanded)}
						>
							{isProfileExpanded ? (
								<ChevronUp className="w-5 h-5" />
							) : (
								<ChevronDown className="w-5 h-5" />
							)}
							Detail
						</Button>
					</div>
					<AnimatePresence>
						{isProfileExpanded && (
							<div className="p-6 transition-all duration-300 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="flex gap-3">
										<Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
												Instansi
											</p>
											<p className="text-base text-gray-900 dark:text-white">
												{mahasiswaInstansiSaya.pembimbing_instansi.instansi
													.nama || "-"}
											</p>
										</div>
									</div>
									<div className="flex gap-3">
										<Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
												Alamat
											</p>
											<p className="text-base text-gray-900 dark:text-white">
												{mahasiswaInstansiSaya.pembimbing_instansi.instansi
													.alamat || "-"}
											</p>
										</div>
									</div>
									<div className="flex col-span-1 gap-3 md:col-span-2">
										<Building className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
										<div>
											<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
												Profil Singkat
											</p>
											<p className="text-base text-gray-900 dark:text-white">
												{mahasiswaInstansiSaya.pembimbing_instansi.instansi
													.profil_singkat || "Tidak ada profil"}
											</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</AnimatePresence>
				</Card>
			</motion.div>
			{/* Student List Section */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.7 }}
			>
				<Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
					<CardHeader className="flex flex-col items-start justify-between pb-4 border-b border-gray-200 sm:flex-row sm:items-center dark:border-gray-700">
						<div>
							<CardTitle className="text-xl text-gray-800 dark:text-white">
								Mahasiswa Kerja Praktik
							</CardTitle>
							<CardDescription className="text-gray-500 dark:text-gray-400">
								Teknik Informatika - Universitas Islam Negeri Sultan Syarif
								Kasim Riau
							</CardDescription>
						</div>
						<div className="relative w-full mt-4 sm:w-96 sm:mt-0">
							<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-3" />
							<Input
								placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
								className="transition-all border-gray-300 pl-9 dark:border-gray-600 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-700"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</CardHeader>
					<CardContent className="p-0">
						<Table>
							<TableHeader className="bg-indigo-50 dark:bg-indigo-900/20">
								<TableRow>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										Nama
									</TableHead>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										NIM
									</TableHead>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										Tanggal Mulai
									</TableHead>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										Tanggal Selesai
									</TableHead>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										Hari Kerja
									</TableHead>
									<TableHead className="font-semibold text-center text-gray-700 dark:text-gray-200">
										Aksi
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentItems.length > 0 ? (
									currentItems.map((student) => (
										<TableRow
											key={student.nim}
											className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/20"
										>
											<TableCell className="py-4 font-medium text-center text-gray-900 dark:text-white">
												{student.nama || ""}
											</TableCell>
											<TableCell className="py-4 text-center text-gray-600 dark:text-gray-300">
												{student.nim || ""}
											</TableCell>
											<TableCell className="py-4 text-center text-gray-600 dark:text-gray-300">
												{formatDate(
													student.pendaftaran_kp[0]?.tanggal_mulai ?? ""
												)}
											</TableCell>
											<TableCell className="py-4 text-center text-gray-600 dark:text-gray-300">
												{formatDate(
													student.pendaftaran_kp[0]?.tanggal_selesai ?? ""
												)}
											</TableCell>
											<TableCell className="text-center">
												<div className="flex flex-col items-center p-2">
													<span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
														{student.daily_report?.length || 0}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-center">
												<Button
													variant="ghost"
													size="sm"
													onClick={() =>
														navigate(
															`/pembimbing-instansi/kerja-praktik/detail-mahasiswa/${student.pendaftaran_kp[0]?.id}`
														)
													}
													className="text-white transition-all duration-300 bg-teal-500 shadow-sm hover:text-white hover:bg-teal-600 hover:shadow-md"
													onMouseEnter={() => setHoveredButton(student.nim)}
													onMouseLeave={() => setHoveredButton(null)}
												>
													{hoveredButton === student.nim ? (
														<Eye size={16} className="mr-2" />
													) : (
														<EyeClosed size={16} className="mr-2" />
													)}
													Lihat Detail
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={6}
											className="py-12 text-center text-gray-500 dark:text-gray-400"
										>
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.5 }}
											>
												<Search
													size={40}
													className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
												/>
												<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
													Tidak ada mahasiswa...
												</h3>
												<p className="mt-1 text-gray-500 dark:text-gray-400">
													{searchTerm
														? `Tidak ada mahasiswa yang cocok dengan pencarian "${searchTerm}".`
														: "Belum ada mahasiswa yang terdaftar."}
												</p>
											</motion.div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>

						{filteredStudents.length > 0 && (
							<motion.div
								className="flex items-center px-6 py-6 border-t border-gray-200 dark:border-gray-700"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.5, duration: 0.3 }}
							>
								<p className="w-full text-sm text-gray-500 dark:text-gray-400">
									{indexOfFirstItem + 1}-
									{Math.min(indexOfLastItem, filteredStudents.length)} dari{" "}
									{filteredStudents.length} Mahasiswa
								</p>
								<Pagination className="flex items-center justify-end">
									<PaginationContent>
										{renderPaginationItems()}
									</PaginationContent>
								</Pagination>
							</motion.div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default PembimbingInstansiKerjaPraktikMahasiswaPage;
