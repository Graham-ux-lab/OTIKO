import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboardTheme } from '../hooks/useDashboardTheme';
import { Icon } from './Icon';

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
  const { isDark, toggleTheme } = useDashboardTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) setDesktopSidebarOpen((open) => !open);
    else setSidebarOpen((open) => !open);
  };
  const onLogout = () => { logout(); navigate('/'); };

  return (
    <div className={`dashboard-shell min-h-screen lg:flex ${isDark ? 'dashboard-dark' : 'bg-gray-100 text-gray-900'}`}>
      {sidebarOpen && <button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden" />}
      <aside id="admin-sidebar" className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-gray-900 p-5 text-white transition-transform duration-300 lg:static lg:min-h-screen lg:w-64 lg:max-w-none lg:translate-x-0 lg:p-6 ${desktopSidebarOpen ? 'lg:flex' : 'lg:hidden'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between"><h1 className="text-2xl font-bold">OTIKO Admin</h1><button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="rounded-lg p-2 hover:bg-gray-800 lg:hidden"><Icon name="close" className="h-5 w-5" /></button></div>
        <nav className="space-y-2" aria-label="Admin navigation">
          {links.map((link) => {
            const active = link.end ? pathname === link.to : pathname.startsWith(link.to);
            return <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)} aria-current={active ? 'page' : undefined} className={`block rounded-lg px-4 py-2 transition-colors ${active ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>{link.label}</Link>;
          })}
        </nav>
        <button type="button" onClick={toggleTheme} aria-pressed={isDark} className="mt-6 flex w-full items-center gap-3 rounded-lg border border-gray-700 px-4 py-2 text-left text-sm hover:bg-gray-800"><Icon name={isDark ? 'sun' : 'moon'} className="h-5 w-5" /><span>{isDark ? 'Light mode' : 'Dark mode'}</span></button>
        <div className="mt-auto border-t border-gray-700 pt-6"><p className="mb-3 truncate text-sm text-gray-300">{user?.name ?? 'Admin'}</p><button onClick={onLogout} className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold transition hover:bg-red-600">Log out</button></div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
          <button type="button" aria-label="Toggle admin navigation" aria-expanded={sidebarOpen || desktopSidebarOpen} aria-controls="admin-sidebar" onClick={toggleSidebar} className="rounded-lg border border-gray-200 p-2 text-gray-700"><Icon name="menu" className="h-5 w-5" /></button>
          <span className="font-bold">OTIKO Admin</span><span className="ml-auto truncate text-sm text-gray-500">{user?.name}</span>
        </header>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
