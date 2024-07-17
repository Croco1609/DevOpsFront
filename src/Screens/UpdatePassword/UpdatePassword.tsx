import React, { useState } from 'react';
import NavBar from "../../Components/NavBar/NavBar";
import Footer from "../../Components/Footer/Footer";
import './UpdatePassword.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';

export default function UpdatePassword() {
  const [newToken, setNewToken] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (honeypot) {
      setError('Bot detected.');
      return;
    }

    try {
      const response = await axios.post(
        getApiUrl(`/reset-password/reset`),
        { token: newToken, password }
      );

      if (response.status === 200) {
        setSuccess("Votre mot de passe a été changé avec success");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      if (error.response && error.response.status === 404) {
        setError("Email non trouvé.");
      } else if (error.response && error.response.status === 500) {
        setError("Une erreur s'est produite côté serveur. Veuillez réessayer plus tard.");
      } else {
        setError("Une erreur s'est produite lors de la demande de réinitialisation. Veuillez réessayer.");
      }
    }

  };



  return (
    <div>
      <NavBar />
      <div className="mainContainer">
        <div className='resetPassword'>
          <h2>Réinitialisez votre mot de passe</h2>
          <div className="messageUpdatePassword">
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="password">Nouveau mot de passe :</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="newToken">Votre token :</label>
              <input
                type="text"
                id="newToken"
                name="newToken"
                required
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
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
              <Link to="/update-password">
                <button type="button">
                  Retour à la connexion
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
