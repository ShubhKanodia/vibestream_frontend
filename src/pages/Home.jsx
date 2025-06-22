import React, { useState, useEffect } from 'react';
import './AuthSuccess.css';
import { motion } from 'framer-motion';

const AuthSuccess = () => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('spotify_access_token');
        const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
        }
        if (storedRefreshToken) {
            setRefreshToken(storedRefreshToken);
        }
    }, []);

    const copyToClipboard = (token, type) => {
        navigator.clipboard.writeText(token);
        setCopiedToken(type);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <div className="auth-success-bg">
            <motion.div 
                className="auth-success-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="vs-branding">
                     <img src="/vibestream_logo.png" alt="VibeStream Logo" className="vs-logo-small" />
                    <h1 className="auth-title">Authentication Successful!</h1>
                    <p className="auth-subtitle">Your tokens are ready. You can now proceed.</p>
                </div>

                <div className="token-display-wrapper">
                    <div className="token-field">
                        <label>Access Token</label>
                        <div className="token-input-container">
                            <input type="text" value={accessToken} readOnly />
                            <button onClick={() => copyToClipboard(accessToken, 'access')}>
                                {copiedToken === 'access' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    <div className="token-field">
                        <label>Refresh Token</label>
                        <div className="token-input-container">
                            <input type="text" value={refreshToken} readOnly />
                             <button onClick={() => copyToClipboard(refreshToken, 'refresh')}>
                                {copiedToken === 'refresh' ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>

                <a href="https://bhindi.io" target="_blank" rel="noopener noreferrer" className="proceed-btn">
                    Proceed to Bhindi AI
                </a>
            </motion.div>
        </div>
    );
};

export default AuthSuccess; 