import { Navigate } from 'react-router-dom';
import { useAuth } from './auth';
import type { ReactNode } from 'react';

export function ProtectedRoute({ role, children }: { role?: string; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-gray-500">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    const fallback = user.role === 'ADMIN' ? '/admin' : user.role === 'ORGANIZER' ? '/organizer' : '/';
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}
