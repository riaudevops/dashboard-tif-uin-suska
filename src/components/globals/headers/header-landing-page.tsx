import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import { ModeToggle } from "../../themes/mode-toggle";
import { Button } from "@/components/ui/button";
import { LucideLogIn } from "lucide-react";
import { HeaderLandingPageProps } from "@/interfaces/components/globals/headers/header-landing-page.interface";

const HeaderLandingPageComponent = ({onContinueWithKeycloakClicked, isAuthenticated}: HeaderLandingPageProps) => {
	return (
		<header className="bg-background flex h-12 w-full items-center justify-between border-b pl-2 pr-4 py-2">
			{/* Header Logo + Nav Menu */}
			<div onClick={() => location.href = "/"} className="flex gap-4 justify-center items-center">
				{/* Header Logo */}
				<div className="flex items-center gap-1.5 hover:bg-secondary hover:text-secondary-foreground cursor-pointer hover:scale-95 px-2 duration-300 rounded-xl active:scale-105">
					<DarkLogoUSR className="h-8 w-8" />
					<span className="text-base font-bold">
						dashboard<span className="italic font-medium">.tif-usr</span>
					</span>
				</div>
			</div>

            <div className="flex gap-2 justify-center items-center">
                <Button onClick={onContinueWithKeycloakClicked} size={"sm"} variant={isAuthenticated ? "destructive" : "outline"}>
                    <LucideLogIn className="h-4 w-4" />
                    {isAuthenticated ? "Logout" : "Continue With Keycloak"}
                </Button>
                {/* Theme Toggle */}
                <ModeToggle />
            </div>
		</header>
	);
};

export default HeaderLandingPageComponent;