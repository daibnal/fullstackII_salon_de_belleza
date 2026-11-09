import { Link } from "react-router";
import { assets } from "../../../assets/AssetsInterface";
import { NavItem } from "./NavItem";

interface link {
	url: string;
	titulo: string;
	icono: string;
};

interface seccion {
	titulo: string;
	links: link[];
}

interface estructuraProps {
	estructura: seccion[];
}


export function Navbar({estructura}: estructuraProps) {
    return (
        <>
            <nav className="navbar fixed-top">
				<div className="container-fluid">
					{/*  3 Rayitas */} 
					<button
						className="header-icon-btn me-3"
						type="button"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasNavbar"
						aria-controls="offcanvasNavbar"
						aria-label="Menú desplegable lateral"
						title="Menú desplegable">
						<i className="navbar-toggler-icon"></i>
					</button>
					{/* Logo */}
					<a
						className="navbar-brand">
							<Link to="/">
								<img
									src={assets.logo.src}
									className="rounded-circle"
									alt="Logo" />
							</Link>
							<span className="brand-title ms-2">Sakura Salón</span>
					</a>

					{/* Menú lateral */}
					<div
						className="offcanvas offcanvas-start"
						tabIndex={-1}
						id="offcanvasNavbar"
						aria-labelledby="offcanvasNavbarLabel">
						{/* Encabezado Menú lateral */}
						<div className="offcanvas-header">
							<h5
								className="offcanvas-title fw-bold"
								id="offcanvasNavbarLabel">
								Menú
							</h5>
							<button
								type="button"
								className="btn-close btn-close-white"
								data-bs-dismiss="offcanvas"
								aria-label="Close"></button>
						</div>
						{/* Cuerpo del Menú Lateral */}
						<div className="offcanvas-body">
							<ul className="navbar-nav gap-2">
								{
									estructura?.map((item, i) => (
										<>
											{
												item.titulo !== "" && (
													<li className="nav-item border-top pt-2">
														<span className="text-uppercase text-muted extra-small fw-bold px-2">{item.titulo}</span>
													</li>
												)
											}
											{
												item.links?.map((link, j) => (
													<NavItem key={i.toString() + j.toString()} url={link.url} titulo={link.titulo} icono={link.icono}/>
												))
											}
										</>
									))
								}
							</ul>
						</div>
					</div>
				</div>
			</nav>
        </>
    )
}