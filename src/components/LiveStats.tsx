import { useEffect, useState, useRef } from 'react';
import { useLang } from './LangProvider';
import { useAuth } from './AuthProvider';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { supabase } from '@/integrations/supabase/client';

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

function getLocalStats() {
  try { return JSON.parse(localStorage.getItem('pg-stats') || '{}'); } catch { return {}; }
}

export default function LiveStats() {
  const { t } = useLang();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, threats: 0, safe: 0, suspicious: 0 });
  const sectionRef = useScrollReveal();

  const loadStats = async () => {
    if (user) {
      const { data } = await supabase.from('scan_stats').select('*').eq('user_id', user.id).single();
      if (data) {
        setStats({
          total: data.total_scans,
          threats: data.threats_found,
          safe: data.safe_count,
          suspicious: data.suspicious_count,
        });
        return;
      }
    }
    const local = getLocalStats();
    setStats({ total: local.total || 0, threats: local.threats || 0, safe: local.safe || 0, suspicious: local.suspicious || 0 });
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('pg-stats-update', loadStats);
    return () => window.removeEventListener('pg-stats-update', loadStats);
  }, [user]);

  const items = [
    { label: t.stats.totalScans, value: stats.total, color: 'hsl(var(--blue-600))', icon: '🔍' },
    { label: t.stats.threats, value: stats.threats, color: 'hsl(var(--red-500))', icon: '🚨' },
    { label: t.stats.safe, value: stats.safe, color: 'hsl(var(--green-500))', icon: '✅' },
    { label: t.stats.suspicious, value: stats.suspicious, color: 'hsl(var(--amber-500))', icon: '⚠️' },
  ];

  return (
    <div ref={sectionRef} className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
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
