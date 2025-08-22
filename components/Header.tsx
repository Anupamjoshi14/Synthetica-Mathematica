
import React from 'react';
import LogoIcon from './icons/LogoIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { key: Language, label: string }[] = [
    { key: 'en', label: 'EN' },
    { key: 'hi', label: 'HI' },
  ];

  return (
    <div className="flex items-center bg-slate-800 rounded-full p-1 border border-slate-700">
      {languages.map((lang) => (
        <button
          key={lang.key}
          onClick={() => setLanguage(lang.key)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${
            language === lang.key
              ? 'bg-brand-cyan text-slate-900'
              : 'text-slate-300 hover:bg-slate-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
      <div className="flex items-center space-x-4">
        <LogoIcon className="w-10 h-10 text-brand-cyan" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400">
            {t.headerTitle}
          </h1>
          <p className="text-sm text-slate-400">{t.headerSubtitle}</p>
        </div>
      </div>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;