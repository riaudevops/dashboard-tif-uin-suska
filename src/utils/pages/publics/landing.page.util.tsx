import { getRoles } from "@/helpers/auth.helper";
import { DecodeTokenProps } from "@/interfaces/helpers/auth.interface";

const handleGoToDashboard = ({ token }: DecodeTokenProps) => {
    const userRoles = getRoles({ token });
    if (userRoles.includes("mahasiswa")) return ("/mahasiswa/setoran-hafalan/statistik");
    else if (userRoles.includes("dosen")) return ("/dosen/setoran-hafalan/mahasiswa-pa");
    else return ("/");
};

export { handleGoToDashboard };