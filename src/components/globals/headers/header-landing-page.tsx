import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import { ModeToggle } from "../../themes/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucideLogIn } from "lucide-react";
import { HeaderLandingPageProps } from "@/interfaces/components/globals/headers/header-landing-page.interface";
import { useTheme } from "@/components/themes/theme-provider";
import { NavMenu } from "./nav-menu";
import { NavMenuItems } from "@/constants/components/globals/headers/nav-menu-item.constant";
import { NavLink } from "react-router-dom";
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HeaderLandingPageComponent = ({
	onContinueWithKeycloakClicked,
	isAuthenticated,
	dashboardURL,
}: HeaderLandingPageProps) => {
	const { theme } = useTheme();
	return (
		<header className="bg-background flex h-12 w-full items-center justify-between border-b pl-2 pr-4 py-2">
			{/* Header Logo + Nav Menu */}
			<NavLink to={"/"} className="flex gap-4 justify-center items-center">
				{/* Header Logo */}
				<div className="flex items-center gap-1.5 hover:bg-secondary hover:text-secondary-foreground cursor-pointer hover:scale-95 px-2 duration-300 rounded-xl active:scale-105">
					{theme === "dark" ? (
						<DarkLogoUSR className="h-8 w-8" />
					) : (
						<LightLogoUSR className="h-8 w-8" />
					)}
					<span className="text-base font-semibold">
						dashboard<span className="italic font-medium">.tif-usr</span>
					</span>
				</div>
			</NavLink>

			<div className="flex gap-5 justify-center items-center">
				<NavMenu navMenu={NavMenuItems.LandingPage} />
				<div className="flex gap-2 justify-center items-center">
					{isAuthenticated && (
						<NavLink to={dashboardURL}>
							<Button size={"sm"} variant={"outline"}>
								<ArrowUpRight className="h-4 w-4" />
								Pergi Ke Dashboard
							</Button>
						</NavLink>
					)}

					{!isAuthenticated ? (
						<Button
							onClick={onContinueWithKeycloakClicked}
							size={"sm"}
							variant={"outline"}
						>
							<LucideLogIn className="h-4 w-4" />
							{"Mulai Sekarang"}
						</Button>
					) : (
						<AlertDialogTrigger asChild>
							<Button size={"sm"} variant={"destructive"}>
								<LucideLogIn className="h-4 w-4" />
								{"Keluar"}
							</Button>
						</AlertDialogTrigger>
					)}
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Apakah kamu yakin mau keluar?</AlertDialogTitle>
							<AlertDialogDescription>
							Jika Anda yakin ingin keluar, sesi anda untuk akun ini akan terhapus dan anda akan diarahkan kembali ke halaman awal.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Gajadi deh</AlertDialogCancel>
							<AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/85" onClick={onContinueWithKeycloakClicked}>
								Iya, saya yakin
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>

					{/* Theme Toggle */}
					<ModeToggle />
				</div>
			</div>
		</header>
	);
};

export default HeaderLandingPageComponent;
