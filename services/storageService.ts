
export const storageService = {
    getItem: <T>(key: string): T | null => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage`, error);
            return null;
        }
    },

    setItem: <T>(key: string, value: T): void => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage`, error);
        }
    },

    removeItem: (key: string): void => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing item ${key} from localStorage`, error);
        }
    }
};
