import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

import { ProfileIcon } from './icons/ProfileIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ProfilePreviewProps {
  className?: string;
  showEditButton?: boolean;
  onEdit?: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ 
  className = '', 
  showEditButton = false,
  onEdit 
}) => {
  const { profile, user, profileCompletionPercentage, isProfileComplete } = useUserProfile();


  if (!profile || !user) {
    return null;
  }

  const farmingType = user.unsafeMetadata?.farmingType as string;
  const experienceLevel = user.unsafeMetadata?.experienceLevel as string;
  const farmSize = user.unsafeMetadata?.farmSize as string;

  const getFarmingTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      crop: 'Crop Farming',
      livestock: 'Livestock',
      mixed: 'Mixed Farming',
      organic: 'Organic Farming',
      dairy: 'Dairy Farming',
      poultry: 'Poultry',
      horticulture: 'Horticulture',
      other: 'Other'
    };
    return types[type] || type;
  };

  const getExperienceLevelDisplay = (level: string) => {
    const levels: { [key: string]: string } = {
      beginner: 'Beginner (0-2 years)',
      intermediate: 'Intermediate (3-10 years)',
      experienced: 'Experienced (11-20 years)',
      expert: 'Expert (20+ years)'
    };
    return levels[level] || level;
  };

  const getFarmSizeDisplay = (size: string) => {
    const sizes: { [key: string]: string } = {
      small: 'Small (< 2 acres)',
      medium: 'Medium (2-10 acres)',
      large: 'Large (10-50 acres)',
      commercial: 'Commercial (50+ acres)'
    };
    return sizes[size] || size;
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Profile Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center relative">
            <ProfileIcon className="w-8 h-8 text-white" />
            {isProfileComplete && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {profile.name}
            </h3>
            {showEditButton && onEdit && (
              <button
                onClick={onEdit}
                className="text-sm text-primary hover:text-primary-dark font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-2">
            {/* Email */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Email:</span>
              <span className="text-sm text-slate-900 dark:text-slate-100">{profile.email}</span>
              {user.emailAddresses[0]?.verification?.status === 'verified' && (
                <CheckIcon className="w-4 h-4 text-green-500" />
              )}
            </div>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Location:</span>
                <span className="text-sm text-slate-900 dark:text-slate-100">{profile.location}</span>
              </div>
            )}

            {/* Farming Type */}
            {farmingType && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Farming:</span>
                <span className="text-sm text-slate-900 dark:text-slate-100">
                  {getFarmingTypeDisplay(farmingType)}
                </span>
              </div>
            )}

            {/* Experience Level */}
            {experienceLevel && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Experience:</span>
                <span className="text-sm text-slate-900 dark:text-slate-100">
                  {getExperienceLevelDisplay(experienceLevel)}
                </span>
              </div>
            )}

            {/* Farm Size */}
            {farmSize && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Farm Size:</span>
                <span className="text-sm text-slate-900 dark:text-slate-100">
                  {getFarmSizeDisplay(farmSize)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Completion */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Profile Completion
              </span>
              <span className="text-xs font-medium text-primary">
                {profileCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
              <div 
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;