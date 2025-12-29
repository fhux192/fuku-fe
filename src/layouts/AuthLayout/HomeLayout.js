import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './HomeLayout.module.css';
import logo from '../../assets/images/logo192.png';

const HomeLayout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleNav = (path) => {
        navigate(path);
        setIsModalOpen(true);
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.webflowBanner}>
                <span> Hiện tại Fuku đang <span style={{textDecoration:'underline'}}>miễn phí</span>  cho tất cả mọi người </span></div>
            <div className={styles.leftSideWrapper}>
                <div className={styles.leftSide}>
                    <img
                        src={logo}
                        alt="Logo Desktop"
                        className={styles.desktopLogo}
                        onClick={() => handleNav('/login')}
                        style={{ cursor: 'pointer' }}
                    />

                    <div className={styles.mobileHeader}>
                        <div className={styles.logoContainerMobile}>
                            <img
                                src={logo}
                                alt="Logo"
                                className={styles.logoImage}
                                onClick={() => handleNav('/login')}
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
                                <span className={styles.highlightText}>学びましょう</span>
                            </h1>
                            <p className={styles.leftSideSubtitle}>
                                <strong>Fuku - Hệ thống học từ vựng tiếng Nhật thông minh miễn phí</strong>
                            </p>
<div className={styles.btnWrapper}><button className={styles.ctaButton} onClick={() => handleNav('/kana-reference')}>
    <span>Bắt đầu ngay </span>

</button>
    <button className={styles.ctaInfoButton} onClick={() => handleNav('/home/course')}>
        <span>Tìm hiểu </span>
        <lord-icon
            src="https://cdn.lordicon.com/yhtmwrae.json"
            state={"hover-looking-around"}
            trigger={"hover"}
            colors="primary:#ffffff"
            style={{ width: '30px', height: '30px', cursor: 'pointer' }}>
        </lord-icon>
    </button></div>

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