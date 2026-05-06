import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Settings, Users, FileCheck, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [pendingKyc, setPendingKyc] = useState([]);
    const [settings, setSettings] = useState({ level_1: '', level_2: '', level_3: '', joining_bonus: '' });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'kyc', 'settings'

    // KYC Review State
    const [reviewingKycId, setReviewingKycId] = useState(null);
    const [reviewStatus, setReviewStatus] = useState('approved');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => { fetchAdminData(); }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, settingsRes, kycRes] = await Promise.all([
                api.get('/admin/users'), api.get('/admin/settings'), api.get('/kyc/pending')
            ]);
            setUsers(usersRes.data.users);
            setPendingKyc(kycRes.data.kyc_records || []);
            const s = settingsRes.data.settings;
            setSettings({
                level_1: s.level_1_commission, level_2: s.level_2_commission,
                level_3: s.level_3_commission, joining_bonus: s.joining_bonus
            });
        } catch (error) { console.error("Error fetching admin data", error); }
        finally { setLoading(false); }
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

            toast.success(`KYC ${status} successfully!`)

            setReviewingKycId(null); setRejectionReason('');
            fetchAdminData();
        } catch (error) {
            toast.error(`Failed to review KYC`)

        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Admin Console...</div>;

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="text-red-500" size={32} /> Admin Console
                </h1>
                <p className="text-gray-500 mt-1 font-medium">Manage users, approve KYC documents, and configure payouts.</p>
            </div>

            {/* Custom Premium Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8 px-2 overflow-x-auto">
                <button onClick={() => setActiveTab('users')}
                    className={`pb-4 px-2 font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <Users size={18} className="inline mr-2 mb-1" /> Network Users ({users.length})
                </button>
                <button onClick={() => setActiveTab('kyc')}
                    className={`pb-4 px-2 font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'kyc' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <FileCheck size={18} className="inline mr-2 mb-1" /> Pending KYC ({pendingKyc.length})
                </button>
                <button onClick={() => setActiveTab('settings')}
                    className={`pb-4 px-2 font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'settings' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}>
                    <Settings size={18} className="inline mr-2 mb-1" /> System Config
                </button>
            </div>

            {/* Tab Content Wrappers */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 min-h-[500px]">

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member Name</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ref Code</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition">
                                        <td className="p-4 font-bold text-orange-600">#{user.id}</td>
                                        <td className="p-4 font-bold text-gray-800">{user.name}</td>
                                        <td className="p-4 text-gray-500 text-sm font-medium">{user.email}</td>
                                        <td className="p-4"><span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-lg">{user.referral_code}</span></td>
                                        <td className="p-4 text-gray-500 text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* KYC Tab */}
                {activeTab === 'kyc' && (
                    <div className="space-y-6">
                        {pendingKyc.length === 0 ? (
                            <div className="text-center py-16">
                                <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
                                <p className="text-xl font-bold text-gray-800">All Caught Up!</p>
                                <p className="text-gray-500 mt-2 font-medium">No pending KYC submissions to review.</p>
                            </div>
                        ) : (
                            pendingKyc.map(kyc => (
                                <div key={kyc.id} className="p-6 border border-gray-100 rounded-3xl bg-gray-50/50 hover:border-orange-200 transition">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{kyc.name}</h3>
                                                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">Requires Review</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4 font-medium">{kyc.email} • Submitted: {new Date(kyc.submitted_at).toLocaleDateString()}</p>
                                            <div className="inline-block px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
                                                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Document Details</p>
                                                <p className="text-gray-800 font-bold">{kyc.document_type.toUpperCase()}: <span className="text-orange-600">{kyc.document_number}</span></p>
                                            </div>
                                        </div>

                                        {reviewingKycId === kyc.id ? (
                                            <div className="w-full lg:w-96 bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
                                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Action</label>
                                                <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-4 font-medium text-gray-700">
                                                    <option value="approved">Approve KYC</option>
                                                    <option value="rejected">Reject KYC</option>
                                                </select>

                                                {reviewStatus === 'rejected' && (
                                                    <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                                                        placeholder="Provide reason for rejection..."
                                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 mb-4 font-medium text-gray-700 text-sm" rows="3" />
                                                )}

                                                <div className="flex gap-3">
                                                    <button onClick={() => handleKycReview(kyc.id, reviewStatus, rejectionReason)}
                                                        className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-md flex justify-center items-center gap-2">
                                                        {reviewStatus === 'approved' ? <CheckCircle size={16} /> : <XCircle size={16} />} Confirm
                                                    </button>
                                                    <button onClick={() => setReviewingKycId(null)}
                                                        className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => { setReviewingKycId(kyc.id); setReviewStatus('approved'); setRejectionReason(''); }}
                                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-orange-500/30 transition self-start">
                                                Review Document
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="max-w-3xl">
                        <h2 className="text-xl font-extrabold text-gray-900 mb-6">Payout Configuration</h2>
                        <form onSubmit={handleSettingsUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['level_1', 'level_2', 'level_3'].map((lvl, idx) => (
                                    <div key={lvl}>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Level {idx + 1} Commission (₹)</label>
                                        <input type="number" step="0.01" value={settings[lvl]} onChange={(e) => setSettings({ ...settings, [lvl]: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium text-gray-800" />
                                        <p className="text-xs text-gray-400 mt-2 font-medium">Commission for Tier {idx + 1} referrals</p>
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Joining Bonus (₹)</label>
                                    <input type="number" step="0.01" value={settings.joining_bonus} onChange={(e) => setSettings({ ...settings, joining_bonus: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-medium text-gray-800" />
                                    <p className="text-xs text-gray-400 mt-2 font-medium">Credited upon KYC approval</p>
                                </div>
                            </div>
                            <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold hover:shadow-lg hover:shadow-orange-500/30 transition mt-4">
                                Save Configuration
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};
export default AdminPanel;