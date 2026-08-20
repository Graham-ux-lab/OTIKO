import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AdminLayout } from '../../components/AdminLayout';
import { getUsers, getAdminEvents, getOrganizers, getAdminOrders } from '../../api';
import type { UserRow, AdminEventRow, OrganizerRow, OrderRow } from '../../types';

const PLATFORM_FEE = 0.1;
const PURPLE = '#7c3aed';
const BLUE = '#2563eb';
const AMBER = '#f59e0b';
const GREEN = '#16a34a';

const fmtDay = (iso: string) =>
  new Intl.DateTimeFormat('en-KE', { month: 'short', day: 'numeric' }).format(new Date(iso + 'T00:00:00'));

function lastNDates(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [organizers, setOrganizers] = useState<OrganizerRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUsers(), getAdminEvents(), getOrganizers(), getAdminOrders()])
      .then(([u, e, o, ord]) => {
        setUsers(u);
        setEvents(e);
        setOrganizers(o);
        setOrders(ord);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  const paid = orders.filter((o) => o.status === 'PAID');
  const totalRevenue = paid.reduce((s, o) => s + o.totalAmount, 0);
  const fee = Math.round(totalRevenue * PLATFORM_FEE);
  const payout = totalRevenue - fee;
  const pendingOrganizers = organizers.filter((o) => o.status === 'PENDING').length;

  const revenueByDay: Record<string, number> = {};
  paid.forEach((o) => {
    const key = o.createdAt.slice(0, 10);
    revenueByDay[key] = (revenueByDay[key] ?? 0) + o.totalAmount;
  });
  const txData = lastNDates(30).map((d) => ({ date: fmtDay(d), revenue: revenueByDay[d] ?? 0 }));

  const byEvent: Record<string, number> = {};
  paid.forEach((o) => {
    byEvent[o.event.title] = (byEvent[o.event.title] ?? 0) + o.totalAmount;
  });
  const topEvents = Object.entries(byEvent)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  const payoutData = [
    { name: 'Organizer payout', value: payout },
    { name: `Platform fee (${Math.round(PLATFORM_FEE * 100)}%)`, value: fee },
  ];

  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: '👥' },
    { label: 'Total Organizers', value: organizers.length.toString(), icon: '🏢' },
    { label: 'Total Events', value: events.length.toString(), icon: '📅' },
    { label: 'Revenue (paid)', value: `KSh ${totalRevenue.toLocaleString()}`, icon: '💰' },
    { label: 'Pending Approvals', value: pendingOrganizers.toString(), icon: '⏳' },
  ];

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <span className="text-3xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Transactions (last 30 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={txData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke={PURPLE} fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Payout Split</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={payoutData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {payoutData.map((_, i) => (
                    <Cell key={i} fill={[GREEN, AMBER][i % 2]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">KSh {totalRevenue.toLocaleString()} collected · KSh {payout.toLocaleString()} payable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Top Events by Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEvents} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `KSh ${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" fill={BLUE} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Users</h3>
            <Link to="/admin/users" className="text-blue-600 text-sm">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 font-semibold">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded px-2 py-1 text-xs font-semibold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{u.status}</span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
