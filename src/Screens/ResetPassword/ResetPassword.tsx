import React, { useState } from 'react';
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import './ResetPassword.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';
import useAuth from '../../hooks/useAuth';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token, isLoading, role, userId } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (honeypot) {
            setError('Bot detected.');
            return;
        }

        try {
            const response = await axios.post(
                getApiUrl(`/reset-password/request`),
                { email },
                {
                    headers: {
                        'Content-Type': 'application/ld+json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setSuccess("Un email de réinitialisation de mot de passe a été envoyé.");
                setTimeout(() => {
                    navigate('/update-password');
                }, 2000);
            }
            return response.data;
        } catch (error: any) {
            console.error("Error updating status:", error);
        }
    };

    const handleNavigateToLogin = () => {
        navigate('/login');
      };



    return (
        <div>
            <NavBar />
            <div className="mainContainer">
                <div className='resetPassword'>
                    <h2>Réinitialisez votre mot de passe</h2>
                    <div className="messageResetPassword">
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="formGroup">
                            <label htmlFor="email">Email :</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'none' }}>
                            <label htmlFor="honeypot">Honeypot:</label>
                            <input
                                type="text"
                                id="honeypot"
                                name="honeypot"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                        </div>
                        <div className="formActions buttons">
                            <button type="submit">Envoyer</button>
                            <button type="button" onClick={handleNavigateToLogin}>
                                Retour à la connexion
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
