import { NavLink } from "react-router";

export interface linkProps {
    url: string;
    titulo: string;
    icono: string;
}

export function NavItem({ url, titulo, icono }: linkProps) {
    return (
        <li className="nav-item">
            <NavLink
                className={({ isActive }) =>
                    "nav-link fw-bold" + (isActive ? " active" : "")
                }
                to={url}
                end={url === "/" || url === "/admin"}>
                <i className={"bi " + icono + " me-2"}></i>
                {titulo}
            </NavLink>
        </li>
    );
}
