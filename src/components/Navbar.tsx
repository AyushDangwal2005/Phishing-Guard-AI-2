import { useState, useEffect } from 'react';
import { useLang } from './LangProvider';

export default function Navbar() {
  const { t, lang, toggle } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`sticky top-0 z-50 bg-background border-b transition-shadow duration-300 ${scrolled ? 'shadow-pg-nav' : ''}`}
      style={{ borderColor: 'hsl(var(--gray-100))' }}
    >
      <div className="max-w-[1200px] mx-auto px-8 h-[68px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-heading font-bold text-lg text-pg-gray-900">
            PhishGuard<span className="text-primary"> AI</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('hero')} className="font-body text-sm font-medium text-pg-gray-500 hover:text-pg-gray-900 transition-colors">{t.nav.home}</button>
          <button onClick={() => scrollTo('detection')} className="font-body text-sm font-medium text-pg-gray-500 hover:text-pg-gray-900 transition-colors">{t.nav.features}</button>
          <button onClick={() => scrollTo('how-it-works')} className="font-body text-sm font-medium text-pg-gray-500 hover:text-pg-gray-900 transition-colors">{t.nav.howItWorks}</button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors"
            style={{ borderColor: 'hsl(var(--gray-200))' }}
          >
            <span className={lang === 'en' ? 'text-primary font-semibold' : 'text-pg-gray-500'}>EN</span>
            <span className="text-pg-gray-200">/</span>
            <span className={lang === 'hi' ? 'text-primary font-semibold' : 'text-pg-gray-500'}>HI</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-pg-gray-500 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-pg-green-500" style={{ animation: 'phish-pulse-dot 2s infinite' }} />
            {t.nav.systemOnline}
          </div>

          <button
            onClick={() => scrollTo('detection')}
            className="hidden sm:block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold shadow-pg-btn hover:shadow-pg-btn-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
          >
            {t.nav.startScanning}
          </button>
        </div>
      </div>
    </nav>
  );
}
