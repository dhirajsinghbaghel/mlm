import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import api from '../utils/api';
import { ArrowRight, Activity, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        sponsor_code: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-fill referral code if it's in the URL
    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (refCode) {
            setFormData((prev) => ({ ...prev, sponsor_code: refCode }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);
            if (response.status === 201) {
                // Backend se token mil gaya, auto-login karke seedha KYC page par bhej do
                const { token, role, name, referral_code } = response.data.data;
                Cookies.set('token', token, { expires: 7 });
                localStorage.setItem('user', JSON.stringify({ name, role, referral_code }));

                navigate('/submit-kyc'); // Direct to KYC page
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Left Side - Dark Brand Area (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 bg-[#2a2422] flex-col justify-between p-12 relative overflow-hidden">
                {/* Decorative background circles */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full border-[1px] border-white/5"></div>
                <div className="absolute bottom-[10%] left-[-20%] w-[600px] h-[600px] rounded-full border-[1px] border-white/5"></div>

                <div className="z-10">
                    <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-orange-500" /> AS Group
                    </h2>
                </div>

                <div className="z-10 mb-20">
                    <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                        Build your empire.<br />Track your growth.<br />Earn rewards.
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md">
                        Join the most advanced MLM network. Start building your downline and unlock multiple levels of commission today.
                    </p>
                </div>
                <div className="z-10 text-gray-500 text-sm">© 2026 AS Group Inc.</div>
            </div>

            {/* Right Side - Form Area */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10 flex justify-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                            <Activity className="text-orange-500" /> AS Group
                        </h2>
                    </div>

                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h2>
                    <p className="text-gray-500 mb-8">Join the network. Fill in your details below.</p>

                    {error && (
                        <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange} required
                                placeholder="Full Name"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700"
                            />
                        </div>
                        <div>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange} required
                                placeholder="Email Address"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700"
                            />
                        </div>
                        <div>
                            <input
                                type="password" name="password" value={formData.password} onChange={handleChange} required
                                placeholder="Create Password"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-700"
                            />
                        </div>
                        <div>
                            <input
                                type="text" name="sponsor_code" value={formData.sponsor_code} onChange={handleChange}
                                placeholder="Sponsor / Referral Code (Optional)"
                                className="w-full px-5 py-4 bg-orange-50 border border-orange-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-gray-800 font-medium placeholder-orange-300"
                            />
                            <p className="text-xs text-gray-400 mt-2 ml-2">Leave blank if you don't have a sponsor code.</p>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full hover:shadow-[0_8px_25px_-5px_rgba(249,115,22,0.5)] transition-all font-semibold text-lg disabled:opacity-70 mt-6"
                        >
                            {loading ? 'Creating Account...' : <>Sign Up <UserPlus size={20} /></>}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-500">
                        Already have an account? <Link to="/login" className="text-orange-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;