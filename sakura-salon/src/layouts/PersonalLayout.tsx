import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { haySesionProfesional } from "../services/sesion";
import { Navbar } from "./components/navigation/Navbar";
import { ScrollAlInicio } from "./ScrollAlInicio";

const estructura = [
	{
		titulo: "",
		enlaces: [
			{ url: "/personal", titulo: "Mis citas", icono: "bi-calendar-check" },
		],
	},
	{
		titulo: "",
		enlaces: [
			{ url: "/cuenta/logout", titulo: "Cerrar sesión", icono: "bi-box-arrow-left" },
		],
	},
];

export function PersonalLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		document.body.classList.add("personal");
		return () => {
			document.body.classList.remove("personal");
		};
	}, []);

	useEffect(() => {
		if (!haySesionProfesional()) {
			navigate("/cuenta/login");
		}
	}, [navigate]);

	return (
		<div className="wrapper">
			<ScrollAlInicio />
			<header>
				<Navbar estructura={estructura} marca="Panel personal" logoTo="/personal" offcanvasId="offcanvasPersonal" />
			</header>
			<div id="content">
				<div className="main-content-area container-fluid">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
