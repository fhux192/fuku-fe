import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';


const StyleInjector = ({ css }) => {
    useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = css;
        document.head.appendChild(styleElement);
        return () => {
            document.head.removeChild(styleElement);
        };
    }, [css]);
    return null;
};

const registerStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;900&display=swap');

    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #111;
        padding: 20px;
        box-sizing: border-box;
        font-family: 'Noto Sans Japanese', sans-serif;
    }
    .register-form-wrapper {
        position: relative; 
        overflow: hidden; 
        padding: 48px;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 420px;
        text-align: center;
    }

    .register-form-background {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        scale: 1.2;
        background-image: url(${require('../../assets/bg3.gif')});
        background-size: cover;
        background-position: center;
        z-index: 1; 
    }

    .register-form-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(38, 38, 38, 0.05); 
        backdrop-filter: blur(5px); 
        z-index: 2; 
    }

    .register-form-content {
        position: relative;
        z-index: 3; 
    }
    
    .register-title {
        font-size: 36px;
        font-weight: 900;
        color: #f5f5f5;
        margin-bottom: 5vh;
    }

    .register-form {
        width: 100%;
    }
    .register-message, .register-error {
        color: #fff;
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 16px;
        font-size: 14px;
    }
    .register-message {
        background-color: rgba(27, 47, 29, 1);
        border: 1px solid rgba(138, 255, 145, 0.3);
        color: #8aff91;
    }
    .register-error {
        background-color: rgba(47, 27, 29, 1);
        border: 1px solid rgba(255, 138, 138, 0.3);
        color: #ff4d4d;
    }
    .register-input-group {
        margin-bottom: 20px;
        text-align: left;
    }
    .register-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #aaa;
    }
    .password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }
    .register-input {
        width: 100%;
        padding: 12px 40px 12px 16px;
        border-radius: 12px;
        border: 1px solid #444;
        background-color: rgba(15, 15, 15, 1);
        color: #f5f5f5;
        font-size: 16px;
        font-weight: 600;
        font-family: 'Noto Sans Japanese', sans-serif;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.3s, box-shadow 0.3s;
    }
    .register-input:focus {
        border-color: #95D600;
        box-shadow: 0 0 10px rgba(149, 214, 0, 0.3);
    }
    
    .register-input:-webkit-autofill,
    .register-input:-webkit-autofill:hover, 
    .register-input:-webkit-autofill:focus, 
    .register-input:-webkit-autofill:active {
        -webkit-text-fill-color: #f5f5f5 !important;
        box-shadow: 0 0 0 1000px rgba(15, 15, 15, 1) inset !important;
        font-family: 'Noto Sans Japanese', sans-serif !important;
    }

    .toggle-password-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #888;
        transition: color 0.2s;
    }
    .toggle-password-btn:hover { color: #f5f5f5; }
    .toggle-password-btn svg { width: 20px; height: 20px; }

    .register-button {
        width: 100%;
        padding: 14px;
        background-color: #95D600;
        color: #111;
        border: none;
        border-radius: 30px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 700;
        margin-top: 10px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .register-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(149, 214, 0, 0.4);
    }
    .register-link-text {
        margin-top: 24px;
        font-size: 14px;
        color: #aaa;
    }
    .register-link {
        color: #95D600;
        font-weight: 900;
        text-decoration: none;
        transition: text-shadow 0.2s;
    }
    .register-link:hover {
        text-shadow: 0 0 5px rgba(149, 214, 0, 0.7);
    }

    @media (max-width: 480px) {
        .register-form-wrapper { padding: 24px; border-radius: 30px; }
        .register-title { font-size: 28px; }
    }
`;

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


function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('すべての項目を入力してください。');
            return;
        }
        if (formData.password.length < 6) {
            setError('パスワードは6文字以上である必要があります。');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const responseText = await response.text();

            if (response.ok) {
                setMessage('登録に成功しました！ログイン画面に移動します。');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(responseText || '登録に失敗しました。');
            }
        } catch (err) {
            setError('エラーが発生しました。後でもう一度お試しください。');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <StyleInjector css={registerStyles} />
            <div className="register-container">
                <div className="register-form-wrapper">
                    <div className="register-form-background"></div>
                    <div className="register-form-overlay"></div>
                    <div className="register-form-content">
                        <h2 className="register-title">アカウント作成</h2>
                        <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
                            {message && <p className="register-message">{message}</p>}
                            {error && <p className="register-error">{error}</p>}
                            <div className="register-input-group">
                                <label htmlFor="name" className="register-label">名前</label>
                                <input
                                    type="text" id="name" name="name"
                                    value={formData.name} onChange={handleChange}
                                    className="register-input" autoComplete="off" required
                                />
                            </div>
                            <div className="register-input-group">
                                <label htmlFor="email" className="register-label">メールアドレス</label>
                                <input
                                    type="email" id="email" name="email"
                                    value={formData.email} onChange={handleChange}
                                    className="register-input" autoComplete="off" required
                                />
                            </div>
                            <div className="register-input-group">
                                <label htmlFor="password" className="register-label">パスワード</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password" name="password"
                                        value={formData.password} onChange={handleChange}
                                        className="register-input" autoComplete="new-password" required
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password-btn">
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="register-button">登録</button>
                            <p className="register-link-text">
                                すでにアカウントをお持ちですか？{' '}
                                <Link to="/login" className="register-link">ログイン</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;
