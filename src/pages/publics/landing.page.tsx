import HeaderLandingPageComponent from "@/components/globals/headers/header-landing-page";
import LoadingComponent from "@/components/globals/loading";
import { handleGoToDashboard } from "@/utils/pages/publics/landing.page.util";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

const LandingPage = () => {
	const auth = useAuth();
	const handleKeycloakAuth = () => auth.isAuthenticated ? void auth.signoutRedirect() : void auth.signinPopup();		
	const [dashboardURL, setDashboardURL] = useState("/");
	useEffect(() => {
		if (auth.isAuthenticated) setDashboardURL(handleGoToDashboard({ token: auth.user!.access_token }));
	}, [auth.isAuthenticated]);
	return (
		<div className="w-screen h-screen">
			{auth.isLoading && (<LoadingComponent className="w-screen h-screen bg-black bg-opacity-60 z-50 absolute" />)}
			<HeaderLandingPageComponent isAuthenticated={auth.isAuthenticated} onContinueWithKeycloakClicked={handleKeycloakAuth} dashboardURL={dashboardURL} />
		</div>
	);
};

export default LandingPage;