import { useEffect, useState } from 'react';
import api from '../services/api';

export default function EditTaskForm({
    task,
    categories,
    isOpen,
    onUpdated,
    onCancel,
    onClose,
}) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'pending',
        due_date: '',
        category_id: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setForm({
                title: task.title || '',
                description: task.description || '',
                status: task.status || 'pending',
                due_date: task.due_date || '',
                category_id: task.category_id || '',
            });
        }
    }, [task]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            await api.put(`/tasks/${task.id}`, {
                ...form,
                category_id: Number(form.category_id),
            });

            onUpdated?.('Task updated successfully.');
            onClose?.();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to update task'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                            Edit Task
                        </h3>
                        <p className="text-sm text-slate-500">
                            Update your task.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            required
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="">Select category</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onCancel?.();
                                onClose?.();
                            }}
                            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}