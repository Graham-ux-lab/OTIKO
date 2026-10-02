import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export default function OrganizerSignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    description: '',
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agree) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await api.registerOrganizer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        organizationName: formData.organizationName,
        description: formData.description,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="flex justify-center mb-6">
            <span className="text-4xl font-black tracking-tight text-blue-700">OTIKO</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted</h2>
          <p className="text-gray-600 mb-8">
            Your organizer account is under review. You'll be notified once an admin approves your application.
          </p>
          <Link
            to="/login"
            className="inline-block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">

        {/* LEFT PANEL */}
        <div className="md:w-1/2 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-10 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 -left-10 w-64 h-64 rounded-full bg-blue-400 blur-3xl"></div>
            <div className="absolute bottom-20 right-0 w-72 h-72 rounded-full bg-blue-300 blur-3xl"></div>
          </div>

          <div className="hidden md:block absolute right-0 top-0 h-full w-12 pointer-events-none">
            <div className="flex flex-col h-full justify-around">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-white rounded-full -mr-1.5"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-xl font-light opacity-90 mb-2">Welcome to</p>

            <div className="my-8 flex flex-col items-center">
              <div className="mb-6 shadow-lg rounded-full">
                <span className="text-5xl font-black tracking-tight text-white">OTIKO</span>
              </div>
              <h1 className="text-4xl font-bold tracking-wide">OTIKO</h1>
              <p className="text-sm opacity-80 mt-2 tracking-widest uppercase">The Pulse of Events</p>
            </div>

            <p className="text-center text-white/90 text-sm leading-relaxed mt-8 max-w-xs mx-auto">
              Create your organizer account to unlock premium features and start hosting unforgettable events. Join our community and embark on an exciting journey with us!
            </p>
          </div>

          <div className="relative z-10 flex justify-center gap-4 text-xs uppercase tracking-widest text-white/80 mt-8">
            <Link to="/login" className="hover:text-white transition-colors">Login Here</Link>
            <span className="opacity-50">|</span>
            <Link to="/explore" className="hover:text-white transition-colors">Discover Here</Link>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
              Create your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter organization name"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About Your Organization</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tell us about your organization"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <label className="flex items-start cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">I agree to the terms and Conditions</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60"
              >
                {loading ? 'Submitting...' : 'Sign Up'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">Sign Up with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="flex justify-center gap-6">
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-600" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
