'use client';

import React from "react";
import Sidebar from "../../components/dashboard/Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#F4F7F4] overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 h-[calc(100vh-64px)]  overflow-y-auto">
                {children}
            </main>
        </div>
    );
};


export default DashboardLayout;
