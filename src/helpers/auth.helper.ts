import { CustomJwtPayload, DecodeTokenProps, HasRoleProps } from "@/interfaces/helpers/auth.interface";
import { jwtDecode } from "jwt-decode";

// Helper function to decode JWT token
export const decodeToken = ({token}: DecodeTokenProps) => {
	try {
		return jwtDecode(token!) as CustomJwtPayload;
	} catch (error) {
		return null;
	}
};

// Helper function to check if the user has a specific role
export const hasRole = ({ token, roles }: HasRoleProps) => {
	const userRoles = getRoles({ token });
	return roles.some((role) => userRoles.includes(role));
};

export const getRoles = ({ token }: DecodeTokenProps) => decodeToken({token})?.realm_access?.roles || [];