import { useState, useCallback } from 'react';
import { useLang } from './LangProvider';
import { useAuth } from './AuthProvider';
import { useSpeechRecognition, useSpeechSynthesis } from '@/hooks/use-speech';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { analyzeText, analyzeUrl, analyzeWebsite, type AnalysisResult } from '@/lib/analysis-engine';
import { supabase } from '@/integrations/supabase/client';
import ResultCard from './ResultCard';
import VoiceAssistant from './VoiceAssistant';

const SAMPLES = {
  call: 'Hello sir, this is calling from State Bank of India. Your account has been suspended due to KYC not updated. Please share your OTP and Aadhaar number immediately or your account will be blocked permanently. This is urgent, you must act now to avoid legal action.',
  sms: 'URGENT: Your bank account will be blocked! Click here immediately to verify your identity: http://sbi-secure-login.xyz/verify?id=38291. Share your OTP to confirm. Act now or face legal action!',
  link: 'http://amaz0n-secure.login.verify-account.xyz/signin?ref=suspicious',
  website: 'http://paypa1-secure.com.verify-login.xyz/account',
};

function MicButton({ listening, onToggle }: { listening: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground transition-all"
      style={{
        background: listening ? 'hsl(var(--red-500))' : 'hsl(var(--blue-600))',
        animation: listening ? 'phish-pulse-dot 1.5s infinite' : 'none',
      }}>
      🎙️
    </button>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[3px] h-8 my-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="w-[3px] rounded-full" style={{
          background: 'hsl(var(--blue-600))',
          height: active ? undefined : '4px',
          minHeight: '4px',
          animation: active ? `phish-waveform 0.4s ease-in-out ${i * 0.05}s infinite alternate` : 'none',
        }} />
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent" style={{ animation: 'phish-spin 0.7s linear infinite' }} />
      <span className="font-body text-sm text-pg-gray-500">AI is analyzing...</span>
    </div>
  );
}

type TabKey = 'call' | 'sms' | 'link' | 'website';

const TAB_IMAGES: Record<TabKey, { src: string; alt: string }> = {
  call: { src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80', alt: 'Phone call detection' },
  sms: { src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', alt: 'SMS phishing detection' },
  link: { src: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80', alt: 'Fake link detection' },
  website: { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', alt: 'Fake website detection' },
};

export default function DetectionTool() {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('call');
  const [inputs, setInputs] = useState({ call: '', sms: '', link: '', website: '' });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { listening, start: startRec, stop: stopRec } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const ref = useScrollReveal();

  const setInput = (key: TabKey, val: string) => setInputs(prev => ({ ...prev, [key]: val }));

  const saveToDb = async (res: AnalysisResult, input: string) => {
    if (!user) return;
    try {
      // Save scan history
      await supabase.from('scan_history').insert({
        user_id: user.id,
        scan_type: activeTab,
        input_text: input.slice(0, 2000),
        verdict: res.verdict,
        confidence: res.confidence,
        title: res.title,
        explanation: res.explanation || '',
        keywords: res.keywords,
        checks: res.checks as any,
        voice_en: res.voiceEN,
        voice_hi: res.voiceHI,
      });

      // Update stats
      const { data: stats } = await supabase.from('scan_stats').select('*').eq('user_id', user.id).single();
      if (stats) {
        await supabase.from('scan_stats').update({
          total_scans: stats.total_scans + 1,
          threats_found: stats.threats_found + (res.verdict === 'dangerous' ? 1 : 0),
          safe_count: stats.safe_count + (res.verdict === 'safe' ? 1 : 0),
          suspicious_count: stats.suspicious_count + (res.verdict === 'suspicious' ? 1 : 0),
        }).eq('user_id', user.id);
      }
      window.dispatchEvent(new Event('pg-stats-update'));
      window.dispatchEvent(new Event('pg-history-update'));
    } catch (err) {
      console.error('Failed to save to DB:', err);
    }
  };

  const handleAnalyze = useCallback(async () => {
    const input = inputs[activeTab].trim();
    if (!input) return;
    setLoading(true);
    setResult(null);

    let res: AnalysisResult;

    // Try AI edge function first
    try {
      const { data, error } = await supabase.functions.invoke('analyze-scan', {
        body: { type: activeTab, input },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      res = data as AnalysisResult;
    } catch (err) {
      console.warn('AI analysis failed, falling back to local analysis:', err);
      // Fallback to local analysis
      if (activeTab === 'call') res = analyzeText(input, 'call');
      else if (activeTab === 'sms') res = analyzeText(input, 'sms');
      else if (activeTab === 'link') res = analyzeUrl(input);
      else res = analyzeWebsite(input);
    }

    setResult(res);
    setLoading(false);

    // Save to database if logged in
    await saveToDb(res, input);

    // Also update localStorage for non-logged-in view
    try {
      const s = JSON.parse(localStorage.getItem('pg-stats') || '{}');
      s.total = (s.total || 0) + 1;
      if (res.verdict === 'dangerous') s.threats = (s.threats || 0) + 1;
      else if (res.verdict === 'safe') s.safe = (s.safe || 0) + 1;
      else s.suspicious = (s.suspicious || 0) + 1;
      localStorage.setItem('pg-stats', JSON.stringify(s));
      window.dispatchEvent(new Event('pg-stats-update'));
    } catch {}

    const voiceText = lang === 'hi' ? res.voiceHI : res.voiceEN;
    speak(voiceText, lang);
  }, [activeTab, inputs, lang, speak, user]);

  const loadSample = () => {
    setInput(activeTab, SAMPLES[activeTab]);
    setResult(null);
  };

  const handleMic = () => {
    if (listening) { stopRec(); return; }
    startRec((t) => setInput(activeTab, t));
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'call', label: t.detection.tabs.call },
    { key: 'sms', label: t.detection.tabs.sms },
    { key: 'link', label: t.detection.tabs.link },
    { key: 'website', label: t.detection.tabs.website },
  ];

  const isTextTab = activeTab === 'call' || activeTab === 'sms';

  return (
    <section id="detection" className="py-20 bg-background">
      <div ref={ref} className="max-w-[900px] mx-auto px-4 md:px-8">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-pg-gray-900 tracking-tight text-center mb-10">
          {t.detection.title}
        </h2>

        {/* Tab Bar */}
        <div className="flex rounded-2xl p-1.5 mb-6 overflow-x-auto" style={{ border: '1px solid hsl(var(--gray-200))', background: 'hsl(var(--gray-50))' }}>
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setResult(null); }}
              className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key
                ? 'bg-background text-primary font-semibold'
                : 'text-pg-gray-500 hover:bg-background/50'}`}
              style={activeTab === tab.key ? { boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid hsl(var(--gray-200))' } : {}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Card */}
        <div className="bg-background rounded-2xl overflow-hidden" style={{ border: '1px solid hsl(var(--gray-200))', boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)' }}>
          <img src={TAB_IMAGES[activeTab].src} alt={TAB_IMAGES[activeTab].alt}
            className="w-full h-[200px] object-cover" loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />

          <div className="p-5 md:p-7">
            {isTextTab ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <MicButton listening={listening} onToggle={handleMic} />
                  <Waveform active={listening} />
                </div>
                <textarea
                  value={inputs[activeTab]}
                  onChange={e => setInput(activeTab, e.target.value)}
                  placeholder={activeTab === 'call' ? t.detection.callPlaceholder : t.detection.smsPlaceholder}
                  rows={5}
                  className="w-full rounded-xl px-4 py-3.5 font-body text-[15px] text-pg-gray-700 resize-none focus:outline-none transition-all"
                  style={{ border: '1.5px solid hsl(var(--gray-200))', background: 'hsl(var(--background))' }}
                  onFocus={e => { e.target.style.borderColor = 'hsl(var(--blue-600))'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'hsl(var(--gray-200))'; e.target.style.boxShadow = 'none'; }}
                />
              </>
            ) : (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pg-gray-500">
                  {activeTab === 'link' ? '🔗' : '🌐'}
                </span>
                <input
                  value={inputs[activeTab]}
                  onChange={e => setInput(activeTab, e.target.value)}
                  placeholder={activeTab === 'link' ? t.detection.linkPlaceholder : t.detection.websitePlaceholder}
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 font-body text-[15px] text-pg-gray-700 focus:outline-none transition-all"
                  style={{ border: '1.5px solid hsl(var(--gray-200))' }}
                  onFocus={e => { e.target.style.borderColor = 'hsl(var(--blue-600))'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'hsl(var(--gray-200))'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            {activeTab === 'website' && result?.verdict === 'dangerous' && (
              <div className="mt-4 p-4 rounded-xl font-body text-sm" style={{ background: 'hsl(var(--red-50))', border: '1px solid hsl(var(--red-500))', color: 'hsl(var(--red-500))' }}>
                ⚠️ DO NOT enter any credentials on this website. It appears to be a fraudulent site.
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={handleAnalyze} disabled={loading || !inputs[activeTab].trim()}
                className="px-7 py-3 rounded-xl bg-primary text-primary-foreground font-body text-[15px] font-semibold shadow-pg-btn hover:shadow-pg-btn-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {t.detection.analyze}
              </button>
              <button onClick={loadSample}
                className="px-5 py-3 rounded-xl font-body text-[15px] font-medium text-pg-gray-700 hover:text-primary hover:border-primary transition-all"
                style={{ border: '1.5px solid hsl(var(--gray-200))' }}>
                {t.detection.loadSample}
              </button>
            </div>
          </div>
        </div>

        {loading && <Spinner />}
        {result && !loading && (
          <>
            <ResultCard result={result} />
            <VoiceAssistant result={result} />
          </>
        )}
      </div>
    </section>
  );
}
