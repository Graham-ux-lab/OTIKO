import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getUsers, getAdminEvents, getAdminOrders, getOrganizers } from '../../api';

export default function AdminReports() {
  const [data, setData] = useState({ users: 0, events: 0, organizers: 0, orders: 0, revenue: 0 });
  useEffect(() => {
    Promise.all([getUsers(), getAdminEvents(), getOrganizers(), getAdminOrders()])
      .then(([u, e, o, ord]) =>
        setData({
          users: u.length,
          events: e.length,
          organizers: o.length,
          orders: ord.length,
          revenue: ord.filter((x) => x.status === 'PAID').reduce((s, x) => s + x.totalAmount, 0),
        }),
      )
      .catch(() => {});
  }, []);
  const cards = [
    { label: 'Total Users', value: data.users.toString() },
    { label: 'Total Events', value: data.events.toString() },
    { label: 'Total Organizers', value: data.organizers.toString() },
    { label: 'Total Orders', value: data.orders.toString() },
    { label: 'Total Revenue', value: `KSh ${data.revenue.toLocaleString()}` },
  ];
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
