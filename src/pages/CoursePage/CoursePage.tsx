import React, { useState, useEffect } from 'react';
import { Award, Trophy, Flame, Medal, TrendingUp, Crown, Zap } from 'lucide-react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './CoursePage.module.css';

// ============================================================================
// Types
// ============================================================================

interface Course {
    id: string;
    lv: string;
    name: string;
    kanji: string;
    duration: string;
    students: string;
    lessons: number;
}

interface RankUser {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    score: string;
    sub: string; // Thông tin phụ (vd: Level hoặc số bài)
    trend?: 'up' | 'down' | 'same';
}

// ============================================================================
// Constants
// ============================================================================

const COURSES_DATA: Course[] = [
    { id: 'n5', lv: 'N5', name: 'Nhập Môn', kanji: '始', duration: '3 tháng', students: '2.5k+', lessons: 48 },
    { id: 'n4', lv: 'N4', name: 'Sơ Cấp', kanji: '歩', duration: '4 tháng', students: '1.8k+', lessons: 64 },
    { id: 'n3', lv: 'N3', name: 'Trung Cấp', kanji: '通', duration: '5 tháng', students: '1.2k+', lessons: 80 },
    { id: 'n2', lv: 'N2', name: 'Thượng Cấp', kanji: '進', duration: '6 tháng', students: '800+', lessons: 96 },
    { id: 'n1', lv: 'N1', name: 'Cao Cấp', kanji: '極', duration: '8 tháng', students: '500+', lessons: 128 },
];

const HARD_WORKING_USERS: RankUser[] = [
    { id: 'u1', rank: 1, name: 'Nguyễn Văn A', avatar: 'A', score: '42h', sub: '128 bài', trend: 'up' },
    { id: 'u2', rank: 2, name: 'Trần Thị B', avatar: 'B', score: '38h', sub: '96 bài', trend: 'up' },
    { id: 'u3', rank: 3, name: 'Lê Hoàng C', avatar: 'C', score: '35h', sub: '80 bài', trend: 'same' },
    { id: 'u4', rank: 4, name: 'Phạm Minh D', avatar: 'D', score: '28h', sub: '64 bài', trend: 'down' },
    { id: 'u5', rank: 5, name: 'Hoàng Yến E', avatar: 'E', score: '22h', sub: '48 bài', trend: 'up' },
    { id: 'u6', rank: 6, name: 'User Test 6', avatar: 'F', score: '20h', sub: '40 bài', trend: 'down' },
    { id: 'u7', rank: 7, name: 'User Test 7', avatar: 'G', score: '18h', sub: '32 bài', trend: 'same' },
];

const TOP_SCORERS: RankUser[] = [
    { id: 't1', rank: 1, name: 'Master JLPT', avatar: 'M', score: '180', sub: 'N1 - Perfect', trend: 'same' },
    { id: 't2', rank: 2, name: 'Ninja Kanji', avatar: 'N', score: '175', sub: 'N1 - Giỏi', trend: 'up' },
    { id: 't3', rank: 3, name: 'Sakura Chan', avatar: 'S', score: '178', sub: 'N2 - Xuất sắc', trend: 'up' },
    { id: 't4', rank: 4, name: 'Doraemon', avatar: 'D', score: '160', sub: 'N2 - Khá', trend: 'down' },
    { id: 't5', rank: 5, name: 'Nobita', avatar: 'N', score: '155', sub: 'N3 - Đậu', trend: 'up' },
    { id: 't6', rank: 6, name: 'Shizuka', avatar: 'S', score: '150', sub: 'N3 - Đậu', trend: 'same' },
];

// ============================================================================
// Component
// ============================================================================

const CoursePage: React.FC = () => {
    // State
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    // Effect: Initialize Lordicon
    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    // ========================================================================
    // Handlers
    // ========================================================================

    const handleCourseSelect = (id: string): void => {
        setSelectedCourse(id);
    };

    // ========================================================================
    // Helpers
    // ========================================================================

    const renderRankBadge = (rank: number): React.ReactNode => {
        if (rank === 1) return <div className={styles.badge1}><Crown size={18} fill="#000" /></div>;
        if (rank === 2) return <div className={styles.badge2}><Medal size={18} /></div>;
        if (rank === 3) return <div className={styles.badge3}><Medal size={18} /></div>;
        return <span className={styles.badgeNormal}>{rank}</span>;
    };

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Khóa Học JLPT</h1>
                <p className={styles.pageSubtitle}>Chinh phục tiếng Nhật từ con số 0 đến N1</p>
            </div>

            {/* Learning Path */}
            <div className={styles.pathSection}>
                <div className={styles.pathHeader}>
                    <Zap size={20} fill="var(--color-lt-green)" stroke="none" />
                    <span>Lộ Trình Tiêu Chuẩn</span>
                </div>
                <div className={styles.pathTrack}>
                    {COURSES_DATA.map((course, index) => (
                        <React.Fragment key={course.id}>
                            <div className={styles.pathNode}>
                                <div className={styles.pathKanji}>{course.kanji}</div>
                                <div className={styles.pathLabel}>{course.lv}</div>
                            </div>
                            {index < COURSES_DATA.length - 1 && <div className={styles.pathLine} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Ranking Section */}
            <div className={styles.rankSection}>
                <div className={styles.rankContainer}>

                    {/* BẢNG 1: CHĂM CHỈ */}
                    <div className={styles.rankBoard}>
                        <div className={styles.boardHeader}>
                            <div className={styles.boardTitle}>
                                <div className={styles.iconBox} style={{ background: 'rgba(255, 107, 107, 0.2)', color: '#ff6b6b' }}>
                                    <Flame size={20} fill="#ff6b6b" />
                                </div>
                                <div>
                                    <h3>BXH Chăm Chỉ</h3>
                                    <p>Tuần này</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tableHeader}>
                            <div className={styles.colRank}>#</div>
                            <div className={styles.colName}>Tên học viên</div>
                            <div className={styles.colScore}>Giờ học</div>
                        </div>

                        <div className={styles.scrollList}>
                            {HARD_WORKING_USERS.map((user) => (
                                <div key={user.id} className={`${styles.rankItem} ${user.rank === 1 ? styles.top1 : ''}`}>
                                    <div className={styles.colRank}>
                                        {renderRankBadge(user.rank)}
                                    </div>
                                    <div className={styles.colName}>
                                        <div className={styles.avatar}>{user.avatar}</div>
                                        <div className={styles.info}>
                                            <span className={styles.uName}>{user.name}</span>
                                            <span className={styles.uSub}>{user.sub}</span>
                                        </div>
                                    </div>
                                    <div className={styles.colScore}>
                                        <span className={styles.scoreVal}>{user.score}</span>
                                        {user.trend === 'up' && <TrendingUp size={12} className={styles.trendIcon} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BẢNG 2: CAO THỦ */}
                    <div className={styles.rankBoard}>
                        <div className={styles.boardHeader}>
                            <div className={styles.boardTitle}>
                                <div className={styles.iconBox} style={{ background: 'rgba(191, 255, 0, 0.3)', color: '#ffea00' }}>
                                    <Trophy size={20} fill="#ffea00" />
                                </div>
                                <div>
                                    <h3>Top Cao Thủ</h3>
                                    <p>Thi thử JLPT</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.tableHeader}>
                            <div className={styles.colRank}>#</div>
                            <div className={styles.colName}>Tên học viên</div>
                            <div className={styles.colScore}>Điểm</div>
                        </div>

                        <div className={styles.scrollList}>
                            {TOP_SCORERS.map((user) => (
                                <div key={user.id} className={`${styles.rankItem} ${user.rank === 1 ? styles.top1 : ''}`}>
                                    <div className={styles.colRank}>
                                        {renderRankBadge(user.rank)}
                                    </div>
                                    <div className={styles.colName}>
                                        <div
                                            className={styles.avatar}
                                            style={{
                                                background: user.rank === 1 ? '#bfff00' : '#333',
                                                color: user.rank === 1 ? 'black' : 'white'
                                            }}
                                        >
                                            {user.avatar}
                                        </div>
                                        <div className={styles.info}>
                                            <span className={styles.uName}>{user.name}</span>
                                            <span className={styles.uSub} style={{ color: '#bfff00' }}>{user.sub}</span>
                                        </div>
                                    </div>
                                    <div className={styles.colScore}>
                                        <div className={styles.scoreBadge}>
                                            {user.score}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Course List Section */}
            <h2 className={styles.sectionHeading}>Danh Sách Khóa Học</h2>
            <div className={styles.courseGrid}>
                {COURSES_DATA.map((course) => (
                    <div
                        key={course.id}
                        className={`${styles.courseCard} ${selectedCourse === course.id ? styles.selected : ''}`}
                        onClick={() => handleCourseSelect(course.id)}
                    >
                        <div className={styles.cardBg}>{course.kanji}</div>

                        <div className={styles.cardTop}>
                            <div className={styles.levelBadge}>{course.lv}</div>
                            {selectedCourse === course.id && (
                                <div className={styles.selectedBadge}>
                                    <Award size={14} />
                                </div>
                            )}
                        </div>

                        <h3 className={styles.courseName}>{course.name}</h3>

                        <div className={styles.courseStats}>
                            <div className={styles.stat}>
                                {/* @ts-ignore - lord-icon is a custom element */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/okqjaags.json"
                                    trigger="hover"
                                    colors="primary:#bfff00"
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <span>{course.duration}</span>
                            </div>
                            <div className={styles.stat}>
                                {/* @ts-ignore - lord-icon is a custom element */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/hjrbjhnq.json"
                                    trigger="hover"
                                    colors="primary:#bfff00"
                                    style={{ width: '16px', height: '16px' }}
                                />
                                <span>{course.lessons} bài</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;