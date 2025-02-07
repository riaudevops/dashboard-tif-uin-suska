import * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { SideBarHeader } from "./side-bar-header";
import { SideBarFooter } from "./side-bar-footer";
import { SideBarNavMenu } from "./side-bar-nav-menu";
import { SideBarNavMenuItems } from "@/constants/components/globals/sidebars/side-bar-nav-menu-item.constant";
import { Separator } from "@/components/ui/separator";

// This is sample data.
const data = {
	user: {
		name: "M. Farhan Aulia Pratama",
		email: "12250113521@students.uin-suska.ac.id",
		avatar: "/avatars/shadcn.jpg",
	},
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader className="mt-1.5">
				<SideBarHeader role="Mahasiswa" />
			</SidebarHeader>
			<Separator orientation="horizontal" className="px-4" />
			<SidebarContent className="gap-0">
				<SideBarNavMenu sidebarNavMenuItems={SideBarNavMenuItems.mahasiswa} />
			</SidebarContent>
			
			<SidebarFooter>
				<SideBarFooter user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}