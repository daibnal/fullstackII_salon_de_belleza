interface SlideProps {
    index: number;
    imagen: string;
    alt: string;
}

export function Slide({index, imagen, alt}: SlideProps) {
    return (
        <div className={"carousel-item " + (index === 0 ? "active" : "") + " ratio ratio-1x1"}>
            <img
                src={imagen}
                alt={alt}
                className="d-block w-100" />
        </div>
    );
};