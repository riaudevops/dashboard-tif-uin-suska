import React, { useMemo } from "react";
import {
	BookCheck,
	Mail,
	UserCircle2,
	UserSquare,
	Users,
	BookOpen,
	MapPin,
	PhoneCall,
	CalendarDays,
	MedalIcon,
	UserCircle2Icon,
	ClipboardList,
	Rocket,
	Hash,
	Target,
} from "lucide-react";
import { useTheme } from "@/components/themes/theme-provider";
import { ModeToggle } from "@/components/themes/mode-toggle";
import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import APISetoran from "@/services/api/public/setoran-hafalan.service";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import TableLoadingSkeleton from "@/components/globals/table-loading-skeleton";
import NotFoundPage from "./not-found.page";
import { AxiosError } from "axios";

// --- INTERFACES
interface DosenPa {
	nama: string;
	nip: string;
	email: string;
}
interface Periode {
	bulan: string;
	tahun: string;
}
interface RekapanMahasiswa {
	nama: string;
	nim: string;
	total_murojaah: string;
	angkatan: string;
	semester: number;
}
interface ResponError {
	response: string;
	message: string;
}

// --- HELPER FUNCTIONS ---
const getMonthName = (monthNumber: string) => {
	const monthIndex = parseInt(monthNumber, 10) - 1;
	const date = new Date(2000, monthIndex);
	return date.toLocaleString("id-ID", { month: "long" });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MegaphoneIcon = (props: any) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<path d="m3 11 18-5v12L3 14v-3z" />
		<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
	</svg>
);

const MarqueeItem = ({
	icon,
	text,
	...props
}: {
	icon: JSX.Element;
	text: string;
} & React.HTMLAttributes<HTMLSpanElement>) => (
	<div className="flex items-center mx-6">
		{icon}
		<span
			{...props}
			className="text-sm font-medium text-gray-800 dark:text-gray-200"
		>
			{text}
		</span>
	</div>
);

// Komponen Marquee Utama
const ModernMarquee = () => {
	const announcements = [
		{
			text: "Selamat datang di Halaman Kartu Rekapan Muroja'ah Dosen Pembimbing Akademik Digital.",
			icon: <MegaphoneIcon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />,
		},
		{
			text: "Halaman ini ditujukan untuk melakukan validasi keaslian rekapan muroja'ah.",
			icon: <MedalIcon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />,
		},
		{
			text: "Jika terdapat data yang tidak sesuai, harap segera melapor kepada tim teknis untuk klarifikasi lebih lanjut.",
			icon: (
				<UserCircle2Icon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />
			),
		},
	];

	return (
		<div className="relative flex overflow-x-hidden bg-gradient-to-r from-red-50 via-blue-50 to-pink-50 border-y border-yellow-300 dark:from-red-800/20 dark:via-blue-800/20 dark:to-pink-800/20 dark:border-yellow-900/20">
			{/*
        Elemen ini menggunakan animasi kustom 'marquee'
      */}
			<div className="py-3 animate-marquee whitespace-nowrap flex">
				{announcements.map((announcement, index) => (
					<MarqueeItem
						key={index}
						text={announcement.text}
						icon={announcement.icon}
					/>
				))}

				{announcements.map((announcement, index) => (
					<MarqueeItem
						key={`v2-${index}`}
						text={announcement.text}
						icon={announcement.icon}
					/>
				))}
			</div>
		</div>
	);
};

// --- REUSABLE UI COMPONENTS ---

const StatsCard = ({
	icon,
	title,
	value,
	colorClass,
	isFetching,
}: {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	colorClass: string;
	isFetching: boolean;
}) => (
	// Added hover effect for more interactivity
	<div className="relative rounded-xl border bg-white/50 dark:bg-slate-800/50 shadow-md backdrop-blur-xl transition-all duration-300 border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:-translate-y-1">
		<div className="flex items-center gap-4">
			<div
				className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClass} shadow-lg`}
			>
				{icon}
			</div>
			<div className="flex flex-col">
				<div className="text-sm text-slate-500 dark:text-slate-400">
					{title}
				</div>
				{isFetching ? (
					<Skeleton className="w- h-8" />
				) : (
					<p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
						{value}
					</p>
				)}
			</div>
		</div>
	</div>
);

// --- STUDENT CARD (MOBILE VIEW) - UPDATED AS PER REQUEST ---
const StudentCard = ({ student }: { student: RekapanMahasiswa }) => {
	const totalSurah = parseInt(student.total_murojaah.split(" ")[0]);

	return (
		<div
			className={`relative group overflow-hidden rounded-2xl border bg-white/50 dark:bg-slate-900/50 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-orange-400/20 border-t-4`}
		>
			{/* --- Bio Section (Top) --- */}
			<div className="flex items-center gap-4 mb-4">
				{" "}
				<div className="relative flex-shrink-0">
					{" "}
					<div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
						<img
							src={`https://api.dicebear.com/8.x/micah/svg?seed=${encodeURIComponent(
								student.nama || "default"
							)}&radius=50&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`}
							alt={`Avatar of ${student.nama}`}
							className="w-full h-full object-cover"
						/>
					</div>{" "}
					<div
						className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-orange-100 text-orange-400 border-2 border-white/50 dark:border-slate-900/50`}
					>
						<BookOpen className="w-4 h-4" />
					</div>
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="font-bold text-slate-800 dark:text-slate-100 truncate">
						{student.nama}
					</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
						{student.nim}
					</p>
					{/* Semester & Angkatan are now part of the bio */}
					<div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-1 text-xs text-slate-500 dark:text-slate-400">
						<div className="flex items-center gap-1 border bg-indigo-700/15 dark:bg-indigo-700/30 dark:text-indigo-200 text-indigo-700 text-xs px-1.5 py-0 rounded-lg">
							<Rocket size={10} />
							<span>Semester {student.semester}</span>
						</div>
						<div className="flex items-center gap-1 border bg-teal-700/15 dark:bg-teal-700/30 dark:text-teal-200 text-teal-700 text-xs px-2 py-0 rounded-lg">
							<Hash size={10} />
							<span>Akt. {student.angkatan}</span>
						</div>
					</div>
				</div>
			</div>
			{/* --- Main Info Section (Bottom) --- */}
			<div className="flex justify-start">
				<div className="text-center border-t border-slate-200 dark:border-slate-800 inline-block">
					<div
						className={`flex justify-center items-center gap-2 bg-orange-100 text-orange-400 font-bold text-xs py-1 rounded-lg px-2`}
					>
						<Target size={12} />
						<span className="text-xs">
							Total Muroja'ah <span>#{totalSurah}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

// --- MAIN DASHBOARD COMPONENT ---
export default function KartuRekapanMurojaahPAPage() {
	const { theme } = useTheme();

	const { id } = useParams<{ id: string }>();
	const {
		data: dataRingkasan,
		isFetching,
		error,
		isError,
	} = useQuery({
		queryKey: ["kartu-rekapan-murojaah-digital", id],
		queryFn: () =>
			APISetoran.getKartuRekapanMurojaahPADigital({ id: id! }).then(
				(data) => data
			),
		staleTime: Infinity,
	});

	const dosen_pa: DosenPa = dataRingkasan?.data?.dosen_pa;
	const periode_dipilih: Periode = dataRingkasan?.data?.periode_dipilih;
	const data_rekapan_murojaah: RekapanMahasiswa[] = useMemo(
		() => dataRingkasan?.data?.data_rekapan_murojaah || [],
		[dataRingkasan?.data?.data_rekapan_murojaah]
	);
	// Memoized calculations for performance
	const stats = useMemo(() => {
		const totalStudents = data_rekapan_murojaah?.length;
		const totalSurah = data_rekapan_murojaah?.reduce(
			(sum, student) => sum + parseInt(student.total_murojaah.split(" ")[0]),
			0
		);
		const averageSurah =
			totalStudents > 0 ? Math.round(totalSurah / totalStudents) : 0;
		const topPerformer = [...data_rekapan_murojaah].sort(
			(a, b) => parseInt(b.total_murojaah) - parseInt(a.total_murojaah)
		)[0];
		return { totalStudents, totalSurah, averageSurah, topPerformer };
	}, [data_rekapan_murojaah]);

	return (
		<>
			{!(error as AxiosError<ResponError>)?.response?.data?.response &&
			isError ? (
				<NotFoundPage />
			) : (
				<div className={`${theme} font-sans antialiased`}>
					{/* CSS Animation for Marquee */}
					<style>
						{`
            @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }
            .animate-marquee {
                animation: marquee 40s linear infinite;
            }
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
                animation: blob 7s infinite;
            }
            .animation-delay-4000 {
                animation-delay: -4s;
            }
        `}
					</style>

					{/* Main Container */}
					<div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 relative transition-colors duration-300">
						{/* Animated Gradient Background */}
						<div className="absolute inset-0 z-0 overflow-hidden">
							<div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 dark:from-cyan-400/20 dark:to-blue-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
							<div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-purple-400/30 to-pink-500/30 dark:from-purple-400/20 dark:to-pink-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
						</div>

						{/* Header */}
						<div className="sticky z-[999] top-0 bg-background p-2 border-b mb-3 flex items-center justify-between">
							<div className="flex items-center gap-1.5 px-2 rounded-xl">
								{theme === "dark" ? (
									<DarkLogoUSR className="w-8 h-8" />
								) : (
									<LightLogoUSR className="w-8 h-8" />
								)}
								<span className="text-base font-semibold">
									dashboard<span className="italic font-medium">.tif-usr</span>
								</span>
							</div>
							<div className="flex items-center gap-3 text-sm font-medium tracking-tight text-muted-foreground">
								<span className="hidden md:flex">
									©&nbsp;&nbsp;Kartu Rekapan Muroja'ah Digital -{" "}
									{new Date().getFullYear()}
								</span>
								<ModeToggle />
							</div>
						</div>

						{/* Modern Marquee Component */}
						<div className="relative z-10">
							<ModernMarquee />
						</div>

						{/* Main Content */}
						<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
							{/* Page Title */}
							<div className="mb-8">{/*  */}</div>

							{/* Dosen & Stats Info Card */}
							<div className="mb-8 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg">
								<div className="flex flex-col gap-6">
									{/* --- Dosen Info Section --- */}
									<div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
										<div className="flex-shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
											<UserCircle2 className="w-10 h-10 text-white" />
										</div>
										<div className="flex-1">
											<p className="text-sm font-semibold text-cyan-500 dark:text-cyan-400 tracking-wider">
												DOSEN PEMBIMBING AKADEMIK
											</p>

											{isFetching ? (
												<div className="flex items-center justify-center md:justify-start">
													<Skeleton className="w-52 h-6 mt-2" />
												</div>
											) : (
												<h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 md:text-2xl">
													{dosen_pa?.nama}
												</h2>
											)}
											<div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
												{isFetching ? (
													<div className="flex items-center justify-center">
														<Skeleton className="w-48 h-5" />
													</div>
												) : (
													<div className="flex items-center justify-center gap-2">
														<UserSquare className="w-4 h-4" />{" "}
														<span className="font-mono text-sm">
															{dosen_pa?.nip}
														</span>
													</div>
												)}

												{isFetching ? (
													<div className="flex items-center justify-center">
														<Skeleton className="w-48 h-5 justify-center" />
													</div>
												) : (
													<div className="flex items-center justify-center gap-2">
														<Mail className="w-4 h-4" />{" "}
														<a
															href={`mailto:${dosen_pa?.email}`}
															className="hover:text-cyan-500 transition-colors text-sm"
														>
															{dosen_pa?.email}
														</a>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* --- Divider --- */}
									<hr className="border-slate-200/80 dark:border-slate-700/60" />

									{/* --- Stats Overview Section --- */}
									<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<StatsCard
											icon={<Users className="w-6 h-6 text-white" />}
											title="Total Mahasiswa"
											value={stats.totalStudents}
											colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
											isFetching={isFetching}
										/>
										<StatsCard
											icon={<BookCheck className="w-6 h-6 text-white" />}
											title="Total Surah Muroja'ah"
											value={stats.totalSurah}
											colorClass="bg-gradient-to-br from-green-500 to-green-600"
											isFetching={isFetching}
										/>
										<StatsCard
											icon={<CalendarDays className="w-6 h-6 text-white" />}
											title="Periode"
											value={`${getMonthName(periode_dipilih?.bulan)} ${
												periode_dipilih?.tahun
											}`}
											colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
											isFetching={isFetching}
										/>
									</div>
								</div>
							</div>

							{/* Students Data Section */}
							<div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-lg overflow-hidden py-2 mb-5">
								<div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
									<div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
										<ClipboardList className="w-8 h-8 text-white" />
									</div>
									<div className="flex flex-col gap-0.5">
										<h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
											Data Mahasiswa Bimbingan
										</h3>
										<p className="text-sm text-slate-500 dark:text-slate-400">
											Menampilkan {data_rekapan_murojaah.length} mahasiswa.
										</p>
									</div>
								</div>

								{/* Desktop Table */}
								<div className="hidden lg:block px-5">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="w-[50px]  text-center">
													No.
												</TableHead>
												<TableHead>Nama Mahasiswa</TableHead>
												<TableHead>NIM</TableHead>
												<TableHead className="text-center">Semester</TableHead>
												<TableHead className="text-center">
													Total Muroja'ah
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{data_rekapan_murojaah.map((mhs, index) => {
												const totalSurah = parseInt(
													mhs.total_murojaah.split(" ")[0]
												);
												return (
													<TableRow key={mhs.nim}>
														<TableCell className="text-center font-medium">
															{index + 1}
														</TableCell>
														<TableCell className="font-bold whitespace-nowrap">
															{mhs.nama}
														</TableCell>
														<TableCell className="font-mono">
															{mhs.nim}
														</TableCell>
														<TableCell className="text-center font-bold text-cyan-500 dark:text-cyan-400">
															{mhs.semester}
														</TableCell>
														<TableCell className="text-center font-bold">
															<div
																className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium $border-orange-400/20 bg-orange-400/10 text-orange-400 dark:bg-orange-400/20 dark:text-orange-200 w-24 justify-center`}
															>
																<BookOpen className="w-4 h-4" />
																{totalSurah} Surah
															</div>
														</TableCell>
													</TableRow>
												);
											})}
											{isFetching && (
												<TableLoadingSkeleton columns={6} rows={7} />
											)}
										</TableBody>
									</Table>
								</div>
								{/* Mobile/Tablet Cards */}
								<div className="lg:hidden p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-800/50">
									{data_rekapan_murojaah.map((mhs) => (
										<StudentCard key={mhs.nim} student={mhs} />
									))}
								</div>
							</div>
						</main>
					</div>
					<footer className="flex flex-col border-t border-foreground/20">
						<div className="z-10 md:px-16 py-10">
							<div className="grid grid-cols-1 md:p-8 p-3 text-center md:text-start md:grid-cols-3">
								{/* Logo and Copyright Section */}
								<div className="flex flex-col items-center space-y-4 md:items-start">
									<div className="flex items-center gap-1.5 rounded-xl">
										{theme === "dark" ? (
											<DarkLogoUSR className="w-8 h-8" />
										) : (
											<LightLogoUSR className="w-8 h-8" />
										)}
										<span className="text-base font-semibold">
											dashboard
											<span className="italic font-medium">.tif-usr</span>
										</span>
									</div>
									<p className="text-sm">
										Teknik Informatika © 2024-{new Date().getFullYear()}.
										<br className="md:hidden" />
										&nbsp;All rights reserved.
									</p>
								</div>
								{/* Contact Section */}
								<div className="flex justify-center md:justify-end">
									<div className="flex flex-col text-sm md:text-base mt-6 md:mt-0 mb-7 md:mb-0 items-center space-y-1 md:space-y-4 md:items-start">
										<div className="flex items-center gap-2">
											<PhoneCall className="w-5 h-5 " />
											<span className="">+62-878-6868-5950</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-5 h-5 " />
											<a target="_blank" href="mailto:tif@uin-suska.ac.id">
												tif@uin-suska.ac.id
											</a>
										</div>
										<div className="flex items-start gap-2">
											<MapPin className="w-5 h-5" />
											<p className="">Jl. HR. Soebrantas No.155 KM 18</p>
										</div>
									</div>
								</div>
								<div className="flex justify-center gap-4 md:justify-end ">
									<a href="#">
										<span className="sr-only">Facebook</span>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a href="#">
										<span className="sr-only">Twitter</span>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
										</svg>
									</a>
									<a href="#">
										<span className="sr-only">LinkedIn</span>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
									<a
										target="_blank"
										href="https://www.instagram.com/tifuinsuska/"
									>
										<span className="sr-only">Instagram</span>
										<svg
											className="w-6 h-6"
											fill="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												fillRule="evenodd"
												d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
												clipRule="evenodd"
											/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</footer>
				</div>
			)}
		</>
	);
}
