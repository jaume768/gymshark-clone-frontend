import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './css/OrderSummary.css';
import { toast } from 'react-toastify';

const OrderSummary = () => {
    const { cartItems } = useCart();
    const [products, setProducts] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const requests = cartItems.map((item) => api.get(`/products/${item.producto}`));
                const responses = await Promise.all(requests);
                setProducts(responses.map((res) => res.data));
            } catch (error) {
                console.error('Error al obtener productos del carrito:', error);
            }
        };

        if (cartItems.length > 0) {
            fetchProducts();
        } else {
            setProducts([]);
        }
    }, [cartItems]);

    useEffect(() => {
        const calculatedTotal = cartItems.reduce((acc, item) => {
            const product = products.find(p => p._id === item.producto);
            return acc + (product ? product.precio * item.cantidad : 0);
        }, 0);

        const discountedTotal = calculatedTotal - discount;
        setTotal(discountedTotal > 0 ? discountedTotal : 0);
    }, [products, cartItems, discount]);

    const handleApplyDiscount = () => {
        if (discountCode === 'DESCUENTO10') {
            setDiscount(10);
            toast.success('Código de descuento aplicado correctamente');
        } else {
            toast.error('Código de descuento inválido');
        }
    };

    return (
        <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            <ul className="product-list">
                {cartItems.map((item) => {
                    const product = products.find(p => p._id === item.producto);
                    if (!product) return null;
                    return (
                        <li key={product._id} className="product-item">
                            <img src={product.imagen} alt={product.nombre} className="product-thumbnail" />
                            <div className="product-details">
                                <span className="product-name">{product.nombre}</span>
                                <span className="product-quantity">x {item.cantidad}</span>
                            </div>
                            <span className="product-subtotal">{(product.precio * item.cantidad).toFixed(2)}€</span>
                        </li>
                    );
                })}
            </ul>
            <div className="discount-section">
                <input
                    type="text"
                    placeholder="Código de descuento"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="discount-input"
                />
                <button onClick={handleApplyDiscount} className="btn-apply-discount">Aplicar</button>
            </div>
            <div className="total-section">
                <span>Total:</span>
                <span>{total.toFixed(2)}€</span>
            </div>
        </div>
    );
};

export default OrderSummary;
