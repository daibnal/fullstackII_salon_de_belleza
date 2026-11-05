
export function Navbar() {
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
						className="navbar-brand"
						href="../index.html">
						<img
							src="../assets/Logo_sm.png"
							className="rounded-circle"
							alt="Logo" />
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
								<li className="nav-item">
									<a
										className="nav-link fw-bold"
										href="../index.html">
										<i className="bi bi-house-door me-2"></i>Inicio
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-bold"
										href="../index.html#about">
										<i className="bi bi-info-circle me-2"></i>Acerca de Nosotros
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-bold"
										href="../index.html#location">
										<i className="bi bi-geo-alt me-2"></i>Donde encontrarnos
									</a>
								</li>
								<li className="nav-item border-top pt-2">
									<span className="text-uppercase text-muted extra-small fw-bold px-2">Servicios</span>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-semibold active"
										href="">
										<i className="bi bi-eye me-2"></i>Lifting y Cejas
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-semibold"
										href="hair.html">
										<i className="bi bi-scissors me-2"></i>Cabello
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-semibold"
										href="nails.html">
										<i className="bi bi-brush me-2"></i>Manicure
									</a>
								</li>
								<li className="nav-item border-top pt-2 mt-2">
									<a
										className="nav-link fw-semibold"
										href="../usuario/registro_login.html">
										<i className="bi bi-box-arrow-in-right me-2"></i>Inicio de sesión
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link fw-semibold"
										href="../usuario/registro_login.html">
										<i className="bi bi-person-plus me-2"></i>Creación de cuenta
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>
        </>
    )
}