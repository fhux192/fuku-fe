import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { defineElement, Element } from '@lordicon/element';
import styles from './TaskRequirementModal.module.css';
import { LordIconElement } from '../../../../types/lordicon';

export type TaskStatus = 'completed' | 'in_progress' | 'not_started';

export interface Task {
    id: string;
    code: string;
    title: string;
    status: TaskStatus;
    score?: number;
    level?: string;
}

interface TaskRequirementModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onStartTask: () => void;
    iconSrc?: string;
}

const LEVEL_COLORS: Record<string, string> = {
    'IELTS 4.0': '#4ade80',
    'IELTS 5.0': '#3b82f6',
    'IELTS 6.0': '#a855f7',
    'IELTS 6.5': '#f43f5e',
    'IELTS 7.0': '#eab308',
    'IELTS 7.5': '#f97316',
    'IELTS 8.0': '#14b8a6',
};

const DEFAULT_MODAL_ICON = 'https://cdn.lordicon.com/tdbbbqzo.json';
const STAR_ICON = 'https://cdn.lordicon.com/edplgash.json';

// ============================================================================
// Custom Trigger
// ============================================================================

class CustomTrigger {
    player: any;
    targetElement: HTMLElement;

    constructor(player: any, element: any, targetElement: HTMLElement) {
        this.player = player;
        this.targetElement = targetElement;
    }

    onConnected() {
        this.targetElement.addEventListener('click', () => {
            if (!this.player.isPlaying) this.player.play();
        });
    }
}

// ============================================================================
// Component
// ============================================================================

const TaskRequirementModal: React.FC<TaskRequirementModalProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       task,
                                                                       onStartTask,
                                                                       iconSrc,
                                                                   }) => {
    const isIconDefined = useRef<boolean>(false);
    const iconRef = useRef<LordIconElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Định nghĩa lord-icon 1 lần
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
            if (isOpen && iconRef.current) {
                const player = iconRef.current.playerInstance;
                if (player && !player.isPlaying) player.play();
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Backdrop click
    useEffect(() => {
        if (!isOpen) return;
        const handleBackdrop = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        };
        const timer = setTimeout(() => document.addEventListener('mousedown', handleBackdrop), 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleBackdrop);
        };
    }, [isOpen, onClose]);

    // Body overflow
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !task) return null;

    const currentColor = task.level && LEVEL_COLORS[task.level] ? LEVEL_COLORS[task.level] : '#4ade80';

    const requirements = [
        `Mức độ: ${task.level || 'Phổ biến'}`,
        'Thời gian gợi ý: 45 phút',
        'Điểm cần đạt tối thiểu: 80%',
    ];

    const handleStart = () => {
        onStartTask();
        onClose();
    };

    const displayIcon = iconSrc || DEFAULT_MODAL_ICON;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} ref={modalRef}>
                {/* Close button */}
                <button
                    className={styles.closeModalBtn}
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    X
                </button>

                <div className={styles.requirementContent}>
                    <lord-icon
                        ref={iconRef}
                        src={displayIcon}
                        trigger="in"
                        style={{ width: '110px', height: '110px', marginBottom: '16px' }}
                    />

                    <div className={styles.taskBadge} style={{ backgroundColor: `${currentColor}15`, color: currentColor }}>
                        {task.code}
                    </div>

                    <h1 className={styles.title}>{task.title}</h1>
                    <h2 className={styles.subtitle}>Chặng đầu tiên
                        <lord-icon
                        ref={iconRef}
                        src="https://cdn.lordicon.com/tnapqovl.json"
                        trigger="in"
                        colors="primary:#1a1a1e "
                        style={{ width: '20px', height: '20px', marginBottom: '6px' }}
                    /></h2>

                    <ul className={styles.requirementList}>
                        {requirements.map((req, idx) => (
                            <li key={idx}>
                                <lord-icon
                                    src={STAR_ICON}
                                    trigger="in"
                                    delay="500"
                                    colors="primary:#6b7280,secondary:#eab308"
                                    style={{ width: '28px', height: '28px', minWidth: '28px' }}
                                />
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleStart}
                        className={styles.startButton}
                    >
                        Bắt đầu
                    </button>

                </div>
            </div>
        </div>
    );
};

export default TaskRequirementModal;