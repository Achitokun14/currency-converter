import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Left Section */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link
                                to="/"
                                className="text-xl font-extrabold text-white hover:opacity-90"
                            >
                                Currency Converter
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to="/"
                                className="text-white inline-flex items-center px-3 py-1 rounded-md hover:bg-white/10 hover:shadow-md transition"
                            >
                                Convert
                            </Link>
                            {isAuthenticated && (
                                <Link
                                    to="/history"
                                    className="text-white inline-flex items-center px-3 py-1 rounded-md hover:bg-white/10 hover:shadow-md transition"
                                >
                                    History
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-white font-medium">
                                    Welcome, {user?.name}
                                </span>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 hover:shadow-md transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 hover:shadow-md transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 hover:shadow-md transition"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
