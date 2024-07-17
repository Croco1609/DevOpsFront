import { NavLink } from "react-router-dom";
import "./homeBanner.css";

import { useTranslation } from 'react-i18next';

export default function HomeBanner() {
    const { t } = useTranslation();
  return (
    <div className="homeBanner">
      <h1> {t('homeBanner.title')}</h1>
      <div className="addRessourcesBanner">
        <p className="textAddRessourcesBanner">{t('homeBanner.addRessoures')}</p>
        <NavLink className="callToActionNewRessources" to={"/exchangeSpace"}>{t("nav.addRessource")}</NavLink>
        <span className="circleDecoration topLeft"><span><span></span></span></span>
        <span className="circleDecoration bottomRigth"><span><span></span></span></span>
        <span className="circleDecoration midleBottomLeft"><span><span></span></span></span>
        <span className="circleDecoration midleTopRigth"><span><span></span></span></span>
     </div>
    </div>
  );

}