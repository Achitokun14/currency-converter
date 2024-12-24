import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await authApi.login(email, password);
            login(data.token, data.user);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg">
            <h2 className="text-3xl font-extrabold mb-6 text-white text-center">
                Login
            </h2>
            {error && (
                <div className="mb-4 text-center text-red-200 bg-red-500/10 py-2 px-4 rounded-md">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2.5 shadow-inner text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg shadow-md hover:bg-pink-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
