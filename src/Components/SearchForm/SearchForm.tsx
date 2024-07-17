import "./SearchForm.css";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import getApiUrl from '../../Services/getApiUrl';

type SelectedCategoryId = string | null;

type Category = {
    id: number;
    title: string;
};

type ResourceType = {
    id: number;
    name: string;
};

type RelationshipType = {
    id: number;
    title: string;
};

const SearchForm = ({ selectedCategoryId, onCategoryChange, onKeywordChange }: { selectedCategoryId: SelectedCategoryId, onCategoryChange: (categoryId: SelectedCategoryId) => void, onKeywordChange: (keyword: string) => void }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
    const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryId>(selectedCategoryId);
    const [keyword, setKeyword] = useState<string>("");
    const { t } = useTranslation();

    const fetchCategories = async () => {
        try {
            const response = await fetch(getApiUrl("/categories"));
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setCategories(data['hydra:member']);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const fetchResourceTypes = async () => {
        try {
            const response = await fetch(getApiUrl("/ressource_types"));
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setResourceTypes(data['hydra:member']);
        } catch (error) {
            console.error("Failed to fetch resource types:", error);
        }
    };

    const fetchRelationshipTypes = async () => {
        try {
            const response = await fetch(getApiUrl("/relationship_types"));
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setRelationshipTypes(data['hydra:member']);
        } catch (error) {
            console.error("Failed to fetch relationship types:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchResourceTypes();
        fetchRelationshipTypes();
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== selectedCategory) {
            setSelectedCategory(selectedCategoryId);
        }
    }, [selectedCategoryId]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const selectedType: string = formData.get("type") as string;
        const selectedCategory: string = formData.get("categories") as string;
        const selectedRelation: string = formData.get("relations") as string;
        const keyword = event.currentTarget.keyword.value;

        const searchParams = new URLSearchParams();
        if (selectedType && selectedType !== "Toutes") {
            searchParams.set("type", selectedType);
        }
        if (selectedCategory && selectedCategory !== "Toutes") {
            searchParams.set("category", selectedCategory);
            onCategoryChange(selectedCategory);
        } else {
            onCategoryChange(null);
        }
        if (selectedRelation && selectedRelation !== "Toutes") {
            searchParams.set("relation", selectedRelation);
        }
        if (keyword) {
            searchParams.set("keyword", keyword);
        }

        const newSearch = searchParams.toString();
        const newUrl = `?${newSearch}`;

        navigate(newUrl);
    };

    const toggleOptions = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="searchFormContainer">
            <form onSubmit={handleSubmit} className="searchFormForm" style={{ height: isOpen ? "350px" : "120px" }}>
                <input type="submit" id="searchBtn" value="Rechercher" />
                <div className={isOpen ? 'searchFormInput showSearchFormInput' : 'searchFormInput'}>
                    <label htmlFor="type">Types de ressources</label>
                    <select id="type" name="type">
                        <option value="Toutes">Toutes</option>
                        {resourceTypes.length > 0 ? (
                            resourceTypes.map((resourceType) => (
                                <option key={resourceType.id} value={resourceType.name}>
                                    {t("resourceTypes." + resourceType.name)}
                                </option>
                            ))
                        ) : (
                            <option disabled>Chargement des types de ressources...</option>
                        )}
                    </select>
                </div>

                <span className="inputSeparator"></span>

                <div className={isOpen ? 'searchFormInput showSearchFormInput' : 'searchFormInput'}>
                    <label htmlFor="categories">Catégories</label>
                    <select id="categories" name="categories" value={selectedCategory ?? "Toutes"} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="Toutes">Toutes</option>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category.id} value={category.title}>
                                    {t("categories." + category.title)}
                                </option>
                            ))
                        ) : (
                            <option disabled>Chargement des catégories...</option>
                        )}
                    </select>
                </div>

                <span className="inputSeparator"></span>

                <div className={isOpen ? 'searchFormInput showSearchFormInput' : 'searchFormInput'}>
                    <label htmlFor="relations">Types de relations</label>
                    <select id="relations" name="relations">
                        <option value="Toutes">Toutes</option>
                        {relationshipTypes.length > 0 ? (
                            relationshipTypes.map((relationshipType) => (
                                <option key={relationshipType.id} value={relationshipType.title}>
                                    {t("relationTypes." + relationshipType.title)}
                                </option>
                            ))
                        ) : (
                            <option disabled>Chargement des types de relations...</option>
                        )}
                    </select>
                </div>

                <span className="inputSeparator"></span>

                <div className='searchFormInput showSearchFormInput'>
                    <label htmlFor='keyword'>Mots clef</label>
                    <input id="keyword" type="text" placeholder='Mots clefs' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                </div>
            </form>
            <span id="showMoreOptions" onClick={toggleOptions}>{isOpen ? 'Cacher les options' : "Voir plus d'options"}</span>
        </div>
    );
}

export default SearchForm;
