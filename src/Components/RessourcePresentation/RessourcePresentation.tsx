import "./RessourcePresentation.css";
import { useTranslation } from 'react-i18next';
import { FaRegEye } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { BiBookmarkHeart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function RessourcePresentation(props: any) {
  

  const { t } = useTranslation();
  let navigate = useNavigate();

  function handleSubmit(event: any) {
    event.preventDefault();
    navigate("/resources/" + props.ressource.id); 
  }

  const extractId = (url: string) => {
    if (typeof url === 'string') {
        const parts = url.split('/');
        return parts[parts.length - 1];
    } else {
        return "Unknown";
    }
};

  const resource = props.ressource;

  const title = resource.title || "Untitled";
  const category = resource.category.title ? (resource.category.title) : "Unknown";
  const type = resource.ressourceType.name ? (resource.ressourceType.name) : "Unknown";
  const likesLength = resource.likes ? resource.likes.length : 0;
  const publishDate = resource.createdAt ? new Date(resource.createdAt) : new Date();
  const viewsCount = resource.viewsCount ? resource.viewsCount : 0;

  return (
    <div className="RessourcePresentation" onClick={handleSubmit}>
      <div className="presentationImage" style={{ backgroundImage: `url(/img/`+category+`.jpg)` }}></div>
      <div className="presentationInfo">
        <p className="presentationName"><span className="type">{t(`resourceTypes.${type }`)}</span> {title}</p>
        <div className="presentationCategories">
          <span className={`color${category}`}>{t(`categories.${category}`)}</span>
        </div>
        <hr></hr>
        <div className="presentationStat">
          <span className="viewCount"><FaRegEye />  {viewsCount}</span>
          <span className="likeCount"><BiBookmarkHeart />  {likesLength}</span>
          <span className="publishDate"><CiCalendar />  {publishDate.toLocaleDateString("fr-FR")}</span>
        </div>
      </div>
    </div>
  );
}
