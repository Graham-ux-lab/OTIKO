import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Icon } from '../components/Icon';
import { isValidEmail } from '../utils/validation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    if (!isValidEmail(form.email)) {
      setMessage('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }
    try {
      const user = await register(form.name, form.email, form.phone, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'ORGANIZER' ? '/organizer' : '/profile');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  }
  const benefits = [
    { icon: 'ticket' as const, title: 'Discover Events', text: 'Find the best events near you.' },
    { icon: 'shield' as const, title: 'Secure Tickets', text: 'Buy tickets safely and instantly.' },
    { icon: 'qr' as const, title: 'Instant Access', text: 'Get your e-ticket with QR code.' },
  ];
  return (
    <main className="grid min-h-screen place-items-center bg-gray-100 p-4">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-gradient-to-b from-blue-950 via-purple-900 to-indigo-950 p-10 text-white md:block">
          <div className="relative z-10">
            <Link to="/" className="text-5xl font-extrabold tracking-tight">OTIKO</Link>
            <h1 className="mt-8 max-w-xs text-2xl font-bold leading-snug">Join Kenya's Events Platform</h1>
            <div className="my-8 h-px w-28 bg-purple-400" />
            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-purple-600 text-white"><Icon name={benefit.icon} /></span>
                  <div><h2 className="font-bold">{benefit.title}</h2><p className="text-sm text-purple-100">{benefit.text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-16 -left-12 h-48 w-72 rounded-full bg-purple-500/30 blur-3xl" />
        </aside>
        <div className="p-8 sm:p-12">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-500">Sign up to start booking events</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Full name
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="ticket" className="h-5 w-5 text-gray-400" /><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" className="w-full py-3 outline-none" /></div>
            </label>
            <label className="block text-sm font-semibold text-gray-700">Email
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="mail" className="h-5 w-5 text-gray-400" /><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" className="w-full py-3 outline-none" /></div>
            </label>
            <label className="block text-sm font-semibold text-gray-700">Phone
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="pin" className="h-5 w-5 text-gray-400" /><input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="e.g. +2547..." className="w-full py-3 outline-none" /></div>
            </label>
            <label className="block text-sm font-semibold text-gray-700">Password
              <div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="lock" className="h-5 w-5 text-gray-400" /><input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Create a password" className="w-full py-3 outline-none" /></div>
            </label>
            {message && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p>}
            <button type="submit" disabled={submitting} className="w-full rounded-lg bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:opacity-60">{submitting ? 'Creating account...' : 'Sign Up'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-purple-700">Log in</Link></p>
        </div>
      </section>
    </main>
  );
}
