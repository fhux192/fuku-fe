import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
);

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                navigate('/profile');
            } else {
                const errorText = await response.text();
                setError(errorText || 'ログインに失敗しました。(Đăng nhập thất bại.)');
            }
        } catch (err) {
            setError('エラーが発生しました。後でもう一度お試しください。(Đã xảy ra lỗi. Vui lòng thử lại sau.)');
        }
    };

    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };

    return (
        <div className={styles.loginFormWrapper}>
            <div className={styles.loginFormBackground}></div>
            <div className={styles.loginFormOverlay}></div>
            <div className={styles.loginFormContent}>
                <h1 className={styles.loginTitle}>Đăng nhập</h1>
                <form onSubmit={handleSubmit} className={styles.loginForm} autoComplete="off">
                    {error && <p className={styles.loginError}>{error}</p>}
                    <div className={styles.loginInputGroup}>
                        <label htmlFor="email" className={styles.loginLabel}></label>
                        <input
                            placeholder={'Email'}
                            type="email" id="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className={styles.loginInput} autoComplete="off" required
                        />
                    </div>

                    <div className={styles.loginInputGroup}>
                        <label htmlFor="password" className={styles.loginLabel}></label>
                        <div className={styles.passwordWrapper}>
                            <input placeholder={'Mật khẩu'}
                                type={showPassword ? 'text' : 'password'}
                                id="password" name="password"
                                value={formData.password} onChange={handleChange}
                                className={styles.loginInput} autoComplete="new-password" required
                            />
                            <button tabIndex={-1} type="button" onClick={togglePasswordVisibility} className={styles.togglePasswordBtn}>
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.forgotPasswordWrapper}>
                        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className={styles.loginButton}>Đăng nhập</button>
                    <p className={styles.loginLinkText}>
                       Chưa có tài khoản?{'  '}
                        <Link to="/register" className={styles.loginLink}>
                            Đăng ký
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Login;