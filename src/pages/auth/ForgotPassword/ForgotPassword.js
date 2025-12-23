import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Vui lòng nhập email của bạn.');
            setIsLoading(false);
            return;
        }

        try {
            const API_URL = 'http://localhost:8080';
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
            } else {
                const text = await response.text();
                setError(text || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordFormWrapper}>
            {/* Background & Overlay giống Login/Register */}
            <div className={styles.forgotPasswordFormBackground}></div>
            <div className={styles.forgotPasswordFormOverlay}></div>

            <div className={styles.forgotPasswordFormContent}>
                <h1 className={styles.forgotPasswordTitle}>Quên mật khẩu</h1>
                <p className={styles.forgotPasswordSubtitle}>
                    Nhập email của bạn để lấy lại mật khẩu <br/>
                    (メールアドレスを入力してください)
                </p>

                <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
                    {message && <p className={styles.forgotPasswordSuccess}>{message}</p>}
                    {error && <p className={styles.forgotPasswordError}>{error}</p>}

                    <div className={styles.forgotPasswordInputGroup}>
                        <label htmlFor="email" className={styles.forgotPasswordLabel}></label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.forgotPasswordInput}
                            required
                            placeholder="Email / メールアドレス"
                            autoComplete="email"
                        />
                    </div>

                    <button type="submit" className={styles.forgotPasswordButton} disabled={isLoading}>
                        {isLoading ? 'Đang gửi... (送信中)' : 'Gửi xác nhận (送信)'}
                    </button>

                    <div className={styles.backToLoginWrapper}>
                        <Link to="/login" className={styles.forgotPasswordLink}>
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;