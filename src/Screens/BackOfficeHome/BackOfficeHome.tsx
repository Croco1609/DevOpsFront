import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import BackOfficeHomeComponent from '../../Components/BackOfficeHomeComponent/BackOfficeHomeComponent';
import useAuth from "../../hooks/useAuth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BackOfficeHome.css"

export default function BackOfficeHome() {
    const { isAuthenticated,role, isLoading } = useAuth();
    const navigate = useNavigate();

    console.log(role)
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes( "ROLE_ADMIN"))) {
            navigate('/');
        }
      }, [isAuthenticated, isLoading, navigate]);
    
      if (isLoading) {
          return <div>Loading...</div>;
      }

    return (
        <>
        <BackOfficeNavMenu/>   
        <div className='BackOfficeHomeContainer'>
            <BackOfficeHomeComponent/>
        </div>
        </>
    )
}