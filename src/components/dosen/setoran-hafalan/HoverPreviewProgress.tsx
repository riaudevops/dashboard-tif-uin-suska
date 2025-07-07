import React, { useMemo } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import ShinyProgressChart from "@/components/mahasiswa/setoran-hafalan/kartu-murojaah/shiny-progress-chart";
import { colourLabelingCategory } from "@/helpers/colour-labeling-category";

// --- Tipe Data (TypeScript) ---
interface InfoDasar {
	total_wajib_setor: number;
	total_sudah_setor: number;
	total_belum_setor: number;
	persentase_progres_setor: number;
	tgl_terakhir_setor: string;
	terakhir_setor: string;
}

interface RingkasanItem {
	label: string;
	total_wajib_setor: number;
	total_sudah_setor: number;
	total_belum_setor: number;
	persentase_progres_setor: number;
}

interface PreviewData {
	info_dasar: InfoDasar;
	ringkasan: RingkasanItem[];
}

// --- Komponen Progress Bar ---
const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
	const clampedPercentage = Math.max(0, Math.min(100, percentage));
	let bgColor = "bg-blue-600";
	if (percentage < 40) bgColor = "bg-red-500";
	else if (percentage < 75) bgColor = "bg-yellow-500";
	else bgColor = "bg-green-500";

	return (
		<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
			<div
				className={`${bgColor} h-2.5 rounded-full transition-all duration-500`}
				style={{ width: `${clampedPercentage}%` }}
			></div>
		</div>
	);
};

// --- Komponen Kartu Pratinjau (Disederhanakan dengan group-hover) ---
const HoverPreviewCard: React.FC<{ data: PreviewData; isFetching: boolean }> = ({ data, isFetching }) => {
	// State isHovering dan event handler tidak lagi diperlukan
	const { info_dasar, ringkasan } = data;

	const formattedDate = useMemo(() => {
		return new Date(info_dasar?.tgl_terakhir_setor).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	}, [info_dasar?.tgl_terakhir_setor]);

	return (
		// 1. Tambahkan 'group' di sini. Ini akan menjadi pemicu untuk 'group-hover'
		<div className="relative group">
			{/* Elemen Pemicu Hover */}
			<ShinyProgressChart
				className="cursor-pointer mx-2.5 transition-all duration-150"
				loading={isFetching}
				title={`${
					info_dasar?.total_sudah_setor || 0
				} dari ${info_dasar?.total_wajib_setor || 37}`}
				targetProgress={
					info_dasar?.persentase_progres_setor
				}
			/>

			{/* Kartu Pratinjau yang Muncul */}
			{/* 2. Logika hover sekarang dikontrol oleh class 'group-hover' */}
			<div
				className={`absolute z-[9999] w-96 -top-4 left-full ml-3 p-4 bg-white/90 dark:bg-slate-950/90 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl 
                transition-all duration-300 ease-in-out
                opacity-0 invisible -translate-x-4 
                group-hover:opacity-100 group-hover:visible group-hover:translate-x-0`}
			>
				{/* Bagian Info Dasar */}
				<div className="mb-4">
					<h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
						Ringkasan Umum
					</h3>
					<div className="flex justify-between items-center text-sm mb-1 text-gray-600 dark:text-gray-300">
						<span>Progres Keseluruhan</span>
						<span className="font-semibold text-gray-800 dark:text-gray-100">
							{isNaN(info_dasar?.persentase_progres_setor) ? 0 : Number(info_dasar?.persentase_progres_setor).toFixed(info_dasar?.persentase_progres_setor % 1 ? 2 : 0)}%
						</span>
					</div>
					<ProgressBar percentage={info_dasar?.persentase_progres_setor} />
					<div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
						<div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-md">
							<p className="font-bold text-blue-800 dark:text-blue-300 text-base">
								{info_dasar?.total_wajib_setor}
							</p>
							<p className="text-blue-600 dark:text-blue-400">Wajib</p>
						</div>
						<div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-md">
							<p className="font-bold text-green-800 dark:text-green-300 text-base">
								{info_dasar?.total_sudah_setor}
							</p>
							<p className="text-green-600 dark:text-green-400">Sudah</p>
						</div>
						<div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-md">
							<p className="font-bold text-red-800 dark:text-red-300 text-base">
								{info_dasar?.total_belum_setor}
							</p>
							<p className="text-red-600 dark:text-red-400">Belum</p>
						</div>
					</div>
					<div className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center justify-end">
						<Clock className="w-3 h-3 mr-1.5" />
						<span>
							Muroja'ah terakhir: {info_dasar?.terakhir_setor}&nbsp;&nbsp;{info_dasar?.tgl_terakhir_setor && <span>({formattedDate})</span>}
						</span>
					</div>
				</div>

				<hr className="border-gray-200 dark:border-gray-700" />

				{/* Bagian Ringkasan Detail */}
				<div className="mt-3">
					<h4 className="font-bold text-md text-gray-800 dark:text-gray-100 mb-2">
						Rincian Progres
					</h4>
					<div className="space-y-3">
						{ringkasan?.map((item) => (
							<div key={item.label}>
								<div className="flex justify-between items-center mb-1">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
										{colourLabelingCategory(item.label)[0]}
									</p>
									<div className="flex items-center space-x-2 text-xs">
										<span className="flex items-center text-green-600 dark:text-green-400">
											<CheckCircle className="w-3.5 h-3.5 mr-1" />
											{item.total_sudah_setor}
										</span>
										<span className="flex items-center text-red-600 dark:text-red-400">
											<XCircle className="w-3.5 h-3.5 mr-1" />
											{item.total_belum_setor}
										</span>
										<span className="font-semibold w-12 text-right text-gray-800 dark:text-gray-100">
											{item.persentase_progres_setor}%
										</span>
									</div>
								</div>
								<ProgressBar percentage={item.persentase_progres_setor} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HoverPreviewCard;