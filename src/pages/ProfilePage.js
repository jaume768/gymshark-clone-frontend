import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ProfilePage.css';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/auth');
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
            <button onClick={logout} className="btn-logout">
                Cerrar Sesión
            </button>
        </div>
    );
};

export default ProfilePage;
