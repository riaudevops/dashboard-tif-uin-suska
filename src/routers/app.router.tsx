import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import NotFoundPage from "@/pages/publics/not-found.page";
import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import DosenSetoranHafalanMahasiswaPAPage from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/page";
import MahasiswaSetoranHafalanDetailRiwayatPage from "@/pages/mahasiswa/setoran-hafalan/detail-riwayat/page";
import DetailMahasiswaSetoran from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/DetailMahasiswaSetoran";
import MahasiswaKerjaPraktekDailyReportIsiAgendaPage from "@/pages/mahasiswa/kerja-praktik/daily-report/isi-agenda/page";
import MahasiswaKerjaPraktekDaftarKpPermohonanPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/page";
import MahasiswaKerjaPraktikDailyReportRiwayatBimbinganPage from "@/pages/mahasiswa/kerja-praktik/daily-report/riwayat-bimbingan/page";
import MahasiswaKerjaPraktekDaftarKpKelengkapanBerkasPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas/page";
import MahasiswaKerjaPraktekDaftarKpPermohonanFormPendaftaranPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran/page";
import MahasiswaKerjaPraktekDaftarKpPermohonanFormDaftarInstansiPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi/page";
import MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage from "@/pages/mahasiswa/kerja-praktik/daily-report/isi-agenda/detail/page";
import MahasiswaSeminarDaftarPage from "@/pages/mahasiswa/seminar/daftar-sem-kp/page";
import MahasiswaSeminarValidasiBerkasPage from "@/pages/mahasiswa/seminar/validasi-berkas/page";

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
		path: "/mahasiswa/kerja-praktik/daftar-kp",
		element: <Navigate to="/mahasiswa/kerja-praktik/daftar-kp/permohonan" />,
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanFormPendaftaranPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanFormDaftarInstansiPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpKelengkapanBerkasPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daily-report",
		element: <Navigate to="/mahasiswa/kerja-praktik/daily-report/isi-agenda" />,
	},
	{
		path: "/mahasiswa/kerja-praktik/daily-report/isi-agenda",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDailyReportIsiAgendaPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daily-report/isi-agenda/detail",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daily-report/riwayat-bimbingan",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktikDailyReportRiwayatBimbinganPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/seminar/daftar-sem-kp",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaSeminarDaftarPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/seminar/validasi-berkas",
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
		path: "/dosen/setoran-hafalan/mahasiswa-pa/:nim",
		element: (
			<ProtectedRoute roles={["dosen"]}>
				<DetailMahasiswaSetoran />
			</ProtectedRoute>
		),
	},
]);

export default router;
