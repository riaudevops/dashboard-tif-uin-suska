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
import React from "react";

export function SideBarNavMenu({
	sideBarNavMenuItems,
}: SideBarNavMenuItemsProps) {
	return sideBarNavMenuItems.map(({ label, menus }) => (
		<React.Fragment key={`rf-${label}`}>
			<SidebarGroup
				key={label}
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
		</React.Fragment>
	));
}
