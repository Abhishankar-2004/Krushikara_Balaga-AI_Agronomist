
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserProfile } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { ProfileIcon } from './icons/ProfileIcon';
import { useUserProfile } from '../hooks/useUserProfile';
import { CheckIcon } from './icons/CheckIcon';
import { validateProfile, validateAgriculturalData, getFieldError, ValidationError } from '../utils/profileValidation';

interface ProfileProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onProfileUpdate }) => {
    const { translate } = useLanguage();
    const { 
        updateProfile, 
        isUpdating, 
        error, 
        clearError,
        profileCompletionPercentage,
        isProfileComplete,
        user
    } = useUserProfile();
    
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [farmingType, setFarmingType] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setLocation(userProfile.location);
        }
        if (user) {
            setFarmingType((user.unsafeMetadata?.farmingType as string) || '');
            setExperienceLevel((user.unsafeMetadata?.experienceLevel as string) || '');
            setFarmSize((user.unsafeMetadata?.farmSize as string) || '');
        }
    }, [userProfile, user]);

    const handleSave = async () => {
        clearError();
        setValidationErrors([]);
        
        const newProfile: UserProfile = { 
            name: name.trim(), 
            location: location.trim(),
            email: userProfile?.email || '' 
        };
        
        // Validate profile data
        const profileValidation = validateProfile(newProfile);
        const agriculturalValidation = validateAgriculturalData({
            farmingType: farmingType.trim(),
            experienceLevel: experienceLevel.trim(),
            farmSize: farmSize.trim(),
        });
        
        const allErrors = [...profileValidation.errors, ...agriculturalValidation.errors];
        
        if (allErrors.length > 0) {
            setValidationErrors(allErrors);
            return;
        }
        
        // Update additional metadata
        if (user) {
            try {
                await user.update({
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        farmingType: farmingType.trim(),
                        experienceLevel: experienceLevel.trim(),
                        farmSize: farmSize.trim(),
                        profileLastUpdated: new Date().toISOString(),
                    }
                });
            } catch (error) {
                console.error('Error updating additional metadata:', error);
            }
        }
        
        const success = await updateProfile(newProfile);
        if (success) {
            setValidationErrors([]);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            onProfileUpdate(newProfile);
        }
    };
    
    const inputClasses = "mt-1 block w-full px-4 py-3 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";


    return (
        <Card>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4 relative">
                    <ProfileIcon className="w-12 h-12 text-white" />
                    {isProfileComplete && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2 text-center">{translate('profileTitle')}</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-4 text-lg max-w-xl mx-auto">{translate('profileDescription')}</p>
                
                {/* Profile Completion Status */}
                <div className="w-full max-w-md mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Profile Completion
                        </span>
                        <span className="text-sm font-medium text-primary">
                            {profileCompletionPercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${profileCompletionPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="w-full max-w-md mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                                Profile updated successfully!
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="w-full max-w-md mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                            {error}
                        </p>
                    </div>
                )}

                <div className="w-full max-w-md space-y-6">
                    <div>
                        <label htmlFor="name" className={labelClasses}>{translate('userNameLabel')}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${inputClasses} ${getFieldError(validationErrors, 'name') ? 'border-red-500 dark:border-red-400' : ''}`}
                            placeholder={translate('userNamePlaceholder')}
                        />
                        {getFieldError(validationErrors, 'name') && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {getFieldError(validationErrors, 'name')}
                            </p>
                        )}
                    </div>
                     <div>
                        <label htmlFor="email" className={labelClasses}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={userProfile?.email || ''}
                            className={`${inputClasses} bg-slate-100 dark:bg-slate-800 cursor-not-allowed`}
                            disabled
                        />
                    </div>
                    <div>
                        <label htmlFor="location" className={labelClasses}>{translate('userLocationLabel')}</label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={`${inputClasses} ${getFieldError(validationErrors, 'location') ? 'border-red-500 dark:border-red-400' : ''}`}
                            placeholder={translate('userLocationPlaceholder')}
                        />
                        {getFieldError(validationErrors, 'location') && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {getFieldError(validationErrors, 'location')}
                            </p>
                        )}
                    </div>

                    {/* Agricultural Profile Fields */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                            Agricultural Information
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="farmingType" className={labelClasses}>Type of Farming</label>
                                <select
                                    id="farmingType"
                                    value={farmingType}
                                    onChange={(e) => setFarmingType(e.target.value)}
                                    className={inputClasses}
                                >
                                    <option value="">Select farming type</option>
                                    <option value="crop">Crop Farming</option>
                                    <option value="livestock">Livestock</option>
                                    <option value="mixed">Mixed Farming</option>
                                    <option value="organic">Organic Farming</option>
                                    <option value="dairy">Dairy Farming</option>
                                    <option value="poultry">Poultry</option>
                                    <option value="horticulture">Horticulture</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="experienceLevel" className={labelClasses}>Experience Level</label>
                                <select
                                    id="experienceLevel"
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className={inputClasses}
                                >
                                    <option value="">Select experience level</option>
                                    <option value="beginner">Beginner (0-2 years)</option>
                                    <option value="intermediate">Intermediate (3-10 years)</option>
                                    <option value="experienced">Experienced (11-20 years)</option>
                                    <option value="expert">Expert (20+ years)</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="farmSize" className={labelClasses}>Farm Size</label>
                                <select
                                    id="farmSize"
                                    value={farmSize}
                                    onChange={(e) => setFarmSize(e.target.value)}
                                    className={inputClasses}
                                >
                                    <option value="">Select farm size</option>
                                    <option value="small">Small (&lt; 2 acres)</option>
                                    <option value="medium">Medium (2-10 acres)</option>
                                    <option value="large">Large (10-50 acres)</option>
                                    <option value="commercial">Commercial (50+ acres)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="text-center pt-4">
                        <Button 
                            onClick={handleSave}
                            disabled={isUpdating}
                            className={isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {isUpdating ? 'Saving...' : translate('saveProfileButton')}
                        </Button>
                    </div>

                    {/* Email Verification Status */}
                    {user && (
                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Account Status
                            </h3>
                            <div className="flex items-center gap-2">
                                {user.emailAddresses[0]?.verification?.status === 'verified' ? (
                                    <>
                                        <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm text-green-700 dark:text-green-300">
                                            Email verified
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                        <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Email not verified
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Profile;