import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(email, password, name);
      if (error) setError(error.message);
      else setSuccess('Check your email to confirm your account!');
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-background rounded-2xl w-full max-w-md mx-4 p-8 relative"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid hsl(var(--gray-200))' }}
        onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-pg-gray-500 hover:text-pg-gray-900 text-xl">×</button>

        <div className="text-center mb-6">
          <span className="text-3xl">🛡️</span>
          <h2 className="font-heading font-bold text-2xl text-pg-gray-900 mt-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-body text-sm text-pg-gray-500 mt-1">
            {mode === 'login' ? 'Sign in to save your scan history' : 'Join PhishGuard AI for free'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text" placeholder="Display Name" value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl px-4 py-3 font-body text-sm text-pg-gray-700 focus:outline-none transition-all"
              style={{ border: '1.5px solid hsl(var(--gray-200))' }}
              onFocus={e => { e.target.style.borderColor = 'hsl(var(--blue-600))'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'hsl(var(--gray-200))'; e.target.style.boxShadow = 'none'; }}
            />
          )}
          <input
            type="email" placeholder="Email" value={email} required
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl px-4 py-3 font-body text-sm text-pg-gray-700 focus:outline-none transition-all"
            style={{ border: '1.5px solid hsl(var(--gray-200))' }}
            onFocus={e => { e.target.style.borderColor = 'hsl(var(--blue-600))'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'hsl(var(--gray-200))'; e.target.style.boxShadow = 'none'; }}
          />
          <input
            type="password" placeholder="Password" value={password} required minLength={6}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 font-body text-sm text-pg-gray-700 focus:outline-none transition-all"
            style={{ border: '1.5px solid hsl(var(--gray-200))' }}
            onFocus={e => { e.target.style.borderColor = 'hsl(var(--blue-600))'; e.target.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = 'hsl(var(--gray-200))'; e.target.style.boxShadow = 'none'; }}
          />

          {error && <p className="text-sm font-body" style={{ color: 'hsl(var(--red-500))' }}>{error}</p>}
          {success && <p className="text-sm font-body" style={{ color: 'hsl(var(--green-500))' }}>{success}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold shadow-pg-btn hover:shadow-pg-btn-hover transition-all disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center font-body text-sm text-pg-gray-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
            className="text-primary font-medium hover:underline">
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
