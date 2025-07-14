import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if(!context){
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('weatherAppTheme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(getSystemTheme());
        }
    }, []);

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.classList.add('light-theme');
        } else {
            document.documentElement.classList.remove('light-theme');
        }
    }, [theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!localStorage.getItem('weatherAppTheme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('weatherAppTheme', newTheme);
    };

    const setAutoTheme = () => {
        localStorage.removeItem('weatherAppTheme');
        setTheme(getSystemTheme());
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setAutoTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};