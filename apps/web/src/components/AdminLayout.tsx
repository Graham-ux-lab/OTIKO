import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../auth';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">OTIKO Admin</h1>
        <nav className="space-y-2">
          {links.map((link) => {
            const active = link.end ? pathname === link.to : pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to} className={`block py-2 px-4 rounded-lg ${active ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-300 mb-3 truncate">{user?.name ?? 'Admin'}</p>
          <button onClick={onLogout} className="w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-red-600 transition text-sm font-semibold">Log out</button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
