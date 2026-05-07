import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Phone, ShieldCheck, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const userData = response.data.user;
            setProfile(userData);
            setFormData({
                name: userData.name || '',
                phone: userData.phone || ''
            });
        } catch (error) {
            toast.error('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/auth/profile', formData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            fetchProfile();

            // Update local storage so navbar reflects the change
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                storedUser.name = formData.name;
                localStorage.setItem('user', JSON.stringify(storedUser));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const getKycBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-600 font-medium text-xs rounded-full flex items-center gap-1 w-max"><ShieldCheck size={14} /> Verified</span>;
            case 'pending':
                return <span className="px-2.5 py-1 bg-yellow-50 border border-yellow-200 text-yellow-600 font-medium text-xs rounded-full flex items-center gap-1 w-max"><AlertCircle size={14} /> Pending Review</span>;
            case 'rejected':
                return <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-600 font-medium text-xs rounded-full flex items-center gap-1 w-max"><X size={14} /> Rejected</span>;
            default:
                return <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 font-medium text-xs rounded-full flex items-center gap-1 w-max"><AlertCircle size={14} /> Not Submitted</span>;
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400 text-sm">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">My Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your personal information and network status.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white border border-gray-200 text-gray-700 font-medium text-sm sm:text-base rounded-xl hover:bg-gray-50 transition shadow-sm w-full sm:w-auto"
                    >
                        <Edit2 size={16} /> Edit Profile
                    </button>
                )}
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                {/* Banner with integrated Avatar */}
                <div className="h-28 sm:h-36 bg-gradient-to-r from-orange-400 to-red-500 w-full px-5 sm:px-8 flex items-center">
                    {/* Avatar Inside Banner */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-inner">
                        <span className="text-3xl sm:text-4xl font-semibold text-white uppercase">{profile?.name?.charAt(0)}</span>
                    </div>
                </div>

                {/* Content Area - mt-14 removed as avatar no longer overlaps */}
                <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-6 sm:pt-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Left Column - Details or Form */}
                        <div className="md:col-span-2 space-y-5 sm:space-y-6">
                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-5 bg-gray-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-100">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-gray-800"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="Enter phone number"
                                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm sm:text-base text-gray-800"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-3">
                                        <button type="button" onClick={() => { setIsEditing(false); setFormData({ name: profile.name, phone: profile.phone || '' }); }} className="flex-1 px-4 py-2.5 sm:py-3 bg-white border border-gray-200 text-gray-600 font-medium text-sm sm:text-base rounded-xl hover:bg-gray-50 transition">
                                            Cancel
                                        </button>
                                        <button type="submit" className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium text-sm sm:text-base rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2">
                                            <Check size={18} /> Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 flex items-center gap-1.5"><User size={14} /> Name</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{profile?.name}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 flex items-center gap-1.5"><Mail size={14} /> Email Address</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{profile?.email}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1 flex items-center gap-1.5"><Phone size={14} /> Phone Number</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">{profile?.phone || <span className="text-gray-400 font-normal">Not provided</span>}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-4 sm:p-5 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2 flex items-center gap-1.5"><ShieldCheck size={14} /> KYC Status</p>
                                        {getKycBadge(profile?.kyc_status)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Stats */}
                        <div className="space-y-4">
                            {/* Network Stat */}
                            <div className="bg-orange-50 p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-orange-100/50 text-center">
                                <p className="text-xs sm:text-sm text-orange-600 font-medium mb-1">Total Network Team</p>
                                <h3 className="text-3xl sm:text-4xl font-semibold text-orange-500">{profile?.total_referrals}</h3>
                                <p className="text-xs text-orange-400 mt-1 sm:mt-2">Direct Referrals</p>
                            </div>

                            {/* Referral Code Stat */}
                            <div className="bg-gray-900 p-5 sm:p-6 rounded-xl sm:rounded-2xl text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-white/5 rounded-bl-full"></div>
                                <p className="text-xs sm:text-sm text-gray-400 font-medium mb-2">My Referral Code</p>
                                <div className="bg-white/10 py-2 px-3 sm:px-4 rounded-lg sm:rounded-xl border border-white/10 inline-block">
                                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-wider">{profile?.referral_code}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;