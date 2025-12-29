import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import lottie from 'lottie-web';

import { defineElement, Element } from '@lordicon/element';

const CLICK_EVENTS = [
    { name: 'mousedown' },
    { name: 'touchstart', options: { passive: true } },
];

class CustomTrigger {
    constructor(player, element, targetElement) {
        this.player = player;
        this.element = element;
        this.targetElement = targetElement;
        this.direction = 1;
        this.onClick = this.onClick.bind(this);
    }

    onConnected() {
        for (const event of CLICK_EVENTS) {
            this.targetElement.addEventListener(event.name, this.onClick, event.options);
        }
    }

    onDisconnected() {
        for (const event of CLICK_EVENTS) {
            this.targetElement.removeEventListener(event.name, this.onClick);
        }
    }

    onReady() {
        this.player.direction = this.direction;
        this.player.play();
    }

    onComplete() {
        this.direction = -this.direction;
        this.player.direction = this.direction;
    }

    onClick() {
        if (!this.player.isPlaying) {
            this.player.play();
        }
    }
}

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            Element.defineTrigger('custom', CustomTrigger);
        } catch (e) {
        }

        defineElement(lottie.loadAnimation);
    }, []);

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
                navigate('/home/course');
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

                <lord-icon
                    src="https://cdn.lordicon.com/hroklero.json"
                    state={"hover-looking-around"}
                    trigger={"hover"}
                    style={{ width: '135px', height: '135px', cursor: 'pointer' }}>
                </lord-icon>
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
                                <lord-icon
                                    src="https://cdn.lordicon.com/ntfnmkcn.json"
                                    state={"morph-cross"}
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer' }}>
                                </lord-icon>
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