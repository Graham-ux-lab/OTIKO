import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { applyOrganizer } from '../api';

type Benefit = {
  icon: 'ticket' | 'calendar' | 'shield';
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  { icon: 'ticket', title: 'Reach More People', description: 'Access thousands of active event-goers across Kenya looking for experiences like yours.' },
  { icon: 'calendar', title: 'Easy Event Management', description: 'Create events, manage tickets, and track sales from one powerful dashboard.' },
  { icon: 'shield', title: 'Secure Payments', description: 'Receive payments directly via M-Pesa and bank transfer with full reconciliation.' },
];

const requirements = [
  'Valid business registration certificate',
  'Working email address for communication',
  'Phone number for verification',
  'Description of your event types',
];

export default function OrganizerApplyPage() {
  const [formData, setFormData] = useState({ organizationName: '', email: '', description: '', phone: '', website: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisibleSections((prev) => new Set(prev).add(entry.target.id));
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await applyOrganizer({ organizationName: formData.organizationName, description: formData.description, phone: formData.phone, email: formData.email, website: formData.website || undefined });
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
          .delay-200 { animation-delay: 0.2s; }
          .opacity-0-start { opacity: 0; }
        `}</style>
        <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
            <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
            <Link to="/" className="text-gray-700">Back to Home</Link>
          </div>
        </nav>
        <div className="relative flex min-h-screen items-center justify-center px-4">
          <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
          <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
          <div className="relative max-w-md w-full rounded-3xl bg-white p-8 text-center shadow-2xl animate-scale-in">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8"><path d="M5 12l5 5L20 7" /></svg>
            </div>
            <h1 className="animate-fade-in-up opacity-0-start text-2xl font-bold">Application Submitted</h1>
            <p className="mt-2 text-gray-600 animate-fade-in-up opacity-0-start delay-200">We have received your organizer application. Our team will review it and get back to you shortly.</p>
            <Link to="/" className="mt-8 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800 animate-fade-in-up opacity-0-start delay-200">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <Link to="/" className="text-gray-700">Back to Home</Link>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-24 pt-32 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 animate-float rounded-full bg-pink-400/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="animate-fade-in-up opacity-0-start">
           
          </div>
          <h1 className="mt-6 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-6xl">
            Become an <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}>Organizer</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            Join Kenya's fastest-growing events platform. List your events, sell tickets, and reach thousands of attendees across the country.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <div id="apply" data-animate className="py-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className={`rounded-3xl bg-white p-8 shadow-xl md:p-10 ${isVisible('apply') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
              <h2 className="text-2xl font-extrabold mb-6">Start Your Application</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
                    <input type="text" required className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="Your organization or brand" value={formData.organizationName} onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                    <input type="email" required className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="you@organization.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Contact Phone</label>
                    <input type="tel" required className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="e.g. +254 700 000 000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Website (Optional)</label>
                    <input type="url" className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="https://your-website.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Organization Description</label>
                  <textarea rows={4} required className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="Tell us about your organization and the types of events you organize..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm text-amber-800"><strong>Note:</strong> Your application will be reviewed by our team. We will contact you at the phone number and email provided once your application is approved.</p>
                </div>
                {message && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{message}</div>}
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-purple-700 py-3.5 font-semibold text-white shadow-lg transition hover:bg-purple-800 hover:shadow-xl disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit Application'}</button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`rounded-3xl bg-white p-8 shadow-xl ${isVisible('benefits') ? 'animate-fade-in-up opacity-0-start delay-200' : ''}`}>
              <h3 className="text-xl font-extrabold mb-4">Why Organize With Us?</h3>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-50 text-purple-700"><Icon name={benefit.icon} className="h-5 w-5" /></span>
                    <div><p className="font-semibold text-gray-900">{benefit.title}</p><p className="text-sm text-gray-600">{benefit.description}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-3xl bg-white p-8 shadow-xl ${isVisible('requirements') ? 'animate-fade-in-up opacity-0-start delay-300' : ''}`}>
              <h3 className="text-xl font-extrabold mb-4">Requirements</h3>
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-3xl bg-gradient-to-br from-purple-700 to-indigo-700 p-8 text-white shadow-xl ${isVisible('contact') ? 'animate-fade-in-up opacity-0-start delay-400' : ''}`}>
              <h3 className="text-xl font-extrabold mb-2">Need Help?</h3>
              <p className="text-purple-100 text-sm mb-4">Our team is here to assist you with your application.</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" /> partners@otiko.com</div>
                <div className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4" /> Nairobi, Kenya</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <strong className="text-3xl text-purple-400">OTIKO</strong>
          <p className="mt-3 max-w-xs mx-auto text-gray-400">Discover, book, and experience the best events in Kenya.</p>
          <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500">
            <p>© 2026 OTIKO.ke. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
