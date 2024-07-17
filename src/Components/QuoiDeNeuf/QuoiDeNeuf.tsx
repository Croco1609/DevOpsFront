import { Link, useNavigate } from "react-router-dom";
import "./QuoiDeNeuf.css";
import { GoArrowRight } from "react-icons/go";
import getApiUrl from '../../Services/getApiUrl';
import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import { FaRegEye } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import { BiBookmarkHeart } from "react-icons/bi";
import { BsEye } from "react-icons/bs";

type Resource = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  viewsCount: number;
  likes: any;
  category: any
};


export default function QuoiDeNeuf() {


  const [myResources, setMyResources] = useState<Resource[] | null>(null);
  const [myRessourcesError, setMyRessourcesError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {

      const fetchResources = async () => {
        try {
          const ressourcesResponse = await axios.get(getApiUrl(`/public/ressources?page=1`), {
            headers: {
              'Content-Type': 'application/ld+json',
            },
          })

          setMyResources(ressourcesResponse.data);
        } catch (err: any) {
          setMyRessourcesError(err.message || 'Erreur lors de la récupération des ressources');
        }
      };

      fetchResources()
    }, []);;

    function handleSubmit(event: any, id: string) {
      event.preventDefault();
      navigate("/resources/" + id); 
    }
    
    if (!myResources) return <><LoadingScreen/></> ;
  return (
    <div className="quoiDeNeuf">

      <div className="containerMain">
      <h1>Quoi de neuf?</h1>
        <div className="containerBoxesButton">
          <div className="containerBoxes">
            {myResources.length > 0 && (
              <div className="boxLeft" style={{ backgroundImage: `url(/img/${myResources[0].category.title}.jpg)` }} onClick={(e)=>handleSubmit(e,myResources[0].id.toString())}>
                <div className={"banner color" +myResources[0].category.title} >
                  <h3 className="bannerText">{myResources[0].title}</h3>
                  <p className="bannerStat">
                  <span className="viewCount"><BsEye/> {myResources[0].viewsCount} </span>         
                  <span className="likeCount"><BiBookmarkHeart />  {myResources[0].likes.length}</span>
                  </p>
                </div>
              </div>
            )}

            <div className="boxRight">
              {myResources.slice(1, 5).map((box) => (
                <div key={box.id} className="box" style={{ backgroundImage: `url(/img/${box.category.title}.jpg)` }}  onClick={(e)=>handleSubmit(e,box.id.toString())}>
                  <div className={"banner color" +box.category.title} >
                  <h3 className="bannerText">{box.title}</h3>
                  <p className="bannerStat">
                  <span className="viewCount"><BsEye/> {myResources[0].viewsCount} </span>         
                  <span className="likeCount"><BiBookmarkHeart />  {myResources[0].likes.length}</span>
                  </p>
                </div>
                </div>
              ))}
            </div>
          </div>
          <button className="button">
          <Link to="/resources" className="link">
            <span>
              Voir plus <span className="icon"><GoArrowRight /></span>
            </span>
          </Link>
          </button>
        </div>
        
      </div>
    </div>
  );
}
