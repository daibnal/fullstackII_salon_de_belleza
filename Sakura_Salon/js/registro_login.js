// Validar Nombre
function nombreEsValido(regexTexto) {
	// Selecciona el campo del documento html
	const nombre = document.getElementById("nombre");

	// Si es invalido, lo añade a la lista negra
	if (!regexTexto.test(nombre.value.trim())) {
		nombre.classList.add("is-invalid");
		return false;
	}

	nombre.classList.remove("is-invalid");
	return true;
}

// Validar Apellido
function apellidoEsValido(regexTexto) {
	// Selecciona el campo del documento html
	const apellido = document.getElementById("apellido");

	// Si es invalido, lo añade a la lista negra
	if (!regexTexto.test(apellido.value.trim())) {
		apellido.classList.add("is-invalid");
		return false;
	}

	apellido.classList.remove("is-invalid");
	return true;
}

// Validar RUT chileno (ej: 12345678-9 o 12345678-K)
function rutEsValido() {
	// Expresion regular rut
	const regexRut = /^\d{7,8}-[\dKk]$/;

	// Selecciona el campo del documento html
	const rut = document.getElementById("rut");

	// Si es invalido, lo añade a la lista negra
	if (!regexRut.test(rut.value.trim())) {
		rut.classList.add("is-invalid");
		return false;
	}

	rut.classList.remove("is-invalid");
	return true;
}

// Validar Teléfono (admite formato chileno +569XXXXXXXX o 9XXXXXXXX)
function telefonoEsValido() {
	// Expresion regular telefono
	const regexTelefono = /^(\+?56)?9\d{8}$|^\d{9}$/;

	// Selecciona el campo del documento html
	const telefono = document.getElementById("telefono");

	// Si es invalido, lo añade a la lista negra
	if (!regexTelefono.test(telefono.value.trim())) {
		telefono.classList.add("is-invalid");
		formIsValid = false;
	}

	telefono.classList.remove("is-invalid");
	return true;
}

// Validar Correo Electrónico
function correoEsValido() {
	// Expresion regular correo
	const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	// Selecciona el campo del documento html
	const correo = document.getElementById("correo");

	// Si es invalido, lo añade a la lista negra
	if (!regexCorreo.test(correo.value.trim())) {
		correo.classList.add("is-invalid");
		return false;
	}

	correo.classList.remove("is-invalid");
	return true;
}

// VALIDACION FORMULARIO REGISTRO
const formRegistro = document.getElementById("formRegistrar");
if (formRegistro) {
	formRegistro.addEventListener("submit", function (event) {
		let formIsValid = true;

		// VALIDACION NOMBRE, APELLIDO, RUT, TELEFONO, CORREO

		// Expresion regular nombre y apellido
		// (solo letras y espacios, al menos 2 caracteres)
		const regexTexto = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]{2,}$/;

		formIsValid = nombreEsValido(regexTexto);
		formIsValid = apellidoEsValido(regexTexto);

		formIsValid = rutEsValido();
		formIsValid = telefonoEsValido();
		formIsValid = correoEsValido();
		//------------------------------------------------------
		// VALIDACION CONTRASEÑA
		// Selecciona el campo del documento html
		const password = document.getElementById("passwordRegistro");

		// Al menos: Una mayuscula, una minuscula, un número y 8 caracteres de largo
		// Se permiten los caracteres especiales: "." "_" "-"
		const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d._-]{8,}$/;

		// Compara el regex con el valor del elemento
		if (!regexPassword.test(password.value)) {
			password.classList.add("is-invalid");
			formIsValid = false;
		} else {
			password.classList.remove("is-valid");
		}
		//--------------------------------------------------------
		// VALIDACION CONFIRMACION DE CONTRASEÑA
		const passwordComfirm = document.getElementById("passwordComfirm");

		if (passwordComfirm.value != password.value) {
			passwordComfirm.classList.add("is-invalid");
			formIsValid = false;
		} else {
			passwordComfirm.classList.remove("is-valid");
		}
		//--------------------------------------------------------

		if (!formIsValid) {
			// Si hay errores, detenemos el envío
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();

			//-----------------------------------------------------
			const correoVal = document.getElementById("correoRegistro");
			const passwordVal = document.getElementById("passwordRegistro");
		}
	});
}

// VALIDACION FORMULARIO INICIO DE SESION
const formLogin = document.getElementById("formLogin");
if (formLogin) {
	formLogin.addEventListener("submit", function (event) {
		let formIsValid = true;

		formIsValid = correoEsValido();
	});
}
