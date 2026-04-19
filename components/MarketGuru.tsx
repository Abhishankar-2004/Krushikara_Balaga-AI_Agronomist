

import React, { useState, useCallback, useEffect } from 'react';
import { getMarketAnalysis, getMarketTrends, MarketTrends, MarketTrendItem } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { MicIcon } from './icons/MicIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import { MinusIcon } from './icons/MinusIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { useLanguage } from '../LanguageContext';
import { Language, Feature } from '../types';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';

interface MarketAnalysisResult {
  crop: string;
  trend: 'Rising' | 'Falling' | 'Stable';
  recommendation: string;
  summary: string;
  priceData: {
    day: string;
    price: number;
  }[];
  error?: string;
}

const TrendChart: React.FC<{ data: MarketTrendItem[], color: string, title: string }> = ({ data, color, title }) => {
    const { translate } = useLanguage();
    
    const reversedData = [...data].reverse();

    return (
        <div className="h-72">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 text-center">{title}</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={reversedData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128, 163, 184, 0.2)" />
                    <XAxis type="number" domain={['auto', 'auto']} tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis type="category" dataKey="cropName" width={100} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} interval={0} />
                    <Tooltip 
                         contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                            borderColor: 'rgb(51, 65, 85)',
                            borderRadius: '0.75rem',
                            fontSize: '14px'
                        }}
                        formatter={(value: number) => [`${value}%`, translate('percentageChange')]}
                        labelStyle={{ fontWeight: 'bold', color: '#f1f5f9' }}
                        itemStyle={{ color: '#94a3b8' }}
                    />
                    <ReferenceLine x={0} stroke="#64748b" />
                    <Bar dataKey="change" name={translate('percentageChange')} barSize={20} fill={color} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


const MarketTrendsSection: React.FC = () => {
    const { language, translate } = useLanguage();
    const [trends, setTrends] = useState<MarketTrends | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTrends = async () => {
            setIsLoading(true);
            setError('');
            try {
                const resultJson = await getMarketTrends(language);
                const result: MarketTrends = JSON.parse(resultJson);
                if (result.error) {
                    setError(result.error);
                } else {
                    setTrends(result);
                }
            } catch (err) {
                setError(translate('aiParsingError'));
            } finally {
                setIsLoading(false);
            }
        };
        fetchTrends();
    }, [language, translate]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-48"><Spinner /></div>;
    }

    if (error || !trends || (!trends.topRisers?.length && !trends.topFallers?.length)) {
        return null;
    }

    return (
        <div>
            <div className="border-t border-slate-200 dark:border-slate-800 my-10"></div>
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">{translate('marketTrendsTitle')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                {trends.topRisers?.length > 0 && (
                     <TrendChart data={trends.topRisers} color="#16a34a" title={translate('topRisers')} />
                )}
                 {trends.topFallers?.length > 0 && (
                     <TrendChart data={trends.topFallers} color="#dc2626" title={translate('topFallers')} />
                )}
            </div>
        </div>
    );
};


const MarketGuru: React.FC = () => {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [query, setQuery] = useState<string>('');
  const [analysis, setAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = useCallback(async () => {
    if (!query.trim() || !user?.email) {
      setError(translate('marketQueryError'));
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const resultJson = await getMarketAnalysis(query, language);
      const result: MarketAnalysisResult = JSON.parse(resultJson);
      if (result.error) {
        setError(result.error);
      } else {
        setAnalysis(result);
        analyticsService.logFeatureUse(Feature.MARKET_GURU, user.email);
      }
    } catch (err) {
      setError(translate('aiParsingError'));
    } finally {
      setIsLoading(false);
    }
  }, [query, language, translate, user]);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(translate('voiceSupportError'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === Language.KN ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.onerror = (event: any) => {
      setError(translate('voiceRecognitionError').replace('{error}', event.error));
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  
  const getTrendDisplay = (trend: MarketAnalysisResult['trend']) => {
    switch(trend) {
      case 'Rising':
        return <div className="flex items-center gap-2 text-green-600 dark:text-green-400"><TrendingUpIcon className="w-8 h-8" /><span className="text-xl font-bold">Rising</span></div>;
      case 'Falling':
        return <div className="flex items-center gap-2 text-red-600 dark:text-red-400"><TrendingDownIcon className="w-8 h-8" /><span className="text-xl font-bold">Falling</span></div>;
      case 'Stable':
        return <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><MinusIcon className="w-8 h-8" /><span className="text-xl font-bold">Stable</span></div>;
      default:
        return null;
    }
  }

  return (
    <Card>
      <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('marketGuruTitle')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg">{translate('marketGuruDescription')}</p>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
        <div className="w-full relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translate('marketQueryPlaceholder')}
            className="w-full px-4 py-3 pr-12 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          <button
            onClick={handleVoiceInput}
            aria-label={translate('voiceInputLabel')}
            title={translate('voiceInputLabel')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            <MicIcon className="w-5 h-5" />
          </button>
        </div>
        
        <Button onClick={handleAnalyze} disabled={isLoading || isListening}>
          {isLoading ? <Spinner /> : translate('getMarketInsightsButton')}
        </Button>

        {error && <p className="text-red-600 font-semibold">{error}</p>}
        
        {analysis && (
          <div className="mt-6 w-full bg-slate-100 dark:bg-slate-800/60 p-4 sm:p-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-primary-dark dark:text-primary-light text-center">{translate('marketSummaryFor').replace('{crop}', analysis.crop)}</h3>
            
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
               <div className="text-center">
                  <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">{translate('currentTrend')}</h4>
                  {getTrendDisplay(analysis.trend)}
               </div>
            </div>

            {analysis.priceData && analysis.priceData.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2 text-center">{translate('marketPriceTrend')}</h4>
                <div className="h-64 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analysis.priceData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                      <XAxis dataKey="day" stroke="rgb(100 116 139)" fontSize={12} />
                      <YAxis stroke="rgb(100 116 139)" fontSize={12} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                            borderColor: 'rgb(51, 65, 85)',
                            borderRadius: '0.75rem',
                            fontSize: '14px'
                        }}
                        itemStyle={{ color: '#94a3b8' }}
                        labelStyle={{ fontWeight: 'bold', color: '#f1f5f9' }}
                        formatter={(value: number) => [new Intl.NumberFormat(language === 'kn' ? 'kn-IN' : 'en-IN', { style: 'currency', currency: 'INR' }).format(value), translate('navMarketGuru')]}
                      />
                      <Line type="monotone" dataKey="price" name={analysis.crop} stroke="#16a34a" strokeWidth={3} activeDot={{ r: 8 }} dot={{ fill: '#16a34a' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h4 className="font-semibold text-secondary-dark dark:text-blue-300 flex items-center gap-2 mb-2">
                  <LightbulbIcon className="w-5 h-5" />
                  {translate('recommendation')}
                </h4>
                <p className="font-bold text-lg text-secondary-dark dark:text-blue-200">{analysis.recommendation}</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{translate('summary')}</h4>
              <p className="text-base text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-slate-800 p-4 rounded-md border-l-4 border-amber-400 dark:border-amber-600">{analysis.summary}</p>
            </div>
          </div>
        )}
      </div>

      <MarketTrendsSection />
    </Card>
  );
};

export default MarketGuru;