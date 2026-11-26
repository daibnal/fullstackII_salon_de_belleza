import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { haySesionAdmin } from "../services/sesion";
import { Notificaciones, type Notificacion } from "../services/notificaciones.service";
import { Navbar } from "./components/navigation/Navbar";
import { ScrollAlInicio } from "./ScrollAlInicio";

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
				url: "/cuenta/logout",
				titulo: "Cerrar sesión",
				icono: "bi-box-arrow-left",
			},
		],
	},
];

function Campana() {
	const [abierto, setAbierto] = useState(false);
	const [items, setItems] = useState<Notificacion[]>([]);
	const [error, setError] = useState("");

	useEffect(() => {
		void Notificaciones.listar()
			.then(setItems)
			.catch(() => setError("No se pudieron cargar las notificaciones."));
	}, []);

	return (
		<div className="position-relative">
			<button
				type="button"
				className="header-icon-btn admin-bell position-relative"
				title="Notificaciones"
				aria-label="Notificaciones"
				aria-expanded={abierto}
				onClick={() => setAbierto((valor) => !valor)}>
				<i className="bi bi-bell"></i>
				{items.length > 0 && (
					<span className="position-absolute top-0 end-0 p-1 bg-danger border border-light rounded-circle">
						<span className="visually-hidden">{items.length} notificaciones</span>
					</span>
				)}
			</button>
			{abierto && (
				<div className="notif-panel shadow">
					<p className="fw-bold mb-2">Notificaciones</p>
					{error && <p className="text-danger small mb-0">{error}</p>}
					{!error && items.length === 0 && <p className="text-muted small mb-0">No hay avisos recientes.</p>}
					<ul className="list-unstyled mb-0">
						{items.map((item) => (
							<li key={item.id} className="border-top py-2">
								<div className="small fw-semibold">{item.tipo}</div>
								<div className="small">{item.mensaje}</div>
								<div className="text-muted extra-small">{item.creadaEn?.replace("T", " ").slice(0, 16)}</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export function AdminLayout() {
	const navigate = useNavigate();

	useEffect(() => {
		document.body.classList.add("admin", "menu-fijo");
		return () => {
			document.body.classList.remove("admin", "menu-fijo");
		};
	}, []);

	useEffect(() => {
		if (!haySesionAdmin()) {
			navigate("/cuenta/login");
		}
	}, [navigate]);

	return (
		<div className="wrapper">
			<ScrollAlInicio />
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
							<Campana />
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
