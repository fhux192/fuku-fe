import React, { useEffect, useState } from 'react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import RankingBoard from '../../features/course/components/RankingBoard/RankingBoard';
import CourseCard from '../../features/course/components/CourseCard/CourseCard';
import LearningPath from '../../features/roadmap/components/LearningPath/LearningPath';
import RoadmapPage from '../RoadmapPage/RoadmapPage';
import { useCourseSelection } from '../../features/course/hooks/useCourseSelection';
import {
    COURSES_DATA,
    HARD_WORKING_USERS,
    TOP_SCORERS,
    RANKING_CONFIG,
} from '../../features/course/course.constants';
import styles from './CoursePage.module.css';

const CoursePage: React.FC = () => {

    const { selectCourse, isSelected } = useCourseSelection();

    const [showRoadmap,     setShowRoadmap]     = useState(false);
    const [roadmapCourseId, setRoadmapCourseId] = useState<string | null>(null);
    const [selectedLevel,   setSelectedLevel]   = useState<string>('');

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    // =========================================================================
    // Handle course card click — opens roadmap
    // =========================================================================
    const handleCourseClick = (courseId: string) => {
        selectCourse(courseId);
        setRoadmapCourseId(courseId);
        setShowRoadmap(true);
    };

    // =========================================================================
    // Close roadmap and return to course list
    // =========================================================================
    const handleCloseRoadmap = () => {
        setShowRoadmap(false);
        setRoadmapCourseId(null);
    };

    return (
        <>
            {/* ================================================================
                Main Course Page
            ================================================================ */}
            {!showRoadmap && (
                <div className={styles.pageContainer}>

                    <LearningPath
                        courses={COURSES_DATA}
                        selectedLevel={selectedLevel}
                        onLevelSelect={(lv) => setSelectedLevel(lv)}
                    />

                    <section className={styles.rankSection} aria-labelledby="ranking-title">
                        <h2 id="ranking-title" className={styles.sectionHeading}>Bảng xếp hạng</h2>
                        <div className={styles.rankContainer}>
                            <RankingBoard
                                type="hardworking"
                                users={HARD_WORKING_USERS}
                                title="BXH Chăm Chỉ"
                                subtitle="Tuần này"
                                iconColor={RANKING_CONFIG.HARDWORKING.iconColor}
                                iconBgColor={RANKING_CONFIG.HARDWORKING.iconBgColor}
                                scoreLabel={RANKING_CONFIG.HARDWORKING.scoreLabel}
                            />
                            <RankingBoard
                                type="topscorer"
                                users={TOP_SCORERS}
                                title="Top Cao Thủ"
                                subtitle="Thi thử JLPT"
                                iconColor={RANKING_CONFIG.TOPSCORER.iconColor}
                                iconBgColor={RANKING_CONFIG.TOPSCORER.iconBgColor}
                                scoreLabel={RANKING_CONFIG.TOPSCORER.scoreLabel}
                            />
                        </div>
                    </section>

                    <section aria-labelledby="courses-title">
                        <h2 id="courses-title" className={styles.sectionHeading}>Danh sách bài làm</h2>
                        <div className={styles.courseGrid} role="group" aria-label="Available courses">
                            {COURSES_DATA.map((course) => (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isSelected={isSelected(course.id)}
                                    onSelect={handleCourseClick}
                                />
                            ))}
                        </div>
                    </section>

                </div>
            )}

            {/* ================================================================
                Roadmap Overlay
            ================================================================ */}
            {showRoadmap && roadmapCourseId && (
                <RoadmapPage
                    courseId={roadmapCourseId}
                    onClose={handleCloseRoadmap}
                />
            )}
        </>
    );
};

export default CoursePage;