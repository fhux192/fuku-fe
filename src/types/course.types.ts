
/**
 * Separated types to avoid circular dependencies and improve reusability
 * across multiple components and features
 */

export type TrendDirection = 'up' | 'down' | 'same';

export interface Course {
    id: string;
    lv: string;
    name: string;
    kanji: string;
    duration: string;
    students: string;
    lessons: number;
}

export interface RankUser {
    id: string;
    rank: number;
    name: string;
    avatar: string;
    score: string;
    sub: string;
    trend?: TrendDirection;
}

export type RankingType = 'hardworking' | 'topscorer';

export interface RankingBoardProps {
    type: RankingType;
    users: RankUser[];
    title: string;
    subtitle: string;
    iconColor: string;
    iconBgColor: string;
    scoreLabel: string;
}