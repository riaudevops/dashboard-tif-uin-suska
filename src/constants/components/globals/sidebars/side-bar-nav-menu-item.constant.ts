import { SideBarNavMenuItemsProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import {
	BackpackIcon,
	BookOpen,
	GraduationCap,
	LayoutGridIcon,
	LucideHistory,
	MedalIcon,
	PieChart,
	UserRoundPenIcon,
} from "lucide-react";

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
			label: "Kerja Praktik",
			menus: [
				{
					title: "Administrasi",
					url: "#",
					icon: UserRoundPenIcon,
					isActive: true,
					items: [
						{
							title: "Permohonan",
							url: "/mahasiswa/kerja-praktik/daftar-kp/permohonan",
						},
						{
							title: "Kelengkapan Berkas",
							url: "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas",
						},
					],
				},
				{
					title: "Daily Report",
					url: "/mahasiswa/kerja-praktik/daily-report",
					icon: BookOpen,
				},			
				{
					title: "Bimbingan",
					url: "/mahasiswa/kerja-praktik/bimbingan",
					icon: GraduationCap,
				},			
				{
					title: "Seminar",
					url: "/mahasiswa/kerja-praktik/seminar",
					icon: LayoutGridIcon,
				},
			],
		},
	],
	dosen: [
		{
			label: "Setoran Hafalan",
			menus: [
				{
					title: "Mahasiswa PA",
					url: "/dosen/setoran-hafalan/mahasiswa-pa",
					icon: BackpackIcon,
				},
			],
		},
		{
			label: "Kerja Praktik",
			menus: [
				{
					title: "Mahasiswa Bimbing",
					url: "/dosen/kerja-praktik/mahasiswa-bimbingan-kp",
					icon: UserRoundPenIcon,
				},
				{
					title: "Mahasiswa Uji",
					url: "/dosen/seminar-kp/nilai-penguji",
					icon: BackpackIcon,
				},
			],
		},
	],
	"koordinator-kp": [
		{
			label: "Koordinator KP",
			menus: [
				{
					title: "Administrasi",
					url: "#",
					isActive: true,
					icon: LayoutGridIcon,
					items: [
						{
							title: "Permohonan",
							url: "/koordinator-kp/kerja-praktik/Permohonan",
						},
						{
							title: "Validasi Berkas",
							url: "/koordinator-kp/kerja-praktik/validasi-berkas",
						},
						{
							title: "Daily Report",
							url: "/koordinator-kp/kerja-praktik/Daily-Report",
						},
					],
				},
				{
					title: "Seminar",
					url: "#",
					isActive: true,
					icon: MedalIcon,
					items: [
						{
							title: "Validasi Berkas",
							url: "/koordinator-kp/seminar-kp/validasi-berkas",
						},
						{
							title: "Nilai",
							url: "/koordinator-kp/seminar-kp/nilai",
						},
					],
				},
			],
		},
	],
};
