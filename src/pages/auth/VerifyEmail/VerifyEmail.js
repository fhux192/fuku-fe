import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './VerifyEmail.module.css';

function VerifyEmail() {
    const [verificationStatus, setVerificationStatus] = useState('確認中... (Verifying, please wait...)');
    const [statusType, setStatusType] = useState('loading');
    const location = useLocation();

    useEffect(() => {
        const verify = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setVerificationStatus('トークンが無効です。(Invalid verification link.)');
                setStatusType('error');
                return;
            }

            try {
                await new Promise(r => setTimeout(r, 800));

                const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`);
                const responseText = await response.text();

                if (response.ok) {
                    setVerificationStatus(responseText || 'メール認証が完了しました。(Email verified successfully.)');
                    setStatusType('success');
                } else {
                    setVerificationStatus(`エラー: ${responseText} (Error: ${responseText})`);
                    setStatusType('error');
                }
            } catch (err) {
                setVerificationStatus('エラーが発生しました。(An error occurred.)');
                setStatusType('error');
            }
        };

        verify();
    }, [location]);

    const getStatusClass = () => {
        if (statusType === 'success') return styles.verifySuccess;
        if (statusType === 'error') return styles.verifyError;
        return styles.verifyLoading;
    };

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyWrapper}>
                <div className={styles.verifyBackground}></div>
                <div className={styles.verifyOverlay}></div>

                <div className={styles.verifyContent}>
                    <h2 className={styles.verifyTitle}>メール認証 (Email Verification)</h2>

                    <div className={`${styles.verifyBox} ${getStatusClass()}`}>
                        {statusType === 'loading' && <span className={styles.spinner}>⏳</span>}
                        {verificationStatus}
                    </div>

                    {statusType !== 'loading' && (
                        <div className={styles.verifyFooter}>
                            <p className={styles.verifyText}>
                                アカウントにサインインしてください。<br/>(Please sign in to your account.)
                            </p>
                            <Link to="/login" className={styles.verifyButton}>
                                ログイン (Login)
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;