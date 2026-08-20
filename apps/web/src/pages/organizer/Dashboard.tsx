import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
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
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getMyEvents, getOrganizerOrders } from '../../api';
import type { OrganizerEventRow, OrderRow } from '../../types';

const PLATFORM_FEE = 0.1;
const PURPLE = '#7c3aed';
const GREEN = '#16a34a';
const AMBER = '#f59e0b';

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

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<OrganizerEventRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getMyEvents(), getOrganizerOrders()])
      .then(([e, o]) => {
        setEvents(e);
        setOrders(o);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, []);

  const paid = orders.filter((o) => o.status === 'PAID');
  const revenue = paid.reduce((s, o) => s + o.totalAmount, 0);
  const fee = Math.round(revenue * PLATFORM_FEE);
  const payout = revenue - fee;
  const ticketsSold = events.reduce((s, e) => s + e.ticketTypes.reduce((t, tt) => t + tt.soldQuantity, 0), 0);

  const revenueByDay: Record<string, number> = {};
  paid.forEach((o) => {
    const key = o.createdAt.slice(0, 10);
    revenueByDay[key] = (revenueByDay[key] ?? 0) + o.totalAmount;
  });
  const txData = lastNDates(30).map((d) => ({ date: fmtDay(d), revenue: revenueByDay[d] ?? 0 }));

  const payoutData = [
    { name: 'Your payout', value: payout },
    { name: `Platform fee (${Math.round(PLATFORM_FEE * 100)}%)`, value: fee },
  ];

  const stats = [
    { label: 'Events', value: events.length.toString() },
    { label: 'Orders', value: orders.length.toString() },
    { label: 'Tickets Sold', value: ticketsSold.toString() },
    { label: 'Revenue', value: `KSh ${revenue.toLocaleString()}` },
  ];

  return (
    <OrganizerLayout>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Link to="/organizer/events/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create Event</Link>
      </div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Sales (last 30 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={txData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="orgRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `KSh ${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke={PURPLE} fill="url(#orgRev)" strokeWidth={2} />
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
          <p className="text-sm text-gray-500 mt-2 text-center">KSh {revenue.toLocaleString()} collected · KSh {payout.toLocaleString()} payable</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b"><h3 className="text-xl font-bold">My Events</h3></div>
        <div className="p-6">
          {events.length === 0 && <p className="text-gray-400">No events yet.</p>}
          {events.map((e) => {
            const sold = e.ticketTypes.reduce((t, tt) => t + tt.soldQuantity, 0);
            const cap = e.ticketTypes.reduce((t, tt) => t + tt.quantity, 0);
            const pct = cap ? Math.round((sold / cap) * 100) : 0;
            return (
              <div key={e.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-semibold">{e.title}</p>
                  <p className="text-sm text-gray-500">📅 {new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(e.startDate))}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{sold} / {cap} tickets sold</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </OrganizerLayout>
  );
}
