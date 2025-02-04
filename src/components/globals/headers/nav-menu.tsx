import { NavLink } from "react-router-dom";

export const NavMenu = () => {
	return <nav className="flex mt-[0.20rem] justify-center items-center text-sm text-muted-foreground">
		<ul className="flex space-x-4">
			<li
				className={
					location.pathname.includes("/setoran")
						? "text-foreground"
						: ""
				}
			>
				<NavLink to="/mahasiswa/dashboard/setoran-hafalan">Setoran Hafalan</NavLink>
			</li>
			<li
				className={
					location.pathname.includes("/kerja-praktek")
						? "text-foreground"
						: ""
				}
			>
				<NavLink to="/mahasiswa/dashboard/kerja-praktek">Kerja Praktek</NavLink>
			</li>
			<li
				className={
					location.pathname.includes("/seminar")
						? "text-foreground"
						: ""
				}
			>
				<NavLink to="/mahasiswa/dashboard/seminar">Seminar</NavLink>
			</li>
		</ul>
	</nav>;
};
