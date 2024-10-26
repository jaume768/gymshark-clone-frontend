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
    const [products, setProducts] = useState([]);

    const [email, setEmail] = useState('');
    const [acceptOffers, setAcceptOffers] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("prova");
        setLoading(true);

        if (!stripe || !elements) {
            toast.error('Stripe no está cargado');
            setLoading(false);
            return;
        }

        // Validaciones
        if (!email) {
            toast.error('Por favor, ingresa tu email de contacto');
            setLoading(false);
            return;
        }

        if (products.length === 0) {
            toast.error('No hay productos en el carrito');
            setLoading(false);
            return;
        }

        const calculatedAmountInEuros = cartItems.reduce((acc, item) => {
            const product = products.find(p => p._id === item.producto);
            return acc + (product ? product.precio * item.cantidad : 0);
        }, 0);

        const calculatedAmount = Math.round(calculatedAmountInEuros * 100);

        if (calculatedAmountInEuros < 0.5) {
            toast.error('El monto mínimo para realizar una compra es de 0,50€');
            setLoading(false);
            return;
        }

        try {
            const orderItems = cartItems.map((item) => {
                const product = products.find(p => p._id === item.producto);
                return {
                    producto: product._id,
                    cantidad: item.cantidad,
                    precio: product.precio,
                };
            });

            const orderData = {
                items: orderItems,
                total: calculatedAmountInEuros,
                shippingInfo,
            };

            const orderResponse = await api.post('/orders', orderData);
            const createdOrder = orderResponse.data;

            const paymentIntentResponse = await api.post('/payment/create-payment-intent', {
                amount: calculatedAmount,
                orderId: createdOrder._id,
            });
            const { clientSecret } = paymentIntentResponse.data;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email: email,
                        name: shippingInfo.nombre,
                        address: {
                            line1: shippingInfo.direccion,
                            city: shippingInfo.ciudad,
                            postal_code: shippingInfo.codigoPostal,
                            country: 'ES',
                        },
                    },
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
        } catch (error) {
            toast.error('Error al procesar el pago');
            console.log(error);
        } finally {
            setLoading(false);
        }
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
