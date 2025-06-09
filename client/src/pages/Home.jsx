import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { makeAuthenticatedRequest } from "../../utils/util.js";

import axios from 'axios';

const Home = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [prompt, setPrompt] = useState('');

    const handleGetUserInfo = async () => {
        try{
            const response = await makeAuthenticatedRequest('http://localhost:8080/api/user-info');
            const data = await response.json();
            console.log("RESPONSE: ", response);
            console.log("DATA (.json): ", data);
            setUserInfo(data);
        }catch(err){
            console.error(err);
            alert('Failed to get user info');
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const tokenExpiry = params.get('expires_in');

        if(accessToken && refreshToken && tokenExpiry){
            localStorage.setItem('spotify_access_token', accessToken);
            localStorage.setItem('spotify_refresh_token', refreshToken);
            localStorage.setItem('token_expiry', Date.now() + tokenExpiry * 1000);

            window.history.replaceState({}, document.title, window.location.pathname);
        }

        //Check if we have a token
        if (!localStorage.getItem('spotify_access_token') || !localStorage.getItem('spotify_refresh_token') || !localStorage.getItem('token_expiry')) {
            navigate('/login');
        }
    }, [navigate]);

    const handlePromptSubmit = async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/generate-response',{
                prompt: prompt, 
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`
                }
            });

            console.log('AI Response: ',response.data);
        }catch(err){
            console.error('Error generating response:', err);
            alert('Failed to get AI response');
        }
        
    }

    return (
        <>
            <h1>Home Page!</h1>
            <button onClick={handleGetUserInfo}>
                Get user info
            </button>
            {userInfo && (
                <div className="user-info">
                    <h2>User Profile</h2>
                    <img src={userInfo.images?.[0]?.url} alt="Profile" />
                    <p>Name: {userInfo.display_name}</p>
                    <p>Email: {userInfo.email}</p>
                    <p>Spotify ID: {userInfo.id}</p>
                </div>
            )}

            <form onSubmit={handlePromptSubmit}>
                <input 
                    name="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Suggest more in Rap/Hiphop etc..."
                    type="text"

                />
                <button type="submit">Get Suggestions</button>
            </form>
        </>
    );
}

export default Home;