import { useLang } from './LangProvider';
import { useSpeechSynthesis } from '@/hooks/use-speech';
import type { AnalysisResult } from '@/lib/analysis-engine';

function SoundBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-6">
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} className="w-[3px] rounded-full bg-primary" style={{
          height: active ? undefined : '4px',
          animation: active ? `phish-waveform 0.5s ease-in-out ${i * 0.1}s infinite alternate` : 'none',
          minHeight: '4px',
          maxHeight: '24px',
        }} />
      ))}
    </div>
  );
}

export default function VoiceAssistant({ result }: { result: AnalysisResult }) {
  const { lang, t } = useLang();
  const { speaking, speak, stop } = useSpeechSynthesis();

  const text = lang === 'hi' ? result.voiceHI : result.voiceEN;

  return (
    <div className="bg-background rounded-2xl p-6 mt-4 flex items-start gap-4"
      style={{
        border: '1px solid hsl(var(--gray-200))',
        borderLeft: '4px solid hsl(var(--blue-600))',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)',
        animation: 'phish-fade-up 0.4s ease-out 0.2s both',
      }}>
      <img
        src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=120&q=85"
        alt="AI Assistant"
        className="w-14 h-14 rounded-full object-cover flex-shrink-0"
        style={{ border: '2px solid hsl(var(--blue-600))' }}
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-heading font-semibold text-sm text-pg-gray-900">PhishGuard Voice</span>
          <SoundBars active={speaking} />
        </div>
        <div className="p-3 rounded-xl mb-3 font-body text-sm text-pg-gray-700 leading-relaxed"
          style={{ background: 'hsl(var(--gray-100))' }}>
          {text}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => speak(text, lang)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-medium hover:-translate-y-0.5 transition-all"
          >
            {t.voice.speak}
          </button>
          {speaking && (
            <button
              onClick={stop}
              className="px-4 py-2 rounded-xl font-body text-sm font-medium text-pg-gray-700 transition-all"
              style={{ border: '1.5px solid hsl(var(--gray-200))' }}
            >
              {t.voice.stop}
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <span className={`px-2 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-pg-gray-500'}`}>
              🇬🇧 EN
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-mono cursor-pointer transition-colors ${lang === 'hi' ? 'bg-primary text-primary-foreground' : 'text-pg-gray-500'}`}>
              🇮🇳 HI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
