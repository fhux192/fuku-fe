import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login/Login.module.css';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
    </svg>
);

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError("パスワードが一致しません。(Passwords do not match.)");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/auth/reset-password', {
                token: token,
                newPassword: formData.newPassword
            });

            setMessage([
                'パスワードが正常にリセットされました。',
                <br key="break" />,
                '(Password reset successful.)'
            ]);

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            const errorMsg = err.response?.data || "";

            if (errorMsg.includes('same') || errorMsg.includes('current')) {
                setError([
                    '新しいパスワードは現在のパスワードと同じにすることはできません。',
                    <br key="break" />,
                    '(New password cannot be the same as the current password.)'
                ]);
            } else {
                setError(errorMsg || "エラーが発生しました。(An error occurred.)");
            }
        }
    };

    if (!token) {
        return (
            <div className={styles.loginContainer}>
                <div className={styles.loginFormWrapper}>
                    <div className={styles.loginFormContent}>
                        <p className={styles.loginError}>無効なトークン (Invalid or missing token)</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginFormWrapper}>
                <div className={styles.loginFormBackground}></div>
                <div className={styles.loginFormOverlay}></div>
                <div className={styles.loginFormContent}>
                    <h2 className={styles.loginTitle}>パスワード再設定 <br/> (Reset Password)</h2>
                    <form onSubmit={handleSubmit} className={styles.loginForm}>

                        {message && <div className={styles.loginSuccess}>{message}</div>}
                        {error && <div className={styles.loginError}>{error}</div>}

                        <div className={styles.loginInputGroup}>
                            <label className={styles.loginLabel}>新しいパスワード (New Password)</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showNewPass ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className={styles.loginInput}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPass(!showNewPass)}
                                    className={styles.togglePasswordBtn}
                                >
                                    {showNewPass ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.loginInputGroup}>
                            <label className={styles.loginLabel}>パスワードの確認 (Confirm Password)</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={styles.loginInput}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className={styles.togglePasswordBtn}
                                >
                                    {showConfirmPass ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.loginButton}>
                            パスワードを変更 (Change Password)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;