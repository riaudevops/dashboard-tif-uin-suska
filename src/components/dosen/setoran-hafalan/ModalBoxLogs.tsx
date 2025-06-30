import React from "react";
import { DataLogsProps } from "@/interfaces/components/dosen/setoran-hafalan/modal-box-logs.interface";
import { HistoryIcon, X } from "lucide-react";
import LogAktivitas from "@/components/mahasiswa/setoran-hafalan/kartu-murojaah/log-akitivitas";

function ModalBoxLogs({
		isOpen,
		setIsOpen,
		dataLogs,
	}: {
		dataLogs: DataLogsProps[];
		isOpen: boolean;
		setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	}) {
		return (
			isOpen && <div
				onClick={() => {
					setIsOpen(false);
				}}
				className="fixed inset-0 bg-gray-700 dark:bg-black dark:bg-opacity-70 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4 transition-opacity duration-300"
			>
				<div
					onClick={(e) => e.stopPropagation()}
					className="bg-gradient-to-br from-red-100/50 via-violet-100/50 to-pink-100/50 dark:from-black dark:via-violet-900/20 dark:to-black rounded-2xl shadow-2xl w-full max-w-5xl relative animate-in fade-in-0 zoom-in-95"
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
								<div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 via-pink-600 to-orange-600 rounded-2xl shadow-lg mr-4 group-hover/header:scale-110 transition-transform duration-300">
									<HistoryIcon className="w-6 h-6 text-white" />
								</div>
							</div>
							<div>
								<h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
									Aktivitas Muroja'ah
								</h3>
								<div className="flex items-center gap-2 mt-1">
									<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
									<span className="text-sm text-slate-600 dark:text-slate-400">
										Riwayat Terkini
									</span>
								</div>
							</div>
						</div>

						{
							dataLogs?.length === 0 ?
							<LogAktivitas logData={[{ 
								id: 404,
								keterangan: "Mahasiswa ini belum pernah melakukan aktivitas muroja'ah.",
								ip: "127.0.0.1",
								aksi: "Belum Ada",
								user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/237.84.2.178 Safari/537.36",
								timestamp: "1945-08-17T12:34:56.789Z",
								dosen_yang_mengesahkan: {
									nama: "M. Farhan Aulia Pratama",
									email: "farhanaulia.p@gmail.com",
								},
							}, {
								id: 404,
								keterangan: "Silahkan mulai muroja'ah untuk memperoleh catatan riwayat.",
								ip: "127.0.0.1",
								aksi: "Belum Ada",
								user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/237.84.2.178 Safari/537.36",
								timestamp: "1945-08-17T12:34:56.789Z",
								dosen_yang_mengesahkan: {
									nama: "M. Farhan Aulia Pratama",
									email: "farhanaulia.p@gmail.com",
								},
							}
							]} /> :
							<LogAktivitas logData={dataLogs} />
						}
					</div>
				</div>
			</div>
		);
}

export default ModalBoxLogs;