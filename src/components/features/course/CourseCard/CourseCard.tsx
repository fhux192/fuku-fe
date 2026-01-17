// components/CourseCard/CourseCard.tsx

import React from 'react';
import { Award } from 'lucide-react';
import { Course } from '../../../../types/course.types';
import { LORDICON_URLS } from '../../../../constants/course.constants';
import styles from './CourseCard.module.css';

interface CourseCardProps {
    course: Course;
    isSelected: boolean;
    onSelect: (id: string) => void;
}

/**
 * Memoized to prevent re-renders when sibling cards change
 * Only re-renders when its own props change
 */
const CourseCard: React.FC<CourseCardProps> = React.memo(({ course, isSelected, onSelect }) => {
    // Handler wrapped to prevent new function creation on every render
    const handleClick = () => onSelect(course.id);

    return (
        <div
            className={`${styles.courseCard} ${isSelected ? styles.selected : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            aria-label={`Select ${course.lv} - ${course.name} course`}
            // Keyboard accessibility - missing in original
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className={styles.cardBg} aria-hidden="true">{course.kanji}</div>

            <div className={styles.cardTop}>
                <div className={styles.levelBadge}>{course.lv}</div>
                {isSelected && (
                    <div className={styles.selectedBadge} aria-label="Selected">
                        <Award size={14} />
                    </div>
                )}
            </div>

            <h3 className={styles.courseName}>{course.name}</h3>

            <div className={styles.courseStats}>
                <CourseStat
                    iconSrc={LORDICON_URLS.DURATION}
                    value={course.duration}
                    label="Course duration"
                />
                <CourseStat
                    iconSrc={LORDICON_URLS.LESSONS}
                    value={`${course.lessons} bài`}
                    label="Number of lessons"
                />
            </div>
        </div>
    );
});

/**
 * Extracted stat item to reduce duplication and improve consistency
 */
interface CourseStatProps {
    iconSrc: string;
    value: string;
    label: string;
}

const CourseStat: React.FC<CourseStatProps> = React.memo(({ iconSrc, value, label }) => (
    <div className={styles.stat} aria-label={label}>
        {/* @ts-ignore - lord-icon is a custom element not in TypeScript DOM */}
        <lord-icon
            src={iconSrc}
            trigger="hover"
            colors="primary:#bfff00"
            style={{ width: '16px', height: '16px' }}
            aria-hidden="true"
        />
        <span>{value}</span>
    </div>
));

CourseCard.displayName = 'CourseCard';
CourseStat.displayName = 'CourseStat';

export default CourseCard;