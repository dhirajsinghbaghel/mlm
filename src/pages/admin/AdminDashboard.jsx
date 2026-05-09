import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, FileCheck, CreditCard, IndianRupee, PieChart, TrendingUp } from 'lucide-react';

// --- CHART.JS IMPORTS ---
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => setStats(res.data.stats))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // --- CHART.JS DYNAMIC DATA MAPPER ---
    const getChartData = () => {
        const dataCounts = [];
        const labels = [];
        const today = new Date();

        // Loop to generate last 7 days dynamically
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);

            // Format labels for X-axis (e.g. "May 09")
            labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

            // Format date to match backend 'YYYY-MM-DD'
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const targetDate = `${year}-${month}-${day}`;

            // Find if database returned counts for this date
            const found = stats?.chart_data?.find(x => x.date_str === targetDate);
            dataCounts.push(found ? found.count : 0);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'New Registrations',
                    data: dataCounts,
                    backgroundColor: 'rgba(249, 115, 22, 0.85)', // Tailwind Orange
                    hoverBackgroundColor: 'rgba(239, 68, 68, 1)',   // Tailwind Red
                    borderRadius: 6,
                    barPercentage: 0.6,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 14, weight: 'bold' },
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return `${context.parsed.y} Users Joined`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6', drawBorder: false },
                ticks: { precision: 0, color: '#6b7280' }
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#6b7280', font: { weight: '500' } }
            }
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Loading Analytics...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <PieChart className="text-orange-500" size={28} /> Analytics Overview
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Real-time system statistics and metrics.</p>
            </div>

            {stats && (
                <>
                    {/* STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Total Network Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total_users}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4"><FileCheck size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Pending KYC Actions</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pending_kyc}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4"><CreditCard size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Pending Payouts</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(stats.pending_withdrawal_amount || 0).toFixed(2)}</h3>
                            <p className="text-xs text-rose-500 mt-2 font-medium bg-rose-50 px-2 py-1 rounded-md w-max">{stats.pending_withdrawal_requests} requests pending</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between transition-transform hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><IndianRupee size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Total Commission Paid</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(stats.total_commission_paid || 0).toFixed(2)}</h3>
                        </div>
                    </div>

                    {/* DYNAMIC CHART.JS GRAPH */}
                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate__animated animate__fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <TrendingUp size={20} className="text-orange-500" /> User Registration Growth
                            </h3>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">Last 7 Days</span>
                        </div>

                        <div className="h-[300px] w-full">
                            <Bar data={getChartData()} options={chartOptions} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;