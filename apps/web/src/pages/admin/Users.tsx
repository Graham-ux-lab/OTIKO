import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getUsers, setUserStatus } from '../../api';
import type { UserRow } from '../../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => getUsers().then(setUsers).catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string, current: string) {
    setBusy(id);
    setError('');
    try {
      await setUserStatus(id, current === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE');
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Users</h2>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 font-semibold">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phone}</td>
                <td className="px-6 py-4">{u.role}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{u.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button disabled={busy === u.id} onClick={() => toggle(u.id, u.status)} className="text-blue-600 hover:text-blue-800 disabled:opacity-50">
                    {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
