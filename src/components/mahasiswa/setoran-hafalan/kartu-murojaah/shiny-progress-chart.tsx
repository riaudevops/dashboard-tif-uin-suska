import { useState, useEffect } from "react";

// Props
interface ShinyProgressChartProps {
	title?: string;
	className?: string;
	targetProgress: number;
	loading: boolean;
	size?: number;
	strokeWidth?: number;
}

// Komponen utama yang telah disederhanakan
const ShinyProgressChart = ({
	title = "PROGRES",
	className = "my-4 mx-3",
	targetProgress,
	loading,
	size = 150, // Ukuran diperkecil
	strokeWidth = 17, // Batang dibuat lebih tebal ("tembem")
}: ShinyProgressChartProps) => {
	const [currentProgress, setCurrentProgress] = useState(0);

	// Animasi progress yang mulus dan ringan
	useEffect(() => {
		if (loading) {
			setCurrentProgress(0);
			return;
		}
		let animationFrameId: number;
		const animate = () => {
			setCurrentProgress((prev) => {
				const diff = targetProgress - prev;
				if (Math.abs(diff) < 0.1) {
					cancelAnimationFrame(animationFrameId);
					return targetProgress;
				}
				const newProgress = prev + diff * 0.1;
				animationFrameId = requestAnimationFrame(animate);
				return newProgress;
			});
		};
		animationFrameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrameId);
	}, [loading, targetProgress]);

	// Pengaturan dasar SVG
	const center = size / 2;
	const radius = center - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	// Memastikan offset tidak pernah NaN, default ke circumference penuh jika NaN.
	const offset = isNaN(currentProgress)
		? circumference
		: circumference - (currentProgress / 100) * circumference;

	return (
		<div			
			className={`relative flex items-center justify-center ${className}`}
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="-rotate-90"
			>
				<defs>
					{/* Gradien untuk progress bar */}
					<linearGradient id="richGradient" gradientTransform="rotate(90)">
						<stop offset="0%" stopColor="#86efac" />
						<stop offset="20%" stopColor="#67e8f9" />
						<stop offset="40%" stopColor="#818cf8" />
						<stop offset="60%" stopColor="#f472b6" />
						<stop offset="80%" stopColor="#fb923c" />
						<stop offset="100%" stopColor="#facc15" />
					</linearGradient>

					{/* Gradien untuk Teks Persentase */}
					<linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#67e8f9" />
						<stop offset="50%" stopColor="#818cf8" />
						<stop offset="100%" stopColor="#f472b6" />
					</linearGradient>
				</defs>

				{/* Lingkaran Latar Belakang (Jalur Kosong) */}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="transparent"
					stroke="#E5E7EB" // Warna abu-abu terang untuk light mode
					className="dark:stroke-gray-500/20" // Warna abu-abu gelap untuk dark mode
					strokeWidth={strokeWidth}
				/>

				{/* Lingkaran Progress yang Terisi */}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="transparent"
					stroke="url(#richGradient)" // Menggunakan gradien baru
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round" // Membuat ujung bar melengkung
					style={{ transition: "stroke-dashoffset 0.3s ease" }}
				/>
			</svg>

			{/* Teks di Tengah */}
			<div className="absolute flex flex-col items-center justify-center">
				<span className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
					{ title }
				</span>
				<div
					className="font-bold bg-clip-text text-transparent tracking-tighter leading-none"
					style={{
						fontSize: size / 5.3,
						backgroundImage:
							"linear-gradient(to right, #67e8f9, #818cf8, #f472b6)",
						fontFamily: "monospace", // PERUBAHAN: Menambahkan font digital
					}}
				>
					{/* PERUBAHAN: Angka dan simbol % dipisah untuk styling */}
					{isNaN(currentProgress) ? 0 : Number(currentProgress).toFixed(currentProgress % 1 ? 2 : 0)}
					<span className="ml-1 mr-0.5" style={{ fontSize: size / 7, verticalAlign: "top" }}>%</span>
				</div>
			</div>
		</div>
	);
};

export default ShinyProgressChart;
