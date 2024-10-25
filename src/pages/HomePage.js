// HomePage.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import NewSeasonSection from '../components/NewSeasonSection';
import PopularProductsSection from '../components/PopularProductsSection';
import HeroSectionVideo from '../components/HeroSectionVideo';
import WinterArcSection from '../components/WinterArcSection';
import './css/HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <HeroSection />
            <NewSeasonSection />
            <PopularProductsSection />
            <HeroSectionVideo />
            <WinterArcSection />
        </div>
    );
};

export default HomePage;
