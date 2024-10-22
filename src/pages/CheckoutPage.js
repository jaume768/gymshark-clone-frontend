import React from 'react';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import './css/CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems } = useCart();

    if (cartItems.length === 0) {
        return <p>Tu carrito está vacío.</p>;
    }

    return (
        <div className="checkout-page">
            <h1>Finalizar Compra</h1>
            <div className="checkout-container">
                <div className="checkout-left">
                    <CheckoutForm />
                </div>
                <div className="checkout-right">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
