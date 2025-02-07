import HeaderLandingPageComponent from "@/components/globals/headers/header-landing-page";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const LandingPage = () => {
	const auth = useAuth();
	useEffect(() => {
		console.log(auth);
	}, [auth])
	const handleKeycloakAuth = () => {
		return auth.isAuthenticated ? auth.signoutSilent() : void auth.signinPopup();
	}

	return (
		<div className="w-screen h-screen">
			<HeaderLandingPageComponent isAuthenticated={auth.isAuthenticated} onContinueWithKeycloakClicked={handleKeycloakAuth}/>
		</div>
	);
};

export default LandingPage;