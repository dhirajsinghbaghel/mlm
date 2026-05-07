import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { CreditCard, CheckCircle, XCircle, X, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminWithdrawals = () => {
    const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [rejectId, setRejectId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchWithdrawals = async () => {
        try {
            const res = await api.get('/withdrawals/pending');
            setPendingWithdrawals(res.data.withdrawals || []);
        } catch (error) { toast.error("Failed to load withdrawals"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchWithdrawals(); }, []);

    const handleProcess = async (withdrawId, action, reason = '') => {
        try {
            await api.put('/withdrawals/process', { withdrawal_id: withdrawId, action, reject_reason: reason });
            toast.success(`Withdrawal ${action} successfully!`);
            setRejectId(null); setRejectionReason(''); setActiveDropdown(null);
            fetchWithdrawals();
        } catch (error) { toast.error(error.response?.data?.message || `Failed to process payout`); }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Payouts...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <CreditCard className="text-orange-500" size={28} /> Payout Requests
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Manage user withdrawal requests.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[400px]">
                {pendingWithdrawals.length === 0 ? (
                    <div className="text-center py-16">
                        <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                        <p className="text-lg font-semibold text-gray-800">No Pending Payouts</p>
                        <p className="text-gray-500 mt-2 text-sm">All requests are processed.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">User Details</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Bank Details</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Action</th>
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
                                            <button onClick={() => setActiveDropdown(activeDropdown === req.id ? null : req.id)} className="p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 rounded-full transition"><MoreVertical size={18} /></button>
                                            {activeDropdown === req.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                                    <div className="absolute right-10 top-10 w-40 bg-white border border-gray-100 shadow-xl rounded-xl z-20 overflow-hidden text-left">
                                                        <ul className="py-1">
                                                            <li onClick={() => { handleProcess(req.id, 'approved'); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600"><CheckCircle size={16} /> Mark Paid</li>
                                                            <li onClick={() => { setRejectId(req.id); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 border-t border-gray-50"><XCircle size={16} /> Reject & Refund</li>
                                                        </ul>
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Reject Payout</h3><button onClick={() => setRejectId(null)} className="text-gray-400 hover:text-red-500"><X size={20} /></button></div>
                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Provide reason for refund..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 mb-5 text-gray-700 text-sm resize-none" rows="4" />
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setRejectId(null)} className="px-5 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={() => handleProcess(rejectId, 'rejected', rejectionReason)} className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 shadow-sm">Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminWithdrawals;