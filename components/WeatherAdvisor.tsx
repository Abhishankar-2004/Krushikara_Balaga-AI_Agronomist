
import React, { useState, useCallback, useEffect } from 'react';
import { getWeatherAdvisory, WeatherAdvisory } from '../services/geminiService';
import { useLanguage } from '../LanguageContext';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { MicIcon } from './icons/MicIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { Language, Feature } from '../types';
import { WeatherConditionIcon } from './icons/WeatherConditionIcon';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface WeatherAdvisorProps {
  defaultLocation?: string;
}

const CustomizedAxisTick: React.FC<any> = ({ x, y, payload }) => {
    if (!payload?.payload) return null;
    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" className="text-[10px] sm:text-xs font-semibold dark:fill-slate-400">
                {payload.value}
            </text>
            <foreignObject x={-12} y={20} width={24} height={24}>
                 <WeatherConditionIcon condition={payload.payload.condition} className="w-6 h-6 text-amber-500" />
            </foreignObject>
        </g>
    );
};

const CustomTooltipContent: React.FC<any> = ({ active, payload, label }) => {
    const { translate } = useLanguage();
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-slate-800/90 backdrop-blur-sm text-white p-3 rounded-lg border border-slate-700 shadow-xl">
                <p className="font-bold text-sm mb-2">{label}</p>
                <div className="text-xs space-y-1">
                    <p className="text-green-400">{`${translate('highShort')}: ${data.tempHigh}°C`}</p>
                    <p className="text-blue-400">{`${translate('lowShort')}: ${data.tempLow}°C`}</p>
                    <p className="text-slate-300">{`${translate('wind')}: ${data.windSpeed} km/h`}</p>
                    <p className="text-slate-300">{`${translate('humidity')}: ${data.humidity}%`}</p>
                </div>
            </div>
        );
    }
    return null;
};

const WeatherAdvisor: React.FC<WeatherAdvisorProps> = ({ defaultLocation }) => {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [location, setLocation] = useState<string>('');
  const [advisory, setAdvisory] = useState<WeatherAdvisory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (defaultLocation) setLocation(defaultLocation);
  }, [defaultLocation]);

  const handleSearch = useCallback(async () => {
    if (!location.trim() || !user?.email) {
      setError(translate('weatherQueryError'));
      return;
    }
    setIsLoading(true);
    setError('');
    setAdvisory(null);
    try {
      const resultJson = await getWeatherAdvisory(location, language);
      const result: WeatherAdvisory = JSON.parse(resultJson);
      if (result.error) {
        setError(result.error);
      } else {
        setAdvisory(result);
        storageService.setItem('lastWeather', result);
        analyticsService.logFeatureUse(Feature.WEATHER_ADVISOR, user.email);
      }
    } catch (err) {
      setError(translate('weatherFetchError'));
    } finally {
      setIsLoading(false);
    }
  }, [location, language, translate, user]);
  
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(translate('voiceSupportError'));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === Language.KN ? 'kn-IN' : 'en-IN';
    recognition.onstart = () => { setIsListening(true); setError(''); };
    recognition.onresult = (event: any) => setLocation(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const referenceDay = advisory?.forecast?.[1]?.day || null;

  return (
    <Card>
      <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('weatherAdvisorTitle')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg">{translate('weatherAdvisorDescription')}</p>

      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
         <div className="w-full relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={translate('weatherQueryPlaceholder')}
              className="w-full px-4 py-3 pr-12 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
            <button
                onClick={handleVoiceInput}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100'}`}
            >
                <MicIcon className="w-5 h-5" />
            </button>
        </div>

        <Button onClick={handleSearch} disabled={isLoading || isListening}>
          {isLoading ? <Spinner /> : translate('getForecastButton')}
        </Button>

        {error && <p className="text-red-600 font-semibold">{error}</p>}

        {advisory && advisory.forecast && (
          <div className="mt-6 w-full bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light text-center">
                {translate('forecastFor').replace('{location}', advisory.location)}
            </h3>
            
            <div className="h-72 sm:h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={advisory.forecast} margin={{ top: 10, right: 10, bottom: 40, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="day" tick={<CustomizedAxisTick />} height={60} />
                        <YAxis yAxisId="left" stroke="#8884d8" unit="°" />
                        <Tooltip content={<CustomTooltipContent />} />
                        <Legend wrapperStyle={{ paddingTop: '40px' }} />
                        {referenceDay && (
                            <ReferenceLine yAxisId="left" x={referenceDay} stroke="#64748b" strokeDasharray="4 4" label={{ value: translate('pastData'), position: 'top', fill: '#64748b', fontSize: 10 }} />
                        )}
                        <Line yAxisId="left" name={translate('highShort')} type="monotone" dataKey="tempHigh" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line yAxisId="left" name={translate('lowShort')} type="monotone" dataKey="tempLow" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h4 className="font-bold text-slate-800 dark:text-blue-300 flex items-center gap-2 mb-2">
                <LightbulbIcon className="w-5 h-5 text-amber-500" />
                {translate('aiAdvisory')}
              </h4>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">{advisory.advisory}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherAdvisor;
