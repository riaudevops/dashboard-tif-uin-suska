import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarHeaderProps } from "@/interfaces/components/globals/sidebars/side-bar-header.interface";
import { GalleryVerticalEnd } from "lucide-react";
import { NavLink } from "react-router-dom";

export function SideBarHeader({ role }: SideBarHeaderProps) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<NavLink to={"/"}>
					<SidebarMenuButton
						title={"Kembali ke Beranda"}
						tooltip={"Kembali ke Beranda"}						
						size="lg"
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
							<GalleryVerticalEnd className="size-4" />
						</div>
						<div className="grid flex-1 ml-0.5 mt-0.5 text-left text-sm leading-tight">
							<span className="truncate font-semibold">
								dashboard.<span className="italic font-light">tif-usr</span>
							</span>
							<span className="truncate text-xs">{role}</span>
						</div>
					</SidebarMenuButton>
				</NavLink>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
