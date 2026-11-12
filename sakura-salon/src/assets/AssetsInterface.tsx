/* Si tiene un guion, reemplazenlo por camelCase
   Ejem: admin-servicios => adminServicios
   
   El src por defecto es "src/assets/" lo que viene
   despues es lo que va variando */

import logoSm from "./Logo_sm.png";

/** Ruta absoluta desde la raíz del sitio (evita 404 en rutas como /admin/...) */
export function assetSrc(ruta: string): string {
    if (ruta.startsWith("http") || ruta.startsWith("/")) {
        return ruta;
    }
    return `/${ruta.replace(/^\//, "")}`;
}

export const assets = {
    logo: {
        src: logoSm,
        alt: "Logo Sakura Salón"
    },
    adminServicios: {
        alisado: {
            src: assetSrc("src/assets/admin-servicios/alisado.png"),
            alt: ""
        },
        balayage: {
            src: assetSrc("src/assets/admin-servicios/balayage.png"),
            alt: ""
        },
        botox1: {
            src: assetSrc("src/assets/admin-servicios/botox1.png"),
            alt: ""
        },
        coloracion: {
            src: assetSrc("src/assets/admin-servicios/coloracion.png"),
            alt: ""
        },
        coloracion2: {
            src: assetSrc("src/assets/admin-servicios/coloracion2.png"),
            alt: ""
        },
        coloracion3: {
            src: assetSrc("src/assets/admin-servicios/coloracion3.png"),
            alt: ""
        },
        coreano: {
            src: assetSrc("src/assets/admin-servicios/coreano.png"),
            alt: ""
        },
        cortePuntas: {
            src: assetSrc("src/assets/admin-servicios/corte-puntas.png"),
            alt: ""
        },
        laminado: {
            src: assetSrc("src/assets/admin-servicios/laminado.png"),
            alt: ""
        }
    },
    carruselEyes: {
        lifting1: {
            src: assetSrc("src/assets/carrusel-eyes/lifting1_L.png"),
            alt: ""
        },
        lifting2: {
            src: assetSrc("src/assets/carrusel-eyes/lifting2.png"),
            alt: ""
        },
        lifting3: {
            src: assetSrc("src/assets/carrusel-eyes/lifting3_R.png"),
            alt: ""
        }
    },
    carruselHair: {
        alisado: {
            src: assetSrc("src/assets/carrusel-hair/alisado.png"),
            alt: "Vista trasera de un cabello largo, liso y brillante teñido en un tono marrón claro, peinado uniformemente en un salón de belleza"
        },
        bob: {
            src: assetSrc("src/assets/carrusel-hair/bob.png"),
            alt: "Vista trasera de un corte de pelo estilo bob corto y recto en color negro intenso, cayendo justo por encima de los hombros"
        },
        capas: {
            src: assetSrc("src/assets/carrusel-hair/capas.png"),
            alt: "Una mujer joven con cabello largo y voluminoso peinado en ondas sueltas y teñido de un color vino tinto profundo, posando en un salón de belleza"
        },
        rulos: {
            src: assetSrc("src/assets/carrusel-hair/rulos.png"),
            alt: "Un estilista con guantes negros aplica una crema de tratamiento blanca en el cabello rizado y oscuro de una clienta en un salón, con botellas de productos de fondo"
        }
    },
    carruselInicio: {
        c1_1: {
            src: assetSrc("src/assets/carrusel-inicio/c1_1.png"),
            alt: ""
        },
        c1_2: {
            src: assetSrc("src/assets/carrusel-inicio/c1_2.png"),
            alt: ""
        },
        c1_3: {
            src: assetSrc("src/assets/carrusel-inicio/c1_3.png"),
            alt: ""
        },
        c1_4: {
            src: assetSrc("src/assets/carrusel-inicio/c1_4.png"),
            alt: ""
        }
    },
    carruselNails: {
        maniRusa: {
            src: assetSrc("src/assets/carrusel-nails/mani-rusa.png"),
            alt: ""
        },
        polygel: {
            src: assetSrc("src/assets/carrusel-nails/polygel.png"),
            alt: ""
        },
        semipermanente: {
            src: assetSrc("src/assets/carrusel-nails/semipermanente.png"),
            alt: ""
        }
    }
}