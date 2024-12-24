import { useState, useEffect } from 'react';
import { conversionApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState<string[]>([]);
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState<string>('USD');
    const [toCurrency, setToCurrency] = useState<string>('EUR');
    const [result, setResult] = useState<number | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadCurrencies = async () => {
            try {
                const { data } = await conversionApi.getSupportedCurrencies();
                setCurrencies(data.data);
            } catch (error) {
                console.error('Failed to load currencies:', error);
            }
        };
        loadCurrencies();
    }, []);

    const handleConversion = async () => {
        try {
            const { data } = await conversionApi.convert(amount, fromCurrency, toCurrency);
            setResult(data.data.result);
        } catch (error) {
            console.error('Conversion failed:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Currency Converter</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-white">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="mt-1 block w-full rounded-lg bg-white/80 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-white">From</label>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="mt-1 block w-full rounded-lg bg-white/80 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">To</label>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="mt-1 block w-full rounded-lg bg-white/80 text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            {currencies.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleConversion}
                    disabled={!isAuthenticated}
                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                    {isAuthenticated ? 'Convert' : 'Please login to convert'}
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-white/80 rounded-lg shadow-inner text-center">
                        <p className="text-lg font-medium text-gray-800">
                            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;
