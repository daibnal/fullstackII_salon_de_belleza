import { Link } from "react-router";

export interface linkProps {
    url: string;
    titulo: string;
    icono: string;
}

export function NavItem({url, titulo, icono}: linkProps) {
    return (
        <li className="nav-item">
            <Link
                className="nav-link fw-bold"
                to={url}>
                <i className={"bi " + icono  + " me-2"}></i>{titulo}
            </Link>
        </li>
    );
};