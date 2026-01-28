import React from 'react';
import { Lock, CheckCircle, Zap, Crown, Star, Gift } from 'lucide-react';
import { LevelNode as LevelNodeType } from '../../roadmap.types';
import styles from './LevelNode.module.css';

interface LevelNodeProps {
    level: LevelNodeType;
    onClick: () => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({ level, onClick }) => {
    const { id, title, type, status, xp } = level;

    /**
     * Determine icon based on level type and status
     */
    const getIcon = () => {
        if (status === 'locked') return <Lock size={20} />;
        if (status === 'completed') return <CheckCircle size={20} />;
        if (type === 'boss') return <Crown size={24} />;
        if (type === 'bonus') return <Gift size={20} />;
        return <Zap size={20} />;
    };

    /**
     * Get appropriate CSS class for styling
     */
    const getNodeClass = () => {
        const classes = [styles.levelNode];
        classes.push(styles[status]); // locked, unlocked, current, completed
        classes.push(styles[type]); // normal, boss, bonus
        return classes.join(' ');
    };

    return (
        <button
            className={getNodeClass()}
            onClick={onClick}
            disabled={status === 'locked'}
            aria-label={`${title} - ${status}`}
        >
            {/* Glow effect for current/boss levels */}
            {(status === 'current' || type === 'boss') && (
                <div className={styles.nodeGlow} aria-hidden="true" />
            )}

            {/* Level number badge */}
            <div className={styles.levelNumber}>{id}</div>

            {/* Icon */}
            <div className={styles.levelIcon}>
                {getIcon()}
            </div>

            {/* XP indicator */}
            <div className={styles.xpBadge}>
                <Star size={10} fill="currentColor" />
                {xp}
            </div>

            {/* Status indicator dots for completed levels */}
            {status === 'completed' && (
                <div className={styles.completedStars}>
                    <Star size={8} fill="#bfff00" />
                    <Star size={8} fill="#bfff00" />
                    <Star size={8} fill="#bfff00" />
                </div>
            )}
        </button>
    );
};

export default LevelNode;