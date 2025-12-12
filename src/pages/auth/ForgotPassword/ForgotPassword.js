// src/ForgotPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../Login/Login.module.css'; // Tái sử dụng CSS của Login

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

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
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
        <div className={styles.loginContainer}>
            <div className={styles.loginFormWrapper}>
                <div className={styles.loginFormBackground}></div>
                <div className={styles.loginFormOverlay}></div>

                <div className={styles.loginFormContent}>
                    <h2 className={styles.loginTitle}>パスワード再設定 <br/> (Reset Password)</h2>

                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        {message && <p className={styles.loginSuccess}>{message}</p>}
                        {error && <p className={styles.loginError}>{error}</p>}

                        <div className={styles.loginInputGroup}>
                            <label htmlFor="email" className={styles.loginLabel}>メールアドレス (Email)</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.loginInput}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <button type="submit" className={styles.loginButton} disabled={isLoading}>
                            {isLoading ? '送信中... (Sending...)' : '送信 (Send)'}
                        </button>

                        <p className={styles.loginLinkText} style={{ marginTop: '20px' }}>
                            <Link to="/login" className={styles.loginLink}>
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