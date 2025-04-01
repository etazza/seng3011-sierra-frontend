import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { frontend } from '../data/api';

const COGNITO_DOMAIN = 'https://ap-southeast-2t9fzemfbo.auth.ap-southeast-2.amazoncognito.com';
const CLIENT_ID = '3v7ki1aici8sehh86o37b68nbm';
const REDIRECT_URI = frontend;

export const useCognito = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    if (authCode && !user) {
      // Exchange authorization code for access token
      fetchAccessToken(authCode);
    } else {
      // Check if an access token is already stored
      const accessToken = localStorage.getItem('access-token');
      if (accessToken) {
        setUser({ token: accessToken });
      }
    }
  }, []);

  const login = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=default-m2m-resource-server-u1isj%2Fread&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl; // Redirect to Cognito login page
  };

  const fetchAccessToken = async (authCode: string) => {
    try {
      const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          code: authCode,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch access token');

      const data = await response.json();
      localStorage.setItem('access-token', data.access_token);
      setUser({ token: data.access_token });

      navigate('/upload'); // Redirect to the upload page after login
    } catch (error) {
      console.error('Error fetching access token:', error);
      setUser(null);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access-token');

    // Redirect user to Cognito logout endpoint
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;
    window.location.href = logoutUrl;
  };

  return { user, login, logout };
};