import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './HomeLayout.module.css';
import logo from '../../assets/images/logo192.png';

const HomeLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Hàm này vừa chuyển trang vừa mở modal
    const handleMobileNav = (path) => {
        navigate(path);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.webflowBanner}>
                <span> Hiện tại Fuku đang <span style={{textDecoration:'underline'}}>miễn phí</span>  cho tất cả mọi người </span></div>
            <div className={styles.leftSideWrapper}>
                <div className={styles.leftSide}>
                    {/* --- CẬP NHẬT 1: Logo Desktop --- */}
                    {/* Đổi sự kiện onClick để gọi handleMobileNav('/login') */}
                    <img
                        src={logo}
                        alt="Logo Desktop"
                        className={styles.desktopLogo}
                        onClick={() => handleMobileNav('/login')}
                        style={{ cursor: 'pointer' }} // Thêm cursor pointer cho rõ ràng
                    />

                    <div className={styles.mobileHeader}>
                        <div className={styles.logoContainerMobile}>
                            {/* --- CẬP NHẬT 2: Logo Mobile --- */}
                            {/* Thêm sự kiện onClick vào đây */}
                            <img
                                src={logo}
                                alt="Logo"
                                className={styles.logoImage}
                                onClick={() => handleMobileNav('/login')}
                            />
                        </div>
                    </div>

                    <div className={styles.decorativeElements}>
                        <span className={`${styles.floatingKanji} ${styles.kanji1}`}>夢</span>
                        <span className={`${styles.floatingKanji} ${styles.kanji2}`}>学</span>
                    </div>

                    <div className={styles.leftSideContent}>
                        <div className={styles.glassCard}>
                            <h1 className={styles.leftSideTitle}>
                                日本語を<br />
                                <span className={styles.highlightText}>楽しみましょう</span>
                            </h1>
                            <p className={styles.leftSideSubtitle}>
                                <strong>Fuku - Hệ thống học từ vựng tiếng Nhật thông minh miễn phí</strong>
                            </p>

                            <button className={styles.ctaButton} onClick={() => handleMobileNav('/kana-reference')}>
                                <span>Bắt đầu ngay </span>

                            </button>
                            <button className={styles.ctaInfoButton} onClick={() => handleMobileNav('/kana-reference')}>
                                <span>Tìm hiểu </span>

                            </button>
                        </div>
                    </div>

                    <div className={styles.overlayGradient}></div>
                </div>
            </div>

            <div className={`${styles.rightSide} ${isModalOpen ? styles.showModal : ''}`}>
                {/* Nút đóng modal sẽ tắt state modal */}
                <button className={styles.closeModalBtn} onClick={() => setIsModalOpen(false)}>
                    ✕
                </button>

                <div className={styles.rightSideContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;