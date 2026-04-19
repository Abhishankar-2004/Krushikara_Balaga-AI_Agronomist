import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { Feature, UserProfile, TranslationKey } from '../types';
import { storageService } from '../services/storageService';
import { WeatherAdvisory, getMarketTrends, MarketTrends, getWeatherAdvisory } from '../services/geminiService';
import { WeatherConditionIcon } from './icons/WeatherConditionIcon';
import { LeafIcon } from './icons/LeafIcon';
import { MarketIcon } from './icons/MarketIcon';
import { GovIcon } from './icons/GovIcon';
import { WeatherIcon } from './icons/WeatherIcon';
import { ScienceIcon } from './icons/ScienceIcon';
import { LoanIcon } from './icons/LoanIcon';
import { CommunityIcon } from './icons/CommunityIcon';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/analyticsService';
import Card from './common/Card';
import { getTrendingSchemes, TrendingScheme } from '../services/schemeService';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import Spinner from './common/Spinner';
import { useAuth } from '../AuthContext';

interface DashboardProps {
  setActiveFeature: (feature: Feature) => void;
  userProfile: UserProfile | null;
}

interface ChartData {
  name: string;
  count: number;
}

const featureList = [
  { id: Feature.CROP_DOCTOR, key: 'navCropDoctor' as const, icon: <LeafIcon />, imageUrl: 'https://play-lh.googleusercontent.com/-TIWhpW87rCnqq8Wd4sv6DE0I_VgTlRL3Qdl4A6VNJBVlZwRp6bICgoEQLZ7RSUsIQs' },
  { id: Feature.MARKET_GURU, key: 'navMarketGuru' as const, icon: <MarketIcon />, imageUrl: 'https://img.freepik.com/premium-photo/farmer-uses-smartphone-app-realtime-crop-monitoring-highlighting-ai-s-role-agriculture_210545-8030.jpg?w=2000' },
  { id: Feature.SCHEME_NAVIGATOR, key: 'navSchemeNavigator' as const, icon: <GovIcon />, imageUrl: 'https://gumlet.assettype.com/agrowon/2023-04/0e3a4979-57a3-4efa-a970-e77b38de56af/Mahesh_News_Story___2023_04_14T172148_490.png?rect=0%2C0%2C1200%2C675&auto=format%2Ccompress&fit=max' },
  { id: Feature.WEATHER_ADVISOR, key: 'navWeatherAdvisor' as const, icon: <WeatherIcon />, imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg' },
  { id: Feature.FERTILIZER_CALCULATOR, key: 'navFertilizerCalculator' as const, icon: <ScienceIcon />, imageUrl: 'https://as1.ftcdn.net/v2/jpg/03/78/43/00/1000_F_378430046_cuHFlaWQAogbtRnk64NyxCEMW7He2zBU.jpg' },
  { id: Feature.LOAN_ADVISOR, key: 'navLoanAdvisor' as const, icon: <LoanIcon />, imageUrl: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg' },
  { id: Feature.COMMUNITY_CONNECT, key: 'navCommunityConnect' as const, icon: <CommunityIcon />, imageUrl: 'https://farmingshelter.com/wp-content/uploads/2023/02/How-To-Learn-From-Other-Farmers-And-Connect-With-The-Agricultural-Community-768x432.jpg' },
];

const Dashboard: React.FC<DashboardProps> = ({ setActiveFeature, userProfile }) => {
    const { language, translate } = useLanguage();
    const { user } = useAuth();
    
    const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null);
    const [trendingScheme, setTrendingScheme] = useState<TrendingScheme | null>(null);
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

        const fetchDashboardData = async () => {
            try {
                const trendsJson = await getMarketTrends(language);
                setMarketTrends(JSON.parse(trendsJson));

                const schemes = getTrendingSchemes(language);
                if (schemes.length > 0) {
                    setTrendingScheme(schemes[Math.floor(Math.random() * schemes.length)]);
                }
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            }
        };
        fetchDashboardData();
    }, [user, translate, language]);

    const featureToTranslationKey = (feature: string): TranslationKey | null => {
        if ([Feature.HOME, Feature.PROFILE].includes(feature as Feature)) return null;
        const camelCase = feature.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase());
        return `nav${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}` as TranslationKey;
    };

    const welcomeMessage = userProfile?.name
      ? translate('dashboardWelcomeUser').replace('{name}', userProfile.name)
      : translate('dashboardWelcome');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50">{welcomeMessage}</h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-800 p-6 sm:p-8 md:p-10 w-full mx-auto mb-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-primary mb-4">{translate('introTitle')}</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{translate('introLine1')}</p>
                        <p className="text-slate-600 dark:text-slate-400">{translate('introLine2')}</p>
                    </div>
                    <div className="md:col-span-3 flex justify-center items-center gap-2">
                        <motion.img whileHover={{ rotate: 0, scale: 1.05 }} src="https://st5.depositphotos.com/81161912/66752/i/450/depositphotos_667522276-stock-photo-maharashtra-look-farmer-happy-farmer.jpg" alt={translate('maleFarmerAlt')} className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover -rotate-6 transition-transform" />
                        <motion.img whileHover={{ scale: 1.2 }} src="https://wallpaperaccess.com/full/4293504.jpg" alt={translate('ploughingFarmerAlt')} className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover scale-110 z-10 transition-transform" />
                        <motion.img whileHover={{ rotate: 0, scale: 1.05 }} src="https://media.istockphoto.com/photos/indian-farmer-women-on-farm-field-with-happy-face-picture-id907753228?k=6&m=907753228&s=170667a&w=0&h=jBDTI2l0CjqpQwitaL9SG1lIhDICiasm8BuoqbDNoBI=" alt={translate('femaleFarmerAlt')} className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover rotate-6 transition-transform" />
                    </div>
                </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featureList.map((feature) => (
                    <motion.button
                        key={feature.id}
                        variants={itemVariants}
                        whileHover={{ y: -10, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveFeature(feature.id)}
                        className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-none transition-shadow h-52 sm:h-64"
                    >
                        <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url(${feature.imageUrl})` }}></div>
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                        <div className="relative w-full h-full flex flex-col justify-between items-start p-4 text-white">
                            <div>
                                <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-md">
                                    {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                                </div>
                                <h3 className="font-bold text-base sm:text-lg text-left [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">{translate(feature.key)}</h3>
                            </div>
                            {feature.id === Feature.CROP_DOCTOR && (
                                <div className="mt-2 w-full">
                                    <span className="block w-full text-center bg-primary/80 hover:bg-primary text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-200 backdrop-blur-sm">
                                        {translate('dashboardDiagnose')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export default Dashboard;