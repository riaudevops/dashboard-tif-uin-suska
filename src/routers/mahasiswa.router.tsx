import { Navigate } from "react-router-dom";
import ProtectedRoute from "./protected.router";
// import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import MahasiswaSetoranHafalanDetailRiwayatPage from "@/pages/mahasiswa/setoran-hafalan/detail-riwayat/page";
import MahasiswaKerjapraktikDaftarKpPermohonanPage from "@/pages/mahasiswa/kerja-praktik/administrasi/permohonan/page";
import MahasiswaKerjapraktikDaftarKpPermohonanFormPendaftaranPage from "@/pages/mahasiswa/kerja-praktik/administrasi/permohonan/form-pendaftaran/page";
import MahasiswaKerjapraktikDaftarKpKelengkapanBerkasPage from "@/pages/mahasiswa/kerja-praktik/administrasi/kelengkapan-berkas/page";
import MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarInstansiPage from "@/pages/mahasiswa/kerja-praktik/administrasi/permohonan/form-daftar-instansi/page";
import MahasiswaSeminarDaftarPage from "@/pages/mahasiswa/seminar/daftar-sem-kp/page";
import MahasiswaSeminarValidasiBerkasPage from "@/pages/mahasiswa/seminar/validasi-berkas/page";
import MahasiswaKerjaPraktikDailyReportPage from "@/pages/mahasiswa/kerja-praktik/daily-report/page";
import MahasiswaKerjaPraktikDailyReportDetailPage from "@/pages/mahasiswa/kerja-praktik/daily-report/detail/page";
import MahasiswaKerjaPraktikBimbinganPage from "@/pages/mahasiswa/kerja-praktik/bimbingan/page";
import MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarPembimbingInstansiPage from "@/pages/mahasiswa/kerja-praktik/administrasi/permohonan/form-daftar-pembimbing-instansi/page";

export const mahasiswaRouter = [
  // {
  //   path: "/mahasiswa/murojaah/statistik",
  //   element: (
  //     <ProtectedRoute roles={["mahasiswa"]}>
  //       <MahasiswaSetoranHafalanStatistikPage />
  //     </ProtectedRoute>
  //   ),
  // },
  {
    path: "/mahasiswa/murojaah/detail-riwayat",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSetoranHafalanDetailRiwayatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp",
    element: <Navigate to="/mahasiswa/kerja-praktik/daftar-kp/permohonan" />,
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjapraktikDaftarKpPermohonanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjapraktikDaftarKpPermohonanFormPendaftaranPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarInstansiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-pembimbing-instansi",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjapraktikDaftarKpPermohonanFormDaftarPembimbingInstansiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjapraktikDaftarKpKelengkapanBerkasPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daily-report",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjaPraktikDailyReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/daily-report/detail",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjaPraktikDailyReportDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/bimbingan",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaKerjaPraktikBimbinganPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/seminar",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSeminarDaftarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mahasiswa/kerja-praktik/seminar/validasi-berkas",
    element: (
      <ProtectedRoute roles={["mahasiswa"]}>
        <MahasiswaSeminarValidasiBerkasPage />
      </ProtectedRoute>
    ),
  },
];
