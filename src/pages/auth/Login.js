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

const loginStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;900&display=swap');

    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #111;
        padding: 20px;
        box-sizing: border-box;
        font-family: 'Noto Sans Japanese', sans-serif;
    }
    .login-form-wrapper {
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

    .login-form-background {
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

    .login-form-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(38, 38, 38, 0.05); 
        backdrop-filter: blur(5px); 
        z-index: 2; 
    }

    .login-form-content {
        position: relative;
        z-index: 3; 
    }
    
    .login-title {
        font-size: 36px;
        font-weight: 900;
        color: #f5f5f5;
        margin-bottom: 5vh;
    }
    .login-subtitle {
        font-size: 16px;
        color: #95D600;
        margin-bottom: 32px;
    }
    .login-form {
        width: 100%;
    }
    .login-error {
        color: #ff4d4d;
        background-color: rgba(47, 27, 29, 1);
        border: 1px solid rgba(255, 138, 138, 0.3);
        padding: 12px;
        border-radius: 12px;
        margin-bottom: 16px;
        font-size: 14px;
    }
    .login-input-group {
        margin-bottom: 20px;
        text-align: left;
    }
    .login-label {
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
    .login-input {
        width: 100%;
        padding: 12px 40px 12px 16px; /* Thêm padding bên phải cho icon */
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
    .login-input:focus {
        border-color: #95D600;
        box-shadow: 0 0 10px rgba(149, 214, 0, 0.3);
    }
    
    .login-input:-webkit-autofill,
    .login-input:-webkit-autofill:hover, 
    .login-input:-webkit-autofill:focus, 
    .login-input:-webkit-autofill:active {
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

    .toggle-password-btn:hover {
        color: #f5f5f5;
    }

    .toggle-password-btn svg {
        width: 20px;
        height: 20px;
    }

    .login-button {
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
    .login-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(149, 214, 0, 0.4);
    }
    .login-link-text {
        margin-top: 24px;
        font-size: 14px;
        color: #aaa;
    }
    .login-link {
        color: #95D600;
        font-weight: 900;
        text-decoration: none;
        transition: text-shadow 0.2s;
    }
    .login-link:hover {
        text-shadow: 0 0 5px rgba(149, 214, 0, 0.7);
    }

    @media (max-width: 480px) {
        .login-form-wrapper {
            padding: 24px;
            border-radius: 30px;
        }
        .login-title {
            font-size: 24px;
        }
        .login-subtitle {
            font-size: 14px;
        }
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
                setError(errorText || 'ログインに失敗しました。');
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
            <StyleInjector css={loginStyles} />
            <div className="login-container">
                <div className="login-form-wrapper">
                    <div className="login-form-background"></div>
                    <div className="login-form-overlay"></div>

                    <div className="login-form-content">
                        <h2 className="login-title">ログイン</h2>
                        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                            {error && <p className="login-error">{error}</p>}
                            <div className="login-input-group">
                                <label htmlFor="email" className="login-label">メールアドレス</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="login-input"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <div className="login-input-group">
                                <label htmlFor="password" className="login-label">パスワード</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="login-input"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button type="button" onClick={togglePasswordVisibility} className="toggle-password-btn">
                                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="login-button">サインイン</button>
                            <p className="login-link-text">
                                アカウントをお持ちでないですか？{' '}
                                <Link to="/register" className="login-link">新規登録</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;

