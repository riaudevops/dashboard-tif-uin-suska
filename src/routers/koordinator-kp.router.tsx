import KoordinatorKerjaPraktikPermohonanDetailpage from "@/pages/koordinator-kp/Kerja-Praktik/Permohonan/Detail-Permohonan/page";
import ProtectedRoute from "./protected.router";
import KoordinatorKerjaPraktikDailyReportpage from "@/pages/koordinator-kp/Kerja-Praktik/Daily-Report/page";
import KoordinatorKerjaPraktikDailyReportDetailpage from "@/pages/koordinator-kp/Kerja-Praktik/Daily-Report/Detail-Mahasiswa/page";
import KoordinatorValidasiBerkasPage from "@/pages/koordinator-kp/seminar-kerja-praktek/validasi-berkas/page";
import KoordinatorNilaiPage from "@/pages/koordinator-kp/seminar-kerja-praktek/nilai/page";
import KoordinatorKerjaPraktikPermohonanpage from "@/pages/koordinator-kp/Kerja-Praktik/Permohonan/page";

export const koordinatorKPRouter = [
	{
		path: "/koordinator-kp/kerja-praktik/permohonan",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikPermohonanpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/koordinator-kp/kerja-praktik/permohonan/detail-permohonan",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikPermohonanDetailpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/koordinator-kp/kerja-praktik/daily-report",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikDailyReportpage />
			</ProtectedRoute>
		),
	},
	{
		path: "/koordinator-kp/kerja-praktik/daily-report/detail-mahasiswa",
		element: (
			<ProtectedRoute roles={["koordinator-kp"]}>
				<KoordinatorKerjaPraktikDailyReportDetailpage />
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
]