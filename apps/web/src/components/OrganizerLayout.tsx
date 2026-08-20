import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../auth';

const links = [
  { to: '/organizer', label: 'Dashboard', end: true },
  { to: '/organizer/events', label: 'Events' },
  { to: '/organizer/orders', label: 'Orders' },
  { to: '/organizer/attendees', label: 'Attendees' },
  { to: '/organizer/analytics', label: 'Analytics' },
  { to: '/organizer/payouts', label: 'Payouts' },
  { to: '/organizer/coupons', label: 'Coupons' },
  { to: '/organizer/notifications', label: 'Notifications' },
  { to: '/organizer/settings', label: 'Settings' },
  { to: '/organizer/help', label: 'Help & Support' },
];

export function OrganizerLayout({ children }: { children: ReactNode }) {
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
        <h1 className="text-2xl font-bold mb-8">OTIKO</h1>
        <nav className="space-y-1">
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
          <p className="text-sm text-gray-300 mb-3 truncate">{user?.name ?? 'Organizer'}</p>
          <button onClick={onLogout} className="w-full py-2 px-4 rounded-lg bg-gray-800 hover:bg-red-600 transition text-sm font-semibold">Log out</button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
