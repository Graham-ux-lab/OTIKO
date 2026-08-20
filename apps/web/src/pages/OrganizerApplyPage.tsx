import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../auth';
import { applyOrganizer } from '../api';

export default function OrganizerApplyPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    phone: '',
    website: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setMessage('Please log in to apply as an organizer.');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      setMessage('You must be logged in to apply.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      await applyOrganizer({
        organizationName: formData.organizationName,
        description: formData.description,
        phone: formData.phone,
        website: formData.website || undefined,
      });
      setSuccess(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold text-purple-700">OTIKO</Link>
            <Link to="/login" className="text-purple-700 font-semibold">Login</Link>
          </div>
        </nav>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-purple-100 text-purple-700">
              <Icon name="shield" className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">Login Required</h1>
            <p className="mt-2 text-gray-600">You need to be logged in to apply as an organizer.</p>
            <Link to="/login" className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold text-purple-700">OTIKO</Link>
            <Link to="/profile" className="text-gray-700">Back to Profile</Link>
          </div>
        </nav>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8"><path d="M5 12l5 5L20 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold">Application Submitted</h1>
            <p className="mt-2 text-gray-600">We have received your organizer application. A verification email has been sent to <strong>{user.email}</strong> and our admin team has been notified for authentication.</p>
            <p className="mt-2 text-sm text-gray-500">Please check your inbox and follow the instructions to complete your verification.</p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <Link to="/profile" className="rounded-full bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800">Back to Profile</Link>
              <button onClick={() => { setSuccess(false); setFormData({ organizationName: '', description: '', phone: '', website: '' }); }} className="text-sm text-purple-700 underline">Submit another application</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold text-purple-700">OTIKO</Link>
          <Link to="/profile" className="text-gray-700">Back to Profile</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Become an Organizer</h1>
            <p className="mt-2 text-gray-600">Create and manage your events on OTIKO. After applying, you will receive a verification email at <strong>{user.email}</strong> and our admin team will be notified for authentication.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Organization Name</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Your organization or brand name"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Organization Description</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your organization and the types of events you organize..."
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Contact Phone</label>
              <input
                type="tel"
                required
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g. +254 700 000 000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Website (Optional)</label>
              <input
                type="url"
                className="mt-1 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus:border-purple-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="https://your-website.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Your application will be reviewed by our team. A verification email will be sent to <strong>{user.email}</strong> once your application is approved.
              </p>
            </div>

            {message && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-purple-700 py-3.5 font-semibold text-white shadow-lg transition hover:bg-purple-800 hover:shadow-xl disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}