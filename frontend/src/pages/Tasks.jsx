import { useEffect, useState } from 'react';
import api from '../services/api';
import TaskForm from '../components/TaskForm';
import EditTaskForm from '../components/EditTaskForm';

export default function Tasks() {

    // State variables for tasks, categories, loading, error, feedback, and pagination
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    const [categoryMessage, setCategoryMessage] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [sortBy, setSortBy] = useState('due_date');
    const [sortOrder, setSortOrder] = useState('ASC');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    // Fetch tasks from the API with filters and pagination
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page,
                limit: 5,
                sort_by: sortBy,
                sort_order: sortOrder,
            };

            if (search) params.search = search;
            if (status) params.status = status;
            if (categoryId) params.category_id = categoryId;

            const response = await api.get('/tasks', { params });

            setTasks(response.data.tasks);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to load tasks'
            );
        } finally {
            setLoading(false);
            setIsDeleting(false);
        }
    };

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');

            setCategories(response.data.categories);
        } catch (error) {
            console.error(error);
        }
    };

    // Use effects to fetch tasks and categories on component mount and when filters change
    useEffect(() => {
        fetchTasks();
    }, [page, status, categoryId, search, sortBy, sortOrder]);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Use effect to clear feedback messages after 3 seconds
    useEffect(() => {
        if (!feedback.message) return;

        const timer = window.setTimeout(() => {
            setFeedback({ type: '', message: '' });
        }, 3000);

        return () => window.clearTimeout(timer);
    }, [feedback.message]);

    // Logout function to clear user data and redirect to login page
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        window.location.href = '/login';
    };

    // Handle task deletion with confirmation
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this task?'
        );

        if (!confirmed) return;

        try {
            setIsDeleting(true);
            setError('');
            await api.delete(`/tasks/${id}`);

            setFeedback({ type: 'success', message: 'Task deleted successfully.' });
            fetchTasks();
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                'Failed to delete task'
            );
        }
    };

    // Handle task editing by setting the editing task state
    const handleEdit = (task) => {
        setEditingTask(task);
    };

    // Handle category creation with validation and API call
    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            setCategoryMessage('Please enter a category name.');
            return;
        }

        try {
            setCategoryLoading(true);
            setCategoryMessage('');
            setError('');

            const response = await api.post('/categories', {
                name: categoryName.trim(),
            });

            setCategoryName('');
            setCategoryMessage(
                response.data.message || 'Category created successfully'
            );
            setFeedback({ type: 'success', message: 'Category created successfully.' });
            fetchCategories();
        } catch (error) {
            setCategoryMessage(
                error.response?.data?.message ||
                'Failed to create category'
            );
        } finally {
            setCategoryLoading(false);
        }
    };

    // Get the current user from local storage
    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    })();

    // Define styles for task status badges
    const statusStyles = {
        pending: 'bg-amber-100 text-amber-700',
        in_progress: 'bg-sky-100 text-sky-700',
        completed: 'bg-emerald-100 text-emerald-700',
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] text-slate-800">
            <header className="border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-300">
                            {currentUser?.name || 'User'}
                        </p>
                        <h1 className="text-2xl font-semibold">
                            Task Tracker
                        </h1>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6 rounded-3xl border border-slate-200 bg-[#fcfdff] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-3xl font-semibold text-slate-900">
                                My Tasks
                            </h2>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            + New Task
                        </button>
                    </div>
                </div>

                <TaskForm
                    categories={categories}
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onTaskCreated={(message) => {
                        setPage(1);
                        setFeedback({ type: 'success', message });
                        fetchTasks();
                    }}
                />

                {editingTask && (
                    <EditTaskForm
                        task={editingTask}
                        categories={categories}
                        isOpen={Boolean(editingTask)}
                        onUpdated={(message) => {
                            setEditingTask(null);
                            setFeedback({ type: 'success', message });
                            fetchTasks();
                        }}
                        onCancel={() => {
                            setEditingTask(null);
                        }}
                        onClose={() => {
                            setEditingTask(null);
                        }}
                    />
                )}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setIsCategoryPanelOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        <span>Manage Categories</span>
                        <span className="text-slate-400">
                            {isCategoryPanelOpen ? '−' : '+'}
                        </span>
                    </button>

                    {isCategoryPanelOpen && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-[#f7f9fc] p-4">
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Categories
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        View your existing categories and add a new one.
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {categories.length > 0 ? (
                                            categories.map((category) => (
                                                <span
                                                    key={category.id}
                                                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                                                >
                                                    {category.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500">
                                                No categories yet.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleCreateCategory}
                                    className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
                                >
                                    <input
                                        type="text"
                                        value={categoryName}
                                        onChange={(e) => {
                                            setCategoryName(e.target.value);
                                            setCategoryMessage('');
                                        }}
                                        placeholder="New category"
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-slate-400"
                                    />

                                    <button
                                        type="submit"
                                        disabled={categoryLoading}
                                        className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        {categoryLoading ? 'Adding...' : 'Add'}
                                    </button>
                                </form>
                            </div>

                            {categoryMessage && (
                                <p className="mt-3 text-sm text-slate-600">
                                    {categoryMessage}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 xl:grid-cols-5">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        />

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="due_date">Sort by Due Date</option>
                            <option value="status">Sort by Status</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => {
                                setSortOrder(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="ASC">Ascending</option>
                            <option value="DESC">Descending</option>
                        </select>

                        <select
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPage(1);
                            }}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                        >
                            <option value="">All Categories</option>

                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {feedback.message && (
                    <div className={`mb-6 rounded-xl border p-4 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                        {feedback.message}
                    </div>
                )}

                {isDeleting && (
                    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                        Deleting task...
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                        Loading tasks...
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                        <p>No tasks found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="rounded-2xl border border-slate-200 bg-[#fcfdff] p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {task.title}
                                            </h3>
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status] || 'bg-slate-100 text-slate-700'}`}>
                                                {task.status}
                                            </span>
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                {task.Category?.name}
                                            </span>
                                        </div>

                                        {task.description && (
                                            <p className="mt-2 text-sm text-slate-500">
                                                {task.description}
                                            </p>
                                        )}

                                        {task.due_date && (
                                            <p className="mt-3 text-sm text-slate-500">
                                                Due: {task.due_date}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-[#fcfdff] px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-slate-500">
                        Page {pagination.currentPage} of{' '}
                        {pagination.totalPages || 1}
                    </span>

                    <button
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage(page + 1)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
}