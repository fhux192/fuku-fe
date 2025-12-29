import React from 'react';
import styles from '../../layouts/DashboardLayout/DashboardLayout.module.css';


const CoursePage = () => {
    const courses = [
        { id: 'n5', lv: 'N5', name: 'Nhập Môn', info: 'Bắt đầu với bảng chữ cái và giao tiếp cơ bản.', kanji: '始' },
        { id: 'n4', lv: 'N4', name: 'Sơ Cấp', info: 'Củng cố ngữ pháp và hội thoại hàng ngày.', kanji: '歩' },
        { id: 'n3', lv: 'N3', name: 'Trung Cấp', info: 'Giao tiếp linh hoạt và đọc hiểu văn bản dài.', kanji: '通' },
        { id: 'n2', lv: 'N2', name: 'Thượng Cấp', info: 'Làm việc chuyên nghiệp trong môi trường Nhật.', kanji: '進' },
        { id: 'n1', lv: 'N1', name: 'Cao Cấp', info: 'Làm chủ ngôn ngữ, tư duy như người bản xứ.', kanji: '極' },
    ];

    return (
        <div className={styles.viewSection}>
            <h1 className={styles.viewTitle}>Khóa Học JLPT</h1>
            <div className={styles.courseGrid}>
                {courses.map(course => (
                    <div key={course.id} className={styles.jlptCard}>
                        <div className={styles.kanjiBg}>{course.kanji}</div>
                        <div className={styles.levelBadge}>{course.lv}</div>
                        <h3 className={styles.cardName}>{course.name} <p className={styles.cardInfo}>{course.info}</p></h3>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;