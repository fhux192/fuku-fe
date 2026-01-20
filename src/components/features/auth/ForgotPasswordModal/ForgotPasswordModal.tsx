
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import lottie from 'lottie-web';
import { defineElement} from '@lordicon/element';
import styles from './ForgotPasswordModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

interface UIConfig {
    API: {
        FORGOT_PASSWORD: string;
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
// ============================================================================
// Constants
// ============================================================================

const UI_CONFIG: UIConfig = {
    API: {
        FORGOT_PASSWORD: 'http://localhost:8080/api/auth/forgot-password'
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

// ============================================================================
// Main Component
// ============================================================================

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onSwitchToLogin
                                                                 }) => {
    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isIconDefined = useRef<boolean>(false);
    const avatarIconRef = useRef<LordIconElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // ------------------------------------------------------------------------
    // Icon initialization
    // ------------------------------------------------------------------------

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
            if (e.key === 'Escape') onClose();
        };

        const handleBackdropClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleBackdropClick);
        }, 100);

        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleBackdropClick);
            document.body.style.overflow = 'unset';
            clearTimeout(timer);
        };
    }, [isOpen, onClose]);

    // ------------------------------------------------------------------------
    // Form handlers
    // ------------------------------------------------------------------------

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
                setEmail(''); // Clear form on success
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

    const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
        if (error) setError('');
    }, [error]);

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
                    aria-label="Đóng modal"
                >
                    ✕
                </button>

                <div className={styles.forgotPasswordFormWrapper}>
                    <div className={styles.forgotPasswordFormContent}>
                        {/* Avatar icon */}
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
                            Nhập email của bạn để lấy lại mật khẩu
                        </p>

                        <form onSubmit={handleSubmit} className={styles.forgotPasswordForm} autoComplete="off">
                            {message && (
                                <div className={styles.forgotPasswordSuccess} role="status">
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
                                    id="modal-email"
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
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className={styles.forgotPasswordLink}
                                >
                                    ← Quay lại đăng nhập
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;