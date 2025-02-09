import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
    realm_access: {
        roles: string[];
    }
}

export interface DecodeTokenProps {
    token?: string;
}

export interface HasRoleProps {
    token: string;
    roles: string[];
}