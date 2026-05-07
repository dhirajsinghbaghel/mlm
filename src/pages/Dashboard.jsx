import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Wallet, Copy, Upload, Users, TrendingUp, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/register?ref=${user.referral_code}`;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const walletRes = await api.get('/wallet/balance');
                setBalance(walletRes.data.balance);
            } catch (error) { }
        };
        fetchDashboardData();
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        toast.success('Copied to clipboard!');
    };

    // Native Share Function
    const shareLink = async () => {
        const shareData = {
            title: 'Join AS Group',
            text: `Hey! Join my network on AS Group. Register using my link and let's start earning together: `,
            url: referralLink
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or share failed silently
                console.log('Share cancelled or failed', err);
            }
        } else {
            // Fallback for browsers that don't support native sharing (like older desktop browsers)
            copyToClipboard();
            toast.info('Link copied! Native sharing not supported on this device.');
        }
    };

    return (
        <div className="p-2 sm:p-6">
            {/* Top Greeting */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                        <span className="text-2xl font-bold text-white">{user.name?.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800">Hello, {user.name}</h1>
                        <p className="text-gray-500 font-medium">Have a nice day!</p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-3">
                    <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 flex items-center gap-2 font-bold text-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Active
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 font-semibold mb-1">Earning Wallet</p>
                        <h2 className="text-3xl font-extrabold text-gray-800">₹{parseFloat(balance).toFixed(2)}</h2>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4">
                            <div className="bg-gradient-to-r from-orange-400 to-red-500 w-3/4 h-1.5 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 md:col-span-2">
                    <p className="text-gray-400 font-semibold mb-3">Your Referral Link</p>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input type="text" readOnly value={referralLink} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 focus:outline-none font-medium" />

                        {/* Copy & Share Buttons Container */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={copyToClipboard} className="flex-1 sm:flex-none px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 font-bold">
                                <Copy size={20} /> <span className="sm:hidden lg:inline">Copy</span>
                            </button>
                            <button onClick={shareLink} className="flex-1 sm:flex-none px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:shadow-orange-500/30 transition shadow-lg flex items-center justify-center gap-2 font-bold">
                                <Share2 size={20} /> <span className="sm:hidden lg:inline">Share</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <Link to="/dashboard/tree" className="text-orange-600 font-bold hover:underline flex items-center gap-1">
                            <Users size={18} /> View Team Tree
                        </Link>
                        <Link to="/dashboard/transactions" className="text-gray-500 font-bold hover:underline flex items-center gap-1">
                            <TrendingUp size={18} /> Passbook
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;