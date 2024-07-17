import NavBar from '../../Components/NavBar/NavBar';
import RessourcePresentation from '../../Components/RessourcePresentation/RessourcePresentation';
import SearchForm from '../../Components/SearchForm/SearchForm';
import { useLocation, useNavigate } from 'react-router-dom';
import './Resources.css';
import { useState, useEffect, useMemo } from 'react';
import getApiUrl from '../../Services/getApiUrl';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Footer from '../../Components/Footer/Footer';

type Resource = {
  id: number;
  title: string;
  ressourceType: {
    name: string;
  };
  category: {
    title: string;
  };
  image: string;
  views: string;
  likes: string;
  date: string;
  relationshipType: [
    {
      title: string;
    }
  ];
};

export default function Resources() {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const navigate = useNavigate();

  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(searchParams.get('category'));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || "");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (currentPage === 1) {
          setLoading(true);
          const response = await axios.get(getApiUrl(`/public/ressources?page=${currentPage}`));
          const newResources = response.data;
  
          if (newResources.length < 5) {
            setHasMore(false);
          }
          setAllResources(newResources);
          setLoading(false);
        } else {
          const response = await axios.get(getApiUrl(`/public/ressources?page=${currentPage}`));
          const newResources = response.data;
          
          if (newResources.length < 5) {
            setHasMore(false);
          }
          setAllResources(prevResources => [...prevResources, ...newResources]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des ressources", error);
      }
    };
  
    fetchResources();
  }, [currentPage]);

  useEffect(() => {
    const categoryId = searchParams.get('category');
    const resourceType = searchParams.get('type');
    const relationType = searchParams.get('relation');
    const keyword = searchParams.get('keyword') || "";

    const filtered = allResources.filter(resource => {
      let matchesCategory = true;
      let matchesType = true;
      let matchesRelation = true;
      let matchesKeyword = true;

      if (categoryId) {
        matchesCategory = resource.category.title === categoryId;
      }
      if (resourceType) {
        matchesType = resource.ressourceType.name === resourceType;
      }
      if (relationType) {
        matchesRelation = resource.relationshipType[0].title === relationType;
      }
      if (keyword) {
        matchesKeyword = resource.title.toLowerCase().includes(keyword.toLowerCase());
      }

      return matchesCategory && matchesType && matchesRelation && matchesKeyword;
    });

    setFilteredResources(filtered);
  }, [allResources, searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      if (hasMore && window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        if (!loading) {
          setLoading(true);
          setCurrentPage(prevPage => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleResourceClick = (id: number) => {
    navigate(`/resources/${id}`);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    navigate({ search: searchParams.toString() });
  };

  const handleKeywordChange = (keyword: string) => {
    setKeyword(keyword);
    if (keyword) {
      searchParams.set('keyword', keyword);
    } else {
      searchParams.delete('keyword');
    }
    navigate({ search: searchParams.toString() });
  };

  return (
    <div className="ressourcesMainDiv">
      <NavBar />
      <div className="ressourcesMainContainer">
        <SearchForm selectedCategoryId={selectedCategoryId} onCategoryChange={handleCategoryChange} onKeywordChange={handleKeywordChange} />
        <div className='ressourcesDisplay'>
          {filteredResources.map(resource => (
            <RessourcePresentation
              key={resource.id}
              ressource={resource}
              onClick={() => handleResourceClick(resource.id)}
            />
          ))}
          {loading && hasMore && <div>{t("loading.loading")}</div>}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
