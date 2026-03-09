// ============================================================================
// History.tsx
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './History.module.css';

// ============================================================================
// Types
// ============================================================================

interface DecodedToken {
    id: number;
    name: string;
    sub: string;
    iat: number;
    exp: number;
}

interface LoginStreakData {
    currentStreak: number;
    longestStreak: number;
    totalLoginDays: number;
    lastLoginDate: string | null;
    loginDatesThisMonth: string[]; // Format: YYYY-MM-DD
}

interface CalendarDay {
    date: number;
    month: 'prev' | 'current' | 'next';
    fullDateString: string;
    isLogged: boolean;
    isToday: boolean;
}

interface ActivityItem {
    id: string;
    title: string;
    type: 'lesson' | 'exam' | 'practice';
    xp: number;
    timestamp: string;
    date: string;
}

// ============================================================================
// Constants & Mock Data
// ============================================================================

const WEEK_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTH_NAMES = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    STREAK_INFO: '/daily-login/streak'
};

const UI_CONFIG = {
    ICONS: {
        FIRE: 'https://cdn.lordicon.com/kataohvx.json',
        STAR: 'https://cdn.lordicon.com/hrtsficn.json'
    }
};

const EMPTY_STREAK: LoginStreakData = {
    currentStreak: 0,
    longestStreak: 0,
    totalLoginDays: 0,
    lastLoginDate: null,
    loginDatesThisMonth: []
};

const MOCK_ACTIVITIES: ActivityItem[] = [
    { id: '1', title: 'Bảng chữ cái Hiragana - Phần 1', type: 'lesson', xp: 50, timestamp: '10:30', date: 'Hôm nay' },
    { id: '2', title: 'Luyện tập phát âm cơ bản', type: 'practice', xp: 30, timestamp: '09:15', date: 'Hôm nay' },
    { id: '3', title: 'Từ vựng JLPT N5 - Bài 1', type: 'lesson', xp: 50, timestamp: '20:45', date: 'Hôm qua' },
    { id: '4', title: 'Bài kiểm tra Mini Test #1', type: 'exam', xp: 120, timestamp: '19:00', date: 'Hôm qua' },
    { id: '5', title: 'Ngữ pháp cơ bản: Cấu trúc ~wa ~desu', type: 'lesson', xp: 60, timestamp: '14:20', date: '2 ngày trước' },
    { id: '6', title: 'Bảng chữ cái Katakana - Phần 1', type: 'lesson', xp: 50, timestamp: '10:00', date: '3 ngày trước' },
];

// ============================================================================
// Custom Hooks
// ============================================================================

/**
 * Hook to animate a number counting up from 0 to a target value smoothly.
 * Fixed to prevent React re-render overload.
 */
const useCountUp = (endValue: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (endValue <= 0) {
            setCount(0);
            return;
        }

        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);

            // Cubic ease-out: chạy nhanh ở đầu, chậm mượt về cuối
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(easeOut * endValue);

            // CHỈ update state khi con số thực sự thay đổi (Tránh gây đơ/lag UI do render 60fps)
            setCount(prev => (prev !== currentValue ? currentValue : prev));

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            } else {
                setCount(endValue); // Ép chắc chắn về đúng số liệu gốc khi hết thời gian
            }
        };

        animationFrameId = requestAnimationFrame(step);

        return () => cancelAnimationFrame(animationFrameId);
    }, [endValue, duration]);

    return count;
};

// ============================================================================
// Utility Functions
// ============================================================================

const decodeJWT = (token: string): DecodedToken | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        return null;
    }
};

const getUserFromToken = (): { name: string; email: string; userId: number; token: string } | null => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        const decoded = decodeJWT(token);
        if (!decoded || (decoded.exp && decoded.exp < Date.now() / 1000) || !decoded.id) {
            localStorage.removeItem('authToken');
            return null;
        }

        return {
            name: decoded.name || 'Người dùng',
            email: decoded.sub || '',
            userId: decoded.id,
            token
        };
    } catch (error) {
        return null;
    }
};

const buildDateString = (year: number, month1Indexed: number, day: number): string => {
    return `${year}-${String(month1Indexed).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// ============================================================================
// Main Component
// ============================================================================

const History: React.FC = () => {
    const navigate = useNavigate();

    // =========================================================================
    // Refs
    // =========================================================================

    const isIconDefined = useRef<boolean>(false);

    // =========================================================================
    // State
    // =========================================================================

    const [currentUser, setCurrentUser] = useState<{ name: string; userId: number; token: string } | null>(null);
    const [authChecked, setAuthChecked] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [streakData, setStreakData] = useState<LoginStreakData>(EMPTY_STREAK);
    const [activities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);

    // Chạy số trong đúng 2 giây (2000ms)
    const animatedStreak = useCountUp(streakData.currentStreak, 2000);
    const animatedTotalDays = useCountUp(streakData.totalLoginDays, 2000);

    // =========================================================================
    // Effects
    // =========================================================================

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
        const user = getUserFromToken();
        setCurrentUser(user);
        setAuthChecked(true);
    }, []);

    const fetchStreakInfo = useCallback(async (userId: number, token: string) => {
        setIsLoading(true);
        setFetchError(null);

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.STREAK_INFO}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    setCurrentUser(null);
                    return;
                }
            }

            const result = await response.json();
            const data: LoginStreakData = result.success && result.data ? result.data : result;


            setStreakData(data);
        } catch (error) {
            setFetchError('Không thể tải dữ liệu lịch.');
            setStreakData(EMPTY_STREAK);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authChecked || !currentUser) return;
        fetchStreakInfo(currentUser.userId, currentUser.token);
    }, [authChecked, currentUser, currentDate, fetchStreakInfo]);

    // =========================================================================
    // Calendar Logic
    // =========================================================================

    const calendarDays = useMemo((): CalendarDay[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: CalendarDay[] = [];
        const todayStr = new Date().toISOString().split('T')[0];
        const loginDatesSet = new Set(streakData.loginDatesThisMonth);

        for (let i = 0; i < firstDayOfMonth; i++) {
            const day = daysInPrevMonth - firstDayOfMonth + i + 1;
            const dateStr = buildDateString(month === 0 ? year - 1 : year, month === 0 ? 12 : month, day);
            days.push({ date: day, month: 'prev', fullDateString: dateStr, isLogged: false, isToday: false });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = buildDateString(year, month + 1, i);
            days.push({ date: i, month: 'current', fullDateString: dateStr, isLogged: loginDatesSet.has(dateStr), isToday: dateStr === todayStr });
        }

        const remainingCells = 42 - days.length;
        for (let i = 1; i <= remainingCells; i++) {
            const dateStr = buildDateString(month === 11 ? year + 1 : year, month === 11 ? 1 : month + 2, i);
            days.push({ date: i, month: 'next', fullDateString: dateStr, isLogged: false, isToday: false });
        }

        return days;
    }, [currentDate, streakData.loginDatesThisMonth]);

    // =========================================================================
    // Handlers
    // =========================================================================

    const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    // =========================================================================
    // Render Helpers
    // =========================================================================

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'exam':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                );
            case 'practice':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                );
            case 'lesson':
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                );
        }
    };

    // =========================================================================
    // Guard States
    // =========================================================================

    if (!authChecked) {
        return <div className={styles.container}><div className={styles.spinner} /></div>;
    }

    if (!currentUser) {
        return (
            <div className={styles.container}>
                <div className={styles.unauthContent}>
                    <span className={styles.unauthIcon}>🔒</span>
                    <h2>Đăng nhập để xem lịch sử</h2>
                    <button className={styles.btnPrimary} onClick={() => navigate('/home/course')}>Về trang chủ</button>
                </div>
            </div>
        );
    }

    // =========================================================================
    // Main Render
    // =========================================================================

    return (
        <div className={styles.container}>
            <div className={styles.layoutGrid}>

                {/* ============================================================
                    CỘT TRÁI (30%) - Lịch Mini & Thông tin
                ============================================================ */}
                <aside className={styles.leftColumn}>
                    <div className={styles.userCard}>
                        <h1 className={styles.greeting}><span className={styles.highlight}>Chuỗi ngày học</span></h1>

                        <div className={styles.miniStatsRow}>
                            <div className={styles.miniStat}>
                                <div className={styles.msIcon}>
                                    
                                    <lord-icon
                                        src={UI_CONFIG.ICONS.FIRE}
                                        trigger="loop"
                                        delay="1000"
                                        colors="primary:#f97316,secondary:#fbbf24"
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                </div>
                                <div className={styles.msInfo}>
                                    <span className={styles.msValue}>{animatedStreak}</span>
                                    <span className={styles.msLabel}>Liên tục</span>
                                </div>
                            </div>

                            <div className={styles.miniStatDivider} />

                            <div className={styles.miniStat}>
                                <div className={styles.msIcon}>
                                    
                                    <lord-icon
                                        src={UI_CONFIG.ICONS.STAR}
                                        trigger="loop"
                                        delay="1500"
                                        colors="primary:#4ade80,secondary:#86efac"
                                        style={{ width: '32px', height: '32px' }}
                                    />
                                </div>
                                <div className={styles.msInfo}>
                                    <span className={styles.msValue}>{animatedTotalDays}</span>
                                    <span className={styles.msLabel}>Tổng ngày</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.calendarWidget}>
                        <div className={styles.calendarHeader}>
                            <div className={styles.calMonthLabel}>
                                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </div>
                            <div className={styles.calControls}>
                                <button onClick={handlePrevMonth} disabled={isLoading}>&lt;</button>
                                <button onClick={handleNextMonth} disabled={isLoading}>&gt;</button>
                            </div>
                        </div>

                        {fetchError && <div className={styles.errorMini}>{fetchError}</div>}

                        {isLoading ? (
                            <div className={styles.calLoading}><div className={styles.spinnerMini} /></div>
                        ) : (
                            <div className={styles.calGrid}>
                                {WEEK_DAYS.map(day => <div key={day} className={styles.calWeekday}>{day}</div>)}
                                {calendarDays.map((dayObj, i) => {
                                    const isCur = dayObj.month === 'current';
                                    return (
                                        <div
                                            key={i}
                                            className={[
                                                styles.calCell,
                                                !isCur ? styles.calDimmed : '',
                                                dayObj.isToday ? styles.calToday : '',
                                                dayObj.isLogged && isCur ? styles.calLogged : ''
                                            ].filter(Boolean).join(' ')}
                                        >
                                            {dayObj.date}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className={styles.calFooter}>
                            Điểm danh tháng này: <strong>{streakData.loginDatesThisMonth.length}</strong> ngày
                        </div>
                    </div>
                </aside>

                {/* ============================================================
                    CỘT PHẢI (70%) - Danh sách bài đã làm
                ============================================================ */}
                <main className={styles.rightColumn}>
                    <div className={styles.activityPanel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Lịch sử bài làm</h2>
                            <div className={styles.filterPill}>Gần đây nhất</div>
                        </div>

                        <div className={styles.activityList}>
                            {activities.map(activity => (
                                <div key={activity.id} className={styles.activityItem}>
                                    <div className={`${styles.actIconWrapper} ${styles[`bg_${activity.type}`]}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    <div className={styles.actContent}>
                                        <h3 className={styles.actTitle}>{activity.title}</h3>
                                        <div className={styles.actMeta}>
                                            <span className={styles.actDate}>{activity.date}</span>
                                            <span className={styles.actDot}>•</span>
                                            <span className={styles.actTime}>{activity.timestamp}</span>
                                        </div>
                                    </div>

                                    <div className={styles.actXp}>
                                        <span className={styles.xpText}>+{activity.xp} XP</span>
                                    </div>
                                </div>
                            ))}

                            <button className={styles.loadMoreBtn}>
                                Tải thêm lịch sử
                            </button>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
};

export default History;