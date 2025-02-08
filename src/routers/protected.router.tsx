import LoadingComponent from "@/components/globals/loading";
import { hasRole } from "@/helpers/auth.helper";
import { ProtectedRouteProps } from "@/interfaces/routers/protected.interface";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {

	const auth = useAuth();

	// Tampilkan loading atau null hingga Keycloak siap
	if (auth.isLoading) return <LoadingComponent className="w-screen h-screen bg-black bg-opacity-50 z-50 absolute flex items-center justify-center"/>;

	// Periksa apakah pengguna sudah terautentikasi
	if (!auth.isAuthenticated) return <Navigate to="/" />;

	// Periksa apakah pengguna memiliki salah satu dari peran yang diizinkan
	if (!hasRole({ token: auth.user!.access_token, roles })) return <Navigate to="/forbidden" />;

	return children;
};

export default ProtectedRoute;