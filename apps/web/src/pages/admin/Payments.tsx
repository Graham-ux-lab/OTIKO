import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getAdminOrders } from '../../api';
import type { OrderRow } from '../../types';

export default function AdminPayments() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  useEffect(() => {
    getAdminOrders().then(setOrders).catch(() => {});
  }, []);
  const paid = orders.filter((o) => o.status === 'PAID');
  const total = paid.reduce((s, o) => s + o.totalAmount, 0);
  const pending = orders.filter((o) => o.status !== 'PAID').reduce((s, o) => s + o.totalAmount, 0);
  const all = [...paid, ...orders.filter((o) => o.status !== 'PAID')];
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Payments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Collected</p><p className="text-2xl font-bold mt-1">KSh {total.toLocaleString()}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold mt-1">KSh {pending.toLocaleString()}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Transactions</p><p className="text-2xl font-bold mt-1">{paid.length}</p></div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {all.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-mono text-sm">{o.orderNumber}</td>
                <td className="px-6 py-4">{o.user.name}</td>
                <td className="px-6 py-4">KSh {o.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${o.status === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No payments found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
