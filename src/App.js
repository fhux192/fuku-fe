import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register/Register';
import VerifyEmail from './pages/auth/VerifyEmail/VerifyEmail';
import Login from './pages/auth/Login/Login';
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword/ResetPassword";
import RoadmapScreen from "./pages/RoadMap/RoadmapKanjiN5";
import Profile from './pages/auth/Profile';
import './App.css';
import HomeLayout from "./layouts/AuthLayout/HomeLayout";
import KanaReference from "./pages/KanaReference/KanaReference";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import CoursePage from "./pages/Course/CoursePage";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route element={<HomeLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                    </Route>
                    <Route element={<DashboardLayout />}>
                        {/*<Route index element={<Navigate to="/trangchu" />} />*/}
                        <Route path="/home/course" element={<CoursePage />} />
                    </Route>
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/roadmap" element={<RoadmapScreen />} />
                    <Route path="/kana-reference" element={<KanaReference />} />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;