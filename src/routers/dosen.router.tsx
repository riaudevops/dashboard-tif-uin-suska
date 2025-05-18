import ProtectedRoute from "./protected.router";
import DosenSetoranHafalanMahasiswaPAPage from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/page";
import DetailMahasiswaSetoran from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/DetailMahasiswaSetoran";
import DosenPengujiNilaiPage from "@/pages/dosen/seminar-kerja-praktik/nilai-penguji/page";
import NilaiSeminarPenguji from "@/pages/dosen/seminar-kerja-praktik/nilai-penguji/NilaiSeminarPenguji";
import DosenKerjaPraktikMahasiswaBimbingPage from "@/pages/dosen/kerja-praktik/mahasiswa-bimbing/page";
import DosenKerjaPraktikMahasiswaBimbingDetailPage from "@/pages/dosen/kerja-praktik/mahasiswa-bimbing/detail/page";

export const dosenRouter = [
  {
    path: "/dosen/murojaah/mahasiswa-pa",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenSetoranHafalanMahasiswaPAPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/murojaah/mahasiswa-pa/:nim",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DetailMahasiswaSetoran />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/kerja-praktik/mahasiswa-bimbing",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenKerjaPraktikMahasiswaBimbingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dosen/kerja-praktik/mahasiswa-bimbing/detail",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <DosenKerjaPraktikMahasiswaBimbingDetailPage />
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
  {
    path: "/dosen/seminar-kp/nilai-penguji/input-nilai",
    element: (
      <ProtectedRoute roles={["dosen"]}>
        <NilaiSeminarPenguji />
      </ProtectedRoute>
    ),
  },
];
