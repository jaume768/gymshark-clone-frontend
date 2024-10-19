// src/pages/AuthPage.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import './css/AuthPage.css';
import loginImage from '../assets/images/login-image.jpg';
import IconSVG from '../assets/images/icon.svg';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [username, setUsername] = useState('');

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await api.post('/auth/login', { email, password });
                login(res.data);
                toast.success('Inicio de sesión exitoso');
            } else {
                const res = await api.post('/auth/register', { username, email, password });
                login(res.data);
                toast.success('Registro exitoso');
            }
        } catch (error) {
            console.error('Error en AuthPage:', error);
            toast.error(error.response?.data?.message || 'Error en la autenticación');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-image">
                <img src={loginImage} alt="Login" />
            </div>
            <div className="auth-form-container">
                <div className="auth-header">
                    <img src={IconSVG} alt="Icono" className="auth-icon" />
                    <h1>MY GYMSHARK</h1>
                    <button onClick={toggleForm} className="auth-toggle-btn">
                        {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia Sesión'}
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="username">Nombre de Usuario:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-submit">
                        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
