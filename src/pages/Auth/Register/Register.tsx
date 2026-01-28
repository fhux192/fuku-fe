import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import { useModalClose } from '../../../components/layouts/HomeLayout/HomeLayout';

// ============================================================================
// Type Definitions
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
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

const Register: React.FC = () => {
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

    const navigate = useNavigate();
    const avatarIconRef = useRef<LordIconElement>(null);

    // Get onClose from outlet context if available (mobile mode)
    const context = useModalClose();
    const onClose = context?.onClose;

    useEffect(() => {
        try {
            // @ts-ignore
            Element.defineTrigger('custom', CustomTrigger);
        } catch (e) {
            // Ignore if already defined
        }

        defineElement(lottie.loadAnimation);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (avatarIconRef.current) {
                const player = avatarIconRef.current.playerInstance;
                if (player && !player.isPlaying) {
                    player.play();
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng nhập tất cả các trường.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const API_URL = 'http://localhost:8080';
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const responseText = await response.text();

            if (response.ok) {
                setMessage('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else if (responseText.includes("Passwords do not match")) {
                setError('Mật khẩu không khớp.');
            } else {
                setError(responseText || 'Đăng ký thất bại.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
        }
    };

    const togglePasswordVisibility = (): void => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = (): void => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={styles.registerFormWrapper}>
            {onClose && (
                <button
                    className={styles.closeModalBtn}
                    onClick={onClose}
                    aria-label="Close register form"
                >
                    ✕
                </button>
            )}

            <div className={styles.registerFormBackground}></div>
            <div className={styles.registerFormOverlay}></div>

            <div className={styles.registerFormContent}>
                {/* @ts-ignore */}
                <lord-icon
                    ref={avatarIconRef}
                    src="https://cdn.lordicon.com/hroklero.json"
                    state="morph-group"
                    trigger="morph"
                    style={{ width: '135px', height: '135px', cursor: 'pointer' }}
                />
                <h1 className={styles.registerTitle}>Đăng ký</h1>

                <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
                    {message && <p className={styles.registerMessage}>{message}</p>}
                    {error && <p className={styles.registerError}>{error}</p>}

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="name" className={styles.registerLabel}></label>
                        <input
                            placeholder="Họ và tên"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={styles.registerInput}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="email" className={styles.registerLabel}></label>
                        <input
                            placeholder="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.registerInput}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="password" className={styles.registerLabel}></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                placeholder="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.registerInput}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                tabIndex={-1}
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={styles.togglePasswordBtn}
                            >
                                {/* @ts-ignore */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/ntfnmkcn.json"
                                    state="morph-cross"
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer', marginLeft: '10px' }}
                                />
                            </button>
                        </div>
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="confirmPassword" className={styles.registerLabel}></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                placeholder="Xác nhận mật khẩu"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={styles.registerInput}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                tabIndex={-1}
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className={styles.togglePasswordBtn}
                            >
                                {/* @ts-ignore */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/ntfnmkcn.json"
                                    state="morph-cross"
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer', marginLeft: '10px' }}
                                />
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.registerButton}>
                        Đăng ký
                    </button>

                    <p className={styles.registerLinkText}>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className={styles.registerLink}>
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;