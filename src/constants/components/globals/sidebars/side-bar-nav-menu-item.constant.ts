import { SideBarNavMenuItemsProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import {
  BackpackIcon,
  BookOpen,
  ChartColumnIcon,
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
      label: "Kerja Praktek",
      menus: [
        {
          title: "Verifikasi KP",
          url: "/koordinator-kp/kerja-praktek/verifikasi-kp",
          icon: ChartColumnIcon,
        },
      ],
    },
  ],
};
