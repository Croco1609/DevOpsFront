import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';

import './ResourcesDetails.css';
import NavBar from '../../Components/NavBar/NavBar';
import { FaRegEye } from 'react-icons/fa';
import { FaRegFaceLaugh } from "react-icons/fa6";
import { BiBookmarkHeart, BiFontSize } from 'react-icons/bi';
import { CiCalendar } from 'react-icons/ci';
import { useTranslation } from 'react-i18next';
import getApiUrl from '../../Services/getApiUrl';
import axios from "axios";

import moment from 'moment';
import 'moment/locale/fr';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import CommentarySpace from '../../Components/CommentarySpace/CommentarySpace';
import Category from '../Category/Category';
import Resources from '../Resources/Resources';
import Footer from '../../Components/Footer/Footer';

type Resource = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    viewsCount: number;
    likes: { userId: string }[];
    isPrivate: boolean;
    user: any;
    image: string;
    comments: {
        author:{
          pseudo: string;
        } ;
        id: string;
        parentId: string | null;
        content: string;
    }[];
    saved: { userId: string }[];
    status: string;
    category: any;
    ressourceType: any;
    relationshipType
:{  title: string }[];
    file : {
        filePath : string,
        mimeType : string
    }
};

type User = {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    image: string;
    firstname: string;
    lastname: string;
    pseudo: string;
};

export default function ResourcesDetails() {
    const { id } = useParams<{ id: string }>();
    const [resource, setResource] = useState<Resource | null>(null);
    const [resourceError, setResourceError] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const { t } = useTranslation();
    const { token, isLoading, role, userId } = useAuth();
    const navigate = useNavigate();

    const fetchResource = useCallback(async () => {
        try {
            const response = await axios.get(getApiUrl(`/ressource/${id}`), {
                headers: {
                    'Content-Type': 'application/ld+json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setResource(response.data);
            setLiked(response.data.likes.some((like: { userId: string }) => like.userId === userId));
            setSaved(response.data.saved.some((save: { userId: string }) => save.userId === userId));
        } catch (err: any) {
            setResourceError(true);
        }
    }, [id, token, userId]);

    useEffect(() => {
        fetchResource();
    }, [fetchResource, token]);

    const handleSave = useCallback(async () => {
        if (saved) {
            await fetch(getApiUrl(`/ressources/${id}/unsave`), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            await fetch(getApiUrl(`/ressources/${id}/save`), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        fetchResource();
    }, [fetchResource, id, saved, token]);

    const handleLike = useCallback(async () => {
        if (liked) {
            await fetch(getApiUrl(`/ressources/${id}/unlike`), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } else {
            await fetch(getApiUrl(`/ressources/${id}/like`), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }
        fetchResource();
    }, [fetchResource, id, liked, token]);

    const handleClickUpdateStatus = async (status: string) => {
        try {
            await handleUpdateStatus(status);
            fetchResource();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            const response = await axios.patch(
                getApiUrl(`/ressources/${id}/status`),
                { status },
                {
                    headers: {
                        'Content-Type': 'application/ld+json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            console.error("Error updating status:", error);
        }
    };

    const handleDeleteResource = async () => {
        if (window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) {
            try {
                await axios.delete(getApiUrl(`/ressources/${id}`), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Resource deleted successfully.");
                navigate('/resources');
            } catch (error: any) {
                console.error("Error deleting resource:", error);
                setResourceError(true);
            }
        }
    };

    if (!resource) {
        if (resourceError) {
            return (
                <div className="resourcesDetailsMainContainer">
                    <NavBar />
                    <div className="resourcesDetailsContainer">
                        <div className="errorMessage">
                            {t('resourcesDetails.resourceNotFound')}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <NavBar />
                    <LoadingScreen />
                </>
            );
        }
    }

    const renderFile = () => {
        if (resource.file) {
            switch (resource.file.mimeType) {
                case 'image/jpeg':
                case 'image/png':
                case 'image/jpg':
                case 'image/webp':
                case 'image/gif':
                    const imgfilepath = "http://localhost:8000/uploads/files/images/" + resource.file.filePath;
                    const imghtml = <img style={{ width: '50%', margin: '0 25%' }} src={imgfilepath} alt="illustration" />;
                    return imghtml;
                case 'application/pdf':
                    const pdfsfilepath = "http://localhost:8000/uploads/files/pdfs/" + resource.file.filePath;
                    const pdfhtml = <iframe src={pdfsfilepath} width='100%' height='600px' title='PDF Viewer'>Votre navigateur ne supporte pas les iframes.</iframe>;
                    return pdfhtml;
                default:
                    const othersfilepath = "http://localhost:8000/uploads/files/others/" + resource.file.filePath;
                    const othershtml = (
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <a style={{
                                fontWeight: "700",
                                fontSize: "1.2em",
                                fontFamily: "Roboto, sans-serif",
                                backgroundColor: "white",
                                color: "#FFA500",
                                borderRadius: "20px",
                                margin: "0 auto",
                                height: "35px",
                                padding: "0 15px 0 15px",
                                cursor: "pointer",
                                textAlign: "center",
                                border: "black 1px solid",
                            }} target="about:blank" href={othersfilepath} download={othersfilepath}>Télécharger le document</a>
                        </div>
                    );
                    return othershtml;
            }
        }
        return "";
    }

    const defaultUserIcon = <FaRegFaceLaugh />;

    console.log(resource)
    return (
        <>
            <NavBar />
            <div className="resourcesDetailsMainContainer">
                <div className="resourcesDetailsContainer">
                    <div className="resourcesDetailsImage" style={{ backgroundImage: `url(/img/` + resource.category.title + `.jpg)` }}></div>
                    <div className="resourcesDetailsInfo">
                        <div className="headerRessource">
                            <div className='iconeDetails'>
                            <div className="creatorIcon" style={{ backgroundImage: 'url(/img/profile.jpg)' }}></div>
                                <div className="resourcesDetailsMeta">
                                    <div>
                                        <h4>Posté par {resource.user.pseudo}</h4>
                                    </div>
                                    <div className="resourcesDetailsDateViews">
                                        <span className="resourcesDetailsDate">
                                            <CiCalendar />
                                            {moment(resource.createdAt).locale('fr').format('DD MM YYYY')}
                                        </span>
                                        <span className="resourcesDetailsViews">
                                            <FaRegEye />
                                            {resource.viewsCount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {resource.status === "pending" ? (role.includes("ROLE_USER") ? <span>{t('resourcesDetails.pending')}</span> : <>
                                <button onClick={() => handleClickUpdateStatus('approved')}>{t('resourcesDetails.valideButton')}</button>
                                <button onClick={() => handleClickUpdateStatus('rejected')}>{t('resourcesDetails.refuseButton')}</button>
                            </>) : ""}
                            {resource.status === "rejected" ? <span>{t('ressourceDetails.rejected')}</span> : ""}

                            {token ? <button className="saveButton" onClick={handleSave}>{saved ? t('resourcesDetails.unsaveButton') : t('resourcesDetails.saveButton')}</button> : ""}
                        </div>
                        <div>
                            <div className="ressourceDetailsTitleLikes">
                                <h1 className="resourcesDetailsName">{resource.title}</h1>
                                <span className={`resourcesDetailsLikes ${liked ? 'liked' : 'unliked'}`} onClick={handleLike}>
                                    <BiBookmarkHeart />
                                    {resource.likes ? resource.likes.length : 0}
                                </span>
                            </div>
                            <p>{t("categories." + resource.category.title)}</p>
                            <p>{t("resourceTypes." + resource.ressourceType.name)}</p>
                            {resource.relationshipType.map(r => (
                                    <p>{t(`relationTypes.${r.title}`)}</p>
                                        ))}

                            {renderFile()}

                            <p className="resourcesDetailsDescription">{resource.description}</p>
                        </div>
                    </div>
                    {token && userId === resource.user.id && (
                        <div className="deleteResourceContainer">
                            <button className="deleteButton" onClick={handleDeleteResource}>{t('resourcesDetails.deleteButton')}</button>
                        </div>
                    )}
                </div>
                <CommentarySpace
                    comments={resource.comments}
                    ressourceId={resource.id.toString()}
                    userId={resource.user.id}
                />
            </div>
            <Footer></Footer>
        </>
    );
}
