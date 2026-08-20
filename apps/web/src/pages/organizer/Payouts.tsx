import { useEffect, useState } from 'react';
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getOrganizerOrders } from '../../api';
import type { OrderRow } from '../../types';

const PLATFORM_FEE = 0.1;

export default function OrganizerPayouts() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    getOrganizerOrders().then(setOrders).catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  const paid = orders.filter((o) => o.status === 'PAID');
  const gross = paid.reduce((s, o) => s + o.totalAmount, 0);
  const fee = Math.round(gross * PLATFORM_FEE);
  const payable = gross - fee;

  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Payouts</h2>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Gross Sales</p><p className="text-2xl font-bold mt-1">KSh {gross.toLocaleString()}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Platform Fee (10%)</p><p className="text-2xl font-bold mt-1 text-red-600">- KSh {fee.toLocaleString()}</p></div>
        <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-500">Payable to You</p><p className="text-2xl font-bold mt-1 text-green-600">KSh {payable.toLocaleString()}</p></div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paid.map((o) => (
              <tr key={o.id}>
                <td className="px-6 py-4 font-mono text-sm">{o.orderNumber}</td>
                <td className="px-6 py-4">{o.event.title}</td>
                <td className="px-6 py-4">KSh {o.totalAmount.toLocaleString()}</td>
                <td className="px-6 py-4 text-red-600">- KSh {Math.round(o.totalAmount * PLATFORM_FEE).toLocaleString()}</td>
                <td className="px-6 py-4 text-green-600">KSh {Math.round(o.totalAmount * (1 - PLATFORM_FEE)).toLocaleString()}</td>
              </tr>
            ))}
            {paid.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No payouts yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </OrganizerLayout>
  );
}
