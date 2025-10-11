import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <h2>Welcome to Your Profile</h2>
                <p>This page is protected. You can only see it when you are logged in.</p>
                <button onClick={handleLogout} style={styles.button}>
                    Logout
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    box: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '500px' },
    button: { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '20px' }
};

export default Profile;