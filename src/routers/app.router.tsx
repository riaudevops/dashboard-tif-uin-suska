import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import NotFoundPage from "@/pages/publics/not-found.page";
import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import DosenSetoranHafalanMahasiswaPAPage from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/page";
import MahasiswaSetoranHafalanDetailRiwayatPage from "@/pages/mahasiswa/setoran-hafalan/detail-riwayat/page";
import DetailMahasiswaSetoran from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/DetailMahasiswaSetoran";
import MahasiswaSeminarDaftarPage from "@/pages/mahasiswa/seminar/daftar-sem-kp/page";
import MahasiswaSeminarValidasiBerkasPage from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import DosenPengujiNilaiPage from "@/pages/dosen/seminar-kerja-praktek/nilai-penguji/page";
import DosenPengujiMahasiswaPage from "@/pages/dosen/seminar-kerja-praktek/mahasiswa-diuji/page";
import DetailMahasiswaSeminar from "@/pages/dosen/seminar-kerja-praktek/mahasiswa-diuji/DetailMahasiswaSeminar";
import NilaiSeminarPenguji from "@/pages/dosen/seminar-kerja-praktek/nilai-penguji/NilaiSeminarPenguji";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/beranda",
    element: <LandingPage />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/mahasiswa/setoran-hafalan/statistik",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSetoranHafalanStatistikPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/setoran-hafalan/detail-riwayat",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSetoranHafalanDetailRiwayatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/seminar-kp",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSeminarDaftarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/seminar-kp/validasi-berkas",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSeminarValidasiBerkasPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/setoran-hafalan/mahasiswa-pa",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenSetoranHafalanMahasiswaPAPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/setoran-hafalan/mahasiswa-pa/detail",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DetailMahasiswaSetoran />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/seminar-kp/nilai-penguji",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenPengujiNilaiPage />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/dosen/seminar-kerja-praktek/nilai-penguji/detail",
  //   element: (
  //     <ProtectedRoute roles={["dosen"]}>
  //       <DetailMahasiswaSetoran />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/dosen/seminar-kp/mahasiswa-diuji",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenPengujiMahasiswaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/seminar-kp/mahasiswa-diuji/detail",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DetailMahasiswaSeminar />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/seminar-kp/nilai-penguji/input-nilai",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <NilaiSeminarPenguji />
      </ProtectedRoute>
    ),
  },
]);

export default router;
