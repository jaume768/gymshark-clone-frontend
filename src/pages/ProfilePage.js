import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProfilePage.css';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        } else {
            const fetchOrders = async () => {
                try {
                    const { data } = await api.get('/orders/my-orders');
                    setOrders(data);
                } catch (error) {
                    console.error('Error al obtener las órdenes:', error);
                }
            };
            fetchOrders();
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h2 className="profile-title">Bienvenido, {user.nombre || user.username}</h2>
                <button onClick={logout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </header>

            <div className="profile-content">
                <section className="profile-info">
                    <h3>Información de Perfil</h3>
                    <p><strong>Nombre:</strong> {user.nombre || user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </section>

                <section className="orders-section">
                    <h3>Mis Compras</h3>
                    {orders.length === 0 ? (
                        <p>No has realizado ninguna compra.</p>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header">
                                        <span><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span><strong>Total:</strong>{order.total.toFixed(2)} €</span>
                                    </div>
                                    <p><strong>Estado:</strong> {order.estado}</p>
                                    <div className="order-products">
                                        <h4>Productos:</h4>
                                        <ul>
                                            {order.items.map(item => (
                                                <li key={item._id}>
                                                    {item.producto.nombre} - Cantidad: {item.cantidad} - Precio: €{item.precio.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProfilePage;
