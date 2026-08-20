import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getAdminEvents, setEventStatus, deleteEvent } from '../../api';
import type { AdminEventRow } from '../../types';

const fmt = (iso: string) => new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export default function AdminEvents() {
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => getAdminEvents().then(setEvents).catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  useEffect(() => {
    load();
  }, []);

  async function act(id: string, fn: () => Promise<unknown>) {
    setBusy(id);
    setError('');
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Event Management</h2>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="px-6 py-4 font-semibold">{e.title}</td>
                <td className="px-6 py-4">{e.organizer.organizationName}</td>
                <td className="px-6 py-4">{e.category.name}</td>
                <td className="px-6 py-4">{fmt(e.startDate)}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${e.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : e.status === 'SUSPENDED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{e.status}</span>
                </td>
                <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                  {e.status !== 'PUBLISHED' && (
                    <button disabled={busy === e.id} onClick={() => act(e.id, () => setEventStatus(e.id, 'PUBLISHED'))} className="text-green-600 hover:text-green-800 disabled:opacity-50">Publish</button>
                  )}
                  {e.status !== 'SUSPENDED' && (
                    <button disabled={busy === e.id} onClick={() => act(e.id, () => setEventStatus(e.id, 'SUSPENDED'))} className="text-red-600 hover:text-red-800 disabled:opacity-50">Suspend</button>
                  )}
                  <button disabled={busy === e.id} onClick={() => { if (confirm('Delete this event?')) act(e.id, () => deleteEvent(e.id)); }} className="text-gray-600 hover:text-gray-800 disabled:opacity-50">Delete</button>
                </td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No events found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
