import React from 'react';
import { Zap } from 'lucide-react';
import { Course } from '../../../../types/course.types';
import styles from './LearningPath.module.css';

interface LearningPathProps {
    courses: Course[];
}

/**
 * Separated to make the main page cleaner and this component reusable
 * Memoized because courses data rarely changes
 */
const LearningPath: React.FC<LearningPathProps> = React.memo(({ courses }) => (
    <div className={styles.pathSection}>
        <div className={styles.pathHeader}>
            <Zap size={20} fill="var(--color-lt-green)" stroke="none" />
            <span>Lộ Trình Tiêu Chuẩn</span>
        </div>
        <div className={styles.pathTrack} role="list" aria-label="Learning path from N5 to N1">
            {courses.map((course, index) => (
                <React.Fragment key={course.id}>
                    <div className={styles.pathNode} role="listitem" aria-label={`${course.lv} - ${course.name}`}>
                        <div className={styles.pathKanji} aria-hidden="true">{course.kanji}</div>
                        <div className={styles.pathLabel}>{course.lv}</div>
                    </div>
                    {/* Avoid rendering unnecessary elements */}
                    {index < courses.length - 1 && <div className={styles.pathLine} aria-hidden="true" />}
                </React.Fragment>
            ))}
        </div>
    </div>
));

LearningPath.displayName = 'LearningPath';

export default LearningPath;