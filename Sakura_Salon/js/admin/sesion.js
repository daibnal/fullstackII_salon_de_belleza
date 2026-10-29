(function () {
	const CLAVE_SESION = "sesionSakura";
	const crudo = sessionStorage.getItem(CLAVE_SESION) || localStorage.getItem(CLAVE_SESION);
	let esAdmin = false;

	if (crudo) {
		try {
			esAdmin = JSON.parse(crudo).rol === "ADMIN";
		} catch {
			esAdmin = false;
		}
	}

	if (!esAdmin) {
		window.location.replace("../usuario/registro_login.html");
		return;
	}

	document.addEventListener("click", function (event) {
		const origen = event.target;
		if (!(origen instanceof Element)) {
			return;
		}
		const enlace = origen.closest('a[href="../usuario/registro_login.html"]');
		if (!enlace) {
			return;
		}
		sessionStorage.removeItem(CLAVE_SESION);
		localStorage.removeItem(CLAVE_SESION);
	});
})();
