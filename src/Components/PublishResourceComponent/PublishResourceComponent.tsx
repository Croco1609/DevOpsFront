import "./PublishResourceComponent.css";
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import getApiUrl from '../../Services/getApiUrl';
import Select, { MultiValue } from 'react-select';
import { BsTrash } from 'react-icons/bs';
import React from 'react';

interface OptionType {
    label: string;
    value: number;
}

export default function PublishResourceComponent() {
    const { t } = useTranslation();
    const { isAuthenticated, token } = useAuth();

    const [categories, setCategories] = useState<Array<{ id: number; title: string }>>([]);
    const [resourceTypes, setResourceTypes] = useState<Array<{ id: number; name: string }>>([]);
    const [relationTypes, setRelationTypes] = useState<Array<{ id: number; title: string }>>([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [error, setError] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [resourceTypeId, setResourceTypeId] = useState('');
    const [relationshipTypeIds, setRelationshipTypeIds] = useState<readonly OptionType[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!title || !description || !categoryId || !resourceTypeId || relationshipTypeIds.length === 0) {
            setError("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("isPrivate", isPrivate.toString());
            formData.append("categoryId", categoryId);
            formData.append("ressourceTypeId", resourceTypeId);
            relationshipTypeIds.forEach(id => {
                formData.append("relationshipTypeIds[]", id.value.toString());
            });

            if (file) {
                formData.append("file", file);
            }

            const response = await axios.post(
                getApiUrl("/ressources"),
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Ressource créée avec succès :", response.data);
            setSuccessMessage("La ressource a été créée avec succès !");
            setError('');

            setTitle('');
            setDescription('');
            setCategoryId('');
            setResourceTypeId('');
            setRelationshipTypeIds([]);
            setFile(null);
            setFileName('');
            setIsPrivate(false);

        } catch (error) {
            console.error("Erreur lors de la création de la ressource :", error);
            setError("Erreur lors de la création de la ressource.");
            setSuccessMessage('');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, resourceTypesResponse, relationTypesResponse] = await Promise.all([
                    axios.get(getApiUrl('/categories')),
                    axios.get(getApiUrl('/ressource_types')),
                    axios.get(getApiUrl('/relationship_types'))
                ]);

                setCategories(categoriesResponse.data['hydra:member']);
                setResourceTypes(resourceTypesResponse.data['hydra:member']);
                setRelationTypes(relationTypesResponse.data['hydra:member']);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer1 = setTimeout(() => {
                setFadeOut(true);
            }, 4000);

            const timer2 = setTimeout(() => {
                setSuccessMessage('');
                setFadeOut(false);
            }, 5000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [successMessage]);

    if (!isAuthenticated) {
        return (
            <div className="mainContainer">
                <div className="publishResource">
                    <div className="errorMessage">
                        {t('publishResource.pleaseLogin')}
                    </div>
                </div>
            </div>
        );
    }

    if (!categories.length || !resourceTypes.length || !relationTypes.length) {
        return <LoadingScreen />;
    }

    return (
        <div className="mainContainer">
            <div className="publishResource">
                <h2>{t('publishResource.createResource')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="title">{t('publishResource.title')}:</label>
                        <input type="text" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="description">{t('publishResource.description')}:</label>
                        <textarea id="description" name="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="categoryTypeRelation">
                        <div className="formGroup">
                            <label htmlFor="category">{t('publishResource.category')}</label>
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: '#9fe2ed',
                                        fontFamily: 'Roboto',
                                        borderColor: state.isFocused ? 'grey' : '#22eaf3',
                                    }),

                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                    }),

                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: '#9fe2ed',
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                        '&:hover': {
                                            backgroundColor: '#c8eff6',
                                        },
                                    }),
                                }}
                                id="category"
                                name="category"
                                classNamePrefix="custom-select"
                                className="custom-select-container"
                                options={categories.map((cat) => ({ label: t("categories." + cat.title), value: cat.id.toString() }))}
                                value={categoryId ? { label: t("categories." + categories.find(cat => cat.id === parseInt(categoryId))?.title), value: categoryId } : null}
                                onChange={(selectedOption) => setCategoryId(selectedOption ? selectedOption.value : '')}
                                placeholder={t('publishResource.chooseCategory')}
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="resourceType">{t('publishResource.resourceType')}</label>
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: '#9fe2ed',
                                        fontFamily: 'Roboto',
                                        borderColor: state.isFocused ? 'grey' : '#22eaf3',
                                    }),

                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                    }),

                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: '#9fe2ed',
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                        '&:hover': {
                                            backgroundColor: '#c8eff6', 
                                        },
                                    }),
                                }}
                                id="resourceType"
                                name="resourceType"
                                classNamePrefix="custom-select"
                                className="custom-select-container"
                                options={resourceTypes.map((rt) => ({ label: t("resourceTypes." + rt.name), value: rt.id.toString() }))}
                                value={resourceTypeId ? { label: t("resourceTypes." + resourceTypes.find(rt => rt.id === parseInt(resourceTypeId))?.name), value: resourceTypeId } : null}
                                onChange={(selectedOption) => setResourceTypeId(selectedOption ? selectedOption.value : '')}
                                placeholder={t('publishResource.chooseResourceType')}
                            />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="relationType">{t('publishResource.relationType')}</label>
                            <Select
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        backgroundColor: '#9fe2ed',
                                        fontFamily: 'Roboto',
                                        borderColor: state.isFocused ? 'grey' : '#22eaf3',
                                    }),

                                    singleValue: (baseStyles) => ({
                                        ...baseStyles,
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                    }),

                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: '#9fe2ed',
                                        color: 'black',
                                        fontFamily: 'Roboto',
                                        '&:hover': {
                                            backgroundColor: '#c8eff6',
                                        },
                                    }),
                                }}
                                id="relationType"
                                name="relationType"
                                classNamePrefix="custom-select"
                                className="custom-select-container"
                                options={relationTypes.map((rt) => ({ label: t("relationTypes." + rt.title), value: rt.id }))}
                                isMulti
                                value={relationshipTypeIds}
                                onChange={(selectedOptions) => setRelationshipTypeIds(selectedOptions as MultiValue<OptionType>)}
                                placeholder={t('publishResource.chooseRelationType')}
                            />
                        </div>
                    </div>

                    <div className="formGroup toggle-container">
                        <label htmlFor="isPrivate" className="toggle-label">{t("publishResource.private")}</label>
                        <label className="toggle">
                            <input
                                className="privateInput"
                                type="checkbox"
                                id="isPrivate"
                                name="isPrivate"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            <span className="slider-toggle"></span>
                        </label>
                    </div>

                    <div className="formGroup uploadImage">
                        <label htmlFor="image">{t('publishResource.file')}:</label>
                        <input type="file" id="image" name="image" accept="image/*,video/*,application/pdf" onChange={handleImageChange} />
                        {fileName && (
                            <div className="fileInfo">
                                <span className="fileName">{fileName}</span>
                                <button type="button" className="removeFileButton" onClick={handleRemoveFile}><BsTrash /></button>
                            </div>
                        )}
                    </div>
                    {error && <p className="error">{error}</p>}
                    {successMessage && (
                        <p className={`success ${fadeOut ? 'fade-out' : ''}`}>{successMessage}</p>
                    )}
                    <div className="formActions buttons">
                        <button type="submit">{t('publishResource.submit')}</button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}
