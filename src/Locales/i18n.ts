import i18n from 'i18next';
import { initReactI18next, Translation } from 'react-i18next';

import fr from './fr.json';
import en from './en.json';
import de from './de.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
      de: {
        translation : de
      }
    },
    fallbackLng: 'fr', 
    detection: {
      order: ['navigator', 'querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], 
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
