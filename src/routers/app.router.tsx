import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import NotFoundPage from "@/pages/publics/not-found.page";
import MahasiswaSetoranHafalanStatistikPage from "@/pages/mahasiswa/setoran-hafalan/statistik/page";
import DosenSetoranHafalanMahasiswaPAPage from "@/pages/dosen/setoran-hafalan/mahasiswa-pa/page";

const router = createBrowserRouter([
	{
		path: "/",
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
		)
	},
	{
		path: "/dosen/setoran-hafalan/mahasiswa-pa",
		element: (
			<ProtectedRoute roles={["dosen"]}>
				<DosenSetoranHafalanMahasiswaPAPage />
			</ProtectedRoute>
		)
	}
]);

export default router;
