import NavBar from '../../Components/NavBar/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import './UsersList.css';
import { useState, useEffect, useMemo } from 'react';
import getApiUrl from '../../Services/getApiUrl';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';

type User = {
    firstName : string
}

export default function UserList() {

const { isAuthenticated,role, isLoading, token } = useAuth();
const navigate = useNavigate();
const [allUser, setAllUser] = useState<User[]>([]);
const [currentPage, setCurrentPage] = useState<number>(1);
const [loading, setLoading] = useState<boolean>(false);
const [hasMore, setHasMore] = useState<boolean>(true);

console.log(role)
useEffect(() => {
    if (!isLoading && (!isAuthenticated || role.includes( "ROLE_USER"))) {
        navigate('/');
    }

    const fetchResources = async () => {
        try {
          if (currentPage === 1) {
            setLoading(true);
            const response = await axios.get(getApiUrl(`/users/?page=${currentPage}`),{
                headers: {
                  'Content-Type': 'application/ld+json',
                  'Authorization': `Bearer ${token}`,
                },
              });;
            const newUsers = response.data;
    
            if (newUsers.length < 5) {
              setHasMore(false);
            }
            setAllUser(newUsers);
            setLoading(false);
          } else {
            const response = await axios.get(getApiUrl(`/users?page=${currentPage}`),{
                headers: {
                  'Content-Type': 'application/ld+json',
                  'Authorization': `Bearer ${token}`,
                },
              });
            const newResources = response.data;
            
            if (newResources.length < 5) {
              setHasMore(false);
            }
            setAllUser(prevUsers => [...prevUsers, ...newResources]);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des ressources", error);
        }
      };

      const handleScroll = () => {
        if (hasMore && window.innerHeight + window.scrollY >= document.body.scrollHeight) {
          if (!loading) {
            setLoading(true);
            setCurrentPage(prevPage => prevPage + 1);
          }
        }
      };
  
      if(!isLoading && token)
        {
        fetchResources();
        }

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    
     
      
  }, [isAuthenticated, isLoading, navigate]);

  

  if (isLoading) {
      return <><NavBar></NavBar><LoadingScreen></LoadingScreen></>;
  }

  console.log(allUser)
  return (
    <>Users</>
  )

  
}    
