import { NavLink } from 'react-router-dom';
import './NotFound.css'
import { useTranslation } from 'react-i18next';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';

export default function NotFound() {

    const { t } = useTranslation();
    return(
        <>
        <NavBar/>
        <div className="notFoundContainer">
        <img className="notFoundImg"src="/img/404.png" alt="404 not found"/>
        <h3>{t('notFound.text')}</h3>
        <NavLink to="/">{t('notFound.button')}</NavLink>
        </div>
        <Footer/>
        </>
    )
}