import { useEffect, useState } from "react";
import LoadingComponent from "@/components/globals/loading";
import { hasRole } from "@/helpers/auth.helper";
import { ProtectedRouteProps } from "@/interfaces/routers/protected.interface";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.signinSilent().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (auth.error) {
      auth.signoutRedirect();
    }
  }, [auth.error]);

  // Tampilkan loading hingga Keycloak siap
  if (auth.isLoading || loading)
    return (
      <LoadingComponent className="absolute z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50" />
    );

  // Periksa apakah pengguna sudah terautentikasi atau sesi telah habis
  if (!auth.isAuthenticated) return <Navigate to="/" />;

  // Periksa apakah pengguna memiliki salah satu dari peran yang diizinkan
  if (!hasRole({ token: auth.user!.access_token, roles }))
    return <Navigate to="/forbidden" />;

  return children;
};

export default ProtectedRoute;
