import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
    // Initialize navigation and location hooks
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // Initialize state variables for error, loading, and success messages
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || '');

    // Handle input changes and update form state
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission for user login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', form);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem(
                'user',
                JSON.stringify(response.data.user)
            );

            navigate('/tasks');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Login failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-10 text-slate-800">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute left-[-5%] top-[-10%] h-72 w-72 rounded-full bg-slate-400/15 blur-3xl" />
                <div className="absolute bottom-[-8%] right-[-5%] h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md rounded-2xl border border-slate-200 bg-[#fcfdff]/95 p-8 shadow-[0_20px_45px_-20px_rgba(15,23,42,0.35)] backdrop-blur"
                >
                    <div className="mb-6 inline-flex rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
                        Welcome back
                    </div>

                    <h1 className="text-3xl font-semibold text-slate-900">
                        Sign in to TaskFlow
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Stay organized and keep your work moving forward.
                    </p>

                    {successMessage && (
                        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                            {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="mt-5 text-center text-sm text-slate-500">
                        Don’t have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-slate-700 transition hover:text-slate-900"
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}