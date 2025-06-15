import React, { useState } from 'react';
import './Carousel.css';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    React.useEffect(()=>{
        const interval = setInterval(()=>{
            nextSlide();
        },3000)
        return () => clearInterval(interval);
    },[images.length])

    return (
        <div className="carousel">
            <div className="carousel-image">
                {images.length > 0 ? (
                    <img src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
                ) : (
                    <div>No images</div>
                )}
            </div>
        </div>
    );
};

export default Carousel;