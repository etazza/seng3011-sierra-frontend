import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { frontend } from '../data/api';
import { cognitoDomain, clientId, clientSecret } from '../data/api';

const COGNITO_DOMAIN = cognitoDomain;
const CLIENT_ID = clientId;
const CLIENT_SECRET = clientSecret;
const REDIRECT_URI = frontend;

export const useCognito = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // On initial load or when the auth code is present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code'); // Check if auth code exists in URL

    if (authCode && !user) {
      fetchAccessToken(authCode); // Exchange auth code for access token
    } else {
      // If token is stored and valid, set user
      const storedToken = localStorage.getItem('access-token');
      if (storedToken && isTokenValid(storedToken)) {
        setUser({ token: storedToken });
        navigate('/upload'); // Redirect to the upload page if user is authenticated
      } else {
        setUser(null);
      }
    }
  }, []);

  // Check if the stored token is still valid
  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return expiry > Date.now(); // Token is valid if it's not expired
    } catch (error) {
      console.log(error);
      return false; // Invalid token
    }
  };

  // Initiate login by redirecting to Cognito
  const login = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=default-m2m-resource-server-u1isj%2Fread&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl; // Redirect to Cognito login page
  };

  // Exchange authorization code for access token
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
          client_secret: CLIENT_SECRET,
          code: authCode,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        response.json().then((data) => {
          console.log(REDIRECT_URI);
          console.log(data);
          throw new Error('Failed to fetch access token');
        }).catch((err) => {
          console.log(err);
          throw new Error('Failed to fetch access token');
        })
      }

      const data = await response.json();
      localStorage.setItem('access-token', data.id_token); // Store the ID token
      setUser({ token: data.id_token }); // Set user data in state

      navigate('/upload'); // Redirect to the upload page after successful login
    } catch (error) {
      console.error('Error fetching access token:', error);
      setUser(null);
    }
  };

  // Logout user by clearing token and redirecting to Cognito logout endpoint
  const logout = () => {
    setUser(null);
    localStorage.removeItem('access-token'); // Remove token from storage

    // Redirect user to Cognito logout endpoint
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;
    window.location.href = logoutUrl;
  };

  return { user, login, logout };
};