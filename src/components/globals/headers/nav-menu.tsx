import { NavMenuItemsProps, NavMenuProps } from "@/interfaces/components/globals/headers/nav-menu.interface";
import { NavLink, useLocation } from "react-router-dom";

export const NavMenu = ({ navMenu }: NavMenuProps) => {

	const location = useLocation();

	return (
		<nav className="flex mt-[0.20rem] justify-center items-center text-sm text-muted-foreground">
			<ul className="flex space-x-5">
				{navMenu.map((item: NavMenuItemsProps) => {
					return (
						<li key={item.label}
							className={
								(location.hash === (item.location_target.replace("/", ""))) ? "text-foreground" : "hover:text-foreground/75"
							}
						>
							<NavLink to={item.location_target}>
								{item.label}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};
