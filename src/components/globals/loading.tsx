import React, { useEffect, useState } from "react";

interface LoadingProps {
	children?: React.ReactNode;
	primaryColor?: string;
	secondaryColor?: string;
	textColor?: string;
	className?: string;
}

const LoadingComponent: React.FC<LoadingProps> = ({
	children = "Sedang Proses",
	primaryColor = "#AFFF9F",
	secondaryColor = "#F2F2F2",
	textColor = "#F2F2F2",
	className
}) => {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
		}, 400);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className={`${className} flex flex-col items-center justify-center gap-4`}>
			<div className="relative">
				<div
					className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
					style={{
						borderColor: `${primaryColor} transparent ${secondaryColor} transparent`,
					}}
				/>
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-pulse"
					style={{
						background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
					}}
				/>
			</div>
			<div className="relative">
				<span style={{ color: textColor }} className={`text-sm font-normal italic tracking-wide`}>
					{children}
					<span className="animate-pulse">{dots}</span>
				</span>
			</div>
		</div>
	);
};

export default LoadingComponent;