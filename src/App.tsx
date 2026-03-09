
// ============================================================================
// App.tsx
// ============================================================================

import React from 'react';
import type { FC} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Pages
import Register from './pages/Auth/Register/Register';
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail';
import Login from './pages/Auth/Login/Login';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword';
import CoursePage from './pages/Course/CoursePage';
import Profile from "./pages/Profile/Profile";
import History from "./pages/History/History";

// Layouts
import HomeLayout from './layouts/HomeLayout/HomeLayout';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';

import './App.css';

// ============================================================================
// Constants
// ============================================================================
const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    ROADMAP: '/roadmap',
    HOME_COURSE: '/home/course',
    PROFILE: '/profile',
    HOME_HISTORY:'/home/history',
} as const;

// ============================================================================
// Types
// ============================================================================

// interface PrivateRouteProps {
//     children: ReactNode;
// }

// ============================================================================
// Components
// ============================================================================

// const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
//     const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
//     return token ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
// };

// ============================================================================
// Main App
// ============================================================================

const App: FC = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public auth routes */}
                    <Route element={<HomeLayout />}>
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    </Route>

                    {/* Dashboard routes - TODO: Add PrivateRoute wrapper */}
                    <Route element={<DashboardLayout />}>
                        <Route path={ROUTES.HOME_COURSE} element={<CoursePage />} />
                        <Route path={ROUTES.HOME_HISTORY} element={<History />} />
                    </Route>

                    {/* Standalone routes */}
                    <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={ROUTES.PROFILE} element={<Profile />} />

                    {/* Default redirect */}
                    <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;