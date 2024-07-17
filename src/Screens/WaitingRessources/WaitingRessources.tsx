import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackOfficeWaitinRessourcesComponent from '../../Components/BackOfficeWaitinRessourcesComponent/BackOfficeWaitinRessourcesComponent'
import "./WaitingRessources.css"
import RessourcePresentation from "../../Components/RessourcePresentation/RessourcePresentation"
import axios from "axios";
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import getApiUrl from '../../Services/getApiUrl';


type Resource = {
    id: number;
    title: string;
    type: string;
    category: string[];
    image: string;
    views: string;
    likes: string;
    date: string;
  };

export default function WaitingRessources() {
    const { isAuthenticated,role, isLoading, token } = useAuth();
    const navigate = useNavigate();
    const[ressources, setRessouces] = useState<Resource[] | null>(null);
    const[errorRessources, setErrorRessouces] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes( "ROLE_ADMIN"))) {
            navigate('/');
        }

        const fetchResources = async () => {
            try {
              const ressourcesResponse = await axios.get(getApiUrl(`/pending_ressources`), {
                headers: {
                  'Content-Type': 'application/ld+json',
                  'Authorization': `Bearer ${token}`,
                },
              });
              setRessouces(ressourcesResponse.data); 
            } catch (err: any) {
                setErrorRessouces(err.message || 'Erreur lors de la récupération des ressources');
            }
          };

          if(!isLoading)
            {
                fetchResources();
            }
          
      }, [isAuthenticated, isLoading, navigate]);
    
      if (isLoading || !ressources) {
          return <><LoadingScreen/></>;
      }

      console.log(ressources)

      
    return (
        <>
        <BackOfficeNavMenu/>   
        <div className='BackOfficeWaitinRessourcesContainer'>
           

            <div className='displayRessources'>
            <BackOfficeWaitinRessourcesComponent
                ressourcesNumber = {ressources.length}
            />
            {ressources.map(function(ressource) {
                        return  <RessourcePresentation
                        ressource={ressource}
                      />
                  })
        }
        </div>
        </div>
        </>
    )
}