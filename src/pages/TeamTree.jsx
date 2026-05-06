import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MyTeamTree from '../components/TreeComponent';
import { Users, Loader, AlertCircle } from 'lucide-react';

const TeamTree = () => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ level_1: 0, level_2: 0, level_3: 0 });

    const user = JSON.parse(localStorage.getItem('user')) || {};

    useEffect(() => {
        const fetchTeamTree = async () => {
            try {
                const treeRes = await api.get('/auth/my-tree');
                setTreeData(treeRes.data.data || []);
                const statsRes = await api.get('/auth/referral-stats');
                setStats(statsRes.data.referral_stats || {});
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load team tree');
            } finally {
                setLoading(false);
            }
        };
        fetchTeamTree();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Loading your network...</div>;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Users className="text-orange-500" size={32} /> Network Hierarchy
                </h1>
                <p className="text-gray-500 mt-1 font-medium">View and manage your multi-level referral network structure.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3">
                    <AlertCircle size={24} /> <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Level 1 Referrals</p>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{stats.level_1_count || 0}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Direct network members</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Level 2 Referrals</p>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">{stats.level_2_count || 0}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Second tier network</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 hover:shadow-lg transition-shadow">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Level 3 Referrals</p>
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">{stats.level_3_count || 0}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Third tier network</p>
                </div>
            </div>

            {/* Tree View Component */}
            <MyTeamTree treeData={treeData} />

            {/* Legend */}
            <div className="mt-8 p-6 bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Tree Legend</h3>
                <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-gradient-to-b from-orange-400 to-red-500 shadow-sm border-b border-red-600"></span> You (Root)</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#60b0ff] to-[#1e88e5] shadow-sm border-b border-[#1e88e5]"></span> Member Node</div>
                    <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-md border-2 border-teal-500 bg-white shadow-sm"></span> Hover for Details</div>
                </div>
            </div>
        </div>
    );
};
export default TeamTree;