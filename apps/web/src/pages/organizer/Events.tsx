import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getMyEvents, organizerSetEventStatus, organizerDeleteEvent } from '../../api';
import type { OrganizerEventRow } from '../../types';

const fmt = (iso: string) => new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

export default function OrganizerEvents() {
  const [events, setEvents] = useState<OrganizerEventRow[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => getMyEvents().then(setEvents).catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
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
    <OrganizerLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Events</h2>
        <Link to="/organizer/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create New Event</Link>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events.map((e) => {
              const sold = e.ticketTypes.reduce((t, tt) => t + tt.soldQuantity, 0);
              return (
                <tr key={e.id}>
                  <td className="px-6 py-4 font-semibold">{e.title}</td>
                  <td className="px-6 py-4">{fmt(e.startDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded px-2 py-1 text-xs font-semibold ${e.status === 'PUBLISHED' ? 'bg-green-100 text-green-600' : e.status === 'SUSPENDED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{e.status}</span>
                  </td>
                  <td className="px-6 py-4">{sold}</td>
                  <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                    {e.status !== 'PUBLISHED' && (
                      <button disabled={busy === e.id} onClick={() => act(e.id, () => organizerSetEventStatus(e.id, 'PUBLISHED'))} className="text-green-600 hover:text-green-800 disabled:opacity-50">Publish</button>
                    )}
                    {e.status !== 'DRAFT' && (
                      <button disabled={busy === e.id} onClick={() => act(e.id, () => organizerSetEventStatus(e.id, 'DRAFT'))} className="text-gray-600 hover:text-gray-800 disabled:opacity-50">Unpublish</button>
                    )}
                    <button disabled={busy === e.id} onClick={() => { if (confirm('Delete this event?')) act(e.id, () => organizerDeleteEvent(e.id)); }} className="text-red-600 hover:text-red-800 disabled:opacity-50">Delete</button>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No events yet. Create your first event.</td></tr>}
          </tbody>
        </table>
      </div>
    </OrganizerLayout>
  );
}
