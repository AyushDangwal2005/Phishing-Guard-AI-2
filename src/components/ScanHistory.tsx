import { useState, useEffect } from 'react';
import { useLang } from './LangProvider';
import { useAuth } from './AuthProvider';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { supabase } from '@/integrations/supabase/client';

interface HistoryItem {
  id: string;
  scan_type: string;
  input_text: string;
  verdict: string;
  title: string;
  created_at: string;
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const typeIcons: Record<string, string> = { call: '📞', sms: '💬', link: '🔗', website: '🌐' };

function verdictColor(v: string) {
  if (v === 'dangerous') return 'hsl(var(--red-500))';
  if (v === 'suspicious') return 'hsl(var(--amber-500))';
  return 'hsl(var(--green-500))';
}
function verdictBg(v: string) {
  if (v === 'dangerous') return 'hsl(var(--red-50))';
  if (v === 'suspicious') return 'hsl(var(--amber-50))';
  return 'hsl(var(--green-50))';
}

export default function ScanHistory() {
  const { t } = useLang();
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useScrollReveal();

  const loadHistory = async () => {
    if (user) {
      const { data } = await supabase
        .from('scan_history')
        .select('id, scan_type, input_text, verdict, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) { setItems(data); return; }
    }
    // Fallback to localStorage
    try {
      const local = JSON.parse(localStorage.getItem('pg-history') || '[]');
      setItems(local.map((l: any, i: number) => ({
        id: String(i),
        scan_type: l.type,
        input_text: l.input,
        verdict: l.verdict,
        title: l.title,
        created_at: new Date(l.time).toISOString(),
      })));
    } catch { setItems([]); }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('pg-history-update', loadHistory);
    return () => window.removeEventListener('pg-history-update', loadHistory);
  }, [user]);

  const clearAll = async () => {
    if (user) {
      await supabase.from('scan_history').delete().eq('user_id', user.id);
      await supabase.from('scan_stats').update({
        total_scans: 0, threats_found: 0, safe_count: 0, suspicious_count: 0,
      }).eq('user_id', user.id);
    }
    localStorage.removeItem('pg-history');
    localStorage.removeItem('pg-stats');
    setItems([]);
    window.dispatchEvent(new Event('pg-stats-update'));
  };

  return (
    <div ref={ref} className="max-w-[900px] mx-auto px-4 md:px-8 py-12">
      <div className="bg-background rounded-2xl overflow-hidden"
        style={{ border: '1px solid hsl(var(--gray-200))', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)' }}>
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 font-heading font-semibold text-lg text-pg-gray-900">
          <span>{t.history.title} ({items.length})</span>
          <span className="text-pg-gray-500 text-sm transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
        </button>

        {open && (
          <div className="px-6 pb-6">
            {!user && (
              <p className="font-body text-xs text-pg-gray-500 mb-3 p-2 rounded-lg" style={{ background: 'hsl(var(--blue-50))' }}>
                💡 Sign in to save your scan history permanently
              </p>
            )}
            {items.length === 0 ? (
              <p className="font-body text-sm text-pg-gray-500 py-4">{t.history.empty}</p>
            ) : (
              <>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5" style={{ background: 'hsl(var(--blue-100))' }} />
                  {items.map((item) => (
                    <div key={item.id} className="relative mb-4 last:mb-0">
                      <div className="absolute -left-[18px] top-2 w-3 h-3 rounded-full" style={{ background: 'hsl(var(--blue-600))', border: '2px solid hsl(var(--blue-100))' }} />
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'hsl(var(--gray-50))' }}>
                        <span className="text-lg">{typeIcons[item.scan_type] || '🔍'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-pg-gray-700 truncate">{item.input_text}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-medium uppercase tracking-wider"
                          style={{ background: verdictBg(item.verdict), color: verdictColor(item.verdict) }}>
                          {item.verdict}
                        </span>
                        <span className="font-mono text-[11px] text-pg-gray-500 whitespace-nowrap">{timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={clearAll}
                  className="mt-4 px-4 py-2 rounded-xl font-body text-sm font-medium text-destructive hover:bg-pg-red-50 transition-colors"
                  style={{ border: '1.5px solid hsl(var(--gray-200))' }}>
                  {t.history.clearAll}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
