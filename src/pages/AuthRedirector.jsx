import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const tokenExpiry = params.get('expires_in');

    if (accessToken && refreshToken && tokenExpiry) {
      // If tokens are in the URL, it's a Spotify callback.
      // Save tokens and redirect to the success page.
      localStorage.setItem('spotify_access_token', accessToken);
      localStorage.setItem('spotify_refresh_token', refreshToken);
      localStorage.setItem('token_expiry', Date.now() + tokenExpiry * 1000);
      navigate('/auth-success', { replace: true });
    } else {
      // Otherwise, redirect to the login page.
      navigate('/login', { replace: true });
    }
  }, [navigate, location]);

  // This component doesn't render anything itself.
  return null;
};

export default AuthRedirector; 