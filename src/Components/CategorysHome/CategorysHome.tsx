import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti';
import React, { useState, useEffect } from 'react';
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreen';
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { Link } from 'react-router-dom';


type Category = {
  id: number;
  title: string;
};

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <TiArrowRightThick size={50} color="#03989E" />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block', marginLeft: '-30px' }}
      onClick={onClick}
    >
      <TiArrowLeftThick size={50} color="#03989E" />
    </div>
  );
}

export default function MySlider() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get('http://127.0.0.1:8000/api/categories?page=1', {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    arrows: true,
    className: "slider",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <div className="CategorysHome" style={{ maxWidth: '1200px', margin: '20px auto', paddingLeft: '55px', paddingRight: '55px' }}>
      <Slider {...settings}>
        {categories.map(category => (

          <div className="carrousel_item" key={category.id} onClick={() => console.log(category.title)}>
            <Link
              key={category.id}
              to={`/resources?category=${category.title}`}
              className={`boxCategorySlider color${category.title}`}
            >
            <img className="carroussel_image" src={`../img/${category.title}.jpg`} alt={category.title}
              style={{
                width: "80%",
                margin: "auto",
                height: "180px",
                objectFit: "cover",
                borderTopLeftRadius: "20px",
                borderTopRightRadius: "20px",
                cursor: 'pointer'
              }} />
            <h3 className={"category_title color" + category.title} style={{
              margin: 'auto',
              bottom: '0',
              width: '80%',
              height: '50px',
              textAlign: 'center',
              paddingTop: '10px',
              color: 'white',
              borderBottomLeftRadius: '20px',
              borderBottomRightRadius: '20px',
              font: '700 1.5em "Roboto", sans-serif',
              cursor: 'pointer'
            }}>
              {t("categories." + category.title)}
            </h3>
            </Link>
          </div>
        ))}
    </Slider >
    </div >
  );
}
