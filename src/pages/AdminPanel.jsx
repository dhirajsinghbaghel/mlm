import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Settings, Users, FileCheck, CheckCircle, XCircle, ShieldCheck, Download, X, MoreVertical, Eye, PieChart, CreditCard, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [pendingKyc, setPendingKyc] = useState([]);
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [settings, setSettings] = useState({ level_1: '', level_2: '', level_3: '', joining_bonus: '' });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'users', 'kyc', 'withdrawals', 'settings'

    // Dropdown & Modal States
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [rejectId, setRejectId] = useState({ id: null, type: '' }); // type: 'kyc' or 'withdrawal'
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => { fetchAdminData(); }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, settingsRes, kycRes, statsRes, withdrawRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/settings'),
                api.get('/kyc/pending'),
                api.get('/admin/stats').catch(() => ({ data: { stats: null } })), // Fallback if API missing
                api.get('/withdrawals/pending').catch(() => ({ data: { withdrawals: [] } }))
            ]);

            setUsers(usersRes.data.users || []);
            setPendingKyc(kycRes.data.kyc_records || []);
            setDashboardStats(statsRes.data.stats || null);
            setPendingWithdrawals(withdrawRes.data.withdrawals || []);

            const s = settingsRes.data.settings;
            if (s) {
                setSettings({
                    level_1: s.level_1_commission,
                    level_2: s.level_2_commission,
                    level_3: s.level_3_commission,
                    joining_bonus: s.joining_bonus
                });
            }
        } catch (error) {
            console.error("Error fetching admin data", error);
            toast.error("Failed to load some admin data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/settings', settings);
            toast.success('Commission Settings Updated Successfully!');
        } catch (error) {
            toast.error('Failed to update settings');
        }
    };

    const handleKycReview = async (kycId, status, reason = '') => {
        try {
            await api.put('/kyc/review', { kyc_id: kycId, status, rejection_reason: reason });
            toast.success(`KYC ${status} successfully!`);
            closeAllModals();
            fetchAdminData();
        } catch (error) {
            toast.error(`Failed to review KYC`);
        }
    };

    const handleWithdrawalReview = async (withdrawId, action, reason = '') => {
        try {
            await api.put('/withdrawals/process', { withdrawal_id: withdrawId, action, reject_reason: reason });
            toast.success(`Withdrawal ${action} successfully!`);
            closeAllModals();
            fetchAdminData();
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to process withdrawal`);
        }
    };

    const closeAllModals = () => {
        setSelectedKyc(null);
        setRejectId({ id: null, type: '' });
        setRejectionReason('');
        setActiveDropdown(null);
    };

    const getDocumentUrl = (filename) => {
        const backendUrl = api.defaults?.baseURL ? api.defaults.baseURL.replace('/api', '') : 'https://backend.onlinenetcafebetul.store';
        return `${backendUrl}/uploads/${filename}`;
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = url.split('/').pop() || 'kyc_document';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("Document downloaded!");
        } catch (error) {
            toast.error("Failed to download. Opening in new tab...");
            window.open(url, '_blank');
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Admin Console...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="text-red-500" size={28} /> Admin Console
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Full System Tracking & Control</p>
            </div>

            {/* Custom Premium Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8 px-2 overflow-x-auto hide-scrollbar">
                <button onClick={() => setActiveTab('dashboard')}
                    className={`pb-4 px-2 font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === 'dashboard' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <PieChart size={18} className="inline mr-2 mb-1" /> Analytics
                </button>
                <button onClick={() => setActiveTab('users')}
                    className={`pb-4 px-2 font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <Users size={18} className="inline mr-2 mb-1" /> Users ({users.length})
                </button>
                <button onClick={() => setActiveTab('kyc')}
                    className={`pb-4 px-2 font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === 'kyc' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <FileCheck size={18} className="inline mr-2 mb-1" /> KYC ({pendingKyc.length})
                </button>
                <button onClick={() => setActiveTab('withdrawals')}
                    className={`pb-4 px-2 font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === 'withdrawals' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <CreditCard size={18} className="inline mr-2 mb-1" /> Withdrawals ({pendingWithdrawals.length})
                </button>
                <button onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-2 font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === 'settings' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <Settings size={18} className="inline mr-2 mb-1" /> Config
                </button>
            </div>

            {/* Tab Content Wrappers */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[500px]">

                {/* Dashboard Analytics Tab */}
                {activeTab === 'dashboard' && dashboardStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><Users size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Total Network Users</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.total_users}</h3>
                        </div>
                        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4"><FileCheck size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Pending KYC Actions</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{dashboardStats.pending_kyc}</h3>
                        </div>
                        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-4"><CreditCard size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Pending Payouts</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(dashboardStats.pending_withdrawal_amount || 0).toFixed(2)}</h3>
                            <p className="text-xs text-rose-500 mt-2 font-medium">{dashboardStats.pending_withdrawal_requests} requests pending</p>
                        </div>
                        <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100 flex flex-col justify-between">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4"><IndianRupee size={24} /></div>
                            <p className="text-gray-500 font-medium text-sm">Total Commission Paid</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">₹{parseFloat(dashboardStats.total_commission_paid || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Name</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref Code</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition">
                                        <td className="p-4 font-medium text-orange-600">#{user.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{user.name}</td>
                                        <td className="p-4 text-gray-500 text-sm">{user.email}</td>
                                        <td className="p-4"><span className="px-3 py-1 bg-gray-100 text-gray-600 font-medium text-xs rounded-lg">{user.referral_code}</span></td>
                                        <td className="p-4 text-gray-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* KYC Tab */}
                {activeTab === 'kyc' && (
                    <div className="overflow-x-auto min-h-[350px]">
                        {pendingKyc.length === 0 ? (
                            <div className="text-center py-16">
                                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                                <p className="text-lg font-semibold text-gray-800">All Caught Up!</p>
                                <p className="text-gray-500 mt-2 text-sm">No pending KYC submissions to review.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Details</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Document Info</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingKyc.map((kyc) => (
                                        <tr key={kyc.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition">
                                            <td className="p-4">
                                                <p className="font-medium text-gray-900">{kyc.name}</p>
                                                <p className="text-sm text-gray-500">{kyc.email}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-gray-800 uppercase text-sm">{kyc.document_type}</p>
                                                <p className="text-xs text-orange-600 font-medium">{kyc.document_number}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full border border-orange-100">Pending Review</span>
                                            </td>
                                            <td className="p-4 text-center relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === `kyc-${kyc.id}` ? null : `kyc-${kyc.id}`)} className="p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 rounded-full transition">
                                                    <MoreVertical size={18} />
                                                </button>
                                                {activeDropdown === `kyc-${kyc.id}` && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                                        <div className="absolute right-10 top-10 w-40 bg-white border border-gray-100 shadow-xl rounded-xl z-20 overflow-hidden text-left">
                                                            <ul className="py-1">
                                                                <li onClick={() => { setSelectedKyc(kyc); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"><Eye size={16} /> View Details</li>
                                                                <li onClick={() => { handleKycReview(kyc.id, 'approved'); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600 transition border-t border-gray-50"><CheckCircle size={16} /> Approve</li>
                                                                <li onClick={() => { setRejectId({ id: kyc.id, type: 'kyc' }); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition border-t border-gray-50"><XCircle size={16} /> Reject</li>
                                                            </ul>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Withdrawals Tab */}
                {activeTab === 'withdrawals' && (
                    <div className="overflow-x-auto min-h-[350px]">
                        {pendingWithdrawals.length === 0 ? (
                            <div className="text-center py-16">
                                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                                <p className="text-lg font-semibold text-gray-800">No Pending Payouts</p>
                                <p className="text-gray-500 mt-2 text-sm">All withdrawal requests have been processed.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank Details</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingWithdrawals.map((req) => (
                                        <tr key={req.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition">
                                            <td className="p-4">
                                                <p className="font-medium text-gray-900">{req.name}</p>
                                                <p className="text-sm text-gray-500">{req.email}</p>
                                                <p className="text-xs text-gray-400">{req.phone}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-medium text-gray-800 text-sm">Ac: {req.bank_account}</p>
                                                <p className="text-xs text-gray-500 font-medium">Bank: {req.bank_name}</p>
                                                <p className="text-xs text-gray-500 font-medium">IFSC: {req.ifsc_code}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-lg font-bold text-gray-900">₹{parseFloat(req.amount).toFixed(2)}</span>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(req.requested_at).toLocaleDateString()}</p>
                                            </td>
                                            <td className="p-4 text-center relative">
                                                <button onClick={() => setActiveDropdown(activeDropdown === `withdraw-${req.id}` ? null : `withdraw-${req.id}`)} className="p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 rounded-full transition">
                                                    <MoreVertical size={18} />
                                                </button>
                                                {activeDropdown === `withdraw-${req.id}` && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                                        <div className="absolute right-10 top-10 w-40 bg-white border border-gray-100 shadow-xl rounded-xl z-20 overflow-hidden text-left">
                                                            <ul className="py-1">
                                                                <li onClick={() => { handleWithdrawalReview(req.id, 'approved'); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600 transition"><CheckCircle size={16} /> Mark Paid</li>
                                                                <li onClick={() => { setRejectId({ id: req.id, type: 'withdrawal' }); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 transition border-t border-gray-50"><XCircle size={16} /> Reject & Refund</li>
                                                            </ul>
                                                        </div>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Payout Configuration</h2>
                        <form onSubmit={handleSettingsUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['level_1', 'level_2', 'level_3'].map((lvl, idx) => (
                                    <div key={lvl}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Level {idx + 1} Commission (₹)</label>
                                        <input type="number" step="0.01" value={settings[lvl]} onChange={(e) => setSettings({ ...settings, [lvl]: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-800" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Joining Bonus (₹)</label>
                                    <input type="number" step="0.01" value={settings.joining_bonus} onChange={(e) => setSettings({ ...settings, joining_bonus: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-gray-800" />
                                </div>
                            </div>
                            <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30 transition mt-4">
                                Save Configuration
                            </button>
                        </form>
                    </div>
                )}

            </div>

            {/* View Details Drawer (KYC) */}
            {selectedKyc && (
                <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity" onClick={closeAllModals}></div>
                    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white">
                            <h3 className="text-xl font-semibold text-gray-800">KYC Verification</h3>
                            <button onClick={closeAllModals} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition"><X size={20} /></button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Applicant Name</p><p className="font-medium text-gray-900">{selectedKyc.name}</p></div>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p><p className="font-medium text-gray-900">{selectedKyc.email}</p></div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100/50 shadow-sm"><p className="text-xs text-orange-400 uppercase tracking-wider mb-1">Document Type</p><p className="font-medium text-orange-700 uppercase">{selectedKyc.document_type}</p></div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100/50 shadow-sm"><p className="text-xs text-orange-400 uppercase tracking-wider mb-1">Document ID</p><p className="font-medium text-orange-700">{selectedKyc.document_number}</p></div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center p-2 min-h-[45vh]">
                                {selectedKyc.document_url?.toLowerCase().endsWith('.pdf') ? (
                                    <iframe src={getDocumentUrl(selectedKyc.document_url)} className="w-full h-[55vh] rounded-lg border-0" title="PDF Viewer" />
                                ) : (
                                    <img src={getDocumentUrl(selectedKyc.document_url)} alt="KYC Document" className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-sm" />
                                )}
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center gap-4">
                            <button onClick={() => handleDownload(getDocumentUrl(selectedKyc.document_url))} className="px-5 py-2.5 flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition"><Download size={18} /> Download</button>
                            <div className="flex gap-3">
                                <button onClick={() => { setRejectId({ id: selectedKyc.id, type: 'kyc' }); setSelectedKyc(null); }} className="px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition">Reject</button>
                                <button onClick={() => handleKycReview(selectedKyc.id, 'approved')} className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 shadow-sm transition">Approve</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Universal Reject Reason Modal */}
            {rejectId.id && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Reject {rejectId.type === 'kyc' ? 'Document' : 'Withdrawal'}</h3>
                            <button onClick={closeAllModals} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button>
                        </div>
                        <p className="text-gray-500 mb-4 text-sm">Please provide a reason for rejecting this {rejectId.type === 'kyc' ? 'KYC submission' : 'withdrawal request'}.</p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder={rejectId.type === 'kyc' ? "e.g. Blurry image..." : "e.g. Invalid bank details..."}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 mb-5 text-gray-700 text-sm resize-none"
                            rows="4"
                        />

                        <div className="flex justify-end gap-3">
                            <button onClick={closeAllModals} className="px-5 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition">Cancel</button>
                            <button
                                onClick={() => rejectId.type === 'kyc'
                                    ? handleKycReview(rejectId.id, 'rejected', rejectionReason)
                                    : handleWithdrawalReview(rejectId.id, 'rejected', rejectionReason)}
                                className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 shadow-sm transition"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;