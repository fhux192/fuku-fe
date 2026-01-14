import React, { useState, useCallback, memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './HomeLayout.module.css';
import logo from '../../assets/images/logo192.png';

const UI_CONFIG = {
    KANJI: [
        { id: 'k1', char: '夢', className: 'kanji1' },
        { id: 'k2', char: '学', className: 'kanji2' }
    ],
    TEXT: {
        BANNER_PRE: 'Hiện tại Fuku đang ',
        BANNER_HIGHLIGHT: 'miễn phí',
        BANNER_POST: ' cho tất cả mọi người',
        MAIN_TITLE_JP: '日本語を',
        MAIN_TITLE_HIGHLIGHT: '学びましょう',
        SUBTITLE: 'Fuku - Hệ thống học từ vựng tiếng Nhật thông minh miễn phí',
        BTN_START: 'Bắt đầu ngay',
        BTN_INFO: 'Tìm hiểu',
        BTN_LOGIN: 'Đăng nhập'
    },
    ROUTES: {
        LOGIN: '/login',
        KANA: '/kana-reference',
        COURSE: '/home/course'
    }
};

const WebflowBanner = memo(() => (
    <header className={styles.webflowBanner}>
        <span>
            {UI_CONFIG.TEXT.BANNER_PRE}
            <span style={{ textDecoration: 'underline' }}>
                {UI_CONFIG.TEXT.BANNER_HIGHLIGHT}
            </span>
            {UI_CONFIG.TEXT.BANNER_POST}
        </span>
    </header>
));

const FloatingDecorations = memo(() => (
    <div className={styles.decorativeElements} aria-hidden="true">
        {UI_CONFIG.KANJI.map(({ id, char, className }) => (
            <span key={id} className={`${styles.floatingKanji} ${styles[className]}`}>
                {char}
            </span>
        ))}
    </div>
));

const HeroSection = memo(({ onNavigate, onOpenLogin }) => (
    <div className={styles.leftSideContent}>
        <section className={styles.glassCard}>
            <h1 className={styles.leftSideTitle}>
                {UI_CONFIG.TEXT.MAIN_TITLE_JP}<br />
                <span className={styles.highlightText}>
                    {UI_CONFIG.TEXT.MAIN_TITLE_HIGHLIGHT}
                </span>
            </h1>
            <p className={styles.leftSideSubtitle}>
                <strong>{UI_CONFIG.TEXT.SUBTITLE}</strong>
            </p>
            <div className={styles.btnWrapper}>
                <button
                    className={styles.ctaButton}
                    onClick={() => onNavigate(UI_CONFIG.ROUTES.KANA)}
                >
                    <span>{UI_CONFIG.TEXT.BTN_START}</span>
                </button>
                <button
                    className={styles.ctaInfoButton}
                    onClick={onOpenLogin}
                >
                    <span>{UI_CONFIG.TEXT.BTN_LOGIN}</span>

                </button>
            </div>
        </section>
    </div>
));

const ContentDrawer = ({ isOpen, onClose, children }) => (
    <aside
        className={`${styles.rightSide} ${isOpen ? styles.showModal : ''}`}
        aria-expanded={isOpen}
    >
        <button
            className={styles.closeModalBtn}
            onClick={onClose}
            aria-label="Close navigation drawer"
        >
            ✕
        </button>
        <div className={styles.rightSideContent}>
            {children}
        </div>
    </aside>
);

const FloatingLoginButton = memo(({ onClick }) => (
    <button
        className={styles.floatingLoginBtn}
        onClick={onClick}
        aria-label="Navigate to course information"
    >
        <lord-icon
            src="https://cdn.lordicon.com/yhtmwrae.json"
            trigger="hover"
            state="hover-looking-around"
            colors="primary:#000000"
            style={{ width: '24px', height: '24px' }}
        />
        <span>{UI_CONFIG.TEXT.BTN_INFO}</span>
    </button>
));

const HomeLayout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = useCallback((path) => {
        navigate(path);
        setIsDrawerOpen(true);
    }, [navigate]);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const handleOpenLogin = useCallback(() => {
        navigate(UI_CONFIG.ROUTES.LOGIN);
        setIsDrawerOpen(true);
    }, [navigate]);

    const handleOpenCourse = useCallback(() => {
        navigate(UI_CONFIG.ROUTES.COURSE);
        setIsDrawerOpen(true);
    }, [navigate]);

    return (
        <div className={styles.authContainer}>
            <WebflowBanner />

            <main className={styles.leftSideWrapper}>
                <div className={styles.leftSide}>
                    <img
                        src={logo}
                        alt="Fuku Logo"
                        className={styles.desktopLogo}
                        onClick={() => handleNavigation(UI_CONFIG.ROUTES.LOGIN)}
                        role="button"
                        tabIndex={0}
                    />

                    <div className={styles.mobileHeader}>
                        <div className={styles.logoContainerMobile}>
                            <img
                                src={logo}
                                alt="Fuku Logo"
                                className={styles.logoImage}
                                onClick={() => handleNavigation(UI_CONFIG.ROUTES.LOGIN)}
                            />
                        </div>
                    </div>

                    <FloatingDecorations />

                    <HeroSection onNavigate={handleNavigation} onOpenLogin={handleOpenLogin} />

                    <div className={styles.overlayGradient} />
                </div>
            </main>

            <FloatingLoginButton onClick={handleOpenCourse} />

            <ContentDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer}>
                <Outlet />
            </ContentDrawer>
        </div>
    );
};

export default HomeLayout;