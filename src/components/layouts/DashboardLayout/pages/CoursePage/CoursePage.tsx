import React, { useEffect, useState, useMemo } from 'react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import RankingBoard from '../../../../../features/course/components/RankingBoard/RankingBoard';
import LearningPath from '../../../../../features/course/components/LearningPath/LearningPath';
import TaskList, { Task } from '../../../../../features/course/components/TaskList/TaskList';
import RoadmapPage from '../../../../../pages/RoadmapPage/RoadmapPage';
import { useCourseSelection } from '../../../../../features/course/hooks/useCourseSelection';
import { Course } from '../../../../../features/course/course.types';
import {
    HARD_WORKING_USERS,
    TOP_SCORERS,
    RANKING_CONFIG,
} from '../../../../../features/course/course.constants';
import styles from './CoursePage.module.css';

const CoursePage: React.FC = () => {
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [roadmapCourseId, setRoadmapCourseId] = useState<string | null>(null);

    // State đồng bộ level và task
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    // Khởi tạo các mốc trình độ (giữ biến lv)
    const GENERATED_COURSES: Course[] = useMemo(() => {
        const levels = ['IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0'];
        return levels.map((level, i) => ({
            id: `course_${i}`,
            lv: level,
            name: `${level} Path`,
            duration: `${i + 3} Months`,
            students: `${(i + 1.5).toFixed(1)}k+`,
            lessons: 40 + (i * 12),
        }));
    }, []);

    // Tạo 20 bài tập ngẫu nhiên bằng tiếng Anh
    const MOCK_TASKS: Task[] = useMemo(() => {
        const levels = ['IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0'];
        const skills = ['Reading', 'Listening', 'Writing', 'Speaking', 'Vocabulary', 'Grammar'];
        const types = ['Practice', 'Mock Test', 'Quiz', 'Exercise'];

        return Array.from({ length: 20 }, (_, i) => {
            const randomLv = levels[Math.floor(Math.random() * levels.length)];
            const randomSkill = skills[Math.floor(Math.random() * skills.length)];
            const randomType = types[Math.floor(Math.random() * types.length)];

            return {
                id: `task_${i}`,
                code: `EN-${randomLv.split(' ')[1]}-${100 + i}`,
                title: `${randomSkill} ${randomType} - Unit ${i + 1}`,
                status: i % 4 === 0 ? 'completed' : i % 4 === 1 ? 'in_progress' : 'not_started',
                score: i % 4 === 0 ? Math.floor(Math.random() * 9) + 1 : undefined,
                level: randomLv,
            };
        });
    }, []);

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    const handleCloseRoadmap = () => {
        setShowRoadmap(false);
        setRoadmapCourseId(null);
    };

    // Lọc danh sách bài tập theo level được chọn từ LearningPath
    const filteredTasks = selectedLevel
        ? MOCK_TASKS.filter(task => task.level === selectedLevel)
        : MOCK_TASKS;

    return (
        <>
            {!showRoadmap && (
                <div className={styles.pageContainer}>
                    {/* 1. LearningPath (Top) */}
                    <LearningPath
                        courses={GENERATED_COURSES}
                        selectedLevel={selectedLevel}
                        onLevelSelect={(lv) => setSelectedLevel(lv)}
                    />

                    {/* 2. Bảng xếp hạng (Middle) */}
                    {/*<section className={styles.rankSection}>*/}
                    {/*    <h2 className={styles.sectionHeading}>Ranking Board</h2>*/}
                    {/*    <div className={styles.rankContainer}>*/}
                    {/*        <RankingBoard*/}
                    {/*            type="hardworking"*/}
                    {/*            users={HARD_WORKING_USERS}*/}
                    {/*            title="Hard-working"*/}
                    {/*            subtitle="This week"*/}
                    {/*            iconColor={RANKING_CONFIG.HARDWORKING.iconColor}*/}
                    {/*            iconBgColor={RANKING_CONFIG.HARDWORKING.iconBgColor}*/}
                    {/*            scoreLabel={RANKING_CONFIG.HARDWORKING.scoreLabel}*/}
                    {/*        />*/}
                    {/*        <RankingBoard*/}
                    {/*            type="topscorer"*/}
                    {/*            users={TOP_SCORERS}*/}
                    {/*            title="Top Scorers"*/}
                    {/*            subtitle="IELTS Mock Test"*/}
                    {/*            iconColor={RANKING_CONFIG.TOPSCORER.iconColor}*/}
                    {/*            iconBgColor={RANKING_CONFIG.TOPSCORER.iconBgColor}*/}
                    {/*            scoreLabel={RANKING_CONFIG.TOPSCORER.scoreLabel}*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</section>*/}

                    {/* 3. Danh sách Bài tập duy nhất (Bottom - Thay thế vị trí Course List) */}
                    <section style={{ marginTop: '24px' }}>

                        <div className={styles.taskListContainer}>
                            <TaskList
                                tasks={filteredTasks}
                                selectedTaskId={selectedTaskId}
                                selectedLevel={selectedLevel}
                                onTaskSelect={(taskId) => {
                                    setSelectedTaskId(taskId);
                                }}
                            />
                        </div>

                        {filteredTasks.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                No assignments found for this level.
                            </div>
                        )}
                    </section>
                </div>
            )}

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