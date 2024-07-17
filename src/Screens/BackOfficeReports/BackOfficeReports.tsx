import React, { useState, useEffect } from 'react';
import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import useAuth from "../../hooks/useAuth";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import getApiUrl from '../../Services/getApiUrl';
import "./BackOfficeReports.css";


interface User {
    '@id': string;
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    firstname: string;
    lastname: string;
    active: boolean;
}

export default function BackOfficeReports() {
    const { isAuthenticated, role, isLoading, token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [bannedUsers, setBannedUsers] = useState<User[]>([]);
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes("ROLE_ADMIN"))) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate, role]);

    const fetchUsers = async () => {
        try {
            const response: AxiosResponse<any> = await axios.get(getApiUrl('/users'), {
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data['hydra:member']);
            setLoadingUsers(false);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchBannedUsers = async () => {
        try {
            const response: AxiosResponse<User[]> = await axios.get(getApiUrl('/banned/users'), {
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setBannedUsers(response.data);
        } catch (error) {
            console.error('Error fetching banned users:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
            fetchBannedUsers();
        }
    }, [token]);

    const toggleUserBanStatus = async (userId: string) => {
        const extractedId = userId.split('/').pop();
        const banReason = prompt('Veuillez entrer la raison du bannissement :');

        if (banReason !== null) {
            try {
                await axios.post(
                    getApiUrl(`/users/${extractedId}/toggle-active`),
                    { banReason: banReason },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                fetchBannedUsers();
            } catch (error) {
                console.error('Error toggling user ban status:', error);
            }
        }
    };

    const toggleUserDebanStatus = async (userId: any) => {
        const debanReason = prompt('Veuillez entrer la raison du debannissement :');
        try {
            await axios.post(
                getApiUrl(`/users/${userId}/toggle-active`),
                { banReason: debanReason },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchBannedUsers();
        } catch (error) {
            console.error('Error toggling user ban status:', error);
        }
    };


    if (isLoading || loadingUsers) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <BackOfficeNavMenu />
            <div className='BackOfficeReportsContainer'>
                <h2>Tous les utilisateurs</h2>
                <ul>
                    {Array.isArray(users) && users.map(user => (
                        <div className="backOfficeContainerUsers">
                            <li key={user['@id']}>
                                <span>{user.firstname} {user.lastname}</span>
                                <button onClick={() => toggleUserBanStatus(user['@id'])}>
                                    Ban
                                </button>
                            </li>
                        </div>
                    ))}
                </ul>
                <h2>Utilisateurs bannis</h2>
                <ul>
                    {Array.isArray(bannedUsers) && bannedUsers.map(user => (
                        <div className="backOfficeContainerUsers">
                            <li key={user['@id']}>
                                {user.firstname} {user.lastname}
                                <button onClick={() => toggleUserDebanStatus(user.id)}>Déban</button>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    );
}
