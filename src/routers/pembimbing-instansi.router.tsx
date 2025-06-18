import PembimbingInstansiKerjaPraktikMahasiswaPage from "@/pages/pembimbing-instansi/page";
import PembimbingInstansiKerjaPraktikMahasiswaDetailPage from "@/pages/pembimbing-instansi/detail-mahasiswa/page";
import PembimbingInstansiKerjaPraktikMahasiswaDetailAgendaPage from "@/pages/pembimbing-instansi/detail-mahasiswa/detail-agenda/page";

export const instansiRouter = [
  {
    path: "/pembimbing-instansi/kerja-praktik/:id",
    element: <PembimbingInstansiKerjaPraktikMahasiswaPage />,
  },
  {
    path: "/pembimbing-instansi/kerja-praktik/detail-mahasiswa/:id",
    element: <PembimbingInstansiKerjaPraktikMahasiswaDetailPage />,
  },
  {
    path: "/pembimbing-instansi/kerja-praktik/detail-mahasiswa/daily-report/:id",
    element: <PembimbingInstansiKerjaPraktikMahasiswaDetailAgendaPage />,
  },
];
