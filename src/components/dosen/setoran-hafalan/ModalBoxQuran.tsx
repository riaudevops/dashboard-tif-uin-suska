import React, { useState, useRef, useEffect } from "react";
import { Pause } from "lucide-react";

// --- TYPESCRIPT INTERFACES ---
interface AyatAudio {
	"01": string;
	"02": string;
	"03": string;
	"04": string;
	"05": string;
}

interface Ayat {
	nomorAyat: number;
	teksArab: string;
	teksLatin: string;
	teksIndonesia: string;
	audio: AyatAudio;
	namaLatin?: string;
}

export interface SurahData {
	nomor: number;
	nama: string;
	namaLatin: string;
	jumlahAyat: number;
	tempatTurun: string;
	arti: string;
	deskripsi: string;
	audioFull: AyatAudio;
	ayat: Ayat[];
}

// --- DATA & TYPES ---
const qariList: { [key: string]: string } = {
	"01": "Abdullah Al-Juhany",
	"02": "Abdul Muhsin Al-Qasim",
	"03": "Abdurrahman as-Sudais",
	"04": "Ibrahim Al-Dossari",
	"05": "Misyari Rasyid Al-Afasi",
};

type QariKey = keyof typeof qariList;

interface AyatSelectorProps {
	jumlahAyat: number;
	onAyatSelect: (ayatNumber: string) => void;
}

const AyatSelector = ({ jumlahAyat, onAyatSelect }: AyatSelectorProps) => {
	const ayatNumbers = Array.from({ length: jumlahAyat }, (_, i) => i + 1);
	return (
		<div className="relative w-full md:w-auto">
			<label className="text-xs text-gray-500 dark:text-gray-400 absolute -top-4 left-1">
				Ayat
			</label>
			<select
				defaultValue=""
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					if (e.target.value) onAyatSelect(e.target.value);
				}}
				className="appearance-none w-full bg-transparent border-b-2 border-purple-300 dark:border-purple-700 rounded-none py-2 pl-1 pr-8 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-purple-500 transition"
			>
				<option
					value=""
					disabled
					className="bg-white dark:bg-gray-800 text-gray-400"
				>
					Pilih Ayat
				</option>
				{ayatNumbers.map((number) => (
					<option
						key={number}
						value={number}
						className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
					>
						Ayat ke-{number}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
				<svg
					className="fill-current h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
				</svg>
			</div>
		</div>
	);
};

interface QariSelectorProps {
	selectedQari: QariKey;
	setSelectedQari: React.Dispatch<React.SetStateAction<QariKey>>;
}

const QariSelector = ({ selectedQari, setSelectedQari }: QariSelectorProps) => {
	return (
		<div className="relative w-full md:w-auto">
			<label className="text-xs text-gray-500 dark:text-gray-400 absolute -top-4 left-1">
				Qari
			</label>
			<select
				value={selectedQari}
				onChange={(e) => setSelectedQari(e.target.value as QariKey)}
				className="appearance-none w-full bg-transparent border-b-2 border-purple-300 dark:border-purple-700 rounded-none py-2 pl-1 pr-8 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-0 focus:border-purple-500 transition"
			>
				{Object.entries(qariList).map(([key, name]) => (
					<option
						key={key}
						value={key}
						className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
					>
						{name}
					</option>
				))}
			</select>
			<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
				<svg
					className="fill-current h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
				</svg>
			</div>
		</div>
	);
};

const AyatNumberIcon = ({ number }: { number: number }) => {
	return (
		<span className="-mt-6 relative inline-flex items-center justify-center w-12 h-12 align-middle">
			<div
				className="absolute w-full h-full bg-purple-500/25 dark:bg-purple-400/25"
			>
			</div>
			<span className={`relative dark:text-violet-200 text-violet-800 font-bold text-xl font-["Amiri"]`}>
				{number}
			</span>
		</span>
	);
};

const AudioIcon = ({ isPlaying, ...props }: { isPlaying: boolean }) => {
	if (isPlaying) {
		return (
			<Pause
				className="w-6 h-6 text-purple-600 dark:text-purple-400"
				{...props}
			/>
		);
	}
	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
			className="w-6 h-6 text-gray-500 dark:text-gray-400"
		>
			<path
				d="M11 5L6 9H2V15H6L11 19V5Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M15.54 8.46C16.4725 9.3925 17.0001 10.6551 17.0001 12C17.0001 13.3449 16.4725 14.6075 15.54 15.54"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

interface AyatItemProps {
	ayat: Ayat;
    jumlahAyat: number;
	onPlay: () => void;
	isPlaying: boolean;
}

const AyatItem = React.forwardRef<HTMLDivElement, AyatItemProps>(
	({ ayat, jumlahAyat, onPlay, isPlaying }, ref) => {
		return (
			<div
				ref={ref}
				className={`py-8 ${jumlahAyat !== ayat.nomorAyat && "border-b"} border-gray-200 dark:border-gray-700 scroll-mt-40`}
			>
				<div
					className={`flex font-["Amiri"] justify-between items-center text-right text-3xl md:text-4xl mt-0 text-gray-800 dark:text-gray-100 mb-3`}
					dir="rtl"
				>
					<span className="flex-grow md:max-w-2xl max-w-[16rem] leading-[2.3] tracking-wider">{ayat.teksArab}</span>
					<AyatNumberIcon number={ayat.nomorAyat} />
				</div>
				<p className="text-purple-600 dark:text-purple-400 text-xl mb-2">
					{ayat.teksLatin}
				</p>
				<p className="text-gray-600 dark:text-gray-300 text-base mb-4">
					{ayat.teksIndonesia}
				</p>
				<div className="flex items-center gap-1 -ml-2">
					<button
						onClick={onPlay}
						className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors"
						aria-label={isPlaying ? "Pause" : "Play"}
					>
						<AudioIcon isPlaying={isPlaying} />
					</button>
					<p className="text-xs text-gray-500 dark:text-gray-400">
						QS. {ayat.namaLatin} ayat ke-{ayat.nomorAyat}
					</p>
				</div>
			</div>
		);
	}
);

interface QuranReaderProps {
	surahData: SurahData | undefined;
}

const QuranReader = ({ surahData }: QuranReaderProps) => {
	const [selectedQari, setSelectedQari] = useState<QariKey>("05");
	const [playingAyat, setPlayingAyat] = useState<number | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const ayatRefs = useRef<(HTMLDivElement | null)[]>([]);
	const mainContentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const audio = audioRef.current;
		const handleAudioEnd = () => setPlayingAyat(null);
		audio?.addEventListener("ended", handleAudioEnd);
		return () => audio?.removeEventListener("ended", handleAudioEnd);
	}, []);

	const handlePlayPause = async (ayat: Ayat) => {
		const audio = audioRef.current;
		if (!audio) return;

		if (playingAyat === ayat.nomorAyat) {
			audio.pause();
			setPlayingAyat(null);
		} else {
			setPlayingAyat(ayat.nomorAyat);
			audio.src = ayat.audio[selectedQari as QariKey as keyof AyatAudio];
			try {
				await audio.play();
			} catch (error) {
				if (error instanceof Error && error.name === "AbortError")
					console.log("Audio aborted.");
				else console.error("Audio playback error:", error);
			}
		}
	};

	const handleScrollToAyat = (ayatNumber: string) => {
		const ayatElement = ayatRefs.current[parseInt(ayatNumber, 10) - 1];
		const mainContent = mainContentRef.current;
		if (ayatElement && mainContent) {
			const headerHeight = 150;
			const ayatPosition = ayatElement.offsetTop;
			mainContent.scrollTo({
				top: ayatPosition - headerHeight,
				behavior: "smooth",
			});
		}
	};

	if (!surahData)
		return (
			<div className="flex items-center justify-center h-full text-gray-800 dark:text-gray-200">
				Loading...
			</div>
		);

	return (
		<div className="bg-gray-50 rounded-xl dark:bg-gray-900/50 h-full text-gray-800 dark:text-gray-100 font-sans transition-colors duration-300 flex flex-col">
			<header className="rounded-t-xl flex-shrink-0 z-10 bg-gradient-to-l from-violet-300/30 to-pink-300/30 dark:from-violet-900/40 dark:to-pink-900/40 backdrop-blur-sm py-7 border-b border-gray-200 dark:border-gray-800 px-4 md:px-8">
				<div className="rounded-xl max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
					<div className="flex-1">
						<h1 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {surahData.namaLatin} - <span className="font-[Amiri]">{surahData.nama}</span> <span className="text-base italic font-medium">(QS.{surahData.nomor})</span>
						</h1>
						<p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
							{surahData.arti} &bull; {surahData.jumlahAyat} Ayat &bull;{" "}
							{surahData.tempatTurun}
						</p>
					</div>
					<div className="md:hidden w-full h-px bg-gray-800/30 dark:bg-gray-100/30"></div>
					<div className="flex mt-3 items-center gap-6 w-full md:w-auto">
						<AyatSelector
							jumlahAyat={surahData.jumlahAyat}
							onAyatSelect={handleScrollToAyat}
						/>
						<QariSelector
							selectedQari={selectedQari}
							setSelectedQari={setSelectedQari}
						/>
					</div>
				</div>
			</header>
			<div ref={mainContentRef} className="flex-grow overflow-y-auto">
				<main className="container mx-auto max-w-4xl px-4 md:px-8">
					{surahData.ayat.map((ayat, index) => (
						<AyatItem
							ref={(el) => (ayatRefs.current[index] = el)}
							key={ayat.nomorAyat}
                            jumlahAyat={surahData.jumlahAyat}
							ayat={{ ...ayat, namaLatin: surahData.namaLatin }}
							onPlay={() => handlePlayPause(ayat)}
							isPlaying={playingAyat === ayat.nomorAyat}
						/>
					))}
				</main>
			</div>
			<audio ref={audioRef} className="hidden" />
		</div>
	);
};

interface ModalBoxQuranProps {
	dataSurah: SurahData | undefined;
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalBoxQuran({
	dataSurah,
	isOpen,
	setIsOpen,
}: ModalBoxQuranProps) {
	return (
		isOpen && (
			<div
				onClick={() => setIsOpen(false)}
				className="fixed inset-0 z-[9999] md:p-5 p-4 bg-black/60 backdrop-blur-sm flex items-center justify-center"
			>
				<div
					className="max-w-4xl bg-card w-full rounded-xl h-[80vh] p-0 border-0"
					onClick={(e) => e.stopPropagation()}
				>
					<style>
                        @import
                            url('https://fonts.googleapis.com/css2?family=Amiri&display=swap');
					</style>
					<QuranReader surahData={dataSurah} />
				</div>
			</div>
		)
	);
}
