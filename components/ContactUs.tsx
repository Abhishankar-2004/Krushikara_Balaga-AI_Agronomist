import React from 'react';
import { useLanguage } from '../LanguageContext';
import Card from './common/Card';
// Fix: Removed incorrect imports for MailIcon and PhoneIcon as they are defined locally in this file.

const ContactUs: React.FC = () => {
    const { translate } = useLanguage();

    return (
        <Card>
            <h2 className="text-3xl font-bold text-primary mb-4 text-center">{translate('contactUsTitle')}</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-10 text-lg max-w-2xl mx-auto">{translate('contactUsDescription')}</p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <MailIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Email</h3>
                        <a href="mailto:support@krushikara-balaga.dev" className="text-secondary hover:underline">
                            support@krushikara-balaga.dev
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <PhoneIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Phone</h3>
                        <a href="tel:+919876543210" className="text-secondary hover:underline">
                            +91 98765 43210
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Add MailIcon and PhoneIcon as they are needed but not present in the project
const MailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// Fix: Add a default export to make the component importable.
export default ContactUs;