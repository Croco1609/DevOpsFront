import React, { useState, useEffect } from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import ProfileInfo from '../../Components/ProfileInfo/ProfileInfo';
import RessourcePresentation from '../../Components/RessourcePresentation/RessourcePresentation';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './Profile.css';
import axios from 'axios';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import getApiUrl from '../../Services/getApiUrl';
import Footer from '../../Components/Footer/Footer';

type Resource = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  views: number;
  likes: number;
  isPrivate: boolean;
  user: string;
  image: string;
  comments: string[];
  saved: string[];
};

type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  Image: string;
  firstname: string;
  lastname: string;
  pseudo: string;
};

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, userId, token } = useAuth();
  const [isMyRessourcesVisible, setIsMyRessourcesVisible] = useState(true);
  const [myResources, setMyResources] = useState<Resource[] | null>(null);
  const [likedRessources, setLikedRessources] = useState<Resource[] | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [myRessourcesError, setMyRessourcesError] = useState<string | null>(null);
  const [likedRessourcesError, setLikedRessourcesError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }

    const fetchResources = async () => {
      try {
        const ressourcesResponse = await axios.get(getApiUrl(`/users/${userId}/ressources`), {
          headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setMyResources(ressourcesResponse.data);
      } catch (err: any) {
        setMyRessourcesError(err.message || 'Erreur lors de la récupération des ressources');
      }
    };

    const fetchLikedRessources = async () => {
      try {
        const likedRessourcesResponse = await axios.get(getApiUrl(`/users/${userId}/saved`), {
          headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setLikedRessources(likedRessourcesResponse.data);
      } catch (err: any) {
        setLikedRessourcesError(err.message || 'Erreur lors de la récupération des ressources');
      }
    };

    const fetchProfile = async () => {
      try {
        const userInfo = await axios.get(getApiUrl(`/users/${userId}`), {
          headers: {
            'Content-Type': 'application/ld+json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setUserInfo(userInfo.data);
      } catch (err: any) {
        setProfileError(err.message || 'Erreur lors de la récupération des ressources');
      }
    };

    if (userId && token) {
      fetchResources();
      fetchProfile();
      fetchLikedRessources();
    }
  }, [userId, token, isAuthenticated, isLoading, navigate]);

  if (isLoading) return <><NavBar /><LoadingScreen /></>;
  if (!myResources || !userInfo || !likedRessources) return <><NavBar /><LoadingScreen /></>;

  const showMyRessources = () => {
    setIsMyRessourcesVisible(true);
  };

  const showLikedRessources = () => {
    setIsMyRessourcesVisible(false);
  };

  return (
    <div className="profileMainDiv">
      <NavBar />
      <div className="profileMainContainer">
        {profileError ? profileError :
          <ProfileInfo
            pseudo={userInfo.pseudo}
            ressourcesNumber={myResources.length}
            likesNumber={likedRessources.length}
          />
        }
        <div className="profileRessourcesSelector">
          <span className={isMyRessourcesVisible ? 'selected' : ''} onClick={showMyRessources}>{t(`profile.myRessources`)}</span>
          <span className={!isMyRessourcesVisible ? 'selected' : ''} onClick={showLikedRessources}>{t(`profile.likedRessources`)}</span>
        </div>

        <div className={!isMyRessourcesVisible ? 'hideProfileRessources' : 'profileMyRessources'}>
          {myRessourcesError ? myRessourcesError :
            myResources.map(ressource => (
              <RessourcePresentation key={ressource.id} ressource={ressource} />
            ))
          }
        </div>

        <div className={isMyRessourcesVisible ? 'hideProfileRessources' : 'profileLikedRessources'}>
          {likedRessourcesError ? likedRessourcesError :
            likedRessources.map(ressource => (
              <RessourcePresentation key={ressource.id} ressource={ressource} />
            ))
          }
        </div>
      </div>
      <Footer/>
    </div>
  );
}
