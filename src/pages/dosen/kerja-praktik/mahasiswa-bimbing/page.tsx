import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import APIKerjaPraktik from "@/services/api/dosen/bimbingan-kp.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import { MahasiswaSayaResponse } from "@/interfaces/pages/mahasiswa/kerja-praktik/daily-report/daily-report.interface";
import {
	Search,
	Filter,
	Info,
	ChevronRight,
	BarChart,
	X,
	GraduationCap,
	User,
	ArrowRight,
	Clock,
	BookOpen,
	FileText,
	Award,
	AlertTriangle,
	UserRoundPenIcon,
} from "lucide-react";

const DosenKerjaPraktikMahasiswaBimbingPage = () => {
	const navigate = useNavigate();
	const [academicYear, setAcademicYear] = useState<string>("");
	const [availableAcademicYears, setAvailableAcademicYears] = useState<
		string[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [showFilterDropdown, setShowFilterDropdown] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);

	const {
		data: mahasiswaSaya,
		isLoading,
		isError,
		error,
	} = useQuery<MahasiswaSayaResponse[]>({
		queryKey: ["mahasiswa-saya"],
		queryFn: async () => {
			const response = await APIKerjaPraktik.getMahasiswaBimbinganSaya();
			return response.data;
		},
		staleTime: Infinity,
	});

	useEffect(() => {
		if (mahasiswaSaya && mahasiswaSaya.length > 0) {
			const years = Array.from(
				new Set(
					mahasiswaSaya
						.filter(
							(mhs) =>
								mhs.pendaftaran_kp &&
								mhs.pendaftaran_kp.some(
									(kp) => kp.tahun_ajaran && kp.tahun_ajaran.nama
								) &&
								mhs.pendaftaran_kp.some(
									(kp) => kp.tahun_ajaran && kp.tahun_ajaran.nama
								)
						)
						.flatMap((mhs) =>
							mhs.pendaftaran_kp.map((kp) => kp.tahun_ajaran.nama)
						)
				)
			);
			if (years.length > 0) {
				setAvailableAcademicYears(years);
				setAcademicYear(years[0]);
			} else {
				console.warn("No valid academic years found...");
			}
		}
		setIsLoaded(true);
	}, [mahasiswaSaya]);

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

	const students = mahasiswaSaya
		? mahasiswaSaya
				.filter(
					(mhs) =>
						mhs.pendaftaran_kp &&
						mhs.pendaftaran_kp.some(
							(kp) => kp.tahun_ajaran && kp.tahun_ajaran.nama
						) &&
						(!academicYear ||
							mhs.pendaftaran_kp.some(
								(kp) => kp.tahun_ajaran.nama === academicYear
							))
				)
				.map((mhs) => ({
					nim: mhs.nim,
					nama: mhs.nama,
					semester: getSemester(mhs.nim),
					id_pendaftaran_kp: mhs.pendaftaran_kp[0]?.id,
					supervisionCount: mhs.bimbingan?.length || 0,
					status: mhs.pendaftaran_kp[0]?.status,
					lastSupervision: mhs.bimbingan?.[0]?.tanggal_bimbingan
						? new Date(mhs.bimbingan[0].tanggal_bimbingan).toLocaleDateString(
								"id-ID",
								{ day: "numeric", month: "long", year: "numeric" }
						  )
						: "-",
				}))
		: [];

	const stats = [
		{
			title: "Total Mahasiswa",
			count: students.length,
			label: "Mahasiswa",
			gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
			icon: <User size={80} strokeWidth={1} />,
		},
		{
			title: "Baru",
			count: students.filter((s) => s.status === "Baru").length,
			label: "Mahasiswa",
			gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
			icon: <Award size={80} strokeWidth={1} />,
		},
		{
			title: "Lanjut",
			count: students.filter((s) => s.status === "Lanjut").length,
			label: "Mahasiswa",
			gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
			icon: <FileText size={80} strokeWidth={1} />,
		},
		{
			title: "Gagal",
			count: students.filter((s) => s.status === "Gagal").length,
			label: "Mahasiswa",
			gradient: "bg-gradient-to-br from-red-500 to-rose-600",
			icon: <AlertTriangle size={80} strokeWidth={1} />,
		},
		{
			title: "Selesai",
			count: students.filter((s) => s.status === "Selesai").length,
			label: "Mahasiswa",
			gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
			icon: <BookOpen size={80} strokeWidth={1} />,
		},
	];

	const getInitials = (name: string) => {
		const nameParts = name.split(" ");
		if (nameParts.length >= 2) {
			return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
		} else {
			return name.substring(0, 2).toUpperCase();
		}
	};

	const getStatusStyles = (status: string) => {
		switch (status) {
			case "Selesai":
				return {
					gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
					glow: "shadow-blue-500/20",
					border: "border-blue-400",
					badge:
						"bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
					lightBg: "bg-blue-50 dark:bg-blue-900/10",
					icon: <BookOpen className="w-5 h-5" />,
				};
			case "Lanjut":
				return {
					gradient: "bg-gradient-to-r from-yellow-500 to-yellow-500",
					glow: "shadow-yellow-500/20",
					border: "border-yellow-400",
					badge:
						"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
					lightBg: "bg-yellow-50 dark:bg-yellow-900/10",
					icon: <FileText className="w-5 h-5" />,
				};
			case "Gagal":
				return {
					gradient: "bg-gradient-to-r from-red-500 to-rose-600",
					glow: "shadow-red-500/20",
					border: "border-red-400",
					badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
					lightBg: "bg-red-50 dark:bg-red-900/10",
					icon: <AlertTriangle className="w-5 h-5" />,
				};
			case "Baru":
				return {
					gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
					glow: "shadow-green-500/20",
					border: "border-green-400",
					badge:
						"bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
					lightBg: "bg-green-50 dark:bg-green-900/10",
					icon: <Award className="w-5 h-5" />,
				};
			default:
				return {
					gradient: "bg-gradient-to-r from-gray-500 to-gray-600",
					glow: "shadow-gray-500/20",
					border: "border-gray-400",
					badge:
						"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
					lightBg: "bg-gray-50 dark:bg-gray-900/10",
					icon: <Info className="w-5 h-5" />,
				};
		}
	};

	const filterOptions = ["Baru", "Lanjut", "Selesai", "Gagal"];

	const applyFilter = (filter: string) => {
		setSelectedFilter(filter);
		setShowFilterDropdown(false);
	};

	const getFilteredStudents = () => {
		let filtered = students;

		if (selectedFilter) {
			// Changed condition to check for truthy value
			filtered = students.filter(
				(student) => student.status === selectedFilter
			);
		}

		if (searchQuery.trim() !== "") {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(student) =>
					student.nama.toLowerCase().includes(query) ||
					student.nim.toLowerCase().includes(query)
			);
		}

		return filtered;
	};

	const filteredStudents = getFilteredStudents();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const clearSearch = () => {
		setSearchQuery("");
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 70,
				damping: 15,
			},
		},
	};

	const statsVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: "spring",
				stiffness: 100,
			},
		},
	};

	const floatVariants = {
		float: {
			y: [0, -10, 0],
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.5 }}
					className="flex justify-between mb-5"
				>
					<div className="flex">
						<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
							<span
								className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
							/>
							<UserRoundPenIcon className="w-4 h-4 mr-1.5" />
							Mahasiswa Bimbingan Kerja Praktik
						</span>
					</div>
					{/* Academic Year Selector */}
					<div className="flex items-center gap-2 dark:text-gray-200">
						<div className="relative">
							<select
								className="px-3 py-1 pr-8 text-sm bg-white border rounded-lg shadow-sm appearance-none focus:outline-none active:outline-none dark:bg-gray-800 dark:border-gray-700 focus:ring-0 active:ring-0"
								value={academicYear}
								onChange={(e) => setAcademicYear(e.target.value)}
								disabled={isLoading || availableAcademicYears.length === 0}
							>
								{availableAcademicYears.length > 0 ? (
									availableAcademicYears.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))
								) : (
									<option value="">-</option>
								)}
							</select>
							<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
								<ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
							</div>
						</div>
					</div>
				</motion.div>
				{/* Error State */}
				{isError && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="p-4 mb-6 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-700"
					>
						<div className="flex items-center gap-2 text-red-700 dark:text-red-300">
							<AlertTriangle className="w-5 h-5" />
							<p>{error?.message}</p>
						</div>
					</motion.div>
				)}
				{/* Loading State */}
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
					>
						{[...Array(5)].map((_, index) => (
							<div
								key={index}
								className="p-5 bg-gray-100 rounded-lg dark:bg-gray-800 animate-pulse"
							>
								<div className="h-4 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
								<div className="h-8 mb-2 bg-gray-200 rounded dark:bg-gray-700"></div>
								<div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
							</div>
						))}
					</motion.div>
				)}
				{/* Stats Cards */}
				{!isLoading && !isError && (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate={isLoaded ? "visible" : "hidden"}
						className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
					>
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								variants={statsVariants}
								whileHover={{ y: -5, transition: { duration: 0.2 } }}
								className={`rounded-lg shadow-lg overflow-hidden ${stat.gradient} text-white`}
							>
								<div className="relative p-5 overflow-hidden">
									<motion.div
										className="absolute -right-3 top-10 opacity-10"
										variants={floatVariants}
										animate="float"
									>
										{stat.icon}
									</motion.div>
									<h3 className="text-sm font-medium opacity-90">
										{stat.title}
									</h3>
									<p className="my-2 text-3xl font-bold">{stat.count}</p>
									<p className="text-xs opacity-80">{stat.label}</p>
								</div>
							</motion.div>
						))}
					</motion.div>
				)}
				{/* Filter and Search Bar */}
				{!isLoading && !isError && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="flex flex-col gap-3 mb-4 sm:flex-row"
					>
						<div className="relative sm:w-auto">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="flex items-center w-full gap-2 px-4 py-2 text-sm transition-all border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md"
								onClick={() => setShowFilterDropdown(!showFilterDropdown)}
							>
								<Filter className="w-4 h-4" />
								<span>
									Filter Status {selectedFilter && `(${selectedFilter})`}
								</span>
							</motion.button>
							<AnimatePresence>
								{showFilterDropdown && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="absolute z-20 w-64 py-1 mt-2 bg-white border rounded-md shadow-xl dark:bg-gray-800 dark:border-gray-700"
									>
										<div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
											<span className="font-medium">Filter Status</span>
											<motion.button
												whileHover={{ rotate: 90 }}
												whileTap={{ scale: 0.9 }}
												onClick={() => setShowFilterDropdown(false)}
												className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
											>
												<X className="w-4 h-4" />
											</motion.button>
										</div>
										<div className="py-1">
											<motion.button
												whileHover={{
													backgroundColor: "rgba(59, 130, 246, 0.1)",
													x: 5,
												}}
												className={`w-full text-left px-4 py-2 text-sm ${
													selectedFilter === ""
														? "bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-600 dark:text-blue-400"
														: ""
												}`}
												onClick={() => applyFilter("")}
											>
												Semua
											</motion.button>
											{filterOptions.map((option) => (
												<motion.button
													key={option}
													whileHover={{
														backgroundColor: "rgba(59, 130, 246, 0.1)",
														x: 5,
													}}
													className={`w-full text-left px-4 py-2 text-sm ${
														selectedFilter === option
															? "bg-blue-50 dark:bg-blue-900/20 font-medium text-blue-600 dark:text-blue-400"
															: ""
													}`}
													onClick={() => applyFilter(option)}
												>
													{option}
												</motion.button>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
						<div className="relative flex-1">
							<div className="relative">
								<input
									type="text"
									placeholder="Cari berdasarkan nama atau NIM..."
									className="w-full py-2 pl-10 pr-10 text-sm border rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
								<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
								<AnimatePresence>
									{searchQuery && (
										<motion.button
											initial={{ opacity: 0, scale: 0.5 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.5 }}
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
											onClick={clearSearch}
											className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
										>
											<X className="w-4 h-4" />
										</motion.button>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				)}
				{!isLoading && !isError && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="flex items-center mb-1 text-sm"
					>
						<div className="flex flex-wrap gap-2">
							<AnimatePresence>
								{selectedFilter && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className="mb-3 flex items-center gap-1 px-3 py-1 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/20"
									>
										<span className="text-blue-600 dark:text-blue-400">
											{selectedFilter}
										</span>
										<motion.button
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => applyFilter("")}
											className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
										>
											<X className="w-3 h-3" />
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
							<AnimatePresence>
								{searchQuery && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										className="mb-3 flex items-center gap-1 px-3 py-1 rounded-full shadow-sm bg-blue-50 dark:bg-blue-900/20"
									>
										<span className="text-blue-600 dark:text-blue-400">
											Search: {searchQuery}
										</span>
										<motion.button
											whileHover={{ scale: 1.2 }}
											whileTap={{ scale: 0.9 }}
											onClick={clearSearch}
											className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
										>
											<X className="w-3 h-3" />
										</motion.button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>					
					</motion.div>
				)}
				{!isLoading && !isError && (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate={isLoaded ? "visible" : "hidden"}
						className="grid grid-cols-1 gap-6 md:grid-cols-2"
					>
						<AnimatePresence>
							{filteredStudents.length > 0 ? (
								filteredStudents.map((student, index) => {
									const statusStyle = getStatusStyles(student.status);

									return (
										<motion.div
											key={student.nim}
											variants={cardVariants}
											custom={index}
											layout
											whileHover={{ y: -5 }}
											className={`rounded-xl overflow-hidden shadow-lg ${statusStyle.glow} bg-white dark:bg-gray-800 border dark:border-gray-700 transition-all`}
										>
											<div className={`${statusStyle.gradient} h-3`}></div>
											<div className="flex items-center justify-between px-5 py-4">
												<motion.span
													whileHover={{ scale: 1.05 }}
													className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}
												>
													{student.status}
												</motion.span>
												<span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
													<Clock className="w-3 h-3" />
													{student.lastSupervision}
												</span>
											</div>
											<div className="px-5 pb-5">
												<div className="flex items-center gap-5">
													<div className="relative">
														<motion.div
															className={`absolute inset-0 rounded-full ${statusStyle.gradient}`}
															animate={{
																scale: [1, 1.05, 1],
																opacity: [0.5, 0.8, 0.5],
															}}
															transition={{
																duration: 3,
																repeat: Infinity,
																repeatType: "reverse",
															}}
														></motion.div>
														<motion.div
															className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 ${statusStyle.border} ${statusStyle.gradient} shadow-lg`}
															whileHover={{ scale: 1.1 }}
															transition={{
																type: "spring",
																stiffness: 400,
																damping: 10,
															}}
														>
															{getInitials(student.nama)}
														</motion.div>
													</div>
													<div className="flex-1">
														<h3 className="mb-1 text-lg font-bold dark:text-white">
															{student.nama}
														</h3>
														<div className="space-y-2">
															<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
																<span className="flex items-center w-24 gap-1">
																	<User className="w-3 h-3" />
																	NIM
																</span>
																<span className="font-medium">
																	: {student.nim}
																</span>
															</div>
															<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
																<span className="flex items-center w-24 gap-1">
																	<GraduationCap className="w-3 h-3" />
																	Semester
																</span>
																<span className="font-medium">
																	: {student.semester}
																</span>
															</div>
															<div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
																<span className="flex items-center w-24 gap-1">
																	<BarChart className="w-3 h-3" />
																	Bimbingan
																</span>
																<span className="font-medium">
																	: {student.supervisionCount} kali
																</span>
															</div>
														</div>
													</div>
												</div>
												<div className="mt-4">
													<div className="flex justify-end mb-1 text-xs">
														{/* <span className="text-gray-600 dark:text-gray-400">
                              Bimbingan
                            </span> */}
														<span
															className={`font-medium ${
																student.status === "Selesai"
																	? "text-green-600 dark:text-green-400"
																	: "text-blue-600 dark:text-blue-400"
															}`}
														>
															{student.supervisionCount}/5
														</span>
													</div>
													<div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
														<motion.div
															className={`h-full ${statusStyle.gradient}`}
															initial={{ width: 0 }}
															animate={{
																width: `${
																	((student.supervisionCount ?? 0) / 5) * 100
																}%`,
															}}
															transition={{ duration: 1, delay: index * 0.1 }}
														/>
													</div>
												</div>
											</div>
											<div
												className={`${statusStyle.lightBg} p-4 border-t dark:border-gray-700`}
											>
												<div className="flex justify-end">
													<motion.button
														whileHover={{ scale: 1.05, x: 5 }}
														whileTap={{ scale: 0.95 }}
														className="flex items-center px-4 py-1 text-sm font-medium text-gray-700 transition-colors rounded-md dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
														onClick={() =>
															navigate(
																`/dosen/kerja-praktik/mahasiswa-bimbing/detail?id=${student.id_pendaftaran_kp}`
															)
														}
													>
														<span>Lihat Detail</span>
														<motion.div
															className="ml-1"
															animate={{ y: [0, -3, 0] }}
															transition={{
																repeat: Infinity,
																repeatType: "reverse",
																duration: 1.5,
																delay: index * 0.2,
															}}
														>
															<ArrowRight className="w-4 h-4" />
														</motion.div>
													</motion.button>
												</div>
											</div>
										</motion.div>
									);
								})
							) : (
								<motion.div
									variants={cardVariants}
									className="flex flex-col items-center justify-center col-span-2 py-12 text-center"
								>
									<motion.div
										className="p-4 mb-4 bg-gray-100 rounded-full dark:bg-gray-700"
										variants={cardVariants}
										animate="pulse"
									>
										<Info className="w-8 h-8 text-gray-500 dark:text-gray-400" />
									</motion.div>
									<motion.h3
										className="mb-1 text-lg font-medium"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										Tidak Ada Mahasiswa Bimbingan
									</motion.h3>
									<motion.p
										className="max-w-md text-sm text-gray-500 dark:text-gray-400"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
									>
										{searchQuery
											? `Tidak ada mahasiswa yang cocok dengan "${searchQuery}"`
											: selectedFilter
											? `Tidak ada mahasiswa dengan status "${selectedFilter}"`
											: availableAcademicYears.length === 0
											? ""
											: `Tidak ada mahasiswa untuk tahun ajaran: ${academicYear}`}
									</motion.p>
									{(searchQuery ||
										selectedFilter ||
										availableAcademicYears.length > 0) && (
										<motion.button
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="px-4 py-2 mt-4 text-sm text-white transition-all rounded-md shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
											onClick={() => {
												setSearchQuery("");
												setSelectedFilter("");
												if (availableAcademicYears.length > 0) {
													setAcademicYear(availableAcademicYears[0]);
												}
											}}
										>
											Reset Filter
										</motion.button>
									)}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</div>
		</DashboardLayout>
	);
};

export default DosenKerjaPraktikMahasiswaBimbingPage;
