export const refreshAccessToken = async () => {
    try{
        const refreshToken = localStorage.getItem('spotify_refresh_token');
        const response = await fetch('http://localhost:8080/api/refresh-token', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                refresh_token: refreshToken 
            })
        });
        
        if(!response.ok){
            throw new Error('Refresh failed');
        }
        
        const { access_token, expires_in } = await response.json();
        
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('token_expiry', Date.now() + expires_in * 1000);
        
        return access_token;
    }catch(err){
        console.error('Refresh failed:', err);
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        window.location.href = '/login'; // Force re-authentication
        throw err;
    }
};


export const makeAuthenticatedRequest = async (url, options = {}) => {
    let accessToken = localStorage.getItem('spotify_access_token');
    
    //Check if token expired (with 1-minute buffer)
    const expiry = localStorage.getItem('token_expiry');
    
    if(!accessToken || (expiry && Date.now() > parseInt(expiry) - 60000)){
        accessToken = await refreshAccessToken();
    }
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if(response.status === 401){
        // Token still invalid after refresh
        localStorage.removeItem('spotify_access_token');
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    
    return response;
};