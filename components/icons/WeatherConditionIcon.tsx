

import React from 'react';

const SunnyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 6.34 1.41-1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const CloudyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
const RainIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 13v8"/><path d="M12 13v8"/><path d="M8 13v8"/><path d="M20 17.5a4.5 4.5 0 0 0-8.29-2.02"/><path d="M12 3v2.34"/><path d="M11.29 2.29A10 10 0 0 0 3.71 13.9"/></svg>;
const PartlyCloudyIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m17.66 17.66 1.41 1.41"/><path d="M12 20v2"/><path d="m6.34 17.66-1.41 1.41"/><path d="M4 12H2"/><path d="m6.34 6.34-1.41-1.41"/><path d="M18 10a4 4 0 0 0-4-4h-2a5 5 0 0 0-5 5v1h10v-1a4 4 0 0 0-4-4Z"/><path d="M22 17a5 5 0 0 1-5 5H9a5 5 0 0 1-4-8"/></svg>;
const HazeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.2 6.2C8.8 3.5 15.2 3.5 18.8 6.2"/><path d="M2 12h20"/><path d="M5.2 17.8C8.8 20.5 15.2 20.5 18.8 17.8"/></svg>;
const StormIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.73 18a4.5 4.5 0 0 0-8.73-2.45"/><path d="M12 3v2.34"/><path d="M11.29 2.29A10 10 0 0 0 3.71 13.9"/><path d="m9 15-2 4h5l-2 4"/></svg>;

export const WeatherConditionIcon: React.FC<{ condition?: string; className?: string }> = ({ condition, className }) => {
    const lowerCaseCondition = (condition || '').toLowerCase();
    
    if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
        return <SunnyIcon className={className} />;
    }
    if (lowerCaseCondition.includes('partly cloudy')) {
        return <PartlyCloudyIcon className={className} />;
    }
    if (lowerCaseCondition.includes('cloud')) {
        return <CloudyIcon className={className} />;
    }
    if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
        return <RainIcon className={className} />;
    }
    if (lowerCaseCondition.includes('storm') || lowerCaseCondition.includes('thunder')) {
        return <StormIcon className={className} />;
    }
    return <HazeIcon className={className} />;
};