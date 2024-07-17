import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {

    const { t } = useTranslation()
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-navigation">
                    <a href="/resources" className="footer-nav-link">{t("footer.search")}</a>
                    <a href="/category" className="footer-nav-link">{t("footer.categories")}</a>
                    <a href="/about" className="footer-nav-link">{t("footer.about")}  </a>
                    <a href="/faq" className="footer-nav-link">{t("footer.faq")}</a>
                </div>
                <div className="footer-links">
                    <a href="/about"  className="footer-link">{t("footer.condition")}</a>
                    <a href="/about"  className="footer-link">{t("footer.cookie")}</a>
                    <a href="/about"  className="footer-link">{t("footer.legal")}</a>
                    <a href="/about" className="footer-link">{t("footer.condidencialite")}</a>
                </div>
                <div className="footer-social">
                    <a href="/" className="social-link">Facebook</a>
                    <a href="/" className="social-link">Twitter</a>
                    <a href="/" className="social-link">LinkedIn</a>
                </div>
                <div className="footer-logo">
                    <img alt="logo de ressource relationnelles" src='/img/appLogo.png' />
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 (Re)soures Relaltionnelles. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
