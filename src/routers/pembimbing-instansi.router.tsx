import InstansiKerjaPraktikPage from "@/pages/pembimbing-instansi/page";
import InstansiKerjaPraktikMahasiswaDetailPage from "@/pages/pembimbing-instansi/detail-mahasiswa/page";
import DailyReportKerjaPraktikMahasiswaDetailPage from "@/pages/pembimbing-instansi/detail-mahasiswa/detail-agenda/page";

export const instansiRouter = [
	{
		path: "/instansi/kerja-praktik/UIN-SUSKA-RIAU",
		element: <InstansiKerjaPraktikPage />,
	},
	{
		path: "/instansi/detail/:name",
		element: <InstansiKerjaPraktikMahasiswaDetailPage />,
	},
	{
		path: "/instansi/detail-mahasiswa/detail",
		element: <DailyReportKerjaPraktikMahasiswaDetailPage />,
	},
]