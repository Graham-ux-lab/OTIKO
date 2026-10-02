import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MyTicketsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900">Sign in to view tickets</h1>
          <p className="mt-4 text-gray-600">You need to be logged in to see your tickets.</p>
          <Link to="/login" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 text-center text-gray-500">
            <p>No tickets yet. <Link to="/explore" className="text-blue-600 hover:underline">Browse events</Link> to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );
}