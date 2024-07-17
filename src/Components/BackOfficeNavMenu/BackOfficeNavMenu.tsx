import { NavLink } from 'react-router-dom';
import './BackOfficeNavMenu.css'
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';
import LogoutButton from '../Buttons/LogoutButton/LogoutButton';
import { LOADIPHLPAPI } from 'dns';
import { convertTypeAcquisitionFromJson } from 'typescript';

export default function BackOfficeNavMenu() {
  const { t, i18n } = useTranslation();
  const pathName = window.location.pathname;
  const currentLanguage = i18n.language;


  const changeLanguage = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };
  return (
    <header className="backOfficeHeader">

      <nav className='backOfficeNav'>
        <div className='BackOfficeLogo'>
          <NavLink className={'logo'} to='/'>
            <img alt="log de ressource relationelles" src='/img/appLogo.png' />
          </NavLink>
          <h3 className="pannelAdmin">{t("backOffice.admin")}</h3>

        </div>

        <div className='backOfficeSubNav'>
          <NavLink className={pathName === "/backoffice" ? "selected" : ""} to="/backoffice"><span className='linkMenuPanelAdmin'>{t("backOffice.admin")}</span></NavLink>
          <NavLink className={pathName === "/backoffice/waitingRessources" ? "selected" : ""} to="/backoffice/waitingRessources"><span className='linkMenuPanelAdmin'>{t("backOffice.waitingRessources")}</span></NavLink>
          <NavLink className={pathName === "/backoffice/reports" ? "selected" : ""} to="/backoffice/reports"><span className='linkMenuPanelAdmin'>{t("backOffice.reports")}</span></NavLink>
          <NavLink className={pathName === "/backoffice/categories" ? "selected" : ""} to="/backoffice/categories"><span className='linkMenuPanelAdmin'>{t("backOffice.categories")}</span></NavLink>
          <NavLink className={pathName === "/backoffice/stats" ? "selected" : ""} to="/backoffice/stats"><span className='linkMenuPanelAdmin'>{t("backOffice.statsTitle")}</span></NavLink>
        </div>

        <div>
          <label htmlFor="langSelector">{t('nav.langSelector')}</label>
          <select id="langSelector" value={currentLanguage} onChange={changeLanguage}>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
          <LogoutButton />
        </div>
      </nav>

    </header>
  )
}