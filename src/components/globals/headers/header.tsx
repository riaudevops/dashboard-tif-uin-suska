import DarkLogoUSR from "@/assets/svgs/dark-logo-usr";
import { ModeToggle } from "../../themes/mode-toggle";
import { NavMenu } from "./nav-menu";

const HeaderComponent = () => {
	return (
		<header className="fixed z-50 bg-background flex h-12 w-full items-center justify-between border-b pl-2 pr-4 py-2">
			{/* Header Logo + Nav Menu */}
			<div className="flex gap-4 justify-center items-center">
				{/* Header Logo */}
				<div className="flex items-center gap-1.5 hover:bg-secondary hover:text-secondary-foreground cursor-pointer hover:scale-95 px-2 duration-300 rounded-xl active:scale-105">
					<DarkLogoUSR className="h-8 w-8" />
					<span className="text-base font-bold">
						dashboard<span className="italic font-medium">.tif-usr</span>
					</span>
				</div>

				{/* Nav Menu */}
				<NavMenu />
			</div>

			{/* Theme Toggle */}
			<ModeToggle />
		</header>
	);
};

export default HeaderComponent;