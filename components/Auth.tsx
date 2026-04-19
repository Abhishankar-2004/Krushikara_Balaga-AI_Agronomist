import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { DashboardIcon } from './icons/DashboardIcon';
import { HomeIcon } from './icons/HomeIcon';


const AuthForm: React.FC<{ isLoginView: boolean, onToggle: () => void, onBack: () => void }> = ({ isLoginView, onToggle, onBack }) => {
    const { login, signup } = useAuth();
    const { translate } = useLanguage();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLoginView) {
                if (!login(email, password)) {
                    setError(translate('invalidCredentialsError'));
                }
            } else {
                if (!name || !email || !password) {
                    setError(translate('fillAllFieldsError'));
                    setIsLoading(false);
                    return;
                }
                if (!signup(name, email, password)) {
                    setError(translate('userExistsError'));
                }
            }
        } catch (err) {
            setError(translate('unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 text-base bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
                <button 
                    onClick={onBack}
                    className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-sm font-semibold"
                >
                    <HomeIcon className="w-4 h-4" />
                    <span>Back</span>
                </button>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {isLoginView ? translate('loginTitle') : translate('signupTitle')}
                </h2>
                <div className="w-10"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLoginView && (
                <div>
                    <label htmlFor="name" className={labelClasses}>{translate('nameLabel')}</label>
                    <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                    placeholder={translate('namePlaceholder')}
                    required={!isLoginView}
                    />
                </div>
                )}
                <div>
                <label htmlFor="email" className={labelClasses}>{translate('emailLabel')}</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                    placeholder={translate('emailPlaceholder')}
                    required
                />
                </div>
                <div>
                <label htmlFor="password" className={labelClasses}>{translate('passwordLabel')}</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                    placeholder={translate('passwordPlaceholder')}
                    required
                />
                </div>
                
                {error && <p className="text-red-600 font-semibold text-sm text-center">{error}</p>}

                <Button type="submit" disabled={isLoading} className="w-full !py-3 !text-lg !font-bold">
                {isLoading ? <Spinner /> : (isLoginView ? translate('loginButton') : translate('signupButton'))}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                {isLoginView ? translate('authPromptLogin') : translate('authPromptSignup')}
                <button
                onClick={onToggle}
                className="font-semibold text-primary hover:underline ml-2"
                >
                {isLoginView ? translate('authToggleSignup') : translate('authToggleLogin')}
                </button>
            </p>
        </div>
    );
};


const Auth: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const { translate } = useLanguage();

  const imageUrl = "https://images.unsplash.com/photo-1500382017468-9049fee74a62?q=80&w=2000&auto=format&fit=crop";

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsBgLoaded(true);
  }, []);

    if (view === 'landing') {
        return (
            <div 
                className="fixed inset-0 w-full h-full bg-slate-950 flex flex-col justify-center items-center text-white overflow-hidden"
            >
                {/* Background Image with Fallback and Smooth Transition */}
                <div 
                    className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${isBgLoaded ? 'opacity-40' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                
                {/* Animated Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/70 to-primary/20"></div>

                <div className="relative z-10 text-center p-6 max-w-4xl flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-primary/90 rounded-3xl mb-8 border-2 border-white/30 shadow-2xl backdrop-blur-md transform hover:rotate-3 transition-transform duration-300">
                        <DashboardIcon className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-lg"/>
                    </div>
                    
                    <div className="card-enter">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight" style={{textShadow: '0 4px 12px rgba(0,0,0,0.8)'}}>
                            <span className="text-white">{translate('landingTitle').split(' ').slice(0, -2).join(' ')} </span>
                            <span className="text-primary-light">{translate('landingTitle').split(' ').slice(-2).join(' ')}</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium" style={{textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>
                            {translate('landingSubtitle')}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                onClick={() => setView('login')} 
                                className="!px-14 !py-5 !text-2xl !rounded-full shadow-[0_0_30px_rgba(22,163,74,0.4)] hover:shadow-[0_0_50px_rgba(22,163,74,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                {translate('getStartedButton')}
                            </Button>
                            <button 
                                onClick={() => setView('signup')}
                                className="px-10 py-4 text-lg font-bold text-white border-2 border-white/40 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                            >
                                {translate('authToggleSignup')}
                            </button>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-60 hidden sm:block">
                        <div className="w-1 h-8 bg-gradient-to-b from-white to-transparent rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div 
                    className="w-full h-full bg-cover bg-center scale-110 blur-xl"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                 <div className="text-center mb-8">
                    <button 
                        onClick={() => setView('landing')} 
                        className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 transition-transform hover:scale-110 shadow-lg hover:shadow-primary/40" 
                    >
                        <DashboardIcon className="w-9 h-9 text-white"/>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
                        {translate('headerTitle')}
                    </h1>
                </div>
                
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl dark:shadow-none dark:border dark:border-slate-800 p-8 sm:p-10 card-enter overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-primary-light"></div>
                    
                    <AuthForm
                        isLoginView={view === 'login'}
                        onToggle={() => setView(view === 'login' ? 'signup' : 'login')}
                        onBack={() => setView('landing')}
                    />
                </div>
                
                <p className="mt-10 text-center text-slate-400 text-xs font-medium uppercase tracking-widest">
                    Your AI companion for a prosperous harvest
                </p>
            </div>
        </div>
    );
};

export default Auth;