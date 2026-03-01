import React, { useRef, useEffect, useState } from 'react';
import {
    Map,
    ChevronLeft,
    ChevronRight,
    Check,
    Lock,
    Zap
} from 'lucide-react';
import { Course } from '../../../course/course.types';
import styles from './LearningPath.module.css';

interface LearningPathProps {
    courses: Course[];
    currentLevel?: string; // Ví dụ: 'N4'
}

type NodeStatus = 'completed' | 'current' | 'locked';

const LearningPath: React.FC<LearningPathProps> = ({ courses, currentLevel = 'IELTS 4.0' }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const getNodeStatus = (courseLv: string): NodeStatus => {
        const levels = ['IELTS 3.0', 'IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5','IELTS 7.0'];

        const currentIndex = levels.findIndex(l => l === currentLevel);
        const courseIndex = levels.findIndex(l => l === courseLv);

        if (courseIndex === -1) return 'locked';

        if (courseIndex < currentIndex) return 'completed';
        if (courseIndex === currentIndex) return 'current';
        return 'locked';
    };

    // 2. Auto Scroll to Current Level on Mount
    useEffect(() => {
        if (scrollRef.current) {
            const currentElement = scrollRef.current.querySelector(`.${styles.statusCurrent}`);
            if (currentElement) {
                // Scroll sao cho element hiện tại ra giữa màn hình
                const containerWidth = scrollRef.current.clientWidth;
                const elementLeft = (currentElement as HTMLElement).offsetLeft;
                const elementWidth = (currentElement as HTMLElement).clientWidth;

                const scrollTo = elementLeft - (containerWidth / 2) + (elementWidth / 2);

                scrollRef.current.scrollTo({
                    left: scrollTo,
                    behavior: 'smooth'
                });
            }
            checkScrollButtons();
        }
    }, [currentLevel, courses]); // Chạy lại khi level thay đổi

    // 3. Scroll Handlers
    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className={styles.pathContainer}>
            {/* Header */}
            <header className={styles.pathHeader}>
                <div className={styles.headerTitle}>
                    <div className={styles.iconBox}>
                        <Map size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2>Lộ trình học tập</h2>
                    </div>
                </div>

                <div className={styles.currentBadge}>
                    <Zap size={16} fill="currentColor" />
                    <span>Hiện tại: {currentLevel}</span>
                </div>
            </header>

            {/* Track Area */}
            <div className={styles.trackWrapper}>
                {/* Navigation Buttons (Chỉ hiện trên desktop khi hover) */}
                {canScrollLeft && (
                    <button
                        className={`${styles.navBtn} ${styles.navPrev}`}
                        onClick={() => scroll('left')}
                        aria-label="Previous level"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {canScrollRight && (
                    <button
                        className={`${styles.navBtn} ${styles.navNext}`}
                        onClick={() => scroll('right')}
                        aria-label="Next level"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                {/* Main Horizontal Scroll Track */}
                <div
                    className={styles.trackScroll}
                    ref={scrollRef}
                    onScroll={checkScrollButtons}
                >
                    {courses.map((course, index) => {
                        const status = getNodeStatus(course.lv);
                        const isLastItem = index === courses.length - 1;

                        const statusClass = {
                            completed: styles.statusCompleted,
                            current: styles.statusCurrent,
                            locked: styles.statusLocked
                        }[status];

                        return (
                            <div key={course.id} className={`${styles.pathItem} ${statusClass}`}>
                                {/* The Node */}
                                <div className={styles.nodeWrapper}>
                                    <div className={styles.nodeCircle}>
                                        {status === 'completed' && <Check size={24} strokeWidth={3} />}
                                        {status === 'locked' && <Lock size={20} />}
                                        {status === 'current' && (course.kanji || course.lv)}
                                        {status !== 'completed' && status !== 'locked' && status !== 'current' && course.lv}
                                    </div>

                                    <div className={styles.nodeInfo}>
                                        <span className={styles.nodeLabel}>{course.lv}</span>
                                        <span className={styles.nodeSub}>
                                            {status === 'locked' ? 'Chưa mở' : course.name}
                                        </span>
                                    </div>
                                </div>

                                {!isLastItem && (
                                    <div
                                        className={`${styles.connector} ${
                                            status === 'completed' ? styles.connectorActive : ''
                                        }`}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LearningPath;