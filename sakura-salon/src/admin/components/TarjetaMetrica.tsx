interface Props {
	icono: string;
	claseIcono: string;
	etiqueta: string;
	valor: string;
	detalle?: string;
	claseDetalle?: string;
	iconoDetalle?: string;
	claseTarjeta?: string;
	claseEtiqueta?: string;
}

export function TarjetaMetrica({
	icono,
	claseIcono,
	etiqueta,
	valor,
	detalle,
	claseDetalle,
	iconoDetalle,
	claseTarjeta,
	claseEtiqueta,
}: Props) {
	return (
		<div className={"sketch-card d-flex align-items-center p-3" + (claseTarjeta ? " " + claseTarjeta : "")}>
			<div className={"metric-icon-box me-3 " + claseIcono}>
				<i className={"bi " + icono}></i>
			</div>
			<div>
				<h6 className={claseEtiqueta ?? "text-muted mb-0 small"}>{etiqueta}</h6>
				<span className="fs-4 fw-bold text-dark">{valor}</span>
				{detalle && (
					<small className={"d-block mt-1 " + (claseDetalle ?? "")}>
						{iconoDetalle && <i className={"bi " + iconoDetalle}></i>}
						{iconoDetalle ? " " : ""}
						{detalle}
					</small>
				)}
			</div>
		</div>
	);
}
