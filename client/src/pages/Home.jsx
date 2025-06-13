import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [imagePrompt, setImagePrompt] = useState('');
    const [file, setFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

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

        if (!localStorage.getItem('spotify_access_token') || !localStorage.getItem('spotify_refresh_token') || !localStorage.getItem('token_expiry')) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setImagePrompt('');
        setFile(null);

        if (!file && !imagePrompt.trim()) return;
        
        setIsLoading(true);
        
        // Create user message
        const userMessage = { 
            text: imagePrompt || (file ? "Analyze this image" : ""), 
            sender: "user", 
            image: file 
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            const accessToken = localStorage.getItem('spotify_access_token');
            const headers = {
                'Content-Type': file ? 'multipart/form-data' : 'application/json'
            }

            if(accessToken){
                headers['Authorization'] = `Bearer ${accessToken}`;
            }

            let response;
            
            if (file) {
                // Image analysis route
                const formData = new FormData();
                formData.append('image', file);
                formData.append('prompt', imagePrompt);
                
                response = await axios.post('http://localhost:8080/api/analyze-image', formData, {
                    headers: headers
                });
            } else {
                // Text-only route
                response = await axios.post('http://localhost:8080/api/generate-response', {
                    prompt: imagePrompt
                }, {
                    headers: headers
                });
            }

            const responseText = response.data.message || JSON.stringify(response.data);
            const botMessage = { text: responseText, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch(err) {
            const errorMessage = { text: err.response?.data?.error || "Request failed", sender: "bot" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <motion.div 
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="chat-container">
                <div className="chat-header">
                    <div className="header-content">
                        <h2>🎵 Music Mood Analyzer</h2>
                        <p>Upload images or chat to discover your perfect soundtrack</p>
                    </div>
                </div>

                {messages.length === 0 ? (
                    <motion.div 
                        className="upload-prompt"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="welcome-icon">🎨</div>
                        <h1>Share your vibe, discover your sound</h1>
                        <p>Upload an image or describe your mood to get personalized music recommendations</p>
                        
                        <div className="action-buttons">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(233, 69, 132, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="upload-btn primary"
                                onClick={triggerFileInput}
                            >
                                📸 Upload Image
                            </motion.button>
                        </div>
                        
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </motion.div>
                ) : (
                    <div className="messages-container">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`message ${message.sender}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    {message.sender === 'user' && message.image && (
                                        <div className="image-preview">
                                            <img 
                                                src={URL.createObjectURL(message.image)} 
                                                alt="Uploaded preview" 
                                            />
                                        </div>
                                    )}
                                    {message.text && <p>{message.text}</p>}
                                    <div className={`message-timestamp ${message.sender}`}>
                                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        
                        {isLoading && (
                            <motion.div
                                className="message bot loading-message"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <p className="loading-text">Analyzing your vibe...</p>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
                
                <motion.form 
                    onSubmit={handleSubmit}
                    className="input-area"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="input-container">
                        {messages.length > 0 && (
                            <motion.button 
                                type="button"
                                className="attachment-btn"
                                onClick={triggerFileInput}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Add image"
                            >
                                📎
                            </motion.button>
                        )}
                        
                        {file && (
                            <motion.div 
                                className="file-preview"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <img src={URL.createObjectURL(file)} alt="Preview" />
                                <button 
                                    type="button" 
                                    className="remove-file"
                                    onClick={() => setFile(null)}
                                >
                                    ✕
                                </button>
                            </motion.div>
                        )}
                        
                        <input
                            name='imagePrompt'
                            value={imagePrompt}
                            type='text'
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder={file ? "Describe what you're looking for (optional)" : 
                                       messages.length === 0 ? "Or describe your mood here..." : 
                                       "Ask for more recommendations..."}
                            className="chat-input"
                        />
                        
                        <motion.button 
                            type="submit" 
                            disabled={isLoading || (!file && !imagePrompt.trim())}
                            className={`send-btn ${isLoading ? 'loading' : ''}`}
                            whileHover={!isLoading ? { scale: 1.05 } : {}}
                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                        >
                            {isLoading ? (
                                <span className="spinner"></span>
                            ) : (
                                <span>🚀</span>
                            )}
                        </motion.button>
                    </div>
                    
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </motion.form>
            </div>
        </motion.div>
    );
}

export default Home;