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
                '(Please enter your email.)'
            ]);
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage([
                    'パスワードリセットのリンクをメールに送信しました。',
                    <br key="break" />,
                    '(Password reset link sent to your email.)'
                ]);
            } else {
                const text = await response.text();
                setError(text || 'エラーが発生しました。(An error occurred.)');
            }
        } catch (err) {
            setError('サーバーに接続できません。(Cannot connect to server.)');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.forgotPasswordContainer}>
            <div className={styles.forgotPasswordFormWrapper}>
                <div className={styles.forgotPasswordFormBackground}></div>
                <div className={styles.forgotPasswordFormOverlay}></div>
                <div className={styles.forgotPasswordFormContent}>
                    <h2 className={styles.forgotPasswordTitle}>パスワード再設定 <br/> (Reset Password)</h2>

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
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" className={styles.forgotPasswordButton} disabled={isLoading}>
                            {isLoading ? '送信中... (Sending...)' : '送信 (Send)'}
                        </button>

                        <p className={styles.forgotPasswordLinkText} style={{ marginTop: '20px' }}>
                            <Link to="/login" className={styles.forgotPasswordLink}>
                                ← ログインに戻る (Back to Login)
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;