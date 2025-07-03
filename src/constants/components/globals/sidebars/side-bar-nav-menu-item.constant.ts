import { SideBarNavMenuItemsProps } from "@/interfaces/components/globals/sidebars/side-bar-nav-menu.interface";
import {
  BackpackIcon,
  BookOpen,
  CalendarCheck2Icon,
  GraduationCap,
  GraduationCapIcon,
  LayoutGridIcon,
  LucideHistory,
  // PieChart,
  UserRoundPenIcon,
} from "lucide-react";

export const SideBarNavMenuItems: SideBarNavMenuItemsProps = {
  mahasiswa: [
    {
      label: "Muroja'ah",
      menus: [
        // {
        //   title: "Statistik",
        //   url: "/mahasiswa/murojaah/statistik",
        //   icon: PieChart,
        // },
        {
          title: "Detail Riwayat",
          url: "/mahasiswa/murojaah/detail-riwayat",
          icon: LucideHistory,
        },
      ],
    },
    {
      label: "Kerja Praktik",
      menus: [
        {
          title: "Pengajuan",
          url: "/mahasiswa/kerja-praktik/daftar-kp/permohonan",
          icon: CalendarCheck2Icon,
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
      label: "Muroja'ah",
      menus: [
        {
          title: "Mahasiswa PA",
          url: "/dosen/murojaah/mahasiswa-pa",
          icon: BackpackIcon,
        },
      ],
    },
    {
      label: "Kerja Praktik",
      menus: [
        {
          title: "Mahasiswa Bimbing",
          url: "/dosen/kerja-praktik/mahasiswa-bimbing",
          icon: UserRoundPenIcon,
        },
        {
          title: "Mahasiswa Uji",
          url: "/dosen/seminar-kp/nilai-penguji",
          icon: GraduationCapIcon,
        },
      ],
    },
  ],
  "koordinator-kp": [
    {
      label: "Koordinator KP",
      menus: [
        {
          title: "Monitoring Progres",
          url: "/koordinator-kp/kerja-praktik/daily-report",
          isActive: true,
          icon: LayoutGridIcon,
        },
        {
          title: "Pengajuan",
          url: "/koordinator-kp/kerja-praktik/permohonan",
          isActive: true,
          icon: CalendarCheck2Icon,
          items: [
            {
              title: "Setup Tanggal",
              url: "/koordinator-kp/option",
            },
            {
              title: "Validasi Pemberkasan",
              url: "/koordinator-kp/kerja-praktik/permohonan",
            },
            {
              title: "Instansi",
              url: "/koordinator-kp/kerja-praktik/instansi",
            },
          ]
        },
        {
          title: "Seminar",
          url: "#",
          isActive: true,
          icon: CalendarCheck2Icon,
          items: [
            {
              title: "Validasi Pemberkasan",
              url: "/koordinator-kp/seminar-kp/validasi-berkas",
            },
            {
              title: "Penjadwalan",
              url: "/koordinator-kp/seminar-kp/jadwal",
            },
            {
              title: "Penilaian",
              url: "/koordinator-kp/seminar-kp/nilai",
            },
          ],
        },
      ],
    },
  ],
};
