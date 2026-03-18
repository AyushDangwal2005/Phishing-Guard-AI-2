import React, { createContext, useContext, useState, useCallback } from 'react';
import { Language, translations, TranslationKey } from '@/lib/language';

interface LangContextType {
  lang: Language;
  t: TranslationKey;
  toggle: () => void;
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  t: translations.en,
  toggle: () => {},
});

export const useLang = () => useContext(LangContext);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const toggle = useCallback(() => setLang(l => (l === 'en' ? 'hi' : 'en')), []);
  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LangContext.Provider>
  );
}
