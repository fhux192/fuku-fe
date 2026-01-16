import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import styles from './Login.module.css';

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
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
        HOME: string;
        REGISTER: string;
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

const UI_CONFIG: UIConfig = {
    API: {
        LOGIN: 'http://localhost:8080/api/auth/login'
    },
    ROUTES: {
        HOME: '/home/course',
        REGISTER: '/register',
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

const Login: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const isIconDefined = useRef<boolean>(false);
    const avatarIconRef = useRef<LordIconElement>(null);

    useEffect(() => {
        if (!isIconDefined.current) {
            try {
                Element.defineTrigger('custom', CustomTrigger);
                defineElement(lottie.loadAnimation);
                isIconDefined.current = true;
            } catch (e) {
                console.warn('LordIcon definitions already exist');
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (avatarIconRef.current) {
                const player = avatarIconRef.current.playerInstance;
                if (player && !player.isPlaying) {
                    player.play();
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    }, [error]);

    const togglePasswordVisibility = useCallback((): void => {
        setIsPasswordVisible(prev => !prev);
    }, []);

    const handleButtonMouseEnter = useCallback((): void => {
        if (avatarIconRef.current) {
            // Simulate hover event trên avatar icon
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
                navigate(UI_CONFIG.ROUTES.HOME);
            } else {
                const errorText = await response.text();
                setError(errorText || UI_CONFIG.MESSAGES.LOGIN_FAIL);
            }
        } catch (err) {
            setError(UI_CONFIG.MESSAGES.ERROR);
        }
    };

    return (
        <div className={styles.loginFormWrapper}>
            <div className={styles.loginFormBackground} aria-hidden="true" />
            <div className={styles.loginFormOverlay} aria-hidden="true" />

            <div className={styles.loginFormContent}>
                {/* @ts-ignore */}
                <lord-icon
                    ref={avatarIconRef}
                    src={UI_CONFIG.ICONS.AVATAR}
                    state="hover-looking-around"
                    trigger="hover"
                    style={{ width: '135px', height: '135px', cursor: 'pointer' }}
                />

                <h1 className={styles.loginTitle}>Đăng nhập</h1>

                <form onSubmit={handleSubmit} className={styles.loginForm} autoComplete="off">
                    {error && (
                        <div className={styles.loginError} role="alert">
                            {error}
                        </div>
                    )}

                    <div className={styles.loginInputGroup}>
                        <input
                            className={styles.loginInput}
                            placeholder="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                            required
                            aria-label="Email Address"
                        />
                    </div>

                    <div className={styles.loginInputGroup}>
                        <div className={styles.passwordWrapper}>
                            <input
                                className={styles.loginInput}
                                placeholder="Mật khẩu"
                                type={isPasswordVisible ? 'text' : 'password'}
                                id="password"
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

                    <div className={styles.forgotPasswordWrapper}>
                        <Link to={UI_CONFIG.ROUTES.FORGOT_PASS} className={styles.forgotPasswordLink}>
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        onMouseEnter={handleButtonMouseEnter}
                    >
                        Đăng nhập
                    </button>

                    <p className={styles.loginLinkText}>
                        Chưa có tài khoản?{' '}
                        <Link to={UI_CONFIG.ROUTES.REGISTER} className={styles.loginLink}>
                            Đăng ký
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;