import { Course, RankUser } from './course.types';

/**
 * Centralized data source - easier to replace with API calls later
 * and prevents data duplication across components
 */

export const COURSES_DATA: Course[] = [
    { id: 'ielts_3_0', lv: 'IELTS 3.0', name: 'Nền Tảng', duration: '2 tháng', students: '3.5k+', lessons: 40 },
    { id: 'ielts_4_0', lv: 'IELTS 4.0', name: 'Cơ Bản',  duration: '3 tháng', students: '2.8k+', lessons: 56 },
    { id: 'ielts_5_0', lv: 'IELTS 5.0', name: 'Trung Cấp',  duration: '4 tháng', students: '2.1k+', lessons: 72 },
    { id: 'ielts_6_0', lv: 'IELTS 6.0', name: 'Thượng Cấp', duration: '5 tháng', students: '1.5k+', lessons: 88 },
    { id: 'ielts_6_5', lv: 'IELTS 6.5', name: 'Nâng Cao',  duration: '6 tháng', students: '900+', lessons: 104 },
    { id: 'ielts_7_0', lv: 'IELTS 7.0', name: 'Chuyên Sâu',  duration: '8 tháng', students: '500+', lessons: 120 },
    { id: 'ielts_7_5', lv: 'IELTS 7.5', name: 'Bứt Phá',  duration: '10 tháng', students: '300+', lessons: 136 },
    { id: 'ielts_8_0', lv: 'IELTS 8.0', name: 'Bậc Thầy',  duration: '12 tháng', students: '150+', lessons: 152 },
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