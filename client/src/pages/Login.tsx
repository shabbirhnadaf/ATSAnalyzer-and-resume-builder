import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await login(form);
      navigate(from, { replace: true });
    } catch (error) {
      setError('Invalid email or password')
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-white">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Login to continue building your resume.</p>

        <div className="mt-6 space-y-4">
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
          {submitting ? 'Logging in...' : 'Login'}
        </button>

        <p className="mt-4 text-sm text-slate-400">
          Don’t have an account? <Link to="/register" className="text-cyan-300">Create one</Link>
        </p>
      </form>
    </main>
  )
}