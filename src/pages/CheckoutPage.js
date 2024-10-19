import React from 'react';
import CheckoutForm from '../components/CheckoutForm';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
    const { cartItems } = useCart();

    if (cartItems.length === 0) {
        return <p>Tu carrito está vacío.</p>;
    }

    return (
        <div className="checkout-page">
            <h1>Finalizar Compra</h1>
            <CheckoutForm />
        </div>
    );
};

export default CheckoutPage;
