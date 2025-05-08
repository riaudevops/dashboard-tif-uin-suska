import { createBrowserRouter } from "react-router-dom";
import { generalRouter } from "./general.router";
import { mahasiswaRouter } from "./mahasiswa.router";
import { dosenRouter } from "./dosen.router";
import { koordinatorKPRouter } from "./koordinator-kp.router";
import { instansiRouter } from "./pembimbing-instansi.router";

const router = createBrowserRouter([
	...generalRouter,
	...mahasiswaRouter,
	...dosenRouter,
	...koordinatorKPRouter,
	...instansiRouter	
]);

export default router;