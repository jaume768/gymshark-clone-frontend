import React from 'react';
import { Link } from 'react-router-dom';
import './css/PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
    return (
        <div className="payment-success-page">
            <h1>¡Gracias por tu compra!</h1>
            <p>Tu pago ha sido procesado exitosamente.</p>
            <p>Recibirás un correo electrónico con los detalles de tu pedido.</p>
            <Link to="/" className="btn-home">Volver al Inicio</Link>
        </div>
    );
};

export default PaymentSuccessPage;
