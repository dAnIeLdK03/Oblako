import React, { createContext, useContext, useEffect, useState } from 'react';
import { getItem, setItem, removeItem } from './utils/storage.js';

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
        const savedHistory = getItem('oblako_history');
        if (!savedHistory) return;
        try {
            const parsed = JSON.parse(savedHistory);
            if (Array.isArray(parsed)) setSearchHistory(parsed.filter((c) => typeof c === 'string').slice(0, 5));
        } catch {
            // повредени данни — започваме с празна история
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

            setItem('oblako_history', JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        setSearchHistory([]);
        removeItem('oblako_history');
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