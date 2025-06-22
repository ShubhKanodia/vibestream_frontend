import React, { useState, useEffect } from 'react';
import './AuthSuccess.css';
import { motion } from 'framer-motion';
import { Toast, ToastContainer } from 'react-bootstrap';

const AuthSuccess = () => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('spotify_access_token');
        const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

        if (storedAccessToken) setAccessToken(storedAccessToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    }, []);

    // For display: show first 8 and last 8 chars of each token
    const displayToken = (token) => token ? `${token.slice(0, 8)}...${token.slice(-8)}` : '';

    // For copy: full prompt with full tokens
    const bhindiPrompt = `Hey bhindi, I want to create my own agent:
name -> spotify-agent-1

It is deployed at https://vibe-stream-be.vercel.app/spotify/ and I wanna set the variables:

spotify-access: ${accessToken}

spotify-refresh: ${refreshToken}

Now use bhindi agent manager, use SYNC, and add this agent.
Tell me all the tools i can use using this spotify-agent-1!`;

    const copyToClipboard = async (text, message) => {
        try {
            await navigator.clipboard.writeText(text);
            setToastMessage(message);
            setShowToast(true);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const copyAccessToken = () => {
        copyToClipboard(accessToken, 'Access token copied to clipboard!');
    };

    const copyRefreshToken = () => {
        copyToClipboard(refreshToken, 'Refresh token copied to clipboard!');
    };

    const copyFullPrompt = () => {
        copyToClipboard(bhindiPrompt, 'Bhindi prompt copied to clipboard!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
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
                    <h1 className="auth-title">Authentication Successful</h1>
                    <p className="auth-subtitle">Your tokens have been generated. You can now proceed to Bhindi AI.</p>
                </div>

                <div className="token-display-wrapper">
                    <div className="token-info">
                        <div className="token-row">
                            <span><strong>Access Token:</strong></span>
                            <div className="token-display">
                                <code>{displayToken(accessToken)}</code>
                                <button 
                                    onClick={copyAccessToken}
                                    className="copy-icon-btn"
                                    title="Copy access token"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="token-row">
                            <span><strong>Refresh Token:</strong></span>
                            <div className="token-display">
                                <code>{displayToken(refreshToken)}</code>
                                <button 
                                    onClick={copyRefreshToken}
                                    className="copy-icon-btn"
                                    title="Copy refresh token"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bhindi-prompt-box">
                    <div className="bhindi-prompt-label">Prompt for Bhindi AI:</div>
                    <div className="bhindi-prompt-text">
                        Hey bhindi, I want to create my own agent:<br/>
                        name -&gt; spotify-agent-1<br/><br/>
                        It is deployed at https://vibe-stream-be.vercel.app/spotify/ and I wanna set the variables:<br/><br/>
                        spotify-access: <span className="token-inline">{displayToken(accessToken)}</span><br/><br/>
                        spotify-refresh: <span className="token-inline">{displayToken(refreshToken)}</span><br/><br/>
                        Now use bhindi agent manager, use SYNC, and add this agent.<br/>
                        Tell me all the tools i can use using this spotify-agent-1!
                    </div>
                </div>

                <div className="action-buttons-container">
                    <button onClick={copyFullPrompt} className="copy-btn">
                        {isCopied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                    <button onClick={() => {
                        const url = `https://bhindi.io?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
                        window.open(url, '_blank', 'noopener,noreferrer');
                    }} className="proceed-btn">
                        Proceed to Bhindi AI
                    </button>
                </div>
            </motion.div>

            {/* Toast Container */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1055 }}>
                <Toast 
                    show={showToast} 
                    onClose={() => setShowToast(false)} 
                    delay={3000} 
                    autohide
                    bg="success"
                >
                    <Toast.Header>
                        <strong className="me-auto">Success</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default AuthSuccess; 