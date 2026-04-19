import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';
import { storageService } from '../services/storageService';

const TOUR_STORAGE_KEY = 'kisan_tour_completed';

const OnboardingTour: React.FC = () => {
    const { translate } = useLanguage();
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isCompleted = storageService.getItem(TOUR_STORAGE_KEY);
        if (!isCompleted) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    const handleSkip = () => {
        setIsVisible(false);
        storageService.setItem(TOUR_STORAGE_KEY, true);
    };

    if (!isVisible) return null;

    const steps = [
        { title: translate('tourWelcomeTitle'), text: translate('tourWelcomeText'), target: null },
        { title: translate('tourNavTitle'), text: translate('tourNavText'), target: 'nav-container' },
        { title: translate('tourSettingsTitle'), text: translate('tourSettingsText'), target: 'header-settings' },
        { title: translate('tourDashboardTitle'), text: translate('tourDashboardText'), target: 'dashboard-main' }
    ];

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={handleSkip}
                    />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-primary-light" />
                        
                        <div className="mb-6">
                            <motion.h3 
                                key={`title-${step}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight"
                            >
                                {currentStep.title}
                            </motion.h3>
                            <motion.p 
                                key={`text-${step}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed"
                            >
                                {currentStep.text}
                            </motion.p>
                        </div>

                        <div className="flex items-center justify-between mt-8">
                            <div className="flex gap-2">
                                {steps.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={handleSkip} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                    {translate('tourSkip')}
                                </button>
                                
                                <div className="flex gap-2">
                                    {step > 0 && (
                                        <button onClick={handleBack} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            {translate('tourBack')}
                                        </button>
                                    )}
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={step === steps.length - 1 ? handleSkip : handleNext}
                                        className="px-6 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                                    >
                                        {step === steps.length - 1 ? translate('tourFinish') : translate('tourNext')}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingTour;