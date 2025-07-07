import { Button } from "@/components/ui/button";
import { ClipboardListIcon, Loader2, PrinterIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MonthYearPicker } from "./MonthYearPicker";

function ModalBoxRekapMurojaah({
	isOpen,
	setIsOpen,
	handleButtonNext,
	handleButtonNextMobile,
	buttonLoading,
}: {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleButtonNext: (bulan: number, tahun: number) => void;
	handleButtonNextMobile: (bulan: number, tahun: number) => void;
	buttonLoading?: boolean;
}) {
	// dapatkan bulan dan tahun saat ini
	const currentMonth = new Date().getMonth() + 1;
	const currentYear = new Date().getFullYear();

	const [monthYear, setMonthYear] = useState<{ bulan: number; tahun: number }>({
		bulan: currentMonth,
		tahun: currentYear,
	});

	const handleNext = () => {
		if (!monthYear.bulan || !monthYear.tahun) {
			// Menggunakan console.error agar lebih terlihat saat debugging
			console.error("Bulan dan tahun wajib dipilih.");
			return;
		}

		console.log(monthYear.bulan, monthYear.tahun);
		// Panggil fungsi handleButtonNext dengan bulan dan tahun yang dipilih
		handleButtonNext(monthYear.bulan, monthYear.tahun);
	};
	const handleNextButton = () => {
		if (!monthYear.bulan || !monthYear.tahun) {
			// Menggunakan console.error agar lebih terlihat saat debugging
			console.error("Bulan dan tahun wajib dipilih.");
			return;
		}

		console.log(monthYear.bulan, monthYear.tahun);
		// Panggil fungsi handleButtonNext dengan bulan dan tahun yang dipilih
		handleButtonNextMobile(monthYear.bulan, monthYear.tahun);
	};
	useEffect(() => {
		// Efek ini akan berjalan setiap kali nilai `isOpen` berubah.
		if (isOpen) {
			// Jika modal dibuka, reset state bulan dan tahun.
			setMonthYear({ bulan: currentMonth, tahun: currentYear });
		}
	}, [isOpen]);
	return (
		isOpen && (
			<div
				onClick={() => {
					setIsOpen(false);
				}}
				className="fixed inset-0 bg-gray-700 dark:bg-black dark:bg-opacity-70 bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[998] p-4 transition-opacity duration-300"
			>
				<div
					onClick={(e) => e.stopPropagation()}
					className="bg-gradient-to-br from-red-100/50 via-violet-100/50 to-pink-100/50 dark:from-black dark:via-violet-900/20 dark:to-black rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in-0 zoom-in-95"
				>
					<button
						onClick={() => setIsOpen(false)}
						className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>

					<div className="rounded-2xl shadow-md md:p-8 p-3 border border-foreground/10">
						<div className="flex items-center mb-6 group/header">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-green-500 to-violet-600 rounded-2xl blur-lg opacity-30 group-hover/header:opacity-50 transition-opacity duration-300"></div>
								<div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 via-violet-600 to-green-600 rounded-2xl shadow-lg mr-4 group-hover/header:scale-110 transition-transform duration-300">
									<ClipboardListIcon className="w-6 h-6 text-white" />
								</div>
							</div>
							<div>
								<h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
									Rekap Muroja'ah
								</h3>
								<div className="flex items-center gap-2 mt-1">
									<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
									<span className="text-sm text-slate-600 dark:text-slate-400">
										Cetak Rekapan Terkini
									</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-4 py-2 -mb-2">
							{/* Grid responsif: 1 kolom di mobile, 2 kolom di layar lebih besar */}
							<div className="w-full">
								<MonthYearPicker value={monthYear} onChange={setMonthYear} />
							</div>

							<Button
								onClick={handleNext}
								disabled={!monthYear.bulan || !monthYear.tahun || buttonLoading}
								className="w-full bg-green-600 hover:bg-green-700 text-white hidden md:flex"
							>
								{buttonLoading && <Loader2 className="mr-1 animate-spin" />}
								<PrinterIcon />
								Cetak Kartu Rekapan
							</Button>
							<Button
								onClick={handleNextButton}
								disabled={!monthYear.bulan || !monthYear.tahun || buttonLoading}
								className="w-full bg-green-600 hover:bg-green-700 text-white md:hidden"
							>
								{buttonLoading && <Loader2 className="mr-1 animate-spin" />}
								<PrinterIcon />
								Cetak Kartu Rekapan
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	);
}

export default ModalBoxRekapMurojaah;
