
import { LevelNode, UserProgress } from '../types/roadmap.types';

export const generateLevels = (): LevelNode[] => {
    const levels: LevelNode[] = [];

    for (let i = 1; i <= 50; i++) {
        const isBoss = i % 10 === 0;
        const isBonus = i % 5 === 0 && !isBoss;

        levels.push({
            id: i,
            title: isBoss
                ? `Boss Battle ${i}`
                : isBonus
                    ? `Bonus Level ${i}`
                    : `Level ${i}`,
            type: isBoss ? 'boss' : isBonus ? 'bonus' : 'normal',
            status: i === 1 ? 'current' : 'locked',
            xp: isBoss ? 500 : isBonus ? 200 : 100,
            topics: generateTopics(i, isBoss),
            requiredScore: isBoss ? 80 : undefined,
        });
    }

    return levels;
};

/**
 * Generate realistic topics based on level progression
 */
const generateTopics = (level: number, isBoss: boolean): string[] => {
    if (isBoss) {
        return ['Grammar Review', 'Vocabulary Test', 'Listening Challenge', 'Reading Comprehension'];
    }

    const topicPool = [
        'Hiragana', 'Katakana', 'Basic Kanji', 'Greetings',
        'Numbers', 'Time & Date', 'Family Terms', 'Colors',
        'Adjectives', 'Verbs て-form', 'Particles は・が・を',
        'Past Tense', 'Negative Form', 'Polite Form',
        'Casual Speech', 'Counters', 'Giving/Receiving',
        'Potential Form', 'Passive Form', 'Causative Form',
        'Conditionals', 'Keigo', 'Business Japanese',
    ];

    // Select 2-3 topics based on level
    const startIndex = Math.floor((level - 1) / 2) % topicPool.length;
    return topicPool.slice(startIndex, startIndex + 2);
};

export const LEVELS_DATA = generateLevels();

/**
 * Mock user progress - in production, fetch from API
 */
export const MOCK_USER_PROGRESS: UserProgress = {
    currentLevel: 8,
    totalXP: 750,
    completedLevels: [1, 2, 3, 4, 5, 6, 7],
    stars: 18, // 3 stars max per level
};

/**
 * Path configuration for winding road visualization
 * Determines node positioning in a snake-like pattern
 */
export const PATH_CONFIG = {
    NODES_PER_ROW: 5,
    VERTICAL_SPACING: 180,
    HORIZONTAL_SPACING: 160,
    CURVE_OFFSET: 20, // Offset for alternating rows
} as const;