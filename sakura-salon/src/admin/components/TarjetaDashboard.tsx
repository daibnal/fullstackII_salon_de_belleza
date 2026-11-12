interface Props {
	icono: string;
	titulo: string;
	valor: string;
	detalle: string;
	claseDetalle: string;
	claseValor?: string;
	iconoDetalle?: string;
}

export function TarjetaDashboard({ icono, titulo, valor, detalle, claseDetalle, claseValor, iconoDetalle }: Props) {
	return (
		<div className="sketch-card text-center">
			<i className={"bi " + icono + " card-icon"}></i>
			<h5 className="card-title-custom">{titulo}</h5>
			<div className={"card-value" + (claseValor ? " " + claseValor : "")}>{valor}</div>
			<small className={claseDetalle}>
				{iconoDetalle && <i className={"bi " + iconoDetalle}></i>}
				{iconoDetalle ? " " : ""}
				{detalle}
			</small>
		</div>
	);
}
