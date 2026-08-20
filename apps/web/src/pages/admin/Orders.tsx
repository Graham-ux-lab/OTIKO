import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getAdminOrders } from '../../api';
import type { OrderRow } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getAdminOrders().then(setOrders).catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);
  const total = orders.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.totalAmount, 0);
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Orders</h2>
        <p className="text-gray-600">Paid revenue: <span className="font-bold">KSh {total.toLocaleString()}</span></p>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-mono text-sm">{o.orderNumber}</td>
                <td className="px-6 py-4">{o.user.name}</td>
                <td className="px-6 py-4">{o.event.title}</td>
                <td className="px-6 py-4">KSh {o.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${o.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No orders found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
