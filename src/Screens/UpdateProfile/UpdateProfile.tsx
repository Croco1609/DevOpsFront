import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UpdateProfile.css';
import axios from 'axios';
import NavBar from "../../Components/NavBar/NavBar";
import { useTranslation } from "react-i18next";
import getApiUrl from '../../Services/getApiUrl';
import useAuth from '../../hooks/useAuth';
import Footer from '../../Components/Footer/Footer';

export default function UpdateProfile() {
  const [email, setEmail] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, userId, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || isLoading) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(getApiUrl(`/users/${userId}`), {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const { email, firstname, lastname, pseudo } = response.data;
        setEmail(email || '');
        setFirstName(firstname || '');
        setLastName(lastname || '');
        setPseudo(pseudo || '');
        setPhoneNumber(phoneNumber || '');
            } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error);
        setError("Erreur lors du chargement des données utilisateur.");
      }
    };

    fetchUserData();
  }, [isAuthenticated, isLoading, userId, token]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    try {
      const response = await axios.patch(
        getApiUrl(`/users/${userId}`),
        { email, phoneNumber, firstname, lastname, pseudo },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log("Profil mis à jour :", response.data);
      navigate('/my-profile');

    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      if (error.response && error.response.status === 500 && error.response.data['hydra:title'] === "An error occurred" && error.response.data['hydra:description'].includes("1062 Duplicate entry")) {
        setError("Cette adresse email est déjà utilisée. Veuillez en choisir une autre.");
      } else {
        setError("Une erreur s'est produite lors de la mise à jour du profil. Veuillez réessayer.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour supprimer votre compte.");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      return;
    }

    try {
      await axios.delete(getApiUrl(`/users/${userId}`), {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Compte utilisateur supprimé avec succès");
      localStorage.clear();
      navigate('/');
    } catch (error: any) {
      console.error("Erreur lors de la suppression du compte :", error);
      setError("Une erreur s'est produite lors de la suppression du compte. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <NavBar />
      <div className="updateProfileMainContainer">
        <h2 className="updateProfileTitle">{t("updateProfile.title")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="firstName">Prénom :</label>
            <input type="text" id="firstName" name="firstName" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="lastName">Nom :</label>
            <input type="text" id="lastName" name="lastName" value={lastname} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="phoneNumber">Numero de telephone :</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="formGroup">
            <label htmlFor="pseudo">Pseudo :</label>
            <input type="text" id="pseudo" name="pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="formActions buttons">
            <button type="submit">{t("updateProfile.buttonUpdateProfile")}</button>
            <button type="button" onClick={() => navigate('/profile')}>{t("updateProfile.buttonCancel")}</button>
          </div>
          <div>
            <button className="buttonDelete" type="button" onClick={handleDeleteAccount}>{t("updateProfile.buttonDelete")}</button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
}
