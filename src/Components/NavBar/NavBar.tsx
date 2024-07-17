import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare, BsSearch, BsUniversalAccess, BsFillPersonFill, BsChevronRight } from "react-icons/bs";
import LogoutButton from '../Buttons/LogoutButton/LogoutButton';
import useAuth from '../../hooks/useAuth';
import HomeTour from '../../Tour/HomeTour';
import DarkModeButton from '../../Components/DarkModeButton/DarkModeButton';

interface ModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Bienvenue sur (Re)sources relationnelles !</h2>
        <p>Voulez-vous suivre un tutoriel pour vous guider à travers le site ?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}><span>Oui</span></button>
          <button onClick={onCancel}><span>Non</span></button>
        </div>
      </div>
    </div>
  );
};

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, role } = useAuth();
  const [estOuvert, setEstOuvert] = useState(false);
  const [isAccountDropDownVisible, setisAccountDropDownVisible] = useState(false);
  const [isAccessibilityDropDownVisible, setisAccessibilityDropDownVisible] = useState(false);
  const [isMobileAccountDropDownVisible, setIsMobileAccountDropDownVisible] = useState(false);
  const [isMobileAccessibilityDropDownVisible, setIsMobileAccessibilityDropDownVisible] = useState(false);
  const currentLanguage = i18n.language;

  const [showTour, setShowTour] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const accessibilityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tourSeen = localStorage.getItem('HomeTourSeen');
    if (!tourSeen) {
      setShowModal(true); 
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setisAccountDropDownVisible(false);
        setIsMobileAccountDropDownVisible(false);
      }
      if (accessibilityDropdownRef.current && !accessibilityDropdownRef.current.contains(event.target as Node)) {
        setisAccessibilityDropDownVisible(false);
        setIsMobileAccessibilityDropDownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTourFinish = () => {
    localStorage.setItem('HomeTourSeen', 'true');
    setShowTour(false);
  };

  const handleConfirm = () => {
    setShowTour(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    localStorage.setItem('HomeTourSeen', 'true');
    setShowModal(false);
  };

  const changeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleMouseEnterAccount = () => {
    setisAccountDropDownVisible(true);
  };

  const handleMouseLeaveAccount = () => {
    setisAccountDropDownVisible(false);
  };

  const handleMouseEnterAccessibility = () => {
    setisAccessibilityDropDownVisible(true);
  };

  const handleMouseLeaveAccessibility = () => {
    setisAccessibilityDropDownVisible(false);
  };

  const toggleMenu = () => {
    setEstOuvert(!estOuvert);
  };

  const toggleMobileAccountDropDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileAccountDropDownVisible(!isMobileAccountDropDownVisible);
  };

  const toggleMobileAccessibilityDropDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileAccessibilityDropDownVisible(!isMobileAccessibilityDropDownVisible);
  };

  const classMenuMobile = `subMenuMobile ${estOuvert ? 'menuShow' : 'menuHide'}`;

  return (
    <>
      <header>
        <nav className="mainNavDesktop">
          <NavLink className='logo step1' to='/'>
            <img alt="logo de ressource relationnelles" src='/img/appLogo.png' />
          </NavLink>

          <div className="mainNavMenu">
            <NavLink className={'navLink step2'} to='/resources'>
              <BsSearch /> {t('nav.search')}
            </NavLink>
            <NavLink className={'navLink step3'} to='/exchangeSpace'>
              <BsPlusSquare /> {t('nav.addRessource')}
            </NavLink>
            <div className="accessibility-dropdown navLink step4" onMouseEnter={handleMouseEnterAccessibility} onClick={handleMouseEnterAccessibility} onMouseLeave={handleMouseLeaveAccessibility}>
              <BsUniversalAccess /> {t('nav.accessibility')}
              {isAccessibilityDropDownVisible && (
                <div className="dropdown" ref={accessibilityDropdownRef}>
                  <div className='langueWithDarkMode'>
                    <select id="langSelector" value={currentLanguage} onChange={changeLanguage}>
                      <option value="en">{t('nav.en')}</option>
                      <option value="fr">{t('nav.fr')}</option>
                      <option value="de">{t('nav.de')}</option>
                    </select>
                    <DarkModeButton />
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="account-dropdown navLink step5" onMouseEnter={handleMouseEnterAccount} onClick={handleMouseEnterAccount} onMouseLeave={handleMouseLeaveAccount}>
                <BsFillPersonFill /> {t('nav.myAccount')}
                {isAccountDropDownVisible && (
                  <div className="dropdown" ref={accountDropdownRef}>
                    <NavLink to="/my-profile" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>{t('nav.myProfile')}</NavLink>
                    <NavLink to="/my-saved-resources">{t('nav.mySavedResources')}</NavLink>
                    {role.includes("ROLE_ADMIN") ? <NavLink to="/backoffice">{t('nav.admin')}</NavLink> : ""}
                    <LogoutButton />
                  </div>
                )}
              </div>
            ) : (
              <NavLink className={'navLink'} to='/login'>
                <BsFillPersonFill /> {t('nav.login')}
              </NavLink>
            )}
          </div>
        </nav>
        <nav className="subNavDesktop">
          <NavLink className={'navLink'} to='/resources'>
            {t('nav.lastRessources')}
          </NavLink>
          <NavLink className={'navLink'} to='/category'>
            {t('nav.categories')}
          </NavLink>
          <NavLink className={'navLink'} to='/about'>
            {t('nav.about')}
          </NavLink>
          <NavLink className={'navLink'} to='/faq'>
            {t('nav.faq')}
          </NavLink>
        </nav>

        <div className="navMobile">
          <nav className={estOuvert ? 'mainNavMobile show' : 'mainNavMobile'}>
            <NavLink className={'logo'} to='/'>
              <img alt="logo de ressource relationnelles" src='/img/appLogo.png' />
            </NavLink>
            <div className="mainNavMenu">
              <NavLink className={'navLink'} to='/resources'>
                <BsSearch />
              </NavLink>
              <NavLink className={'navLink'} to='/exchangeSpace'>
                <BsPlusSquare />
              </NavLink>
              <div className="navLink" onClick={toggleMobileAccessibilityDropDown} ref={accessibilityDropdownRef}>
                <BsUniversalAccess />
                {isMobileAccessibilityDropDownVisible && (
                  <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className='langueWithDarkMode'>
                      <select id="langSelector" value={currentLanguage} onChange={changeLanguage}>
                      <option value="en">{t('nav.en')}</option>
                      <option value="fr">{t('nav.fr')}</option>
                      <option value="de">{t('nav.de')}</option>
                      </select>
                      <DarkModeButton />
                    </div>
                  </div>
                )}
              </div>
              {isAuthenticated ? (
                <div className="navLink" onClick={toggleMobileAccountDropDown} ref={accountDropdownRef}>
                  <BsFillPersonFill />
                  {isMobileAccountDropDownVisible && (
                    <div className="dropdown" onClick={(e) => e.stopPropagation()}>
                      <NavLink to="/my-profile" style={{ borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}>{t('nav.myProfile')}</NavLink>
                      <NavLink to="/my-saved-resources">{t('nav.mySavedResources')}</NavLink>
                      {role.includes("ROLE_ADMIN") ? <NavLink to="/backOffice">{t('nav.admin')}</NavLink> : ""}
                      <LogoutButton />
                    </div>
                  )}
                </div>
              ) : (
                <NavLink className={'navLink'} to='/login'>
                  <BsFillPersonFill />
                </NavLink>
              )}
            </div>
            <div id="burger" onClick={toggleMenu} className={estOuvert ? 'change' : ''}>
              <div className="barre"></div>
              <div className="barre"></div>
              <div className="barre"></div>
            </div>
          </nav>
        </div>
        <div className={classMenuMobile}>
          <hr />
          <NavLink className={'navLink'} to='/resources'>
            <span>{t('nav.lastRessources')}</span><span><BsChevronRight /></span>
          </NavLink>
          <NavLink className={'navLink'} to='/category'>
            <span>{t('nav.categories')}</span><span><BsChevronRight /></span>
          </NavLink>
          <NavLink className={'navLink'} to='/about'>
            <span>{t('nav.about')}</span><span><BsChevronRight /></span>
          </NavLink>
          <NavLink className={'navLink'} to='/faq'>
            <span>{t('nav.faq')}</span><span><BsChevronRight /></span>
          </NavLink>
        </div>
      </header>
      <Modal show={showModal} onConfirm={handleConfirm} onCancel={handleCancel} />
      {showTour && <HomeTour run={showTour} onFinish={handleTourFinish} />}
    </>
  );
}
