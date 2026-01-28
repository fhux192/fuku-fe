// VerifyEmail.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './VerifyEmail.module.css';

// ============================================================================
// Types
// ============================================================================

type StatusType = 'loading' | 'success' | 'error';

interface UIConfig {
    API: {
        VERIFY_EMAIL: string;
    };
    ROUTES: {
        LOGIN: string;
        HOME: string;
    };
    ICONS: {
        SUCCESS: string;
        ERROR: string;
        LOADING: string;
    };
    MESSAGES: {
        LOADING: string;
        SUCCESS: string;
        INVALID_TOKEN: string;
        CONNECTION_ERROR: string;
        SUCCESS_SUBTITLE: string;
        ERROR_SUBTITLE: string;
    };
    TIMING: {
        MIN_LOADING_DELAY: number;
    };
}

// ============================================================================
// Constants
// ============================================================================

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const UI_CONFIG: UIConfig = {
    API: {
        VERIFY_EMAIL: `${API_URL}/api/auth/verify-email`
    },
    ROUTES: {
        LOGIN: '/login',
        HOME: '/'
    },
    ICONS: {
        SUCCESS: 'https://cdn.lordicon.com/lomfljuq.json',
        ERROR: 'https://cdn.lordicon.com/usownftb.json',
        LOADING: 'https://cdn.lordicon.com/jpgpblwn.json'
    },
    MESSAGES: {
        LOADING: 'Đang xác thực... Vui lòng đợi.',
        SUCCESS: 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.',
        INVALID_TOKEN: 'Liên kết xác thực không hợp lệ hoặc bị thiếu.',
        CONNECTION_ERROR: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.',
        SUCCESS_SUBTITLE: 'Bạn có thể đăng nhập vào hệ thống ngay bây giờ.',
        ERROR_SUBTITLE: 'Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ.'
    },
    TIMING: {
        MIN_LOADING_DELAY: 800
    }
};

// ============================================================================
// Main Component
// ============================================================================

const VerifyEmail: React.FC = () => {
    // ------------------------------------------------------------------------
    // State & Hooks
    // ------------------------------------------------------------------------

    const [verificationStatus, setVerificationStatus] = useState<string>(UI_CONFIG.MESSAGES.LOADING);
    const [statusType, setStatusType] = useState<StatusType>('loading');
    const location = useLocation();
    const isIconDefined = useRef<boolean>(false);

    // ------------------------------------------------------------------------
    // Icon Initialization
    // ------------------------------------------------------------------------

    useEffect(() => {
        if (!isIconDefined.current) {
            try {
                defineElement(lottie.loadAnimation);
                isIconDefined.current = true;
            } catch (e) {
                // LordIcon definitions already exist
                console.warn('LordIcon definitions already exist');
            }
        }
    }, []);

    // ------------------------------------------------------------------------
    // Email Verification
    // ------------------------------------------------------------------------

    useEffect(() => {
        const verify = async (): Promise<void> => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            // Validate token presence
            if (!token) {
                setVerificationStatus(UI_CONFIG.MESSAGES.INVALID_TOKEN);
                setStatusType('error');
                return;
            }

            try {
                // Min delay prevents UI flash on fast networks
                await new Promise(resolve => setTimeout(resolve, UI_CONFIG.TIMING.MIN_LOADING_DELAY));

                const response = await fetch(`${UI_CONFIG.API.VERIFY_EMAIL}?token=${token}`);
                const responseText = await response.text();

                if (response.ok) {
                    setVerificationStatus(responseText || UI_CONFIG.MESSAGES.SUCCESS);
                    setStatusType('success');
                } else {
                    setVerificationStatus(`Lỗi xác thực: ${responseText}`);
                    setStatusType('error');
                }
            } catch (err) {
                console.error('Verification error:', err);
                setVerificationStatus(UI_CONFIG.MESSAGES.CONNECTION_ERROR);
                setStatusType('error');
            }
        };

        verify();
    }, [location]);

    // ------------------------------------------------------------------------
    // Helper Functions
    // ------------------------------------------------------------------------

    const getStatusClass = (): string => {
        switch (statusType) {
            case 'success':
                return styles.verifySuccess;
            case 'error':
                return styles.verifyError;
            default:
                return styles.verifyLoading;
        }
    };

    const getIconSrc = (): string => {
        switch (statusType) {
            case 'success':
                return UI_CONFIG.ICONS.SUCCESS;
            case 'error':
                return UI_CONFIG.ICONS.ERROR;
            default:
                return UI_CONFIG.ICONS.LOADING;
        }
    };

    const getSubtitleText = (): string => {
        return statusType === 'success'
            ? UI_CONFIG.MESSAGES.SUCCESS_SUBTITLE
            : UI_CONFIG.MESSAGES.ERROR_SUBTITLE;
    };

    const getButtonText = (): string => {
        return statusType === 'success' ? 'Đăng nhập ngay' : 'Quay về trang chủ';
    };

    const getButtonLink = (): string => {
        return statusType === 'success' ? UI_CONFIG.ROUTES.LOGIN : UI_CONFIG.ROUTES.HOME;
    };

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    return (
        <div className={styles.verifyFormWrapper}>
            <div className={styles.verifyFormBackground} aria-hidden="true" />
            <div className={styles.verifyFormOverlay} aria-hidden="true" />

            <div className={styles.verifyFormContent}>
                {/* Status Icon */}
                {/* @ts-ignore - LordIcon custom element */}
                <lord-icon
                    src={getIconSrc()}
                    trigger={statusType === 'loading' ? 'loop' : 'hover'}
                    colors={statusType === 'success' ? 'primary:#4ade80' : statusType === 'error' ? 'primary:#f87171' : 'primary:#6b7280'}
                    style={{ width: '120px', height: '120px' }}
                />

                <h1 className={styles.verifyTitle}>Xác thực Email</h1>

                {/* Status Box */}
                <div
                    className={`${styles.verifyBox} ${getStatusClass()}`}
                    role={statusType === 'error' ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    {statusType === 'loading' && (
                        <span className={styles.spinner} aria-hidden="true" />
                    )}
                    <span className={styles.verifyStatusText}>{verificationStatus}</span>
                </div>

                {/* Action Section - Only show when loading complete */}
                {statusType !== 'loading' && (
                    <div className={styles.verifyActionSection}>
                        <p className={styles.verifySubtitle}>{getSubtitleText()}</p>

                        <Link
                            to={getButtonLink()}
                            className={styles.verifyButton}
                        >
                            {getButtonText()}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;