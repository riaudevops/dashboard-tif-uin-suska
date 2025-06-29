import React from "react";
import { MahasiswaSetoranHafalanStatistikPageProps } from "@/interfaces/pages/mahasiswa/setoran-hafalan/statistik/statistik.interface";
import { BookOpen, X } from "lucide-react";
import ShinyProgressChart from "@/components/mahasiswa/setoran-hafalan/kartu-murojaah/shiny-progress-chart";

interface ProgresSetoranProps {
	label: string;
	persentase_progres_setor: number;
	total_belum_setor: number;
	total_sudah_setor: number;
	total_wajib_setor: number;
}

function ModalBoxStatistik({
  dataRingkasan, isOpen, setIsOpen, isFetching}: { dataRingkasan: MahasiswaSetoranHafalanStatistikPageProps[], isOpen: boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, isFetching: boolean }) {
  return (
    isOpen && (
				<div
					onClick={() => {
						setIsOpen(false);
					}}
					className="fixed inset-0 bg-gray-700 dark:bg-black dark:bg-opacity-70 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 transition-opacity duration-300"
				>
					<div
						onClick={(e) => e.stopPropagation()}
						className="bg-gradient-to-br from-red-100/50 via-violet-100/50 to-pink-100/50 dark:from-black dark:via-violet-900/20 dark:to-black rounded-2xl shadow-2xl w-full max-w-6xl relative animate-in fade-in-0 zoom-in-95"
					>
						<button
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
						>
							<X className="w-6 h-6" />
						</button>

						<div className="rounded-2xl shadow-md md:p-8 p-3 border border-foreground/10">
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
									{dataRingkasan?.map(
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
												SIDANG_TA: "Sidang Tugas Akhir",
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
													<ShinyProgressChart
														targetProgress={item.persentase_progres_setor}
														loading={isFetching}
													/>
													<div className="text-sm opacity-75 bg-background rounded-md whitespace-nowrap px-2">
														<div>
															{item.total_sudah_setor} dari{" "}
															{item.total_wajib_setor} selesai
														</div>
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
  );
}

export default ModalBoxStatistik;
