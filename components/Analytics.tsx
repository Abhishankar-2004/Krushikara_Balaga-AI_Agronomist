
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { analyticsService } from '../services/analyticsService';
import { Feature, TranslationKey } from '../types';
import Card from './common/Card';
import { AnalyticsIcon } from './icons/AnalyticsIcon';

interface ChartData {
  name: string;
  count: number;
}

// Colors for the charts, matching the app's theme
const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#6d28d9', '#db2777', '#0891b2'];

const featureToTranslationKey = (feature: string): TranslationKey | null => {
    // Exclude non-feature keys from analytics
    if ([Feature.HOME, Feature.PROFILE, Feature.ANALYTICS].includes(feature as Feature)) {
        return null;
    }
    // Converts CROP_DOCTOR to navCropDoctor
    const camelCase = feature.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase());
    const key = `nav${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`;
    return key as TranslationKey;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm text-white p-3 rounded-lg border border-slate-700">
        <p className="font-bold">{label}</p>
        <p className="text-sm">{`Usage: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const Analytics: React.FC = () => {
    const { user } = useAuth();
    const { translate } = useLanguage();
    const [barData, setBarData] = useState<ChartData[]>([]);
    const [pieData, setPieData] = useState<ChartData[]>([]);
    const [totalUsage, setTotalUsage] = useState(0);

    useEffect(() => {
        if (user?.email) {
            const rawData = analyticsService.getFeatureUsageData(user.email);
            const formattedData: ChartData[] = Object.keys(rawData)
                .map(key => {
                    const translationKey = featureToTranslationKey(key);
                    return translationKey ? { name: translate(translationKey), count: rawData[key as Feature]! } : null;
                })
                .filter((item): item is ChartData => item !== null)
                .sort((a, b) => b.count - a.count);

            setBarData(formattedData);
            setPieData(formattedData.filter(d => d.count > 0));
            setTotalUsage(formattedData.reduce((acc, item) => acc + item.count, 0));
        }
    }, [user, translate]);

    if (totalUsage === 0) {
        return (
            <Card className="text-center">
                <AnalyticsIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-primary mb-2">{translate('analyticsTitle')}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg">{translate('noAnalyticsData')}</p>
            </Card>
        );
    }

    return (
        <div>
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
                    <AnalyticsIcon className="w-8 h-8"/>
                    {translate('analyticsTitle')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">{translate('analyticsDescription')}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-3 h-96">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-4">{translate('featureUsageTitle')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} style={{ fontSize: '12px' }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)'}}/>
                            <Legend />
                            <Bar dataKey="count" name="Usage Count" fill="#16a34a" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Side Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="text-center">
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">{translate('totalUsage')}</p>
                        <p className="text-6xl font-extrabold text-primary">{totalUsage}</p>
                    </Card>
                    <Card className="h-80">
                         <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-4 text-center">{translate('usageDistributionTitle')}</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                 <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
