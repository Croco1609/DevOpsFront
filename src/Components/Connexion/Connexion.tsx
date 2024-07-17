import React, { useState } from 'react';
import './Connexion.css';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../../Services/apiService';
import { AxiosError } from 'axios';

export default function Connexion() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (honeypot) {
            setError('Bot detected.');
            return;
        }

        try {
            const data = await ApiService.login(email, password);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/');
            console.log("Connexion réussie", data);
        } catch (error: any) {
            console.log(error)
            if (error.response && error.response.status === 401 && error.response.data['message'].includes("Invalid credentials.")) {
                setError("Email ou mot de passe incorect");
            } else if (error.response && error.response.status === 500) {
                setError("Une erreur s'est produite côté serveur. Veuillez réessayer plus tard.");
            } else {
                setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
            }       
        }
    };

    return (
        <div className="mainContainer">
            <div className='login'>
                <h2>Connectez-vous</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="email">Email :</label>
                        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="formGroup passwordGroup">
                        <label htmlFor="password">Mot de passe :</label>
                        <div className="passwordInput">
                            <input type={showPassword ? "text" : "password"} id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <i onClick={togglePasswordVisibility} className="passwordIconConnexion">
                                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </i>
                            <Link to="/password-reset" className="forgotPasswordLink">Mot de passe oublié ?</Link>
                        </div>
                    </div>
                    {/* Champ Honeypot caché */}
                    <div style={{ display: 'none' }}>
                        <label htmlFor="honeypot">Honeypot:</label>
                        <input type="text" id="honeypot" name="honeypot" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                    </div>
                    <div className="formActions buttons">
                        <button type="submit">Connexion</button>
                        <Link to="/signup">
                            <button type="button">
                                Créer un compte
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
