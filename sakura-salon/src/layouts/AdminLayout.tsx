import { useEffect } from "react";
import { Outlet } from "react-router";
import { Navbar } from "./components/navigation/Navbar";

const adminEstructura = [
	{
		titulo: "",
		enlaces: [
			{
				url: "/admin",
				titulo: "Dashboard",
				icono: "bi-speedometer2",
			},
			{
				url: "/admin/agenda",
				titulo: "Agenda",
				icono: "bi-calendar3",
			},
			{
				url: "/admin/servicios",
				titulo: "Servicios",
				icono: "bi-scissors",
			},
			{
				url: "/admin/personal",
				titulo: "Personal",
				icono: "bi-people",
			},
			{
				url: "/admin/insumos",
				titulo: "Insumos",
				icono: "bi-box-seam",
			},
			{
				url: "/admin/reportes",
				titulo: "Reportes",
				icono: "bi-graph-up",
			},
		],
	},
	{
		titulo: "",
		enlaces: [
			{
				url: "/",
				titulo: "Cerrar sesión",
				icono: "bi-box-arrow-left",
			},
		],
	},
];

export function AdminLayout() {
	useEffect(() => {
		document.body.classList.add("admin");
		return () => {
			document.body.classList.remove("admin");
		};
	}, []);

	return (
		<div className="wrapper">
			<header>
				<Navbar
					estructura={adminEstructura}
					marca="Panel Admin"
					logoTo="/admin"
					offcanvasId="offcanvasAdmin"
					slotsDerecha={
						<div className="ms-auto d-flex align-items-center gap-2">
							<span className="admin-greeting d-none d-md-inline">
								Bienvenida, Administradora
							</span>
							<a
								href="#"
								className="header-icon-btn admin-bell position-relative"
								title="Notificaciones"
								aria-label="Notificaciones"
								onClick={(event) => event.preventDefault()}>
								<i className="bi bi-bell"></i>
								<span className="position-absolute top-0 end-0 p-1 bg-danger border border-light rounded-circle">
									<span className="visually-hidden">Nuevas alertas</span>
								</span>
							</a>
						</div>
					}
				/>
			</header>
			<div id="content">
				<div className="main-content-area container-fluid">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
