import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/themes/theme-provider";
import { useEffect, useState } from "react";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();
	const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

	const toggleTheme = () => {
		if (isDarkMode) {
			setTheme("light");
		} else {
			setTheme("dark");
		}
		setIsDarkMode(!isDarkMode);
	};

	useEffect(() => {
		setIsDarkMode(theme === "dark");
	}, [theme]);

	return (
		<Button onClick={toggleTheme} variant="outline" size="icon">
			<Sun
				className={`h-[1.2rem] w-[1.2rem] transition-all ${
					isDarkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"
				}`}
			/>
			<Moon
				className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
					isDarkMode ? "rotate-0 scale-100" : "-rotate-90 scale-0"
				}`}
			/>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
