// src/components/HeroSection.js
import React from 'react';
import './css/HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1>NEW STUFF JUST DROPPED</h1>
                <p>Grab a new fit, go gym, make progress easy.</p>
                <div className="hero-buttons">
                    <Link to="/category/women" className="btn btn-women">
                        <b>SHOP WOMEN</b>
                    </Link>
                    <Link to="/category/men" className="btn btn-men">
                        <b>SHOP MEN</b>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
