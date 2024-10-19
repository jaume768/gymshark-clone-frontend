import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <h2>Administración</h2>
                <nav>
                    <ul>
                        <li>
                            <Link to="products">Productos</Link>
                        </li>
                        <li>
                            <Link to="categories">Categorías</Link>
                        </li>
                        <li>
                            <Link to="users">Usuarios</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;
