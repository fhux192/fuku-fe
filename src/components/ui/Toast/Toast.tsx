import React, { useEffect } from 'react';
import styles from './Toast.module.css';
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';

// ============================================================================
// Types
// ============================================================================

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

// ============================================================================
// Constants
// ============================================================================

const TOAST_ICONS = {
    success: 'https://cdn.lordicon.com/lomfljuq.json', // Checkmark animation
    error: 'https://cdn.lordicon.com/keaiyjcl.json',   // Error X animation
    info: 'https://cdn.lordicon.com/cnbtflhy.json'     // Info i animation
};

// ============================================================================
// Component
// ============================================================================

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = 'success',
                                         isVisible,
                                         onClose,
                                         duration = 3000
                                     }) => {
    // ------------------------------------------------------------------------
    // Effects
    // ------------------------------------------------------------------------

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    // Auto-hide after duration
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    if (!isVisible) return null;

    return (
        <div className={`${styles.toastContainer} ${styles[type]}`}>
            <div className={styles.toastContent}>
                <div className={styles.iconWrapper}>
                    {/* @ts-ignore */}
                    <lord-icon
                        src={TOAST_ICONS[type]}
                        trigger="loop"
                        delay="500"
                        colors={
                            type === 'success'
                                ? 'primary:#bfff00,secondary:#6ee7b7'
                                : type === 'error'
                                    ? 'primary:#ef4444,secondary:#fca5a5'
                                    : 'primary:#3b82f6,secondary:#93c5fd'
                        }
                        style={{ width: '32px', height: '32px' }}
                    />
                </div>

                <div className={styles.messageWrapper}>
                    <p className={styles.message}>{message}</p>
                </div>

                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Đóng thông báo"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            {/* Progress bar */}
            <div
                className={styles.progressBar}
                style={{ animationDuration: `${duration}ms` }}
            />
        </div>
    );
};

export default Toast;