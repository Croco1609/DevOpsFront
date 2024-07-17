import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./BackOfficeWaitinRessourcesComponent.css"


export default function BackOfficeWaitinRessourcesComponent(props: any) {
    const { t } = useTranslation();
    const navigate = useNavigate()
        return (<>
        <h2 className="backOfficeTitle">{t("backOffice.waitingRessources")}</h2>

        <p>{props.ressourcesNumber} {t("backOfficeHome.ressourceToValidate")}</p>
        </>)

}