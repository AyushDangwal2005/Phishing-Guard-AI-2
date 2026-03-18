import { useEffect, useState } from 'react';
import { useLang } from './LangProvider';

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    }}>
      {children}
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLang();

  return (
    <section id="hero" className="bg-background py-16 md:py-24 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1 max-w-xl">
          <FadeUp delay={0}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium mb-6"
              style={{ background: 'hsl(var(--blue-50))', border: '1px solid hsl(var(--blue-100))', color: 'hsl(224 76% 48%)' }}>
              {t.hero.badge}
            </span>
          </FadeUp>

          <FadeUp delay={100}>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              <span className="text-pg-gray-900">{t.hero.h1Line1}</span>
              <br />
              <span className="text-primary">{t.hero.h1Line2}</span>
            </h1>
          </FadeUp>

          <FadeUp delay={200}>
            <p className="font-body text-base md:text-lg text-pg-gray-500 leading-relaxed mt-6 max-w-[480px]">
              {t.hero.description}
            </p>
          </FadeUp>

          <FadeUp delay={300}>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => document.getElementById('detection')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-body text-[15px] font-semibold shadow-pg-btn hover:shadow-pg-btn-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
              >
                {t.hero.cta1}
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-xl bg-background font-body text-[15px] font-semibold text-pg-gray-700 hover:text-primary hover:border-primary transition-all"
                style={{ border: '1.5px solid hsl(var(--gray-200))' }}
              >
                {t.hero.cta2}
              </button>
            </div>
          </FadeUp>

          <FadeUp delay={450}>
            <div className="flex flex-wrap gap-6 mt-10">
              {[t.hero.trust1, t.hero.trust2, t.hero.trust3].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-body text-pg-gray-500">
                  <span className="text-pg-green-500">✓</span>
                  {text}
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        <div className="flex-1 max-w-[560px]">
          <FadeUp delay={200}>
            <img
              src="https://images.unsplash.com/photo-1563986768494-4641104bb346?w=700&q=85"
              alt="Person using laptop securely"
              loading="lazy"
              className="w-full rounded-2xl hover:rotate-0 hover:-translate-y-1 transition-all duration-300"
              style={{
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                transform: 'rotate(1deg)',
              }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
