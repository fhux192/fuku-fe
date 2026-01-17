import React, { useState } from 'react';
import { X, Star, Zap, Book, Play, Lock } from 'lucide-react';
import { LevelNode } from '../../../../types/roadmap.types';
import styles from './LevelDetailModal.module.css';

interface LevelDetailModalProps {
    level: LevelNode;
    onClose: () => void;
    onComplete: (levelId: number, stars: number) => void;
}

const LevelDetailModal: React.FC<LevelDetailModalProps> = ({ level, onClose, onComplete }) => {
    const [isStarting, setIsStarting] = useState(false);

    const handleStart = () => {
        setIsStarting(true);
        // Simulate level completion after 2 seconds
        setTimeout(() => {
            onComplete(level.id, 3); // Award 3 stars
        }, 2000);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <X size={20} />
                </button>

                {/* Level Header */}
                <div className={styles.modalHeader}>
                    <div className={styles.levelBadge}>
                        Level {level.id}
                    </div>
                    <h2 className={styles.modalTitle}>{level.title}</h2>
                    <div className={styles.xpDisplay}>
                        <Zap size={16} fill="#bfff00" />
                        <span>{level.xp} XP</span>
                    </div>
                </div>

                {/* Topics List */}
                <div className={styles.topicsSection}>
                    <h3 className={styles.sectionTitle}>
                        <Book size={18} />
                        Topics Covered
                    </h3>
                    <div className={styles.topicsList}>
                        {level.topics.map((topic, index) => (
                            <div key={index} className={styles.topicItem}>
                                <div className={styles.topicDot} />
                                <span>{topic}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Requirements for boss levels */}
                {level.type === 'boss' && level.requiredScore && (
                    <div className={styles.requirementBox}>
                        <Star size={16} fill="#ffd700" />
                        <span>Required Score: {level.requiredScore}%+</span>
                    </div>
                )}

                {/* Action Button */}
                <button
                    className={`${styles.startButton} ${level.status === 'completed' ? styles.completedBtn : ''}`}
                    onClick={handleStart}
                    disabled={isStarting || level.status === 'completed'}
                >
                    {isStarting ? (
                        <>
                            <div className={styles.spinner} />
                            Starting...
                        </>
                    ) : level.status === 'completed' ? (
                        <>
                            <Star size={18} fill="#bfff00" />
                            Completed
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="#000" />
                            Start Level
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default LevelDetailModal;