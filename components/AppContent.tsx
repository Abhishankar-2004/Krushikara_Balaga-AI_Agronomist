import React, { useState } from 'react';
import { Feature, Language, UserProfile } from '../types';
import Dashboard from './Dashboard';
import CropDoctor from './CropDoctor';
import MarketGuru from './MarketGuru';
import SchemeNavigator from './SchemeNavigator';
import WeatherAdvisor from './WeatherAdvisor';
import FertilizerCalculator from './FertilizerCalculator';
import CommunityConnect from './CommunityConnect';
import LoanAdvisor from './LoanAdvisor';
import Profile from './Profile';
import Analytics from './Analytics';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import ContactUs from './ContactUs';
import { HomeIcon } from './icons/HomeIcon';
import { LeafIcon } from './icons/LeafIcon';
import { MarketIcon } from './icons/MarketIcon';
import { GovIcon } from './icons/GovIcon';
import { LanguageIcon } from './icons/LanguageIcon';
import { WeatherIcon } from './icons/WeatherIcon';
import { ScienceIcon } from './icons/ScienceIcon';
import { CommunityIcon } from './icons/CommunityIcon';
import { LoanIcon } from './icons/LoanIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { useLanguage } from '../LanguageContext';
import { useTheme, Theme } from '../ThemeContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useUserProfile } from '../hooks/useUserProfile';
import { LogoutIcon } from './icons/LogoutIcon';
import { AnalyticsIcon } from './icons/AnalyticsIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import { InfoIcon } from './icons/InfoIcon';

/**
 * Main application content component - only renders when user is authenticated
 * This component is wrapped by ProtectedRoute in App.tsx
 */
const AppContent: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.HOME);
  const { language, setLanguage, translate } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const { user } = useUser();
  const { profile: userProfile, updateProfile } = useUserProfile();

  const handleProfileUpdate = async (newProfile: UserProfile) => {
    const success = await updateProfile(newProfile);
    if (success) {
      setActiveFeature(Feature.HOME); // Go to dashboard after saving profile
    }
    // Error handling is managed by the useUserProfile hook
  };

  const logout = async () => {
    try {
      await signOut();
      // Clear any local storage or session data if needed
      localStorage.removeItem('user-profile');
      // Redirect will be handled automatically by Clerk
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload as fallback
      window.location.reload();
    }
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case Feature.HOME:
        return <Dashboard setActiveFeature={setActiveFeature} userProfile={userProfile} />;
      case Feature.CROP_DOCTOR:
        return <CropDoctor />;
      case Feature.MARKET_GURU:
        return <MarketGuru />;
      case Feature.SCHEME_NAVIGATOR:
        return <SchemeNavigator />;
      case Feature.WEATHER_ADVISOR:
        return <WeatherAdvisor defaultLocation={userProfile?.location} />;
      case Feature.FERTILIZER_CALCULATOR:
        return <FertilizerCalculator />;
      case Feature.COMMUNITY_CONNECT: {
        // Ensure we have a valid email for CommunityConnect
        const profileWithEmail = userProfile ? {
          ...userProfile,
          email: userProfile.email || user?.emailAddresses[0]?.emailAddress || ''
        } : null;
        return <CommunityConnect userProfile={profileWithEmail} />;
      }
      case Feature.LOAN_ADVISOR:
        return <LoanAdvisor />;
      case Feature.PROFILE:
        return <Profile userProfile={userProfile} onProfileUpdate={handleProfileUpdate} />;
      case Feature.ANALYTICS:
        return <Analytics />;
      case Feature.ABOUT_US:
        return <AboutUs />;
      case Feature.PRIVACY_POLICY:
        return <PrivacyPolicy />;
      case Feature.CONTACT_US:
        return <ContactUs />;
      default:
        return <Dashboard setActiveFeature={setActiveFeature} userProfile={userProfile} />;
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
      <nav className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg shadow-sm sticky top-[65px] z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto flex justify-center overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFeature(item.id)}
              title={translate(item.key)}
              className={`relative flex-shrink-0 px-2 sm:px-4 py-3 text-sm md:text-base font-semibold flex items-center gap-2 transition-colors duration-200 border-b-4 ${activeFeature === item.id
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
                <li><button onClick={() => setActiveFeature(Feature.PRIVACY_POLICY)}>{translate('footerPrivacyPolicy')}</button></li>
                <li><button onClick={() => setActiveFeature(Feature.CONTACT_US)}>{translate('footerContactUs')}</button></li>
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
                <a href="https://github.com/Abhishankar-2004" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
                <a href="https://www.instagram.com/abhi_shankareddy/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/in/abhi-s-3a4197310/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppContent;