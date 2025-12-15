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
            setError([
                'メールアドレスを入力してください。',
                <br key="req1" />,
                '(Vui lòng nhập email của bạn.)'
            ]);
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
                setMessage([
                    'パスワードリセットのリンクをメールに送信しました。',
                    <br key="break" />,
                    '(Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.)'
                ]);
            } else {
                const text = await response.text();
                setError(text || 'エラーが発生しました。(Đã xảy ra lỗi.)');
            }
        } catch (err) {
            setError('サーバーに接続できません。(Không thể kết nối đến máy chủ.)');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordFormWrapper}>
            <div className={styles.forgotPasswordFormBackground}></div>
            <div className={styles.forgotPasswordFormOverlay}></div>
            <div className={styles.forgotPasswordFormContent}>
                <h2 className={styles.forgotPasswordTitle}>パスワード再設定 <br/> (Đặt lại mật khẩu)</h2>

                <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
                    {message && <p className={styles.forgotPasswordSuccess}>{message}</p>}
                    {error && <p className={styles.forgotPasswordError}>{error}</p>}

                    <div className={styles.forgotPasswordInputGroup}>
                        <label htmlFor="email" className={styles.forgotPasswordLabel}>メールアドレス (Email)</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.forgotPasswordInput}
                            required
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <button type="submit" className={styles.forgotPasswordButton} disabled={isLoading}>
                        {isLoading ? '送信中... (Đang gửi...)' : '送信 (Gửi)'}
                    </button>

                    <p className={styles.forgotPasswordLinkText} style={{ marginTop: '20px' }}>
                        <Link to="/login" className={styles.forgotPasswordLink}>
                            ← ログインに戻る (Quay lại đăng nhập)
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;