import { MahasiswaSetoran } from "@/interfaces/pages/dosen/setoran-hafalan/mahasiswa-pa/detail-mahasiswa-setoran.interface";
import { CircleX } from "lucide-react";

// --- ICONS (lucide-react & custom) ---
const CheckCircle2 = (props: any) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
		<path d="m9 12 2 2 4-4" />
	</svg>
);

const UserCheck = (props: any) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<polyline points="16 11 18 13 22 9" />
	</svg>
);
const CalendarDays = (props: any) => (
	<svg
		{...props}
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
		<line x1="16" x2="16" y1="2" y2="6" />
		<line x1="8" x2="8" y1="2" y2="6" />
		<line x1="3" x2="21" y1="10" y2="10" />
	</svg>
);

const OrnamentIcon = (props: any) => (
	<svg
		viewBox="0 0 38 43"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M17.3036 2.10426C18.0868 0.850113 19.9132 0.850113 20.6964 2.10426L24.5063 8.20509C25.2111 9.33361 26.4309 10.0378 27.7606 10.0839L34.949 10.333C36.4267 10.3842 37.3399 11.9659 36.6454 13.2712L33.2669 19.6212C32.642 20.7958 32.642 22.2042 33.2669 23.3788L36.6454 29.7288C37.3399 31.0341 36.4267 32.6158 34.949 32.667L27.7606 32.9161C26.4309 32.9622 25.2111 33.6664 24.5063 34.7949L20.6964 40.8957C19.9132 42.1499 18.0868 42.1499 17.3036 40.8957L13.4937 34.7949C12.7889 33.6664 11.5691 32.9622 10.2394 32.9161L3.05099 32.667C1.57325 32.6158 0.660093 31.0341 1.35461 29.7288L4.7331 23.3788C5.35804 22.2042 5.35805 20.7958 4.7331 19.6212L1.35461 13.2712C0.660093 11.9659 1.57325 10.3842 3.05099 10.333L10.2394 10.0839C11.5691 10.0378 12.7889 9.33361 13.4937 8.20509L17.3036 2.10426Z"
			stroke="currentColor"
			strokeWidth="1.5"
		></path>
	</svg>
);

const toArabicNumber = (num: string) => {
	const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
	return String(num)
		.split("")
		.map((digit) => arabicNumbers[parseInt(digit, 10)])
		.join("");
};

const formatDate = (dateString: string) => {
	if (!dateString) return "N/A";
	return new Date(dateString).toLocaleDateString("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// --- CARD COMPONENT ---
export default function MobileSetoranCard({
	item,
}: {
	item: MahasiswaSetoran;
}) {
	const isDeposited = item.sudah_setor;

	const cardGradientClass = isDeposited
		? "bg-gradient-to-tr from-green-100/80 to-white dark:from-black dark:via-cyan-700/10 dark:to-green-900/30"
		: "bg-gradient-to-tr from-rose-100/80 to-white dark:from-red-700/15 dark:via-rose-700/5 dark:to-black";

	const headerInfo = {
		gradient: isDeposited
			? "from-green-400 via-teal-500 to-sky-500"
			: "from-red-500 to-orange-500",
		icon: isDeposited ? (
			<CheckCircle2 className="w-5 h-5" />
		) : (
			<CircleX className="w-5 h-5" />
		),
		text: isDeposited ? "Selesai di-muroja'ah" : "Belum di-muroja'ah",
	};

	return (
		<div
			className={`w-full max-w-md rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${cardGradientClass}`}
		>
			<div
				className={`relative flex items-center justify-center gap-1.5 py-1.5 px-4 text-white font-semibold tracking-tight bg-gradient-to-r ${headerInfo.gradient}`}
			>
				{headerInfo.icon}
				<span>{headerInfo.text}</span>
			</div>

			<div className="p-6">
				<div className="flex justify-between items-center">
					<div className="relative flex-shrink-0 grid place-items-center w-20 h-20">
						<OrnamentIcon
							className={`absolute inset-0 w-full h-full text-indigo-300/60 ${
								item.sudah_setor
									? "dark:text-indigo-700/30"
									: "dark:text-orange-700/30"
							} `}
						/>
						<div className="relative z-10 flex flex-col items-center justify-center">
							<span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 via-sky-500 to-emerald-400">
								{toArabicNumber(item.external_id)}
							</span>
						</div>
					</div>
					<div className="text-right">
						<h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
							{item.nama}
						</h3>
						<p className="text-2xl text-slate-500 dark:text-slate-400 font-serif">
							<span className="text-xs">
								(Q.S. {item.external_id})&nbsp;&nbsp;
							</span>
							{item.nama_arab}
						</p>
					</div>
				</div>

				{item.sudah_setor && (
					<hr className="my-4 border-slate-200 dark:border-slate-700" />
				)}

				{isDeposited && item.info_setoran && (
					<div className="mt-4 space-y-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-700/50">
						<div className="flex items-center gap-3">
							<UserCheck className="w-5 h-5 text-slate-400 flex-shrink-0" />
							<div className="text-sm">
								<p className="font-semibold text-slate-700 dark:text-slate-300">
									Disahkan oleh
								</p>
								<p className="text-slate-500 dark:text-slate-400">
									{item.info_setoran.dosen_yang_mengesahkan.nama}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<CalendarDays className="w-5 h-5 text-slate-400 flex-shrink-0" />
							<div className="text-sm">
								<p className="font-semibold text-slate-700 dark:text-slate-300">
									Tanggal Muroja'ah
								</p>
								<p className="text-slate-500 dark:text-slate-400">
									{formatDate(item.info_setoran.tgl_validasi)}
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="flex flex-col">
					{!item.sudah_setor && <hr className="my-4 border-slate-200 dark:border-slate-700" />}
					<div className={`${item.sudah_setor && "mt-5"} relative group`}>
						<div
							className={`inline-flex items-center px-2 py-1 text-xs rounded-md ${getLabelStyle(
								item.label
							)}`}
						>
							{labelMap[item.label]}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const labelMap: Record<string, string> = {
	KP: "Kerja Praktik",
	SEMKP: "Seminar Kerja Praktik",
	DAFTAR_TA: "Pendaftaran Tugas Akhir",
	SEMPRO: "Seminar Proposal",
	SIDANG_TA: "Sidang Tugas Akhir",
};

const getLabelStyle = (label: string) => {
	switch (label) {
		case "KP":
			return "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/50";
		case "SEMKP":
			return "text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900/50";
		case "DAFTAR_TA":
			return "text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-900/50";
		case "SEMPRO":
			return "text-pink-600 bg-pink-100 dark:text-pink-300 dark:bg-pink-900/50";
		case "SIDANG_TA":
			return "text-teal-600 bg-teal-100 dark:text-teal-300 dark:bg-teal-900/50";
		default:
			return "text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/50";
	}
};
