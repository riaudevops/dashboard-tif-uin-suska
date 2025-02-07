import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import LightLogoUSR from "@/assets/svgs/light-logo-usr";
import { ModeToggle } from "../../themes/mode-toggle";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucideLogIn } from "lucide-react";
import { HeaderLandingPageProps } from "@/interfaces/components/globals/headers/header-landing-page.interface";
import { useTheme } from "@/components/themes/theme-provider";
import { NavMenu } from "./nav-menu";
import { NavMenuItems } from "@/constants/components/globals/headers/nav-menu-item.constant";

const HeaderLandingPageComponent = ({
	onContinueWithKeycloakClicked,
	isAuthenticated,
}: HeaderLandingPageProps) => {
	const { theme } = useTheme();
	return (
		<header className="bg-background flex h-12 w-full items-center justify-between border-b pl-2 pr-4 py-2">
			{/* Header Logo + Nav Menu */}
			<div
				onClick={() => (location.href = "/")}
				className="flex gap-4 justify-center items-center"
			>
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
			</div>

			<div className="flex gap-5 justify-center items-center">
				<NavMenu navMenu={NavMenuItems.LandingPage} />
				<div className="flex gap-2 justify-center items-center">
					{isAuthenticated && (
						<Button
							size={"sm"}
							variant={"outline"}
							onClick={() => (location.href = "/dashboard")}
						>
							<ArrowUpRight className="h-4 w-4" />
							Pergi Ke Dashboard
						</Button>
					)}
					<Button
						onClick={onContinueWithKeycloakClicked}
						size={"sm"}
						variant={isAuthenticated ? "destructive" : "outline"}
					>
						<LucideLogIn className="h-4 w-4" />
						{isAuthenticated ? "Logout" : "Mulai Sekarang"}
					</Button>
					{/* Theme Toggle */}
					<ModeToggle />
				</div>
			</div>
		</header>
	);
};

export default HeaderLandingPageComponent;
