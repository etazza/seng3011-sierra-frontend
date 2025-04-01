import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCognito = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing authentication (e.g., from local storage, or cookie)
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, []);

  const login = (userInfo: any) => {
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    navigate('/upload'); // Redirect to the data upload page
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/'); // Redirect to the home page
  };

  return { user, login, logout };
};