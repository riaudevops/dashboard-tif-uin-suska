import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import MahasiswaDashboardPage from "@/pages/mahasiswa/setoran-hafalan/page";
import NotFoundPage from "@/pages/publics/not-found.page";

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
				<MahasiswaDashboardPage />
			</ProtectedRoute>
		)
	}
]);

export default router;
