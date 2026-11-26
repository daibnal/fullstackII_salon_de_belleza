import { useEffect } from "react";
import { useLocation } from "react-router";

/** Al cambiar de página, el documento vuelve arriba. El menú fijo del admin no se desplaza. */
export function ScrollAlInicio() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}
