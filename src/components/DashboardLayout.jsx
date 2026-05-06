import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import 'animate.css';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        // Soft gray/orange-tinted background for the whole app
        <>

            <div className="flex min-h-screen  border-0 font-sans ">
                <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col md:ml-80 transition-all   w-full">
                    <Navbar setIsSidebarOpen={setIsSidebarOpen} />
                    <div className="p-4   sm:p-8 mt-20 flex-1 overflow-x-hidden animate__animated animate__fadeIn animate__faster">
                        <div className=" bg-rose-50 p-5 rounded-2xl w-full">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );


};
export default DashboardLayout;