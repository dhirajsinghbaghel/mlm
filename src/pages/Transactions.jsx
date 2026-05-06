import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('/wallet/transactions');
                setTransactions(res.data.transactions);
            } catch (error) {
                console.error("Error fetching transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading your passbook...</div>;

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <History className="text-orange-500" size={32} /> Earning Passbook
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Track all your commissions, bonuses, and withdrawals.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                {transactions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <History className="text-orange-300" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium">No transactions found yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn, index) => (
                                    <tr key={index} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-4 text-sm text-gray-500 font-medium">
                                            {new Date(txn.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 font-medium">{txn.description}</td>
                                        <td className="p-4 text-sm">
                                            {txn.type === 'credit' ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full font-bold text-xs">
                                                    <ArrowDownLeft size={14} /> Credit
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-xs">
                                                    <ArrowUpRight size={14} /> Debit
                                                </span>
                                            )}
                                        </td>
                                        <td className={`p-4 font-extrabold text-right text-lg ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{parseFloat(txn.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Transactions;