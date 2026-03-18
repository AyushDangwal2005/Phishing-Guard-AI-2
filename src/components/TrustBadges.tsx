import { useLang } from './LangProvider';

export default function TrustBadges() {
  const { t } = useLang();
  const items = [
    { icon: '🧠', label: t.trust.t1 },
    { icon: '🔒', label: t.trust.t2 },
    { icon: '⚡', label: t.trust.t3 },
    { icon: '🆓', label: t.trust.t4 },
  ];

  return (
    <div className="bg-background border-y" style={{ borderColor: 'hsl(var(--gray-100))' }}>
      <div className="max-w-[1200px] mx-auto px-8 py-5 flex flex-wrap justify-center gap-8 md:gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-body font-medium text-pg-gray-500">
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
