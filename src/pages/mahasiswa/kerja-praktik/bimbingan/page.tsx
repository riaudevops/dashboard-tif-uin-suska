import axios from "axios";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import APIKerjaPraktik from "@/services/api/mahasiswa/bimbingan-kp.service";
import DashboardLayout from "@/components/globals/layouts/dashboard-layout";
import DetailBimbinganModal from "@/components/mahasiswa/kerja-praktik/bimbingan/DetailBimbinganModal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Eye,
	CheckCircle,
	AlertCircle,
	Award,
	EyeClosed,
	Lock,
	Calendar,
	GraduationCapIcon,
} from "lucide-react";

interface Bimbingan {
	id: string;
	tanggal_bimbingan: string;
	catatan_bimbingan: string;
	status: string;
}

interface DosenPembimbing {
	nip: string;
	nama: string;
}

interface Mahasiswa {
	nama: string;
	nim: string;
}

interface BimbinganSayaResponse {
	id: string;
	judul_kp: string;
	mahasiswa: Mahasiswa;
	dosen_pembimbing: DosenPembimbing;
	bimbingan?: Bimbingan[];
}

const MahasiswaKerjaPraktikBimbinganPage = () => {
	const {
		data: bimbinganSaya,
		isLoading,
		isError,
		error,
	} = useQuery<BimbinganSayaResponse>({
		queryKey: ["bimbingan-saya"],
		queryFn: async () => {
			try {
				const response = await APIKerjaPraktik.getBimbinganSaya();
				return response.data;
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

	const [isDetailBimbinganModal, setDetailBimbinganModal] = useState(false);
	const [hoveredButton, setHoveredButton] = useState<string | null>(null);
	const [selectedBimbingan, setSelectedBimbingan] = useState<Bimbingan | null>(
		null
	);

	const minimumRequired = 5;
	const completedSessions = bimbinganSaya?.bimbingan?.length || 0;
	const remainingSessions = Math.max(0, minimumRequired - completedSessions);
	const isComplete = completedSessions >= minimumRequired;
	const progressPercentage = Math.round(
		(completedSessions / minimumRequired) * 100
	);

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

	const handleDetailClick = (bimbingan: Bimbingan) => {
		setSelectedBimbingan(bimbingan);
		setDetailBimbinganModal(true);
	};

	const ProgressCardSkeleton = () => (
		<Card className="col-span-2 overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-purple-600/60 to-indigo-700/60">
			<CardContent className="p-0">
				<div className="flex flex-col items-center gap-8 p-6 mt-8 md:flex-row">
					{/* Left side - Progress Circle Skeleton */}
					<div className="relative flex-shrink-0 w-48 h-48">
						<Skeleton className="w-full h-full rounded-full bg-white/10" />
					</div>
					{/* Right side - Progress Info Skeleton */}
					<div className="flex-1 w-full space-y-4">
						<Skeleton className="w-64 h-8 rounded-lg bg-white/10" />
						<Skeleton className="w-full h-20 rounded-lg bg-white/10" />
						<Skeleton className="w-full h-12 rounded-lg bg-white/10" />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	const StatsCardSkeleton = () => (
		<Card className="border border-gray-100 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Skeleton className="w-24 h-4 bg-gray-200 rounded dark:bg-gray-700" />
						<Skeleton className="w-16 h-8 mt-2 bg-gray-200 rounded dark:bg-gray-700" />
					</div>
					<Skeleton className="w-12 h-12 bg-gray-200 rounded-full dark:bg-gray-700" />
				</div>
			</CardContent>
		</Card>
	);

	const TableSkeleton = () => (
		<div className="border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
			<Table>
				<TableHeader>
					<TableRow className="bg-gray-50 dark:bg-gray-700/50">
						<TableHead className="w-24 font-bold text-center sm:w-auto"></TableHead>
						<TableHead className="w-24 font-bold text-center sm:w-auto"></TableHead>
						<TableHead className="w-24 font-bold text-center sm:w-auto"></TableHead>
						<TableHead className="w-24 font-bold text-center sm:w-auto"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[...Array(3)].map((_, index) => (
						<TableRow key={index} className="bg-background dark:bg-gray-700/30">
							<TableCell className="text-center">
								<Skeleton className="w-6 h-6 mx-auto bg-gray-200 rounded dark:bg-gray-700" />
							</TableCell>
							<TableCell className="text-center">
								<Skeleton className="w-24 h-6 mx-auto bg-gray-200 rounded dark:bg-gray-700" />
							</TableCell>
							<TableCell className="text-center">
								<Skeleton className="w-16 h-6 mx-auto bg-gray-200 rounded dark:bg-gray-700" />
							</TableCell>
							<TableCell className="text-center">
								<Skeleton className="w-24 h-8 mx-auto bg-gray-200 rounded dark:bg-gray-700" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);

	return (
		<DashboardLayout>
			<div className="p-0">
				<div className="flex mb-3">
					<span className="bg-white flex justify-center items-center shadow-sm text-gray-800 dark:text-gray-200 dark:bg-gray-900 px-2 py-0.5 rounded-md border border-gray-200 dark:border-gray-700 text-md font-medium tracking-tight">
						<span
							className={`inline-block animate-pulse w-3 h-3 rounded-full mr-2 bg-yellow-400`}
						/>
						<GraduationCapIcon className="w-4 h-4 mr-1.5" />
						Bimbingan Kerja Praktik Mahasiswa
					</span>
				</div>
				{/*  Error Message */}
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
					<div>
						<div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
							<ProgressCardSkeleton />
							<div className="grid grid-cols-1 col-span-1 gap-4">
								<StatsCardSkeleton />
								<StatsCardSkeleton />
								<StatsCardSkeleton />
							</div>
						</div>
						<TableSkeleton />
					</div>
				)}
				{/* Main Content*/}
				{!isLoading && !isError && bimbinganSaya && (
					<>
						<div className="grid grid-cols-1 gap-4 mb-6 lg:grid-cols-3">
							{/* Progress Card*/}
							<Card className="col-span-2 overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-purple-600 to-indigo-700">
								<CardContent className="p-0">
									<div className="flex flex-col items-center gap-8 p-6 px-8 mt-8 md:flex-row">
										{/* Left side - Progress Circle */}
										<div className="relative flex-shrink-0 w-48 h-48">
											{/* Main circle */}
											<div className="absolute inset-0 border rounded-full shadow-inner bg-white/10 backdrop-blur-sm border-white/20"></div>
											{/* Progress circle */}
											<svg className="absolute inset-0" viewBox="0 0 100 100">
												<circle
													cx="50"
													cy="50"
													r="42"
													fill="none"
													stroke="rgba(255,255,255,0.2)"
													strokeWidth="8"
												/>
												<circle
													cx="50"
													cy="50"
													r="42"
													fill="none"
													stroke="white"
													strokeWidth="8"
													strokeLinecap="round"
													strokeDasharray="264"
													strokeDashoffset={
														264 -
														(264 * Math.min(progressPercentage, 100)) / 100
													}
													transform="rotate(-90 50 50)"
												/>
											</svg>
											{/* Center content */}
											<div className="absolute inset-0 flex flex-col items-center justify-center">
												<div className="text-center">
													<span className="text-6xl font-bold">
														{completedSessions}
													</span>
													<span className="text-3xl font-medium text-white/70">
														/
													</span>
													<span className="text-3xl font-medium text-white/70">
														{minimumRequired}
													</span>
												</div>
												<p className="mt-2 text-sm font-medium text-white/70">
													Bimbingan
												</p>
											</div>
										</div>
										{/* Right side - Progress Info */}
										<div className="flex-1 space-y-4">
											<div className="flex items-center gap-2">
												{isComplete ? (
													<CheckCircle className="w-6 h-6 text-green-300" />
												) : (
													<AlertCircle className="w-6 h-6 text-amber-300" />
												)}
												<h3 className="text-2xl font-bold">
													{isComplete
														? "Persyaratan Terpenuhi!"
														: "Persyaratan Bimbingan"}
												</h3>
											</div>

											<p className="text-lg text-white/80">
												{isComplete
													? "Kamu telah memenuhi jumlah minimum bimbingan yang diperlukan!"
													: `Kamu harus menyelesaikan minimal ${minimumRequired} kali bimbingan!`}
											</p>

											{!isComplete && (
												<div className="px-4 py-3 mt-4 border rounded-lg bg-white/10 backdrop-blur-sm border-white/10">
													<p className="flex items-center gap-3 font-semibold">
														<span className="flex items-center justify-center w-11 text-sm font-bold text-purple-600 bg-white rounded-full h-7">
															{remainingSessions}
														</span>
														<span>
															Bimbingan lagi yang masih diperlukan nih untuk
															memenuhi persyaratan seminar kerja praktik!
														</span>
													</p>
												</div>
											)}

											{isComplete && (
												<div className="flex gap-2 mt-4">
													<Award className="w-6 h-6 text-yellow-300" />
													<p className="font-semibold text-green-300">
														Siap untuk tahap selanjutnya!
													</p>
												</div>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
							{/* Stats Cards */}
							<div className="grid grid-cols-1 col-span-1 gap-4">
								{/* Sessions Completed */}
								<Card className="border border-gray-100 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Bimbingan Selesai
												</p>
												<h3 className="mt-1 text-3xl font-bold">
													{completedSessions}
												</h3>
											</div>
											<div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full dark:bg-purple-900/30">
												<CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
											</div>
										</div>
									</CardContent>
								</Card>
								{/* Percentage Completed */}
								<Card className="border border-gray-100 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
									<CardContent className="p-4">
										<div className="flex items-center justify-between ">
											<div>
												<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Progress
												</p>
												<h3 className="mt-1 text-3xl font-bold">
													{progressPercentage}%
												</h3>
											</div>
											<div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full dark:bg-indigo-900/30">
												<svg
													className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M12 3V21M3 12H21M20 16L16 20M16 4L20 8M4 8L8 4M8 20L4 16"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</div>
										</div>
									</CardContent>
								</Card>
								{/* Remaining Sessions */}
								<Card className="border border-gray-100 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
													Sisa Bimbingan
												</p>
												<h3 className="mt-1 text-3xl font-bold">
													{remainingSessions}
												</h3>
											</div>
											<div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30">
												<AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
						{/* <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-200">
              Riwayat Bimbingan
            </h2> */}
						{/* Table */}
						<div className="border border-gray-100 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
							<Table>
								<TableHeader>
									<TableRow className="bg-gray-50 dark:bg-gray-700/50">
										<TableHead className="max-w-14 text-center sm:w-auto">
											Bimbingan Ke-
										</TableHead>
										<TableHead className="min-w-44 text-center sm:w-auto">
											Tanggal
										</TableHead>
										<TableHead className="w-24 text-center sm:w-auto">
											Status
										</TableHead>
										<TableHead className="w-24 text-center sm:w-auto">
											Aksi
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{bimbinganSaya?.bimbingan?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={4} className="py-8 text-center">
												<div className="flex flex-col items-center justify-center text-gray-500">
													<Calendar className="w-10 h-10 mb-3 opacity-50" />
													<p className="text-sm font-medium text-center">
														Kamu belum ada bimbingan dengan dospem nih...
													</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										bimbinganSaya?.bimbingan?.map(
											(item: Bimbingan, index: number) => (
												<TableRow
													key={item.id}
													className={
														index % 2 !== 0
															? "bg-secondary dark:bg-gray-700/10 cursor-pointer"
															: "bg-background dark:bg-gray-700/30 cursor-pointer"
													}
												>
													<TableCell className="font-medium text-center">
														{index + 1}.
													</TableCell>
													<TableCell className="text-center">
														{formatDate(item.tanggal_bimbingan)}
													</TableCell>
													<TableCell className="text-center">
														<Badge
															variant="outline"
															className="px-3 py-1 font-medium text-green-900 bg-green-200 rounded-lg hover:bg-green-100"
														>
															{item.status}
														</Badge>
													</TableCell>
													<TableCell className="text-center">
														<Button
															className="text-white transition-colors bg-blue-500 shadow-sm hover:bg-blue-600"
															size="sm"
															onClick={() => handleDetailClick(item)}
															onMouseEnter={() => setHoveredButton(item.id)}
															onMouseLeave={() => setHoveredButton(null)}
														>
															{hoveredButton === item.id ? (
																<Eye size={16} />
															) : (
																<EyeClosed size={16} />
															)}
															Lihat Detail
														</Button>
													</TableCell>
												</TableRow>
											)
										)
									)}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
			<DetailBimbinganModal
				isOpen={isDetailBimbinganModal}
				onClose={() => {
					setDetailBimbinganModal(false);
					setSelectedBimbingan(null);
				}}
				bimbinganSaya={{
					judul: bimbinganSaya?.judul_kp ?? "",
					nama: bimbinganSaya?.mahasiswa.nama ?? "",
					nim: bimbinganSaya?.mahasiswa.nim ?? "",
					dosenPembimbing: bimbinganSaya?.dosen_pembimbing.nama ?? "",
					evaluasi: selectedBimbingan?.catatan_bimbingan ?? "",
					tanggal: selectedBimbingan?.tanggal_bimbingan
						? formatDate(selectedBimbingan.tanggal_bimbingan)
						: "",
				}}
			/>
		</DashboardLayout>
	);
};

export default MahasiswaKerjaPraktikBimbinganPage;
