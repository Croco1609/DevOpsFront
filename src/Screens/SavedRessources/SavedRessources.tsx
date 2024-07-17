import React from 'react'
import NavBar from '../../Components/NavBar/NavBar';
import RessourcePresentation from '../../Components/RessourcePresentation/RessourcePresentation';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import "./SavedRessources.css"
import getApiUrl from '../../Services/getApiUrl';
import Footer from '../../Components/Footer/Footer';

type Resource = {
  id: number;
  title: string;
  ressourceType: {
    name: string;
  };
  category: {
    title: string;
  };
  image: string;
  views: string;
  likes: string;
  date: string;
  relationshipType: [
    {
      title: string;
    }
  ];
};
  
  export default function SavedRessources() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading, userId, token } = useAuth();
    const [myRessourcesError, setMyRessourcesError] = useState<string | null>(null);
    const [myResources, setMyResources] = useState<Resource[] | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
      
        const fetchResources = async () => {
          try {
            const ressourcesResponse = await axios.get(getApiUrl(`/users/${userId}/saved`), {
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
        if (userId && token) {
            fetchResources();
          }
        }, [userId, token, isAuthenticated, isLoading, navigate]);
        
        
    if (!myResources  || isLoading) return <><NavBar/><LoadingScreen/></> ;

    console.log(myResources)
    return (
    <>
    <NavBar/>
    <div className="savedRessourcesMainContainer">
        <h2>{t('savedRessources.title')}</h2>

        <div className="myRessource">
    {myRessourcesError ? myRessourcesError :
        myResources.map(function(ressource) {
                        return  <RessourcePresentation
                        ressource={ressource}
                      />
                  })
        }
    </div>
    </div>
    <Footer/>
    </>
)
  }