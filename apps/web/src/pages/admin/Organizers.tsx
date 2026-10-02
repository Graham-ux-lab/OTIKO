import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { api } from '../../lib/api';

interface Organizer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  organizerProfile?: {
    id: string;
    organizationName: string;
    description: string;
    status: string;
  };
}

export default function AdminOrganizers() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrganizers();
  }, [filter]);

  const loadOrganizers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = filter === 'ALL' ? '' : filter;
      const data: any = await api.getAdminOrganizers(params);
      setOrganizers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    setError('');
    try {
      const result = await api.approveOrganizer(id);
      setActionMessage(result.message);
      await loadOrganizers();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not approve organizer');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectingId) return;
    if (rejectReason.length < 5) {
      setError('Please provide a reason (at least 5 characters)');
      return;
    }
    try {
      await api.rejectOrganizer(rejectingId, rejectReason);
      setActionMessage('Organizer rejected. Notification email sent.');
      setRejectingId(null);
      setRejectReason('');
      loadOrganizers();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const statusColor = (status?: string) => {
    if (status === 'VERIFIED') return 'bg-green-100 text-green-700';
    if (status === 'PENDING') return 'bg-yellow-100 text-yellow-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <AdminLayout>
      <div className="min-w-0">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Organizer Management</h2>
          <button onClick={loadOrganizers} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Refresh
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['PENDING', 'VERIFIED', 'REJECTED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={'px-4 py-2 rounded-lg font-semibold ' + (
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {actionMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {actionMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Organizers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading organizers...</div>
          ) : organizers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No {filter.toLowerCase() !== 'all' ? filter.toLowerCase() : ''} organizers found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {organizers.map((org) => (
                  <tr key={org.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{org.organizerProfile?.organizationName || org.name}</p>
                      <p className="text-sm text-gray-500">{org.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{org.email}</p>
                      <p className="text-sm text-gray-500">{org.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={'px-2 py-1 rounded text-xs font-semibold ' + statusColor(org.organizerProfile?.status)}>
                        {org.organizerProfile?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {org.organizerProfile?.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(org.id)}
                            disabled={approvingId === org.id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
                          >
                            {approvingId === org.id ? 'Sending...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setRejectingId(org.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {org.organizerProfile?.status === 'VERIFIED' && (
                        <span className="text-green-600 text-sm">✓ Verified</span>
                      )}
                      {org.organizerProfile?.status === 'REJECTED' && (
                        <button
                          onClick={() => handleApprove(org.id)}
                          disabled={approvingId === org.id}
                          className="text-blue-600 text-sm hover:underline disabled:cursor-wait disabled:opacity-60"
                        >
                          {approvingId === org.id ? 'Sending...' : 'Re-approve'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Organizer</h3>
            <p className="text-sm text-gray-600 mb-4">
              The organizer will receive an email with this reason.
            </p>
            <textarea
              rows={4}
              placeholder="Enter reason for rejection..."
              className="w-full px-3 py-2 border rounded-lg mb-4"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setRejectingId(null); setRejectReason(''); }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Reject Organizer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
