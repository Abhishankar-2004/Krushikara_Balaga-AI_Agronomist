
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations } from './translations';
import { Language, TranslationKey } from './types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const translate = (key: TranslationKey): string => {
    return translations[language][key] || translations[Language.EN][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
