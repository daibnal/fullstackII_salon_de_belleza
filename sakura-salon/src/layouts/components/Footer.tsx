
export function Footer() {
    return (
        <>
            <footer className="mt-5 container-fluid p-5">
                <div className="row g-5 text-center text-md-start">
                    {/* Contacto */}
                    <div className="col-12 col-md-4">
                        <h3>Contactanos</h3>
                        <ul
                            className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-md-start gap-2">
                            <li>
                                <a
                                    href="mailto:contacto@sakurasalon.com"
                                    className="d-inline-flex align-items-center gap-2">
                                    <i className="bi bi-envelope-fill"></i> Envianos un correo
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/123456789"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-inline-flex align-items-center gap-2">
                                    <i className="bi bi-whatsapp"></i> Hablanos por WhatsApp
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Redes Sociales */}
                    <div className="col-12 col-md-4">
                        <h3>Siguenos</h3>
                        <ul
                            className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-md-start gap-2">
                            <li>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-inline-flex align-items-center gap-2">
                                    <i className="bi bi-instagram"></i> Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="d-inline-flex align-items-center gap-2">
                                    <i className="bi bi-facebook"></i> Facebook
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Politicas */}
                    <div className="col-12 col-md-4">
                        <h3>Politicas</h3>
                        <ul
                            className="list-unstyled mb-0 d-flex flex-column align-items-center align-items-md-start gap-2">
                            <li><a href="#">Términos y condiciones</a></li>
                            <li><a href="#">Política de privacidad</a></li>
                            <li><a href="#">Política de cancelación</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}