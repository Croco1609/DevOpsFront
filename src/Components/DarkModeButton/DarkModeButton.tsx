import React, { useState, useEffect } from 'react';
import './DarkModeSwitch.css';

const DarkModeSwitch = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setIsDarkMode(currentTheme === 'dark');
        document.body.classList.toggle('dark-mode', currentTheme === 'dark');
    }, []);

    const handleToggle = () => {
        setIsDarkMode(!isDarkMode);
        const newTheme = !isDarkMode ? 'dark' : 'light';
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
        document.body.classList.toggle('light-mode', newTheme === 'light');
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="switch-container">
            <input
                type="checkbox"
                id="dark-mode-switch"
                className="switch-input"
                checked={isDarkMode}
                onChange={handleToggle}
            />
            <label htmlFor="dark-mode-switch" className="switch-label">
                <span className="sun-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 4.25a.75.75 0 01.75.75V6a.75.75 0 01-1.5 0V5A.75.75 0 0112 4.25zm4.803 1.803a.75.75 0 011.06 0l.707.707a.75.75 0 11-1.06 1.06l-.707-.707a.75.75 0 010-1.06zM18 11.25h1a.75.75 0 010 1.5h-1a.75.75 0 010-1.5zm-10 0a.75.75 0 010 1.5H7a.75.75 0 010-1.5h1zm-2.803 1.803a.75.75 0 01-1.06 0l-.707-.707a.75.75 0 111.06-1.06l.707.707a.75.75 0 010 1.06zM12 18.25a.75.75 0 01-.75.75H11a.75.75 0 010-1.5h.25a.75.75 0 01.75.75zm-4.803-1.803a.75.75 0 00-1.06 0l-.707.707a.75.75 0 001.06 1.06l.707-.707a.75.75 0 000-1.06zM12 16a4 4 0 100-8 4 4 0 000 8zm6.803-4.803a.75.75 0 01.707-.707H19a.75.75 0 010 1.5h-.25a.75.75 0 01-.707-.707z"/>
                    </svg>
                </span>
                <span className="moon-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M21.75 12a9.75 9.75 0 11-8.75-9.7 7.25 7.25 0 108.75 9.7z"/>
                    </svg>
                </span>
                <span className="switch-handle"></span>
            </label>
        </div>
    );
};

export default DarkModeSwitch;
