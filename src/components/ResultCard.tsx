import type { AnalysisResult } from '@/lib/analysis-engine';

function statusIcon(s: string) {
  if (s === 'pass') return <span className="text-pg-green-500">✓</span>;
  if (s === 'warn') return <span className="text-pg-amber-500">⚠</span>;
  return <span className="text-pg-red-500">✗</span>;
}

function statusBg(s: string) {
  if (s === 'pass') return 'hsl(var(--green-50))';
  if (s === 'warn') return 'hsl(var(--amber-50))';
  return 'hsl(var(--red-50))';
}

function verdictStyle(v: string) {
  if (v === 'dangerous') return { bg: 'hsl(var(--red-50))', color: 'hsl(var(--red-500))', border: 'hsl(var(--red-500))' };
  if (v === 'suspicious') return { bg: 'hsl(var(--amber-50))', color: 'hsl(var(--amber-500))', border: 'hsl(var(--amber-500))' };
  return { bg: 'hsl(var(--green-50))', color: 'hsl(var(--green-500))', border: 'hsl(var(--green-500))' };
}

export default function ResultCard({ result }: { result: AnalysisResult }) {
  const vs = verdictStyle(result.verdict);

  return (
    <div className="bg-background rounded-2xl p-7 mt-6"
      style={{
        border: `1px solid hsl(var(--gray-200))`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.07)',
        animation: 'phish-fade-up 0.4s ease-out',
      }}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-heading font-semibold text-xl text-pg-gray-900">{result.title}</h3>
        <span className="px-4 py-1 rounded-full font-mono text-xs font-medium uppercase tracking-wider"
          style={{ background: vs.bg, color: vs.color, border: `1px solid ${vs.border}` }}>
          {result.verdict} — {result.confidence}%
        </span>
      </div>

      {/* Confidence bar */}
      <div className="mb-5">
        <div className="w-full h-2.5 rounded-full" style={{ background: 'hsl(var(--gray-100))' }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{
            width: `${result.confidence}%`,
            background: vs.color,
            animation: 'phish-bar-grow 1.2s ease-out',
          }} />
        </div>
      </div>

      <p className="font-body text-[15px] text-pg-gray-700 leading-relaxed mb-5">{result.explanation}</p>

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {result.keywords.map((kw, i) => (
            <span key={i} className="px-3 py-1 rounded-full font-mono text-[11px] font-medium"
              style={{
                background: result.verdict === 'safe' ? 'hsl(var(--green-50))' : result.verdict === 'suspicious' ? 'hsl(var(--amber-50))' : 'hsl(var(--red-50))',
                color: result.verdict === 'safe' ? 'hsl(var(--green-500))' : result.verdict === 'suspicious' ? 'hsl(var(--amber-500))' : 'hsl(var(--red-500))',
              }}>
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Security Checks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.checks.map((check, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: statusBg(check.status) }}>
            <span className="mt-0.5">{statusIcon(check.status)}</span>
            <div>
              <p className="font-body text-sm font-medium text-pg-gray-900">{check.label}</p>
              <p className="font-body text-xs text-pg-gray-500">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
