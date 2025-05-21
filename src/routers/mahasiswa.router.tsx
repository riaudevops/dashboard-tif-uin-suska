import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import ProtectedRoute from "./protected.router";
import MahasiswaSetoranHafalanDetailRiwayatPage from "@/pages/mahasiswa/setoran-hafalan/detail-riwayat/page";
import { Navigate } from "react-router-dom";
import MahasiswaKerjaPraktekDaftarKpPermohonanPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/page";
import MahasiswaKerjaPraktekDaftarKpPermohonanFormPendaftaranPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran/page";
import MahasiswaKerjaPraktekDailyReportIsiAgendaPage from "@/pages/mahasiswa/kerja-praktik/daily-report/isi-agenda/page";
import MahasiswaKerjaPraktikDailyReportRiwayatBimbinganPage from "@/pages/mahasiswa/kerja-praktik/daily-report/riwayat-bimbingan/page";
import MahasiswaKerjaPraktekDaftarKpKelengkapanBerkasPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas/page";
import MahasiswaKerjaPraktekDaftarKpPermohonanFormDaftarInstansiPage from "@/pages/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi/page";
import MahasiswaKerjaPraktekDailyReportIsiAgendaDetailPage from "@/pages/mahasiswa/kerja-praktik/daily-report/isi-agenda/detail/page";
import MahasiswaSeminarDaftarPage from "@/pages/mahasiswa/seminar/daftar-sem-kp/page";
import MahasiswaSeminarValidasiBerkasPage from "@/pages/mahasiswa/seminar/validasi-berkas/page";

export const mahasiswaRouter = [
	{
		path: "/mahasiswa/murojaah/statistik",
		element: (
			<ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaSetoranHafalanStatistikPage />
			</ProtectedRoute>
		),
	},
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
			// <ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanPage />
			// </ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-pendaftaran",
		element: (
			// <ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanFormPendaftaranPage />
			// </ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/permohonan/form-daftar-instansi",
		element: (
			// <ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpPermohonanFormDaftarInstansiPage />
			// </ProtectedRoute>
		),
	},
	{
		path: "/mahasiswa/kerja-praktik/daftar-kp/kelengkapan-berkas",
		element: (
			// <ProtectedRoute roles={["mahasiswa"]}>
				<MahasiswaKerjaPraktekDaftarKpKelengkapanBerkasPage />
			// </ProtectedRoute>
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
]