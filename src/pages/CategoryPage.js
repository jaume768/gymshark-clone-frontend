// src/pages/CategoryPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './css/CategoryPage.css';

const CategoryPage = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products', {
                    params: { category: category }
                });
                
                setProducts(res.data);
            } catch (error) {
                console.error('Error al obtener productos por categoría:', error);
            }
        };

        fetchProducts();
    }, [category]);

    return (
        <div className="category-page">
            <h2 className="category-title">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <div className="category__products">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p>No se encontraron productos en esta categoría.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
