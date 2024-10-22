import React from 'react';
import './css/HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1>¡NUEVAS COSAS ACABAN DE LLEGAR!</h1>
                <p>Consigue un nuevo look, ve al gimnasio, y progresa fácilmente.</p>
                <div className="hero-buttons">
                    <Link to="/category/women" className="btn btn-women">
                        <b>MUJERES</b>
                    </Link>
                    <Link to="/category/men" className="btn btn-men">
                        <b>HOMBRES</b>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
