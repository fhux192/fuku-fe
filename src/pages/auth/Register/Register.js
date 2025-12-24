import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';
import lottie from 'lottie-web';

// 1. Import Element để đăng ký Trigger
import { defineElement, Element } from '@lordicon/element';

// --- ĐỊNH NGHĨA CUSTOM TRIGGER (Y CHANG CODE LOGIN) ---
const CLICK_EVENTS = [
    { name: 'mousedown' },
    { name: 'touchstart', options: { passive: true } },
];

class CustomTrigger {
    constructor(player, element, targetElement) {
        this.player = player;
        this.element = element;
        this.targetElement = targetElement;
        // Bắt đầu với hướng dương (1) để chạy từ Mở -> Đóng (Gạch chéo)
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
        // --- LOGIC MỚI: Tự động chạy 1 lần khi load ---
        // Gán hướng chạy xuôi
        this.player.direction = this.direction;
        // Kích hoạt chạy ngay lập tức để mắt nhắm lại (gạch chéo)
        this.player.play();
    }

    onComplete() {
        // Sau khi chạy xong 1 lượt, đảo chiều hướng chạy
        // Lần đầu (auto): 1 -> chạy xong đảo thành -1 (để click lần sau nó mở ra)
        this.direction = -this.direction;
        this.player.direction = this.direction;
    }

    onClick() {
        if (!this.player.isPlaying) {
            this.player.play();
        }
    }
}

// --- COMPONENT REGISTER ---
function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // State quản lý hiển thị text mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // 2. Đăng ký Trigger và Element khi component load
    useEffect(() => {
        // Kiểm tra xem trigger đã tồn tại chưa để tránh lỗi đăng ký trùng
        try {
            Element.defineTrigger('custom', CustomTrigger);
        } catch (e) {
            // Trigger đã được định nghĩa, bỏ qua
        }

        // Load lottie engine
        defineElement(lottie.loadAnimation);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        // Basic validation
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Vui lòng nhập tất cả các trường.'); return;
        }
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.'); return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.'); return;
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
                setMessage('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt.');
                setTimeout(() => { navigate('/login'); }, 3000);
            } else if (responseText.includes("Passwords do not match")) {
                setError('Mật khẩu không khớp.');
            } else {
                setError(responseText || 'Đăng ký thất bại.');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
        }
    };

    const togglePasswordVisibility = () => { setShowPassword(!showPassword); };
    const toggleConfirmPasswordVisibility = () => { setShowConfirmPassword(!showConfirmPassword); };

    return (
        <div className={styles.registerFormWrapper}>
            <div className={styles.registerFormBackground}></div>
            <div className={styles.registerFormOverlay}></div>

            <div className={styles.registerFormContent}>
                <lord-icon
                    src="https://cdn.lordicon.com/hroklero.json"
                    state={"morph-group"}
                    trigger="morph"
                    style={{ width: '135px', height: '135px', cursor: 'pointer' }}>
                </lord-icon>
                <h1 className={styles.registerTitle}>Đăng ký</h1>

                <form onSubmit={handleSubmit} className={styles.registerForm} autoComplete="off">
                    {message && <p className={styles.registerMessage}>{message}</p>}
                    {error && <p className={styles.registerError}>{error}</p>}

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="name" className={styles.registerLabel}></label>
                        <input
                            placeholder="Họ và tên"
                            type="text" id="name" name="name"
                            value={formData.name} onChange={handleChange}
                            className={styles.registerInput} autoComplete="off" required
                        />
                    </div>

                    <div className={styles.registerInputGroup}>
                        <label htmlFor="email" className={styles.registerLabel}></label>
                        <input
                            placeholder="Email"
                            type="email" id="email" name="email"
                            value={formData.email} onChange={handleChange}
                            className={styles.registerInput} autoComplete="off" required
                        />
                    </div>

                    {/* Ô MẬT KHẨU */}
                    <div className={styles.registerInputGroup}>
                        <label htmlFor="password" className={styles.registerLabel}></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                placeholder="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                id="password" name="password"
                                value={formData.password} onChange={handleChange}
                                className={styles.registerInput} autoComplete="new-password" required
                            />
                            <button tabIndex={-1} type="button" onClick={togglePasswordVisibility} className={styles.togglePasswordBtn}>
                                <lord-icon
                                    src="https://cdn.lordicon.com/ntfnmkcn.json"
                                    state={"morph-cross"}
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer', marginLeft: '10px' }}>
                                </lord-icon>
                            </button>
                        </div>
                    </div>

                    {/* Ô XÁC NHẬN MẬT KHẨU */}
                    <div className={styles.registerInputGroup}>
                        <label htmlFor="confirmPassword" className={styles.registerLabel}></label>
                        <div className={styles.passwordWrapper}>
                            <input
                                placeholder="Xác nhận mật khẩu"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword" name="confirmPassword"
                                value={formData.confirmPassword} onChange={handleChange}
                                className={styles.registerInput} autoComplete="new-password" required
                            />
                            <button tabIndex={-1} type="button" onClick={toggleConfirmPasswordVisibility} className={styles.togglePasswordBtn}>
                                <lord-icon
                                    src="https://cdn.lordicon.com/ntfnmkcn.json"
                                    state={"morph-cross"}
                                    trigger="custom"
                                    style={{ width: '35px', height: '35px', cursor: 'pointer', marginLeft: '10px' }}>
                                </lord-icon>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.registerButton}>Đăng ký</button>

                    <p className={styles.registerLinkText}>
                        Đã có tài khoản?{' '}
                        <Link to="/login" className={styles.registerLink}>
                            Đăng nhập
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;