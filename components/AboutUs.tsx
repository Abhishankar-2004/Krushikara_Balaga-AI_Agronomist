import React from 'react';
import { useLanguage } from '../LanguageContext';
import Card from './common/Card';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { TargetIcon } from './icons/TargetIcon';
import { GovIcon } from './icons/GovIcon';

const AboutUs: React.FC = () => {
    const { translate } = useLanguage();

    const teamMembers = [
        {
            name: translate('teamMember2Name'),
            role: translate('teamMember2Role'),
            bio: translate('teamMember2Bio'),
            imageUrl: 'https://i.im.ge/2025/09/18/nifMih.profile-pic-formal.jpeg'
        },
    ];

    return (
        <Card>
            <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
                     <GovIcon className="w-8 h-8" />
                     {translate('aboutUsTitle')}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-3xl mx-auto text-lg">{translate('aboutUsIntro')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center">
                           <TargetIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{translate('ourMissionTitle')}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{translate('ourMissionText')}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border dark:border-slate-800">
                    <div className="flex items-center gap-4 mb-3">
                         <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center">
                           <LightbulbIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{translate('ourVisionTitle')}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{translate('ourVisionText')}</p>
                </div>
            </div>

            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-primary mb-2">{translate('meetOurTeamTitle')}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">{translate('meetOurTeamDescription')}</p>
            </div>
            <div className="flex justify-center">
                {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg dark:shadow-none dark:border dark:border-slate-800 text-center card-enter transform transition-transform hover:-translate-y-2 max-w-sm" style={{ animationDelay: `${index * 100}ms` }}>
                        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-slate-200 dark:border-slate-700" />
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h4>
                        <p className="text-primary font-semibold mb-3">{member.role}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{member.bio}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AboutUs;