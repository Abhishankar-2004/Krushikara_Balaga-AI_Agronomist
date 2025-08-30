
import React, { useState, useCallback } from 'react';
import { getSchemeInfo, SchemeInfoWithSources } from '../services/geminiService';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { MicIcon } from './icons/MicIcon';
import { LinkIcon } from './icons/LinkIcon';
import { useLanguage } from '../LanguageContext';
import { Language, Feature } from '../types';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import { getTrendingSchemes, TrendingScheme } from '../services/schemeService';
import { CheckIcon } from './icons/CheckIcon';


const TrendingSchemeCard: React.FC<{ scheme: TrendingScheme; onClick: (name: string) => void; }> = ({ scheme, onClick }) => {
    const { translate } = useLanguage();
    return (
        <button 
            onClick={() => onClick(scheme.name)}
            className="group flex-shrink-0 w-80 bg-white dark:bg-slate-900/80 rounded-2xl shadow-xl dark:shadow-none overflow-hidden snap-start border dark:border-slate-800 transition-all transform hover:-translate-y-1 text-left"
        >
            <div className="relative">
                <img src={scheme.imageUrl} alt={scheme.name} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h4 className="absolute bottom-0 left-0 p-4 font-bold text-lg text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">{scheme.name}</h4>
            </div>
            <div className="p-4 flex flex-col h-[calc(100%-10rem)]">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-grow">{scheme.description}</p>
                <div className="mt-auto bg-green-50 dark:bg-green-900/40 p-3 rounded-lg">
                    <p className="text-xs font-bold text-green-800 dark:text-green-300 uppercase">{translate('schemeBenefit')}</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-200 flex items-start gap-2">
                        <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{scheme.benefit}</span>
                    </p>
                </div>
            </div>
        </button>
    );
};

const TrendingSchemesSection: React.FC<{ onSchemeClick: (name: string) => void }> = ({ onSchemeClick }) => {
    const { language, translate } = useLanguage();
    const trendingSchemes = getTrendingSchemes(language);

    return (
        <div className="my-10">
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">{translate('trendingSchemesTitle')}</h3>
            <div className="flex gap-6 pb-4 -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
                {trendingSchemes.map((scheme) => (
                    <TrendingSchemeCard key={scheme.name} scheme={scheme} onClick={onSchemeClick} />
                ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 mt-10"></div>
        </div>
    );
};

const SchemeNavigator: React.FC = () => {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [query, setQuery] = useState<string>('');
  const [info, setInfo] = useState<SchemeInfoWithSources | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !user?.email) {
      setError(translate('schemeQueryError'));
      return;
    }
    setIsLoading(true);
    setError('');
    setInfo(null);
    try {
      const result = await getSchemeInfo(query, language);
      if (result.error) {
        setError(result.error);
        setInfo(null);
      } else if (!result.summary && result.sources.length === 0) {
        setError(translate('noSchemeInfoError'));
        setInfo(null);
      } else {
        setInfo(result);
        analyticsService.logFeatureUse(Feature.SCHEME_NAVIGATOR, user.email);
      }
    } catch (err) {
      setError(translate('schemeFetchError'));
      console.error(err);
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
      setQuery(event.results[0][0].transcript);
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
  
  const handleTrendingSchemeClick = (name: string) => {
    setQuery(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <Card>
      <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('schemeNavigatorTitle')}</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg">{translate('schemeNavigatorDescription')}</p>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
        <div className="w-full relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={translate('schemeQueryPlaceholder')}
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

        <Button onClick={handleSearch} disabled={isLoading || isListening}>
          {isLoading ? <Spinner /> : translate('findSchemesButton')}
        </Button>

      </div>
        
      <TrendingSchemesSection onSchemeClick={handleTrendingSchemeClick} />

      {isLoading && !info && (
        <div className="flex justify-center items-center h-40">
            <Spinner />
        </div>
      )}

      {error && !info && <p className="text-red-600 font-semibold text-center">{error}</p>}
      
      {info && (
          <div className="mt-6 w-full max-w-lg mx-auto bg-slate-100 dark:bg-slate-800/60 p-4 sm:p-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light mb-4 text-center">{translate('schemeInfoTitle')}</h3>
            
            {info.summary && (
              <div className="text-slate-700 dark:text-slate-300 bg-amber-50/50 dark:bg-slate-800 p-4 rounded-md border-l-4 border-amber-400 dark:border-amber-600 mb-6">
                  <p className="whitespace-pre-wrap font-sans text-base">{info.summary}</p>
              </div>
            )}
        
            {info.sources && info.sources.length > 0 && (
              <div>
                <h4 className="font-semibold text-primary-dark dark:text-primary-light text-lg mb-3">{translate('sourcesAndLinks')}</h4>
                <ul className="space-y-3">
                  {info.sources.map((source, i) => (
                    <li key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <LinkIcon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <a 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-semibold text-secondary hover:text-secondary-dark hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {source.title}
                        </a>
                         <p className="text-sm text-slate-500 dark:text-slate-400 break-words mt-1">{source.uri}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      )}
    </Card>
  );
};

export default SchemeNavigator;