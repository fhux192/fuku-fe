import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './VerifyEmail.module.css'; // Đảm bảo tên file CSS khớp với file bạn đã lưu

// Định nghĩa kiểu dữ liệu cho trạng thái
type StatusType = 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
    const [verificationStatus, setVerificationStatus] = useState<string>('Đang xác thực... Vui lòng đợi.');
    const [statusType, setStatusType] = useState<StatusType>('loading');
    const location = useLocation();

    useEffect(() => {
        const verify = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setVerificationStatus('Liên kết xác thực không hợp lệ hoặc bị thiếu.');
                setStatusType('error');
                return;
            }

            try {
                // Giả lập độ trễ nhỏ để UI không bị giật (flash) nếu mạng quá nhanh
                await new Promise(r => setTimeout(r, 800));

                const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`);
                const responseText = await response.text();

                if (response.ok) {
                    setVerificationStatus(responseText || 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.');
                    setStatusType('success');
                } else {
                    setVerificationStatus(`Lỗi xác thực: ${responseText}`);
                    setStatusType('error');
                }
            } catch (err) {
                console.error(err);
                setVerificationStatus('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
                setStatusType('error');
            }
        };

        verify();
    }, [location]);

    // Hàm helper để lấy class CSS dựa trên trạng thái
    const getStatusClass = () => {
        if (statusType === 'success') return styles.verifySuccess;
        if (statusType === 'error') return styles.verifyError;
        return styles.verifyLoading;
    };

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyWrapper}>
                {/* Các lớp background/overlay giữ nguyên hiệu ứng hình ảnh */}
                <div className={styles.verifyBackground}></div>
                <div className={styles.verifyOverlay}></div>

                <div className={styles.verifyContent}>
                    <h2 className={styles.verifyTitle}>Xác thực Email</h2>

                    <div className={`${styles.verifyBox} ${getStatusClass()}`}>
                        {/* Nếu đang loading thì hiện spinner (vòng xoay từ CSS) */}
                        {statusType === 'loading' && <span className={styles.spinner}></span>}
                        {verificationStatus}
                    </div>

                    {/* Chỉ hiện nút đăng nhập khi quá trình loading kết thúc */}
                    {statusType !== 'loading' && (
                        <div>
                            <p className={styles.verifyText}>
                                {statusType === 'success'
                                    ? 'Bạn có thể đăng nhập vào hệ thống ngay bây giờ.'
                                    : 'Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ.'}
                            </p>
                            <Link to="/login" className={styles.verifyButton}>
                                {statusType === 'success' ? 'Đăng nhập ngay' : 'Quay về trang chủ'}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;