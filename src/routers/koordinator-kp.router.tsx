import KoordinatorKerjaPraktikPermohonanDetailPage from "@/pages/koordinator-kp/kerja-praktik/permohonan/detail-permohonan/page";
import ProtectedRoute from "./protected.router";
import KoordinatorValidasiBerkasPage from "@/pages/koordinator-kp/seminar-kerja-praktik/validasi-berkas/page";
import KoordinatorNilaiPage from "@/pages/koordinator-kp/seminar-kerja-praktik/nilai/page";
import KoordinatorKerjaPraktikPermohonanPage from "@/pages/koordinator-kp/kerja-praktik/permohonan/page";
import KoordinatorKerjaPraktikDailyReportPage from "@/pages/koordinator-kp/kerja-praktik/daily-report/page";
import KoordinatorKerjaPraktikDailyReportDetailPage from "@/pages/koordinator-kp/kerja-praktik/daily-report/detail-mahasiswa/page";
import KoordinatorJadwalSeminarPage from "@/pages/koordinator-kp/seminar-kerja-praktik/jadwal/page";
import KoordinatorKerjaPraktikInstansiPage from "@/pages/koordinator-kp/kerja-praktik/permohonan/pendaftaran-instansi/page";
import KoordinatorKerjaPraktikDetailInstansiPage from "@/pages/koordinator-kp/kerja-praktik/permohonan/pendaftaran-instansi/detail-instansi/page";
import OptionPage from "@/pages/koordinator-kp/option/page";
import { Navigate } from "react-router-dom";

export const koordinatorKPRouter = [
  {
    path: "/koordinator-kp/kerja-praktik/permohonan",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikPermohonanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/permohonan/detail-permohonan",
    element: <Navigate to="/koordinator-kp/kerja-praktik/permohonan" />,
  },
  {
    path: "/koordinator-kp/kerja-praktik/permohonan/detail-permohonan/:id",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikPermohonanDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/instansi",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikInstansiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/instansi/detail-instansi",
    element: <Navigate to="/koordinator-kp/kerja-praktik/instansi" />,
  },
  {
    path: "/koordinator-kp/kerja-praktik/instansi/detail-instansi/:id",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikDetailInstansiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/option",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <OptionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/permohonan/instansi",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikPermohonanDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/daily-report",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikDailyReportPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/kerja-praktik/daily-report/detail-mahasiswa",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorKerjaPraktikDailyReportDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/seminar-kp/validasi-berkas",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorValidasiBerkasPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/seminar-kp/nilai",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorNilaiPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/koordinator-kp/seminar-kp/jadwal",
    element: (
      <ProtectedRoute roles={["koordinator-kp"]}>
        <KoordinatorJadwalSeminarPage />
      </ProtectedRoute>
    ),
  },
];