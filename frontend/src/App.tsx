import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CurrencyConverter from './components/CurrencyConverter';
import ConversionHistory from './components/ConversionHistory';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="h-screen w-screen bg-gradient-to-tr from-gray-800 via-blue-900 to-black text-white">
          <Navbar />
          <div className="flex justify-center items-center h-full mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CurrencyConverter />} />
              <Route path="/history" element={<ConversionHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
