import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Eye, X, Wallet, TrendingUp, Download, Network, Activity, ShieldCheck, CreditCard, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';

// Modern Tree Renderer
const AdminTreeRenderer = ({ data, isRoot = true }) => {
    if (!data || data.length === 0) return null;
    return (
        <div className={`space-y-4 ${!isRoot ? 'ml-4 md:ml-8 border-l-2 border-gray-200 pl-4 relative' : 'mt-4'}`}>
            {data.map((member) => (
                <div key={member.id} className="relative group">
                    {/* Horizontal Connector Line */}
                    {!isRoot && <div className="absolute -left-4 top-6 w-4 border-t-2 border-gray-200"></div>}

                    <div className="bg-white border border-gray-100 p-3 sm:p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:border-orange-300 transition-all z-10 relative">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white flex items-center justify-center font-bold text-sm sm:text-base shrink-0 shadow-sm">
                                {member.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{member.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                            <div className="text-center sm:text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Ref Code</p>
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-lg">{member.referral_code}</span>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Level</p>
                                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg">Lvl {member.level}</span>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Directs</p>
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">{member.downline ? member.downline.length : 0}</span>
                            </div>
                        </div>
                    </div>
                    {/* Render sub-members recursively */}
                    {member.downline && member.downline.length > 0 && (
                        <AdminTreeRenderer data={member.downline} isRoot={false} />
                    )}
                </div>
            ))}
        </div>
    );
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Kundli (Drawer) States
    const [selectedUser, setSelectedUser] = useState(null);
    const [kundliData, setKundliData] = useState(null);
    const [kundliLoading, setKundliLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // overview, tree, kyc, withdrawals

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = () => {
        api.get('/admin/users')
            .then(res => setUsers(res.data.users || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const openKundli = async (user) => {
        setSelectedUser(user);
        setKundliLoading(true);
        setActiveTab('overview');
        try {
            const res = await api.get(`/admin/user/${user.id}`);
            setKundliData(res.data);
        } catch (error) {
            toast.error("Failed to load user details");
            setSelectedUser(null);
        } finally {
            setKundliLoading(false);
        }
    };

    const closeKundli = () => {
        setSelectedUser(null);
        setKundliData(null);
    };

    const getDocumentUrl = (filename) => {
        const backendUrl = api.defaults?.baseURL ? api.defaults.baseURL.replace('/api', '') : 'https://backend.onlinenetcafebetul.store';
        return `${backendUrl}/uploads/${filename}`;
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-700 font-bold text-[10px] rounded-md uppercase">Approved</span>;
            case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 font-bold text-[10px] rounded-md uppercase">Rejected</span>;
            default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-bold text-[10px] rounded-md uppercase">Pending</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading Users...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <Users className="text-orange-500" size={28} /> User Management
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">View complete user profiles, network trees, and activities.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 sm:p-8 overflow-x-auto min-h-[500px]">
                <table className="w-full text-left min-w-[700px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Info</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref Code</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined On</th>
                            <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-orange-50/40 transition group">
                                <td className="p-4 font-medium text-orange-600">#{user.id}</td>
                                <td className="p-4">
                                    <p className="font-bold text-gray-800">{user.name}</p>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </td>
                                <td className="p-4"><span className="px-3 py-1 bg-gray-100 text-gray-700 font-medium text-xs rounded-lg">{user.referral_code}</span></td>
                                <td className="p-4 text-gray-500 text-sm font-medium">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => openKundli(user)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition"
                                    >
                                        <Eye size={14} /> View Kundli
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- USER KUNDLI DRAWER --- */}
            {selectedUser && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity" onClick={closeKundli}></div>
                    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-4xl bg-gray-50 shadow-2xl flex flex-col transform transition-transform duration-300">

                        {/* Drawer Header */}
                        <div className="bg-white border-b border-gray-200 px-6 sm:px-8 py-6 shrink-0 flex justify-between items-start z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-extrabold text-gray-900">{selectedUser.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">ID: #{selectedUser.id} • Ref Code: <span className="text-gray-800 font-bold">{selectedUser.referral_code}</span></p>
                                </div>
                            </div>
                            <button onClick={closeKundli} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-500 transition">
                                <X size={20} />
                            </button>
                        </div>

                        {kundliLoading || !kundliData ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <Activity className="text-orange-500 animate-spin mb-4" size={40} />
                                <p className="text-gray-500 font-bold">Extracting complete profile...</p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Inner Tabs */}
                                <div className="flex px-4 sm:px-8 bg-white border-b border-gray-200 shrink-0 overflow-x-auto hide-scrollbar">
                                    {[
                                        { id: 'overview', icon: <TrendingUp size={16} />, label: 'Overview & Financials' },
                                        { id: 'tree', icon: <Network size={16} />, label: 'Network Tree' },
                                        { id: 'kyc', icon: <ShieldCheck size={16} />, label: 'KYC Docs' },
                                        { id: 'withdrawals', icon: <CreditCard size={16} />, label: 'Payout History' }
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-4 font-bold border-b-2 text-sm transition flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-700'}`}
                                        >
                                            {tab.icon} {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-8 hide-scrollbar">

                                    {/* 1. OVERVIEW TAB */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6 animate__animated animate__fadeIn animate__faster">
                                            {/* Sponsor Info */}
                                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><LinkIcon size={18} /></div>
                                                <div>
                                                    <p className="text-xs text-blue-600 uppercase font-bold tracking-wider mb-0.5">Sponsor Details (Referred By)</p>
                                                    {kundliData.profile.sponsor_code ? (
                                                        <p className="font-bold text-gray-900">{kundliData.profile.sponsor_name} <span className="text-blue-700">({kundliData.profile.sponsor_code})</span></p>
                                                    ) : (
                                                        <p className="font-bold text-gray-900">Direct Join <span className="text-gray-500 font-medium text-sm">(No Sponsor)</span></p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Basic Info */}
                                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div><p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Email</p><p className="font-semibold text-gray-800 text-sm">{kundliData.profile.email}</p></div>
                                                <div><p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Phone</p><p className="font-semibold text-gray-800 text-sm">{kundliData.profile.phone || 'N/A'}</p></div>
                                                <div><p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Joined Date</p><p className="font-semibold text-gray-800 text-sm">{new Date(kundliData.profile.created_at).toLocaleDateString()}</p></div>
                                                <div><p className="text-[10px] text-gray-400 uppercase font-bold mb-1">KYC Status</p>{getStatusBadge(kundliData.profile.kyc_status)}</div>
                                            </div>

                                            {/* Financial Dashboard */}
                                            <h4 className="font-bold text-gray-800 flex items-center gap-2"><Wallet size={18} className="text-orange-500" /> Financial Status</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-2xl text-white shadow-lg">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Wallet Balance</p>
                                                    <h3 className="text-3xl font-extrabold text-orange-500">₹{parseFloat(kundliData.profile.wallet_balance).toFixed(2)}</h3>
                                                </div>
                                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Earned</p>
                                                    <h3 className="text-2xl font-extrabold text-green-600">₹{parseFloat(kundliData.profile.total_earned).toFixed(2)}</h3>
                                                </div>
                                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Withdrawn</p>
                                                    <h3 className="text-2xl font-extrabold text-gray-800">₹{parseFloat(kundliData.profile.total_withdrawn).toFixed(2)}</h3>
                                                </div>
                                            </div>

                                            {/* Network Stats */}
                                            <h4 className="font-bold text-gray-800 flex items-center gap-2 mt-4"><TrendingUp size={18} className="text-blue-500" /> Network Strength</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Level 1</p>
                                                    <h3 className="text-3xl font-extrabold text-blue-600">{kundliData.stats.level_1_count}</h3>
                                                </div>
                                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Level 2</p>
                                                    <h3 className="text-3xl font-extrabold text-blue-500">{kundliData.stats.level_2_count}</h3>
                                                </div>
                                                <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm text-center">
                                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Level 3</p>
                                                    <h3 className="text-3xl font-extrabold text-blue-400">{kundliData.stats.level_3_count}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. NETWORK TREE TAB */}
                                    {activeTab === 'tree' && (
                                        <div className="animate__animated animate__fadeIn animate__faster">
                                            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                                                {kundliData.tree && kundliData.tree.length > 0 ? (
                                                    <AdminTreeRenderer data={kundliData.tree} isRoot={true} />
                                                ) : (
                                                    <div className="text-center py-16">
                                                        <Network className="mx-auto mb-3 text-gray-300" size={48} />
                                                        <p className="text-gray-800 font-bold text-lg">No Referrals Yet</p>
                                                        <p className="text-gray-500 text-sm font-medium">This user hasn't added anyone to their network.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. KYC DOCUMENTS TAB */}
                                    {activeTab === 'kyc' && (
                                        <div className="animate__animated animate__fadeIn animate__faster space-y-4">
                                            {kundliData.kyc && kundliData.kyc.length > 0 ? (
                                                kundliData.kyc.map(doc => (
                                                    <div key={doc.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                                        <div className="flex-1 w-full space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <h4 className="font-bold text-gray-900 uppercase tracking-wider">{doc.document_type}</h4>
                                                                {getStatusBadge(doc.status)}
                                                            </div>
                                                            <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Document Number</p><p className="font-bold text-orange-600 tracking-wider">{doc.document_number}</p></div>
                                                            <div><p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Submitted On</p><p className="font-medium text-gray-800 text-sm">{new Date(doc.submitted_at).toLocaleString()}</p></div>
                                                            {doc.status === 'rejected' && doc.rejection_reason && (
                                                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl"><p className="text-xs text-red-600 font-bold">Reason: {doc.rejection_reason}</p></div>
                                                            )}
                                                        </div>
                                                        {doc.document_url && (
                                                            <div className="w-full md:w-64 h-40 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                                                                {doc.document_url.toLowerCase().endsWith('.pdf') ? (
                                                                    <iframe src={getDocumentUrl(doc.document_url)} className="w-full h-full pointer-events-none" title="PDF Preview" />
                                                                ) : (
                                                                    <img src={getDocumentUrl(doc.document_url)} alt="KYC" className="w-full h-full object-cover" />
                                                                )}
                                                                <a href={getDocumentUrl(doc.document_url)} target="_blank" rel="noreferrer" className="block text-center text-xs font-bold text-white bg-gray-900 py-2 hover:bg-gray-800 transition">View Full Size</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm text-center">
                                                    <ShieldCheck className="mx-auto mb-3 text-gray-300" size={48} />
                                                    <p className="text-gray-800 font-bold text-lg">No KYC Submitted</p>
                                                    <p className="text-gray-500 text-sm font-medium">User has not uploaded any documents yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 4. PAYOUTS TAB */}
                                    {activeTab === 'withdrawals' && (
                                        <div className="animate__animated animate__fadeIn animate__faster">
                                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                {kundliData.withdrawals && kundliData.withdrawals.length > 0 ? (
                                                    <table className="w-full text-left">
                                                        <thead className="bg-gray-50 border-b border-gray-100">
                                                            <tr>
                                                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bank Details</th>
                                                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                                                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {kundliData.withdrawals.map(w => (
                                                                <tr key={w.id} className="border-b border-gray-50">
                                                                    <td className="p-4 text-sm font-medium text-gray-600">{new Date(w.requested_at).toLocaleDateString()}</td>
                                                                    <td className="p-4">
                                                                        <p className="text-sm font-bold text-gray-800">{w.bank_name}</p>
                                                                        <p className="text-xs text-gray-500">Ac: {w.bank_account}</p>
                                                                    </td>
                                                                    <td className="p-4 font-bold text-gray-900">₹{parseFloat(w.amount).toFixed(2)}</td>
                                                                    <td className="p-4 text-right">{getStatusBadge(w.status)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <div className="text-center py-16">
                                                        <CreditCard className="mx-auto mb-3 text-gray-300" size={48} />
                                                        <p className="text-gray-800 font-bold text-lg">No Withdrawals</p>
                                                        <p className="text-gray-500 text-sm font-medium">User has not requested any payouts.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUsers;