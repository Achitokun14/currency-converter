import { useEffect, useState } from 'react';
import { conversionApi } from '../services/api';
import { ConversionHistory } from '../types/api';

const ConversionHistoryComponent = () => {
    const [history, setHistory] = useState<ConversionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const { data } = await conversionApi.getHistory();
                setHistory(data.data);
            } catch (error) {
                console.error('Failed to load history:', error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    if (loading) {
        return (
            <div className="text-center text-lg font-medium text-gray-700">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">
                Conversion History
            </h2>
            <div className="overflow-x-auto bg-white/10 rounded-lg p-4 shadow-inner">
                <table className="min-w-full divide-y divide-white/20">
                    <thead className="bg-white/10 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                From
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                To
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Result
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                                Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/10 divide-y divide-white/20 text-white">
                        {history.map((conversion) => (
                            <tr key={conversion._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {new Date(conversion.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {conversion.fromCurrency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {conversion.toCurrency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {conversion.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {conversion.result.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {conversion.rate.toFixed(4)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConversionHistoryComponent;
