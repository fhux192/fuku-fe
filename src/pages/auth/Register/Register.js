import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
);

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('すべての項目を入力してください。(Vui lòng nhập tất cả các trường.)'); return;
        }
        if (formData.password.length < 6) {
            setError('パスワードは6文字以上である必要があります。(Mật khẩu phải có ít nhất 6 ký tự.)'); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('パスワードと確認用パスワードが一致しません。(Mật khẩu không khớp.)'); return;
        }

        try {
            const API_URL = 'http://localhost:8080';

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const responseText = await response.text();

            if (response.ok) {
                setMessage('確認メールを送信しました。メールを確認してアカウントを有効化してください。(Email xác nhận đã được gửi. Vui lòng kiểm tra email để kích hoạt tài khoản.)');
                setTimeout(() => { navigate('/login'); }, 3000);
            } else if (responseText.includes("Passwords do not match")) {
                setError('パスワードが一致しません。(Mật khẩu không khớp.)');
            } else {
                setError(responseText || '登録に失敗しました。(Đăng ký thất bại.)');
            }
        } catch (err) {
            setError('エラーが発生しました。後でもう一度お試しください。(Đã xảy ra lỗi. Vui lòng thử lại sau.)');
        }
    };

    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
    const toggleConfirmPasswordVisibility = () => { setShowConfirmPassword(!showConfirmPassword); };

    return (
        <div className={styles.registerFormWrapper}>
            <div className={styles.registerFormBackground}></div>
            <div className={styles.registerFormOverlay}></div>
            <div className={styles.registerFormContent}>

                <h2 className={styles.registerTitle}>アカウント作成 <br/> (Tạo tài khoản)</h2>
                <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
                    {message && <p className={styles.registerMessage}>{message}</p>}
                    {error && <p className={styles.registerError}>{error}</p>}

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="name" className={styles.registerLabel}>名前 (Tên)</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={styles.registerInput} autoComplete="off" required />
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="email" className={styles.registerLabel}>メールアドレス (Email)</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={styles.registerInput} autoComplete="off" required />
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="password" className={styles.registerLabel}>パスワード (Mật khẩu)</label>
                        <div className={styles.passwordWrapper}>
                            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={styles.registerInput} autoComplete="new-password" required />
                            <button type="button" tabIndex={-1} onClick={togglePasswordVisibility} className={styles.togglePasswordBtn}>
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="confirmPassword" className={styles.registerLabel}>パスワードの確認 (Xác nhận mật khẩu)</label>
                        <div className={styles.passwordWrapper}>
                            <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={styles.registerInput} autoComplete="new-password" required />
                            <button type="button" tabIndex={-1} onClick={toggleConfirmPasswordVisibility} className={styles.togglePasswordBtn}>
                                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.registerButton}>登録 (Đăng ký)</button>
                    <p className={styles.registerLinkText}>
                        すでにアカウントをお持ちですか？ (Đã có tài khoản?){' '}
                        <br/>
                        <Link to="/login" style={{ marginLeft: '5px' }} className={styles.registerLink}>
                            ログイン (Đăng nhập)
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
export default Register;