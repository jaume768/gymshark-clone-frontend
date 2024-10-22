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

    // Campos adicionales
    const [email, setEmail] = useState('');
    const [acceptOffers, setAcceptOffers] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        // Eliminamos el campo 'pais' del estado
    });

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

        // Validaciones adicionales
        if (!email) {
            toast.error('Por favor, ingresa tu email de contacto');
            setLoading(false);
            return;
        }

        if (!shippingInfo.nombre || !shippingInfo.direccion || !shippingInfo.ciudad || !shippingInfo.codigoPostal) {
            toast.error('Por favor, completa toda la información de envío');
            setLoading(false);
            return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    email: email,
                    name: shippingInfo.nombre, // Correctamente ubicado aquí
                    address: {
                        line1: shippingInfo.direccion,
                        city: shippingInfo.ciudad,
                        postal_code: shippingInfo.codigoPostal,
                        country: 'ES' // Asignamos directamente 'ES'
                    }
                }
            },
        });

        if (result.error) {
            toast.error(`Error en el pago: ${result.error.message}`);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                toast.success('¡Pago exitoso!');
                // Aquí podrías enviar la información del pedido a tu backend
                clearCart();
                navigate('/payment-success');
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Información de Contacto</h2>
            <div className="form-group">
                <label htmlFor="email">Email de Contacto</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group checkbox-group">
                <input
                    type="checkbox"
                    id="acceptOffers"
                    checked={acceptOffers}
                    onChange={(e) => setAcceptOffers(e.target.checked)}
                />
                <label htmlFor="acceptOffers">Aceptar recibir ofertas y contenido exclusivo</label>
            </div>

            <h2>Información de Envío</h2>
            <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                    type="text"
                    id="nombre"
                    value={shippingInfo.nombre}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, nombre: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                    type="text"
                    id="direccion"
                    value={shippingInfo.direccion}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, direccion: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                    type="text"
                    id="ciudad"
                    value={shippingInfo.ciudad}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, ciudad: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="codigoPostal">Código Postal</label>
                <input
                    type="text"
                    id="codigoPostal"
                    value={shippingInfo.codigoPostal}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, codigoPostal: e.target.value })}
                    required
                />
            </div>

            <h2>Información de Pago</h2>
            <div className="form-group">
                <CardElement options={{ hidePostalCode: true }} />
            </div>
            <button type="submit" disabled={!stripe || loading} className="btn-submit">
                {loading ? 'Procesando...' : 'Pagar'}
            </button>
        </form>
    );
};

export default CheckoutForm;
