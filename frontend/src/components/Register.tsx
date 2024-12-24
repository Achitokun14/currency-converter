import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const { data } = await authApi.register(
                formData.name,
                formData.email,
                formData.password
            );
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
                Register
            </h2>
            {error && (
                <div className="mb-4 text-center text-red-200 bg-red-500/10 py-2 px-4 rounded-md">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white">
                        Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                            })
                        }
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
