import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import './BackOfficeStatsComponent.css';

interface Category {
    id: number;
    title: string;
}

interface ResourceType {
    id: number;
    name: string;
}

interface RelationshipType {
    id: number;
    title: string;
}

interface Statistics {
    relationship?: {
        category: string;
        count: number;
    };
    resourceType?: {
        ressourceType: string;
        count: number;
    };
    category?: {
        category: string;
        count: number;
    };
}

interface statMostViewedRessource {
    title: string;
    viewsCount: number;
}

interface statMostCommentedRessource {
    title: string;
    commentsCount: number;
}

interface statMostSharedRessource {
    title: string;
    sharedCount: number;
}

interface statMostLikedRessource {
    title: string;
    likesCount: number;
}

export default function BackOfficeStatsComponent() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
    const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedResourceType, setSelectedResourceType] = useState<string>('');
    const [selectedRelationshipType, setSelectedRelationshipType] = useState<string>('');
    const { t } = useTranslation();
    const { isAuthenticated, role, isLoading, token } = useAuth();
    const [statistics, setStatistics] = useState<Statistics>({});

    const [ressourceMostViewed, setressourceMostViewed] = useState<statMostViewedRessource[]>([]);
    const [ressourceMostCommented, setressourceMostCommented] = useState<statMostCommentedRessource[]>([]);
    const [ressourceMostShared, setressourceMostShared] = useState<statMostSharedRessource[]>([]);
    const [ressourceMostLiked, setressourceMostLiked] = useState<statMostLikedRessource[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchCategories = async () => {
                    const response = await fetch(getApiUrl("/categories"));
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setCategories(data['hydra:member']);
                };

                const fetchResourceTypes = async () => {
                    const response = await fetch(getApiUrl("/ressource_types"));
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setResourceTypes(data['hydra:member']);
                };

                const fetchRelationshipTypes = async () => {
                    const response = await fetch(getApiUrl("/relationship_types"));
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setRelationshipTypes(data['hydra:member']);
                };

                const fetchCountUsers = async () => {
                    const response = await fetch(getApiUrl("/total-users"), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setTotalUsers(data.totalUsers);
                };

                const fetchRessourceMostViewed = async () => {
                    const response = await fetch(getApiUrl("/resources/most/viewsCount"), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setressourceMostViewed(data);
                };

                const fetchRessourceMostCommented = async () => {
                    const response = await fetch(getApiUrl("/resources/most/commentsCount"), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setressourceMostCommented(data);
                };

                const fetchRessourceMostShared = async () => {
                    const response = await fetch(getApiUrl("/resources/most/sharedCount"), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setressourceMostShared(data);
                };

                const fetchRessourceMostLiked = async () => {
                    const response = await fetch(getApiUrl("/resources/most/likesCount"), {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) throw new Error("Network response was not ok");
                    const data = await response.json();
                    setressourceMostLiked(data);
                };

                await Promise.all([
                    fetchRessourceMostViewed(),
                    fetchRessourceMostCommented(),
                    fetchRessourceMostShared(),
                    fetchRessourceMostLiked(),
                    fetchCategories(),
                    fetchResourceTypes(),
                    fetchRelationshipTypes(),
                    fetchCountUsers()
                ]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [relationshipStats, resourceTypeStats, categoryStats] = await Promise.all([
                    fetchStatistics(`total-relationship-resources/${selectedRelationshipType}`),
                    fetchStatistics(`total-resources/${selectedResourceType}`),
                    fetchStatistics(`total-ressources/${selectedCategory}`)
                ]);

                setStatistics({
                    relationship: relationshipStats.data,
                    resourceType: resourceTypeStats.data,
                    category: categoryStats.data
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchData();
    }, [selectedCategory, selectedResourceType, selectedRelationshipType, token]);

    async function fetchStatistics(endpoint: string) {
        try {
            const response = await axios.get(getApiUrl(`/${endpoint}`), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            return response;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    const handleCategoryChange = async (categoryTitle: string) => {
        setSelectedCategory(categoryTitle);
        try {
            const categoryStats = await fetchStatistics(`total-ressources/${categoryTitle}`);
            setStatistics((prevStats) => ({
                ...prevStats,
                category: categoryStats.data
            }));
        } catch (error) {
            console.error('Error fetching category statistics:', error);
        }
    };

    const handleResourceTypeChange = async (resourceTypeName: string) => {
        setSelectedResourceType(resourceTypeName);
        try {
            const resourceTypeStats = await fetchStatistics(`total-resources/${resourceTypeName}`);
            setStatistics((prevStats) => ({
                ...prevStats,
                resourceType: resourceTypeStats.data
            }));
        } catch (error) {
            console.error('Error fetching resource type statistics:', error);
        }
    };

    const handleRelationshipTypeChange = async (relationshipTypeTitle: string) => {
        setSelectedRelationshipType(relationshipTypeTitle);
        try {
            const relationshipStats = await fetchStatistics(`total-relationship-resources/${relationshipTypeTitle}`);
            setStatistics((prevStats) => ({
                ...prevStats,
                relationship: relationshipStats.data
            }));
        } catch (error) {
            console.error('Error fetching relationship type statistics:', error);
        }
    };

    const exportToCSV = () => {
        const csvRows = [];


        csvRows.push(['Total Users:', totalUsers]);
        csvRows.push(['']);

        if (statistics.category) {
            csvRows.push(['Category Statistics']);
            csvRows.push(['Category', 'Count']);
            csvRows.push([statistics.category.category, statistics.category.count]);
            csvRows.push(['']);
        }

        if (statistics.resourceType) {
            csvRows.push(['Resource Type Statistics']);
            csvRows.push(['Resource Type', 'Count']);
            csvRows.push([statistics.resourceType.ressourceType, statistics.resourceType.count]);
            csvRows.push(['']);
        }

        if (statistics.relationship) {
            csvRows.push(['Relationship Type Statistics']);
            csvRows.push(['Relationship Type', 'Count']);
            csvRows.push([statistics.relationship.category, statistics.relationship.count]);
            csvRows.push(['']);
        }

        csvRows.push(['Most Viewed Resources']);
        csvRows.push(['Title', 'Views Count']);
        ressourceMostViewed.forEach(resource => {
            csvRows.push([resource.title, resource.viewsCount]);
        });
        csvRows.push(['']);

        csvRows.push(['Most Commented Resources']);
        csvRows.push(['Title', 'Comments Count']);
        ressourceMostCommented.forEach(resource => {
            csvRows.push([resource.title, resource.commentsCount]);
        });
        csvRows.push(['']);

        csvRows.push(['Most Shared Resources']);
        csvRows.push(['Title', 'Shared Count']);
        ressourceMostShared.forEach(resource => {
            csvRows.push([resource.title, resource.sharedCount]);
        });
        csvRows.push(['']);

        csvRows.push(['Most Liked Resources']);
        csvRows.push(['Title', 'Likes Count']);
        ressourceMostLiked.forEach(resource => {
            csvRows.push([resource.title, resource.likesCount]);
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'statistics.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="backOfficeStatsMainContainer">
            <h2 className='backOfficeTitle'>{t("backOffice.statsTitle")}</h2>

            <div className="secondContainer">
                <div className="statsContainer">
                    <div className="categorySelectName">
                        <label htmlFor="categorySelect">Choisir Categorie:</label>
                        <select id="categorySelect" onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory}>
                            <option value="">All Categories</option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.title}>
                                        {t("categories." + category.title)}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading categories...</option>
                            )}
                        </select>
                    </div>
                    <div>
                        {selectedCategory && (
                            statistics.category?.count !== 0 ? (
                                <span className="statSpan">Le nombre de ressource pour cette catégorie est de : {statistics.category?.count} </span>
                            ) : (
                                <span className="statSpan">Il n'y a pas encore de ressource pour cette catégorie</span>
                            )
                        )}
                    </div>
                </div>

                <div className="statsContainer">
                    <div className="categorySelectName">
                        <label htmlFor="resourceTypeSelect">Choisir type de ressource:</label>
                        <select id="resourceTypeSelect" onChange={(e) => handleResourceTypeChange(e.target.value)} value={selectedResourceType}>
                            <option value="">All Types</option>
                            {resourceTypes.length > 0 ? (
                                resourceTypes.map((resourceType) => (
                                    <option key={resourceType.id} value={resourceType.name}>
                                        {t("resourceTypes." + resourceType.name)}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading resource types...</option>
                            )}
                        </select>
                    </div>
                    <div>
                        {selectedResourceType && (
                            statistics.resourceType?.count !== 0 ? (
                                <span className="statSpan">Le nombre de ressource pour ce type est de : {statistics.resourceType?.count} </span>
                            ) : (
                                <span className="statSpan">Il n'y a pas encore de ressource pour ce type</span>
                            )
                        )}
                    </div>
                </div>

                <div className="statsContainer">
                    <div className="categorySelectName">
                        <label htmlFor="relationshipTypeSelect">Choisir type de relation:</label>
                        <select id="relationshipTypeSelect" onChange={(e) => handleRelationshipTypeChange(e.target.value)} value={selectedRelationshipType}>
                            <option value="">All Relationship Types</option>
                            {relationshipTypes.length > 0 ? (
                                relationshipTypes.map((relationshipType) => (
                                    <option key={relationshipType.id} value={relationshipType.title}>
                                        {t("relationTypes." + relationshipType.title)}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Loading relationship types...</option>
                            )}
                        </select>
                    </div>
                    <div>
                        {selectedRelationshipType && (
                            statistics.relationship?.count !== 0 ? (
                                <span className="statSpan">Le nombre de ressource pour ce type de relation est de : {statistics.relationship?.count} </span>
                            ) : (
                                <span className="statSpan">Il n'y a pas encore de ressource pour ce type de relation</span>
                            )
                        )}
                    </div>
                </div>
                <div className="statsContainer">
                    <span className="statSpan">Comptes créés : {totalUsers}</span>
                </div>
                <div>
                    <h3>Ressources les plus vues</h3>
                    <ul>
                        {ressourceMostViewed.map((ressource, index) => (
                            <li key={index}>
                                <strong>{ressource.title}</strong>: {ressource.viewsCount} vues
                            </li>
                        ))}
                    </ul>

                    <h3>Ressources les plus commentées</h3>
                    <ul>
                        {ressourceMostCommented.map((ressource, index) => (
                            <li key={index}>
                                <strong>{ressource.title}</strong>: {ressource.commentsCount} commentaires
                            </li>
                        ))}
                    </ul>

                    <h3>Ressources les plus partagées</h3>
                    <ul>
                        {ressourceMostShared.map((ressource, index) => (
                            <li key={index}>
                                <strong>{ressource.title}</strong>: {ressource.sharedCount} partages
                            </li>
                        ))}
                    </ul>

                    <h3>Ressources les plus aimées</h3>
                    <ul>
                        {ressourceMostLiked.map((ressource, index) => (
                            <li key={index}>
                                <strong>{ressource.title}</strong>: {ressource.likesCount} likes
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button className="buttonExport" onClick={exportToCSV}>Export to CSV</button>
                </div>
            </div>
        </div>
    );
}
