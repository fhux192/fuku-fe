// ============================================================================
// ProfilePage.tsx
// ============================================================================

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import styles from './ProfilePage.module.css';

// ============================================================================
// Types
// ============================================================================

interface UserLevelData {
    userId: number;
    userName: string;
    totalXp: number;
    levelNumber: number;
    rankName: string;
    stage: string;
    icon: string;
    progressPercent: number;
    xpToNextLevel: number;
    nextLevelXp: number | null;
    nextRankName: string | null;
    isMaxLevel: boolean;
    rankPosition: number;
}

interface ActivityLog {
    id: number;
    type: 'lesson' | 'quiz' | 'streak' | 'achievement' | 'login';
    title: string;
    description: string;
    xpGained: number;
    timestamp: string;
}

interface Achievement {
    id: number;
    icon: string;
    name: string;
    description: string;
    unlockedAt: string | null;
    locked: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const STAGE_COLORS: Record<string, string> = {
    MAM_NON:     '#4ade80',
    TIEU_HOC:    '#facc15',
    THCS:        '#fb923c',
    THPT:        '#60a5fa',
    CAO_DANG:    '#a78bfa',
    DAI_HOC:     '#f472b6',
    THAC_SI:     '#22d3ee',
    TIEN_SI:     '#f87171',
    PHO_GIAO_SU: '#fb923c',
    GIAO_SU:     '#fbbf24',
};

const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/api',
    LEVEL:    '/levels/me',
    UPDATE_AVATAR: '/users/me/avatar'
};

const DEFAULT_AVATAR = 'https://cdn.lordicon.com/bushiqea.json';

const AVATAR_OPTIONS = [
    'https://cdn.lordicon.com/dznelzdk.json',
    'https://cdn.lordicon.com/czcsywgo.json',
    'https://cdn.lordicon.com/ajzwsrcs.json',
    'https://cdn.lordicon.com/sgtmgpft.json',
    'https://cdn.lordicon.com/edplgash.json',
    "https://cdn.lordicon.com/nwfpiryp.json",
    "https://cdn.lordicon.com/rhmhivzj.json",
    "https://cdn.lordicon.com/hwfggmas.json"
];

// Mock data (giữ nguyên)
const MOCK_ACTIVITIES: ActivityLog[] = [
    { id: 1, type: 'lesson', title: 'Ngữ pháp N5 — Trợ từ は và が', description: 'Hoàn thành bài học', xpGained: 50, timestamp: '2026-03-03T08:30:00' },
    { id: 2, type: 'quiz', title: 'Từ vựng N5 — Tuần 2', description: 'Vượt qua bài kiểm tra', xpGained: 120, timestamp: '2026-03-03T10:15:00' },
    { id: 3, type: 'streak', title: '7 ngày học liên tiếp', description: 'Duy trì streak', xpGained: 200, timestamp: '2026-03-02T20:00:00' }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
    { id: 1, icon: '🌱', name: 'Mầm xanh', description: 'Tạo tài khoản thành công', unlockedAt: '2026-01-01', locked: false },
    { id: 2, icon: '📚', name: 'Chăm chỉ', description: 'Hoàn thành 10 bài học', unlockedAt: '2026-03-01', locked: false }
];

const MOCK_HEATMAP: Record<string, number> = (() => {
    const data: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 84; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split('T')[0];
        data[key] = Math.random() > 0.38 ? Math.floor(Math.random() * 5) + 1 : 0;
    }
    return data;
})();

// ============================================================================
// Utilities
// ============================================================================

const decodeJWT = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        ));
    } catch { return null; }
};

const getUserFromToken = () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return null;
        const decoded = decodeJWT(token);
        if (!decoded) return null;
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('authToken');
            return null;
        }
        return {
            name: decoded.name || 'Người dùng',
            email: decoded.sub || '',
            userId: decoded.id || null,
            discriminator: decoded.discriminator || '0000',
            avatar: decoded.avatar || DEFAULT_AVATAR
        };
    } catch { return null; }
};

const getStageColor = (stage?: string) => STAGE_COLORS[stage ?? ''] || '#4ade80';

const formatXp = (xp: number) =>
    xp >= 1000 ? (xp / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(xp);

const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatRelative = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 36e5);
    const d = Math.floor(diff / 864e5);
    if (h < 1)  return 'Vừa xong';
    if (h < 24) return `${h} giờ trước`;
    if (d < 7)  return `${d} ngày trước`;
    return formatDate(ts);
};

const ACTIVITY_META: Record<ActivityLog['type'], { color: string; icon: string }> = {
    lesson:      { color: '#4ade80', icon: '📖' },
    quiz:        { color: '#60a5fa', icon: '✅' },
    streak:      { color: '#fb923c', icon: '🔥' },
    achievement: { color: '#fbbf24', icon: '🏆' },
    login:       { color: '#a78bfa', icon: '📅' },
};

// ============================================================================
// Heatmap Component
// ============================================================================

const Heatmap: React.FC<{ data: Record<string, number>, stageColor: string }> = ({ data, stageColor }) => {
    const today = new Date();
    const days = Array.from({ length: 84 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (83 - i));
        const key = d.toISOString().split('T')[0];
        return { key, count: data[key] || 0 };
    });

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const cellBg = (n: number) => {
        if (n === 0) return 'rgba(26,26,46,0.04)';
        const ops = [0.2, 0.4, 0.6, 0.8, 1];
        return hexToRgba(stageColor, ops[Math.min(n, 5) - 1]);
    };

    return (
        <div className={styles.heatmapWrapper}>
            <div className={styles.heatmap}>
                {days.map(({ key, count }) => (
                    <div
                        key={key}
                        className={styles.heatCell}
                        style={{ background: cellBg(count) }}
                        title={`${key}: ${count} hoạt động`}
                    />
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// Main Component
// ============================================================================

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [user,      setUser]      = useState<{ name: string; email: string; userId: number | null, discriminator: string, avatar: string } | null>(null);
    const [level,     setLevel]     = useState<UserLevelData | null>(null);
    const [loading,   setLoading]   = useState(true);
    const [activeTab, setActiveTab] = useState<'activity' | 'achievements'>('activity');

    const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchLevel = useCallback(async (uid: number) => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.LEVEL}/${uid}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!res.ok) return;
            const json = await res.json();
            setLevel(json.success ? json.data : json.userId ? json : null);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        defineElement(lottie.loadAnimation);

        const u = getUserFromToken();
        if (!u) { navigate('/home'); return; }

        setUser(u);

        // Cache avatar local
        const savedAvatar = localStorage.getItem(`userAvatar_${u.email}`);
        setSelectedAvatar(savedAvatar || u.avatar);

        if (u.userId) {
            fetchLevel(u.userId).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [navigate, fetchLevel]);

    const handleCopyTag = () => {
        if (!user?.name || !user?.discriminator) return;
        navigator.clipboard.writeText(`${user.name}#${user.discriminator}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleSaveAvatar = async (url: string) => {
        setSelectedAvatar(url);
        setIsAvatarModalOpen(false);
        if (user?.email) {
            localStorage.setItem(`userAvatar_${user.email}`, url);
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.UPDATE_AVATAR}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ avatar: url })
            });

            if (!response.ok) console.error('Lỗi server cập nhật avatar');
        } catch (error) {
            console.error('Lỗi mạng cập nhật avatar:', error);
        }
    };

    const stageColor = getStageColor(level?.stage);

    if (loading) {
        return (
            <div className={styles.loadingWrap}>
                <div className={styles.spinner} style={{ borderTopColor: stageColor }} />
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* ── Top Bar ─────────────────────────────────────────────────── */}
            <header className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Quay lại
                </button>
                <span className={styles.topTitle}>Hồ sơ cá nhân</span>
                <div style={{ width: '80px' }}></div>
            </header>

            <div className={styles.contentWrapper}>
                {/* ── Identity block ────────────────────────────────────────── */}
                <div className={styles.identityBlock}>
                    <div className={styles.identityGlow} style={{ background: `radial-gradient(circle at top right, ${stageColor}1A 0%, transparent 60%)` }} />

                    <div className={styles.avatarWrap} onClick={() => setIsAvatarModalOpen(true)}>
                        <div className={styles.avatarOuter} style={{ borderColor: stageColor }}>
                            <div className={styles.avatarInner}>
                                {/* @ts-ignore */}
                                <lord-icon
                                    src={selectedAvatar}
                                    trigger="hover"
                                    style={{ width: '60px', height: '60px' }}
                                />
                            </div>
                        </div>
                        <div className={styles.avatarEditOverlay}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        </div>
                    </div>

                    <div className={styles.identityInfo}>
                        <h1 className={styles.userName}>{user?.name || 'Người dùng'}</h1>

                        <div className={styles.chipsRow}>
                            <span
                                className={styles.rankChip}
                                style={{ color: stageColor, background: `${stageColor}14`, borderColor: `${stageColor}28` }}
                            >
                                {level?.rankName || 'Mầm non 1'}
                            </span>
                            <button className={styles.idChip} onClick={handleCopyTag}>
                                <span>#{user?.discriminator ?? '0000'}</span>
                                <span className={styles.copyIcon} style={{ color: copied ? stageColor : 'inherit' }}>
                                    {copied ? '✓' : '⎘'}
                                </span>
                            </button>
                        </div>


                        <div className={styles.metaLine}>
                            <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8"  y1="2" x2="8"  y2="6"/>
                                    <line x1="3"  y1="10" x2="21" y2="10"/>
                                </svg>
                                Tham gia {formatDate('2026-01-01')}
                            </span>
                            <i />
                            <span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                </svg>
                                Hạng #{level?.rankPosition ?? '—'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── XP progress ─────────────────────────────────────────────── */}
                <div className={styles.card} style={{ borderTop: `4px solid ${stageColor}` }}>
                    <div className={styles.xpTopRow}>
                        <div>
                            <p className={styles.xpCaption}>Tổng kinh nghiệm</p>
                            <p className={styles.xpBig} style={{ color: stageColor }}>
                                {formatXp(level?.totalXp || 0)}<span className={styles.xpUnit}> XP</span>
                            </p>
                        </div>
                        {!level?.isMaxLevel && (
                            <div className={styles.xpGoal}>
                                <p className={styles.xpCaption}>Mục tiêu kế tiếp</p>
                                <p className={styles.xpGoalValue}>{level?.nextRankName || 'Mầm non 2'}</p>
                            </div>
                        )}
                    </div>
                    <div className={styles.xpTrack}>
                        <div
                            className={styles.xpFill}
                            style={{ width: `${Math.min(level?.progressPercent || 0, 100)}%`, background: stageColor }}
                        />
                    </div>
                    <p className={styles.xpHint}>
                        {level?.isMaxLevel
                            ? '🎉 Đã đạt cấp độ tối đa'
                            : <>Còn <strong style={{ color: stageColor }}>{formatXp(level?.xpToNextLevel || 250)} XP</strong> nữa</>
                        }
                    </p>
                </div>

                {/* ── Stats Grid ─────────────────────────────────────────────── */}
                <div className={styles.statsGrid}>
                    {([
                        { label: 'Bài học',     value: '47',  unit: 'bài' },
                        { label: 'Quiz',        value: '23',  unit: 'bài' },
                        { label: 'Chuỗi hiện tại', value: '7',   unit: 'ngày' },
                        { label: 'Chuỗi tối đa',   value: '14',  unit: 'ngày' },
                    ] as const).map((s, i) => (
                        <div key={i} className={styles.statCell}>
                            <div className={styles.statIconWrap} style={{ color: stageColor, background: `${stageColor}14` }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {s.label.includes('Bài') && <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
                                    {s.label.includes('Quiz') && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                                    {s.label.includes('Chuỗi') && <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>}
                                </svg>
                            </div>
                            <div className={styles.statData}>
                                <span className={styles.statVal}>{s.value}</span>
                                <span className={styles.statUnit}>{s.unit}</span>
                            </div>
                            <span className={styles.statLbl}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Heatmap ─────────────────────────────────────────────────── */}
                <div className={styles.card}>
                    <div className={styles.cardHead}>
                        <span className={styles.cardTitle}>Hoạt động 12 tuần</span>
                        <div className={styles.heatLegend}>
                            <span>Ít</span>
                            {[0,1,2,3,4,5].map(n => {
                                const hexToRgba = (hex: string, alpha: number) => {
                                    const r = parseInt(hex.slice(1, 3), 16);
                                    const g = parseInt(hex.slice(3, 5), 16);
                                    const b = parseInt(hex.slice(5, 7), 16);
                                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                                };
                                const dynamicBg = n === 0 ? 'rgba(26,26,46,0.04)' : hexToRgba(stageColor, [0.2,0.4,0.6,0.8,1][n-1]);
                                return <div key={n} className={styles.heatLegendDot} style={{ background: dynamicBg }} />
                            })}
                            <span>Nhiều</span>
                        </div>
                    </div>
                    <Heatmap data={MOCK_HEATMAP} stageColor={stageColor} />
                </div>

                {/* ── Tab Bar ─────────────────────────────────────────────────── */}
                <div className={styles.tabBar}>
                    {(['activity', 'achievements'] as const).map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.tabOn : ''}`}
                            onClick={() => setActiveTab(tab)}
                            style={activeTab === tab ? { borderBottomColor: stageColor, color: stageColor } : {}}
                        >
                            {tab === 'activity' ? 'Lịch sử' : 'Thành tích'}
                            {tab === 'achievements' && (
                                <span className={styles.tabBadge}>
                                    {MOCK_ACHIEVEMENTS.filter(a => !a.locked).length}/{MOCK_ACHIEVEMENTS.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── List Content ────────────────────────────────────────────── */}
                {activeTab === 'activity' ? (
                    <div className={styles.listContainer}>
                        {MOCK_ACTIVITIES.map((a, i) => {
                            const m = ACTIVITY_META[a.type];
                            return (
                                <div key={a.id} className={styles.actRow} style={{ animationDelay: `${i * 40}ms` }}>
                                    <div className={styles.actDot} style={{ background: `${m.color}18`, color: m.color }}><span>{m.icon}</span></div>
                                    <div className={styles.actText}>
                                        <span className={styles.actTitle}>{a.title}</span>
                                        <span className={styles.actSub}>{a.description} · {formatRelative(a.timestamp)}</span>
                                    </div>
                                    <span className={styles.actXp} style={{ color: m.color }}>+{a.xpGained}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.achieveGrid}>
                        {MOCK_ACHIEVEMENTS.map((a, i) => (
                            <div key={a.id} className={`${styles.achieveCard} ${a.locked ? styles.achieveLocked : ''}`} style={{ animationDelay: `${i * 40}ms` }}>
                                <div className={styles.achieveIconWrap}><span className={styles.achieveIcon}>{a.locked ? '🔒' : a.icon}</span></div>
                                <span className={styles.achieveName}>{a.name}</span>
                                <span className={styles.achieveDesc}>{a.description}</span>
                                {!a.locked && a.unlockedAt && <span className={styles.achieveDate}>{formatDate(a.unlockedAt)}</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ height: '60px' }} />

            {/* ── Avatar Modal ────────────────────────────────────────────── */}
            {isAvatarModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAvatarModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Chọn ảnh đại diện</h3>
                            <button className={styles.modalCloseBtn} onClick={() => setIsAvatarModalOpen(false)}>✕</button>
                        </div>
                        <div className={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map((url, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.avatarOption} ${selectedAvatar === url ? styles.avatarSelected : ''}`}
                                    onClick={() => handleSaveAvatar(url)}
                                >
                                    {/* @ts-ignore */}
                                    <lord-icon src={url} trigger="hover" style={{ width: '50px', height: '50px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;