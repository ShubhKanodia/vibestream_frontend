import React from "react";
import './Login.css';

const Login = () => {
    const handleSpotifyLogin = () => {
        window.location.href = 'https://vibe-stream-be.vercel.app/api/spotify-login';
    }

    return (
        <div className="login-bg">
            <div className="login-container vibestream">
                <div className="vs-branding">
                    <img src="/vibestream_logo.png" alt="VibeStream Logo" className="vs-logo" />
                    <h1 className="vs-title">VibeStream</h1>
                    <p className="vs-subtitle">Feel the music. Powered by Spotify.</p>
                </div>
                <button onClick={handleSpotifyLogin} className="spotify-oauth-btn">
                    <img src="/spotify_logo.png" alt="Spotify Logo" className="spotify-logo" />
                    <span>Login with Spotify</span>
                </button>
            </div>
        </div>
    );
}

export default Login;
