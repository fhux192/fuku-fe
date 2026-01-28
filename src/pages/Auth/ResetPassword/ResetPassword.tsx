// ResetPassword.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import styles from './ResetPassword.module.css';

// ============================================================================
// Types
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface FormData {
    newPassword: string;
    confirmPassword: string;
}

interface UIConfig {
    API: {
        RESET_PASSWORD: string;
    };
    ROUTES: {
        LOGIN: string;
    };
    ICONS: {
        LOCK: string;
        EYE: string;
    };
    MESSAGES: {
        PASSWORD_MISMATCH: string;
        SAME_PASSWORD: string;
        SUCCESS: string;
        ERROR: string;
        INVALID_TOKEN: string;
    };
    TIMING: {
        REDIRECT_DELAY: number;
        ICON_PLAY_DELAY: number;
    };
}

interface ClickEvent {
    name: string;
    options?: AddEventListenerOptions;
}

interface PlayerInstance {
    direction: number;
    play: () => void;
    isPlaying: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

const UI_CONFIG: UIConfig = {
    API: {
        RESET_PASSWORD: `${API_URL}/api/auth/reset-password`
    },
    ROUTES: {
        LOGIN: '/login'
    },
    ICONS: {
        LOCK: 'https://cdn.lordicon.com/pdwpcpva.json',
        EYE: 'https://cdn.lordicon.com/ntfnmkcn.json'
    },
    MESSAGES: {
        PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp.',
        SAME_PASSWORD: 'Mật khẩu mới không được trùng với mật khẩu cũ.',
        SUCCESS: 'Đặt lại mật khẩu thành công! Đang chuyển hướng...',
        ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        INVALID_TOKEN: 'Link không hợp lệ hoặc đã hết hạn.'
    },
    TIMING: {
        REDIRECT_DELAY: 3000,
        ICON_PLAY_DELAY: 300
    }
};

const CLICK_EVENTS: ClickEvent[] = [
    { name: 'mousedown' },
    { name: 'touchstart', options: { passive: true } }
];

// ============================================================================
// Custom Trigger Class - Toggle animation on click
// ============================================================================

class CustomTrigger {
    player: PlayerInstance;
    element: unknown;
    targetElement: HTMLElement;
    direction: number;

    constructor(player: PlayerInstance, element: unknown, targetElement: HTMLElement) {
        this.player = player;
        this.element = element;
        this.targetElement = targetElement;
        this.direction = 1;
        this.onClick = this.onClick.bind(this);
    }

    onConnected(): void {
        for (const event of CLICK_EVENTS) {
            this.targetElement.addEventListener(event.name, this.onClick, event.options);
        }
    }

    onDisconnected(): void {
        for (const event of CLICK_EVENTS) {
            this.targetElement.removeEventListener(event.name, this.onClick);
        }
    }

    onReady(): void {
        this.player.direction = this.direction;
        this.player.play();
    }

    onComplete(): void {
        this.direction = -this.direction;
        this.player.direction = this.direction;
    }

    onClick(): void {
        if (!this.player.isPlaying) {
            this.player.play();
        }
    }
}

// ============================================================================
// Main Component
// ============================================================================

const ResetPassword: React.FC = () => {
    // ------------------------------------------------------------------------
    // State & Hooks
    // ------------------------------------------------------------------------

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState<FormData>({
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showNewPass, setShowNewPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    const isIconDefined = useRef<boolean>(false);
    const lockIconRef = useRef<LordIconElement>(null);

    // ------------------------------------------------------------------------
    // Icon Initialization
    // ------------------------------------------------------------------------

    useEffect(() => {
        if (!isIconDefined.current) {
            try {
                Element.defineTrigger('custom', CustomTrigger);
                defineElement(lottie.loadAnimation);
                isIconDefined.current = true;
            } catch (e) {
                // LordIcon definitions already exist
                console.warn('LordIcon definitions already exist');
            }
        }
    }, []);

    useEffect(() => {
        // Delay prevents race condition with icon rendering
        const timer = setTimeout(() => {
            if (lockIconRef.current) {
                const player = lockIconRef.current.playerInstance;
                if (player && !player.isPlaying) {
                    player.play();
                }
            }
        }, UI_CONFIG.TIMING.ICON_PLAY_DELAY);

        return () => clearTimeout(timer);
    }, []);

    // ------------------------------------------------------------------------
    // Form Handlers
    // ------------------------------------------------------------------------

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear messages on input change
        if (error) setError('');
        if (message) setMessage('');
    }, [error, message]);

    const toggleNewPassVisibility = useCallback((): void => {
        setShowNewPass(prev => !prev);
    }, []);

    const toggleConfirmPassVisibility = useCallback((): void => {
        setShowConfirmPass(prev => !prev);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Client-side validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError(UI_CONFIG.MESSAGES.PASSWORD_MISMATCH);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(UI_CONFIG.API.RESET_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: token,
                    newPassword: formData.newPassword
                })
            });

            if (response.ok) {
                setMessage(UI_CONFIG.MESSAGES.SUCCESS);
                setTimeout(() => {
                    navigate(UI_CONFIG.ROUTES.LOGIN);
                }, UI_CONFIG.TIMING.REDIRECT_DELAY);
            } else {
                const errorData = await response.text();
                // Check for same password error from backend
                if (errorData.includes('same') || errorData.includes('current')) {
                    setError(UI_CONFIG.MESSAGES.SAME_PASSWORD);
                } else {
                    setError(UI_CONFIG.MESSAGES.ERROR);
                }
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError(UI_CONFIG.MESSAGES.ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    // ------------------------------------------------------------------------
    // Render - Invalid Token State
    // ------------------------------------------------------------------------

    if (!token) {
        return (
            <div className={styles.resetPasswordFormWrapper}>
                <div className={styles.resetPasswordFormBackground} aria-hidden="true" />
                <div className={styles.resetPasswordFormOverlay} aria-hidden="true" />

                <div className={styles.resetPasswordFormContent}>
                    {/* @ts-ignore - LordIcon custom element */}
                    <lord-icon
                        src={UI_CONFIG.ICONS.LOCK}
                        trigger="hover"
                        colors="primary:#f87171"
                        style={{ width: '100px', height: '100px' }}
                    />

                    <h1 className={`${styles.resetPasswordTitle} ${styles.errorTitle}`}>
                        Lỗi Token
                    </h1>

                    <p className={styles.resetPasswordSubtitle}>
                        {UI_CONFIG.MESSAGES.INVALID_TOKEN}
                    </p>

                    <Link to={UI_CONFIG.ROUTES.LOGIN} className={styles.backToLoginLink}>
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    // ------------------------------------------------------------------------
    // Render - Main Form
    // ------------------------------------------------------------------------

    return (
        <div className={styles.resetPasswordFormWrapper}>
            <div className={styles.resetPasswordFormBackground} aria-hidden="true" />
            <div className={styles.resetPasswordFormOverlay} aria-hidden="true" />

            <div className={styles.resetPasswordFormContent}>
                {/* @ts-ignore - LordIcon custom element */}
                <lord-icon
                    ref={lockIconRef}
                    src={UI_CONFIG.ICONS.LOCK}
                    trigger="hover"
                    style={{ width: '120px', height: '120px', cursor: 'pointer' }}
                />

                <h1 className={styles.resetPasswordTitle}>Đặt lại mật khẩu</h1>

                <form
                    onSubmit={handleSubmit}
                    className={styles.resetPasswordForm}
                    autoComplete="off"
                >
                    {/* Success message */}
                    {message && (
                        <div className={styles.resetPasswordSuccess} role="status">
                            {message}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className={styles.resetPasswordError} role="alert">
                            {error}
                        </div>
                    )}

                    {/* New password input */}
                    <div className={styles.resetPasswordInputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                className={styles.resetPasswordInput}
                                placeholder="Mật khẩu mới"
                                type={showNewPass ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                                required
                                disabled={isLoading || !!message}
                                aria-label="New Password"
                            />
                            <button
                                type="button"
                                onClick={toggleNewPassVisibility}
                                className={styles.togglePasswordBtn}
                                tabIndex={-1}
                                disabled={isLoading || !!message}
                                aria-label={showNewPass ? 'Hide password' : 'Show password'}
                            >
                                {/* @ts-ignore - LordIcon custom element */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.EYE}
                                    state="morph-cross"
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Confirm password input */}
                    <div className={styles.resetPasswordInputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                className={styles.resetPasswordInput}
                                placeholder="Xác nhận mật khẩu"
                                type={showConfirmPass ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                autoComplete="new-password"
                                required
                                disabled={isLoading || !!message}
                                aria-label="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPassVisibility}
                                className={styles.togglePasswordBtn}
                                tabIndex={-1}
                                disabled={isLoading || !!message}
                                aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                            >
                                {/* @ts-ignore - LordIcon custom element */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.EYE}
                                    state="morph-cross"
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className={styles.resetPasswordButton}
                        disabled={isLoading || !!message}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>

                    {/* Back to login link */}
                    <p className={styles.resetPasswordLinkText}>
                        <Link
                            to={UI_CONFIG.ROUTES.LOGIN}
                            className={styles.resetPasswordLink}
                            tabIndex={isLoading ? -1 : 0}
                        >
                            ← Quay lại đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;