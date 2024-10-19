import React from 'react';
import './css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} DeportesStore. Todos los derechos reservados.</p>
        </footer>
    );
};

export default Footer;
