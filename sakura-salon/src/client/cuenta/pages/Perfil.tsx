import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { mensajeError } from "../../../api/mensajeError";
import { Auth } from "../../../services/auth.service";
import { Reservas, type Reserva } from "../../../services/reservas.service";
import { actualizarSesion, leerSesion } from "../../../services/sesion";
import { nombreEsValido, rutEsValido, telefonoEsValido } from "../validaciones";

function horaCorta(hora: string) {
	return hora?.slice(0, 5) ?? "";
}

function pesos(valor: number) {
	return "$" + (valor ?? 0).toLocaleString("es-CL");
}

function abonoPendiente(cita: Reserva): boolean {
	return cita.estado === "PENDIENTE_PAGO";
}

function citaCancelable(cita: Reserva): boolean {
	if (cita.estado === "CANCELADA" || cita.estado === "LIBERADA" || cita.estado === "INASISTENCIA") {
		return false;
	}
	const hora = horaCorta(cita.horaInicio);
	if (!cita.fecha || !hora) return false;
	const inicio = new Date(`${cita.fecha}T${hora}:00`);
	return !Number.isNaN(inicio.getTime()) && inicio.getTime() > Date.now();
}

export function Perfil() {
	const navigate = useNavigate();
	const sesion = leerSesion();
	const [nombre, setNombre] = useState(sesion?.nombre ?? "");
	const [apellido, setApellido] = useState(sesion?.apellido ?? "");
	const [rut, setRut] = useState(sesion?.rut ?? "");
	const [telefono, setTelefono] = useState(sesion?.telefono ?? "");
	const [correo, setCorreo] = useState(sesion?.correo ?? "");
	const [citas, setCitas] = useState<Reserva[]>([]);
	const [aviso, setAviso] = useState("");
	const [ok, setOk] = useState("");
	const [cargando, setCargando] = useState(true);
	const [cancelandoId, setCancelandoId] = useState<number | null>(null);
	const [pagandoId, setPagandoId] = useState<number | null>(null);

	useEffect(() => {
		if (!sesion?.token) {
			navigate("/cuenta/login");
			return;
		}
		void Auth.sesion(sesion.token)
			.then((datos) => {
				setNombre(datos.nombre ?? "");
				setApellido(datos.apellido ?? "");
				setRut(datos.rut ?? "");
				setTelefono(datos.telefono ?? "");
				setCorreo(datos.correo ?? "");
				actualizarSesion({
					nombre: datos.nombre,
					apellido: datos.apellido,
					rut: datos.rut,
					telefono: datos.telefono,
					correo: datos.correo,
				});
			})
			.catch(() => setAviso("No se pudo cargar el perfil."))
			.finally(() => setCargando(false));
		void Reservas.mias()
			.then(setCitas)
			.catch(() => setAviso("No se pudieron cargar tus citas."));
	}, [navigate, sesion?.token]);

	function guardar(event: FormEvent) {
		event.preventDefault();
		setOk("");
		const rutLimpio = rut.trim();
		if (!nombreEsValido(nombre) || (apellido.trim() !== "" && !nombreEsValido(apellido)) || !telefonoEsValido(telefono)) {
			setAviso("Revisa el nombre y un teléfono móvil válido (ej: +56912345678).");
			return;
		}
		if (rutLimpio !== "" && !rutEsValido(rutLimpio)) {
			setAviso("Ingresa un RUT válido (ej: 12345678-9).");
			return;
		}
		setAviso("");
		void Auth.actualizarPerfil({
			nombre: nombre.trim(),
			apellido: apellido.trim(),
			telefono: telefono.trim(),
			rut: rutLimpio,
		})
			.then(() => {
				actualizarSesion({
					nombre: nombre.trim(),
					apellido: apellido.trim(),
					telefono: telefono.trim(),
					rut: rutLimpio,
				});
				setOk("Perfil actualizado.");
			})
			.catch((error: unknown) => setAviso(mensajeError(error, "No se pudo guardar el perfil.")));
	}

	function pagarAbono(id: number) {
		setAviso("");
		setOk("");
		setPagandoId(id);
		void Reservas.pagarAbono(id)
			.then(() => Reservas.mias())
			.then((lista) => {
				setCitas(lista);
				setOk("Abono pagado. Tu cita quedó confirmada.");
			})
			.catch((error: unknown) => setAviso(mensajeError(error, "No se pudo pagar el abono.")))
			.finally(() => setPagandoId(null));
	}

	function cancelarCita(id: number) {
		if (!window.confirm("¿Seguro que quieres cancelar esta cita?")) return;
		setAviso("");
		setOk("");
		setCancelandoId(id);
		void Reservas.cancelarMia(id)
			.then(() => Reservas.mias())
			.then((lista) => {
				setCitas(lista);
				setOk("Cita cancelada.");
			})
			.catch((error: unknown) => setAviso(mensajeError(error, "No se pudo cancelar la cita.")))
			.finally(() => setCancelandoId(null));
	}

	return (
		<div className="container my-4">
			<h1 className="h3 fw-bold" style={{ color: "var(--color-primary)" }}>Mi perfil</h1>
			{cargando && <p className="text-muted">Cargando perfil...</p>}
			{aviso && <p className="text-danger">{aviso}</p>}
			{ok && <p className="text-success">{ok}</p>}
			<form onSubmit={guardar} className="sketch-card p-4 mb-4">
				<div className="row g-3">
					<div className="col-md-6">
						<label className="form-label fw-bold small">Nombre</label>
						<input className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} />
					</div>
					<div className="col-md-6">
						<label className="form-label fw-bold small">Apellido</label>
						<input className="form-control" value={apellido} onChange={(event) => setApellido(event.target.value)} />
					</div>
					<div className="col-md-6">
						<label className="form-label fw-bold small">RUT</label>
						<input
							className="form-control"
							value={rut}
							placeholder="12345678-9"
							onChange={(event) => setRut(event.target.value)}
						/>
					</div>
					<div className="col-md-6">
						<label className="form-label fw-bold small">Teléfono</label>
						<input className="form-control" value={telefono} onChange={(event) => setTelefono(event.target.value)} />
					</div>
					<div className="col-md-6">
						<label className="form-label fw-bold small">Correo</label>
						<input className="form-control" value={correo} readOnly />
					</div>
				</div>
				<button className="btn btn-custom-primary mt-3" type="submit">Guardar datos</button>
			</form>

			<h2 className="h5 fw-bold">Mis citas</h2>
			<div className="sketch-card p-0 overflow-hidden">
				<table className="table mb-0">
					<thead>
						<tr>
							<th>Fecha</th>
							<th>Hora</th>
							<th>Servicio</th>
							<th>Profesional</th>
							<th>Estado</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{citas.map((cita) => (
							<tr key={cita.id}>
								<td>{cita.fecha}</td>
								<td>{horaCorta(cita.horaInicio)}</td>
								<td>{cita.nombreServicio}</td>
								<td>{cita.nombreProfesional}</td>
								<td>{cita.estado}</td>
								<td>
									<div className="d-flex flex-column align-items-start gap-1">
										{abonoPendiente(cita) && (
											<>
												<span className="small text-muted text-nowrap">
													Abono: {pesos(cita.montoAbono)}
												</span>
												<button
													type="button"
													className="btn btn-sm btn-outline-success text-nowrap"
													disabled={pagandoId !== null || cancelandoId !== null}
													onClick={() => pagarAbono(cita.id)}>
													{pagandoId === cita.id ? "Pagando..." : "Pagar abono"}
												</button>
											</>
										)}
										{citaCancelable(cita) && (
											<button
												type="button"
												className="btn btn-sm btn-outline-danger text-nowrap"
												disabled={cancelandoId !== null || pagandoId !== null}
												onClick={() => cancelarCita(cita.id)}>
												{cancelandoId === cita.id ? "Cancelando..." : "Cancelar cita"}
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
						{citas.length === 0 && (
							<tr><td colSpan={6} className="text-muted text-center py-3">Todavía no tienes citas.</td></tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
