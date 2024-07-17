import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import BackOfficeStatsComponent from '../../Components/BackOfficeStats/BackOfficeStatsComponent';
import useAuth from "../../hooks/useAuth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BackOfficeStats.css"

export default function BackOfficeStats() {
    const { isAuthenticated, role, isLoading } = useAuth();
    const navigate = useNavigate();

    console.log(role)
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !role.includes("ROLE_ADMIN"))) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <BackOfficeNavMenu />
            <div className='backOfficeStatsContainer'>
                <BackOfficeStatsComponent />
            </div>
        </div>
    )
}