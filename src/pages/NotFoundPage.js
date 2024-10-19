import React from 'react';
import { Link } from 'react-router-dom';
import './css/NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="notfound-page">
            <h1>404</h1>
            <p>Página no encontrada</p>
            <Link to="/" className="btn">
                Volver al Inicio
            </Link>
        </div>
    );
};

export default NotFoundPage;
