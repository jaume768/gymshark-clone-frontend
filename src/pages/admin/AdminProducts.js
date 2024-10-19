// src/pages/admin/AdminProducts.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import '../css/AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genderCategories, setGenderCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categorias: [],
        imagen: '',
        stock: '',
        genero: '',
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchGenderCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [search, products.length]);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/admin/products');
            setProducts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            toast.error('Error al obtener productos');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            const filtered = res.data.filter(
                category => category.nombre.toUpperCase() !== 'MEN' && category.nombre.toUpperCase() !== 'WOMEN'
            );
            setCategories(filtered);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            toast.error('Error al obtener categorías');
        }
    };

    const fetchGenderCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            const genders = res.data.filter(
                category => category.nombre.toUpperCase() === 'MEN' || category.nombre.toUpperCase() === 'WOMEN'
            );
            setGenderCategories(genders);
        } catch (error) {
            console.error('Error al obtener categorías de género:', error);
            toast.error('Error al obtener categorías de género');
        }
    };

    const filterProducts = () => {
        const lowerSearch = search.toLowerCase();
        const filtered = products.filter(product =>
            product.nombre.toLowerCase().includes(lowerSearch)
        );
        setProducts(filtered);
    };

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'categorias') {
            const selectedCategories = Array.from(options)
                .filter(option => option.selected)
                .map(option => option.value);
            setForm({
                ...form,
                categorias: selectedCategories,
            });
        } else if (name === 'genero') {
            setForm({
                ...form,
                genero: value,
            });
        } else {
            setForm({
                ...form,
                [name]: value,
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const selectedGenderCategory = genderCategories.find(
                gender => gender.nombre.toLowerCase() === form.genero.toLowerCase()
            );
            if (!selectedGenderCategory) {
                toast.error('Categoría de género no encontrada');
                return;
            }

            const newProduct = {
                nombre: form.nombre,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio),
                categorias: [...form.categorias, selectedGenderCategory._id],
                imagen: form.imagen,
                stock: parseInt(form.stock),
            };
            await api.post('/admin/products', newProduct);
            toast.success('Producto creado exitosamente');
            fetchProducts();
            setForm({
                nombre: '',
                descripcion: '',
                precio: '',
                categorias: [],
                imagen: '',
                stock: '',
                genero: '',
            });
            setSearch('');
        } catch (error) {
            console.error('Error al crear producto:', error);
            toast.error('Error al crear producto');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                toast.success('Producto eliminado');
                fetchProducts();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                toast.error(error.response?.data?.message || 'Error al eliminar producto');
            }
        }
    };

    const handleUpdate = async (id) => {
        toast.info('Función de actualización no implementada aún');
    };

    return (
        <div className="admin-products">
            <h2>Gestión de Productos</h2>
            <form onSubmit={handleCreate} className="admin-product-form">
                <h3>Crear Nuevo Producto</h3>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Género:</label>
                    <select
                        name="genero"
                        value={form.genero}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona Género</option>
                        {genderCategories.map(gender => (
                            <option key={gender._id} value={gender.nombre.toLowerCase()}>
                                {gender.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Categorías:</label>
                    <select
                        name="categorias"
                        multiple
                        value={form.categorias}
                        onChange={handleChange}
                        required
                    >
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Imagen URL:</label>
                    <input
                        type="text"
                        name="imagen"
                        value={form.imagen}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Crear Producto</button>
            </form>

            <div className="admin-product-search">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="admin-product-list">
                <h3>Lista de Productos</h3>
                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Categorías</th>
                                <th>Imagen</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product.nombre}</td>
                                    <td>{product.descripcion}</td>
                                    <td>${product.precio.toFixed(2)}</td>
                                    <td>{product.categorias.map(cat => cat.nombre).join(', ')}</td>
                                    <td>
                                        <a href={product.imagen} target="_blank" rel="noopener noreferrer">
                                            Ver Imagen
                                        </a>
                                    </td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <button onClick={() => handleUpdate(product._id)}>Editar</button>
                                        <button onClick={() => handleDelete(product._id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );

};

export default AdminProducts;
