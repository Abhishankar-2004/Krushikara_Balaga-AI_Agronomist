import React from 'react';
import { useLanguage } from '../LanguageContext';
import Card from './common/Card';

const PrivacyPolicy: React.FC = () => {
    const { translate } = useLanguage();

    return (
        <Card>
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">{translate('privacyPolicyTitle')}</h2>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4">
                <p>{translate('privacyPolicyP1')}</p>
                <h3 className="text-xl font-bold pt-4">{translate('privacyPolicyH2')}</h3>
                <p>{translate('privacyPolicyP2')}</p>
                <h3 className="text-xl font-bold pt-4">{translate('privacyPolicyH3')}</h3>
                <p>{translate('privacyPolicyP3')}</p>
                <h3 className="text-xl font-bold pt-4">{translate('privacyPolicyH4')}</h3>
                <p>{translate('privacyPolicyP4')}</p>
            </div>
        </Card>
    );
};

export default PrivacyPolicy;
