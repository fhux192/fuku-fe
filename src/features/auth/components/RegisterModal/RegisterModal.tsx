import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import styles from './RegisterModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface UIConfig {
    API: {
        REGISTER: string;
    };
    ICONS: {
        AVATAR: string;
        EYE: string;
    };
    MESSAGES: {
        SUCCESS: string;
        PASSWORD_MISMATCH: string;
        PASSWORD_TOO_SHORT: string;
        REQUIRED_FIELDS: string;
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
        REGISTER: 'http://localhost:8080/api/auth/register'
    },
    ICONS: {
        AVATAR: 'https://cdn.lordicon.com/hroklero.json',
        EYE: 'https://cdn.lordicon.com/ntfnmkcn.json'
    },
    MESSAGES: {
        SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.',
        PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp.',
        PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự.',
        REQUIRED_FIELDS: 'Vui lòng nhập tất cả các trường.',
        ERROR: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.'
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
        // FIXED: Added missing loop to define 'event'
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

const RegisterModal: React.FC<RegisterModalProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onRegisterSuccess,
                                                         onSwitchToLogin
                                                     }) => {
    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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
        // Clear messages immediately for better UX
        if (error) setError('');
        if (message) setMessage('');
    }, [error, message]);

    const togglePasswordVisibility = useCallback((): void => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback((): void => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError(UI_CONFIG.MESSAGES.REQUIRED_FIELDS);
            return;
        }

        if (formData.password.length < 6) {
            setError(UI_CONFIG.MESSAGES.PASSWORD_TOO_SHORT);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError(UI_CONFIG.MESSAGES.PASSWORD_MISMATCH);
            return;
        }

        try {
            const response = await fetch(UI_CONFIG.API.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const responseText = await response.text();

            if (response.ok) {
                setMessage(UI_CONFIG.MESSAGES.SUCCESS);

                // Reset form state
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                // Trigger success callback after delay to show success message
                setTimeout(() => {
                    if (onRegisterSuccess) {
                        onRegisterSuccess();
                    }
                }, 2000);
            } else if (responseText.includes("Passwords do not match")) {
                setError(UI_CONFIG.MESSAGES.PASSWORD_MISMATCH);
            } else {
                setError(responseText || 'Đăng ký thất bại.');
            }
        } catch (err) {
            setError(UI_CONFIG.MESSAGES.ERROR);
        }
    };

    // ------------------------------------------------------------------------
    // Navigation handlers
    // ------------------------------------------------------------------------

    const handleLoginClick = (): void => {
        if (onSwitchToLogin) {
            onSwitchToLogin();
        }
    };

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} ref={modalRef}>
                {/* Close button - Identical to LoginModal */}
                <button
                    className={styles.closeModalBtn}
                    onClick={onClose}
                    aria-label="Đóng modal đăng ký"
                >
                    X
                </button>

                {/* Register form wrapper */}
                <div className={styles.registerFormWrapper}>
                    <div className={styles.registerFormContent}>
                        {/* Avatar icon */}
                        {/* @ts-ignore */}
                        <lord-icon
                            ref={avatarIconRef}
                            src={UI_CONFIG.ICONS.AVATAR}
                            state="morph-group"
                            trigger="morph"
                            style={{ width: '135px', height: '135px', cursor: 'pointer' }}
                        />

                        {/* Title */}
                        <h1 className={styles.registerTitle}>Đăng ký</h1>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
                            {/* Success message */}
                            {message && (
                                <div className={styles.registerMessage} role="status">
                                    {message}
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <div className={styles.registerError} role="alert">
                                    {error}
                                </div>
                            )}

                            {/* Name input */}
                            <div className={styles.registerInputGroup}>
                                <input
                                    className={styles.registerInput}
                                    placeholder="Họ và tên"
                                    type="text"
                                    id="modal-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    autoComplete="name"
                                    required
                                    aria-label="Full Name"
                                />
                            </div>

                            {/* Email input */}
                            <div className={styles.registerInputGroup}>
                                <input
                                    className={styles.registerInput}
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
                            <div className={styles.registerInputGroup}>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        className={styles.registerInput}
                                        placeholder="Mật khẩu"
                                        type={showPassword ? 'text' : 'password'}
                                        id="modal-password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                        required
                                        aria-label="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className={styles.togglePasswordBtn}
                                        tabIndex={-1}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
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

                            {/* Confirm password input */}
                            <div className={styles.registerInputGroup}>
                                <div className={styles.passwordWrapper}>
                                    <input
                                        className={styles.registerInput}
                                        placeholder="Xác nhận mật khẩu"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="modal-confirm-password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        autoComplete="new-password"
                                        required
                                        aria-label="Confirm Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className={styles.togglePasswordBtn}
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
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

                            {/* Submit button */}
                            <button
                                type="submit"
                                className={styles.registerButton}
                            >
                                Đăng ký
                            </button>

                            {/* Login link */}
                            <p className={styles.registerLinkText}>
                                Đã có tài khoản?{' '}
                                <button
                                    type="button"
                                    onClick={handleLoginClick}
                                    className={styles.registerLink}
                                >
                                    Đăng nhập
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;