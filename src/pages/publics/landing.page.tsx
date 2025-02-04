import HeaderLandingPageComponent from "@/components/globals/headers/header-landing-page";
import { useAuth } from "react-oidc-context";

const LandingPage = () => {

	const auth = useAuth();
	const handleKeycloakAuth = () => {
		return auth.isAuthenticated ? auth.signoutRedirect() : void auth.signinRedirect();
	}

	return (
		<div className="w-screen h-screen">
			<HeaderLandingPageComponent isAuthenticated={auth.isAuthenticated} onContinueWithKeycloakClicked={handleKeycloakAuth}/>
			<p>gagagadgd</p>
		</div>
	);
};

export default LandingPage;