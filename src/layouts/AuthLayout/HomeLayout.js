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
        BTN_LOGIN: 'Đăng nhập',
        BTN_CLOSE: 'Quay lại',
        ROUTES: {
            LOGIN: '/login',
            KANA: '/kana-reference',
            COURSE: '/home/course'
        }
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

const HeroSection = memo(({ onNavigate, onOpenToggleRightSide, isRightSideOpen }) => (
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
                    className={`${styles.ctaInfoButton} ${isRightSideOpen ? styles.toggled : ''}`}
                    onClick={onOpenToggleRightSide}
                >
                    <span>{isRightSideOpen ? UI_CONFIG.TEXT.BTN_CLOSE : UI_CONFIG.TEXT.BTN_LOGIN}</span>
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

const HomeLayout = () => {
    const [isRightSideOpen, setIsRightSideOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const handleCloseDrawer = useCallback(() => {
        setIsRightSideOpen(false);
    }, []);

    const handleToggleRightSide = useCallback(() => {
        setIsRightSideOpen(prev => !prev);
        if (!isRightSideOpen) {
            navigate(UI_CONFIG.ROUTES.LOGIN);
        }
    }, [isRightSideOpen, navigate]);

    return (
        <div className={`${styles.authContainer} ${!isRightSideOpen ? styles.rightsideHidden : ''}`}>
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

                    <HeroSection
                        onNavigate={handleNavigation}
                        onOpenToggleRightSide={handleToggleRightSide}
                        isRightSideOpen={isRightSideOpen}
                    />

                    <div className={styles.overlayGradient} />
                </div>
            </main>

            {/* Mobile Modal */}
            <ContentDrawer isOpen={isRightSideOpen} onClose={handleCloseDrawer}>
                <Outlet />
            </ContentDrawer>

            {/* Desktop Right Side */}
            <aside className={`${styles.rightSideDesktop} ${!isRightSideOpen ? styles.hidden : ''}`}>
                <div className={styles.rightSideContent}>
                    <Outlet />
                </div>
            </aside>
        </div>
    );
};

export default HomeLayout;