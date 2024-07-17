import BackOfficeNavMenu from '../../Components/BackOfficeNavMenu/BackOfficeNavMenu';
import BackOfficeCategoriesComponent from '../../Components/BackOfficeCategories/BackOfficeCategoriesComponent';
import useAuth from "../../hooks/useAuth";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BackOfficeCategories.css"

export default function BackOfficeCategories() {
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
            <div className='BackOfficeCAtegoriesContainer'>
                <BackOfficeCategoriesComponent />
            </div>
        </div>
    )
}