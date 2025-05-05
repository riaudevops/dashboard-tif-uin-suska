import InstansiKerjaPraktikPage from "@/pages/instansi/page";
import InstansiKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detailmahasiswa/page";
import DailyReportKerjaPraktikMahasiswaDetailPage from "@/pages/instansi/detailmahasiswa/detail-agenda/page";

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
		path: "/instansi/detailmahasiswa/detail",
		element: <DailyReportKerjaPraktikMahasiswaDetailPage />,
	},
]