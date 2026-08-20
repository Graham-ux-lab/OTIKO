import { useEffect, useState } from 'react';
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getOrganizerOrders } from '../../api';
import type { OrderRow } from '../../types';

export default function OrganizerAttendees() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getOrganizerOrders().then(setOrders).catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  const attendees = orders
    .filter((o) => o.status === 'PAID')
    .map((o) => ({ name: o.user.name, email: o.user.email, event: o.event.title, qty: o.items.reduce((s, i) => s + i.quantity, 0) }));

  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Attendees</h2>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendees.map((a, i) => (
              <tr key={i}>
                <td className="px-6 py-4 font-semibold">{a.name}</td>
                <td className="px-6 py-4">{a.email}</td>
                <td className="px-6 py-4">{a.event}</td>
                <td className="px-6 py-4">{a.qty}</td>
              </tr>
            ))}
            {attendees.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No attendees yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </OrganizerLayout>
  );
}
