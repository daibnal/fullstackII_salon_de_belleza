import { NavLink } from "react-router";

declare global {
    interface Window {
        bootstrap?: {
            Offcanvas: {
                getOrCreateInstance: (elemento: Element) => { hide: () => void };
            };
        };
    }
}

export interface linkProps {
    url: string;
    titulo: string;
    icono: string;
    offcanvasId?: string;
}

function cerrarDesplegable(offcanvasId?: string) {
    if (!offcanvasId) return;
    const menuFijo = document.body.classList.contains("menu-fijo")
        && window.matchMedia("(min-width: 992px)").matches;
    if (menuFijo) return;
    const panel = document.getElementById(offcanvasId);
    const offcanvas = window.bootstrap?.Offcanvas;
    if (!panel || !offcanvas) return;
    offcanvas.getOrCreateInstance(panel).hide();
}

export function NavItem({ url, titulo, icono, offcanvasId }: linkProps) {
    return (
        <li className="nav-item">
            <NavLink
                className={({ isActive }) =>
                    "nav-link fw-bold" + (isActive ? " active" : "")
                }
                to={url}
                end={url === "/" || url === "/admin" || url === "/personal"}
                onClick={() => cerrarDesplegable(offcanvasId)}>
                <i className={"bi " + icono + " me-2"}></i>
                {titulo}
            </NavLink>
        </li>
    );
}
