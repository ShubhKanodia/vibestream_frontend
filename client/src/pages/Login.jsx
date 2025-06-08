import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const error = searchParams.get('error');
        if(error){
            alert(`Authentication Failed: ${error}`);

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [searchParams]);

    const handleSpotifyAuth = () => {
        window.location.href = 'http://localhost:8080/api/login';
    }

    return (
        <>
            <div className="login-container">
                <h1>Login Page!</h1>
                <button onClick={handleSpotifyAuth} className="spotify-oauth-btn">
                    Login with Spotify
                </button>
            </div>
        </>
    );
}

export default Login;