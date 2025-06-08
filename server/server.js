import express from 'express';
import ENV from './config/env.js';

import crypto from 'crypto';
import cors from 'cors';

import querystring from 'querystring';
import axios from 'axios';

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

app.get('/api', (req, res) => {
    return res.send('API ROUTE IN SERVER');
});

app.get('/api/login', (req, res) => {
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
        console.log("CODE, STATE, ERROR:", code, state, error);

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

        console.log("Token response: ", tokenResponse);

        res.redirect(`${ENV.CLIENT_URL}/?access_token=${tokenResponse.data.access_token}`);
    }catch(err){
        console.error('Callback error:', err);
        res.redirect(`${ENV.CLIENT_URL}/login?error=auth_failed`);
    }
});



app.listen(port, "127.0.0.1", () => {
    console.log(`Server is running on ${port} in ${mode} mode`);
});