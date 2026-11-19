import logoSm from "./Logo_sm.png";

import alisadoAdmin from "./admin-servicios/alisado.png";
import balayage from "./admin-servicios/balayage.png";
import botox1 from "./admin-servicios/botox1.png";
import coloracion from "./admin-servicios/coloracion.png";
import coloracion2 from "./admin-servicios/coloracion2.png";
import coloracion3 from "./admin-servicios/coloracion3.png";
import coreano from "./admin-servicios/coreano.png";
import cortePuntas from "./admin-servicios/corte-puntas.png";
import laminado from "./admin-servicios/laminado.png";
import perfilado from "./admin-servicios/perfilado.png";
import tradicional from "./admin-servicios/tradicional.png";

import lifting1 from "./carrusel-eyes/lifting1_L.png";
import lifting2 from "./carrusel-eyes/lifting2.png";
import lifting3 from "./carrusel-eyes/lifting3_R.png";

import alisadoHair from "./carrusel-hair/alisado.png";
import bob from "./carrusel-hair/bob.png";
import capas from "./carrusel-hair/capas.png";
import rulos from "./carrusel-hair/rulos.png";

import c1_1 from "./carrusel-inicio/c1_1.png";
import c1_2 from "./carrusel-inicio/c1_2.png";
import c1_3 from "./carrusel-inicio/c1_3.png";
import c1_4 from "./carrusel-inicio/c1_4.png";

import maniRusa from "./carrusel-nails/mani-rusa.png";
import polygel from "./carrusel-nails/polygel.png";
import retiro from "./carrusel-nails/retiro.png";
import semipermanente from "./carrusel-nails/semipermanente.png";

import fachada from "./inicio-acerca-de/fachada_salon.png";
import interior from "./inicio-acerca-de/interior_salon.png";
import mapa from "./inicio-acerca-de/mapa_salon.png";

import cabelloInicio from "./inicio-servicios/cabello_inicio.png";
import liftingInicio from "./inicio-servicios/lifting_inicio.png";
import unasInicio from "./inicio-servicios/unas_inicio.png";

export const assets = {
	logo: {
		src: logoSm,
		alt: "Logo Sakura Salón",
	},
	adminServicios: {
		alisado: { src: alisadoAdmin, alt: "Alisado" },
		balayage: { src: balayage, alt: "Balayage" },
		botox1: { src: botox1, alt: "Botox capilar" },
		coloracion: { src: coloracion, alt: "Coloración" },
		coloracion2: { src: coloracion2, alt: "Coloración" },
		coloracion3: { src: coloracion3, alt: "Coloración" },
		coreano: { src: coreano, alt: "Lifting coreano" },
		cortePuntas: { src: cortePuntas, alt: "Corte de puntas" },
		laminado: { src: laminado, alt: "Laminado de cejas" },
		perfilado: { src: perfilado, alt: "Perfilado de cejas" },
		tradicional: { src: tradicional, alt: "Lifting tradicional" },
	},
	carruselEyes: {
		lifting1: { src: lifting1, alt: "Lifting de pestañas" },
		lifting2: { src: lifting2, alt: "Lifting de pestañas" },
		lifting3: { src: lifting3, alt: "Lifting de pestañas" },
	},
	carruselHair: {
		alisado: {
			src: alisadoHair,
			alt: "Vista trasera de un cabello largo, liso y brillante teñido en un tono marrón claro, peinado uniformemente en un salón de belleza",
		},
		bob: {
			src: bob,
			alt: "Vista trasera de un corte de pelo estilo bob corto y recto en color negro intenso, cayendo justo por encima de los hombros",
		},
		capas: {
			src: capas,
			alt: "Una mujer joven con cabello largo y voluminoso peinado en ondas sueltas y teñido de un color vino tinto profundo, posando en un salón de belleza",
		},
		rulos: {
			src: rulos,
			alt: "Un estilista con guantes negros aplica una crema de tratamiento blanca en el cabello rizado y oscuro de una clienta en un salón, con botellas de productos de fondo",
		},
	},
	carruselInicio: {
		c1_1: { src: c1_1, alt: "Masaje hidratación" },
		c1_2: { src: c1_2, alt: "" },
		c1_3: { src: c1_3, alt: "" },
		c1_4: { src: c1_4, alt: "" },
	},
	carruselNails: {
		maniRusa: { src: maniRusa, alt: "Manicure rusa" },
		polygel: { src: polygel, alt: "Polygel" },
		retiro: { src: retiro, alt: "Retiro de esmalte" },
		semipermanente: { src: semipermanente, alt: "Esmaltado permanente" },
	},
	inicioAcercaDe: {
		fachadaSalon: { src: fachada, alt: "Fachada del salón" },
		interiorSalon: { src: interior, alt: "Interior del salón" },
		mapaSalon: { src: mapa, alt: "Mapa del salón" },
	},
	inicioServicios: {
		cabello: { src: cabelloInicio, alt: "Cabello" },
		lifting: { src: liftingInicio, alt: "Lifting y cejas" },
		unas: { src: unasInicio, alt: "Manicure" },
	},
};

function normalizar(nombre: string) {
	return nombre
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
}

/** Misma foto que usa admin_servicios.html para cada servicio. */
export function imagenDeServicio(nombre: string) {
	const texto = normalizar(nombre);
	const tabla: Array<[string, string]> = [
		["botox", assets.adminServicios.botox1.src],
		["alisado", assets.adminServicios.alisado.src],
		["coloracion", assets.adminServicios.coloracion3.src],
		["corte", assets.adminServicios.cortePuntas.src],
		["balayage", assets.adminServicios.balayage.src],
		["masaje", assets.carruselInicio.c1_1.src],
		["hidrat", assets.carruselInicio.c1_1.src],
		["retiro", assets.carruselNails.retiro.src],
		["polygel", assets.carruselNails.polygel.src],
		["rusa", assets.carruselNails.maniRusa.src],
		["esmalt", assets.carruselNails.semipermanente.src],
		["tradicional", assets.adminServicios.tradicional.src],
		["coreano", assets.adminServicios.coreano.src],
		["perfilado", assets.adminServicios.perfilado.src],
		["laminado", assets.adminServicios.laminado.src],
	];
	return tabla.find(([clave]) => texto.includes(clave))?.[1] ?? assets.logo.src;
}

/** Foto de la tarjeta de categoría en el inicio, como index.html. */
export function imagenDeCategoria(nombre: string) {
	const texto = normalizar(nombre);
	if (texto.includes("cabello") || texto.includes("hair")) {
		return assets.inicioServicios.cabello.src;
	}
	if (texto.includes("una") || texto.includes("mani") || texto.includes("nail")) {
		return assets.inicioServicios.unas.src;
	}
	if (texto.includes("ojo") || texto.includes("lift") || texto.includes("ceja") || texto.includes("pesta")) {
		return assets.inicioServicios.lifting.src;
	}
	return assets.logo.src;
}
