import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import NotFoundPage from "@/pages/publics/not-found.page";
import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import DosenSetoranHafalanMahasiswaPAPage from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/page";
import DosenKerjaPraktikmahasiswaBimbinganpage from "@/pages/dosen/Kerja-praktik/mahasiswa-bimbingan-kp/page";
import DosenKerjaPraktikMahasiswaBimbinganKPDetailpage from "@/pages/dosen/Kerja-praktik/mahasiswa-bimbingan-kp/detail/page";
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
import InstansiKerjaPraktikpage from "@/pages/instansi/page";
import InstansiKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detailmahasiswa/page";
import DailyReportKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detailmahasiswa/detail-agenda/page";
import KoordinatorKerjaPraktikPermohonanpage from "@/pages/koordinator/kerja-praktik/permohonan/page";
import KoordinatorKerjaPraktikPermohonanDetailpage from "@/pages/koordinator/kerja-praktik/permohonan/Detail-Permohonan/page";
import KoordinatorKerjaPraktikDailyReportpage from "@/pages/koordinator/kerja-praktik/daily-report/page";
import KoordinatorKerjaPraktikDailyReportDetailpage from "@/pages/koordinator/kerja-praktik/daily-report/Detail-Mahasiswa/page";
import DosenPengujiNilaiPage from "@/pages/dosen/seminar-kerja-praktek/nilai-penguji/page";
import NilaiSeminarPenguji from "@/pages/dosen/seminar-kerja-praktek/nilai-penguji/NilaiSeminarPenguji";
import KoordinatorNilaiPage from "@/pages/koordinator/seminar-kerja-praktek/nilai/page";
import KoordinatorValidasiBerkasPage from "@/pages/koordinator/seminar-kerja-praktek/validasi-berkas/page";


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
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDailyReportIsiAgendaPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daily-report/detail",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage />
			</ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/bimbingan",
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
	{
		path: "/dosen/kerja-praktik/mahasiswa-bimbingan-kp",
		element: (
			<ProtectedRoute roles={["dosen"]}>
				<DosenKerjaPraktikmahasiswaBimbinganpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/dosen/kerja-praktik/mahasiswa-bimbingan-kp/detail",
		element: (
			<ProtectedRoute roles={["dosen"]}>
				<DosenKerjaPraktikMahasiswaBimbinganKPDetailpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/instansi/kerja-praktik/UIN-SUSKA-RIAU",
		element: <InstansiKerjaPraktikpage />,
	},
	{
		path: "/instansi/detail/:name",
		element: <InstansiKerjaPraktikMahasiswaDetailPage />,
	},
	{
		path: "/instansi/detailmahasiswa/detail",
		element: <DailyReportKerjaPraktikMahasiswaDetailPage />,
	},
	{
		path: "/Koordinator-kp/Kerja-Praktik/Permohonan",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikPermohonanpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/Koordinator-kp/Kerja-Praktik/Permohonan/Detail-Permohonan",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikPermohonanDetailpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/koordinator-kp/kerja-praktik/Daily-Report",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikDailyReportpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/koordinator-kp/kerja-praktik/Daily-Report/Detail-Mahasiswa",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikDailyReportDetailpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/Koordinator-kp/kerja-praktik/Daily-Report/Detail-Mahasiswa",
		element: (
			<ProtectedRoute roles={["Koordinator-kp"]}>
				<KoordinatorKerjaPraktikDailyReportDetailpage />
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
]);

export default router;
