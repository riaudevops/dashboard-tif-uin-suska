import { SideBarNavMenuItemsProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import {
	BackpackIcon,
	BookOpen,
	LayoutGridIcon,
	LucideHistory,
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
					url: "#",
					icon: BookOpen,
					isActive: true,
					items: [
						{
							title: "Isi Agenda",
							url: "/mahasiswa/kerja-praktik/daily-report/isi-agenda",
						},
						{
							title: "Riwayat Bimbingan",
							url: "/mahasiswa/kerja-praktik/daily-report/riwayat-bimbingan",
						},
					],
				},
			],
		},
		{
			label: "Seminar",
			menus: [
				{
					title: "SEM-KP",
					url: "#",
					isActive: true,
					icon: LayoutGridIcon,
					items: [
						{
							title: "Pendaftaran",
							url: "/mahasiswa/seminar/daftar-sem-kp",
						},
						{
							title: "Validasi Berkas",
							url: "/mahasiswa/seminar/validasi-berkas",
						},
					],
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
			label: "Kerja Praktek",
			menus: [
				{
					title: "Mahasiswa Bimbingan KP",
					url: "/dosen/kerja-praktik/mahasiswa-bimbingan-kp",
					icon: UserRoundPenIcon,
					
				},
			],
		},
	],
	"koordinator-kp": [
		{
			label: "Koordinator KP",
			menus: [
				{
					title: "Kerja Praktik",
					url: "#",
					icon: LayoutGridIcon ,
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
			],
		},
	],
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
          url: "#",
          icon: BookOpen,
          isActive: true,
          items: [
            {
              title: "Isi Agenda",
              url: "/mahasiswa/kerja-praktik/daily-report/isi-agenda",
            },
            {
              title: "Riwayat Bimbingan",
              url: "/mahasiswa/kerja-praktik/daily-report/riwayat-bimbingan",
            },
          ],
        },
      ],
    },
    {
      label: "Seminar",
      menus: [
        {
          title: "Seminar KP",
          url: "/mahasiswa/seminar-kp",
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
      label: "Seminar Kerja Praktek",
      menus: [
        {
          title: "Pengujian",
          url: "#",
          isActive: true,
          icon: BackpackIcon,
          items: [
            {
              title: "Input Nilai",
              url: "/dosen/seminar-kp/nilai-penguji",
            },
            {
              title: "Mahasiswa Diuji",
              url: "/dosen/seminar-kp/mahasiswa-diuji",
            },
          ],
        },
      ],
    },
  ],
  "koordinator-kp": [
    {
      label: "Koordinator",
      menus: [
        {
          title: "Seminar KP",
          url: "#",
          isActive: true,
          icon: MedalIcon,
          items: [
            {
              title: "Validasi Berkas",
              url: "/koordinator/seminar-kerja-praktek/validasi-berkas",
            },
            {
              title: "Nilai",
              url: "/koordinator/seminar-kerja-praktek/nilai",
            },
          ],
        },
      ],
    },
  ],
};
