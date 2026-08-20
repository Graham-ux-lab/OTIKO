import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getOrganizers, approveOrganizer, rejectOrganizer } from '../../api';
import type { OrganizerRow } from '../../types';

export default function AdminOrganizers() {
  const [rows, setRows] = useState<OrganizerRow[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => getOrganizers().then(setRows).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load organizers'));
  useEffect(() => {
    load();
  }, []);

  async function act(id: string, fn: (id: string) => Promise<unknown>) {
    setBusy(id);
    setError('');
    try {
      await fn(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Organizers</h2>
        <p className="mt-1 text-sm text-gray-500">Review organizer applications. Admins receive an email notification for each new application requiring authentication.</p>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-semibold">{o.organizationName}</td>
                <td className="px-6 py-4">{o.user.name}</td>
                <td className="px-6 py-4">{o.user.email}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${o.status === 'APPROVED' ? 'bg-green-100 text-green-600' : o.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {o.status !== 'APPROVED' && (
                    <button disabled={busy === o.id} onClick={() => act(o.id, approveOrganizer)} className="text-green-600 hover:text-green-800 disabled:opacity-50">Approve</button>
                  )}
                  {o.status !== 'REJECTED' && (
                    <button disabled={busy === o.id} onClick={() => act(o.id, rejectOrganizer)} className="text-red-600 hover:text-red-800 disabled:opacity-50">Reject</button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No organizers found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
