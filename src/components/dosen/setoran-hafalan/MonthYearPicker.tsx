import { useState, useRef, useEffect } from "react";

// === Ikon SVG untuk UI yang lebih bersih ===
const CalendarIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-5 w-5 text-gray-400 dark:text-gray-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
);

const ChevronLeftIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M15 19l-7-7 7-7"
		/>
	</svg>
);

const ChevronRightIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-6 w-6"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M9 5l7 7-7 7"
		/>
	</svg>
);

const ChevronDownIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="h-4 w-4 ml-1"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M19 9l-7 7-7-7"
		/>
	</svg>
);

interface MonthYearPickerProps {
	value: {
		tahun: number;
		bulan: number;
	};
	onChange: (value: { tahun: number; bulan: number }) => void;
}

// === Komponen Utama MonthYearPicker ===
export const MonthYearPicker = ({ value, onChange }: MonthYearPickerProps) => {
	// Batasan tahun
	const MIN_YEAR = 2000;
	const MAX_YEAR = 2078;

	const [isOpen, setIsOpen] = useState(false);
	const [displayYear, setDisplayYear] = useState(value.tahun);
	const [viewMode, setViewMode] = useState("months");

	const pickerRef = useRef<HTMLDivElement>(null);
	// Nama bulan versi panjang untuk display
	const longMonths = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];
	// Nama bulan versi singkat untuk tombol di picker
	const shortMonths = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"Mei",
		"Jun",
		"Jul",
		"Agu",
		"Sep",
		"Okt",
		"Nov",
		"Des",
	];

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				pickerRef.current instanceof HTMLElement &&
				!pickerRef.current.contains(event.target as Node | null)
			) {
				setIsOpen(false);
			}
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setIsOpen(false);
		}
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	useEffect(() => {
		setDisplayYear(value.tahun);
	}, [value.tahun]);

	const handleMonthSelect = (monthIndex: number) => {
		onChange({ tahun: displayYear, bulan: monthIndex + 1 });
		setIsOpen(false);
	};

	const handleYearSelect = (year: number) => {
		setDisplayYear(year);
		setViewMode("months");
	};

	const handleHeaderNavigation = (amount: number) => {
		const step = viewMode === "years" ? 10 : 1;
		setDisplayYear((prevYear) => {
			const newYear = prevYear + amount * step;
			// Pastikan tahun baru tidak melebihi batasan
			if (newYear > MAX_YEAR) return MAX_YEAR;
			if (newYear < MIN_YEAR) return MIN_YEAR;
			return newYear;
		});
	};

	const togglePicker = () => {
		if (isOpen) setViewMode("months");
		setIsOpen(!isOpen);
	};

	const startDecadeYear = Math.floor(displayYear / 10) * 10;
	const yearGrid = Array.from(
		{ length: 12 },
		(_, i) => startDecadeYear - 1 + i
	);
	const displayValue = `${longMonths[value.bulan - 1]} ${value.tahun}`;

	return (
		<div ref={pickerRef} className="relative w-full font-sans">
			{/* Input Display */}
			<div
				onClick={togglePicker}
				className="bg-white dark:bg-gray-700 relative border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-full flex items-center justify-between text-gray-800 dark:text-gray-200"
			>
				<span className="block truncate">{displayValue}</span>
				<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
					<CalendarIcon />
				</span>
			</div>

			{/* Dropdown Picker */}
			{isOpen && (
				<div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 border border-gray-200 dark:border-gray-700">
					{/* Header Navigasi Tahun / Dekade */}
					<div className="flex justify-between items-center mb-3 text-gray-800 dark:text-gray-200">
						<button
							type="button"
							onClick={() => handleHeaderNavigation(-1)}
							className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={
								viewMode === "years"
									? startDecadeYear <= MIN_YEAR
									: displayYear <= MIN_YEAR
							}
						>
							<ChevronLeftIcon />
						</button>
						<button
							type="button"
							onClick={() => viewMode === "months" && setViewMode("years")}
							className="font-semibold text-lg hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded-md flex items-center"
							disabled={viewMode === "years"}
						>
							{viewMode === "months" ? (
								<>
									{displayYear}
									<ChevronDownIcon />
								</>
							) : (
								`${startDecadeYear} - ${startDecadeYear + 11}`
							)}
						</button>
						<button
							type="button"
							onClick={() => handleHeaderNavigation(1)}
							className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={
								viewMode === "years"
									? startDecadeYear + 11 >= MAX_YEAR
									: displayYear >= MAX_YEAR
							}
						>
							<ChevronRightIcon />
						</button>
					</div>

					{/* Grid Bulan atau Grid Tahun */}
					{viewMode === "months" ? (
						<div className="grid grid-cols-4 gap-2">
							{shortMonths.map((month, index) => {
								const isSelected =
									value.tahun === displayYear && value.bulan === index + 1;
								return (
									<button
										key={month}
										onClick={() => handleMonthSelect(index)}
										className={`p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150 ${
											isSelected
												? "bg-indigo-600 text-white font-bold"
												: "hover:bg-indigo-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
										}`}
									>
										{month}
									</button>
								);
							})}
						</div>
					) : (
						<div className="grid grid-cols-4 gap-2">
							{yearGrid.map((year) => {
								const isSelected = value.tahun === year;
								const isDisabled = year < MIN_YEAR || year > MAX_YEAR;
								return (
									<button
										key={year}
										onClick={() => handleYearSelect(year)}
										disabled={isDisabled}
										className={`p-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors duration-150 ${
											isSelected
												? "bg-indigo-600 text-white font-bold"
												: "hover:bg-indigo-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
										} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent`}
									>
										{year}
									</button>
								);
							})}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
