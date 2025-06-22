import React, { useState, useEffect } from 'react';
import './AuthSuccess.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

const AuthSuccess = () => {
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [isAccessCopied, setIsAccessCopied] = useState(false);
    const [isRefreshCopied, setIsRefreshCopied] = useState(false);
    const [isPromptCopied, setIsPromptCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        // For production, uncomment these lines and remove dummy data for actual token retrieval
        const storedAccessToken = localStorage.getItem('spotify_access_token');
        const storedRefreshToken = localStorage.getItem('spotify_refresh_token');

        if (storedAccessToken) setAccessToken(storedAccessToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    }, []);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // For display: show first 8 and last 8 chars of each token
    const displayToken = (token) => token ? `${token.slice(0, 8)}...${token.slice(-8)}` : '';

    // For copy: full prompt with full tokens
    const bhindiPrompt = `Hey bhindi, I want to create my own agent:\nname -> spotify-agent -1\n\nIt is deployed at https://vibe-stream-be.vercel.app/spotify/ and I wanna set the variables:\n\nspotify-access: ${accessToken}\n\nspotify-refresh:  ${refreshToken}\n\nNow use bhindi agent manager, use SYNC, and add this agent.\n\nTell me all the tools i can use using this spotify-agent-1!`;

    const handleCopyAccessToken = () => {
        navigator.clipboard.writeText(accessToken);
        setIsAccessCopied(true);
        showToastMessage('Access Token Copied!');
        setTimeout(() => setIsAccessCopied(false), 2000);
    };

    const handleCopyRefreshToken = () => {
        navigator.clipboard.writeText(refreshToken);
        setIsRefreshCopied(true);
        showToastMessage('Refresh Token Copied!');
        setTimeout(() => setIsRefreshCopied(false), 2000);
    };

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(bhindiPrompt);
        setIsPromptCopied(true);
        showToastMessage('Prompt Copied!');
        setTimeout(() => setIsPromptCopied(false), 2000);
    };

    return (
        <div className="auth-success-bg">
            <motion.main 
                className="auth-success-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                role="main" /* Indicate main content area */
                aria-labelledby="auth-title" /* Link to the main title */
            >
                <header className="vs-branding">
                    <img src="/vibestream_logo.png" alt="VibeStream Logo" className="vs-logo-small" />
                    <h1 id="auth-title" className="auth-title">Authentication Successful!</h1>
                    <p className="auth-subtitle">Your tokens have been generated. You can now proceed to <a href="https://bhindi.io/" target="_blank" rel="noopener noreferrer" className="bhindi-link">Bhindi AI</a>.</p>
                </header>

                <section className="token-display-wrapper">
                    <h2 className="visually-hidden">Your Spotify Tokens</h2> {/* Hidden heading for accessibility */}
                    <div className="token-info">
                        <p>
                            <strong>Access Token:</strong> 
                            <code aria-label="Spotify Access Token">{displayToken(accessToken)}</code> 
                            <button 
                                onClick={handleCopyAccessToken} 
                                className="copy-token-btn"
                                aria-label={isAccessCopied ? 'Access Token Copied!' : 'Copy Access Token'}
                            >
                                <FontAwesomeIcon icon={isAccessCopied ? faCheck : faCopy} aria-hidden="true" />
                            </button>
                        </p>
                        <p>
                            <strong>Refresh Token:</strong> 
                            <code aria-label="Spotify Refresh Token">{displayToken(refreshToken)}</code> 
                            <button 
                                onClick={handleCopyRefreshToken} 
                                className="copy-token-btn"
                                aria-label={isRefreshCopied ? 'Refresh Token Copied!' : 'Copy Refresh Token'}
                            >
                                <FontAwesomeIcon icon={isRefreshCopied ? faCheck : faCopy} aria-hidden="true" />
                            </button>
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="bhindi-prompt-label">Prompt for Bhindi AI:</h2>
                    <div className="bhindi-prompt-box-container">
                        <pre 
                            className="bhindi-prompt-text"
                            tabIndex="0"
                            role="textbox"
                            aria-label="Bhindi AI prompt for agent creation"
                        >
                            {bhindiPrompt}
                        </pre>
                        <button 
                            onClick={handleCopyPrompt} 
                            className="copy-prompt-btn"
                            aria-label={isPromptCopied ? 'Prompt Copied!' : 'Copy Prompt'}
                        >
                            <FontAwesomeIcon icon={isPromptCopied ? faCheck : faCopy} aria-hidden="true" />
                        </button>
                    </div>
                </section>

                <footer className="action-buttons-container">
                    <button 
                        onClick={() => {
                            const url = `https://bhindi.ai?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;
                            window.open(url, '_blank', 'noopener,noreferrer');
                        }} 
                        className="proceed-btn"
                        aria-label="Proceed to Bhindi AI website"
                    >
                        Proceed to <a href="https://bhindi.ai" target="_blank" rel="noopener noreferrer" className="bhindi-link">Bhindi AI</a>
                    </button>
                </footer>
            </motion.main>
            {showToast && (
                <motion.div 
                    className="toast-notification"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    role="status"
                    aria-live="polite"
                >
                    {toastMessage}
                </motion.div>
            )}
        </div>
    );
};

export default AuthSuccess; 