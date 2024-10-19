import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './css/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product, 1);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <img src={product.imagen} alt={product.nombre} className="product-image" />
                <div className="product-info">
                    <h3 className="product-name">{product.nombre}</h3>
                    <p className="product-description">{product.descripcion}</p>
                    <p className="product-price">{product.precio}€</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
