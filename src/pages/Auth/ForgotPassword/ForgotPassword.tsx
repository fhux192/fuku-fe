import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './ForgotPassword.module.css';

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface UIConfig {
    API: {
        FORGOT_PASSWORD: string;
    };
    ROUTES: {
        LOGIN: string;
    };
    ICONS: {
        AVATAR: string;
    };
    MESSAGES: {
        SUCCESS: string;
        ERROR: string;
        CONNECTION_ERROR: string;
        EMPTY_EMAIL: string;
    };
}

const UI_CONFIG: UIConfig = {
    API: {
        FORGOT_PASSWORD: 'http://localhost:8080/api/auth/forgot-password'
    },
    ROUTES: {
        LOGIN: '/login'
    },
    ICONS: {
        AVATAR: "https://cdn.lordicon.com/uufkkpxl.json"
    },
    MESSAGES: {
        SUCCESS: 'Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.',
        ERROR: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        CONNECTION_ERROR: 'Không thể kết nối đến máy chủ.',
        EMPTY_EMAIL: 'Vui lòng nhập email của bạn.'
    }
};

function ForgotPassword() {
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const avatarIconRef = useRef<LordIconElement>(null);
    const isIconDefined = useRef<boolean>(false);

    useEffect(() => {
        if (!isIconDefined.current) {
            try {
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
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (!email) {
            setError(UI_CONFIG.MESSAGES.EMPTY_EMAIL);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(UI_CONFIG.API.FORGOT_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage(UI_CONFIG.MESSAGES.SUCCESS);
            } else {
                const text = await response.text();
                setError(text || UI_CONFIG.MESSAGES.ERROR);
            }
        } catch (err) {
            setError(UI_CONFIG.MESSAGES.CONNECTION_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    return (
        <div className={styles.forgotPasswordFormWrapper}>
            <div className={styles.forgotPasswordFormBackground} aria-hidden="true" />
            <div className={styles.forgotPasswordFormOverlay} aria-hidden="true" />

            <div className={styles.forgotPasswordFormContent}>
                {/* @ts-ignore */}
                <lord-icon
                    ref={avatarIconRef}
                    src={UI_CONFIG.ICONS.AVATAR}
                    state="hover-looking-around"
                    trigger="hover"
                    style={{ width: '135px', height: '135px', cursor: 'pointer' }}
                />

                <h1 className={styles.forgotPasswordTitle}>Quên mật khẩu</h1>
                <p className={styles.forgotPasswordSubtitle}>
                    Nhập email bạn muốn lấy lại mật khẩu
                </p>

                <form onSubmit={handleSubmit} className={styles.forgotPasswordForm} autoComplete="off">
                    {message && (
                        <div className={styles.forgotPasswordSuccess} role="alert">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className={styles.forgotPasswordError} role="alert">
                            {error}
                        </div>
                    )}

                    <div className={styles.forgotPasswordInputGroup}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            className={styles.forgotPasswordInput}
                            placeholder="Email"
                            autoComplete="email"
                            required
                            aria-label="Email Address"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.forgotPasswordButton}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang gửi...' : 'Gửi xác nhận'}
                    </button>

                    <p className={styles.forgotPasswordLinkText}>
                        <Link to={UI_CONFIG.ROUTES.LOGIN} className={styles.forgotPasswordLink}>
                            ← Quay lại đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;