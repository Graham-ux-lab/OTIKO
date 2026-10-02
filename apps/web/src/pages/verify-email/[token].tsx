import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    api.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      })
      .catch((error: unknown) => {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      });
  }, [token]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center">
        {status === 'loading' && (
          <>
            <div className="text-6xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
            <p className="text-gray-600">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
              <p className="font-semibold mb-1">What happens next?</p>
              <p>Your organizer account is now pending review. An admin will approve it shortly. You'll receive another email once approved.</p>
            </div>

            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>

            <div className="bg-red-50 rounded-lg p-4 text-sm text-gray-700 mb-6">
              <p>The link may have expired or already been used. Try registering again or contact support@otiko.com.</p>
            </div>

            <Link
              to="/organizer-signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block"
            >
              Register Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
