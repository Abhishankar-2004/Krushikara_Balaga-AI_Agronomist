



import React, { useState, useEffect } from 'react';
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


const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.HOME);
  const { language, setLanguage, translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const { user, logout, updateUser } = useAuth();

  const handleProfileUpdate = (newProfile: UserProfile) => {
    updateUser(newProfile);
    setActiveFeature(Feature.HOME); // Go to dashboard after saving profile
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

  const footerLinks1 = navItems.slice(1, 5); // Crop Doctor, Market Guru, Scheme Nav, Weather
  const footerLinks2 = navItems.slice(5);   // Fertilizer, Loan, Community, Analytics


  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 w-full border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button onClick={() => setActiveFeature(Feature.HOME)} className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <DashboardIcon className="w-6 h-6 text-white"/>
             </div>
             <h1 className="text-xl font-bold text-primary">
                 {translate('headerTitle')}
             </h1>
          </button>
          <div className="flex items-center gap-2">
            <button
                onClick={logout}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Logout"
                title="Logout"
            >
                <LogoutIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setActiveFeature(Feature.PROFILE)}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={translate('navProfile')}
                title={translate('navProfile')}
            >
                <ProfileIcon className="w-5 h-5" />
            </button>
            <button
                onClick={toggleTheme}
                className="text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={theme === Theme.LIGHT ? translate('toggleThemeDark') : translate('toggleThemeLight')}
                title={theme === Theme.LIGHT ? translate('toggleThemeDark') : translate('toggleThemeLight')}
            >
                {theme === Theme.LIGHT ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-expanded={isLangDropdownOpen}
                aria-haspopup="true"
                title={translate('language')}
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="hidden md:inline font-semibold">{language.toUpperCase()}</span>
              </button>
              {isLangDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg z-20 border border-slate-200 dark:border-slate-700"
                  onMouseLeave={() => setIsLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => { setLanguage(Language.EN); setIsLangDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {translate('english')}
                  </button>
                  <button
                    onClick={() => { setLanguage(Language.KN); setIsLangDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {translate('kannada')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg shadow-sm sticky top-[65px] z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex justify-center overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFeature(item.id)}
              title={translate(item.key)}
              className={`relative flex-shrink-0 px-2 sm:px-4 py-3 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors duration-200 border-b-4 ${
                activeFeature === item.id
                  ? 'text-primary border-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary-light border-transparent hover:border-primary/50'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
              <span className="hidden sm:inline-block">{translate(item.key)}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div key={activeFeature} className="fade-in">
          {renderFeature()}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
            <div className="row">
                <div className="footer-col">
                    <h4>{translate('headerTitle')}</h4>
                    <ul>
                        <li><button onClick={() => setActiveFeature(Feature.ABOUT_US)}>{translate('footerAboutUs')}</button></li>
                        <li><button onClick={() => { /* no-op */ }}>{translate('footerPrivacyPolicy')}</button></li>
                        <li className="!mt-4"><p className="text-sm text-[#bbbbbb] font-sans">{translate('footerCopyright').replace('{year}', new Date().getFullYear().toString())}</p></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{translate('footerColumnFeatures')}</h4>
                    <ul>
                      {footerLinks1.map(item => (
                          <li key={`footer-link-${item.id}`}>
                            <button onClick={() => setActiveFeature(item.id)}>{translate(item.key)}</button>
                          </li>
                      ))}
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{translate('footerColumnQuickLinks')}</h4>
                    <ul>
                      {footerLinks2.map(item => (
                          <li key={`footer-link-${item.id}`}>
                            <button onClick={() => setActiveFeature(item.id)}>{translate(item.key)}</button>
                          </li>
                      ))}
                      <li><button onClick={() => setActiveFeature(Feature.PROFILE)}>{translate('navProfile')}</button></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>{translate('footerColumnFollowUs')}</h4>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
