// src/pages/admin/AdminUsers.js
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import '../css/AdminUsers.css';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user: currentUser } = useAuth();

    const fetchUsers = useCallback(async () => {
        try {
            const res = await api.get('/admin/users');
            // Excluir al usuario actual
            const filtered = res.data.filter(u => u._id !== currentUser._id);
            setUsers(filtered);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            toast.error('Error al obtener usuarios');
            setLoading(false);
        }
    }, [currentUser._id]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(lowerSearch)
        );
        setFilteredUsers(filtered);
    }, [users, search]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleUpdateRole = async (id, role) => {
        try {
            await api.put(`/admin/users/${id}/role`, { role });
            toast.success('Rol de usuario actualizado');
            fetchUsers();
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            toast.error('Error al actualizar rol');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success('Usuario eliminado');
                fetchUsers();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                toast.error('Error al eliminar usuario');
            }
        }
    };

    return (
        <div className="admin-users">
            <h2>Gestión de Usuarios</h2>
            <div className="admin-user-search">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre de Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== 'admin' ? (
                                        <button onClick={() => handleUpdateRole(user._id, 'admin')}>Promover a Admin</button>
                                    ) : (
                                        <button onClick={() => handleUpdateRole(user._id, 'user')}>Degradar a Usuario</button>
                                    )}
                                    <button onClick={() => handleDelete(user._id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminUsers;
