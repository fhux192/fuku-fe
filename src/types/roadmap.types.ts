
export type LevelStatus = 'locked' | 'unlocked' | 'current' | 'completed';
export type LevelType = 'normal' | 'boss' | 'bonus';

export interface LevelNode {
    id: number;
    title: string;
    type: LevelType;
    status: LevelStatus;
    xp: number;
    topics: string[];
    requiredScore?: number; // For boss levels
}

export interface UserProgress {
    currentLevel: number;
    totalXP: number;
    completedLevels: number[];
    stars: number; // Total stars earned
}