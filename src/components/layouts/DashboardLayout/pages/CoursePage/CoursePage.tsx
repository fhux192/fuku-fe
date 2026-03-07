import React, { useEffect, useState, useMemo } from 'react';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

import LearningPath from '../../../../../features/course/components/LearningPath/LearningPath';
import TaskList, { Task } from '../../../../../features/course/components/TaskList/TaskList';
import RoadmapPage from '../../../../../pages/RoadmapPage/RoadmapPage';
import { Course } from '../../../../../features/course/course.types';

import styles from './CoursePage.module.css';

// ============================================================================
// Main Component
// ============================================================================

const CoursePage: React.FC = () => {

    // ------------------------------------------------------------------------
    // State
    // ------------------------------------------------------------------------

    const [showRoadmap, setShowRoadmap] = useState(false);
    const [roadmapCourseId, setRoadmapCourseId] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');

    // ------------------------------------------------------------------------
    // Mock Data
    // ------------------------------------------------------------------------

    const GENERATED_COURSES: Course[] = useMemo(() => {
        const levels = ['IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0'];
        return levels.map((level, i) => ({
            id: `course_${i}`,
            lv: level,
            name: `${level} Path`,
            duration: `${i + 6} Months`,
            students: `${(i + 1.5).toFixed(1)}k+`,
            lessons: 40 + (i * 12),
        }));
    }, []);

    const MOCK_TASKS: Task[] = useMemo(() => {
        const levels = ['IELTS 4.0', 'IELTS 5.0', 'IELTS 6.0', 'IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0'];
        const skills = ['Reading', 'Listening', 'Writing', 'Speaking', 'Vocabulary', 'Grammar'];
        const types = ['Practice', 'Mock Test', 'Quiz', 'Exercise'];

        return Array.from({ length: 77 }, (_, i) => {
            const randomLv = levels[Math.floor(Math.random() * levels.length)];
            const randomSkill = skills[Math.floor(Math.random() * skills.length)];
            const randomType = types[Math.floor(Math.random() * types.length)];

            return {
                id: `task_${i}`,
                code: `EN-${randomLv.split(' ')[1]}-${100 + i}`,
                title: `${randomSkill} ${randomType} - Unit ${i + 1}`,
                status: i % Math.floor(Math.random() * 7) === 0 ? 'completed' : i % 4 === 1 ? 'in_progress' : 'not_started',
                score: i % 4 === 0 ? Math.floor(Math.random() * 9) + 1 : undefined,
                level: randomLv,
            };
        });
    }, []);

    // ------------------------------------------------------------------------
    // Lifecycle
    // ------------------------------------------------------------------------

    useEffect(() => {
        /* Đăng ký Lordicon với đầy đủ animation engine */
        defineElement(lottie.loadAnimation);
    }, []);

    // ------------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------------

    const handleCloseRoadmap = () => {
        setShowRoadmap(false);
        setRoadmapCourseId(null);
    };

    // ------------------------------------------------------------------------
    // Logic
    // ------------------------------------------------------------------------

    const filteredTasks = selectedLevel
        ? MOCK_TASKS.filter(task => task.level === selectedLevel)
        : MOCK_TASKS;

    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------

    return (
        <>
            {!showRoadmap && (
                <div className={styles.pageContainer}>
                    <LearningPath
                        courses={GENERATED_COURSES}
                        selectedLevel={selectedLevel}
                        onLevelSelect={(lv) => setSelectedLevel(lv)}
                    />

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