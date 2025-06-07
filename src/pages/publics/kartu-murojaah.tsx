import {
	BookCheckIcon,
	BookOpen,
	FileBadge,
	GraduationCap,
	Mail,
	MapPin,
	MedalIcon,
	PhoneCall,
	ShieldHalf,
	Sparkles,
	TrendingUp,
	User,
	UserCircle2Icon,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import { useTheme } from "@/components/themes/theme-provider";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import APISetoran from "@/services/api/public/setoran-hafalan.service";
import ProgressChart from "../../components/mahasiswa/setoran-hafalan/kartu-murojaah/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import TableLoadingSkeleton from "@/components/globals/table-loading-skeleton";
import { ModeToggle } from "@/components/themes/mode-toggle";
import NotFoundPage from "./not-found.page";
import { AxiosError } from "axios";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";
interface ProgresSetoranProps {
	label: string;
	persentase_progres_setor: number;
	total_belum_setor: number;
	total_sudah_setor: number;
	total_wajib_setor: number;
}
interface Dosen {
	nama: string;
	nip: string;
	email: string;
}

interface Setoran {
	id: string;
	tgl_setoran: string;
	tgl_validasi: string;
	dosen_yang_mengesahkan: Dosen;
}

interface MahasiswaSetoran {
	id: string;
	nama: string;
	nama_arab: string;
	external_id: string;
	label: string;
	sudah_setor: boolean;
	info_setoran: Setoran;
}

interface ResponError {
	response: string;
	message: string;
}

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

const MarqueeItem = ({ icon, text }: { icon: JSX.Element; text: string }) => (
	<div className="flex items-center mx-6">
		{icon}
		<span className="text-sm font-medium text-gray-800 dark:text-gray-200">
			{text}
		</span>
	</div>
);

// Komponen Marquee Utama
const ModernMarquee = () => {
	const announcements = [
		{ text: "Selamat datang di Halaman Kartu Muroja'ah Digital.", icon: <MegaphoneIcon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />}, 
		{ text: "Halaman ini ditujukan untuk melakukan validasi keaslian progres hafalan mahasiswa.", icon: <MedalIcon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />},
		{ text: "Halaman ini merupakan acuan utama dan versi digital dari kartu muroja'ah fisik mahasiswa.", icon: <BookCheckIcon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />},
		{ text: "Jika terdapat data yang tidak sesuai, harap segera melapor kepada tim teknis untuk klarifikasi lebih lanjut.", icon: <UserCircle2Icon className="w-5 h-5 mr-3 text-yellow-500 shrink-0" />},
	];

	return (
		<div className="relative flex overflow-x-hidden bg-yellow-50 border-y border-yellow-300 dark:bg-yellow-800/20 dark:border-yellow-900/20">
			{/*
        Elemen ini menggunakan animasi kustom 'marquee' yang didefinisikan di CSS global atau <style> tag.
        Kita merender list dua kali untuk menciptakan efek loop yang mulus.
      */}
			<div className="py-3 animate-marquee whitespace-nowrap flex">
				{announcements.map((announcement, index) => (
					<MarqueeItem key={index} text={announcement.text} icon={announcement.icon} />
				))}
			</div>

			<div className="absolute top-0 py-3 animate-marquee2 whitespace-nowrap flex">
				{announcements.map((announcement, index) => (
					<MarqueeItem key={index} text={announcement.text} icon={announcement.icon} />
				))}
			</div>
		</div>
	);
};

const KartuMurojaahPage = () => {
	const { id } = useParams<{ id: string }>();

	const {
		data: dataRingkasan,
		isFetching,
		error,
		isError,
	} = useQuery({
		queryKey: ["kartu-murojaah-digital", id],
		queryFn: () =>
			APISetoran.getKartuMurojaahDigital({ id: id! }).then((data) => data),
		staleTime: Infinity,
	});
	const infoDataMahasiswa = dataRingkasan?.data?.info;
	const dataRingkasanSetoran = dataRingkasan?.data?.setoran?.ringkasan;

	const dataSurah = dataRingkasan?.data?.setoran?.detail;
	const { theme } = useTheme();
	return (
		<div className="min-h-screen bg-background">
			{/* Tambahkan tag <style> untuk mendefinisikan animasi marquee */}
			<style>
				{`
					@keyframes marquee {
						0% { transform: translateX(0%); }
						100% { transform: translateX(-100%); }
					}
					@keyframes marquee2 {
						0% { transform: translateX(100%); }
						100% { transform: translateX(0%); }
					}
					.animate-marquee {
						animation: marquee 40s linear infinite;
					}
					.animate-marquee2 {
						animation: marquee2 40s linear infinite;
					}
				`}
			</style>
			{!(error as AxiosError<ResponError>)?.response?.data?.response &&
			isError ? (
				<NotFoundPage />
			) : (
				<>
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
						<ModeToggle />
					</div>

					{/* Create Marquee with Yellow BG */}
					<ModernMarquee />

					<div className="max-w-6xl mx-auto px-4 mt-5">
						{/* Informasi Mahasiswa */}
						<div className="bg-card rounded-2xl shadow-md p-8 border border-foreground/20 -mt-2 mb-6">
							<div className="flex items-center mb-8 group/header">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover/header:opacity-50 transition-opacity duration-300"></div>
									<div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg mr-4 group-hover/header:scale-110 transition-transform duration-300">
										<User className="w-6 h-6 text-white" />
									</div>
								</div>
								<div>
									<h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
										Informasi Mahasiswa
									</h3>
									<div className="flex items-center gap-2 mt-1">
										<div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Data Akademik Terkini
										</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-3 justify-center items-center">
								{/* Avatar with Multiple Layers */}
								<div className="relative mb-3">
									{/* Outer Glow Ring */}
									<div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full blur-md opacity-30 group-hover/profile:opacity-60 transition-opacity duration-500 animate-pulse"></div>

									{/* Middle Ring */}
									<div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 p-1 shadow-2xl group-hover/profile:scale-110 transition-transform duration-500">
										{/* Inner Avatar */}
										<div className="flex items-center justify-center h-full w-full rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white text-xl md:text-2xl font-bold shadow-inner relative overflow-hidden">
											{/* Shimmer Effect */}
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>

											{isFetching ? (
												<Skeleton className="w-full h-full rounded-full" />
											) : (
												<span className="relative z-10">
													{infoDataMahasiswa?.nama
														.split(" ")
														.slice(0, 2)
														.map((word: string) => word.charAt(0))
														.join("")}
												</span>
											)}
										</div>
									</div>

									{/* Status Indicator */}
									<div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 group-hover/profile:scale-125 transition-transform duration-300">
										<Sparkles className="w-3 h-3 text-white animate-spin-slow" />
									</div>
								</div>
								{/* Student Info with Enhanced Typography */}
								<div className="text-center space-y-2">
									{isFetching ? (
										<div className="flex flex-col items-center space-y-3">
											<Skeleton className="w-48 h-7 rounded-lg" />
											<Skeleton className="w-32 h-5 rounded-lg" />
										</div>
									) : (
										<>
											<h4 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2 tracking-tight">
												{infoDataMahasiswa?.nama}
											</h4>
											<div className="flex items-center justify-center gap-2">
												<div className="w-1 h-1 bg-slate-400 rounded-full"></div>
												<p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium tracking-wide">
													{infoDataMahasiswa?.nim}
												</p>
												<div className="w-1 h-1 bg-slate-400 rounded-full"></div>
											</div>
										</>
									)}
								</div>
								{/* Enhanced Grid Cards */}
								<div className="mt-3 rounded-2xl grid grid-cols-2 md:grid-cols-3 w-full overflow-hidden shadow-xl border border-white/20 dark:border-slate-700/30 backdrop-blur-sm">
									{/* Dosen PA Card - Enhanced */}
									<div className="col-span-2 md:col-span-1 group/card relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-violet-800"></div>
										<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover/card:from-white/20 transition-all duration-300"></div>
										<div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover/card:scale-150 transition-transform duration-500"></div>

										<div className="relative py-6 px-6 h-full">
											<div className="flex justify-between items-center h-full">
												<div className="flex-1">
													<label className="block text-xs font-semibold mb-2 text-fuchsia-100/90 tracking-wider uppercase">
														Dosen PA
													</label>
													{isFetching ? (
														<Skeleton className="w-full h-5 bg-white/20 rounded" />
													) : (
														<p className="text-base md:text-lg font-bold tracking-tight text-white leading-tight">
															{infoDataMahasiswa?.dosen_pa.nama}
														</p>
													)}
												</div>
												<div className="ml-4 group-hover/card:scale-110 group-hover/card:rotate-12 transition-transform duration-300">
													<GraduationCap className="w-7 h-7 text-white/90" />
												</div>
											</div>
										</div>
									</div>

									{/* Semester Card - Enhanced */}
									<div className="group/card relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700"></div>
										<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover/card:from-white/20 transition-all duration-300"></div>
										<div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg group-hover/card:scale-150 transition-transform duration-500"></div>

										<div className="relative py-6 px-6 h-full">
											<div className="flex justify-between items-center h-full">
												<div>
													<label className="block text-xs font-semibold mb-2 text-emerald-100 tracking-wider uppercase">
														Semester
													</label>
													{isFetching ? (
														<Skeleton className="w-12 h-6 bg-white/20 rounded" />
													) : (
														<p className="text-2xl font-bold text-white">
															{infoDataMahasiswa?.semester}
														</p>
													)}
												</div>
												<div className="group-hover/card:scale-110 group-hover/card:rotate-12 transition-transform duration-300">
													<TrendingUp className="w-7 h-7 text-white/90" />
												</div>
											</div>
										</div>
									</div>

									{/* Angkatan Card - Enhanced */}
									<div className="group/card relative overflow-hidden">
										<div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600"></div>
										<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover/card:from-white/20 transition-all duration-300"></div>
										<div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full blur-lg group-hover/card:scale-150 transition-transform duration-500"></div>

										<div className="relative py-6 px-6 h-full">
											<div className="flex justify-between items-center h-full">
												<div>
													<label className="block text-xs font-semibold mb-2 text-orange-100 tracking-wider uppercase">
														Angkatan
													</label>
													{isFetching ? (
														<Skeleton className="w-12 h-6 bg-white/20 rounded" />
													) : (
														<p className="text-2xl font-bold text-white">
															{infoDataMahasiswa?.angkatan}
														</p>
													)}
												</div>
												<div className="group-hover/card:scale-110 group-hover/card:rotate-12 transition-transform duration-300">
													<ShieldHalf className="w-7 h-7 text-white/90" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Progress Hafalan Overview */}
						<div className="bg-card rounded-2xl shadow-md p-8 border border-foreground/20 mb-6">
							<div className="flex items-center mb-8 group/header">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-violet-600 rounded-2xl blur-lg opacity-30 group-hover/header:opacity-50 transition-opacity duration-300"></div>
									<div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 via-violet-600 to-green-600 rounded-2xl shadow-lg mr-4 group-hover/header:scale-110 transition-transform duration-300">
										<BookOpen className="w-6 h-6 text-white" />
									</div>
								</div>
								<div>
									<h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
										Progres Muroja'ah
									</h3>
									<div className="flex items-center gap-2 mt-1">
										<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Statistik Terkini
										</span>
									</div>
								</div>
							</div>
							<div className="md:grid md:grid-cols-5 md:gap-4">
								<div className="flex gap-3 overflow-x-auto pb-3 md:pb-0 md:contents">
									{dataRingkasanSetoran?.map(
										(item: ProgresSetoranProps, index: number) => {
											const colors = [
												"from-blue-100 to-blue-50 dark:from-blue-950 dark:to-gray-900 text-blue-800 dark:text-blue-300",
												"from-green-100 to-green-50 dark:from-green-950 dark:to-gray-900 text-green-800 dark:text-green-300", // SEMKP
												"from-purple-100 to-purple-50 dark:from-purple-950 dark:to-gray-900 text-purple-800 dark:text-purple-300", // DAFTAR_TA
												"from-orange-100 to-orange-50 dark:from-orange-950 dark:to-gray-900 text-orange-800 dark:text-orange-300", // SEMPRO
												"from-pink-100 to-pink-50 dark:from-pink-950 dark:to-gray-900 text-pink-800 dark:text-pink-300", // SIDANG_TA
											];

											// Define display names for each label
											const displayNames: { [key: string]: string } = {
												KP: "Kerja Praktik",
												SEMKP: "Seminar Kerja Praktik",
												DAFTAR_TA: "Tugas Akhir",
												SEMPRO: "Seminar Proposal",
												SIDANG_TA: "Sidang Akhir",
											};

											return (
												<div
													key={item.label || index}
													className={`text-center bg-gradient-to-br ${
														colors[index] || "from-gray-500 to-gray-600"
													} rounded-xl shadow-lg flex flex-col items-center justify-center py-3.5 px-2 tracking-tight`}
												>
													<div className="text-base bg-background rounded-md whitespace-nowrap px-2 font-medium">
														{displayNames[item.label] || item.label}
													</div>
													{/* progress bar */}
													<ProgressChart
														targetProgress={item.persentase_progres_setor}
														loading={isFetching}
													/>
													<div className="text-sm opacity-75 bg-background rounded-md whitespace-nowrap px-2">
														<div>
															{item.total_sudah_setor} dari {item.total_wajib_setor}{" "}
															selesai
														</div>
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						</div>

						{/* Detail Surah */}
						<div className="bg-card rounded-2xl shadow-md p-8 border border-foreground/20 mb-6">
							<div className="flex items-center mb-8 group/header">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-violet-600 rounded-2xl blur-lg opacity-30 group-hover/header:opacity-50 transition-opacity duration-300"></div>
									<div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 via-green-600 to-purple-600 rounded-2xl shadow-lg mr-4 group-hover/header:scale-110 transition-transform duration-300">
										<FileBadge className="w-6 h-6 text-white" />
									</div>
								</div>
								<div>
									<h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
										Detail Muroja'ah
									</h3>
									<div className="flex items-center gap-2 mt-1">
										<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
										<span className="text-sm text-slate-600 dark:text-slate-400">
											Riwayat Terakhir
										</span>
									</div>
								</div>
							</div>
							<div className="overflow-x-auto">
								<Table className="w-full">
									<TableHeader>
										<TableRow className="border hover:bg-muted border-solid border-secondary bg-muted">
											<TableHead className="text-center p-4 font-semibold">
												No.
											</TableHead>
											<TableHead className="text-center p-4 font-semibold ">
												Nama Surah
											</TableHead>
											<TableHead className="text-center p-4 font-semibold">
												Tanggal Muroja'ah
											</TableHead>
											<TableHead className="text-center p-4 font-semibold">
												Persyaratan Muroja'ah
											</TableHead>
											<TableHead className="text-center p-4 font-semibold">
												Dosen Yang Mengesahkan
											</TableHead>
											<TableHead className="text-center p-4 font-semibold">
												Status Muroja'ah
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{dataSurah?.map(
											(surah: MahasiswaSetoran, index: number) => (
												<TableRow
													key={index}
													className={
														index % 2 !== 0
															? "bg-secondary hover:bg-secondary"
															: "bg-background hover:bg-background"
													}
												>
													<TableCell className="p-4 text-center font-medium">
														{index + 1}.
													</TableCell>
													<TableCell className="p-4 text-center">
														<div className="font-semibold">
															{surah.nama} - {surah.nama_arab}
														</div>
													</TableCell>
													<TableCell className="p-4 text-center">
														{surah?.sudah_setor &&
															new Date(surah?.info_setoran?.tgl_setoran)
																.toLocaleDateString("id-ID", {
																	day: "2-digit",
																	month: "long",
																	year: "numeric",
																})
																.replace(/^(\d+)\s(\w+)\s(\d+)$/, "$1 $2, $3")}
													</TableCell>
													<TableCell className="text-center">
														<div
															className={`py-1 px-3 rounded-2xl text-center text-white inline-block ${
																colourLabelingCategory(surah.label)[1]
															}`}
														>
															{colourLabelingCategory(surah.label)[0]}
														</div>
													</TableCell>
													<TableCell className="p-4 text-center">
														{surah?.info_setoran?.dosen_yang_mengesahkan.nama}
													</TableCell>
													<TableCell className="p-4 text-center">
														<span
															className={`${
																surah.sudah_setor
																	? "text-green-100 bg-green-700"
																	: "text-red-100 bg-red-700"
															} px-2.5 py-1.5 rounded-full text-md font-medium border`}
														>
															{surah.sudah_setor ? "Selesai" : "Belum"}
														</span>
													</TableCell>
												</TableRow>
											)
										)}
										{isFetching && (
											<TableLoadingSkeleton columns={6} rows={7} />
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
					{/* Footer */}
					<footer className="flex flex-col border-t border-foreground/20">
						<div className="z-10 px-16 py-10">
							<div className="grid grid-cols-1 gap-8 text-center md:text-start md:grid-cols-3">
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
										Teknik Informatika. © 2025. All rights reserved.
									</p>
								</div>
								{/* Contact Section */}
								<div className="flex justify-center md:justify-end">
									<div className="flex flex-col items-center space-y-4 md:items-start">
										<div className="flex items-center gap-2">
											<PhoneCall className="w-5 h-5 " />
											<span className="">+62878-6868-5950</span>
										</div>
										<div className="flex items-center gap-2">
											<Mail className="w-5 h-5 " />
											<a target="_blank" href="mailto:tif@uin-suska.ac.id">
												tif@uin-suska.ac.id
											</a>
										</div>
										<div className="flex items-start gap-2">
											<MapPin className="hidden w-5 h-5 md:block" />
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
				</>
			)}
		</div>
	);
};

export default KartuMurojaahPage;
