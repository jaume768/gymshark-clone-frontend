import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './css/WinterArcSection.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WinterArcSection = () => {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchInviernoProducts = async () => {
            try {
                const res = await api.get('/products', {
                    params: { category: 'INVIERNO' }
                });
                setProducts(res.data);
                sliderRef.current && sliderRef.current.slickGoTo(0);
            } catch (error) {
                console.error('Error al obtener productos de la categoría "INVIERNO":', error);
            }
        };

        fetchInviernoProducts();
    }, []);

    const getSettings = () => {
        const totalProducts = products.length;

        const baseSettings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToScroll: 1,
            initialSlide: 0,
            centerMode: false,
            slidesToShow: 4,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    }
                }
            ]
        };

        // Ajustar slidesToShow y añadir peeking effect
        if (totalProducts <= 4) {
            baseSettings.slidesToShow = totalProducts;
        } else {
            baseSettings.slidesToShow = 4.2;
        }

        baseSettings.responsive = baseSettings.responsive.map(bp => {
            const bpSlidesToShow = bp.settings.slidesToShow;
            if (totalProducts <= bpSlidesToShow) {
                bp.settings.slidesToShow = totalProducts;
            } else {
                bp.settings.slidesToShow = bpSlidesToShow + 0.2;
            }
            return bp;
        });

        return baseSettings;
    };

    const settings = getSettings();

    const handlePrev = () => {
        sliderRef.current.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    return (
        <div className="winter-products-section">
            <div className="section__header">
                <div className='title-header'>
                    <h2 className="featured-title">PRODUCTOS DE INVIERNO</h2>
                    <Link to="/category/invierno" className="view-all">Ver todo</Link>
                </div>
                <div className="carousel__controls">
                    <button onClick={handlePrev} className="carousel__btn">
                        <FaChevronLeft />
                    </button>
                    <button onClick={handleNext} className="carousel__btn">
                        <FaChevronRight />
                    </button>
                </div>
            </div>
            <Slider {...settings} ref={sliderRef} className="winter-products__slider">
                {products.map((product) => (
                    <div key={product._id} className="product-slide">
                        <ProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default WinterArcSection;