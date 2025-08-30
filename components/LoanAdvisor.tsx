

import React, { useState, useCallback } from 'react';
import { getLoanInfo, LoanInfo } from '../services/geminiService';
import { useLanguage } from '../LanguageContext';
import { Language, Feature } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { MicIcon } from './icons/MicIcon';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../AuthContext';
import { LoanIcon } from './icons/LoanIcon';

const LoanInfoCard: React.FC<{ name: string, purpose: string, description: string }> = ({ name, purpose, description }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg dark:shadow-none border dark:border-slate-800 flex flex-col h-full card-enter">
        <h4 className="text-xl font-bold text-primary">{name}</h4>
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">{purpose}</p>
        <p className="text-slate-600 dark:text-slate-300 text-base flex-grow">{description}</p>
    </div>
);

const CommonLoansInfo: React.FC = () => {
    const { translate } = useLanguage();

    const loans = [
        { name: translate('kccLoanName'), purpose: translate('kccLoanPurpose'), description: translate('kccLoanDescription') },
        { name: translate('tractorLoanName'), purpose: translate('tractorLoanPurpose'), description: translate('tractorLoanDescription') },
        { name: translate('goldLoanName'), purpose: translate('goldLoanPurpose'), description: translate('goldLoanDescription') },
    ];

    return (
        <div className="mt-16 w-full max-w-4xl mx-auto">
            <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center flex items-center justify-center gap-3">
                <LoanIcon className="w-7 h-7 text-primary"/>
                {translate('loanInfoTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loans.map((loan, index) => (
                    <LoanInfoCard key={index} name={loan.name} purpose={loan.purpose} description={loan.description} />
                ))}
            </div>
        </div>
    );
};


const LoanAdvisor: React.FC = () => {
    const { language, translate } = useLanguage();
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [purpose, setPurpose] = useState('');
    const [results, setResults] = useState<LoanInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = useCallback(async () => {
        if (!amount.trim() || !purpose.trim() || !user?.email) {
            setError(translate('loanQueryError'));
            return;
        }
        setIsLoading(true);
        setError('');
        setResults([]);
        setSearched(true);

        try {
            const resultJson = await getLoanInfo(parseFloat(amount), purpose, language);
            const loans: (LoanInfo & { error?: string })[] = JSON.parse(resultJson);
            
            if (loans.length > 0 && loans[0].error) {
                setError(loans[0].error);
                setResults([]);
            } else if (loans.length === 0) {
                 setError(translate('noLoansFoundError'));
                 setResults([]);
            }
            else {
                setResults(loans as LoanInfo[]);
                analyticsService.logFeatureUse(Feature.LOAN_ADVISOR, user.email);
            }
        } catch (err) {
            setError(translate('loanFetchError'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [amount, purpose, language, translate, user]);

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError(translate('voiceSupportError'));
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = language === Language.KN ? 'kn-IN' : 'en-IN';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => setError(translate('voiceRecognitionError').replace('{error}', event.error));
        recognition.onresult = (event: any) => setPurpose(event.results[0][0].transcript);

        recognition.start();
    };

    const inputClasses = "mt-1 w-full px-4 py-3 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <>
            <Card>
                <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('loanAdvisorTitle')}</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg max-w-2xl mx-auto">{translate('loanAdvisorDescription')}</p>

                <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-2xl mx-auto">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="loan-amount" className={labelClasses}>{translate('loanAmountLabel')}</label>
                        <input
                            id="loan-amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={translate('loanAmountPlaceholder')}
                            className={inputClasses}
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <label htmlFor="loan-purpose" className={labelClasses}>{translate('loanPurposeLabel')}</label>
                        <div className="relative mt-1">
                            <input
                                id="loan-purpose"
                                type="text"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder={translate('loanPurposePlaceholder')}
                                className={`${inputClasses} pr-12`}
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
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Button onClick={handleSearch} disabled={isLoading || isListening}>
                        {isLoading ? <Spinner /> : translate('findLoansButton')}
                    </Button>
                </div>
                
                {error && <p className="text-red-600 font-semibold mt-4 text-center">{error}</p>}

                {searched && !isLoading && results.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-primary-dark dark:text-primary-light mb-6 text-center">{translate('loanResultsTitle')}</h3>
                        <div className="space-y-6">
                            {results.map((loan, index) => (
                                <div key={index} className="bg-white dark:bg-slate-800/70 p-4 sm:p-6 rounded-xl shadow-lg dark:border dark:border-slate-700">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{loan.schemeName}</h4>
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">{loan.bank}</p>
                                    
                                    <p className="text-base text-slate-700 dark:text-slate-300 mb-4">{loan.summary}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                                        <div className="bg-green-50 dark:bg-slate-700 p-3 rounded-lg">
                                            <p className="font-semibold text-green-800 dark:text-green-300">{translate('interestRate')}</p>
                                            <p className="text-slate-700 dark:text-slate-200 font-medium">{loan.interestRate}</p>
                                        </div>
                                        <div className="bg-amber-50 dark:bg-slate-700 p-3 rounded-lg">
                                            <p className="font-semibold text-amber-800 dark:text-amber-300">{translate('maxLoanAmount')}</p>
                                            <p className="text-slate-700 dark:text-slate-200 font-medium">{loan.maxAmount}</p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-lg">
                                            <p className="font-semibold text-blue-800 dark:text-blue-300">{translate('tenure')}</p>
                                            <p className="text-slate-700 dark:text-slate-200 font-medium">{loan.tenure}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{translate('eligibility')}</h5>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">{loan.eligibility}</p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{translate('howToApply')}</h5>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">{loan.howToApply}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
            <CommonLoansInfo />
        </>
    );
};

export default LoanAdvisor;