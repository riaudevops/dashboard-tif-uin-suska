import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import {
	SideBarNavMenuEachItemProps,
	SideBarNavMenuItemsProps,
} from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import { Separator } from "@/components/ui/separator";
import { SideBarNavMenuGroupCollapsible } from "./side-bar-nav-menu-group-collapsible";
import { SideBarNavMenuGroup } from "./side-bar-nav-menu-group";

export function SideBarNavMenu({
	sidebarNavMenuItems,
}: SideBarNavMenuItemsProps) {

	return (
		<>
			{sidebarNavMenuItems.map(({ label, menus }) => (
				<>
					<SidebarGroup
						key={label}
						// className="group-data-[collapsible=icon]:hidden"
						// className={state === "collapsed" ? "py-2" : ""}
					>
						<SidebarGroupLabel>{label}</SidebarGroupLabel>
						<SidebarMenu>
							{menus.map((item: SideBarNavMenuEachItemProps) =>
								item.items ? (
									<SideBarNavMenuGroupCollapsible key={item.title} {...item} />
								) : (
									<SideBarNavMenuGroup key={item.title} {...item} />
								)
							)}
						</SidebarMenu>
					</SidebarGroup>
					<Separator orientation="horizontal" className="px-4" />
				</>
			))}
		</>
	);
}
