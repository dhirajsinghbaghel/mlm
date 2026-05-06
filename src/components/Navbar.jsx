import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, User, Menu, Search } from 'lucide-react';

const Navbar = ({ setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const handleLogout = () => { Cookies.remove('token'); localStorage.removeItem('user'); navigate('/login'); };

    return (
        <div className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 fixed top-0 right-0 left-0 md:left-64 z-30 shadow-[0_4px_30px_rgb(0,0,0,0.03)] transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-xl text-gray-500 hover:bg-orange-50 md:hidden">
                    <Menu size={24} />
                </button>
                {/* Search Bar matching the dashboard image */}
                <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2.5 w-64 border border-gray-100">
                    <Search size={18} className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-gray-600" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-gray-800">My ID</span>
                    <span className="text-xs text-orange-500 font-medium">{JSON.parse(localStorage.getItem('user'))?.referral_code}</span>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};
export default Navbar;