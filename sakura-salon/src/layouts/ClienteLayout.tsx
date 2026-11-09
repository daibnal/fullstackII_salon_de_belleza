import { Outlet } from "react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/navigation/Navbar";

const estructura = [
	{
		titulo: "",
		links: [
			{
				url: "/",
				titulo: "Inicio",
				icono: "bi-house-door"
			}
		]
	},
	{
		titulo: "Servicios",
		links: [
			{
				url: "/catalogo/eyes",
				titulo: "Lifting y Cejas",
				icono: "bi-eye"
			},
			{
				url: "/catalogo/hair",
				titulo: "Cabello",
				icono: "bi-scissors"
			},
			{
				url: "/catalogo/nails",
				titulo: "Manicure",
				icono: "bi-brush"
			}
		]
	},
	{
		titulo: "Sesión",
		links: [
			{
				url: "/cuenta/login",
				titulo: "Iniciar sesión",
				icono: "bi-box-arrow-in-right"
			},
			{
				url: "/cuenta/logout",
				titulo: "Cerrar sesión",
				icono: "bi-box-arrow-out-left"
			},
			{
				url: "/cuenta/registrar",
				titulo: "Crear cuenta",
				icono: "bi-person-plus"
			}
		]
	}
]


export function ClienteLayout() {
    return (
        <>
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