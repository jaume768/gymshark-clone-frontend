import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './css/ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [cantidad, setCantidad] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, cantidad);
        toast.success('Producto añadido al carrito');
    };

    if (!product) return <div>Cargando...</div>;

    return (
        <div className="product-page">
            <img src={product.imagen} alt={product.nombre} className="product-page__image" />
            <div className="product-page__details">
                <h2>{product.nombre}</h2>
                <p>{product.descripcion}</p>
                <p className="price">{product.precio}€</p>
                <p>Stock: {product.stock}</p>
                <div className="product-page__actions">
                    <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                    <button onClick={handleAddToCart} className="btn">
                        Añadir al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;