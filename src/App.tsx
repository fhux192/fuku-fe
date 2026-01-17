/**
 * Main App component - handles routing and layout structure
 */

import React from 'react';
import type { FC, ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Pages
import Register from './pages/auth/Register/Register';
import VerifyEmail from './pages/auth/VerifyEmail/VerifyEmail';
import Login from './pages/auth/Login/Login';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import RoadmapScreen from './pages/RoadMap/RoadmapKanjiN5';
import KanaReference from './pages/KanaReference/KanaReference';
import CoursePage from './pages/CoursePage/CoursePage';

// Layouts
import HomeLayout from './layouts/AuthLayout/HomeLayout';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';

import './App.css';

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
} as const;

const ROUTES = {
    ROOT: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    VERIFY_EMAIL: '/verify-email',
    ROADMAP: '/roadmap',
    KANA_REFERENCE: '/kana-reference',
    HOME_COURSE: '/home/course',
} as const;

// ============================================================================
// Types
// ============================================================================

interface PrivateRouteProps {
    children: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Protects routes requiring authentication
 * Redirects to login if token not found
 */
const PrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />;
};

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
                    </Route>

                    {/* Standalone routes */}
                    <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                    <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={ROUTES.ROADMAP} element={<RoadmapScreen />} />
                    <Route path={ROUTES.KANA_REFERENCE} element={<KanaReference />} />

                    {/* Default redirect */}
                    <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;