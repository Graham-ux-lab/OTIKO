import { useEffect, useState } from 'react';
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
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getMyEvents, getOrganizerOrders } from '../../api';
import type { OrganizerEventRow, OrderRow } from '../../types';

const PLATFORM_FEE = 0.1;
const PURPLE = '#7c3aed';
const BLUE = '#2563eb';
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

export default function OrganizerAnalytics() {
  const [events, setEvents] = useState<OrganizerEventRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  useEffect(() => {
    Promise.all([getMyEvents(), getOrganizerOrders()])
      .then(([e, o]) => {
        setEvents(e);
        setOrders(o);
      })
      .catch(() => {});
  }, []);

  const paid = orders.filter((o) => o.status === 'PAID');
  const revenue = paid.reduce((s, o) => s + o.totalAmount, 0);
  const fee = Math.round(revenue * PLATFORM_FEE);
  const payout = revenue - fee;
  const ticketsSold = events.reduce((s, e) => s + e.ticketTypes.reduce((t, tt) => t + tt.soldQuantity, 0), 0);
  const ticketsCap = events.reduce((s, e) => s + e.ticketTypes.reduce((t, tt) => t + tt.quantity, 0), 0);
  const conversion = ticketsCap ? Math.round((ticketsSold / ticketsCap) * 100) : 0;

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
    { name: 'Your payout', value: payout },
    { name: `Platform fee (${Math.round(PLATFORM_FEE * 100)}%)`, value: fee },
  ];

  const cards = [
    { label: 'Total Revenue', value: `KSh ${revenue.toLocaleString()}` },
    { label: 'Tickets Sold', value: ticketsSold.toString() },
    { label: 'Ticket Capacity', value: ticketsCap.toString() },
    { label: 'Sell-through', value: `${conversion}%` },
  ];

  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-bold mb-4">Revenue (last 30 days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={txData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="anRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BLUE} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `KSh ${(Number(v) / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
                <Area type="monotone" dataKey="revenue" stroke={BLUE} fill="url(#anRev)" strokeWidth={2} />
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

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Top Events by Revenue</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topEvents} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `KSh ${(Number(v) / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `KSh ${Number(v).toLocaleString()}`} />
              <Bar dataKey="value" fill={PURPLE} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </OrganizerLayout>
  );
}
