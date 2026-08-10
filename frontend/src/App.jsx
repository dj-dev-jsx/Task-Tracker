import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate to="/tasks" replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;