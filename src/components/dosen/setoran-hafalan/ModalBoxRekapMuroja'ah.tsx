import { Button } from "@/components/ui/button";
import { ClipboardListIcon, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function ModalBoxRekapMurojaah({
	isOpen,
	setIsOpen,
	handleButtonNext,
	handleButtonNextMobile,
	buttonLoading,
}: {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleButtonNext: (bulan: string, tahun: string) => void;
	handleButtonNextMobile: (bulan: string, tahun: string) => void;
	buttonLoading?: boolean;
}) {
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");

	const months = [
		{ value: "1", label: "Januari" },
		{ value: "2", label: "Februari" },
		{ value: "3", label: "Maret" },
		{ value: "4", label: "April" },
		{ value: "5", label: "Mei" },
		{ value: "6", label: "Juni" },
		{ value: "7", label: "Juli" },
		{ value: "8", label: "Agustus" },
		{ value: "9", label: "September" },
		{ value: "10", label: "Oktober" },
		{ value: "11", label: "November" },
		{ value: "12", label: "Desember" },
	];

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const yearOptions = [];
		for (let i = 0; i < 5; i++) {
			yearOptions.push(String(currentYear - i));
		}
		return yearOptions;
	}, []);

	const handleNext = () => {
		if (!selectedMonth || !selectedYear) {
			// Menggunakan console.error agar lebih terlihat saat debugging
			console.error("Bulan dan tahun wajib dipilih.");
			return;
		}

		console.log(selectedMonth, selectedYear);
		// Panggil fungsi handleButtonNext dengan bulan dan tahun yang dipilih
		handleButtonNext(selectedMonth, selectedYear);
	};
	const handleNextButton = () => {
		if (!selectedMonth || !selectedYear) {
			// Menggunakan console.error agar lebih terlihat saat debugging
			console.error("Bulan dan tahun wajib dipilih.");
			return;
		}

		console.log(selectedMonth, selectedYear);
		// Panggil fungsi handleButtonNext dengan bulan dan tahun yang dipilih
		handleButtonNextMobile(selectedMonth, selectedYear);
	};
	useEffect(() => {
		// Efek ini akan berjalan setiap kali nilai `isOpen` berubah.
		if (isOpen) {
			// Jika modal dibuka, reset state bulan dan tahun.
			setSelectedMonth("");
			setSelectedYear("");
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
					className="bg-gradient-to-br from-red-100/50 via-violet-100/50 to-pink-100/50 dark:from-black dark:via-violet-900/20 dark:to-black rounded-2xl shadow-2xl w-full max-w-xl relative animate-in fade-in-0 zoom-in-95"
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

						<div className="rounded-2xl shadow-md md:p-8 p-3 border border-foreground/10">
							<div className="flex flex-col gap-4 py-2">
								{/* Grid responsif: 1 kolom di mobile, 2 kolom di layar lebih besar */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<select
										className="border border-gray-300 bg-background rounded-md py-2 px-1.5 text-foreground"
										onChange={(e) => setSelectedMonth(e.target.value)}
										value={selectedMonth}
									>
										<option disabled value="">
											Pilih Bulan
										</option>
										{months.map((month) => (
											<option key={month.value} value={month.value}>
												{month.label}
											</option>
										))}
									</select>

									<select
										className="border border-gray-300 bg-background rounded-md py-2 px-1.5 text-foreground"
										onChange={(e) => setSelectedYear(e.target.value)}
										value={selectedYear}
									>
										<option disabled value="">
											Pilih Tahun
										</option>
										{years.map((year) => (
											<option key={year} value={year}>
												{year}
											</option>
										))}
									</select>
								</div>

								<Button
									onClick={handleNext}
									disabled={!selectedMonth || !selectedYear}
									className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 hidden md:flex"
								>
									{buttonLoading && <Loader2 className="mr-1 animate-spin" />}
									Selanjutnya
								</Button>
								<Button
									onClick={handleNextButton}
									disabled={!selectedMonth || !selectedYear}
									className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 md:hidden"
								>
									{buttonLoading && <Loader2 className="mr-1 animate-spin" />}
									Selanjutnya
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	);
}

export default ModalBoxRekapMurojaah;
