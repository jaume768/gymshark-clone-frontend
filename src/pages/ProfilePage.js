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
            <h1>Mi Perfil</h1>
            <div className="profile-info">
                <p><strong>Nombre:</strong> {user.nombre || user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="orders-section">
                <h2>Mis Compras</h2>
                {orders.length === 0 ? (
                    <p>No has realizado ninguna compra.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order">
                            <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>
                            <p><strong>Estado:</strong> {order.estado}</p>
                            <h3>Productos:</h3>
                            <ul>
                                {order.items.map(item => (
                                    <li key={item._id}>
                                        {item.producto.nombre} - Cantidad: {item.cantidad} - Precio: €{item.precio.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>

            <button onClick={logout} className="btn-logout">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default ProfilePage;
