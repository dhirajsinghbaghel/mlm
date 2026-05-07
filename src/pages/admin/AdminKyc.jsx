import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FileCheck, CheckCircle, XCircle, Download, X, MoreVertical, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminKyc = () => {
    const [pendingKyc, setPendingKyc] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [rejectId, setRejectId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchKyc = async () => {
        try {
            const res = await api.get('/kyc/pending');
            setPendingKyc(res.data.kyc_records || []);
        } catch (error) { toast.error("Failed to load KYC"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchKyc(); }, []);

    const handleKycReview = async (kycId, status, reason = '') => {
        try {
            await api.put('/kyc/review', { kyc_id: kycId, status, rejection_reason: reason });
            toast.success(`KYC ${status} successfully!`);
            closeAllModals();
            fetchKyc();
        } catch (error) { toast.error(`Failed to review KYC`); }
    };

    const closeAllModals = () => {
        setSelectedKyc(null); setRejectId(null); setRejectionReason(''); setActiveDropdown(null);
    };

    const getDocumentUrl = (filename) => {
        const backendUrl = api.defaults?.baseURL ? api.defaults.baseURL.replace('/api', '') : 'https://backend.onlinenetcafebetul.store';
        return `${backendUrl}/uploads/${filename}`;
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = url.split('/').pop() || 'document';
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            toast.success("Downloaded!");
        } catch (error) { window.open(url, '_blank'); }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading KYC...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <FileCheck className="text-orange-500" size={28} /> KYC Verifications
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Review user identity documents.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[400px]">
                {pendingKyc.length === 0 ? (
                    <div className="text-center py-16">
                        <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                        <p className="text-lg font-semibold text-gray-800">All Caught Up!</p>
                        <p className="text-gray-500 mt-2 text-sm">No pending submissions.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Member Details</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Document Info</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-center">Action</th>
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
                                            <button onClick={() => setActiveDropdown(activeDropdown === kyc.id ? null : kyc.id)} className="p-2 text-gray-400 hover:bg-orange-50 hover:text-orange-600 rounded-full transition"><MoreVertical size={18} /></button>
                                            {activeDropdown === kyc.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                                                    <div className="absolute right-10 top-10 w-40 bg-white border border-gray-100 shadow-xl rounded-xl z-20 overflow-hidden text-left">
                                                        <ul className="py-1">
                                                            <li onClick={() => { setSelectedKyc(kyc); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"><Eye size={16} /> View Details</li>
                                                            <li onClick={() => { handleKycReview(kyc.id, 'approved'); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-green-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-600 border-t border-gray-50"><CheckCircle size={16} /> Approve</li>
                                                            <li onClick={() => { setRejectId(kyc.id); setActiveDropdown(null); }} className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-red-600 border-t border-gray-50"><XCircle size={16} /> Reject</li>
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

            {/* View Details Drawer */}
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
                                    <img src={getDocumentUrl(selectedKyc.document_url)} alt="Document" className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-sm" />
                                )}
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center gap-4">
                            <button onClick={() => handleDownload(getDocumentUrl(selectedKyc.document_url))} className="px-5 py-2.5 flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition"><Download size={18} /> Download</button>
                            <div className="flex gap-3">
                                <button onClick={() => { setRejectId(selectedKyc.id); setSelectedKyc(null); }} className="px-6 py-2.5 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition">Reject</button>
                                <button onClick={() => handleKycReview(selectedKyc.id, 'approved')} className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 shadow-sm transition">Approve</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Reject Modal */}
            {rejectId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl flex flex-col border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-900">Reject Document</h3><button onClick={closeAllModals} className="text-gray-400 hover:text-red-500 transition"><X size={20} /></button></div>
                        <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Provide reason..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 mb-5 text-gray-700 text-sm resize-none" rows="4" />
                        <div className="flex justify-end gap-3">
                            <button onClick={closeAllModals} className="px-5 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={() => handleKycReview(rejectId, 'rejected', rejectionReason)} className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 shadow-sm">Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminKyc;