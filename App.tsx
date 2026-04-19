import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feature, Language, UserProfile } from './types';
import Dashboard from './components/Dashboard';
import CropDoctor from './components/CropDoctor';
import MarketGuru from './components/MarketGuru';
import SchemeNavigator from './components/SchemeNavigator';
import WeatherAdvisor from './components/WeatherAdvisor';
import FertilizerCalculator from './components/FertilizerCalculator';
import CommunityConnect from './components/CommunityConnect';
import LoanAdvisor from './components/LoanAdvisor';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactUs from './components/ContactUs';
import { HomeIcon } from './components/icons/HomeIcon';
import { LeafIcon } from './components/icons/LeafIcon';
import { MarketIcon } from './components/icons/MarketIcon';
import { GovIcon } from './components/icons/GovIcon';
import { LanguageIcon } from './components/icons/LanguageIcon';
import { WeatherIcon } from './components/icons/WeatherIcon';
import { ScienceIcon } from './components/icons/ScienceIcon';
import { CommunityIcon } from './components/icons/CommunityIcon';
import { LoanIcon } from './components/icons/LoanIcon';
import { ProfileIcon } from './components/icons/ProfileIcon';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { useLanguage } from './LanguageContext';
import { useTheme, Theme } from './ThemeContext';
import { useAuth } from './AuthContext';
import Auth from './components/Auth';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { AnalyticsIcon } from './components/icons/AnalyticsIcon';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import OnboardingTour from './components/OnboardingTour';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.HOME);
  const { language, setLanguage, translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const { user, logout, updateUser } = useAuth();

  const handleProfileUpdate = (newProfile: UserProfile) => {
    updateUser(newProfile);
    setActiveFeature(Feature.HOME);
  };
  
  if (!user) {
    return <Auth />;
  }

  const renderFeature = () => {
    switch (activeFeature) {
      case Feature.HOME:
        return <Dashboard setActiveFeature={setActiveFeature} userProfile={user} />;
      case Feature.CROP_DOCTOR:
        return <CropDoctor />;
      case Feature.MARKET_GURU:
        return <MarketGuru />;
      case Feature.SCHEME_NAVIGATOR:
        return <SchemeNavigator />;
      case Feature.WEATHER_ADVISOR:
        return <WeatherAdvisor defaultLocation={user?.location} />;
      case Feature.FERTILIZER_CALCULATOR:
        return <FertilizerCalculator />;
      case Feature.COMMUNITY_CONNECT:
        return <CommunityConnect userProfile={user}/>;
      case Feature.LOAN_ADVISOR:
        return <LoanAdvisor />;
      case Feature.PROFILE:
        return <Profile userProfile={user} onProfileUpdate={handleProfileUpdate} />;
      case Feature.ANALYTICS:
        return <Analytics />;
      case Feature.ABOUT_US:
        return <AboutUs />;
      case Feature.PRIVACY_POLICY:
        return <PrivacyPolicy />;
      case Feature.CONTACT_US:
        return <ContactUs />;
      default:
        return <Dashboard setActiveFeature={setActiveFeature} userProfile={user} />;
    }
  };

  const navItems = [
    { id: Feature.HOME, key: 'navHome' as const, icon: <HomeIcon /> },
    { id: Feature.CROP_DOCTOR, key: 'navCropDoctor' as const, icon: <LeafIcon /> },
    { id: Feature.MARKET_GURU, key: 'navMarketGuru' as const, icon: <MarketIcon /> },
    { id: Feature.SCHEME_NAVIGATOR, key: 'navSchemeNavigator' as const, icon: <GovIcon /> },
    { id: Feature.WEATHER_ADVISOR, key: 'navWeatherAdvisor' as const, icon: <WeatherIcon /> },
    { id: Feature.FERTILIZER_CALCULATOR, key: 'navFertilizerCalculator' as const, icon: <ScienceIcon /> },
    { id: Feature.LOAN_ADVISOR, key: 'navLoanAdvisor' as const, icon: <LoanIcon /> },
    { id: Feature.COMMUNITY_CONNECT, key: 'navCommunityConnect' as const, icon: <CommunityIcon /> },
    { id: Feature.ANALYTICS, key: 'navAnalytics' as const, icon: <AnalyticsIcon /> },
  ];

  const featureLinks = navItems.slice(1);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col relative overflow-x-hidden">
      <OnboardingTour />
      
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 w-full border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => setActiveFeature(Feature.HOME)} className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <DashboardIcon className="w-6 h-6 text-white"/>
             </div>
             <h1 className="text-xl font-bold text-primary tracking-tight">
                 {translate('headerTitle')}
             </h1>
          </button>
          
          <div id="header-settings" className="flex items-center gap-2">
            <button
                onClick={logout}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                aria-label="Logout"
                title="Logout"
            >
                <LogoutIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setActiveFeature(Feature.PROFILE)}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label={translate('navProfile')}
                title={translate('navProfile')}
            >
                <ProfileIcon className="w-5 h-5" />
            </button>
            
            {/* Visual Theme Toggle */}
            <motion.button
                onClick={toggleTheme}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-8 flex items-center bg-slate-200 dark:bg-slate-700 rounded-full px-1 cursor-pointer overflow-hidden border border-slate-300 dark:border-slate-600 shadow-inner"
                aria-label={theme === Theme.LIGHT ? translate('toggleThemeDark') : translate('toggleThemeLight')}
                title={theme === Theme.LIGHT ? translate('toggleThemeDark') : translate('toggleThemeLight')}
            >
                <motion.div
                    className="w-6 h-6 bg-white dark:bg-slate-900 rounded-full shadow-lg flex items-center justify-center z-10"
                    animate={{ x: theme === Theme.LIGHT ? 0 : 22 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {theme === Theme.LIGHT ? (
                                <MoonIcon className="w-4 h-4 text-slate-600" />
                            ) : (
                                <SunIcon className="w-4 h-4 text-amber-400" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
                
                {/* Background stars/clouds effect (optional visuals) */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-2 items-center opacity-30">
                    <SunIcon className="w-3 h-3 text-amber-500 opacity-20 dark:opacity-100" />
                    <MoonIcon className="w-3 h-3 text-slate-400 opacity-100 dark:opacity-20" />
                </div>
            </motion.button>

             <div className="relative">
              <button 
                onClick={() => setIsResourcesDropdownOpen(!isResourcesDropdownOpen)}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-expanded={isResourcesDropdownOpen}
                aria-haspopup="true"
                title={translate('resourcesDropdown')}
              >
                <InfoIcon className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isResourcesDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl z-20 border border-slate-200 dark:border-slate-700 overflow-hidden"
                    onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => { setActiveFeature(Feature.ABOUT_US); setIsResourcesDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {translate('footerAboutUs')}
                    </button>
                    <button
                      onClick={() => { setActiveFeature(Feature.PRIVACY_POLICY); setIsResourcesDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {translate('footerPrivacyPolicy')}
                    </button>
                    <button
                      onClick={() => { setActiveFeature(Feature.CONTACT_US); setIsResourcesDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {translate('footerContactUs')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
                title={translate('language')}
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="hidden md:inline font-bold uppercase tracking-wider text-xs">{language}</span>
              </button>
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-3 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl z-20 border border-slate-200 dark:border-slate-700 overflow-hidden"
                    onMouseLeave={() => setIsLangDropdownOpen(false)}
                  >
                    <button
                      onClick={() => { setLanguage(Language.EN); setIsLangDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {translate('english')}
                    </button>
                    <button
                      onClick={() => { setLanguage(Language.KN); setIsLangDropdownOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {translate('kannada')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <nav id="nav-container" className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg shadow-sm sticky top-[65px] z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex justify-center overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFeature(item.id)}
              className={`relative flex-shrink-0 px-4 py-4 text-sm font-bold flex items-center gap-2 transition-all duration-200 border-b-4 ${
                activeFeature === item.id
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
              <span className="hidden sm:inline-block tracking-tight">{translate(item.key)}</span>
            </button>
          ))}
        </div>
      </nav>

      <main id="dashboard-main" className="container mx-auto p-4 md:p-8 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-[60vh]"
          >
            {renderFeature()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 font-sans border-t border-slate-900">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <DashboardIcon className="w-6 h-6 text-white"/>
                         </div>
                         <h2 className="text-2xl font-bold text-white tracking-tight">{translate('headerTitle')}</h2>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm">
                        {translate('footerSlogan')}
                    </p>
                    <div className="flex gap-4">
                        <motion.a whileHover={{ y: -3, scale: 1.1 }} href="https://github.com/Abhishankar-2004" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                            <i className="fab fa-github"></i>
                        </motion.a>
                        <motion.a whileHover={{ y: -3, scale: 1.1 }} href="https://www.instagram.com/abhi_shankareddy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                            <i className="fab fa-instagram"></i>
                        </motion.a>
                        <motion.a whileHover={{ y: -3, scale: 1.1 }} href="https://www.linkedin.com/in/abhi-s-3a4197310/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                            <i className="fab fa-linkedin-in"></i>
                        </motion.a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        {translate('footerColumnFeatures')}
                    </h4>
                    <ul className="space-y-4 text-sm">
                      {featureLinks.slice(0, 4).map(item => (
                          <li key={`footer-f1-${item.id}`}>
                            <button onClick={() => setActiveFeature(item.id)} className="hover:text-primary transition-colors text-left w-full flex items-center gap-2 group">
                              <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                              {translate(item.key)}
                            </button>
                          </li>
                      ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        {translate('footerColumnQuickLinks')}
                    </h4>
                    <ul className="space-y-4 text-sm">
                      {featureLinks.slice(4).map(item => (
                          <li key={`footer-f2-${item.id}`}>
                            <button onClick={() => setActiveFeature(item.id)} className="hover:text-primary transition-colors text-left w-full flex items-center gap-2 group">
                              <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                              {translate(item.key)}
                            </button>
                          </li>
                      ))}
                      <li>
                        <button onClick={() => setActiveFeature(Feature.PROFILE)} className="hover:text-primary transition-colors text-left w-full flex items-center gap-2 group">
                           <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                           {translate('navProfile')}
                        </button>
                      </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded-full"></span>
                        {translate('resourcesDropdown')}
                    </h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><button onClick={() => setActiveFeature(Feature.ABOUT_US)} className="hover:text-primary transition-colors flex items-center gap-2 group">
                            <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                            {translate('footerAboutUs')}
                        </button></li>
                        <li><button onClick={() => setActiveFeature(Feature.PRIVACY_POLICY)} className="hover:text-primary transition-colors flex items-center gap-2 group">
                            <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                            {translate('footerPrivacyPolicy')}
                        </button></li>
                        <li><button onClick={() => setActiveFeature(Feature.CONTACT_US)} className="hover:text-primary transition-colors flex items-center gap-2 group">
                            <span className="w-1 h-1 bg-slate-700 rounded-full group-hover:bg-primary transition-colors"></span>
                            {translate('footerContactUs')}
                        </button></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500 tracking-wider uppercase">
                <p>{translate('footerCopyright').replace('{year}', new Date().getFullYear().toString())}</p>
                <div className="flex items-center gap-2">
                    <span>{translate('footerText').split('for')[0]}</span>
                    <span className="text-primary font-bold">GEMINI AI</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;