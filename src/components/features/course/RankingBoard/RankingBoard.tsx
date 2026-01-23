
import React from 'react';
import { Crown, Medal, TrendingUp, Flame, Trophy } from 'lucide-react';
import { RankingBoardProps, RankUser } from '../../../../types/course.types';
import styles from './RankingBoard.module.css';

/**
 * Memoized to prevent re-renders when parent state changes
 * but ranking data remains the same
 */
const RankingBoard: React.FC<RankingBoardProps> = React.memo(({
                                                                  type,
                                                                  users,
                                                                  title,
                                                                  subtitle,
                                                                  iconColor,
                                                                  iconBgColor,
                                                                  scoreLabel,
                                                              }) => {
    // Extracted to reduce component complexity and improve testability
    const renderRankBadge = (rank: number): React.ReactNode => {
        // Early returns improve readability and performance
        if (rank === 1) return <div className={styles.badge1}><Crown size={18} fill="#000" /></div>;
        if (rank === 2) return <div className={styles.badge2}><Medal size={18} /></div>;
        if (rank === 3) return <div className={styles.badge3}><Medal size={18} /></div>;
        return <span className={styles.badgeNormal}>{rank}</span>;
    };

    // Conditional rendering for different ranking types improves maintainability
    const Icon = type === 'hardworking' ? Flame : Trophy;
    const isTopScorer = type === 'topscorer';

    return (
        <div className={styles.rankBoard}>
            <div className={styles.boardHeader}>
                <div className={styles.boardTitle}>
                    <div className={styles.iconBox} style={{ background: iconBgColor, color: iconColor }}>
                        <Icon size={20} fill={iconColor} />
                    </div>
                    <div>
                        <h3>{title}</h3>
                        <p>{subtitle}</p>
                    </div>
                </div>
            </div>

            <div className={styles.tableHeader}>
                <div className={styles.colRank}>#</div>
                <div className={styles.colName}>Tên học viên</div>
                <div className={styles.colScore}>{scoreLabel}</div>
            </div>

            {/* aria-label improves accessibility for screen readers */}
            <div className={styles.scrollList} role="list" aria-label={`${title} ranking`}>
                {users.map((user) => (
                    <RankingItem
                        key={user.id}
                        user={user}
                        isTopScorer={isTopScorer}
                        renderRankBadge={renderRankBadge}
                    />
                ))}
            </div>
        </div>
    );
});

/**
 * Separate component for each ranking item to enable fine-grained memoization
 * Prevents re-rendering all items when only one changes
 */
interface RankingItemProps {
    user: RankUser;
    isTopScorer: boolean;
    renderRankBadge: (rank: number) => React.ReactNode;
}

const RankingItem: React.FC<RankingItemProps> = React.memo(({ user, isTopScorer, renderRankBadge }) => {
    const avatarStyle = isTopScorer && user.rank === 1
        ? { background: '#4ade80', color: 'black' }
        : undefined;

    const subStyle = isTopScorer
        ? { color: '#4ade80' }
        : undefined;

    return (
        <div
            className={`${styles.rankItem} ${user.rank === 1 ? styles.top1 : ''}`}
            role="listitem"
            aria-label={`${user.rank}. ${user.name} - ${user.score}`}
        >
            <div className={styles.colRank}>
                {renderRankBadge(user.rank)}
            </div>
            <div className={styles.colName}>
                <div className={styles.avatar} style={avatarStyle}>
                    {user.avatar}
                </div>
                <div className={styles.info}>
                    <span className={styles.uName}>{user.name}</span>
                    <span className={styles.uSub} style={subStyle}>{user.sub}</span>
                </div>
            </div>
            <div className={styles.colScore}>
                {isTopScorer ? (
                    <div className={styles.scoreBadge}>{user.score}</div>
                ) : (
                    <>
                        <span className={styles.scoreVal}>{user.score}</span>
                        {user.trend === 'up' && <TrendingUp size={12} className={styles.trendIcon} />}
                    </>
                )}
            </div>
        </div>
    );
});

RankingBoard.displayName = 'RankingBoard';
RankingItem.displayName = 'RankingItem';

export default RankingBoard;