import { useEffect, useState, useRef } from 'react';
import { useLang } from './LangProvider';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

function getStats() {
  try {
    return JSON.parse(localStorage.getItem('pg-stats') || '{}');
  } catch { return {}; }
}
export function updateStats(verdict: string) {
  const s = getStats();
  s.total = (s.total || 0) + 1;
  if (verdict === 'dangerous') s.threats = (s.threats || 0) + 1;
  else if (verdict === 'safe') s.safe = (s.safe || 0) + 1;
  else s.suspicious = (s.suspicious || 0) + 1;
  localStorage.setItem('pg-stats', JSON.stringify(s));
  window.dispatchEvent(new Event('pg-stats-update'));
}

function AnimatedCounter({ target, color }: { target: number; color: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    if (ref.current === target) return;
    ref.current = target;
    const start = performance.now();
    const from = value;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / 600, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);

  return <span className="font-heading font-bold text-3xl md:text-4xl" style={{ color }}>{value.toLocaleString()}</span>;
}

export default function LiveStats() {
  const { t } = useLang();
  const [stats, setStats] = useState(getStats());
  const ref = useScrollReveal();

  useEffect(() => {
    const handler = () => setStats(getStats());
    window.addEventListener('pg-stats-update', handler);
    return () => window.removeEventListener('pg-stats-update', handler);
  }, []);

  const items = [
    { label: t.stats.totalScans, value: stats.total || 0, color: 'hsl(var(--blue-600))', icon: '🔍' },
    { label: t.stats.threats, value: stats.threats || 0, color: 'hsl(var(--red-500))', icon: '🚨' },
    { label: t.stats.safe, value: stats.safe || 0, color: 'hsl(var(--green-500))', icon: '✅' },
    { label: t.stats.suspicious, value: stats.suspicious || 0, color: 'hsl(var(--amber-500))', icon: '⚠️' },
  ];

  return (
    <div ref={ref} className="max-w-[1200px] mx-auto px-8 py-12">
      <div className="bg-background rounded-2xl p-8 relative overflow-hidden"
        style={{ border: '1px solid hsl(var(--gray-200))', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)' }}>
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=60" alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ opacity: 0.03, zIndex: 0 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <AnimatedCounter target={item.value} color={item.color} />
              <p className="font-body text-xs text-pg-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
