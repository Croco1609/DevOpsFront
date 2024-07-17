import "./ProfileInfo.css";
import { useTranslation } from 'react-i18next';



export default function ProfileInfo(props : any) {
    const { t } = useTranslation();
    console.log(props)
  return (
    <div className="ProfileInfo">
    <div className="ProfileStat">
     <div className="ProfilePicture" style={{ backgroundImage: 'url(/img/profile.jpg)' }}></div>
     <div className="ProfileName">
        <h4 className="Name">{props.pseudo}</h4>
        <p>{props.ressourcesNumber} {t('general.ressources')} - {props.likesNumber} {t('general.likes')}</p>
     </div>
     </div>

     <a className="UpdateProfile" href="update-profile">{t('profile.update')}</a>
        
    </div>
  );

}