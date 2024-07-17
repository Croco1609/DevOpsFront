import { useEffect, useState, useCallback } from 'react';
import {jwtDecode} from 'jwt-decode';
import getApiUrl from '../Services/getApiUrl';

const fetchRefreshToken = async (refreshToken: string) => {
    const url = getApiUrl('/token/refresh');
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors du rafraîchissement du token');
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        throw error;
    }
};

interface MyToken {
    exp: number;
    username: string;
    roles: string[];
    id: string;
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState<string[]>([]);
    const [username, setUsername] = useState('');
    const storedRefreshToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '').refresh_token : '';

    const handleTokenUpdate = (newToken: string) => {
        const decodedNewToken: MyToken = jwtDecode(newToken);
        setToken(newToken);
        setRole(decodedNewToken.roles);
        setUsername(decodedNewToken.username);
        setUserId(decodedNewToken.id);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify({ token: newToken, refresh_token: storedRefreshToken }));
    };

    const checkTokenValidity = useCallback(async () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setToken(parsedUserData.token);

            if (parsedUserData.token.split('.').length === 3) {
                try {
                    const decoded: MyToken = jwtDecode(parsedUserData.token);
                    setRole(decoded.roles);
                    setUsername(decoded.username);
                    setUserId(decoded.id);
                    setIsAuthenticated(true);

                    const expirationTime = decoded.exp * 1000;
                    const currentTime = new Date().getTime();
                    if (expirationTime < currentTime) {
                        try {
                            const newToken = await fetchRefreshToken(storedRefreshToken);
                            handleTokenUpdate(newToken);
                        } catch (error) {
                            console.error('Erreur lors du rafraîchissement du token: ', error);
                            setIsAuthenticated(false);
                        }
                    }
                } catch (error) {
                    console.error('Token invalide: ', error);
                    setIsAuthenticated(false);
                }
            } else {
                console.error('Token invalide: Format incorrect');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
        setIsLoading(false);
    }, [storedRefreshToken]);

    useEffect(() => {
        checkTokenValidity();
    }, [checkTokenValidity]);

    return {
        isAuthenticated,
        isLoading,
        userId,
        token,
        role,
        username,
    };
};

export default useAuth;
