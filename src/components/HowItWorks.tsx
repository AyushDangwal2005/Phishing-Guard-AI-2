import { useLang } from './LangProvider';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const steps = [
  { img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&q=80', alt: 'Paste or upload content' },
  { img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=300&q=80', alt: 'AI analyzes content' },
  { img: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=300&q=80', alt: 'Get safety result' },
];

function StepCard({ step, num, title, desc }: { step: typeof steps[0]; num: string; title: string; desc: string }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className="bg-background rounded-2xl p-7 relative"
      style={{ border: '1px solid hsl(var(--gray-200))', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)' }}>
      <span className="absolute top-4 right-6 font-mono text-5xl font-bold" style={{ color: 'hsl(var(--blue-50))' }}>{num}</span>
      <div className="flex justify-center mb-5">
        <img src={step.img} alt={step.alt} loading="lazy"
          className="w-[100px] h-[100px] rounded-full object-cover"
          style={{ border: '3px solid hsl(var(--blue-50))', boxShadow: '0 8px 24px rgba(37,99,235,0.15)' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <h3 className="font-heading font-semibold text-lg text-pg-gray-900 mb-2">{title}</h3>
      <p className="font-body text-[15px] text-pg-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useLang();
  const titleRef = useScrollReveal();

  return (
    <section id="how-it-works" className="py-20" style={{ background: 'hsl(var(--gray-50))' }}>
      <div className="max-w-[1200px] mx-auto px-8">
        <div ref={titleRef} className="text-center mb-14">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-gray-900 tracking-tight">{t.howItWorks.title}</h2>
          <p className="font-body text-pg-gray-500 mt-3">{t.howItWorks.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <StepCard step={steps[0]} num="01" title={t.howItWorks.s1Title} desc={t.howItWorks.s1Desc} />
          <StepCard step={steps[1]} num="02" title={t.howItWorks.s2Title} desc={t.howItWorks.s2Desc} />
          <StepCard step={steps[2]} num="03" title={t.howItWorks.s3Title} desc={t.howItWorks.s3Desc} />
        </div>
      </div>
    </section>
  );
}
