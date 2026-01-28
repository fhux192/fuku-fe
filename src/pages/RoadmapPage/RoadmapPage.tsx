import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    X,
    Star,
    Trophy,
    Lock,
    CheckCircle,
    Zap,
    Crown,
    Gift,
    Book,
    Play,
    Circle,
} from 'lucide-react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

import {
    LEVELS_DATA,
    MOCK_USER_PROGRESS,
} from '../../features/roadmap/roadmap.constant';
import {
    LevelNode as LevelNodeType,
    UserProgress,
    LevelStatus,
    LevelType,
} from '../../features/roadmap/roadmap.types';
import styles from './RoadmapPage.module.css';

// =============================================================================
// Constants
// =============================================================================

const CARDS_PER_ROW = 3;

// Vietnamese labels
const LABELS = {
    completed: 'Hoàn thành',
    totalXp: 'Tổng XP',
    stars: 'Sao',
    level: 'Cấp độ',
    topicsCovered: 'Nội dung bài học',
    requiredScore: 'Điểm yêu cầu',
    startLevel: 'Bắt đầu học',
    starting: 'Đang tải...',
    completedBtn: 'Đã hoàn thành',
    lesson: 'Bài học',
    boss: 'Thử thách',
    bonus: 'Thưởng',
    closeRoadmap: 'Đóng',
    close: 'Đóng',
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Determines level status based on user progress.
 * Extracted for testability and single responsibility.
 */
function computeLevelStatus(
    level: LevelNodeType,
    progress: UserProgress
): LevelStatus {
    if (progress.completedLevels.includes(level.id)) {
        return 'completed';
    }
    if (level.id === progress.currentLevel) {
        return 'current';
    }
    if (level.id === progress.currentLevel + 1 || level.id < progress.currentLevel) {
        return 'unlocked';
    }
    return 'locked';
}

/**
 * Groups levels into rows for zigzag layout display.
 */
function groupLevelsIntoRows(
    levels: LevelNodeType[],
    perRow: number
): LevelNodeType[][] {
    const rows: LevelNodeType[][] = [];
    for (let i = 0; i < levels.length; i += perRow) {
        rows.push(levels.slice(i, i + perRow));
    }
    return rows;
}

/**
 * Returns card class names based on level state.
 */
function getCardClassName(level: LevelNodeType): string {
    const classes = [styles.card];

    switch (level.status) {
        case 'locked':
            classes.push(styles.cardLocked);
            break;
        case 'completed':
            classes.push(styles.cardCompleted);
            break;
        case 'current':
            classes.push(styles.cardCurrent);
            break;
    }

    return classes.join(' ');
}

/**
 * Returns status icon class based on level state.
 */
function getStatusIconClass(status: LevelStatus): string {
    const statusMap: Record<LevelStatus, string> = {
        locked: styles.statusLocked,
        unlocked: styles.statusUnlocked,
        current: styles.statusCurrent,
        completed: styles.statusCompleted,
    };
    return `${styles.statusIcon} ${statusMap[status]}`;
}

/**
 * Returns type badge class based on level type.
 */
function getTypeBadgeClass(type: LevelType): string {
    const typeMap: Record<LevelType, string> = {
        normal: styles.typeNormal,
        boss: styles.typeBoss,
        bonus: styles.typeBonus,
    };
    return `${styles.typeBadge} ${typeMap[type]}`;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface ProgressHeaderProps {
    progress: UserProgress;
    totalLevels: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = React.memo(
    ({ progress, totalLevels }) => {
        const completedCount = progress.completedLevels.length;
        const progressPercent = Math.round((completedCount / totalLevels) * 100);

        return (
            <>
                <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                        <div className={styles.statIcon}>
                            <Trophy size={14} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {completedCount}/{totalLevels}
                            </span>
                            <span className={styles.statLabel}>{LABELS.completed}</span>
                        </div>
                    </div>

                    <div className={styles.statBox}>
                        <div className={styles.statIcon}>
                            <Zap size={14} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>
                                {progress.totalXP.toLocaleString()}
                            </span>
                            <span className={styles.statLabel}>{LABELS.totalXp}</span>
                        </div>
                    </div>

                    <div className={styles.statBox}>
                        <div className={styles.statIcon}>
                            <Star size={14} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>{progress.stars}</span>
                            <span className={styles.statLabel}>{LABELS.stars}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.progressWrap}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </>
        );
    }
);

ProgressHeader.displayName = 'ProgressHeader';

// -----------------------------------------------------------------------------

interface LevelCardProps {
    level: LevelNodeType;
    onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = React.memo(({ level, onClick }) => {
    const { id, title, topics, xp, type, status } = level;

    const renderStatusIcon = () => {
        switch (status) {
            case 'locked':
                return <Lock size={12} />;
            case 'completed':
                return <CheckCircle size={12} />;
            case 'current':
                return <Play size={12} fill="currentColor" />;
            default:
                return <Circle size={12} />;
        }
    };

    const typeLabels: Record<LevelType, string> = {
        normal: LABELS.lesson,
        boss: LABELS.boss,
        bonus: LABELS.bonus,
    };

    // Show max 3 topics on card
    const displayTopics = topics.slice(0, 3);

    return (
        <div
            className={getCardClassName(level)}
            onClick={status !== 'locked' ? onClick : undefined}
            role="button"
            tabIndex={status !== 'locked' ? 0 : -1}
            aria-label={`${LABELS.level} ${id}: ${title}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && status !== 'locked') onClick();
            }}
        >
            <div className={styles.cardHeader}>
                <span className={styles.levelBadge}>
                    {LABELS.level} {id}
                </span>
                <span className={getStatusIconClass(status)}>
                    {renderStatusIcon()}
                </span>
            </div>

            <h3 className={styles.cardTitle}>{title}</h3>

            <div className={styles.cardTopics}>
                {displayTopics.map((topic, index) => (
                    <span key={index} className={styles.topicTag}>
                        {topic}
                    </span>
                ))}
            </div>

            <div className={styles.cardFooter}>
                <span className={styles.xpBadge}>
                    <Zap size={12} />
                    {xp} XP
                </span>

                <span className={getTypeBadgeClass(type)}>
                    {type === 'boss' && <Crown size={10} />}
                    {type === 'bonus' && <Gift size={10} />}
                    {typeLabels[type]}
                </span>

                {status === 'completed' && (
                    <span className={styles.starsRow}>
                        {[...Array(3)].map((_, i) => (
                            <Star
                                key={i}
                                size={10}
                                fill="currentColor"
                                className={styles.starFilled}
                            />
                        ))}
                    </span>
                )}
            </div>
        </div>
    );
});

LevelCard.displayName = 'LevelCard';

// -----------------------------------------------------------------------------

interface LevelModalProps {
    level: LevelNodeType;
    onClose: () => void;
    onComplete: (levelId: number, stars: number) => void;
}

const LevelModal: React.FC<LevelModalProps> = React.memo(
    ({ level, onClose, onComplete }) => {
        const [isStarting, setIsStarting] = useState(false);

        const handleStart = useCallback(() => {
            setIsStarting(true);

            // Mock completion - replace with actual navigation
            const timer = setTimeout(() => {
                onComplete(level.id, 3);
            }, 2000);

            return () => clearTimeout(timer);
        }, [level.id, onComplete]);

        // Escape key closes modal
        useEffect(() => {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }, [onClose]);

        const isCompleted = level.status === 'completed';

        const typeLabels: Record<LevelType, string> = {
            normal: LABELS.lesson,
            boss: LABELS.boss,
            bonus: LABELS.bonus,
        };

        return (
            <div
                className={styles.modalOverlay}
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                    <button
                        className={styles.modalClose}
                        onClick={onClose}
                        aria-label={LABELS.close}
                    >
                        <X size={16} />
                    </button>

                    <div className={styles.modalHeader}>
                        <span className={styles.modalLevelBadge}>
                            {LABELS.level} {level.id}
                        </span>
                        <h2 id="modal-title" className={styles.modalTitle}>
                            {level.title}
                        </h2>
                        <div className={styles.modalMeta}>
                            <span className={styles.modalXp}>
                                <Zap size={14} />
                                {level.xp} XP
                            </span>
                            <span className={`${styles.modalType} ${getTypeBadgeClass(level.type)}`}>
                                {typeLabels[level.type]}
                            </span>
                        </div>
                    </div>

                    <div className={styles.modalBody}>
                        <div className={styles.modalSection}>
                            <h3 className={styles.modalSectionTitle}>
                                <Book size={14} />
                                {LABELS.topicsCovered}
                            </h3>
                            <div className={styles.topicsList}>
                                {level.topics.map((topic, index) => (
                                    <div key={index} className={styles.topicItem}>
                                        <span className={styles.topicDot} />
                                        <span>{topic}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {level.type === 'boss' && level.requiredScore && (
                            <div className={styles.requirementBox}>
                                <Star size={14} />
                                <span>{LABELS.requiredScore}: {level.requiredScore}%+</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            className={`${styles.startBtn} ${
                                isCompleted ? styles.startBtnCompleted : styles.startBtnPrimary
                            }`}
                            onClick={handleStart}
                            disabled={isStarting || isCompleted}
                        >
                            {isStarting ? (
                                <>
                                    <span className={styles.spinner} />
                                    {LABELS.starting}
                                </>
                            ) : isCompleted ? (
                                <>
                                    <CheckCircle size={16} />
                                    {LABELS.completedBtn}
                                </>
                            ) : (
                                <>
                                    <Play size={16} />
                                    {LABELS.startLevel}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

LevelModal.displayName = 'LevelModal';

// =============================================================================
// Main Component
// =============================================================================

interface RoadmapPageProps {
    courseId: string;
    onClose: () => void;
}

const RoadmapPage: React.FC<RoadmapPageProps> = ({ courseId, onClose }) => {
    const [selectedLevel, setSelectedLevel] = useState<LevelNodeType | null>(null);
    const [userProgress, setUserProgress] = useState<UserProgress>(MOCK_USER_PROGRESS);

    // Initialize lottie on mount
    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    // Compute levels with current status
    const levels = useMemo(() => {
        return LEVELS_DATA.map((level) => ({
            ...level,
            status: computeLevelStatus(level, userProgress),
        }));
    }, [userProgress]);

    // Group into rows for zigzag layout
    const levelRows = useMemo(() => {
        return groupLevelsIntoRows(levels, CARDS_PER_ROW);
    }, [levels]);

    const handleLevelClick = useCallback((level: LevelNodeType) => {
        if (level.status !== 'locked') {
            setSelectedLevel(level);
        }
    }, []);

    const handleLevelComplete = useCallback(
        (levelId: number, stars: number) => {
            const completedLevel = levels.find((l) => l.id === levelId);
            const earnedXP = completedLevel?.xp || 0;

            setUserProgress((prev) => ({
                ...prev,
                completedLevels: [...prev.completedLevels, levelId],
                currentLevel: levelId + 1,
                totalXP: prev.totalXP + earnedXP,
                stars: prev.stars + stars,
            }));

            setSelectedLevel(null);
        },
        [levels]
    );

    const closeModal = useCallback(() => {
        setSelectedLevel(null);
    }, []);

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerInner}>
                        <div className={styles.headerTop}>
                            <div className={styles.titleGroup}>
                                <h1 className={styles.title}>
                                    <Trophy size={20} className={styles.titleIcon} />
                                    Lộ trình học {courseId.toUpperCase()}
                                </h1>
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={onClose}
                                aria-label={LABELS.closeRoadmap}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <ProgressHeader
                            progress={userProgress}
                            totalLevels={levels.length}
                        />
                    </div>
                </header>

                {/* Content */}
                <main className={styles.content}>
                    <div className={styles.pathContainer}>
                        {levelRows.map((row, rowIndex) => (
                            <div key={rowIndex} className={styles.levelRow}>
                                {row.map((level) => (
                                    <LevelCard
                                        key={level.id}
                                        level={level}
                                        onClick={() => handleLevelClick(level)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </main>

                {/* Modal */}
                {selectedLevel && (
                    <LevelModal
                        level={selectedLevel}
                        onClose={closeModal}
                        onComplete={handleLevelComplete}
                    />
                )}
            </div>
        </div>
    );
};

export default RoadmapPage;