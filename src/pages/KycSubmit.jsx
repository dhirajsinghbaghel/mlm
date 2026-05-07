import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Cookies from 'js-cookie';
import { FileCheck, Upload, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const KycSubmit = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ document_type: 'aadhar', document_number: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please upload a document image');

        const data = new FormData();
        data.append('document_type', formData.document_type);
        data.append('document_number', formData.document_number);
        data.append('document', file);

        setLoading(true);
        try {
            await api.post('/kyc/submit', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Success hone par token hata do taaki wo dashboard na ja sake aur wait kare
            Cookies.remove('token');
            localStorage.removeItem('user');

            toast.success('KYC Submitted! Please login after admin approval.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit KYC');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Identity</h2>
                <p className="mt-2 text-gray-500 font-medium">Please submit your KYC documents to activate your wallet and network access.</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 sm:rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Document Type</label>
                            <select
                                value={formData.document_type}
                                onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            >
                                <option value="aadhar">Aadhar Card</option>
                                <option value="pan">PAN Card</option>
                                <option value="passport">Passport</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Document Number</label>
                            <input
                                type="text" required
                                value={formData.document_number}
                                onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                placeholder="Enter document number"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Upload Front Copy</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl bg-gray-50 hover:bg-gray-100 transition">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label className="relative cursor-pointer bg-transparent rounded-md font-bold text-orange-600 hover:text-orange-500 focus-within:outline-none">
                                            <span>{file ? file.name : 'Upload a file'}</span>
                                            <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} accept=".jpg,.jpeg,.png,.pdf" />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg transition-all disabled:opacity-70"
                        >
                            {loading ? 'Submitting...' : 'Submit Document'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default KycSubmit;