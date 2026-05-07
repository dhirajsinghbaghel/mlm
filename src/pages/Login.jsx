import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../utils/api';
import { ArrowRight, Activity } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', formData);

            // Console mein check karne ke liye ki backend kya bhej raha hai
            console.log("Login Response:", response.data);

            const { token, role, name, referral_code, kyc_status } = response.data.data;

            // Safe Role Check: Capital letter ya space ko theek karne ke liye
            const safeRole = role ? role.trim().toLowerCase() : 'user';

            // 1. Admin Bypass (Direct Login)
            if (safeRole === 'admin') {
                Cookies.set('token', token, { expires: 7 });
                // LocalStorage mein role hamesha small 'admin' hi save hoga
                localStorage.setItem('user', JSON.stringify({ name, role: 'admin', referral_code }));

                // Direct window location se bhejenge taaki koi router block na kare
                window.location.href = '/admin';
                return;
            }

            // 2. Pending Status Check (Block Login)
            if (kyc_status === 'pending') {
                setError('Your KYC is pending. Please wait for admin review.');
                setLoading(false);
                return;
            }

            // 3. Rejected Status Check
            if (kyc_status === 'rejected') {
                setError('Your KYC is rejected. Redirecting to submit again...');
                Cookies.set('token', token, { expires: 7 });
                setTimeout(() => { window.location.href = '/submit-kyc' }, 2000);
                return;
            }

            // 4. Approved Status Check (Successful Login)
            if (kyc_status === 'approved') {
                Cookies.set('token', token, { expires: 7 });
                localStorage.setItem('user', JSON.stringify({ name, role: safeRole, referral_code }));
                window.location.href = '/dashboard';
                return;
            }

            // 5. Default: Agar submit hi nahi kiya hai 
            Cookies.set('token', token, { expires: 7 });
            window.location.href = '/submit-kyc';

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Side - Dark Brand Area (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[#2a2422] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full border-[1px] border-white/5"></div>
                <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full border-[1px] border-white/5"></div>

                <div className="z-10">
                    <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-orange-500" /> AS Group
                    </h2>
                </div>

                <div className="z-10 mb-20">
                    <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                        Manage your<br />MLM network<br />with ease.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md">
                        Global commission distribution, real-time team tracking, and secure wallet management in one place.
                    </p>
                </div>
                <div className="z-10 text-gray-500 text-sm">© 2026 AS Group Inc.</div>
            </div>

            {/* Right Side - Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
                <div className="w-full max-w-md">
                    <div className="lg:hidden mb-10 flex justify-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Activity className="text-orange-500" /> AS Group
                        </h2>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

                    {error && <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange} required
                                placeholder="Email or Username"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700"
                            />
                        </div>
                        <div>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange} required
                                placeholder="Password"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700"
                            />
                        </div>

                        <div className="flex justify-start">
                            <a href="#" className="text-sm text-orange-600 hover:text-orange-700 font-medium">Forgot password?</a>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full hover:shadow-[0_8px_25px_-5px_rgba(249,115,22,0.5)] transition-all font-semibold text-lg disabled:opacity-70 mt-4"
                        >
                            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-500">
                        Don't have an account? <Link to="/register" className="text-orange-600 font-bold hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;