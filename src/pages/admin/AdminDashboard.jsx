import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, FileCheck, CreditCard, IndianRupee, PieChart } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => setStats(res.data.stats))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <PieChart className="text-orange-500" size={28} /> Analytics Overview
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Real-time system statistics and metrics.</p>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users size={24} /></div>
                        <p className="text-gray-500 font-medium text-sm">Total Network Users</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total_users}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4"><FileCheck size={24} /></div>
                        <p className="text-gray-500 font-medium text-sm">Pending KYC Actions</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pending_kyc}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4"><CreditCard size={24} /></div>
                        <p className="text-gray-500 font-medium text-sm">Pending Payouts</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(stats.pending_withdrawal_amount || 0).toFixed(2)}</h3>
                        <p className="text-xs text-rose-500 mt-2 font-medium">{stats.pending_withdrawal_requests} requests pending</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><IndianRupee size={24} /></div>
                        <p className="text-gray-500 font-medium text-sm">Total Commission Paid</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(stats.total_commission_paid || 0).toFixed(2)}</h3>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminDashboard;