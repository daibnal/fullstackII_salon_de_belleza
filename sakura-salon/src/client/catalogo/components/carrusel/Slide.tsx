
export function Slide(imagen: string, alt: string) {
    return (
        <>
            <div className="carousel-item ratio ratio-1x1">
                <img
                    src={imagen}
                    alt={alt}
                    className="d-block w-100" />
            </div>
        </>
    );
};