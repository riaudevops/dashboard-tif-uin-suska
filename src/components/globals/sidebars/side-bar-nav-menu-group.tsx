import {
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarNavMenuEachItemProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import React from "react";

export const SideBarNavMenuGroup = ({
	title,
    url,
    icon,
}: SideBarNavMenuEachItemProps) => {
	return (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton asChild tooltip={title}>
				<a href={url}>
                    {icon && React.createElement(icon, {})}
					<span>{title}</span>
				</a>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
