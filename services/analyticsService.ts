
import { storageService } from './storageService';
import { Feature } from '../types';

export type AnalyticsData = { [key in Feature]?: number };

const getStorageKey = (userEmail: string) => `kisan_analytics_${userEmail}`;

export const analyticsService = {
    logFeatureUse: (feature: Feature, userEmail: string): void => {
        if (!userEmail) return;
        const key = getStorageKey(userEmail);
        const data = storageService.getItem<AnalyticsData>(key) || {};
        data[feature] = (data[feature] || 0) + 1;
        storageService.setItem(key, data);
    },

    getFeatureUsageData: (userEmail: string): AnalyticsData => {
        if (!userEmail) return {};
        const key = getStorageKey(userEmail);
        return storageService.getItem<AnalyticsData>(key) || {};
    }
};
