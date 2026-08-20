import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Icon } from '../components/Icon';
import { isValidEmail } from '../utils/validation';

export default function LoginPage() {
  const [form, setForm] = useState({ emailOrPhone: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    if (form.emailOrPhone.includes('@') && !isValidEmail(form.emailOrPhone)) {
      setMessage('Please enter a valid email address or phone number.');
      setSubmitting(false);
      return;
    }
    try {
      const user = await login(form.emailOrPhone, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : user.role === 'ORGANIZER' ? '/organizer' : '/profile');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  }
  const benefits = [{ icon: 'ticket' as const, title: 'Discover Events', text: 'Find the best events near you.' }, { icon: 'shield' as const, title: 'Secure Tickets', text: 'Buy tickets safely and instantly.' }, { icon: 'qr' as const, title: 'Instant Access', text: 'Get your e-ticket with QR code.' }];
  return <main className="grid min-h-screen place-items-center bg-gray-100 p-4"><section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl md:grid-cols-2"><aside className="relative hidden overflow-hidden bg-gradient-to-b from-blue-950 via-purple-900 to-indigo-950 p-10 text-white md:block"><div className="relative z-10"><Link to="/" className="text-5xl font-extrabold tracking-tight">OTIKO</Link><h1 className="mt-8 max-w-xs text-2xl font-bold leading-snug">Your Gateway to Unforgettable Events</h1><div className="my-8 h-px w-28 bg-purple-400" /><div className="space-y-6">{benefits.map((benefit) => <div key={benefit.title} className="flex gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-purple-600 text-white"><Icon name={benefit.icon} /></span><div><h2 className="font-bold">{benefit.title}</h2><p className="text-sm text-purple-100">{benefit.text}</p></div></div>)}</div></div><div className="absolute -bottom-16 -left-12 h-48 w-72 rounded-full bg-purple-500/30 blur-3xl" /></aside><div className="p-8 sm:p-12"><h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2><p className="mt-2 text-gray-500">Login to continue to OTIKO</p><div className="mt-7 flex gap-7 border-b"><button className="border-b-2 border-purple-700 pb-3 font-semibold text-purple-700">Email / Phone</button></div><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold text-gray-700">Email / Phone<div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="mail" className="h-5 w-5 text-gray-400" /><input required value={form.emailOrPhone} onChange={(event) => setForm({ ...form, emailOrPhone: event.target.value })} placeholder="Email address or phone" className="w-full py-3 outline-none" /></div></label><label className="block text-sm font-semibold text-gray-700">Password<div className="mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3"><Icon name="lock" className="h-5 w-5 text-gray-400" /><input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" className="w-full py-3 outline-none" /><Icon name="eye" className="h-5 w-5 text-gray-400" /></div></label><Link to="/forgot-password" className="block text-right text-sm font-medium text-purple-700">Forgot password?</Link><button disabled={submitting} className="w-full rounded-lg bg-gradient-to-r from-purple-700 to-purple-600 py-3 font-bold text-white shadow disabled:opacity-50">{submitting ? 'Logging in...' : 'Login'}</button>{message && <p role="alert" className="text-sm text-red-600">{message}</p>}</form><div className="my-6 flex items-center gap-3 text-sm text-gray-400"><span className="h-px flex-1 bg-gray-200" />or continue with<span className="h-px flex-1 bg-gray-200" /></div><div className="grid grid-cols-2 gap-3"><button type="button" className="rounded-lg border py-3 font-medium">Google</button><button type="button" className="rounded-lg border py-3 font-medium">Apple</button></div><p className="mt-7 text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="font-semibold text-purple-700">Sign up</Link></p></div></section></main>;
}
