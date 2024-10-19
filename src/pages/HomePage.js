import React from 'react';
import HeroSection from '../components/HeroSection';
import NewSeasonSection from '../components/NewSeasonSection';
import PopularProductsSection from '../components/PopularProductsSection';
import './css/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <HeroSection />
            <NewSeasonSection />
            <PopularProductsSection />
        </div>
    );
};

export default HomePage;
