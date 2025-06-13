import axios from 'axios';

export async function getTopTracks(accessToken, timeRange='medium_term', limit=10){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(response.data.items);
        return response.data.items;
    }catch(err){
        console.error(`Error fetching the top tracks!`, err.message);
        return null;
    }
}

export async function getTopArtists(accessToken, timeRange='medium_term', limit=10){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(response.data.items);
        return response.data.items;
    }catch(err){
        console.error(`Error fetching the top artists!`, err.message);
        return null;
    }
}

export async function getRecentlyPlayed(accessToken, limit=20){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}`,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(response.data.items);
        return response.data.items;
    }catch(err){
        console.error(`Error fetching the recently played!`, err.message);
        return null;
    }
}

export async function getUserPlaylists(accessToken, limit=20){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log(response.data.items);
        return response.data.items;
    }catch(err){
        console.error(`Error fetching the playlists!`, err.message);
        return null;
    }
}

export async function getUserFollowedArtists(accessToken, limit=10){
    try{
        const response = await axios.get(`https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }  
        });

        console.log(response.data.items);
        return response.data.items;
    }catch(err){
        console.error(`Error fetching the user followed artists!`, err.message);
        return null;
    }
}