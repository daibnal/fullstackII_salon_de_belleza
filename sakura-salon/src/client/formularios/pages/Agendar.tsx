import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useServicios } from "../../../hooks/useServicios";
import { useProfesionales } from "../../../hooks/useProfesionales";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { Reservas, type Reserva } from "../../../services/reservas.service";
import { Auth } from "../../../services/auth.service";
import { esDomingo, mensajeFueraDeHorario, slotDentroDeHorario } from "../../../horario/horarioSalon";
import { coincideEspecialidad } from "../../../horario/especialidades";
import { actualizarSesion, leerSesion } from "../../../services/sesion";
import { clienteHttp } from "../../../api/clienteHttp";
import { mensajeError } from "../../../api/mensajeError";
import {
    nombreValido,
    rutValido,
    telefonoValido,
    correoValido,
    fechaNoAnterior,
    hoyLocal,
    slotSolapaReservas,
    MENSAJE_CITA_SOLAPADA,
} from "./validacionesCita";

interface CitaForm {
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    correo: string;
    servicioId: string;
    profesionalId: string;
    fechaCita: string;
    hora: string;
    tipoPago: "abono" | "total";
}

type FormErrors = Partial<Record<keyof CitaForm | "servicios", string>>;

type Extra = {
	key: number;
	servicioId: string;
	profesionalId: string;
	fecha: string;
	hora: string;
};

type CitaGuardada = {
	servicio: string;
	profesional: string;
	fecha: string;
	hora: string;
};

function horaCorta(hora: string) {
    return hora.slice(0, 5);
}

function detalleHorario(fecha: string, hora: string) {
    if (fecha && hora) return ` — ${fecha} a las ${horaCorta(hora)}`;
    if (fecha) return ` — ${fecha}`;
    return "";
}

function mensajeExtras(extras: Extra[]): string | undefined {
	for (const extra of extras) {
		if (extra.fecha.trim() !== "" && !fechaNoAnterior(extra.fecha)) {
			return extra.fecha < hoyLocal()
				? "La fecha de un servicio adicional no puede ser anterior al día actual."
				: "Elige una fecha válida para cada servicio adicional.";
		}
	}
	if (extras.some((extra) => (
		!extra.servicioId || !extra.profesionalId || extra.fecha.trim() === "" || extra.hora.trim() === ""
	))) {
		return "Completa el servicio, el profesional, la fecha y el horario de cada servicio adicional.";
	}
	return undefined;
}

function textoYaAgendadas(reservas: Reserva[]): string {
	return reservas
		.map((reserva) => `${reserva.nombreServicio} el ${reserva.fecha} a las ${horaCorta(reserva.horaInicio)}`)
		.join("; ");
}

function duracionDe(servicios: { id: number; duracionMinutos: number }[], servicioId: number): number {
    return servicios.find((servicio) => servicio.id === servicioId)?.duracionMinutos ?? 0;
}

function BotonHora({
	id,
	name,
	hora,
	seleccionada,
	noDisponible,
	onElegir,
}: {
	id: string;
	name: string;
	hora: string;
	seleccionada: boolean;
	noDisponible: boolean;
	onElegir: () => void;
}) {
	return (
		<div className="col-6">
			<input
				type="radio"
				className="btn-check"
				name={name}
				id={id}
				disabled={noDisponible}
				checked={!noDisponible && seleccionada}
				onChange={() => {
					if (!noDisponible) onElegir();
				}}
			/>
			<label
				className={`btn w-100 btn-sm ${noDisponible ? "hora-no-disponible" : "btn-outline-secondary"}`}
				htmlFor={id}
				title={noDisponible ? "No disponible" : undefined}
				aria-disabled={noDisponible}
			>
				{horaCorta(hora)}
			</label>
		</div>
	);
}

function SelectorExtra({
	extra,
	servicios,
	profesionales,
	citasPropias,
	onChange,
	onQuitar,
}: {
	extra: Extra;
	servicios: { id: number; nombre: string; precio: number; activo: boolean; duracionMinutos: number; categoria?: { nombre: string } }[];
	profesionales: { id: number; nombre: string; especialidad: string; activo: boolean }[];
	citasPropias: Reserva[];
	onChange: (extra: Extra) => void;
	onQuitar: () => void;
}) {
	const servicioId = Number(extra.servicioId);
	const profesionalExtra = Number(extra.profesionalId);
	const { huecos, loading: cargandoHuecos, error: errorHuecos } = useDisponibilidad(
		profesionalExtra,
		servicioId,
		extra.fecha,
	);
	const servicioExtra = servicios.find((servicio) => servicio.id === servicioId);
	const aptos = servicioExtra
		? profesionales.filter((persona) => persona.activo && coincideEspecialidad(persona.especialidad, servicioExtra.categoria?.nombre))
		: [];
	const consultaLista = Boolean(extra.servicioId && extra.profesionalId && extra.fecha);
	const duracionExtra = duracionDe(servicios, servicioId);
	const domingo = esDomingo(extra.fecha);
	const huecosVisibles = domingo
		? []
		: huecos.filter((hueco) => slotDentroDeHorario(extra.fecha, hueco.horaInicio, duracionExtra));

	return (
		<div className="border rounded p-2 mb-2">
			<div className="mb-2">
				<select
					className="form-select"
					value={extra.servicioId}
					onChange={(event) => onChange({
						...extra,
						servicioId: event.target.value,
						profesionalId: "",
						hora: "",
					})}>
					<option value="">Selecciona un servicio...</option>
					{servicios.filter((servicio) => servicio.activo).map((servicio) => (
						<option key={servicio.id} value={servicio.id}>
							{servicio.nombre} (${servicio.precio.toLocaleString("es-CL")})
						</option>
					))}
				</select>
			</div>
			<div className="d-flex gap-2 mb-2">
				<select
					className="form-select"
					value={extra.profesionalId}
					disabled={!servicioId}
					onChange={(event) => onChange({ ...extra, profesionalId: event.target.value, hora: "" })}>
					<option value="">{!servicioId ? "Primero elige un servicio" : "Profesional"}</option>
					{aptos.map((persona) => (
						<option key={persona.id} value={persona.id}>{persona.nombre}</option>
					))}
				</select>
				<button type="button" className="btn btn-outline-danger" onClick={onQuitar}>Quitar</button>
			</div>
			<div className="mb-2">
				<label htmlFor={`fecha-extra-${extra.key}`} className="form-label fw-bold small">Fecha de este servicio</label>
				<input
					type="date"
					className="form-control"
					id={`fecha-extra-${extra.key}`}
					min={hoyLocal()}
					value={extra.fecha}
					onChange={(event) => onChange({ ...extra, fecha: event.target.value, hora: "" })}
				/>
			</div>
			<div>
				<label className="form-label fw-bold small d-block">Horarios disponibles</label>
				{domingo && <p className="text-muted small mb-1">El domingo el salón está cerrado.</p>}
				{!domingo && cargandoHuecos && <p className="text-muted small mb-1">Buscando horarios...</p>}
				{!domingo && errorHuecos && <p className="text-danger small mb-1">No se pudo consultar la disponibilidad.</p>}
				{!domingo && !cargandoHuecos && consultaLista && huecosVisibles.length === 0 && (
					<p className="text-muted small mb-1">No hay horarios libres para esa combinación.</p>
				)}
				<div className="row g-2">
					{huecosVisibles.map((hueco) => (
						<BotonHora
							key={hueco.horaInicio}
							id={`extra-${extra.key}-h-${hueco.horaInicio}`}
							name={`hora-extra-${extra.key}`}
							hora={hueco.horaInicio}
							seleccionada={extra.hora === hueco.horaInicio}
							noDisponible={slotSolapaReservas(extra.fecha, hueco.horaInicio, duracionExtra, citasPropias)}
							onElegir={() => onChange({ ...extra, hora: hueco.horaInicio })}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

export function AgendarCita() {
    const navigate = useNavigate();
    const { servicios, loading: cargandoServicios, error: errorServicios } = useServicios();
    const { profesionales, loading: cargandoProfesionales, error: errorProfesionales } = useProfesionales();
    const [formData, setFormData] = useState<CitaForm>(() => {
        const guardada = leerSesion();
        const cliente = guardada?.rol === "CLIENTE" ? guardada : null;
        return {
            nombre: cliente?.nombre ?? "",
            apellido: cliente?.apellido ?? "",
            rut: cliente?.rut ?? "",
            telefono: cliente?.telefono ?? "",
            correo: cliente?.correo ?? "",
            servicioId: "",
            profesionalId: "",
            fechaCita: "",
            hora: "",
            tipoPago: "abono",
        };
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [servicioFijo, setServicioFijo] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [errorEnvio, setErrorEnvio] = useState("");
	const [porcentajeAbono, setPorcentajeAbono] = useState(50);
	const [extras, setExtras] = useState<Extra[]>([]);
	const [claveExtra, setClaveExtra] = useState(1);
	const [primeraYaReservada, setPrimeraYaReservada] = useState(false);
	const [citasPropias, setCitasPropias] = useState<Reserva[]>([]);
	const sesion = leerSesion();
	const clienteLogueado = sesion?.rol === "CLIENTE";

    const servicioId = Number(formData.servicioId);
    const profesionalId = Number(formData.profesionalId);
    const { huecos, loading: cargandoHuecos, error: errorHuecos } = useDisponibilidad(
        profesionalId,
        servicioId,
        formData.fechaCita
    );

    const servicioActual = servicios.find((servicio) => servicio.id === servicioId);
    const profesionalesDelServicio = servicioActual
        ? profesionales.filter((persona) => persona.activo && coincideEspecialidad(persona.especialidad, servicioActual.categoria?.nombre))
        : [];
    const domingo = esDomingo(formData.fechaCita);
    const huecosVisibles = domingo
        ? []
        : huecos.filter((hueco) => slotDentroDeHorario(formData.fechaCita, hueco.horaInicio, servicioActual?.duracionMinutos ?? 0));

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const fechaUrl = params.get("fecha");
        const servicioUrl = params.get("servicioId");
        if (servicioUrl) {
            setServicioFijo(true);
        }
        setFormData((prev) => ({
            ...prev,
            ...(fechaUrl && fechaNoAnterior(fechaUrl) ? { fechaCita: fechaUrl } : {}),
            ...(servicioUrl ? { servicioId: servicioUrl, profesionalId: "", hora: "" } : {}),
        }));
    }, []);

	useEffect(() => {
		if (!clienteLogueado) {
			setCitasPropias([]);
			return;
		}
		let vigente = true;
		void Reservas.mias()
			.then((lista) => {
				if (vigente) setCitasPropias(lista);
			})
			.catch(() => {
				if (vigente) setCitasPropias([]);
			});
		return () => {
			vigente = false;
		};
	}, [clienteLogueado]);

	useEffect(() => {
		if (!clienteLogueado || !sesion?.token) return;
		const rutSesion = sesion.rut?.trim() ?? "";
		if (rutSesion) {
			setFormData((prev) => (prev.rut.trim() ? prev : { ...prev, rut: rutSesion }));
		}
		void Auth.sesion(sesion.token)
			.then((datos) => {
				const rutPerfil = datos.rut?.trim() || rutSesion;
				actualizarSesion({
					nombre: datos.nombre,
					apellido: datos.apellido,
					correo: datos.correo,
					telefono: datos.telefono,
					...(rutPerfil ? { rut: rutPerfil } : {}),
				});
				setFormData((prev) => ({
					...prev,
					nombre: datos.nombre ?? prev.nombre,
					apellido: datos.apellido ?? "",
					rut: rutPerfil || prev.rut,
					correo: datos.correo ?? prev.correo,
					telefono: datos.telefono ?? prev.telefono,
				}));
			})
			.catch(() => undefined);
	}, [clienteLogueado, sesion?.token, sesion?.rut]);

	useEffect(() => {
		void clienteHttp.get<{ porcentajeAbono?: number }>("configuracion/vigente")
            .then(({ data }) => {
                if (data.porcentajeAbono && data.porcentajeAbono > 0) {
                    setPorcentajeAbono(data.porcentajeAbono);
                }
            })
            .catch(() => undefined);
    }, []);

    const clearError = (field: keyof CitaForm) => {
        if (errors[field]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
            ...(id === "servicioId" ? { profesionalId: "", hora: "" } : {}),
            ...(id === "profesionalId" || id === "fechaCita" ? { hora: "" } : {}),
        }));
        clearError(id as keyof CitaForm);
    };

    const handleHoraChange = (hora: string) => {
        setPrimeraYaReservada(false);
        setFormData((prev) => ({ ...prev, hora }));
        clearError("hora");
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        const omitirPrimera = primeraYaReservada && formData.hora.trim() === "";

        if (!nombreValido(formData.nombre)) {
            newErrors.nombre = "Ingresa un nombre válido (solo letras, mínimo 2 caracteres).";
        }
        if (!nombreValido(formData.apellido)) {
            newErrors.apellido = "Ingresa un apellido válido (solo letras, mínimo 2 caracteres).";
        }
        if (!rutValido(formData.rut)) {
            newErrors.rut = "Ingresa un RUT válido (ej: 12345678-9).";
        }
        if (!telefonoValido(formData.telefono)) {
            newErrors.telefono = "Ingresa un teléfono móvil válido (ej: +56912345678).";
        }
        if (!correoValido(formData.correo)) {
            newErrors.correo = "Ingresa un correo electrónico válido.";
        }
        if (!omitirPrimera) {
            if (!formData.servicioId) {
                newErrors.servicioId = "Selecciona un servicio.";
            }
            if (!formData.profesionalId) {
                newErrors.profesionalId = "Selecciona un profesional.";
            }
            if (!fechaNoAnterior(formData.fechaCita)) {
                newErrors.fechaCita =
                    formData.fechaCita.trim() !== "" && formData.fechaCita < hoyLocal()
                        ? "La fecha no puede ser anterior al día actual."
                        : "Elige una fecha válida.";
            }
            const duracion = duracionDe(servicios, servicioId);
            if (formData.hora.trim() === "") {
                newErrors.hora = domingo
                    ? "El domingo el salón está cerrado."
                    : "Selecciona un horario disponible.";
            } else if (!slotDentroDeHorario(formData.fechaCita, formData.hora, duracion)) {
                newErrors.hora = mensajeFueraDeHorario(formData.fechaCita);
            } else if (slotSolapaReservas(
                formData.fechaCita,
                formData.hora,
                duracion,
                citasPropias,
            )) {
                newErrors.hora = MENSAJE_CITA_SOLAPADA;
            }
        } else if (extras.length === 0) {
            newErrors.hora = "Selecciona un horario disponible.";
        }
        const extraFuera = extras.find((extra) => extra.hora.trim() !== "" && !slotDentroDeHorario(
            extra.fecha,
            extra.hora,
            duracionDe(servicios, Number(extra.servicioId)),
        ));
        const extraSolapada = extras.some((extra) => extra.hora.trim() !== "" && slotSolapaReservas(
            extra.fecha,
            extra.hora,
            duracionDe(servicios, Number(extra.servicioId)),
            citasPropias,
        ));
        const errorServicios = extraFuera
            ? mensajeFueraDeHorario(extraFuera.fecha)
            : extraSolapada
                ? MENSAJE_CITA_SOLAPADA
                : mensajeExtras(extras);
        if (errorServicios) {
            newErrors.servicios = errorServicios;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorEnvio("");
        if (!validateForm()) {
            return;
        }

        const omitirPrimera = primeraYaReservada && formData.hora.trim() === "";
        const filas: { servicioId: number; profesionalId: number; fecha: string; hora: string }[] = [];
        if (!omitirPrimera) {
            filas.push({
                servicioId,
                profesionalId,
                fecha: formData.fechaCita,
                hora: formData.hora,
            });
        }
        for (const extra of extras) {
            filas.push({
                servicioId: Number(extra.servicioId),
                profesionalId: Number(extra.profesionalId),
                fecha: extra.fecha,
                hora: extra.hora,
            });
        }

        setEnviando(true);
        const datosCliente = {
            nombre: formData.nombre.trim(),
            apellido: formData.apellido.trim(),
            correo: formData.correo.trim(),
            telefono: formData.telefono.trim(),
        };
        const extrasAlEnviar = extras;
        void (async () => {
            const hechas: Reserva[] = [];
            try {
                for (let indice = 0; indice < filas.length; indice++) {
                    const fila = filas[indice];
                    const cuerpo = {
                        ...datosCliente,
                        servicioId: fila.servicioId,
                        profesionalId: fila.profesionalId,
                        fecha: fila.fecha,
                        horaInicio: fila.hora,
                    };
                    try {
                        if (slotSolapaReservas(fila.fecha, fila.hora, duracionDe(servicios, fila.servicioId), [...citasPropias, ...hechas])) {
                            throw new Error(MENSAJE_CITA_SOLAPADA);
                        }
                        const resultado = await (clienteLogueado ? Reservas.crear(cuerpo) : Reservas.crearInvitado(cuerpo));
                        hechas.push(resultado.reserva);
                    } catch (error: unknown) {
                        const base = error instanceof Error && error.message === MENSAJE_CITA_SOLAPADA
                            ? MENSAJE_CITA_SOLAPADA
                            : mensajeError(error, "No se pudo agendar la cita. Revisa el horario o intenta de nuevo.");
                        setErrorEnvio(hechas.length > 0 ? `${base} Ya quedaron agendadas: ${textoYaAgendadas(hechas)}.` : base);
                        if (!omitirPrimera && indice === 0) {
                            setFormData((prev) => ({ ...prev, hora: "" }));
                        } else if (indice > 0) {
                            const desde = omitirPrimera ? indice : indice - 1;
                            setExtras(extrasAlEnviar.slice(desde));
                            if (!omitirPrimera) {
                                setPrimeraYaReservada(true);
                                setFormData((prev) => ({ ...prev, hora: "" }));
                            }
                        }
                        return;
                    }
                }

                const primera = hechas[0];
                const citas: CitaGuardada[] = hechas.map((reserva) => ({
                    servicio: reserva.nombreServicio,
                    profesional: reserva.nombreProfesional,
                    fecha: reserva.fecha,
                    hora: horaCorta(reserva.horaInicio),
                }));
                const montoTotal = hechas.reduce((suma, reserva) => suma + reserva.montoTotal, 0);
                const montoAbono = hechas.reduce((suma, reserva) => suma + reserva.montoAbono, 0);
                const firstCita = {
                    nombre: primera.nombreCliente,
                    apellido: "",
                    servicio: primera.nombreServicio,
                    profesional: primera.nombreProfesional,
                    fecha: primera.fecha,
                    hora: horaCorta(primera.horaInicio),
                    correo: primera.correoCliente,
                    montoTotal,
                    montoAbono,
                    estado: primera.estado,
                    tipoPago: formData.tipoPago,
                    montoSeleccionado: formData.tipoPago === "abono" ? montoAbono : montoTotal,
                };
                sessionStorage.setItem("detallesCita", JSON.stringify({ ...firstCita, citas }));
                navigate("/agendar/confirmacion");
            } finally {
                setEnviando(false);
            }
        })();
    };

    const profesionalNombre = profesionales.find((persona) => persona.id === profesionalId)?.nombre;
	const serviciosElegidos = [
		servicioActual,
		...extras.map((extra) => servicios.find((servicio) => servicio.id === Number(extra.servicioId))),
	].filter((servicio) => servicio !== undefined);
    const precio = serviciosElegidos.reduce((suma, servicio) => suma + servicio.precio, 0);
    const montoAbono = Math.round(precio * porcentajeAbono / 100);
    const montoSeleccionado = formData.tipoPago === "abono" ? montoAbono : precio;
    const lineasResumen = [
        ...(servicioActual ? [{
            key: "principal",
            nombre: servicioActual.nombre,
            profesional: profesionalNombre ?? "",
            fecha: formData.fechaCita,
            hora: formData.hora,
        }] : []),
        ...extras.flatMap((extra) => {
            const servicio = servicios.find((item) => item.id === Number(extra.servicioId));
            if (!servicio) return [];
            const profesional = profesionales.find((persona) => persona.id === Number(extra.profesionalId));
            return [{
                key: `extra-${extra.key}`,
                nombre: servicio.nombre,
                profesional: profesional?.nombre ?? "",
                fecha: extra.fecha,
                hora: extra.hora,
            }];
        }),
    ];

    const elegirPago = (tipoPago: "abono" | "total") => {
        setFormData((prev) => ({ ...prev, tipoPago }));
    };

    return (
        <main className="container my-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card sketch-card p-4 shadow-sm">
                        <div className="text-center mb-4">
                            <h1 className="h3 fw-bold" style={{ color: "var(--color-primary)" }}>
                                Reserva tu Cita
                            </h1>
                            <p className="text-muted small">
								{clienteLogueado
									? "Tus datos de perfil ya están completos. Solo confirma el RUT y los servicios."
									: "Completa los datos. No necesitas crear una cuenta."}
							</p>
                        </div>

                        {(errorServicios || errorProfesionales) && (
                            <p className="text-danger small">No se pudo cargar el catálogo o el equipo.</p>
                        )}

                        <form id="formAgendar" onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold small">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                                        id="nombre"
                                        required
                                        placeholder="Tu nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        readOnly={clienteLogueado}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="apellido" className="form-label fw-bold small">Apellido</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                                        id="apellido"
                                        required
                                        placeholder="Tu apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        readOnly={clienteLogueado}
                                    />
                                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="rut" className="form-label fw-bold small">RUT</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.rut ? "is-invalid" : ""}`}
                                        id="rut"
                                        required
                                        placeholder="12345678-9"
                                        value={formData.rut}
                                        onChange={handleChange}
                                    />
                                    {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
                                </div>
                                <div className="col-12 col-sm-6 mb-3">
                                    <label htmlFor="telefono" className="form-label fw-bold small">Teléfono</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                                        id="telefono"
                                        required
                                        placeholder="+56912345678"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        readOnly={clienteLogueado}
                                    />
                                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="correo" className="form-label fw-bold small">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                                    id="correo"
                                    required
                                    placeholder="correo@ejemplo.com"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    readOnly={clienteLogueado}
                                />
                                {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="servicioId" className="form-label fw-bold small">Servicio</label>
                                {servicioFijo ? (
                                    <input
                                        id="servicioId"
                                        className="form-control"
                                        readOnly
                                        value={servicioActual
                                            ? `${servicioActual.nombre} ($${servicioActual.precio.toLocaleString("es-CL")})`
                                            : (cargandoServicios ? "Cargando..." : "Servicio seleccionado")}
                                    />
                                ) : (
                                    <select
                                        className={`form-select ${errors.servicioId ? "is-invalid" : ""}`}
                                        id="servicioId"
                                        value={formData.servicioId}
                                        onChange={handleChange}
                                    >
                                        <option value="">{cargandoServicios ? "Cargando..." : "Selecciona un servicio..."}</option>
                                        {servicios.filter((servicio) => servicio.activo).map((servicio) => (
                                            <option key={servicio.id} value={servicio.id}>
                                                {servicio.nombre} (${servicio.precio.toLocaleString("es-CL")})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {errors.servicioId && <div className="invalid-feedback d-block">{errors.servicioId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="profesionalId" className="form-label fw-bold small">Profesional</label>
                                <select
                                    className={`form-select ${errors.profesionalId ? "is-invalid" : ""}`}
                                    id="profesionalId"
                                    value={formData.profesionalId}
                                    onChange={handleChange}
                                    disabled={!servicioId || cargandoProfesionales}
                                >
                                    <option value="">
                                        {!servicioId
                                            ? "Primero elige un servicio"
                                            : cargandoProfesionales
                                                ? "Cargando..."
                                                : profesionalesDelServicio.length === 0
                                                    ? "Nadie realiza este servicio"
                                                    : "Selecciona un profesional..."}
                                    </option>
                                    {profesionalesDelServicio.map((persona) => (
                                        <option key={persona.id} value={persona.id}>{persona.nombre}</option>
                                    ))}
                                </select>
                                {errors.profesionalId && <div className="invalid-feedback">{errors.profesionalId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="fechaCita" className="form-label fw-bold small">Fecha de este servicio</label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.fechaCita ? "is-invalid" : ""}`}
                                    id="fechaCita"
                                    min={hoyLocal()}
                                    required
                                    value={formData.fechaCita}
                                    onChange={handleChange}
                                />
                                {errors.fechaCita && <div className="invalid-feedback">{errors.fechaCita}</div>}
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small d-block">Horarios Disponibles</label>
                                {primeraYaReservada && formData.hora.trim() === "" && (
                                    <p className="text-muted small">Esta cita ya quedó agendada. Si dejas el horario vacío, no se crea otra.</p>
                                )}
                                {domingo && formData.fechaCita && (
                                    <p className="text-muted small">El domingo el salón está cerrado.</p>
                                )}
                                {!domingo && cargandoHuecos && <p className="text-muted small">Buscando horarios...</p>}
                                {!domingo && errorHuecos && <p className="text-danger small">No se pudo consultar la disponibilidad.</p>}
                                {!domingo && !cargandoHuecos && formData.servicioId && formData.profesionalId && formData.fechaCita && huecosVisibles.length === 0 && (
                                    <p className="text-muted small">No hay horarios libres para esa combinación.</p>
                                )}
                                <div className={`row g-2 ${errors.hora ? "is-invalid" : ""}`}>
                                    {huecosVisibles.map((hueco) => (
                                        <BotonHora
                                            key={hueco.horaInicio}
                                            id={`h-${hueco.horaInicio}`}
                                            name="hora"
                                            hora={hueco.horaInicio}
                                            seleccionada={formData.hora === hueco.horaInicio}
                                            noDisponible={slotSolapaReservas(
                                                formData.fechaCita,
                                                hueco.horaInicio,
                                                servicioActual?.duracionMinutos ?? 0,
                                                citasPropias,
                                            )}
                                            onElegir={() => handleHoraChange(hueco.horaInicio)}
                                        />
                                    ))}
                                </div>
                                {errors.hora && (
                                    <div className="invalid-feedback d-block">{errors.hora}</div>
                                )}
                            </div>

							<div className="mb-3">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<label className="form-label fw-bold small mb-0">Servicios adicionales</label>
									<button
										type="button"
										className="btn btn-sm btn-outline-secondary"
										onClick={() => {
											setExtras((prev) => [...prev, {
												key: claveExtra,
												servicioId: "",
												profesionalId: "",
												fecha: "",
												hora: "",
											}]);
											setClaveExtra((valor) => valor + 1);
										}}>
										Agregar servicio
									</button>
								</div>
								<p className="text-muted small">Cada servicio tiene su propia fecha y hora.</p>
								{extras.map((extra) => (
									<SelectorExtra
										key={extra.key}
										extra={extra}
										servicios={servicios}
										profesionales={profesionales}
										citasPropias={citasPropias}
										onChange={(actualizada) => setExtras((prev) => prev.map((item) => item.key === actualizada.key ? actualizada : item))}
										onQuitar={() => setExtras((prev) => prev.filter((item) => item.key !== extra.key))}
									/>
								))}
								{errors.servicios && <div className="text-danger small">{errors.servicios}</div>}
							</div>

                            <div className="summary-box mb-4 p-3 border rounded bg-light">
                                <h6 className="fw-bold mb-3" style={{ color: "var(--color-primary)" }}>
                                    <i className="bi bi-stars"></i> Resumen de tu cita
                                </h6>
                                <div className="row small text-muted">
                                    <div className="col-sm-6">
                                        <p className="mb-1"><strong>Servicios:</strong></p>
                                        {lineasResumen.length === 0 ? (
                                            <p className="mb-1">No seleccionado</p>
                                        ) : (
                                            <ul className="mb-1 ps-3">
                                                {lineasResumen.map((linea) => (
                                                    <li key={linea.key}>
                                                        {linea.nombre}
                                                        {linea.profesional ? ` con ${linea.profesional}` : ""}
                                                        {detalleHorario(linea.fecha, linea.hora)}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="col-sm-6 border-start-sm ps-sm-3 mt-2 mt-sm-0">
                                        <p className="mb-1 text-uppercase text-secondary" style={{ fontSize: "0.75rem" }}>Valor del servicio</p>
                                        <h4 className="fw-bold text-dark mb-2">$ {precio.toLocaleString("es-CL")}</h4>
                                        <div className="p-2 rounded bg-white border mb-2">
                                            Abono ({porcentajeAbono}%): <strong>$ {montoAbono.toLocaleString("es-CL")}</strong>
                                        </div>
                                        <p className="mb-0">
                                            <strong>Vas a dejar:</strong> $ {montoSeleccionado.toLocaleString("es-CL")}
                                            {" "}({formData.tipoPago === "abono" ? `abono del ${porcentajeAbono}%` : "pago total"})
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold mb-3">
                                    <i className="bi bi-credit-card"></i> Método de pago
                                </label>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="tipoPago"
                                            id="abono"
                                            checked={formData.tipoPago === "abono"}
                                            onChange={() => elegirPago("abono")}
                                        />
                                        <label className="payment-card h-100 d-block p-3 border rounded" htmlFor="abono" style={{ cursor: "pointer" }}>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-cash-stack fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Abonar ({porcentajeAbono}%)</span>
                                            </div>
                                            <p className="text-muted small mb-0">
                                                Dejas el {porcentajeAbono}% ahora y el resto el día de tu cita.
                                            </p>
                                        </label>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="tipoPago"
                                            id="total"
                                            checked={formData.tipoPago === "total"}
                                            onChange={() => elegirPago("total")}
                                        />
                                        <label className="payment-card h-100 d-block p-3 border rounded" htmlFor="total" style={{ cursor: "pointer" }}>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-credit-card-2-front fs-4 me-2 text-secondary"></i>
                                                <span className="fw-bold">Pagar el total</span>
                                            </div>
                                            <p className="text-muted small mb-0">
                                                Selecciona el pago completo de tu cita.
                                            </p>
                                        </label>
                                    </div>
                                </div>
                                <p className="text-muted small mt-2 mb-0">
                                    La cita queda pendiente de pago. El salón registra el abono o el total en la agenda.
                                </p>
                            </div>

                            {errorEnvio && <p className="text-danger small text-center">{errorEnvio}</p>}

                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-custom-primary w-100 py-2" disabled={enviando}>
                                    {enviando ? "Agendando..." : "Confirmar cita"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
