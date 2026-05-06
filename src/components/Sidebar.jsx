import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, History, ShieldCheck, X, Activity } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const user = JSON.parse(localStorage.getItem('user')) || {};

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
            )}

            <div className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-orange-500 to-red-500 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>

                <div className="h-20 flex items-center justify-between px-8 border-b border-white/10">
                    <h2 className=" text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-white" fill="currentColor" size={28} /> AS Group.net
                    </h2>
                    <button className="text-white/70 hover:text-white md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 p-5 space-y-3 mt-4 overflow-y-auto">


                    <NavLink to="/dashboard" end onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>

                    <NavLink to="/dashboard/tree" onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                        <Users size={20} /> Team Tree
                    </NavLink>

                    <NavLink to="/dashboard/transactions" onClick={() => setIsSidebarOpen(false)}
                        className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                        <History size={20} /> Passbook
                    </NavLink>

                    {user.role === 'admin' && (
                        <div className="  border-t border-white/10">

                            <NavLink to="/admin" onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-white text-orange-600 shadow-lg' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                                <ShieldCheck size={20} /> Panel
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default Sidebar;