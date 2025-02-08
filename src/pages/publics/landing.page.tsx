import HeaderLandingPageComponent from "@/components/globals/headers/header-landing-page";
import LoadingComponent from "@/components/globals/loading";
import { useAuth } from "react-oidc-context";

const LandingPage = () => {
	const auth = useAuth();
	const handleKeycloakAuth = () => auth.isAuthenticated ? void auth.signoutRedirect() : void auth.signinPopup();
	return (
		<div className="w-screen h-screen">
			{auth.isLoading && <LoadingComponent className="w-screen h-screen bg-black bg-opacity-60 z-50 absolute" />}
			<HeaderLandingPageComponent isAuthenticated={auth.isAuthenticated} onContinueWithKeycloakClicked={handleKeycloakAuth} dashboardURL={"/mahasiswa/setoran-hafalan/statistik"} />
		</div>
	);
};

export default LandingPage;