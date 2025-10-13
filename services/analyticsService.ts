
// Removed storageService - analytics now handled differently with Clerk
import { Feature } from '../types';

export type AnalyticsData = { [key in Feature]?: number };

const getStorageKey = (userEmail: string) => `kisan_analytics_${userEmail}`;

export const analyticsService = {
    logFeatureUse: (feature: Feature, userEmail: string): void => {
        if (!userEmail) return;
        const key = getStorageKey(userEmail);
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : {};
        data[feature] = (data[feature] || 0) + 1;
        localStorage.setItem(key, JSON.stringify(data));
    },

    getFeatureUsageData: (userEmail: string): AnalyticsData => {
        if (!userEmail) return {};
        const key = getStorageKey(userEmail);
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : {};
    }
};
