import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await register(form);
      navigate('/dashboard');
    } catch {
      setError('Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-slate-400">Start building ATS-optimized resumes.</p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>

        {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}

        <button
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 disabled:opacity-60"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-cyan-300">Login</Link>
        </p>
      </form>
    </main>
  );
}