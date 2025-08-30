

import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { DashboardIcon } from './icons/DashboardIcon';


const AuthForm: React.FC<{ isLoginView: boolean, onToggle: () => void }> = ({ isLoginView, onToggle }) => {
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
        <>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">
                {isLoginView ? translate('loginTitle') : translate('signupTitle')}
            </h2>
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
        </>
    );
};


const Auth: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');
  const { translate } = useLanguage();

  const imageUrl = "https://c1.staticflickr.com/9/8179/8048336405_9059b193d2_b.jpg";

    if (view === 'landing') {
        return (
            <div 
                className="min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center text-white"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                <div className="relative z-10 text-center p-4 max-w-3xl flex flex-col items-center card-enter">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/80 rounded-2xl mb-6 border-2 border-white/20 shadow-lg">
                        <DashboardIcon className="w-9 h-9 sm:w-12 sm:h-12 text-white"/>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>
                        {translate('landingTitle')}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10" style={{textShadow: '0 1px 4px rgba(0,0,0,0.7)'}}>
                        {translate('landingSubtitle')}
                    </p>
                    <Button onClick={() => setView('login')} className="!px-12 !py-4 !text-xl !rounded-full shadow-2xl hover:shadow-primary/50 transform hover:scale-105">
                        {translate('getStartedButton')}
                    </Button>
                </div>
            </div>
        );
    }
    
    // Form view
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <button onClick={() => setView('landing')} className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 transition-transform hover:scale-105" aria-label="Go to landing page">
                        <DashboardIcon className="w-9 h-9 text-white"/>
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary">
                        {translate('headerTitle')}
                    </h1>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-800 p-8 card-enter">
                    <AuthForm
                        isLoginView={view === 'login'}
                        onToggle={() => setView(view === 'login' ? 'signup' : 'login')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Auth;