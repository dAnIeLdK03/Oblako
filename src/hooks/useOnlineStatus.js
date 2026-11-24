import { useSyncExternalStore } from 'react';

function subscribe(callback) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
    };
}

// true, докато браузърът смята, че има връзка (navigator.onLine)
export function useOnlineStatus() {
    return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}
