import { Course, RankUser } from './course.types';

/**
 * Centralized data source - easier to replace with API calls later
 * and prevents data duplication across components
 */

export const COURSES_DATA: Course[] = [
    { id: 'n5', lv: 'N5', name: 'Nhập Môn', kanji: '始', duration: '3 tháng', students: '2.5k+', lessons: 48 },
    { id: 'n4', lv: 'N4', name: 'Sơ Cấp', kanji: '歩', duration: '4 tháng', students: '1.8k+', lessons: 64 },
    { id: 'n3', lv: 'N3', name: 'Trung Cấp', kanji: '通', duration: '5 tháng', students: '1.2k+', lessons: 80 },
    { id: 'n2', lv: 'N2', name: 'Thượng Cấp', kanji: '進', duration: '6 tháng', students: '800+', lessons: 96 },
    { id: 'n1', lv: 'N1', name: 'Cao Cấp', kanji: '極', duration: '8 tháng', students: '500+', lessons: 128 },
];

export const HARD_WORKING_USERS: RankUser[] = [
    { id: 'u1', rank: 1, name: 'Nguyễn Văn A', avatar: 'A', score: '42h', sub: '128 bài', trend: 'up' },
    { id: 'u2', rank: 2, name: 'Trần Thị B', avatar: 'B', score: '38h', sub: '96 bài', trend: 'up' },
    { id: 'u3', rank: 3, name: 'Lê Hoàng C', avatar: 'C', score: '35h', sub: '80 bài', trend: 'same' },
    { id: 'u4', rank: 4, name: 'Phạm Minh D', avatar: 'D', score: '28h', sub: '64 bài', trend: 'down' },
    { id: 'u5', rank: 5, name: 'Hoàng Yến E', avatar: 'E', score: '22h', sub: '48 bài', trend: 'up' },
    { id: 'u6', rank: 6, name: 'User Test 6', avatar: 'F', score: '20h', sub: '40 bài', trend: 'down' },
    { id: 'u7', rank: 7, name: 'User Test 7', avatar: 'G', score: '18h', sub: '32 bài', trend: 'same' },
];

export const TOP_SCORERS: RankUser[] = [
    { id: 't1', rank: 1, name: 'Master JLPT', avatar: 'M', score: '180', sub: 'N1 - Perfect', trend: 'same' },
    { id: 't2', rank: 2, name: 'Ninja Kanji', avatar: 'N', score: '175', sub: 'N1 - Giỏi', trend: 'up' },
    { id: 't3', rank: 3, name: 'Sakura Chan', avatar: 'S', score: '178', sub: 'N2 - Xuất sắc', trend: 'up' },
    { id: 't4', rank: 4, name: 'Doraemon', avatar: 'D', score: '160', sub: 'N2 - Khá', trend: 'down' },
    { id: 't5', rank: 5, name: 'Nobita', avatar: 'N', score: '155', sub: 'N3 - Đậu', trend: 'up' },
    { id: 't6', rank: 6, name: 'Shizuka', avatar: 'S', score: '150', sub: 'N3 - Đậu', trend: 'same' },
];

/**
 * Icon URLs centralized to avoid duplication and enable easy updates
 * when CDN changes or icons need replacement
 */
export const LORDICON_URLS = {
    DURATION: 'https://cdn.lordicon.com/okqjaags.json',
    LESSONS: 'https://cdn.lordicon.com/hjrbjhnq.json',
} as const;

/**
 * Ranking configuration to make component more flexible
 * and avoid prop drilling of multiple individual values
 */
export const RANKING_CONFIG = {
    HARDWORKING: {
        iconColor: '#ff6b6b',
        iconBgColor: 'rgba(255, 107, 107, 0.2)',
        scoreLabel: 'Giờ học',
    },
    TOPSCORER: {
        iconColor: '#ffea00',
        iconBgColor: 'rgba(191, 255, 0, 0.3)',
        scoreLabel: 'Điểm',
        highlightColor: '#bfff00',
    },
} as const;