import { CustomJwtPayload, DecodeTokenProps, HasRoleProps } from "@/interfaces/helpers/auth.interface";
import { jwtDecode } from "jwt-decode";

// Helper function to decode JWT token
export const decodeToken = ({token}: DecodeTokenProps) => {
	try {
		return jwtDecode(token) as CustomJwtPayload;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

// Helper function to check if the user has a specific role
export const hasRole = ({ token, roles }: HasRoleProps) => {
	const decodedToken = decodeToken({token});
	if (!decodedToken) {
		return false;
	}

	const userRoles = decodedToken.roles || [];
	return roles.some((role) => userRoles.includes(role));
};