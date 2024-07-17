import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupComponent.css';
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';

export default function SignupComponent() {
    const [email, setEmail] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const serializeJsonLd = (data: any) => {
        return JSON.stringify({
            "@context": "/api/contexts/User",
            "@type": "User",
            ...data,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
    
        try {
            const response = await axios.post(
                getApiUrl("/users"),
                serializeJsonLd({ email, firstname, lastname, password, dateOfBirth, pseudo }),
                {
                    headers: {
                        "Content-Type": "application/ld+json",
                    },
                }
            );
    
            console.log("Inscription réussie :", response.data);
            navigate('/login');
    
        } catch (error: any) {
            console.error("Erreur lors de l'inscription :", error);
            if (error.response && error.response.status === 500 && error.response.data['hydra:title'] === "An error occurred" && error.response.data['hydra:description'].includes("1062 Duplicate entry")) {
                setError("Cette adresse email est déjà utilisée. Veuillez en choisir une autre.");
            } else if (error.response && error.response.status === 500) {
                setError("Une erreur s'est produite côté serveur. Veuillez réessayer plus tard.");
            } else {
                setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
            }
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="mainContainer">
            <div className="signup">
                <h2>Inscription</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="email">Email :</label>
                        <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="firstName">Prénom :</label>
                        <input type="text" id="firstName" name="firstName" required value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="lastName">Nom :</label>
                        <input type="text" id="lastName" name="lastName" required value={lastname} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="pseudo">Pseudo :</label>
                        <input type="text" id="pseudo" name="pseudo" required value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="dateOfBirth">Date de naissance :</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" required value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                    </div>
                    <div className="formGroup passwordGroup">
                        <label htmlFor="password">Mot de passe :</label>
                        <div className="passwordInput">
                            <input type={showPassword ? "text" : "password"} id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <i onClick={togglePasswordVisibility} className="passwordIcon">
                                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </i>
                        </div>
                    </div>
                    <div className="formGroup passwordGroup">
                        <label htmlFor="confirmPassword">Confirmation du mot de passe :</label>
                        <div className="passwordInput">
                            <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <i onClick={toggleConfirmPasswordVisibility} className="passwordIcon">
                                {showConfirmPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </i>
                        </div>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="formActions buttons">
                        <button type="submit">Inscription</button>
                        <Link to="/login">
                            <button type="button">
                                Déjà inscrit ?
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
