import type { ReactNode } from "react";

interface Props {
	abierto: boolean;
	titulo: string;
	onCerrar: () => void;
	children: ReactNode;
	dialogClass?: string;
}

export function Modal({ abierto, titulo, onCerrar, children, dialogClass }: Props) {
	if (!abierto) return null;

	return (
		<>
			<div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
				<div className={"modal-dialog modal-dialog-centered" + (dialogClass ? " " + dialogClass : "")}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title fw-bold" style={{ color: "var(--color-primary)" }}>
								{titulo}
							</h5>
							<button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
						</div>
						<div className="modal-body">{children}</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"></div>
		</>
	);
}
