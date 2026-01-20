import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import logo from '../../assets/images/logo192.png';

// Import các Modal
import LoginModal from '../../components/features/auth/LoginModal/LoginModal';
import RegisterModal from '../../components/features/auth/RegisterModal/RegisterModal';
import ForgotPasswordModal from '../../components/features/auth/ForgotPasswordModal/ForgotPasswordModal';

// ============================================================================
// Types
// ============================================================================

interface NavItem {
    path: string;
    label: string;
    icon: string;
    title: string;
}

interface DecodedToken {
    name: string;
    sub: string;  // email
    iat: number;  // issued at
    exp: number;  // expiration
}

// ============================================================================
// Constants
// ============================================================================

const NAV_ITEMS: NavItem[] = [
    {
        path: '/home',
        label: 'Diễn đàn',
        icon: 'https://cdn.lordicon.com/oeotfwsx.json',
        title: 'Diễn đàn'
    },
    {
        path: '/home/course',
        label: 'Khóa học',
        icon: 'https://cdn.lordicon.com/hjrbjhnq.json',
        title: 'Khóa học'
    },
    {
        path: '/home/history',
        label: 'Lịch sử',
        icon: 'https://cdn.lordicon.com/ibjcmcbv.json',
        title: 'Lịch sử'
    }
];

const UI_ICONS = {
    AVATAR_DYNAMO: "https://cdn.lordicon.com/kthelypq.json", // LordIcon Avatar
    LOGOUT: "https://cdn.lordicon.com/moscxhgh.json",
    SETTINGS: "https://cdn.lordicon.com/hwuyqzpw.json"
};
const MOBILE_BREAKPOINT = 650;
const TABLET_BREAKPOINT = 1024;

// ============================================================================
// Utility Functions
// ============================================================================

const decodeJWT = (token: string): DecodedToken | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

const getUserFromToken = (): { name: string; email: string } | null => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        const decoded = decodeJWT(token);
        if (!decoded) return null;
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('authToken');
            return null;
        }
        return { name: decoded.name || 'Người dùng', email: decoded.sub || '' };
    } catch (error) {
        return null;
    }
};

// ============================================================================
// Main Component
// ============================================================================

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // ------------------------------------------------------------------------
    // UI & Screen State
    // ------------------------------------------------------------------------

    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isNavVisible] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    // ------------------------------------------------------------------------
    // Auth & Modal State
    // ------------------------------------------------------------------------

    const [userName, setUserName] = useState<string>('K');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Modal states
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState<boolean>(false);
    useRef<number>(0);
    useRef<boolean>(false);
// ------------------------------------------------------------------------
    // Initialization & Auth Sync
    // ------------------------------------------------------------------------

    const syncUserData = useCallback(() => {
        const user = getUserFromToken();
        if (user) {
            setUserName(user.name);
            setIsAuthenticated(true);
        } else {
            setUserName('Khách');
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        syncUserData();
        defineElement(lottie.loadAnimation);

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [syncUserData]);

    // Check screen size
    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < MOBILE_BREAKPOINT);
            setIsTablet(width >= MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // ------------------------------------------------------------------------
    // Modal Handlers (Switching Logic)
    // ------------------------------------------------------------------------

    const handleSwitchToRegister = useCallback(() => {
        setIsLoginModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsRegisterModalOpen(true);
    }, []);

    const handleSwitchToLogin = useCallback(() => {
        setIsRegisterModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsLoginModalOpen(true);
    }, []);

    const handleSwitchToForgotPass = useCallback(() => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
        setIsForgotPasswordModalOpen(true);
    }, []);

    const handleLoginSuccess = useCallback(() => {
        setIsLoginModalOpen(false);
        syncUserData();
    }, [syncUserData]);

    const handleRegisterSuccess = useCallback(() => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    }, []);

    // ------------------------------------------------------------------------
    // Core Handlers
    // ------------------------------------------------------------------------

    const handleLogout = (): void => {
        // 1. Xóa Token
        localStorage.removeItem('authToken');

        // 2. Cập nhật state (Sync dữ liệu về trạng thái Khách)
        syncUserData();

        // 3. Đóng các menu đang mở
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);

        // 4. KHÔNG dùng navigate() để ở lại trang hiện tại
        console.log("Đã đăng xuất. Người dùng vẫn ở lại trang:", location.pathname);
    };

    const handleUserProfileClick = (): void => {
        if (isAuthenticated) {
            if (isMobile || isTablet) setIsMobileMenuOpen(prev => !prev);
            else setIsDropdownOpen(prev => !prev);
        } else {
            setIsLoginModalOpen(true);
        }
    };

    const handleNavigation = (path: string): void => {
        navigate(path);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    // ------------------------------------------------------------------------
    // Helper Renders
    // ------------------------------------------------------------------------

    const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (date: Date) => date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className={styles.dashboardLayout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isMobile && !isNavVisible ? styles.sidebarHidden : ''}`}>
                <div className={styles.logoArea}>
                    <img src={logo} alt="Fuku Logo" className={styles.logoImage} onClick={() => navigate('/home')} style={{cursor: 'pointer'}} />
                </div>

                <div className={styles.timeDisplay}>
                    <div className={styles.currentTime}>{formatTime(currentTime)}</div>
                    <div className={styles.currentDate}>{formatDate(currentTime)}</div>
                </div>

                <nav className={styles.navGroup}>
                    {NAV_ITEMS.map(({ path, label, icon }) => (
                        <div
                            key={path}
                            className={`${styles.navItem} ${isActive(path) ? styles.activeNavItem : ''}`}
                            onClick={() => handleNavigation(path)}
                            role="button"
                            tabIndex={0}
                        >
                            {/* @ts-ignore */}
                            <lord-icon
                                src={icon}
                                trigger="morph"
                                colors="primary:#ffffff"
                                style={{ width: '30px', height: '30px' }}
                            />
                            <span>{label}</span>
                        </div>
                    ))}

                    {/* Mobile/Tablet Avatar Item */}
                    {(isMobile || isTablet) && (
                        <div className={styles.navUserProfileContainer} ref={mobileMenuRef}>
                            <div className={`${styles.navItem} ${styles.navUserProfile}`} onClick={handleUserProfileClick}>
                                <div className={styles.navUserAvatar}>
                                    {/* @ts-ignore */}
                                    <lord-icon
                                        src={UI_ICONS.AVATAR_DYNAMO}
                                        trigger="hover"
                                        state="hover-looking-around"
                                        colors="primary:#1e293b"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                                <span>{userName}</span>
                            </div>

                            {/* Mobile Menu Dropdown */}
                            {isMobileMenuOpen && isAuthenticated && (
                                <div className={styles.mobileMenuDropdown}>
                                    <button className={styles.mobileMenuItem} onClick={() => setIsMobileMenuOpen(false)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"/></svg>
                                        <span>Hồ sơ cá nhân</span>
                                    </button>
                                    <div className={styles.mobileMenuDivider} />
                                    <button className={`${styles.mobileMenuItem} ${styles.mobileMenuItemDanger}`} onClick={handleLogout}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9"/></svg>
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                {/* Sidebar Footer - Desktop only */}
                <div className={styles.sidebarFooter}>
                    <div className={styles.quickStats}>
                        <div className={styles.statBox}>
                            <div className={styles.statNumber}>5</div>
                            <div className={styles.statLabel}>Khóa học</div>
                        </div>
                        <div className={styles.statBox}>
                            <div className={styles.statNumber}>127</div>
                            <div className={styles.statLabel}>Bài học</div>
                        </div>
                    </div>

                    <div className={styles.userProfileContainer} ref={dropdownRef}>
                        <div className={styles.userProfile} onClick={handleUserProfileClick}>
                            <div className={styles.userAvatar}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={UI_ICONS.AVATAR_DYNAMO}
                                    trigger="hover"
                                    state="hover-looking-around"
                                    colors="primary:#1e293b"
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName}>{userName}</div>
                                <div className={styles.userStatus}>Đang hoạt động</div>
                            </div>
                        </div>

                        {/* Desktop Dropdown */}
                        {isDropdownOpen && isAuthenticated && (
                            <div className={styles.dropdownMenu}>
                                <button className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                    <span>Hồ sơ cá nhân</span>
                                </button>
                                <div className={styles.dropdownDivider} />
                                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainDisplay}>
                <Outlet />
            </main>

            {/* Auth Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
                onSwitchToForgotPass={handleSwitchToForgotPass}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={() => setIsForgotPasswordModalOpen(false)}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </div>
    );
};

export default DashboardLayout;