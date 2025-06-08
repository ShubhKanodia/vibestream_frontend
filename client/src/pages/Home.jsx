import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');

        if(accessToken){
            localStorage.setItem('spotify_access_token', accessToken);
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        //Check if we have a token
        if (!localStorage.getItem('spotify_access_token')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleGetUserInfo = async () => {
        
    }

    return (
        <>
            <h1>Home Page!</h1>
            <button onClick={handleGetUserInfo}>
                Get user info
            </button>
        </>
    );
}

export default Home;