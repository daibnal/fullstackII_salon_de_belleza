import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/navigation/Navbar";
import { leerSesion } from "../services/sesion";
import { ScrollAlInicio } from "./ScrollAlInicio";

export function ClienteLayout() {
	useLocation();
	useEffect(() => {
		document.body.classList.add("cliente");
		return () => {
			document.body.classList.remove("cliente");
		};
	}, []);
	const sesion = leerSesion();
	const enlacesSesion = sesion
		? [
			{ url: "/cuenta/perfil", titulo: `Hola, ${sesion.nombre}`, icono: "bi-person" },
			{ url: "/cuenta/logout", titulo: "Cerrar sesión", icono: "bi-box-arrow-out-left" },
		]
		: [
			{ url: "/cuenta/login", titulo: "Iniciar sesión", icono: "bi-box-arrow-in-right" },
			{ url: "/cuenta/registrar", titulo: "Crear cuenta", icono: "bi-person-plus" },
		];
	const estructura = [
		{
			titulo: "",
			enlaces: [
				{ url: "/", titulo: "Inicio", icono: "bi-house-door" },
			],
		},
		{
			titulo: "Servicios",
			enlaces: [
				{ url: "/catalogo/3", titulo: "Lifting y Cejas", icono: "bi-eye" },
				{ url: "/catalogo/1", titulo: "Cabello", icono: "bi-scissors" },
				{ url: "/catalogo/2", titulo: "Manicure", icono: "bi-brush" },
			],
		},
		{
			titulo: "Sesión",
			enlaces: enlacesSesion,
		},
	];

    return (
        <>
            <ScrollAlInicio />
            <header>
                <Navbar estructura={estructura}/>
            </header>
            <main className="main-container">
                <Outlet>
                </Outlet>
            </main>
            <Footer/>
        </>
    );
}