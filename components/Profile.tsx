
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserProfile } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { ProfileIcon } from './icons/ProfileIcon';

interface ProfileProps {
    userProfile: UserProfile | null;
    onProfileUpdate: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onProfileUpdate }) => {
    const { translate } = useLanguage();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setLocation(userProfile.location);
        }
    }, [userProfile]);

    const handleSave = () => {
        onProfileUpdate({ name, location });
    };
    
    const inputClasses = "mt-1 block w-full px-4 py-3 text-base bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
    const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";


    return (
        <Card>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                    <ProfileIcon className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-2 text-center">{translate('profileTitle')}</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-8 text-lg max-w-xl mx-auto">{translate('profileDescription')}</p>

                <div className="w-full max-w-md space-y-6">
                    <div>
                        <label htmlFor="name" className={labelClasses}>{translate('userNameLabel')}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClasses}
                            placeholder={translate('userNamePlaceholder')}
                        />
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
                            className={inputClasses}
                            placeholder={translate('userLocationPlaceholder')}
                        />
                    </div>
                    <div className="text-center pt-4">
                        <Button onClick={handleSave}>
                            {translate('saveProfileButton')}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default Profile;