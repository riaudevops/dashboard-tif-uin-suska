import { SideBarNavMenuItemsProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import { BookOpen, LayoutGridIcon, LucideHistory, PieChart, UserRoundPenIcon } from "lucide-react";

export const SideBarNavMenuItems: SideBarNavMenuItemsProps = {
	mahasiswa: [
		{
			label: "Setoran Hafalan",
			menus: [
				{
					title: "Statistik",
					url: "/mahasiswa/setoran-hafalan/statistik",
					icon: PieChart,
				},
				{
					title: "Detail Riwayat",
					url: "/mahasiswa/setoran-hafalan/detail-riwayat",
					icon: LucideHistory,
				},
			],
		},
		{
			label: "Kerja Praktek",
			menus: [
				{
					title: "Daftar KP",
					url: "#",
					icon: UserRoundPenIcon,
					isActive: true,
					items: [
						{
							title: "Permohonan",
							url: "/mahasiswa/kerja-praktek/permohonan",
						},
						{
							title: "Kelengkapan Berkas",
							url: "/mahasiswa/kerja-praktek/kelengkapan-berkas",
						},
						{
							title: "Detail Riwayat",
							url: "/mahasiswa/kerja-praktek/detail-riwayat",
						},
					],
				},
				{
					title: "Daily Report",
					url: "#",
					icon: BookOpen,
					items: [
						{
							title: "Isi Agenda",
							url: "/mahasiswa/daily-report/isi-agenda",
						},
						{
							title: "Riwayat Bimbingan",
							url: "/mahasiswa/daily-report/riwayat-bimbingan",
						},
					],
				},
			],
		},
        {
			label: "Seminar",
			menus: [
				{
					title: "Daftar SEM-KP",
					url: "/mahasiswa/seminar/daftar-sem-kp",
					icon: LayoutGridIcon,
				},
			],
		},
	],
};
