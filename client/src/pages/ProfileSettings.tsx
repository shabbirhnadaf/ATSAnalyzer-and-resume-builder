import { useEffect, useState } from 'react';
import { changePasswordApi, getProfileApi, updateProfileApi } from '../api/profile';
import { resumeTemplates } from '../constants/templates';
import { toErrorText } from '../lib/errorText';

type ProfileForm = {
  name: string;
  email: string;
  selectedTemplate: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
};

const defaultProfile: ProfileForm = {
  name: '',
  email: '',
  selectedTemplate: 'modern',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
};

export default function ProfileSettings() {
  const [form, setForm] = useState<ProfileForm>(defaultProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProfileApi();
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          selectedTemplate: res.data.selectedTemplate || 'modern',
          phone: res.data.phone || '',
          location: res.data.location || '',
          linkedin: res.data.linkedin || '',
          github: res.data.github || '',
          portfolio: res.data.portfolio || '',
        });
      } catch (err: any) {
        setError(
          toErrorText(err?.response?.data?.message) ||
            toErrorText(err?.message) ||
            'Failed to load profile'
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleChange =
    (key: keyof ProfileForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setMessage('');
      setError('');
      const res = await updateProfileApi(form);
      setMessage(res.message || 'Profile updated successfully');
    } catch (err: any) {
      setError(
        toErrorText(err?.response?.data?.message) ||
          toErrorText(err?.message) ||
          'Failed to update profile'
      );
    } finally {
      setSavingProfile(false);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPassword(true);
      setMessage('');
      setError('');
      const res = await changePasswordApi(passwordForm);
      setMessage(res.message || 'Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      setError(
        toErrorText(err?.response?.data?.message) ||
          toErrorText(err?.message) ||
          'Failed to change password'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        Loading settings...
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-7 text-white shadow-[0_24px_80px_rgba(2,8,23,0.28)]">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Settings</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Profile & Preferences</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300">
            Manage your account details, resume defaults, and password from one place.
          </p>
        </div>

        {(message || error) && (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              error
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-100'
                : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
            }`}
          >
            {error || message}
          </div>
        )}

        <form onSubmit={saveProfile} className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5">
            <h2 className="text-[1.35rem] font-semibold text-white">Profile</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Update your identity and default resume preferences.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={handleChange('name')} />
            <Field label="Email" type="email" value={form.email} onChange={handleChange('email')} />
            <Field label="Phone" value={form.phone} onChange={handleChange('phone')} />
            <Field label="Location" value={form.location} onChange={handleChange('location')} />
            <Field label="LinkedIn" value={form.linkedin} onChange={handleChange('linkedin')} />
            <Field label="GitHub" value={form.github} onChange={handleChange('github')} />

            <div className="md:col-span-2">
              <Field label="Portfolio" value={form.portfolio} onChange={handleChange('portfolio')} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Default Template
              </label>
              <select
                value={form.selectedTemplate}
                onChange={handleChange('selectedTemplate')}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
              >
                {resumeTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-6 rounded-xl bg-cyan-400 px-7 py-3.5 font-medium text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {savingProfile ? 'Saving...' : 'Save profile'}
          </button>
        </form>

        <form onSubmit={savePassword} className="rounded-4xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5">
            <h2 className="text-[1.35rem] font-semibold text-white">Security</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Change your password here.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Current password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
            <Field
              label="New password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-6 rounded-xl border border-white/10 px-7 py-3.5 text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
          >
            {savingPassword ? 'Updating...' : 'Change password'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-slate-200">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 text-[15px] text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
      />
    </div>
  );
}