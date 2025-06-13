import express from 'express';
import ENV from './config/env.js';

import crypto from 'crypto';
import cors from 'cors';

import querystring from 'querystring';
import axios from 'axios';
import multer from 'multer';

import { geminiChatService, geminiVisionService } from './services/gemini.js';
import { getTopTracks, getTopArtists, getRecentlyPlayed, getUserPlaylists, getUserFollowedArtists } from './services/spotify.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const port = ENV.PORT;
const mode = ENV.NODE_ENV;

const corsOptions = {
    origin: [ENV.CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

// In-memory store for state validation (use Redis in production)
const stateStore = new Set();

function generateSecureState(){
    const state = crypto.randomBytes(16).toString('hex');
    const expiresAt = Date.now() + 600000;  //10 min
    const signature = crypto.createHmac('sha256', ENV.STATE_SECRET)
                            .update(`${state}|${expiresAt}`)
                            .digest('hex');

    stateStore.add(state); //Store for validation
    return `${state}.${expiresAt}.${signature}`;
}

//Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Multer 
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024 
    }
});

app.get('/api', (req, res) => {
    return res.send('API ROUTE IN SERVER');
});

app.use('/api', authRouter);

app.get('/api/spotfy-login', (req, res) => {
    try{
        const scope = 'user-read-private user-read-email user-top-read';
        const state = generateSecureState();

        const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
            response_type: 'code',
            client_id: ENV.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: ENV.REDIRECT_URI,
            state: state,
            show_dialog: true,
        });

        res.redirect(authUrl);
    }catch(err){
        console.log(err);
        res.status(500).send('Authentication failed');
    }
});

app.get('/api/callback', async (req, res) => {
    try{
        const { code, state, error } = req.query;

        //Validate state
        if(!state || !stateStore.has(state.split('.')[0])){
            return res.status(400).redirect(`${ENV.CLIENT_URL}/login?error=invalid_state`);
        }
        stateStore.delete(state.split('.')[0]);

        if(error){
            return res.redirect(`${ENV.CLIENT_URL}/login?error=${error}`);
        }

        //Exchage the code for tokens
        const authHeader = {
            headers:{
               'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${ENV.SPOTIFY_CLIENT_ID}:${ENV.SPOTIFY_CLIENT_SECRET}`).toString('base64')}` 
            }
        }

        const formData = {
            code: code,
            redirect_uri: ENV.REDIRECT_URI,
            grant_type: 'authorization_code'
        }

        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', formData, authHeader, { json: true });

        res.redirect(`${ENV.CLIENT_URL}/?access_token=${tokenResponse.data.access_token}&refresh_token=${tokenResponse.data.refresh_token}&expires_in=${tokenResponse.data.expires_in}`);
    }catch(err){
        console.error('Callback error:', err);
        res.redirect(`${ENV.CLIENT_URL}/login?error=auth_failed`);
    }
});

app.get('/api/user-info', async (req, res) => {
    try{
        const accessToken = req.headers.authorization?.split(' ')[1];
        
        if(!accessToken){
            return res.status(401).json({ error: 'Missing access token' });
        }

        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
        });

        res.json(userResponse.data);
    }catch(err){
        console.error('Fetching user info error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
});

app.post('/api/generate-response', async (req, res) => {
    try{
        const { prompt } = req.body;
        const accessToken = req.headers.authorization?.split(' ')[1];

        if(!prompt){
            return res.status(400).json({
                error: 'Prompt is required'
            });
        }

        let spotifyContext = ' ';

        if(accessToken){
            try{
                //Fetch Spotify data in parallel
                const [topTracks, topArtists, recentTracks, userPlaylists, userFollowedArtists] = await Promise.all([
                    getTopTracks(accessToken),
                    getTopArtists(accessToken),
                    getRecentlyPlayed(accessToken),
                    getUserPlaylists(accessToken),
                    getUserFollowedArtists(accessToken)
                ]);

                spotifyContext = `\nUser's Spotify data: \n` + 
                                `Top Tracks: ${topTracks?.map(t => t.name).join(', ') || 'None'}` + 
                                `Top Artists: ${topArtists?.map(a => a.name).join(', ') || 'None'}` + 
                                `Recently Played: ${recentTracks?.map(r => r.track.name).join(', ') || 'None'}` + 
                                `Playlists: ${userPlaylists?.map(p => p.name).join(', ') || 'None'}` + 
                                `Followed Artists: ${userFollowedArtists?.map(art => art.name).join(', ') || 'None'}`
            }catch(err){
                console.error('Error fetching Spotify data:', spotifyErr);
            }
        }

        const fullPrompt = `User asked: ${prompt}${spotifyContext}\n\n` +
            `Please provide a personalized response considering the user's music preferences when relevant. ` +
            `If they asked for music recommendations, suggest songs or artists that align with their taste.`;

        const aiResponse = await geminiChatService(fullPrompt);

        console.log("Gemini Reponse: ", aiResponse);
        res.json({
            response: aiResponse
        });
        
    }catch(err){
        console.error('Generation error:', err);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    const accessToken = req.headers.authorization?.split(' ')[1];
    try{        
        if(!req.file){
            return res.status(400).json({ error: 'No image uploaded!' });
        }

        const { prompt } = req.body;
        const { buffer, mimeType } = req.file;

        const base64Image = buffer.toString('base64');

        //Do something with file size as well!
        const fileSizeInMB = buffer.length / (1024 * 1024);
        if (fileSizeInMB > 20) { 
            return res.status(400).json({ error: 'File too large. Maximum size is 20MB.' });
        }

        let spotifyContext = '';
        if(accessToken){
            try{
                const [topTracks, topArtists] = await Promise.all([
                    getTopTracks(accessToken),
                    getTopArtists(accessToken),
                ]);

                spotifyContext = `\n\nUser's Music Preferences:\n` +
                    `Favorite Tracks: ${topTracks?.map(t => t.name).join(', ') || 'None'}\n` +
                    `Favorite Artists: ${topArtists?.map(a => a.name).join(', ') || 'None'}`;
            }catch(err){
                console.error('Error fetching Spotify data:', spotifyErr);
            }
        }

        const fullPrompt = `Analyze this image with the following context:\n` +
            `User description: ${prompt || 'No description provided'}\n` +
            `When suggesting music based on the image, consider these preferences:${spotifyContext}\n\n` +
            `Provide a detailed analysis of the image and suggest appropriate music. ` +
            `If the user has favorite artists, try to recommend songs from those artists when relevant.`;

        const analysis = await geminiVisionService({
            image: base64Image,
            mimeType: mimeType,
            prompt: fullPrompt
        });

        console.log("Gemini Response: ", analysis);
        
        return res.json({
            message: analysis,
        });
    }catch(err){
        console.error("Analyze image error: ", err);
        return res.status(500).json({ 
            error: err.message || 'Failed to analyze image' 
        });
    }
})

//Refresh token
app.post('/api/refresh-token', async (req, res) => {
    try{
        const { refresh_token } = req.body;

        const postHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${ENV.SPOTIFY_CLIENT_ID}:${ENV.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        }

        const postForm = {
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        }

        const response = await axios.post('https://accounts.spotify.com/api/token', postForm, postHeaders, { json: true });

        console.log("Response for refresh token -> ",response);
        res.json({
            access_token: response.data.access_token,
            expires_in: response.data.expires_in 
        });
    }catch(err){
        console.error('Refresh error:', err.response?.data || err.message);
        res.status(401).json({ error: 'Token refresh failed' });
    }
})



app.listen(port, "127.0.0.1", () => {
    console.log(`Server is running on ${port} in ${mode} mode`);
});