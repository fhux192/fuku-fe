import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './DailyLoginModal.module.css';

// ============================================================================
// Types
// ============================================================================

interface LordIconElement extends HTMLElement {
    playerInstance?: {
        play: () => void;
        isPlaying: boolean;
    };
}

interface DailyLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    streak: number;
    xpEarned: number;
    leveledUp: boolean;
    currentRank: string;
    icon: string; // Kept for backward compatibility, not used internally
    message: string;
}

interface UIConfig {
    ICONS: {
        TROPHY: string;
        FIRE: string;
        STAR: string;
        CROWN: string;
    };
}

// ============================================================================
// Constants
// ============================================================================

const UI_CONFIG: UIConfig = {
    ICONS: {
        TROPHY: 'https://cdn.lordicon.com/oqqaudcw.json',
        FIRE: 'https://cdn.lordicon.com/kataohvx.json',
        STAR: 'https://cdn.lordicon.com/hrtsficn.json',
        CROWN: 'https://cdn.lordicon.com/wwgmxtck.json',
    }
};

// ============================================================================
// Main Component
// ============================================================================

const DailyLoginModal: React.FC<DailyLoginModalProps> = ({
                                                             isOpen,
                                                             onClose,
                                                             streak,
                                                             xpEarned,
                                                             leveledUp,
                                                             currentRank,
                                                             message
                                                         }) => {
    // ------------------------------------------------------------------------
    // Refs
    // ------------------------------------------------------------------------

    const isIconDefined = useRef<boolean>(false);
    const mainIconRef = useRef<LordIconElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // ------------------------------------------------------------------------
    // Icon Initialization - Same pattern as LoginModal
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

    // Trigger main icon animation when modal opens
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mainIconRef.current && isOpen) {
                const player = mainIconRef.current.playerInstance;
                if (player && !player.isPlaying) {
                    player.play();
                }
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [isOpen]);

    // ------------------------------------------------------------------------
    // Modal Behavior - Matching LoginModal exactly
    // ------------------------------------------------------------------------

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on Escape key
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

    // Close on backdrop click
    useEffect(() => {
        if (!isOpen) return;

        const handleBackdropClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleBackdropClick);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleBackdropClick);
        };
    }, [isOpen, onClose]);

    // ------------------------------------------------------------------------
    // Helper Functions
    // ------------------------------------------------------------------------

    const isMilestone = (): boolean => {
        return streak === 7 || streak === 30 || (streak >= 10 && streak % 10 === 0);
    };

    const getMilestoneText = (): string => {
        if (streak === 7) return 'Hoàn thành streak tuần!';
        if (streak === 30) return 'Hoàn thành streak tháng!';
        if (streak % 10 === 0) return `${streak} ngày streak!`;
        return '';
    };

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} ref={modalRef}>
                {/* Close button - Same style as LoginModal */}
                <button
                    className={styles.closeModalBtn}
                    onClick={onClose}
                    aria-label="Đóng modal"
                >
                    X
                </button>

                {/* Modal wrapper with background */}
                <div className={styles.modalWrapper}>
                    <div className={styles.modalBackground} aria-hidden="true" />

                    <div className={styles.modalContent}>
                        {/* Title */}
                        <h2 className={styles.modalTitle}>
                            {leveledUp ? 'Chúc mừng lên cấp!' : 'Điểm danh thành công!'}
                        </h2>

                        {/* Message */}
                        <p className={styles.modalDescription}>{message}</p>

                        {/* Stats Grid */}
                        <div className={styles.statsGrid}>
                            {/* Streak Card */}
                            <div className={styles.statCard}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.FIRE}
                                    trigger="loop"
                                    delay="2000"
                                    colors="primary:#f97316,secondary:#fbbf24"
                                    style={{ width: '48px', height: '48px' }}
                                />
                                <span className={styles.statValue}>{streak}</span>
                                <span className={styles.statLabel}>Ngày liên tiếp</span>
                            </div>

                            <div className={styles.statDivider} />

                            {/* XP Card */}
                            <div className={styles.statCard}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.STAR}
                                    trigger="loop"
                                    delay="2500"
                                    colors="primary:#4ade80,secondary:#86efac"
                                    style={{ width: '48px', height: '48px' }}
                                />
                                <span className={styles.statValue}>+{xpEarned}</span>
                                <span className={styles.statLabel}>XP nhận được</span>
                            </div>
                        </div>

                        {/* Level Up Badge */}
                        {leveledUp && (
                            <div className={styles.levelUpBadge}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.CROWN}
                                    trigger="loop"
                                    colors="primary:#1a1a2e,secondary:#fbbf24"
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <span className={styles.badgeText}>{currentRank}</span>
                            </div>
                        )}

                        {/* Milestone Banner */}
                        {isMilestone() && !leveledUp && (
                            <div className={styles.milestoneBanner}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={UI_CONFIG.ICONS.TROPHY}
                                    trigger="loop"
                                    colors="primary:#ffffff,secondary:#86efac"
                                    style={{ width: '36px', height: '36px' }}
                                />
                                <span className={styles.milestoneText}>{getMilestoneText()}</span>
                            </div>
                        )}

                        {/* Continue Button */}
                        <button className={styles.continueButton} onClick={onClose}>
                            Tiếp tục
                        </button>

                        {/* Motivation Text */}
                        <p className={styles.motivationText}>
                            {streak >= 7
                                ? 'Bạn đang làm rất tốt! Hãy tiếp tục phát huy!'
                                : 'Đăng nhập liên tục để nhận thêm XP!'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyLoginModal;