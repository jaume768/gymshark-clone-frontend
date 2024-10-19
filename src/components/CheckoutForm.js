// src/components/CheckoutForm.js
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './css/CheckoutForm.css';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [products, setProducts] = useState([]);
    const [amountInEuros, setAmountInEuros] = useState(0);

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
        if (products.length === 0) return;

        const calculatedAmountInEuros = cartItems.reduce((acc, item) => {
            const product = products.find(p => p._id === item.producto);
            return acc + (product ? product.precio * item.cantidad : 0);
        }, 0);

        const calculatedAmount = Math.round(calculatedAmountInEuros * 100);

        setAmountInEuros(calculatedAmountInEuros);

        if (calculatedAmountInEuros < 0.5) {
            toast.error('El monto mínimo para realizar una compra es de 0,50€');
            return;
        }

        const createPaymentIntent = async () => {
            console.log('Amount to charge:', calculatedAmount);
            try {
                const { data } = await api.post('/payment/create-payment-intent', { amount: calculatedAmount });
                setClientSecret(data.clientSecret);
            } catch (error) {
                toast.error('Error al iniciar el pago');
                console.log(error);
            }
        };

        createPaymentIntent();
    }, [products, cartItems]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            toast.error('Stripe no está cargado');
            setLoading(false);
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (result.error) {
            toast.error(`Error en el pago: ${result.error.message}`);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                toast.success('¡Pago exitoso!');
                clearCart();
                navigate('/payment-success');
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Resumen de tu compra</h2>
            <ul className="product-list">
                {cartItems.map((item) => {
                    const product = products.find(p => p._id === item.producto);
                    if (!product) return null;
                    return (
                        <li key={product._id}>
                            {product.nombre} x {item.cantidad} - {(product.precio * item.cantidad).toFixed(2)}€
                        </li>
                    );
                })}
            </ul>
            <h3>Total: {amountInEuros.toFixed(2)}€</h3>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? 'Procesando...' : 'Pagar'}
            </button>
        </form>
    );
};

export default CheckoutForm;
