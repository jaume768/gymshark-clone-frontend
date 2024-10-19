// src/pages/CartPage.js
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './css/CartPage.css';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [products, setProducts] = useState([]);

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

    const handleRemove = (id) => {
        removeFromCart(id);
        toast.info('Producto eliminado del carrito');
    };

    const handleClear = () => {
        clearCart();
        toast.info('Carrito vacío');
    };

    const total = cartItems.reduce((acc, item) => {
        const product = products.find(p => p._id === item.producto);
        return acc + (product ? product.precio * item.cantidad : 0);
    }, 0);

    return (
        <div className="cart-page">
            <h1>Tu Carrito</h1>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                const product = products.find(p => p._id === item.producto);
                                if (!product) return null;
                                return (
                                    <tr key={product._id}>
                                        <td data-label="Producto">{product.nombre}</td>
                                        <td data-label="Precio">{product.precio}€</td>
                                        <td data-label="Cantidad">{item.cantidad}</td>
                                        <td data-label="Subtotal">{(product.precio * item.cantidad).toFixed(2)}€</td>
                                        <td data-label="Acciones">
                                            <button onClick={() => handleRemove(product._id)} className="btn-remove">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="cart-summary">
                        <h2>Total: {total.toFixed(2)}€</h2>
                        <button onClick={handleClear} className="btn-clear">
                            Vaciar Carrito
                        </button>
                        <Link to="/checkout" className="btn-checkout">
                            Proceder al Pago
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;
