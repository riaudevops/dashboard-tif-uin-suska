import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { onSigninCallback, userManager } from "./libs/keycloak";
import { queryClient } from "./libs/query-client";
import { ThemeProvider } from "@/components/themes/theme-provider";
import router from "./routers/app.router";

const App = () => {
	return (
		<AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
					<RouterProvider router={router} />
				</ThemeProvider>
			</QueryClientProvider>
		</AuthProvider>
	);
};

export default App;
