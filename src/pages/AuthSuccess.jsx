import React, { useState, useEffect } from 'react';
import './AuthSuccess.css';
import { motion } from 'framer-motion';

const AuthSuccess = () => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('spotify_access_token');
        const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

        if (storedAccessToken) setAccessToken(storedAccessToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    }, []);

    // For display: show first 8 and last 8 chars of each token
    const displayToken = (token) => token ? `${token.slice(0, 8)}...${token.slice(-8)}` : '';

    // For copy: full prompt with full tokens
    const bhindiPrompt = `Hey, here are my tokens for Bhindi AI:\nAccess Token: ${accessToken}\nRefresh Token: ${refreshToken}`;

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
                    <h1 className="auth-title">Authentication Successful</h1>
                    <p className="auth-subtitle">Your tokens have been generated. You can now proceed to Bhindi AI.</p>
                </div>

                <div className="token-display-wrapper">
                    <div className="token-info">
                        <p><strong>Access Token:</strong> <code>{displayToken(accessToken)}</code></p>
                        <p><strong>Refresh Token:</strong> <code>{displayToken(refreshToken)}</code></p>
                    </div>
                </div>

                <div className="bhindi-prompt-box">
                    <div className="bhindi-prompt-label">Prompt for Bhindi AI:</div>
                    <div className="bhindi-prompt-text">
                        Hey, here are my tokens for Bhindi AI:<br/>
                        Access Token: <span className="token-inline">{displayToken(accessToken)}</span><br/>
                        Refresh Token: <span className="token-inline">{displayToken(refreshToken)}</span>
                    </div>
                </div>

                <div className="action-buttons-container">
                    <button onClick={() => {
                        navigator.clipboard.writeText(bhindiPrompt);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                    }} className="copy-btn">
                        {isCopied ? 'Copied!' : 'Copy Bhindi AI Prompt'}
                    </button>
                    <button onClick={() => {
                        const url = `https://bhindi.ai?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }} className="proceed-btn">
                        Proceed to Bhindi AI
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthSuccess; 