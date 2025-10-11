import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function VerifyEmail() {
    const [verificationStatus, setVerificationStatus] = useState('Verifying your email, please wait...');
    const location = useLocation();

    useEffect(() => {
        const verify = async () => {

            const params = new URLSearchParams(location.search);
            const token = params.get('token');

            if (!token) {
                setVerificationStatus('Invalid verification link. No token provided.');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`);
                const responseText = await response.text();

                if (response.ok) {
                    setVerificationStatus(responseText);
                } else {
                    setVerificationStatus(`Error: ${responseText}`);
                }
            } catch (err) {
                setVerificationStatus('An error occurred during verification. Please try again later.');
            }
        };

        verify();
    }, [location]);

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>Email Verification</h2>
                <p>{verificationStatus}</p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
    box: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '500px' }
};

export default VerifyEmail;