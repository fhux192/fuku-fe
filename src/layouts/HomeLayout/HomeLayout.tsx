import React, { useState, useEffect, useCallback, memo } from 'react';
import type { KeyboardEvent } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import styles from './HomeLayout.module.css';
import logo from '../../assets/images/logo192.png';
import LoginModal from '../../components/features/auth/LoginModal/LoginModal';
import RegisterModal from '../../components/features/auth/RegisterModal/RegisterModal';
import ForgotPasswordModal from '../../components/features/auth/ForgotPasswordModal/ForgotPasswordModal';

// ============================================================================
// Types
// ============================================================================

interface KanjiItem {
    id: string;
    char: string;
    className: string;
}

interface UIConfig {
    KANJI: KanjiItem[];
    TEXT: {
        BANNER_PRE: string;
        BANNER_HIGHLIGHT: string;
        BANNER_POST: string;
        MAIN_TITLE_JP: string;
        MAIN_TITLE_HIGHLIGHT: string;
        SUBTITLE_PRE: string;
        SUBTITLE_INTERACTIVE: string;
        SUBTITLE_POST: string;
        BTN_START: string;
        BTN_LOGIN: string;
        BTN_CLOSE: string;
    };
    ROUTES: {
        LOGIN: string;
        FORGOT_PASS: string;
        KANA: string;
        COURSE: string;
        GAMIFICATION_INFO: string;
    };
    BREAKPOINTS: {
        DESKTOP: number;
    };
}

interface HeroSectionProps {
    onNavigate: (path: string) => void;
    onOpenToggleRightSide: () => void;
    isRightSideOpen: boolean;
    onGamificationClick: () => void;
}

type OutletContextType = {
    onClose: () => void;
};

// ============================================================================
// Constants
// ============================================================================

const UI_CONFIG: UIConfig = {
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
        SUBTITLE_PRE: 'Fuku - Nền tảng học tiếng Nhật được ',
        SUBTITLE_INTERACTIVE: 'game hoá',
        SUBTITLE_POST: ' thông minh miễn phí.',
        BTN_START: 'Bắt đầu ngay',
        BTN_LOGIN: 'Đăng nhập',
        BTN_CLOSE: 'Quay lại'
    },
    ROUTES: {
        LOGIN: '/login',
        FORGOT_PASS: '/forgot-password',
        KANA: '/home/course',
        COURSE: '/home/course',
        GAMIFICATION_INFO: '/about/gamification'
    },
    BREAKPOINTS: {
        DESKTOP: 1050
    }
};

// ============================================================================
// Hooks
// ============================================================================

export const useModalClose = () => {
    return useOutletContext<OutletContextType>();
};

const useIsMobile = (breakpoint: number): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
    );

    useEffect(() => {
        const handleResize = (): void => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

// ============================================================================
// Components
// ============================================================================

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

WebflowBanner.displayName = 'WebflowBanner';

const FloatingDecorations = memo(() => (
    <div className={styles.decorativeElements} aria-hidden="true">
        {UI_CONFIG.KANJI.map(({ id, char, className }) => (
            <span key={id} className={`${styles.floatingKanji} ${styles[className]}`}>
                {char}
            </span>
        ))}
    </div>
));

FloatingDecorations.displayName = 'FloatingDecorations';

const HeroSection = memo<HeroSectionProps>(({ onNavigate, onOpenToggleRightSide, isRightSideOpen, onGamificationClick }) => (
    <div className={styles.leftSideContent}>
        <section className={styles.glassCard}>
            <h1 className={styles.leftSideTitle}>
                {UI_CONFIG.TEXT.MAIN_TITLE_JP}<br />
                <span className={styles.highlightText}>
                    {UI_CONFIG.TEXT.MAIN_TITLE_HIGHLIGHT}
                </span>
            </h1>
            <p className={styles.leftSideSubtitle}>
                <strong>
                    {UI_CONFIG.TEXT.SUBTITLE_PRE}
                    <span
                        className={styles.gamifiedTerm}
                        onClick={onGamificationClick}
                        title="Tìm hiểu về phương pháp Game hoá"
                        role="button"
                        tabIndex={0}
                    >
                        {UI_CONFIG.TEXT.SUBTITLE_INTERACTIVE}
                    </span>
                    {UI_CONFIG.TEXT.SUBTITLE_POST}
                </strong>
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

HeroSection.displayName = 'HeroSection';

// ============================================================================
// Main Component
// ============================================================================

const HomeLayout: React.FC = () => {
    const [isRightSideOpen, setIsRightSideOpen] = useState<boolean>(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const isMobile = useIsMobile(UI_CONFIG.BREAKPOINTS.DESKTOP);

    const handleNavigation = useCallback((path: string): void => {
        navigate(path);
    }, [navigate]);

    const handleToggleRightSide = useCallback((): void => {
        if (isMobile) {
            setIsLoginModalOpen(prev => !prev);
        } else {
            setIsRightSideOpen(prev => !prev);
            if (!isRightSideOpen) {
                navigate(UI_CONFIG.ROUTES.LOGIN);
            }
        }
    }, [isMobile, isRightSideOpen, navigate]);

    const handleLogoClick = (): void => {
        handleNavigation(UI_CONFIG.ROUTES.LOGIN);
    };

    const handleLogoKeyDown = (e: KeyboardEvent<HTMLImageElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleNavigation(UI_CONFIG.ROUTES.LOGIN);
        }
    };

    const handleGamificationClick = useCallback((): void => {
        navigate(UI_CONFIG.ROUTES.GAMIFICATION_INFO);
    }, [navigate]);

    const handleCloseLoginModal = useCallback((): void => {
        setIsLoginModalOpen(false);
    }, []);

    const handleCloseRegisterModal = useCallback((): void => {
        setIsRegisterModalOpen(false);
    }, []);

    const handleCloseForgotPasswordModal = useCallback((): void => {
        setIsForgotPasswordModalOpen(false);
    }, []);

    const handleLoginSuccess = useCallback((): void => {
        setIsLoginModalOpen(false);
        navigate(UI_CONFIG.ROUTES.COURSE);
    }, [navigate]);

    const handleRegisterSuccess = useCallback((): void => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    }, []);

    const handleSwitchToRegister = useCallback((): void => {
        setIsLoginModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsRegisterModalOpen(true);
    }, []);

    const handleSwitchToLogin = useCallback((): void => {
        setIsRegisterModalOpen(false);
        setIsForgotPasswordModalOpen(false);
        setIsLoginModalOpen(true);
    }, []);

    const handleSwitchToForgotPass = useCallback((): void => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
        setIsForgotPasswordModalOpen(true);
    }, []);

    return (
        <div className={`${styles.authContainer} ${!isRightSideOpen ? styles.rightsideHidden : ''}`}>
            <WebflowBanner />

            <main className={styles.leftSideWrapper}>
                <div className={styles.leftSide}>
                    <img
                        src={logo}
                        alt="Fuku Logo"
                        className={styles.desktopLogo}
                        onClick={handleLogoClick}
                        onKeyDown={handleLogoKeyDown}
                        role="button"
                        tabIndex={0}
                    />

                    <div className={styles.mobileHeader}>
                        <div className={styles.logoContainerMobile}>
                            <img
                                src={logo}
                                alt="Fuku Logo"
                                className={styles.logoImage}
                                onClick={handleLogoClick}
                            />
                        </div>
                    </div>

                    <FloatingDecorations />

                    <HeroSection
                        onNavigate={handleNavigation}
                        onOpenToggleRightSide={handleToggleRightSide}
                        isRightSideOpen={isMobile ? (isLoginModalOpen || isRegisterModalOpen || isForgotPasswordModalOpen) : isRightSideOpen}
                        onGamificationClick={handleGamificationClick}
                    />

                    <div className={styles.overlayGradient} />
                </div>
            </main>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={handleCloseLoginModal}
                onLoginSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
                onSwitchToForgotPass={handleSwitchToForgotPass}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={handleCloseRegisterModal}
                onRegisterSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordModalOpen}
                onClose={handleCloseForgotPasswordModal}
                onSwitchToLogin={handleSwitchToLogin}
            />

            <aside className={`${styles.rightSideDesktop} ${!isRightSideOpen ? styles.hidden : ''}`}>
                <div className={styles.rightSideContent}>
                    <Outlet />
                </div>
            </aside>
        </div>
    );
};

export default HomeLayout;