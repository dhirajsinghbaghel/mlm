import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, History, ShieldCheck, X, Activity, User, PieChart, FileCheck, CreditCard, Settings } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <>
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-orange-500 to-red-500 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                {/* Header (Logo) */}
                <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-white" fill="currentColor" size={24} /> AS Group
                    </h2>
                    <button className="text-white/70 hover:text-white md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Area (Custom Scrollbar Hiding) */}
                {/* Tailwind custom class to hide scrollbar but keep functionality */}
                <div className="flex-1 px-4 py-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <style>{`
                        .flex-1::-webkit-scrollbar { display: none; }
                    `}</style>

                    {/* --- USER SECTION --- */}
                    <div className="space-y-1">
                        <p className="px-2 text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Main Menu</p>

                        <NavLink to="/dashboard" end onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                            <LayoutDashboard size={18} /> Dashboard
                        </NavLink>

                        <NavLink to="/dashboard/tree" onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                            <Users size={18} /> Team Tree
                        </NavLink>

                        <NavLink to="/dashboard/transactions" onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                            <History size={18} /> Passbook
                        </NavLink>

                        <NavLink to="/dashboard/profile" onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-white text-orange-600 shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                            <User size={18} /> My Profile
                        </NavLink>
                    </div>

                    {/* --- ADMIN SECTION --- */}
                    {user.role === 'admin' && (
                        <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                            <p className="px-2 text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <ShieldCheck size={12} /> Admin Control
                            </p>

                            <NavLink to="/admin/dashboard" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <PieChart size={18} /> Analytics
                            </NavLink>

                            <NavLink to="/admin/users" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <Users size={18} /> All Users
                            </NavLink>

                            <NavLink to="/admin/kyc" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <FileCheck size={18} /> Pending KYC
                            </NavLink>

                            <NavLink to="/admin/withdrawals" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <CreditCard size={18} /> Payouts
                            </NavLink>

                            <NavLink to="/admin/settings" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <Settings size={18} /> Settings
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* User Small Info at Bottom (Optional but looks premium) */}
                <div className="p-4 shrink-0 border-t border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold text-sm">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-white/60 text-xs truncate capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};
export default Sidebar;