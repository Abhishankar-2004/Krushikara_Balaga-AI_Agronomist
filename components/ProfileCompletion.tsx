import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useLanguage } from '../LanguageContext';
import { ProfileIcon } from './icons/ProfileIcon';

interface ProfileCompletionProps {
  onNavigateToProfile: () => void;
  className?: string;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ 
  onNavigateToProfile, 
  className = '' 
}) => {
  const { profileCompletionPercentage, isProfileComplete, profile, user } = useUserProfile();
  const { translate } = useLanguage();

  // Don't show if profile is complete
  if (isProfileComplete) {
    return null;
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMissingFields = () => {
    const missing = [];
    if (!profile?.name || profile.name === 'User') {
      missing.push(translate('nameLabel') || 'Name');
    }
    if (!profile?.location) {
      missing.push('Location');
    }
    if (user?.emailAddresses[0]?.verification?.status !== 'verified') {
      missing.push('Email Verification');
    }
    return missing;
  };

  const missingFields = getMissingFields();

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <ProfileIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Complete Your Profile
            </h3>
            <span className={`text-sm font-medium ${getCompletionColor(profileCompletionPercentage)}`}>
              {profileCompletionPercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(profileCompletionPercentage)}`}
              style={{ width: `${profileCompletionPercentage}%` }}
            />
          </div>
          
          {/* Missing Fields */}
          {missingFields.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                Missing:
              </p>
              <div className="flex flex-wrap gap-1">
                {missingFields.map((field, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Button */}
          <button
            onClick={onNavigateToProfile}
            className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;