import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Settings } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
    const [settings, setSettings] = useState({ level_1: '', level_2: '', level_3: '', joining_bonus: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/settings')
            .then(res => {
                const s = res.data.settings;
                if (s) setSettings({ level_1: s.level_1_commission, level_2: s.level_2_commission, level_3: s.level_3_commission, joining_bonus: s.joining_bonus });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleSettingsUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings Updated Successfully!');
        } catch (error) { toast.error('Failed to update settings'); }
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Settings...</div>;

    return (
        <div className="w-full relative">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <Settings className="text-orange-500" size={28} /> System Settings
                </h1>
                <p className="text-gray-500 mt-1 font-medium text-sm">Configure commission distribution and rules.</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8 max-w-3xl">
                <form onSubmit={handleSettingsUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['level_1', 'level_2', 'level_3'].map((lvl, idx) => (
                            <div key={lvl}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level {idx + 1} Commission (₹)</label>
                                <input type="number" step="0.01" value={settings[lvl]} onChange={(e) => setSettings({ ...settings, [lvl]: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800" />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Joining Bonus (₹)</label>
                            <input type="number" step="0.01" value={settings.joining_bonus} onChange={(e) => setSettings({ ...settings, joining_bonus: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-800" />
                            <p className="text-xs text-gray-400 mt-2">Credited upon KYC approval</p>
                        </div>
                    </div>
                    <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition mt-4">
                        Save Configuration
                    </button>
                </form>
            </div>
        </div>
    );
};
export default AdminSettings;