import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./CategorysPage.css";
import axios from "axios";
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import { useTranslation } from 'react-i18next';
import getApiUrl from '../../Services/getApiUrl';

type Category = {
    id: number;
    title: string;
};

export default function CategorysPage() {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await axios.get(getApiUrl('/categories?page=1'), {
                    headers: {
                        'Content-Type': 'application/ld+json',
                    },
                });
                setCategories(categoriesResponse.data['hydra:member']); 
            } catch (err: any) {
                setCategoriesError(err.message || 'Erreur lors de la récupération des ressources');
            }
        };

        fetchCategories();
    }, []); 

    if (!categories) return <LoadingScreen />;
    if (categoriesError) return <div>{categoriesError}</div>;

    return (
        <div className="categoriesPage">
            <div className="containerMain">
                <h1>Catégories</h1>
                <div className="containerBoxesButton">
                    <div className="containerBoxes">
                        {categories.map((category) => (
                            <Link key={category.id} to={`/resources?category=${category.title}`}style={{ backgroundImage: `url(/img/${category.title}.jpg)` }} className={`boxCategory color${category.title}`}>
                                <h2>{t("categories."+category.title)}</h2>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
