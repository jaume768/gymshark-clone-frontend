import React from 'react';
import './css/HeroSectionVideo.css';
import { Link } from 'react-router-dom';

import desktopVideo from '../assets/videos/hero-desktop.mp4';
import mobileVideo from '../assets/videos/hero-mobile.mp4';

const HeroSectionVideo = () => {
    return (
        <div className="hero-video-container">
            <video 
                className="hero-video desktop-video" 
                src={desktopVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
            />
            <video 
                className="hero-video mobile-video" 
                src={mobileVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
            />
            
            <div className="hero-video-content">
                <h1>¡EL WINTER ARC ACABA DE LLEGAR!</h1>
                <p>Consigue un nuevo look de invierno y progresa fácilmente.</p>
                <div className="hero-video-buttons">
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

export default HeroSectionVideo;
