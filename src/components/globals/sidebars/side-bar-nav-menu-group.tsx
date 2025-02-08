import {
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarNavMenuEachItemProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import React from "react";
import { NavLink } from "react-router-dom";

export const SideBarNavMenuGroup = ({
	title,
    url,
    icon,
}: SideBarNavMenuEachItemProps) => {
	return (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton asChild tooltip={title}>
				<NavLink to={url}>
                    {icon && React.createElement(icon, {})}
					<span>{title}</span>
				</NavLink>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
