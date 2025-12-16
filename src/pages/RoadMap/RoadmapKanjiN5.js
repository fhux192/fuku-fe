import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, X} from 'lucide-react';
import styles from './RoadmapKanjiN5.module.css';
import { courseData } from '../../data/N5Kanji';

const KanjiDetailModal = ({ kanji, onClose }) => {
    if (!kanji) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <motion.div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalHeader}>
                    <div className={styles.bigKanji}>{kanji.character}</div>
                    <div className={styles.kanjiMeaning}>{kanji.sino_vietnamese}</div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.modalBody}>
                    <div className={styles.exampleList}>
                        {kanji.examples && kanji.examples.map((ex, index) => (
                            <div key={index} className={styles.exampleRow}>
                                <div className={styles.exWordBlock}>
                                    <span className={styles.exKanji}>{ex.word_kanji}</span>
                                    <span className={styles.exFurigana}>{ex.furigana}</span>
                                </div>
                                <div className={styles.exMeaning}>
                                    {ex.meaning_vn}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

const KanjiItem = React.memo(({ kanji, onClick }) => {
    return (
        <motion.div
            className={styles.kanjiItem}
            variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
            }}
            whileHover={{ scale: 1.1, borderColor: '#95D600', backgroundColor: 'rgba(149, 214, 0, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClick(kanji)}
        >
            <div className={styles.kanjiChar}>{kanji.character}</div>
            <div className={styles.kanjiMeta}>
                <span className={styles.sinoViet}>{kanji.sino_vietnamese}</span>
            </div>
        </motion.div>
    );
});

const LessonCard = React.memo(({ lesson, index, isExpanded, onToggle, onKanjiClick }) => {
    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <motion.div
            className={`${styles.lessonCard} ${isExpanded ? styles.activeCard : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className={styles.cardHeader} onClick={() => onToggle(lesson.lesson_id)}>
                <div className={styles.lessonIndex}>
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </div>
                <div className={styles.lessonInfo}>
                    <h2 className={styles.lessonTitleVN}>{lesson.lesson_title_vn}</h2>
                    <p className={styles.lessonTitleEN}>{lesson.lesson_title_en}</p>
                </div>
                <div className={styles.cardAction}>
                    <span className={styles.kanjiCount}>
                        {lesson.kanji_list ? lesson.kanji_list.length : 0} Kanji
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown size={24} color="#95D600" />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className={styles.cardBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <motion.div
                            className={styles.kanjiGrid}
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {lesson.kanji_list && lesson.kanji_list.map((kanji) => (
                                <KanjiItem
                                    key={kanji.id}
                                    kanji={kanji}
                                    onClick={onKanjiClick}
                                />
                            ))}
                        </motion.div>

                        <div className={styles.lessonFooter}>
                            <button className={styles.startLearnBtn}>
                                <BookOpen size={18} />
                                <span>Bắt đầu học</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

const CourseRoadmap = () => {
    const [expandedLesson, setExpandedLesson] = useState(null);
    const [selectedKanji, setSelectedKanji] = useState(null);

    const toggleLesson = useCallback((id) => {
        setExpandedLesson(prev => (prev === id ? null : id));
    }, []);

    const handleKanjiClick = useCallback((kanji) => {
        setSelectedKanji(kanji);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedKanji(null);
    }, []);

    const lessonsList = useMemo(() => {
        return courseData.lessons.map((lesson, index) => (
            <LessonCard
                key={lesson.lesson_id}
                lesson={lesson}
                index={index}
                isExpanded={expandedLesson === lesson.lesson_id}
                onToggle={toggleLesson}
                onKanjiClick={handleKanjiClick}
            />
        ));
    }, [expandedLesson, toggleLesson, handleKanjiClick]);

    return (
        <div className={styles.roadmapContainer}>
            <div className={styles.decorativeElements}>
                <span className={`${styles.floatingKanji} ${styles.kanji1}`}>道</span>
                <span className={`${styles.floatingKanji} ${styles.kanji2}`}>学</span>
            </div>
            <div className={styles.overlayGradient}></div>

            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <div className={styles.levelBadge}>{courseData.course_info.level}</div>
                    <h1 className={styles.courseTitle}>
                        Lộ trình <span className={styles.highlightText}>Chinh Phục Kanji</span>
                    </h1>
                    <p className={styles.courseSubtitle}>
                        {courseData.course_info.total_units_included} Bài học • Nền tảng vững chắc
                    </p>
                </header>

                <div className={styles.timeline}>
                    {lessonsList}
                </div>
            </div>

            <AnimatePresence>
                {selectedKanji && (
                    <KanjiDetailModal
                        kanji={selectedKanji}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseRoadmap;