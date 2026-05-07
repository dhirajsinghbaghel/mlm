import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Wallet, Copy, Users, TrendingUp, Share2, ArrowRightCircle, Building, Check, X, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [myWithdrawals, setMyWithdrawals] = useState([]); // Naya state history ke liye
    const [loading, setLoading] = useState(true);

    // Withdrawal Modal State
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawForm, setWithdrawForm] = useState({ amount: '', bank_name: '', bank_account: '', ifsc_code: '' });

    const user = JSON.parse(localStorage.getItem('user')) || {};
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/register?ref=${user.referral_code}`;

    const fetchDashboardData = async () => {
        try {
            const [walletRes, withdrawRes] = await Promise.all([
                api.get('/wallet/balance'),
                api.get('/withdrawals/my-history').catch(() => ({ data: { withdrawals: [] } }))
            ]);
            setBalance(walletRes.data.balance || 0);
            setMyWithdrawals(withdrawRes.data.withdrawals || []);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    const copyToClipboard = () => { navigator.clipboard.writeText(referralLink); toast.success('Link copied to clipboard!'); };

    const shareLink = async () => {
        const shareData = { title: 'Join AS Group', text: `Hey! Join my network on AS Group. Register using my link: `, url: referralLink };
        if (navigator.share) { try { await navigator.share(shareData); } catch (err) { } }
        else { copyToClipboard(); toast.info('Link copied! Native sharing not supported.'); }
    };

    // Form Validation Logic (Live Check)
    const inputAmount = parseFloat(withdrawForm.amount) || 0;
    const isAmountValid = inputAmount >= 100 && inputAmount <= balance;
    let amountError = '';
    if (withdrawForm.amount !== '') {
        if (inputAmount < 100) amountError = 'Minimum withdrawal is ₹100.';
        else if (inputAmount > balance) amountError = 'Insufficient wallet balance!';
    }

    const handleWithdrawSubmit = async (e) => {
        e.preventDefault();
        if (!isAmountValid) {
            return toast.error("Please enter a valid amount.");
        }

        setWithdrawLoading(true);
        try {
            await api.post('/withdrawals/request', withdrawForm);
            toast.success('Withdrawal request submitted successfully!');
            setShowWithdrawModal(false);
            setWithdrawForm({ amount: '', bank_name: '', bank_account: '', ifsc_code: '' });
            fetchDashboardData(); // Balance aur Table dono refresh ho jayenge
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit withdrawal request.');
        } finally {
            setWithdrawLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-3 py-1 bg-green-50 text-green-600 font-semibold text-xs rounded-full border border-green-100 flex items-center gap-1 w-max"><Check size={14} /> Paid</span>;
            case 'rejected': return <span className="px-3 py-1 bg-red-50 text-red-600 font-semibold text-xs rounded-full border border-red-100 flex items-center gap-1 w-max"><X size={14} /> Rejected</span>;
            case 'pending': return <span className="px-3 py-1 bg-yellow-50 text-yellow-600 font-semibold text-xs rounded-full border border-yellow-100 flex items-center gap-1 w-max"><Clock size={14} /> Pending</span>;
            default: return <span className="px-3 py-1 bg-gray-50 text-gray-600 font-semibold text-xs rounded-full border border-gray-100">{status}</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Dashboard...</div>;

    return (
        <div className="p-2 sm:p-6">
            {/* Top Greeting */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                        <span className="text-2xl font-bold text-white uppercase">{user.name?.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Hello, {user.name}</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">Welcome back to your dashboard!</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 flex items-center gap-2 font-medium text-sm text-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> Active Account
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Earning Wallet Card */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3.5 bg-orange-50 text-orange-600 rounded-2xl">
                                <Wallet size={24} />
                            </div>
                        </div>
                        <p className="text-gray-500 font-medium text-sm mb-1">Earning Wallet</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">₹{parseFloat(balance).toFixed(2)}</h2>
                    </div>
                    <button onClick={() => setShowWithdrawModal(true)} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2">
                        <ArrowRightCircle size={18} /> Withdraw Funds
                    </button>
                </div>

                {/* Referral Link Card */}
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-2 flex flex-col justify-center">
                    <p className="text-gray-500 font-medium text-sm mb-3">Your Unique Referral Link</p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        <input type="text" readOnly value={referralLink} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-600 focus:outline-none font-medium text-sm" />
                        <div className="flex gap-2 w-full sm:w-auto shrink-0">
                            <button onClick={copyToClipboard} className="flex-1 sm:flex-none px-6 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2 font-medium">
                                <Copy size={18} /> <span className="sm:hidden xl:inline">Copy</span>
                            </button>
                            <button onClick={shareLink} className="flex-1 sm:flex-none px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:shadow-orange-500/30 transition shadow-md flex items-center justify-center gap-2 font-medium">
                                <Share2 size={18} /> <span className="sm:hidden xl:inline">Share</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-6">
                        <Link to="/dashboard/tree" className="text-orange-600 font-medium hover:text-orange-700 transition flex items-center gap-1.5 text-sm">
                            <Users size={18} /> View Team Tree
                        </Link>
                        <Link to="/dashboard/transactions" className="text-gray-600 font-medium hover:text-gray-900 transition flex items-center gap-1.5 text-sm">
                            <TrendingUp size={18} /> Earning Passbook
                        </Link>
                    </div>
                </div>
            </div>

            {/* Withdrawal Tracking Table */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Withdrawal Requests</h2>
                {myWithdrawals.length === 0 ? (
                    <div className="text-center py-10">
                        <Clock className="mx-auto mb-3 text-gray-300" size={32} />
                        <p className="text-gray-500 text-sm font-medium">You haven't made any withdrawal requests yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank Details</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myWithdrawals.map(req => (
                                    <tr key={req.id} className="border-b border-gray-50 hover:bg-orange-50/20 transition">
                                        <td className="p-4 text-sm text-gray-600 font-medium">{new Date(req.requested_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm font-bold text-gray-900">₹{parseFloat(req.amount).toFixed(2)}</td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-gray-800">{req.bank_name}</p>
                                            <p className="text-xs text-gray-500">Ac: {req.bank_account}</p>
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(req.status)}
                                            {req.status === 'rejected' && req.rejected_reason && (
                                                <p className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={req.rejected_reason}>
                                                    Note: {req.rejected_reason}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate__animated animate__zoomIn animate__faster">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-8 text-center relative">
                            <button onClick={() => { setShowWithdrawModal(false); setWithdrawForm({ amount: '', bank_name: '', bank_account: '', ifsc_code: '' }) }} className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition">
                                <X size={18} />
                            </button>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <Building className="text-orange-500" size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
                            <p className="text-white/90 text-sm mt-1 font-medium">Available Balance: ₹{parseFloat(balance).toFixed(2)}</p>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleWithdrawSubmit} className="p-6 sm:p-8 bg-white">
                            <div className="space-y-5">
                                <div>
                                    <label className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                        <span>Withdrawal Amount (₹)</span>
                                    </label>
                                    <input
                                        type="number" required step="0.01"
                                        value={withdrawForm.amount}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                                        placeholder="Enter amount (Min ₹100)"
                                        className={`w-full px-5 py-3.5 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 font-semibold text-lg transition-colors ${amountError ? 'border-red-300 focus:ring-red-500/50' : 'border-gray-200 focus:ring-orange-500/50'}`}
                                    />
                                    {/* LIVE HINT & ERROR */}
                                    <div className="mt-1.5 flex items-center justify-between text-xs font-medium">
                                        {amountError ? (
                                            <span className="text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {amountError}</span>
                                        ) : (
                                            <span className={withdrawForm.amount && isAmountValid ? "text-green-500" : "text-gray-400"}>
                                                {withdrawForm.amount && isAmountValid ? "Valid Amount ✓" : "Minimum withdrawal is ₹100"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bank Name</label>
                                    <input
                                        type="text" required
                                        value={withdrawForm.bank_name}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_name: e.target.value })}
                                        placeholder="e.g. State Bank of India"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800 font-medium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Number</label>
                                    <input
                                        type="text" required
                                        value={withdrawForm.bank_account}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, bank_account: e.target.value })}
                                        placeholder="Enter account number"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800 font-medium text-sm tracking-widest"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">IFSC Code</label>
                                    <input
                                        type="text" required uppercase
                                        value={withdrawForm.ifsc_code}
                                        onChange={(e) => setWithdrawForm({ ...withdrawForm, ifsc_code: e.target.value.toUpperCase() })}
                                        placeholder="e.g. SBIN0001234"
                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800 font-medium text-sm uppercase"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={withdrawLoading || !isAmountValid}
                                className={`w-full mt-8 py-4 text-white font-medium rounded-xl transition shadow-md flex justify-center items-center gap-2 ${!isAmountValid ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                            >
                                {withdrawLoading ? 'Processing...' : <>Submit Request <Check size={18} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;