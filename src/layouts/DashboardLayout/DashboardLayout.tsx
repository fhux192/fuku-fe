// ============================================================================
// DashboardLayout.tsx
// ============================================================================
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

// Assets & Components
import logo from '../../assets/images/logo/logo192.png';
import LoginModal from '../../features/auth/components/LoginModal/LoginModal';
import RegisterModal from '../../features/auth/components/RegisterModal/RegisterModal';
import ForgotPasswordModal from '../../features/auth/components/ForgotPasswordModal/ForgotPasswordModal';
import Toast from '../../components/ui/Toast/Toast';
import DailyLoginModal from '../../features/gamification/components/DailyLoginModal/DailyLoginModal';
import FloatingActionButton, { FabAction } from './components/FloatingActionButton';

// Utils & Hooks & Types
import { getUserFromToken } from '../../utils/auth.utils';
import { useParentHoverLordIcon } from '../../hooks/useParentHoverLordIcon';
import { LordIconElement } from '../../types/lordicon';

// ============================================================================
// Types
// ============================================================================
interface NavItem {
    path: string;
    label: string;
    icon: string;
    title: string;
    requiresAuth?: boolean;
}
interface UserLevelData {
    userId: number;
    userName: string;
    totalXp: number;
    levelNumber: number;
    rankName: string;
    stage: string;
    icon: string;
    progressPercent: number;
    xpToNextLevel: number;
    nextLevelXp: number | null;
    nextRankName: string | null;
    isMaxLevel: boolean;
    rankPosition: number;
}
interface DailyLoginData {
    firstLoginToday: boolean;
    loginDate: string;
    currentStreak: number;
    xpEarned: number;
    leveledUp: boolean;
    message: string;
    levelInfo: UserLevelData;
}

// ============================================================================
// Constants
// ============================================================================
const NAV_ITEMS: NavItem[] = [
    { path: '/home', label: 'Diễn đàn', icon: 'https://cdn.lordicon.com/oeotfwsx.json', title: 'Diễn đàn', requiresAuth: false },
    { path: '/home/course', label: 'Bài tập', icon: 'https://cdn.lordicon.com/hjrbjhnq.json', title: 'Bài học', requiresAuth: false },
    { path: '/home/shop', label: 'Vật phẩm', icon: 'https://cdn.lordicon.com/zmvzumis.json', title: 'Lịch sử', requiresAuth: true },
    { path: '/home/history', label: 'Lịch sử', icon: 'https://cdn.lordicon.com/ibjcmcbv.json', title: 'Lịch sử', requiresAuth: true }
];

const FAB_ACTIONS: FabAction[] = [
    { id: 'chat', icon: 'https://cdn.lordicon.com/fdxqrdfe.json', label: 'Chat hỗ trợ', color: '#4ade80', onClick: () => console.log('Chat support clicked') },
    { id: 'email', icon: 'https://cdn.lordicon.com/rhvddzym.json', label: 'Gửi email', color: '#60a5fa', onClick: () => console.log('Email clicked') },
    { id: 'phone', icon: 'https://cdn.lordicon.com/pkmkagva.json', label: 'Hotline', color: '#f472b6', onClick: () => console.log('Phone clicked') }
];

const MOBILE_BREAKPOINT = 650;
const TABLET_BREAKPOINT = 1024;
const SCROLL_THRESHOLD = 50;

const STAGE_COLORS: Record<string, string> = {
    'MAM_NON': '#4ade80', 'TIEU_HOC': '#FFEB3B', 'THCS': '#FF9800', 'THPT': '#2196F3',
    'CAO_DANG': '#9C27B0', 'DAI_HOC': '#E91E63', 'THAC_SI': '#00BCD4', 'TIEN_SI': '#F44336',
    'PHO_GIAO_SU': '#FF5722', 'GIAO_SU': '#FFD700',
};

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    LEVEL: '/levels/me',
    DAILY_LOGIN: '/levels/daily-login'
};

const DEFAULT_AVATAR = 'https://cdn.lordicon.com/bushiqea.json';

// ============================================================================
// Utility Functions (Local)
// ============================================================================
const getStageColor = (stage: string | undefined): string => stage ? STAGE_COLORS[stage] || '#ffffff' : '#ffffff';
const formatXp = (xp: number): string => xp >= 1000 ? (xp / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : xp.toString();

// ============================================================================
// Main Component
// ============================================================================
const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef<number>(0);

    const navParentRefs = useRef<Record<string, HTMLElement | null>>({});
    const navIconRefs = useRef<Record<string, LordIconElement | null>>({});

    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>('Khách');
    const [userAvatar, setUserAvatar] = useState<string>(DEFAULT_AVATAR);
    const [, setUserId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState<boolean>(false);
    const [pendingAuthPath, setPendingAuthPath] = useState<string | null>(null);

    const [userLevel, setUserLevel] = useState<UserLevelData | null>(null);
    const [isLoadingLevel, setIsLoadingLevel] = useState<boolean>(false);

    const [toastConfig, setToastConfig] = useState<{ isVisible: boolean; message: string; type: 'success' | 'error' | 'info'; }>({
        isVisible: false, message: '', type: 'success'
    });
    const [dailyLoginModal, setDailyLoginModal] = useState({
        isOpen: false, streak: 0, xpEarned: 0, leveledUp: false, currentRank: '', icon: '🌱', message: ''
    });

    const navPaths = NAV_ITEMS.map(item => item.path);
    useParentHoverLordIcon(navParentRefs, navIconRefs, navPaths);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToastConfig({ isVisible: true, message, type });
    }, []);
    const hideToast = useCallback(() => {
        setToastConfig(prev => ({ ...prev, isVisible: false }));
    }, []);

    const fetchUserLevel = useCallback(async (uid: number) => {
        setIsLoadingLevel(true);
        try {
            const token = localStorage.getItem('authToken');
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.LEVEL}/${uid}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) setUserLevel(result.data);
                else if (result.userId && result.totalXp !== undefined) setUserLevel(result as UserLevelData);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoadingLevel(false);
        }
    }, []);

    const claimDailyLoginBonus = useCallback(async (uid: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const url = `${API_CONFIG.BASE_URL}${API_CONFIG.DAILY_LOGIN}/${uid}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const data: DailyLoginData = result.data;
                    if (data.firstLoginToday) {
                        if (data.levelInfo) setUserLevel(data.levelInfo);
                        setDailyLoginModal({
                            isOpen: true, streak: data.currentStreak, xpEarned: data.xpEarned,
                            leveledUp: data.leveledUp, currentRank: data.levelInfo?.rankName || '',
                            icon: data.levelInfo?.icon || '🌱', message: data.message
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error claiming daily login:', error);
        }
    }, []);

    const syncUserData = useCallback(() => {
        const user = getUserFromToken();
        if (user) {
            setUserName(user.name); setUserAvatar(user.avatar || DEFAULT_AVATAR);
            setIsAuthenticated(true);
            if (user.userId) {
                setUserId(user.userId); fetchUserLevel(user.userId); claimDailyLoginBonus(user.userId);
            }
        } else {
            setUserName('Khách'); setUserAvatar(DEFAULT_AVATAR);
            setIsAuthenticated(false); setUserId(null); setUserLevel(null);
        }
    }, [fetchUserLevel, claimDailyLoginBonus]);

    useEffect(() => {
        const handleStorageChange = () => syncUserData();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [syncUserData]);

    useEffect(() => { syncUserData(); }, [location.pathname, syncUserData]);

    const handleLoginSuccess = useCallback(() => {
        setIsLoginModalOpen(false); syncUserData(); showToast('Đăng nhập thành công!', 'success');
        if (pendingAuthPath) { navigate(pendingAuthPath); setPendingAuthPath(null); }
    }, [syncUserData, showToast, pendingAuthPath, navigate]);

    const handleLogout = (): void => {
        localStorage.removeItem('authToken'); setUserLevel(null); syncUserData();
        setIsDropdownOpen(false); setIsMobileMenuOpen(false); showToast('Đăng xuất thành công!', 'success');
        navigate('/home/course');
    };

    useEffect(() => {
        defineElement(lottie.loadAnimation);
        syncUserData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [syncUserData]);

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            setIsMobile(width < MOBILE_BREAKPOINT);
            setIsTablet(width >= MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
            if (width >= MOBILE_BREAKPOINT) setIsNavVisible(true);
        };
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) setIsMobileMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMainContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!isMobile) return;
        const target = e.currentTarget;
        const currentScrollY = target.scrollTop;
        const scrollDiff = currentScrollY - lastScrollY.current;
        const atBottom = currentScrollY + target.clientHeight >= target.scrollHeight - 1;

        if (Math.abs(scrollDiff) > SCROLL_THRESHOLD) {
            if (scrollDiff > 0 && !atBottom) {
                setIsNavVisible(false); setIsMobileMenuOpen(false);
            } else if (scrollDiff < 0) {
                setIsNavVisible(true);
            }
            lastScrollY.current = currentScrollY;
        }
        if (atBottom) setIsNavVisible(true);
    };

    const handleUserProfileClick = (): void => {
        if (isAuthenticated) {
            (isMobile || isTablet) ? setIsMobileMenuOpen(prev => !prev) : setIsDropdownOpen(prev => !prev);
        } else setIsLoginModalOpen(true);
    };

    const handleNavigation = (path: string, requiresAuth: boolean = false): void => {
        if (requiresAuth && !isAuthenticated) {
            setPendingAuthPath(path); setIsLoginModalOpen(true); return;
        }
        navigate(path);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formatDate = (date: Date) => date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const isActive = (path: string) => location.pathname === path;
    const userNameColor = userLevel ? getStageColor(userLevel.stage) : '#ffffff';

    const renderLevelInfo = () => {
        if (isLoadingLevel) {
            return (
                <div className={styles.levelInfoContainer}>
                    <div className={styles.levelLoading}><div className={styles.loadingSpinner} /><span>Đang tải...</span></div>
                </div>
            );
        }
        if (!userLevel) {
            return (
                <div className={styles.levelInfoContainer}>
                    <div className={styles.levelHeader}>
                        <span className={styles.levelIcon}>🌱</span>
                        <div className={styles.levelDetails}>
                            <span className={styles.levelRankName} style={{ color: '#4ade80' }}>Mầm non 1</span>
                            <span className={styles.levelPosition}>Chưa có dữ liệu</span>
                        </div>
                    </div>
                    <div className={styles.xpProgressContainer}>
                        <div className={styles.xpText}><span className={styles.xpCurrent}>0 XP</span><span className={styles.xpNext}>/ 250 XP</span></div>
                        <div className={styles.progressBarContainer}><div className={styles.progressBar} style={{ width: '0%', background: '#4ade80' }} /></div>
                        <div className={styles.xpRemaining}>Còn <strong>250</strong> XP để lên <span style={{ color: '#4ade80' }}>Mầm non 2</span></div>
                    </div>
                </div>
            );
        }
        return (
            <div className={styles.levelInfoContainer}>
                <div className={styles.levelHeader}>
                    <span className={styles.levelIcon}>{userLevel.icon}</span>
                    <div className={styles.levelDetails}>
                        <span className={styles.levelRankName} style={{ color: getStageColor(userLevel.stage) }}>{userLevel.rankName}</span>
                        <span className={styles.levelPosition}>Hạng #{userLevel.rankPosition}</span>
                    </div>
                </div>
                <div className={styles.xpProgressContainer}>
                    <div className={styles.xpText}>
                        <span className={styles.xpCurrent}>{formatXp(userLevel.totalXp)} XP</span>
                        {!userLevel.isMaxLevel && userLevel.nextLevelXp && <span className={styles.xpNext}>/ {formatXp(userLevel.nextLevelXp)} XP</span>}
                    </div>
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBar} style={{ width: `${Math.min(userLevel.progressPercent, 100)}%`, background: getStageColor(userLevel.stage) }} />
                    </div>
                    {!userLevel.isMaxLevel ? (
                        <div className={styles.xpRemaining}>Còn <strong>{formatXp(userLevel.xpToNextLevel)}</strong> XP để lên <span style={{ color: getStageColor(userLevel.stage) }}>{userLevel.nextRankName}</span></div>
                    ) : (
                        <div className={styles.maxLevelBadge}>🎉 Đã đạt cấp tối đa!</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.dashboardLayout}>
            <Toast message={toastConfig.message} type={toastConfig.type} isVisible={toastConfig.isVisible} onClose={hideToast} duration={1500} />
            <DailyLoginModal isOpen={dailyLoginModal.isOpen} onClose={() => setDailyLoginModal(prev => ({ ...prev, isOpen: false }))} streak={dailyLoginModal.streak} xpEarned={dailyLoginModal.xpEarned} leveledUp={dailyLoginModal.leveledUp} currentRank={dailyLoginModal.currentRank} icon={dailyLoginModal.icon} message={dailyLoginModal.message} />

            <aside className={`${styles.sidebar} ${isMobile ? (isNavVisible ? styles.sidebarVisible : styles.sidebarHidden) : ''}`}>
                <div className={styles.logoArea}>
                    <img src={logo} alt="Fuku Logo" className={styles.logoImage} onClick={() => navigate('/')} />
                </div>
                <div className={styles.timeDisplay}>
                    <div className={styles.currentTime}>{formatTime(currentTime)}</div>
                    <div className={styles.currentDate}>{formatDate(currentTime)}</div>
                </div>

                <nav className={styles.navGroup}>
                    {NAV_ITEMS.map(({ path, label, icon, requiresAuth }) => (
                        <div key={path} ref={(el) => { navParentRefs.current[path] = el; }} className={`${styles.navItem} ${isActive(path) ? styles.activeNavItem : ''}`} onClick={() => handleNavigation(path, requiresAuth)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNavigation(path, requiresAuth); }}>
                            <lord-icon ref={(el: LordIconElement) => { navIconRefs.current[path] = el; }} src={icon} trigger="hover" colors="primary:#ffffff" style={{ width: '25px', height: '25px' }} />
                            <span>{label}</span>
                        </div>
                    ))}
                    {(isMobile || isTablet) && (
                        <div className={styles.navUserProfileContainer} ref={mobileMenuRef}>
                            <div className={`${styles.navItem} ${styles.navUserProfile}`} onClick={handleUserProfileClick}>
                                <div className={styles.navUserAvatar}>
                                    <lord-icon trigger='morph' key={userAvatar} src={userAvatar} colors={!isAuthenticated ? "primary:#ffffff" : undefined} style={{ width: '25px', height: '25px' }} />
                                </div>
                                <span className={styles.navUserName} style={{ color: userNameColor }}>{isAuthenticated ? userName : 'Khách'}</span>
                            </div>
                            {isMobileMenuOpen && isAuthenticated && (
                                <div className={styles.mobileMenuDropdown}>
                                    {renderLevelInfo()}
                                    <div className={styles.mobileMenuDivider} />
                                    <button className={styles.mobileMenuItem} onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" /></svg>
                                        <span>Hồ sơ cá nhân</span>
                                    </button>
                                    <div className={styles.mobileMenuDivider} />
                                    <button className={`${styles.mobileMenuItem} ${styles.mobileMenuItemDanger}`} onClick={handleLogout}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9" /></svg>
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.quickStats}>
                        <div className={styles.statBox}><div className={styles.statNumber}>5</div><div className={styles.statLabel}>Khóa học</div></div>
                        <div className={styles.statBox}><div className={styles.statNumber}>127</div><div className={styles.statLabel}>Bài học</div></div>
                    </div>
                    <div className={styles.userProfileContainer} ref={dropdownRef}>
                        <div className={styles.userProfile} onClick={handleUserProfileClick}>
                            <div className={styles.userAvatar}>
                                <lord-icon key={userAvatar} src={userAvatar} trigger="loop" style={{ width: '32px', height: '32px' }} />
                            </div>
                            <div className={styles.userInfo}>
                                <div className={styles.userName} style={{ color: userNameColor }}>{userName}</div>
                                <div className={styles.userStatus}>
                                    {userLevel ? <span style={{ color: getStageColor(userLevel.stage) }}>{userLevel.icon} {userLevel.rankName}</span> : isAuthenticated ? <span style={{ color: '#4ade80' }}>🌱 Mầm non 1</span> : 'Chưa đăng nhập'}
                                </div>
                            </div>
                        </div>
                        {isDropdownOpen && isAuthenticated && (
                            <div className={styles.dropdownMenu}>
                                {renderLevelInfo()}
                                <div className={styles.dropdownDivider} />
                                <button className={styles.dropdownItem} onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" /></svg>
                                    <span>Hồ sơ cá nhân</span>
                                </button>
                                <div className={styles.dropdownDivider} />
                                <button className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={handleLogout}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12L16 7M21 12H9" /></svg>
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className={styles.mainDisplay} onScroll={handleMainContentScroll} ref={mainContentRef}>
                <Outlet />
            </main>

            <FloatingActionButton
                actions={FAB_ACTIONS}
                isVisible={!isMobile || isNavVisible}
                showToast={showToast}
            />

            <LoginModal isOpen={isLoginModalOpen} onClose={() => { setIsLoginModalOpen(false); setPendingAuthPath(null); }} onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }} onSwitchToForgotPass={() => { setIsLoginModalOpen(false); setIsForgotPasswordModalOpen(true); }} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }} />
            <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} onSwitchToLogin={() => { setIsForgotPasswordModalOpen(false); setIsLoginModalOpen(true); }} />
        </div>
    );
};

export default DashboardLayout;