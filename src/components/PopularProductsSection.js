import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './css/PopularProductsSection.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PopularProductsSection = () => {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                const res = await api.get('/products', {
                    params: { category: 'POPULARES' }
                });
                setProducts(res.data);
                sliderRef.current && sliderRef.current.slickGoTo(0);
            } catch (error) {
                console.error('Error al obtener productos de la categoría "POPULARES":', error);
            }
        };

        fetchPopularProducts();
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        centerMode: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const handlePrev = () => {
        sliderRef.current.slickPrev();
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    return (
        <div className="popular-products-section">
            <div className="section__header">
                <div className='title-header'>
                    <h2 className="featured-title">PRODUCTOS POPULARES</h2>
                    <Link to="/category/populares" className="view-all">Ver todo</Link>
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
            <Slider {...settings} ref={sliderRef} className="popular-products__slider">
                {products.map((product) => (
                    <div key={product._id} className="product-slide">
                        <ProductCard product={product} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default PopularProductsSection;