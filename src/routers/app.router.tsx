import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./protected.router";
import LandingPage from "@/pages/publics/landing.page";
import ForbiddenPage from "@/pages/publics/forbidden.page";
import MahasiswaDashboardPage from "@/pages/mahasiswa/setoran-hafalan/page";

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
		path: "/mahasiswa/setoran-hafalan/statistik",
		element: <MahasiswaDashboardPage />
	},
	{
		path: "/dosen-pa",
		element: (
			<ProtectedRoute roles={["dosen-pa"]}>
				<p>This is protected routes.</p>
			</ProtectedRoute>
		),
	}
]);

export default router;
