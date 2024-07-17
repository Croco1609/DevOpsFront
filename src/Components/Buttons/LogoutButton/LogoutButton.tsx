import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './LogoutButton.css';


const LogoutButton: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="buttonLogOut">
            {t('nav.logout')}
        </button>
    );
};

export default LogoutButton;



