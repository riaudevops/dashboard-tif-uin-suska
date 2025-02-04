import * as React from "react";
import {
	AudioWaveform,
	BookOpen,
	Command,
	GalleryVerticalEnd,
	LayoutGridIcon,
	LucideHistory,
	PieChart,
	SquareTerminal,
} from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { TeamSwitcher } from "./team-switcher";
import { NavUser } from "./nav-user";

// This is sample data.
const data = {
	user: {
		name: "M. Farhan Aulia Pratama",
		email: "12250113521@students.uin-suska.ac.id",
		avatar: "/avatars/shadcn.jpg",
	},
	teams: [
		{
			name: "M. Farhan Aulia Pratama",
			logo: GalleryVerticalEnd,
			plan: "Mahasiswa",
		},
		{
			name: "Acme Corp.",
			logo: AudioWaveform,
			plan: "Startup",
		},
		{
			name: "Evil Corp.",
			logo: Command,
			plan: "Free",
		},
	],
	navMain: [
		{
			title: "Daftar KP",
			url: "#",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Permohonan",
					url: "#",
				},
				{
					title: "Kelengkapan Berkas",
					url: "#",
				},								
				{
					title: "Detail Riwayat",
					url: "#",
				},				
			],
		},
		{
			title: "Daily Report KP",
			url: "#",
			icon: BookOpen,
			items: [
				{
					title: "Introduction",
					url: "#",
				},
				{
					title: "Get Started",
					url: "#",
				},
				{
					title: "Tutorials",
					url: "#",
				},
				{
					title: "Changelog",
					url: "#",
				},
			],
		},

	],
	setoran_hafalan: [
		{
			name: "Statistik",
			url: "#",
			icon: PieChart,
		},
		{
			name: "Detail Riwayat",
			url: "#",
			icon: LucideHistory,
		},
	],
	seminar: [
		{
			name: "Daftar SEM-KP",
			url: "#",
			icon: LayoutGridIcon,
		}
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavProjects label="Setoran Hafalan" projects={data.setoran_hafalan} />
				<NavMain label="Kerja Praktek" items={data.navMain} />
				<NavProjects label="Seminar" projects={data.seminar} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}