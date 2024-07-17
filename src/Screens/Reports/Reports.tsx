import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import useAuth from "../../hooks/useAuth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Reports.css"



export default function Reports() {
    const { isAuthenticated,role, isLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes( "ROLE_ADMIN"))) {
            navigate('/');
        }
      }, [isAuthenticated, isLoading, navigate]);
    
      if (isLoading) {
          return <div>Loading...</div>;
      }

      return(<>
            <BackOfficeNavMenu/>
            <div className="reportsContainer"> 
            Reports
            
            </div>    
      </>)
}