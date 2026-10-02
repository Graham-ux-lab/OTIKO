import { useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  if (pathname.startsWith('/admin') || pathname.startsWith('/organizer')) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="site-theme-toggle fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-4 py-3 text-sm font-bold text-slate-700 shadow-xl backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
    >
      <Icon name={isDark ? 'sun' : 'moon'} className="h-5 w-5" />
      <span>{isDark ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}
