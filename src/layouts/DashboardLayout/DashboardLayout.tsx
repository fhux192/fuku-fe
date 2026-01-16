import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import logo from '../../assets/images/logo192.png';

// ============================================================================
// Types
// ============================================================================

interface NavItem {
    path: string;
    label: string;
    icon: string;
    title: string;
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

const SCROLL_THRESHOLD = 10;
const MOBILE_BREAKPOINT = 650;

// ============================================================================
// Component
// ============================================================================

const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    const [isNavVisible, setIsNavVisible] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const lastScrollY = useRef<number>(0);
    const ticking = useRef<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!isMobile) return;

        const mainDisplay = document.querySelector(`.${styles.mainDisplay}`);
        if (!mainDisplay) return;

        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = mainDisplay.scrollTop;
                    const scrollDifference = currentScrollY - lastScrollY.current;

                    if (Math.abs(scrollDifference) > SCROLL_THRESHOLD) {
                        if (scrollDifference > 0 && currentScrollY > 100) {
                            setIsNavVisible(false);
                        } else if (scrollDifference < 0) {
                            setIsNavVisible(true);
                        }
                        lastScrollY.current = currentScrollY;
                    }

                    if (currentScrollY < 100) {
                        setIsNavVisible(true);
                    }

                    ticking.current = false;
                });

                ticking.current = true;
            }
        };

        mainDisplay.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            mainDisplay.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    useEffect(() => {
        const currentNavItemRefs = navItemRefs.current;

        const handleMouseEnter = (path: string) => {
            const navItem = currentNavItemRefs.get(path);
            if (navItem) {
                const lordIcon = navItem.querySelector('lord-icon') as any;
                if (lordIcon) {
                    try {
                        if (typeof lordIcon.play === 'function') {
                            lordIcon.play();
                            return;
                        }

                        if (lordIcon.playerInstance) {
                            if (typeof lordIcon.playerInstance.stop === 'function') {
                                lordIcon.playerInstance.stop();
                            }
                            if (typeof lordIcon.playerInstance.play === 'function') {
                                lordIcon.playerInstance.play();
                                return;
                            }
                        }

                        lordIcon.setAttribute('trigger', 'none');
                        setTimeout(() => {
                            lordIcon.setAttribute('trigger', 'morph');
                            const event = new CustomEvent('trigger', { detail: 'hover' });
                            lordIcon.dispatchEvent(event);
                        }, 10);
                    } catch (error) {
                        console.log('Lord-icon animation trigger failed:', error);
                    }
                }
            }
        };

        const timeoutId = setTimeout(() => {
            currentNavItemRefs.forEach((navItem, path) => {
                const onMouseEnter = () => handleMouseEnter(path);
                navItem.addEventListener('mouseenter', onMouseEnter);

                (navItem as any)._hoverListener = onMouseEnter;
            });
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            currentNavItemRefs.forEach((navItem) => {
                if ((navItem as any)._hoverListener) {
                    navItem.removeEventListener('mouseenter', (navItem as any)._hoverListener);
                }
            });
        };
    }, []);

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleLogoClick = (): void => {
        navigate('/login');
    };

    const handleNavigation = (path: string): void => {
        navigate(path);
    };

    const handleKeyPress = (event: React.KeyboardEvent, callback: () => void): void => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    };

    const setNavItemRef = (path: string, element: HTMLDivElement | null): void => {
        if (element) {
            navItemRefs.current.set(path, element);
        } else {
            navItemRefs.current.delete(path);
        }
    };

    // ========================================================================
    // Helpers
    // ========================================================================

    const isActive = (path: string): boolean => {
        return location.pathname === path;
    };

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <div className={styles.dashboardLayout}>
            <aside
                className={`${styles.sidebar} ${isMobile && !isNavVisible ? styles.sidebarHidden : ''}`}
                aria-hidden={isMobile && !isNavVisible}
            >
                {/* Logo Area */}
                <div className={styles.logoArea}>
                    <img
                        src={logo}
                        alt="Fuku Logo"
                        className={styles.logoImage}
                        onClick={handleLogoClick}
                        onKeyDown={(e) => handleKeyPress(e, handleLogoClick)}
                        role="button"
                        tabIndex={0}
                        aria-label="Về trang đăng nhập"
                    />
                </div>

                {/* Time Display */}
                <div className={styles.timeDisplay}>
                    <div
                        className={styles.currentTime}
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {formatTime(currentTime)}
                    </div>
                    <div className={styles.currentDate}>
                        {formatDate(currentTime)}
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.navGroup} aria-label="Điều hướng chính">
                    {NAV_ITEMS.map(({ path, label, icon, title }) => (
                        <div
                            key={path}
                            ref={(el) => setNavItemRef(path, el)}
                            className={`${styles.navItem} ${isActive(path) ? styles.activeNavItem : ''}`}
                            onClick={() => handleNavigation(path)}
                            onKeyDown={(e) => handleKeyPress(e, () => handleNavigation(path))}
                            title={title}
                            role="button"
                            tabIndex={0}
                            aria-label={label}
                            aria-current={isActive(path) ? 'page' : undefined}
                        >
                            {/* @ts-ignore - lord-icon is a custom element */}
                            <lord-icon
                                src={icon}
                                trigger="morph"
                                state="morph"
                                colors="primary:#ffffff"
                                className={styles.navIcon}
                                style={{ width: '30px', height: '30px' }}
                            />
                            <span>{label}</span>
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className={styles.sidebarFooter}>
                    {/* Quick Stats */}
                    <div className={styles.quickStats} aria-label="Thống kê nhanh">
                        <div className={styles.statBox}>
                            <div
                                className={styles.statNumber}
                                aria-label="Số khóa học"
                            >
                                5
                            </div>
                            <div className={styles.statLabel}>Khóa học</div>
                        </div>
                        <div className={styles.statBox}>
                            <div
                                className={styles.statNumber}
                                aria-label="Số bài học"
                            >
                                127
                            </div>
                            <div className={styles.statLabel}>Bài học</div>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div
                        className={styles.userProfile}
                        role="button"
                        tabIndex={0}
                        aria-label="Thông tin người dùng"
                        onKeyDown={(e) => handleKeyPress(e, () => console.log('User profile clicked'))}
                    >
                        <div
                            className={styles.userAvatar}
                            aria-hidden="true"
                        >
                            HV
                        </div>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>Học viên</div>
                            <div className={styles.userStatus}>Đang hoạt động</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainDisplay} role="main">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;