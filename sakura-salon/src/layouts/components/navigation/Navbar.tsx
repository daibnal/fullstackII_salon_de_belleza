import { Fragment, type ReactNode } from "react";
import { Link } from "react-router";
import { assets } from "../../../assets/AssetsInterface";
import { NavItem } from "./NavItem";
import type { linkProps } from "./NavItem";

interface seccion {
	titulo: string;
	enlaces: linkProps[];
}

interface estructuraProps {
	estructura: seccion[];
	marca?: string;
	logoTo?: string;
	slotsDerecha?: ReactNode;
	offcanvasId?: string;
}

export function Navbar({
	estructura,
	marca = "Sakura Salón",
	logoTo = "/",
	slotsDerecha,
	offcanvasId = "offcanvasNavbar",
}: estructuraProps) {
    return (
        <>
            <nav className="navbar fixed-top">
				<div className="container-fluid">
					<button
						className="header-icon-btn me-3"
						type="button"
						data-bs-toggle="offcanvas"
						data-bs-target={`#${offcanvasId}`}
						aria-controls={offcanvasId}
						aria-label="Menú desplegable lateral"
						title="Menú desplegable">
						<i className="navbar-toggler-icon"></i>
					</button>
					<div className="navbar-brand d-flex align-items-center">
						<Link to={logoTo}>
							<img
								src={assets.logo.src}
								className="rounded-circle"
								alt="Logo" />
						</Link>
						<span className="brand-title ms-2">{marca}</span>
					</div>

					{slotsDerecha}

					<div
						className="offcanvas offcanvas-start"
						tabIndex={-1}
						id={offcanvasId}
						aria-labelledby={`${offcanvasId}Label`}>
						<div className="offcanvas-header">
							<h5
								className="offcanvas-title fw-bold"
								id={`${offcanvasId}Label`}>
								Menú
							</h5>
							<button
								type="button"
								className="btn-close btn-close-white"
								data-bs-dismiss="offcanvas"
								aria-label="Cerrar"></button>
						</div>
						<div className="offcanvas-body">
							<ul className="navbar-nav gap-2">
								{
									estructura?.map((item, i) => (
										<Fragment key={i}>
											{
												item.titulo !== "" && (
													<li className="nav-item border-top pt-2">
														<span className="text-uppercase text-muted extra-small fw-bold px-2">{item.titulo}</span>
													</li>
												)
											}
											{
												item.enlaces?.map((link, j) => (
													<NavItem key={i.toString() + j.toString()} url={link.url} titulo={link.titulo} icono={link.icono}/>
												))
											}
										</Fragment>
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
