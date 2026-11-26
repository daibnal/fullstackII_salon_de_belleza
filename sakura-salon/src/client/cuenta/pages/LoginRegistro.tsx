import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Auth } from "../../../services/auth.service";
import { borrarSesion, guardarSesion, haySesionAdmin, haySesionProfesional } from "../../../services/sesion";
import {
	apellidoEsValido,
	confirmacionPasswordEsValida,
	correoEsValido,
	mensajePasswordRegistro,
	nombreEsValido,
	passwordRegistroEsValido,
	rutEsValido,
	telefonoEsValido,
} from "../validaciones";

const REGISTRO_ERROR_RESPALDO =
	"No se pudo crear la cuenta. Revisa los datos o intenta con otro correo.";

function mensajeApiDeRegistro(error: unknown): string | null {
	if (typeof error !== "object" || error === null || !("response" in error)) {
		return null;
	}
	const data = (error as { response?: { data?: unknown } }).response?.data;
	if (typeof data === "object" && data !== null && "mensaje" in data) {
		const mensaje = (data as { mensaje?: unknown }).mensaje;
		if (typeof mensaje === "string" && mensaje.trim()) {
			return mensaje;
		}
	}
	return null;
}

function mensajeHablaDeCorreo(mensaje: string): boolean {
	return mensaje.toLowerCase().includes("correo");
}

export function CerrarSesion() {
	const navigate = useNavigate();

	useEffect(() => {
		void Auth.logout()
			.catch(() => undefined)
			.finally(() => {
				borrarSesion();
				navigate("/");
			});
	}, [navigate]);

	return null;
}

export function LoginRegistro() {
	const location = useLocation();
	const navigate = useNavigate();
	const esRegistro = location.pathname === "/cuenta/registrar";

	const [login, setLogin] = useState({
		correo: "",
		password: "",
		mantenerSesion: false,
	});
	const [loginErrores, setLoginErrores] = useState({
		correo: false,
		password: false,
	});
	const [loginErrorGeneral, setLoginErrorGeneral] = useState(false);
	const [registroError, setRegistroError] = useState("");
	const [registroErrorCorreo, setRegistroErrorCorreo] = useState("");

	const [registro, setRegistro] = useState({
		nombre: "",
		apellido: "",
		rut: "",
		telefono: "",
		correo: "",
		password: "",
		passwordConfirm: "",
	});
	const [registroErrores, setRegistroErrores] = useState({
		nombre: false,
		apellido: false,
		rut: false,
		telefono: false,
		correo: false,
		password: false,
		passwordConfirm: false,
	});
	const [registroExito, setRegistroExito] = useState(false);

	useEffect(() => {
		if (haySesionAdmin()) {
			navigate("/admin");
		} else if (haySesionProfesional()) {
			navigate("/personal");
		}
	}, [navigate]);

	const handleLoginChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { id, value, type, checked } = e.target;
		if (type === "checkbox") {
			setLogin((prev) => ({ ...prev, mantenerSesion: checked }));
			return;
		}
		const key = id === "correoLogin" ? "correo" : "password";
		setLogin((prev) => ({ ...prev, [key]: value }));
	};

	const handleLoginSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const correoOk = correoEsValido(login.correo);
		const claveOk = login.password.length > 0;
		setLoginErrores({ correo: !correoOk, password: !claveOk });
		setLoginErrorGeneral(false);

		if (!correoOk || !claveOk) {
			return;
		}

		void Auth.login(login.correo.trim(), login.password)
			.then((usuario) => {
					guardarSesion(
					{
						id: usuario.id,
						token: usuario.token,
						rol: usuario.rol,
						correo: usuario.correo,
						nombre: usuario.nombre,
						apellido: usuario.apellido,
						telefono: usuario.telefono,
						rut: usuario.rut,
					},
					login.mantenerSesion
				);
				navigate(usuario.rol === "ADMIN" ? "/admin" : usuario.rol === "PROFESIONAL" ? "/personal" : "/");
			})
			.catch(() => {
				setLoginErrorGeneral(true);
			});
	};

	const handleRegistroChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const { id, value } = e.target;
		const map: Record<string, keyof typeof registro> = {
			nombre: "nombre",
			apellido: "apellido",
			rut: "rut",
			telefono: "telefono",
			correoRegistro: "correo",
			passwordRegistro: "password",
			passwordComfirm: "passwordConfirm",
		};
		const key = map[id];
		if (key) {
			setRegistro((prev) => ({ ...prev, [key]: value }));
			if (key === "correo") {
				setRegistroErrores((prev) => ({ ...prev, correo: false }));
				setRegistroErrorCorreo("");
			}
			if (key === "password") {
				setRegistroErrores((prev) => ({ ...prev, password: false }));
			}
			if (key === "passwordConfirm") {
				setRegistroErrores((prev) => ({ ...prev, passwordConfirm: false }));
			}
		}
	};

	const handleRegistroSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setRegistroExito(false);

		const errores = {
			nombre: !nombreEsValido(registro.nombre),
			apellido: !apellidoEsValido(registro.apellido),
			rut: !rutEsValido(registro.rut),
			telefono: !telefonoEsValido(registro.telefono),
			correo: !correoEsValido(registro.correo),
			password: !passwordRegistroEsValido(registro.password),
			passwordConfirm: !confirmacionPasswordEsValida(
				registro.password,
				registro.passwordConfirm
			),
		};

		setRegistroErrores({
			...errores,
			correo: errores.correo || registroErrorCorreo !== "",
		});
		setRegistroError("");

		if (Object.values(errores).some(Boolean)) {
			return;
		}

		void Auth.registro({
			nombre: registro.nombre.trim(),
			apellido: registro.apellido.trim(),
			rut: registro.rut.trim(),
			telefono: registro.telefono.trim(),
			correo: registro.correo.trim(),
			clave: registro.password,
		})
			.then(() => {
				setRegistroExito(true);
				setRegistroError("");
				setRegistroErrorCorreo("");
				setRegistroErrores({
					nombre: false,
					apellido: false,
					rut: false,
					telefono: false,
					correo: false,
					password: false,
					passwordConfirm: false,
				});
			})
			.catch((error: unknown) => {
				setRegistroExito(false);
				const mensajeApi = mensajeApiDeRegistro(error);
				if (mensajeApi && mensajeHablaDeCorreo(mensajeApi)) {
					setRegistroError("");
					setRegistroErrorCorreo(mensajeApi);
					setRegistroErrores((prev) => ({ ...prev, correo: true }));
					return;
				}
				setRegistroError(mensajeApi ?? REGISTRO_ERROR_RESPALDO);
			});
	};

	return (
		<>
			<ul className="nav nav-pills" id="myTab" role="tablist">
				<li className="nav-item" role="presentation">
					<Link
						className={`nav-link${esRegistro ? "" : " active"}`}
						id="login-tab"
						to="/cuenta/login"
						role="tab"
						aria-selected={!esRegistro}>
						Iniciar sesión
					</Link>
				</li>
				<li className="nav-item" role="presentation">
					<Link
						className={`nav-link${esRegistro ? " active" : ""}`}
						id="signin-tab"
						to="/cuenta/registrar"
						role="tab"
						aria-selected={esRegistro}>
						Crear cuenta
					</Link>
				</li>
			</ul>

			<div className="tab-content card sketch-card" id="myTabContent">
				<div
					className={`tab-pane fade${esRegistro ? "" : " show active"}`}
					id="home"
					role="tabpanel"
					aria-labelledby="login-tab">
					<form id="formLogin" noValidate onSubmit={handleLoginSubmit}>
						<div className="my-3">
							<label htmlFor="correoLogin" className="form-label fw-bold small">
								Correo electrónico
							</label>
							<input
								type="email"
								className={`form-control${loginErrores.correo ? " is-invalid" : ""}`}
								id="correoLogin"
								placeholder="correo@ejemplo.com"
								value={login.correo}
								onChange={handleLoginChange}
							/>
							<div className="invalid-feedback">
								Ingresa un correo electrónico válido.
							</div>
						</div>

						<div className="my-3">
							<label htmlFor="passwordLogin" className="form-label fw-bold small">
								Contraseña
							</label>
							<input
								type="password"
								className={`form-control bg-white${loginErrores.password ? " is-invalid" : ""}`}
								id="passwordLogin"
								placeholder="..."
								value={login.password}
								onChange={handleLoginChange}
							/>
							<div className="invalid-feedback">Ingresa la contraseña.</div>
						</div>

						{loginErrorGeneral && (
							<p className="text-danger small text-center mb-3">
								Correo o contraseña incorrectos.
							</p>
						)}

						<div className="my-3 form-check">
							<input
								type="checkbox"
								className="form-check-input"
								id="mantenerSesion"
								checked={login.mantenerSesion}
								onChange={handleLoginChange}
							/>
							<label className="form-check-label" htmlFor="mantenerSesion">
								Mantener la sesión iniciada
							</label>
						</div>

						<div className="d-flex justify-content-center">
							<button type="submit" className="btn btn-custom-primary">
								Iniciar Sesión
							</button>
						</div>
					</form>
				</div>

				<div
					className={`tab-pane fade${esRegistro ? " show active" : ""}`}
					id="profile"
					role="tabpanel"
					aria-labelledby="signin-tab">
					<form id="formRegistrar" noValidate onSubmit={handleRegistroSubmit}>
						<div className="row">
							<div className="col-12 col-sm-6 my-3">
								<label htmlFor="nombre" className="form-label fw-bold small">
									Nombre
								</label>
								<input
									type="text"
									className={`form-control${registroErrores.nombre ? " is-invalid" : ""}`}
									id="nombre"
									placeholder="Tu nombre"
									value={registro.nombre}
									onChange={handleRegistroChange}
								/>
								<div className="invalid-feedback">
									Ingresa un nombre válido (solo letras).
								</div>
							</div>
							<div className="col-12 col-sm-6 my-3">
								<label htmlFor="apellido" className="form-label fw-bold small">
									Apellido
								</label>
								<input
									type="text"
									className={`form-control${registroErrores.apellido ? " is-invalid" : ""}`}
									id="apellido"
									placeholder="Tu apellido"
									value={registro.apellido}
									onChange={handleRegistroChange}
								/>
								<div className="invalid-feedback">
									Ingresa un apellido válido (solo letras).
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-12 col-sm-6 my-3">
								<label htmlFor="rut" className="form-label fw-bold small">
									RUT
								</label>
								<input
									type="text"
									className={`form-control${registroErrores.rut ? " is-invalid" : ""}`}
									id="rut"
									placeholder="12345678-5"
									value={registro.rut}
									onChange={handleRegistroChange}
								/>
								<div className="invalid-feedback">El RUT no es válido.</div>
							</div>
							<div className="col-12 col-sm-6 my-3">
								<label htmlFor="telefono" className="form-label fw-bold small">
									Teléfono
								</label>
								<input
									type="tel"
									className={`form-control${registroErrores.telefono ? " is-invalid" : ""}`}
									id="telefono"
									placeholder="+56912345678"
									value={registro.telefono}
									onChange={handleRegistroChange}
								/>
								<div className="invalid-feedback">
									Teléfono inválido (ej: +56991234567 o 9 dígitos).
								</div>
							</div>
						</div>

						<div className="my-3">
							<label htmlFor="correoRegistro" className="form-label fw-bold small">
								Correo electrónico
							</label>
							<input
								type="email"
								className={`form-control${registroErrores.correo ? " is-invalid" : ""}`}
								id="correoRegistro"
								placeholder="correo@ejemplo.com"
								value={registro.correo}
								onChange={handleRegistroChange}
							/>
							<div className="invalid-feedback">
								{registroErrorCorreo || "Ingresa un correo electrónico válido."}
							</div>
						</div>

						<div className="my-3">
							<label htmlFor="passwordRegistro" className="form-label fw-bold small">
								Contraseña
							</label>
							<input
								type="password"
								className={`form-control bg-white${registroErrores.password ? " is-invalid" : ""}`}
								id="passwordRegistro"
								placeholder="..."
								value={registro.password}
								onChange={handleRegistroChange}
							/>
							<div className="invalid-feedback">
								{mensajePasswordRegistro(registro.password)}
							</div>
						</div>

						<div className="my-3">
							<label htmlFor="passwordComfirm" className="form-label fw-bold small">
								Confirmación contraseña
							</label>
							<input
								type="password"
								className={`form-control bg-white${registroErrores.passwordConfirm ? " is-invalid" : ""}`}
								id="passwordComfirm"
								placeholder="..."
								value={registro.passwordConfirm}
								onChange={handleRegistroChange}
							/>
							<div className="invalid-feedback">Las contraseñas no coinciden.</div>
						</div>

						{registroExito && (
							<p className="text-success small text-center mb-3">
								Cuenta creada. Ya puedes iniciar sesión.
							</p>
						)}
						{registroError && (
							<p className="text-danger small text-center mb-3">{registroError}</p>
						)}

						<div className="d-flex justify-content-center">
							<button type="submit" className="btn btn-custom-primary">
								Crear cuenta
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}