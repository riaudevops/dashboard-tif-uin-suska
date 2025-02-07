import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SideBarNavMenuEachItemProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import React from "react";

export const SideBarNavMenuGroupCollapsible = ({
	title,
	icon,
	isActive,
	items,
}: SideBarNavMenuEachItemProps) => {
	return (
		<Collapsible
			key={title}
			asChild
			defaultOpen={isActive}
			className="group/collapsible"
		>
			<SidebarMenuItem key={title}>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={title}>
						{icon && React.createElement(icon, {})}
						<span>{title}</span>
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{items?.map((subItem: SideBarNavMenuEachItemProps) => (
							<SidebarMenuSubItem key={subItem.title}>
								<SidebarMenuSubButton asChild>
									<a href={subItem.url}>
										<span>{subItem.title}</span>
									</a>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};
