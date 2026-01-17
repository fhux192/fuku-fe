import React from 'react';
import { Star, Zap, Trophy } from 'lucide-react';
import { UserProgress } from '../../types/roadmap.types';
import styles from './ProgressHeader.module.css';

interface ProgressHeaderProps {
    progress: UserProgress;
    totalLevels: number;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({ progress, totalLevels }) => {
    const progressPercentage = (progress.completedLevels.length / totalLevels) * 100;

    return (
        <div className={styles.progressContainer}>
            <div className={styles.statsRow}>
                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <Trophy size={16} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{progress.completedLevels.length}/{totalLevels}</span>
                        <span className={styles.statLabel}>Levels</span>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon} style={{ background: 'rgba(191, 255, 0, 0.2)' }}>
                        <Zap size={16} fill="#bfff00" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{progress.totalXP.toLocaleString()}</span>
                        <span className={styles.statLabel}>Total XP</span>
                    </div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255, 215, 0, 0.2)', color: '#ffd700' }}>
                        <Star size={16} fill="#ffd700" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{progress.stars}</span>
                        <span className={styles.statLabel}>Stars</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBarContainer}>
                <div className={styles.progressBarBg}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <span className={styles.progressText}>{Math.round(progressPercentage)}% Complete</span>
            </div>
        </div>
    );
};

export default ProgressHeader;