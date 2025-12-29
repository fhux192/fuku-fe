import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import logo from '../../assets/images/logo192.png'

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    const handleNav = (path) => {
        navigate(path);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className={styles.dashboardLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <div className={styles.logoIcon}>
                        <img
                            src={logo}
                            alt="Logo"
                            className={styles.logoImage}
                            onClick={() => handleNav('/login')}
                        />
                    </div>
                </div>

                <nav className={styles.navGroup}>
                    <div
                        className={`${styles.navItem} ${isActive('/home') ? styles.activeNavItem : ''}`}
                        onClick={() => navigate('/home')}
                        title="Trang chủ"
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/oeotfwsx.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                            class={styles.navIcon}
                            style={{ width: '30px', height: '30px' }}>
                        </lord-icon>
                        <span>Trang chủ</span>
                    </div>

                    <div
                        className={`${styles.navItem} ${isActive('/home/course') ? styles.activeNavItem : ''}`}
                        onClick={() => navigate('/home/course')}
                        title="Khóa học"
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/hjrbjhnq.json"
                            trigger="hover"
                            colors={`${isActive('/home/course') ? 'primary:#fff' : 'primary:#ffffff'}`}
                            class={styles.navIcon}
                            style={{ width: '30px', height: '30px' }}>
                        </lord-icon>
                        <span>Khóa học</span>
                    </div>

                    {/* Lịch sử */}
                    <div
                        className={`${styles.navItem} ${isActive('/home/history') ? styles.activeNavItem : ''}`}
                        onClick={() => navigate('/home/history')}
                        title="Lịch sử"
                    >
                        <lord-icon
                            src="https://cdn.lordicon.com/ibjcmcbv.json"
                            trigger="hover"
                            colors="primary:#ffffff"
                            class={styles.navIcon}
                            style={{ width: '30px', height: '30px' }}>
                        </lord-icon>
                        <span>Lịch sử</span>
                    </div>
                </nav>
            </aside>

            <main className={styles.mainDisplay}>
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;