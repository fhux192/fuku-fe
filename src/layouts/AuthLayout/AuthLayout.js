import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

const AuthLayout = () => {
    return (
        <div className={styles.authContainer}>
            <div className={styles.leftSideOverlay}>
            <div className={styles.leftSide}>
                <div className={styles.leftSideContent}>
                    <h1 className={styles.leftSideTitle}>日本語を<br/>学びましょう</h1>
                    <p className={styles.leftSideSubtitle}>Fuku Japanese Learning Platform</p>
                </div>
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'radial-gradient(circle at center, rgba(149, 214, 0, 0.1) 0%, rgba(3, 3, 3, 1) 70%)',
                    zIndex: 1
                }}></div>
            </div>
            </div>

            <div className={styles.rightSide}>
                <Outlet />
            </div>

        </div>
    );
};

export default AuthLayout;