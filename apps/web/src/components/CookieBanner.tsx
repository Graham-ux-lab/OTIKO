import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('otiko_cookie_consent');
    if (!consent) {
      // Show after a short delay so the page can load first
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('otiko_cookie_consent', 'accepted');
    localStorage.setItem('otiko_cookie_consent_date', new Date().toISOString());
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('otiko_cookie_consent', 'declined');
    localStorage.setItem('otiko_cookie_consent_date', new Date().toISOString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-6 pointer-events-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-3xl">🍪</div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">We use cookies</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use cookies to keep you logged in, remember your preferences, and improve your
              experience on OTIKO. By clicking "Accept", you consent to our use of cookies.
              Read our{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{' '}
              for more details.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={decline}
              className="flex-1 md:flex-none px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold whitespace-nowrap"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}