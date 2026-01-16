import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import styles from './CoursePage.module.css';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

interface Course {
    id: string;
    lv: string;
    name: string;
    kanji: string;
    duration: string;
    students: string;
    lessons: number;
}

const CoursePage: React.FC = () => {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    useEffect(() => {
        defineElement(lottie.loadAnimation);
    }, []);

    const courses: Course[] = [
        {
            id: 'n5',
            lv: 'N5',
            name: 'Nhập Môn',
            kanji: '始',
            duration: '3 tháng',
            students: '2,500+',
            lessons: 48
        },
        {
            id: 'n4',
            lv: 'N4',
            name: 'Sơ Cấp',
            kanji: '歩',
            duration: '4 tháng',
            students: '1,800+',
            lessons: 64
        },
        {
            id: 'n3',
            lv: 'N3',
            name: 'Trung Cấp',
            kanji: '通',
            duration: '5 tháng',
            students: '1,200+',
            lessons: 80
        },
        {
            id: 'n2',
            lv: 'N2',
            name: 'Thượng Cấp',
            kanji: '進',
            duration: '6 tháng',
            students: '800+',
            lessons: 96
        },
        {
            id: 'n1',
            lv: 'N1',
            name: 'Cao Cấp',
            kanji: '極',
            duration: '8 tháng',
            students: '500+',
            lessons: 128
        },
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Khóa Học JLPT</h1>
                <p className={styles.pageSubtitle}>Chọn level phù hợp để bắt đầu hành trình chinh phục tiếng Nhật</p>
            </div>

            {/* Learning Path */}
            <div className={styles.pathSection}>
                <div className={styles.pathHeader}>
                    <span>Lộ Trình Học Tập</span>
                </div>
                <div className={styles.pathTrack}>
                    {courses.map((course, index) => (
                        <React.Fragment key={course.id}>
                            <div className={styles.pathNode}>
                                <div className={styles.pathKanji}>{course.kanji}</div>
                                <div className={styles.pathLabel}>{course.lv}</div>
                            </div>
                            {index < courses.length - 1 && <div className={styles.pathLine} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            <div className={styles.courseGrid}>
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className={`${styles.courseCard} ${selectedCourse === course.id ? styles.selected : ''}`}
                        onClick={() => setSelectedCourse(course.id)}
                    >
                        <div className={styles.cardBg}>{course.kanji}</div>

                        <div className={styles.cardTop}>
                            <div className={styles.levelBadge}>{course.lv}</div>
                            {selectedCourse === course.id && (
                                <div className={styles.selectedBadge}>
                                    <Award size={12} />
                                </div>
                            )}
                        </div>

                        <h3 className={styles.courseName}>{course.name}</h3>

                        <div className={styles.courseStats}>
                            <div className={styles.stat}>
                                {/* @ts-ignore - lord-icon is a custom element */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/okqjaags.json"
                                    trigger="hover"
                                    colors="primary:#bfff00"
                                    style={{ width: '14px', height: '14px' }}
                                />
                                <span>{course.duration}</span>
                            </div>
                            <div className={styles.stat}>
                                {/* @ts-ignore - lord-icon is a custom element */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/hjrbjhnq.json"
                                    trigger="hover"
                                    colors="primary:#bfff00"
                                    style={{ width: '14px', height: '14px' }}
                                />
                                <span>{course.lessons} bài</span>
                            </div>
                            <div className={styles.stat}>
                                {/* @ts-ignore - lord-icon is a custom element */}
                                <lord-icon
                                    src="https://cdn.lordicon.com/bushiqea.json"
                                    trigger="hover"
                                    colors="primary:#bfff00"
                                    style={{ width: '14px', height: '14px' }}
                                />
                                <span>{course.students}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;