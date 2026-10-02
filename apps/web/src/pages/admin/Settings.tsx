import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/AdminLayout';
import { Icon } from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { useDashboardTheme } from '../../hooks/useDashboardTheme';

export default function AdminSettings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useDashboardTheme();
  const initials = user?.name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'AD';

  return (
    <AdminLayout>
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Account</p><h2 className="mt-1 text-3xl font-bold">Settings</h2><p className="mt-2 text-gray-500">Manage your profile and sign-in preferences.</p></div>
      <div className="grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white p-6 sm:p-8">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-700 text-xl font-black text-white shadow-lg shadow-blue-900/15">{initials}</span>
            <div className="min-w-0"><h3 className="truncate text-xl font-bold">{user?.name ?? 'Admin account'}</h3><p className="mt-1 truncate text-sm text-gray-500">{user?.email ?? 'No email available'}</p></div>
            <span className="ml-auto rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">Administrator</span>
          </div>
          <dl className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 sm:p-8">
            <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Full name</dt><dd className="mt-2 break-words font-semibold">{user?.name ?? '—'}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Email address</dt><dd className="mt-2 break-all font-semibold">{user?.email ?? '—'}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Phone number</dt><dd className="mt-2 font-semibold">{user?.phone ?? '—'}</dd></div>
            <div><dt className="text-xs font-bold uppercase tracking-wider text-gray-400">Account role</dt><dd className="mt-2 font-semibold">{user?.role ?? '—'}</dd></div>
          </dl>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-700"><Icon name="lock" className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold">Account security</h3><p className="mt-2 text-sm leading-6 text-gray-500">Update your password regularly to keep your administrator account secure.</p>
            <Link to="/forgot-password" className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700 transition hover:text-blue-900">Reset password <Icon name="arrow" className="h-4 w-4" /></Link>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><Icon name={isDark ? 'sun' : 'moon'} className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-bold">Appearance</h3><p className="mt-2 text-sm leading-6 text-gray-500">Choose a display theme. Your preference follows you across the site.</p>
            <button type="button" onClick={toggleTheme} aria-pressed={isDark} className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold transition hover:border-blue-300 hover:bg-blue-50">Switch to {isDark ? 'light' : 'dark'} mode</button>
          </section>
          <p className="px-1 text-xs leading-5 text-gray-400">Platform configuration is managed by your system administrator.</p>
        </div>
      </div>
    </AdminLayout>
  );
}