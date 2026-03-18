import { useLang } from './LangProvider';

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-background border-t" style={{ borderColor: 'hsl(var(--gray-100))' }}>
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🛡️</span>
              <span className="font-heading font-bold text-lg text-pg-gray-900">PhishGuard<span className="text-primary"> AI</span></span>
            </div>
            <p className="font-body text-sm text-pg-gray-500 leading-relaxed">{t.footer.tagline}</p>
          </div>

          <div className="flex flex-col gap-2">
            {['Features', 'How It Works', 'Privacy', 'Contact'].map(link => (
              <a key={link} href="#" className="font-body text-sm text-pg-gray-500 hover:text-primary transition-colors">{link}</a>
            ))}
          </div>

          <div>
            <p className="font-body text-sm text-pg-gray-500 mb-3">{t.footer.builtFor}</p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'gh'].map((icon, i) => (
                <span key={i} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-primary cursor-pointer hover:-translate-y-0.5 transition-all"
                  style={{ border: '1.5px solid hsl(var(--gray-200))' }}>
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center" style={{ borderTop: '1px solid hsl(var(--gray-100))' }}>
          <p className="font-body text-xs text-pg-gray-500">© 2024 PhishGuard AI. All rights reserved. Built with ❤️ to fight scams.</p>
        </div>
      </div>
    </footer>
  );
}
