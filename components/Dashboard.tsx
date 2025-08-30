



import React, { useEffect, useState } from 'react';
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
  { 
    id: Feature.CROP_DOCTOR, 
    key: 'navCropDoctor' as const, 
    icon: <LeafIcon />, 
    imageUrl: 'https://play-lh.googleusercontent.com/-TIWhpW87rCnqq8Wd4sv6DE0I_VgTlRL3Qdl4A6VNJBVlZwRp6bICgoEQLZ7RSUsIQs' 
  },
  { 
    id: Feature.MARKET_GURU, 
    key: 'navMarketGuru' as const, 
    icon: <MarketIcon />, 
    imageUrl: 'https://img.freepik.com/premium-photo/farmer-uses-smartphone-app-realtime-crop-monitoring-highlighting-ai-s-role-agriculture_210545-8030.jpg?w=2000' 
  },
  { 
    id: Feature.SCHEME_NAVIGATOR, 
    key: 'navSchemeNavigator' as const, 
    icon: <GovIcon />, 
    imageUrl: 'https://gumlet.assettype.com/agrowon/2023-04/0e3a4979-57a3-4efa-a970-e77b38de56af/Mahesh_News_Story___2023_04_14T172148_490.png?rect=0%2C0%2C1200%2C675&auto=format%2Ccompress&fit=max' 
  },
  { 
    id: Feature.WEATHER_ADVISOR, 
    key: 'navWeatherAdvisor' as const, 
    icon: <WeatherIcon />, 
    imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg' 
  },
  { 
    id: Feature.FERTILIZER_CALCULATOR, 
    key: 'navFertilizerCalculator' as const, 
    icon: <ScienceIcon />, 
    imageUrl: 'https://as1.ftcdn.net/v2/jpg/03/78/43/00/1000_F_378430046_cuHFlaWQAogbtRnk64NyxCEMW7He2zBU.jpg' 
  },
  { 
    id: Feature.LOAN_ADVISOR, 
    key: 'navLoanAdvisor' as const, 
    icon: <LoanIcon />, 
    imageUrl: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg' 
  },
  { 
    id: Feature.COMMUNITY_CONNECT, 
    key: 'navCommunityConnect' as const, 
    icon: <CommunityIcon />, 
    imageUrl: 'https://farmingshelter.com/wp-content/uploads/2023/02/How-To-Learn-From-Other-Farmers-And-Connect-With-The-Agricultural-Community-768x432.jpg' 
  },
];


const WeatherWidget: React.FC<{ location: string, onClick: () => void }> = ({ location, onClick }) => {
    const { language, translate } = useLanguage();
    const [weather, setWeather] = useState<WeatherAdvisory | null>(storageService.getItem<WeatherAdvisory>('lastWeather'));
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            if (location) {
                setIsLoading(true);
                try {
                    const resultJson = await getWeatherAdvisory(location, language);
                    const result: WeatherAdvisory = JSON.parse(resultJson);
                    if (!result.error) {
                        setWeather(result);
                        storageService.setItem('lastWeather', result);
                    }
                } catch (e) {
                    console.error("Failed to fetch weather for widget", e);
                    setWeather(null); // Clear stale data on error
                } finally {
                    setIsLoading(false);
                }
            }
        };

        const lastWeather = storageService.getItem<WeatherAdvisory>('lastWeather');
        if (!lastWeather || lastWeather.location !== location) {
             fetchWeather();
        } else {
             setWeather(lastWeather);
        }

    }, [location, language]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border dark:border-slate-800 flex justify-center items-center h-[108px]">
                <Spinner />
            </div>
        );
    }
    
    if (!location) {
        return (
             <button onClick={onClick} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg w-full text-center border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-transform transform hover:-translate-y-1">
                <p className="font-semibold text-primary">{translate('weatherWidgetPrompt')}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{translate('weatherWidgetPromptAction')}</p>
             </button>
        );
    }

    const today = weather?.forecast?.find(day => day && !day.isPast) || weather?.forecast?.find(day => day);

    if (!today) {
        return null;
    }

    return (
        <button onClick={onClick} className="w-full text-left bg-white dark:bg-slate-900 p-4 rounded-xl shadow-lg border dark:border-slate-800 transition-transform transform hover:-translate-y-1">
            <p className="font-bold text-slate-800 dark:text-slate-100">{translate('yourWeather').replace('{location}', weather.location || location)}</p>
            <div className="flex items-center gap-4 mt-2">
                <WeatherConditionIcon condition={today.condition} className="w-16 h-16 text-amber-500 dark:text-amber-400"/>
                <div>
                    <p className="text-4xl font-bold text-slate-900 dark:text-slate-50">{today.tempHigh}°</p>
                    <p className="text-lg text-slate-600 dark:text-slate-400">{today.condition}</p>
                </div>
                <div className="ml-auto text-right">
                     <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{translate('highShort')}: {today.tempHigh}°</p>
                     <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">{translate('lowShort')}: {today.tempLow}°</p>
                </div>
            </div>
        </button>
    );
};


const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#6d28d9', '#db2777', '#0891b2'];

const featureToTranslationKey = (feature: string): TranslationKey | null => {
    if ([Feature.HOME, Feature.PROFILE].includes(feature as Feature)) {
        return null;
    }
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

    const welcomeMessage = userProfile?.name
      ? translate('dashboardWelcomeUser').replace('{name}', userProfile.name)
      : translate('dashboardWelcome');

    return (
        <div>
            <div className="mb-8 md:mb-12">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50">{welcomeMessage}</h1>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-800 p-6 sm:p-8 md:p-10 w-full mx-auto mb-8 card-enter">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                    {/* Text Section */}
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-primary mb-4">
                            {translate('introTitle')}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            {translate('introLine1')}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400">
                            {translate('introLine2')}
                        </p>
                    </div>
                    
                    {/* Image Section */}
                    <div className="md:col-span-3 flex justify-center items-center gap-2">
                        <img 
                            src="https://st5.depositphotos.com/81161912/66752/i/450/depositphotos_667522276-stock-photo-maharashtra-look-farmer-happy-farmer.jpg" 
                            alt={translate('maleFarmerAlt')} 
                            className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover transform -rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-300" 
                        />
                        <img 
                            src="https://wallpaperaccess.com/full/4293504.jpg"
                            alt={translate('ploughingFarmerAlt')}
                            className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover transform scale-110 hover:scale-125 z-10 transition-transform duration-300" 
                        />
                        <img 
                            src="https://media.istockphoto.com/photos/indian-farmer-women-on-farm-field-with-happy-face-picture-id907753228?k=6&m=907753228&s=170667a&w=0&h=jBDTI2l0CjqpQwitaL9SG1lIhDICiasm8BuoqbDNoBI=" 
                            alt={translate('femaleFarmerAlt')}
                            className="rounded-xl shadow-lg w-1/3 aspect-[3/4] object-cover transform rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-300" 
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8">
               <WeatherWidget 
                    location={userProfile?.location || ''} 
                    onClick={() => setActiveFeature(Feature.WEATHER_ADVISOR)} 
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {featureList.map((feature, index) => {
                     const TrendItem: React.FC<{trend: 'up' | 'down', crop: string, change: number}> = ({ trend, crop, change }) => (
                        <div className="flex items-center gap-1.5">
                            {trend === 'up' ? <TrendingUpIcon className="w-4 h-4 text-green-400" /> : <TrendingDownIcon className="w-4 h-4 text-red-400" />}
                            <p className="text-xs font-semibold text-slate-200">{crop}</p>
                            <p className={`text-xs font-bold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>{change.toFixed(1)}%</p>
                        </div>
                    );

                    return (
                        <button
                            key={feature.id}
                            onClick={() => setActiveFeature(feature.id)}
                            title={translate(feature.key)}
                            className="group card-enter relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-none transition-all duration-300 transform hover:-translate-y-2 h-52 sm:h-64"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div
                                className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundImage: `url(${feature.imageUrl})` }}
                            ></div>
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                            <div className="relative w-full h-full flex flex-col justify-between items-start p-4 text-white">
                                <div>
                                    <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-md">
                                        {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
                                    </div>
                                    <h3 className="font-bold text-base sm:text-lg text-left [text-shadow:0_2px_4px_rgba(0,0,0,0.8)]">
                                        {translate(feature.key)}
                                    </h3>
                                </div>
                                <div className="w-full">
                                    {feature.id === Feature.MARKET_GURU && marketTrends && (
                                        <div className="bg-black/30 backdrop-blur-sm p-2 rounded-md text-left text-xs space-y-1">
                                            {marketTrends.topRisers?.[0] && <TrendItem trend="up" crop={marketTrends.topRisers[0].cropName} change={marketTrends.topRisers[0].change} />}
                                            {marketTrends.topFallers?.[0] && <TrendItem trend="down" crop={marketTrends.topFallers[0].cropName} change={marketTrends.topFallers[0].change} />}
                                        </div>
                                    )}
                                     {feature.id === Feature.SCHEME_NAVIGATOR && trendingScheme && (
                                        <div className="bg-black/30 backdrop-blur-sm p-2 rounded-md text-left text-xs">
                                            <p className="font-bold text-primary-light mb-0.5">{translate('trendingSchemesTitle')}</p>
                                            <p className="font-semibold text-slate-200">{trendingScheme.name}</p>
                                        </div>
                                    )}
                                    {feature.id === Feature.CROP_DOCTOR && (
                                        <div className="mt-2 w-full">
                                            <span className="block w-full text-center bg-primary/80 hover:bg-primary text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors duration-200 backdrop-blur-sm">
                                                {translate('dashboardDiagnose')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            {totalUsage > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 text-center">{translate('dashboardAnalyticsTitle')}</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <Card className="lg:col-span-3 h-96 !p-4 sm:!p-6">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-4">{translate('featureUsageTitle')}</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={barData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,163,184,0.1)" />
                                    <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} hide />
                                    <YAxis allowDecimals={false} tick={{fill: '#64748b'}} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)'}}/>
                                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}/>
                                    <Bar dataKey="count" name={translate('featureUsageTitle')} fill="#16a34a" barSize={30} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="text-center">
                                <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">{translate('totalUsage')}</p>
                                <p className="text-6xl font-extrabold text-primary">{totalUsage}</p>
                            </Card>
                            <Card className="h-80 !p-2">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 text-center">{translate('usageDistributionTitle')}</h3>
                                <ResponsiveContainer width="100%" height="90%">
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
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                            
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
            )}

        </div>
    );
};

export default Dashboard;
