import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import styles from './LoginModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess?: () => void;
    onSwitchToRegister?: () => void;
    onSwitchToForgotPass?: () => void; // Thêm prop này
}

interface FormData {
    email: string;
    password: string;
}

interface UIConfig {
    API: {
        LOGIN: string;
    };
    ROUTES: {
        FORGOT_PASS: string;
    };
    ICONS: {
        AVATAR: string;
        EYE: string;
    };
    MESSAGES: {
        LOGIN_FAIL: string;
        ERROR: string;
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

const UI_CONFIG: UIConfig = {
    API: {
        LOGIN: 'http://localhost:8080/api/auth/login'
    },
    ROUTES: {
        FORGOT_PASS: '/forgot-password'
    },
    ICONS: {
        AVATAR: 'https://cdn.lordicon.com/hroklero.json',
        EYE: 'https://cdn.lordicon.com/ntfnmkcn.json'
    },
    MESSAGES: {
        LOGIN_FAIL: 'ログインに失敗しました。(Đăng nhập thất bại.)',
        ERROR: 'エラーが発生しました。後でもう一度お試しください。(Đã xảy ra lỗi. Vui lòng thử lại sau.)'
    }
};

const CLICK_EVENTS: ClickEvent[] = [
    { name: 'mousedown' },
    { name: 'touchstart', options: { passive: true } },
];

// ============================================================================
// Custom Trigger Class
// ============================================================================

class CustomTrigger {
    player: PlayerInstance;
    element: any;
    targetElement: HTMLElement;
    direction: number;

    constructor(player: PlayerInstance, element: any, targetElement: HTMLElement) {
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
        // Reverse direction for toggle effect
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

const LoginModal: React.FC<LoginModalProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   onLoginSuccess,
                                                   onSwitchToRegister,
                                                   onSwitchToForgotPass
                                               }) => {
    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const isIconDefined = useRef<boolean>(false);
    const avatarIconRef = useRef<LordIconElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // ------------------------------------------------------------------------
    // Icon initialization
    // ------------------------------------------------------------------------

    useEffect(() => {
        if (!isIconDefined.current) {
            try {
                Element.defineTrigger('custom', CustomTrigger);
                defineElement(lottie.loadAnimation);
                isIconDefined.current = true;
            } catch (e) {
                // Definition already exists from previous mount
                console.warn('LordIcon definitions already exist');
            }
        }
    }, []);

    useEffect(() => {
        // Delay prevents race condition with icon rendering
        const timer = setTimeout(() => {
            if (avatarIconRef.current && isOpen) {
                const player = avatarIconRef.current.playerInstance;
                if (player && !player.isPlaying) {
                    player.play();
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [isOpen]);

    // ------------------------------------------------------------------------
    // Modal behavior
    // ------------------------------------------------------------------------

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleBackdropClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // Delay prevents immediate close when modal opens
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleBackdropClick);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleBackdropClick);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        // Prevent body scroll when modal is open for better UX
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // ------------------------------------------------------------------------
    // Form handlers
    // ------------------------------------------------------------------------

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error immediately for better UX
        if (error) setError('');
    }, [error]);

    const togglePasswordVisibility = useCallback((): void => {
        setIsPasswordVisible(prev => !prev);
    }, []);

    const handleButtonMouseEnter = useCallback((): void => {
        if (avatarIconRef.current) {
            // Programmatically trigger avatar animation for visual feedback
            const hoverEvent = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            avatarIconRef.current.dispatchEvent(hoverEvent);
        }
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(UI_CONFIG.API.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);

                // Reset form state
                setFormData({ email: '', password: '' });

                // Trigger success callback to refresh user data in parent
                if (onLoginSuccess) {
                    onLoginSuccess();
                }

                onClose();
            } else {
                const errorText = await response.text();
                setError(errorText || UI_CONFIG.MESSAGES.LOGIN_FAIL);
            }
        } catch (err) {
            setError(UI_CONFIG.MESSAGES.ERROR);
        }
    };

    // ------------------------------------------------------------------------
    // Navigation handlers
    // ------------------------------------------------------------------------

    const handleRegisterClick = (): void => {
        if (onSwitchToRegister) {
            onSwitchToRegister();
        }
    };

    const handleForgotPasswordClick = (): void => {
        // Nếu có truyền handler mở modal thì gọi nó, ngược lại thì dùng navigate mặc định
        if (onSwitchToForgotPass) {
            onSwitchToForgotPass();
        } else {
            onClose();
            navigate(UI_CONFIG.ROUTES.FORGOT_PASS);
        }
    };

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} ref={modalRef}>
                {/* Close button */}
                <button
                    className={styles.closeModalBtn}
                    onClick={onClose}
                    aria-label="Close login form"
                >
                    ✕
                </button>

                {/* Login form wrapper */}
                <div className={styles.loginFormWrapper}>
                    <div className={styles.loginFormBackground} aria-hidden="true" />
                    <div className={styles.loginFormOverlay} aria-hidden="true" />

                    <div className={styles.loginFormContent}>
                        {/* Avatar icon */}
                        {/* @ts-ignore */}
                        <lord-icon
                            ref={avatarIconRef}
                            src={UI_CONFIG.ICONS.AVATAR}
                            state="hover-looking-around"
                            trigger="hover"
                            style={{ width: '135px', height: '135px', cursor: 'pointer' }}
                        />

                        {/* Title */}
                        <h1 className={styles.loginTitle}>Đăng nhập</h1>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className={styles.loginForm} autoComplete="off">
                            {/* Error message */}
                            {error && (
                                <div className={styles.loginError} role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Email input */}
                            <div className={styles.loginInputGroup}>
                                <input
                                    className={styles.loginInput}
                                    placeholder="Email"
                                    type="email"
                                    id="modal-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    required
                                    aria-label="Email Address"
                                />
                            </div>

                            {/* Password input */}
                            <div className={styles.loginInputGroup}>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        className={styles.loginInput}
                                        placeholder="Mật khẩu"
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        id="modal-password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                        required
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className={styles.togglePasswordBtn}
                                        tabIndex={-1}
                                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                    >
                                        {/* @ts-ignore */}
                                        <lord-icon
                                            src={UI_CONFIG.ICONS.EYE}
                                            state="morph-cross"
                                            trigger="custom"
                                            style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Forgot password link */}
                            <div className={styles.forgotPasswordWrapper}>
                                <button
                                    type="button"
                                    onClick={handleForgotPasswordClick}
                                    className={styles.forgotPasswordLink}
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                className={styles.loginButton}
                                onMouseEnter={handleButtonMouseEnter}
                            >
                                Đăng nhập
                            </button>

                            {/* Register link */}
                            <p className={styles.loginLinkText}>
                                Chưa có tài khoản?{' '}
                                <button
                                    type="button"
                                    onClick={handleRegisterClick}
                                    className={styles.loginLink}
                                >
                                    Đăng ký
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;