import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';
import './BackOfficeHomeComponent.css';
import useAuth from '../../hooks/useAuth';

export default function BackOfficeHomeComponent() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [pendingRessourcesCount, setPendingRessourcesCount] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [publicRessourcesCount, setPublicRessourcesCount] = useState(0);
    const [bannedUsersCount, setBannedUsersCount] = useState(0); // Nouvel état pour le nombre d'utilisateurs bannis
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, role, isLoading, token } = useAuth();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes("ROLE_ADMIN"))) {
            navigate('/');
        }

        const fetchPendingRessources = async () => {
            try {
                const response = await axios.get(getApiUrl('/pending_ressources'), {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    setPendingRessourcesCount(response.data.length);
                } else {
                    console.error('Failed to fetch pending resources');
                }
            } catch (error) {
                console.error('Error fetching pending resources:', error);
            }
        };

        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get(getApiUrl('/total-users'), {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    setTotalUsers(response.data.totalUsers);
                } else {
                    console.error('Failed to fetch total users');
                }
            } catch (error) {
                console.error('Error fetching total users:', error);
            }
        };

        const fetchPublicRessources = async () => {
            try {
                const response = await axios.get(getApiUrl('/api/public/ressources'), {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    setPublicRessourcesCount(response.data.length);
                } else {
                    console.error('Failed to fetch public ressources');
                }
            } catch (error) {
                console.error('Error fetching public ressources:', error);
            }
        };

        const fetchBannedUsers = async () => {
            try {
                const response = await axios.get(getApiUrl('/banned/users'), {
                    headers: {
                        'Content-Type': 'application/ld+json',
                        "Authorization": `Bearer ${token}`,
                    }
                });
                if (response.status === 200) {
                    setBannedUsersCount(response.data.length);
                } else {
                    console.error('Failed to fetch banned users');
                }
            } catch (error) {
                console.error('Error fetching banned users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingRessources();
        fetchTotalUsers();
        fetchPublicRessources();
        fetchBannedUsers(); // Appel de la fonction pour récupérer le nombre d'utilisateurs bannis
    }, [isAuthenticated, isLoading, navigate, role, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2 className='backOfficeTitle'>{t("backOffice.admin")}</h2>
            <div className='backOfficeHomeComponent'>
                <div className="containerCard">
                    <div className='backOfficeHomeComponentCard' onClick={() => { navigate('/backoffice/waitingRessources'); }}>
                        <span className="InfoNumber">
                            {pendingRessourcesCount}
                        </span>
                        <span className='infoName'>
                            {t("backOfficeHome.ressourceToValidate")}
                        </span>
                    </div>

                    <div className='backOfficeHomeComponentCard' onClick={() => { navigate('/backoffice/reports'); }}>
                        <span className="InfoNumber">
                            {totalUsers}
                        </span>
                        <span className='infoName'>
                            {t("backOfficeHome.totalUser")}
                        </span>
                    </div>
                </div>
                <div className="containerCard">
                    <div className='backOfficeHomeComponentCard' onClick={() => { navigate('/backoffice/publicRessources'); }}>
                        <span className="InfoNumber">
                            {publicRessourcesCount}
                        </span>
                        <span className='infoName'>
                            {t("backOfficeHome.publicRessources")}
                        </span>
                    </div>

                    <div className='backOfficeHomeComponentCard' onClick={() => { navigate('/backoffice/bannedUsers'); }}>
                        <span className="InfoNumber">
                            {bannedUsersCount}
                        </span>
                        <span className='infoName'>
                            {t("backOfficeHome.bannedUsers")}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
