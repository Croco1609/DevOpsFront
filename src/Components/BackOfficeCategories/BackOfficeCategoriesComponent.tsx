import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getApiUrl from '../../Services/getApiUrl';
import './BackOfficeCategoriesComponent.css';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface Category {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesComponent() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { isAuthenticated, role, isLoading, token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(getApiUrl('/categories'), {
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data && response.data['hydra:member']) {
        setCategories(response.data['hydra:member']);
      } else {
        console.error('Error fetching categories: response.data is undefined or response.data["hydra:member"] is undefined');
        setErrorMessage('Erreur lors de la récupération des catégories.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMessage('Erreur lors de la récupération des catégories.');
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post(
        getApiUrl('/categories'),
        { title: newCategoryTitle },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setNewCategoryTitle('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage('Erreur lors de l\'ajout de la catégorie.');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(
        getApiUrl(`/categories/${categoryId}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrorMessage('Erreur lors de la suppression de la catégorie.');
    }
  };

  const handleEditCategory = async (categoryId: number) => {
    try {
      await axios.patch(
        getApiUrl(`/categories/${categoryId}`),
        { title: editCategoryTitle },
        {
          headers: {
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setEditingCategory(null);
      setEditCategoryTitle('');
      fetchCategories();
    } catch (error) {
      console.error('Error editing category:', error);
      setErrorMessage('Erreur lors de la modification de la catégorie.');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryTitle('');
    setErrorMessage(null);
  };

  return (
    <div className="mainContainerBackOfficeCategories">
      <h2 className='backOfficeTitle'>{t("backOffice.pageCategories")}</h2>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      <div className="CategoriesContainerBackOffice">
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              {editingCategory === category.id ? (
                <div>
                  <input type="text" value={editCategoryTitle} onChange={(e) => setEditCategoryTitle(e.target.value)} />
                  <div className="editButton">
                    <button onClick={() => handleEditCategory(category.id)}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="beforeClick">
                  <p>{category.title}</p>
                  <div className="editButton">
                    <button onClick={() => { setEditingCategory(category.id); setEditCategoryTitle(category.title); }}>Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} className='deleteButton'>Delete</button>
                  </div>
                </div>

              )}
            </li>
          ))}
        </ul>
        <div className="addCat">
          <p>Ajouter une categorie</p>
          <input type="text" value={newCategoryTitle} onChange={(e) => setNewCategoryTitle(e.target.value)} />
          <button onClick={handleAddCategory}>Ajouter une Categorie</button>
        </div>
      </div>
    </div>
  );
}
