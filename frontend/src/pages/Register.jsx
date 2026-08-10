import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    // Initialize navigation hook
    const navigate = useNavigate();

    // Initialize form state with default values
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes and update form state
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission for user registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', {
                name: form.name,
                email: form.email,
                password: form.password,
                confirmPassword: form.confirmPassword,
            });

            navigate('/login', {
                state: { successMessage: 'Account created successfully. Please sign in.' },
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Registration failed'
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
                        Create account
                    </div>

                    <h1 className="text-3xl font-semibold text-slate-900">
                        Start your workspace
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Create an account to organize tasks with confidence.
                    </p>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                            required
                        />

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

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
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
                        {loading ? 'Creating...' : 'Sign Up'}
                    </button>

                    <p className="mt-5 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-medium text-slate-700 transition hover:text-slate-900"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}