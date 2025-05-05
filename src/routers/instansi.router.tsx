import InstansiKerjaPraktikPage from "@/pages/instansi/page";
import InstansiKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detail-mahasiswa/page";
import DailyReportKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detail-mahasiswa/detail-agenda/page";

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