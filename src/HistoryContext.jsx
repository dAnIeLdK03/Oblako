import React, { createContext, useContext, useEffect, useState } from 'react';

const HistoryContext = createContext(); 

export const useHistory = () => {
    const context =useContext(HistoryContext);
    if(!context){
        throw new Error('useHistory must be used within HistoryProvider');
    }
    return context;
};

export const HistoryProvider = ({children}) => {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('oblako_history');
        if (savedHistory) {
            setSearchHistory(JSON.parse(savedHistory));
        }
    }, []);

    const addToHistory = (city) => {
        if(!city || typeof city !== 'string') return;

        const normalizedCity =city.trim();
        if(!normalizedCity) return; 

        setSearchHistory(prevHistory => {
            const filtered = prevHistory.filter(
                item => item.toLowerCase() !== normalizedCity.toLowerCase()
            );

            const newHistory = [normalizedCity, ...filtered].slice(0, 5);

            localStorage.setItem('oblako_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('oblako_history');
    };

    return (
        <HistoryContext.Provider value={{
            searchHistory,
            addToHistory,
            clearHistory
        }}>
            {children}
        </HistoryContext.Provider>
    );
};