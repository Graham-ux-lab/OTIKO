import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { getUsers, getAdminEvents, getAdminOrders, getOrganizers } from '../../api';
import type { AdminEventRow, AdminOrderRow, OrganizerRow, UserRow } from '../../types';

type ReportData = { users: UserRow[]; events: AdminEventRow[]; organizers: OrganizerRow[]; orders: AdminOrderRow[] };
type CsvValue = string | number;

function downloadCsv(filename: string, headers: string[], rows: CsvValue[][]) {
  const escape = (value: CsvValue) => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const currency = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`;
const date = (value: string | null | undefined) => value ? new Date(value).toLocaleDateString('en-KE', { dateStyle: 'medium' }) : '—';

export default function AdminReports() {
  const [data, setData] = useState<ReportData>({ users: [], events: [], organizers: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getUsers(), getAdminEvents(), getOrganizers(), getAdminOrders()])
      .then(([users, events, organizers, orders]) => setData({ users, events, organizers, orders }))
      .catch((cause) => setError(cause instanceof Error ? cause.message : 'Unable to load report data.'))
      .finally(() => setLoading(false));
  }, []);

  const report = useMemo(() => {
    const paidOrders = data.orders.filter((order) => order.status === 'PAID');
    const paidRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const byStatus = (items: { status: string }[]) => items.reduce<Record<string, number>>((counts, item) => {
      counts[item.status] = (counts[item.status] ?? 0) + 1;
      return counts;
    }, {});
    const revenueByEvent = paidOrders.reduce<Record<string, number>>((totals, order) => {
      totals[order.event.title] = (totals[order.event.title] ?? 0) + order.totalAmount;
      return totals;
    }, {});
    const revenueByMonth = paidOrders.reduce<Record<string, number>>((totals, order) => {
      const month = order.createdAt.slice(0, 7);
      totals[month] = (totals[month] ?? 0) + order.totalAmount;
      return totals;
    }, {});
    const organizerStats = data.organizers.map((organizer) => {
      const events = data.events.filter((event) => event.organizer.organizationName === organizer.organizationName);
      const eventNames = new Set(events.map((event) => event.title));
      const orders = paidOrders.filter((order) => eventNames.has(order.event.title));
      return {
        organizer,
        events,
        orders,
        revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      };
    }).sort((a, b) => b.revenue - a.revenue || a.organizer.organizationName.localeCompare(b.organizer.organizationName));
    return { paidOrders, paidRevenue, userStatus: byStatus(data.users), eventStatus: byStatus(data.events), organizerStatus: byStatus(data.organizers), orderStatus: byStatus(data.orders), revenueByEvent, revenueByMonth, organizerStats };
  }, [data]);

  const downloadSummary = () => downloadCsv('otiko-report-summary.csv', ['Metric', 'Value'], [
    ['Generated at', new Date().toISOString()], ['Total users', data.users.length], ['Total events', data.events.length],
    ['Total organizers', data.organizers.length], ['Total orders', data.orders.length], ['Paid orders', report.paidOrders.length],
    ['Paid revenue (KSh)', report.paidRevenue],
  ]);
  const downloadOrders = () => downloadCsv('otiko-orders-report.csv', ['Order number', 'Customer', 'Email', 'Event', 'Status', 'Amount (KSh)', 'Date'],
    data.orders.map((o) => [o.orderNumber, o.user.name, o.user.email, o.event.title, o.status, o.totalAmount, date(o.createdAt)]));
  const downloadEvents = () => downloadCsv('otiko-events-report.csv', ['Event', 'Category', 'Organizer', 'Status', 'Start date', 'Location', 'Venue', 'Ticket types', 'Orders'],
    data.events.map((e) => [e.title, e.category.name, e.organizer.organizationName, e.status, date(e.startDate), e.location, e.venue, e._count.ticketTypes, e._count.orders]));
  const downloadUsers = () => downloadCsv('otiko-users-report.csv', ['Name', 'Email', 'Phone', 'Role', 'Status', 'Joined'],
    data.users.map((u) => [u.name, u.email, u.phone, u.role, u.status, date(u.createdAt)]));
  const downloadOrganizers = () => downloadCsv('otiko-organizers-report.csv', ['Organization', 'Contact name', 'Email', 'Phone', 'Status', 'Applied', 'Approved', 'Events', 'Published events', 'Paid orders', 'Paid revenue (KSh)'],
    report.organizerStats.map(({ organizer, events, orders, revenue }) => [organizer.organizationName, organizer.user.name, organizer.user.email, organizer.user.phone, organizer.status, date(organizer.createdAt), date(organizer.approvedAt), events.length, events.filter((event) => event.status === 'PUBLISHED').length, orders.length, revenue]));

  const statusList = (title: string, counts: Record<string, number>) => (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-bold">{title}</h3>
      <dl className="mt-4 space-y-3">{Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([status, count]) => (
        <div key={status} className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0"><dt className="text-gray-600">{status.replaceAll('_', ' ')}</dt><dd className="font-bold">{count}</dd></div>
      ))}{!Object.keys(counts).length && <p className="text-sm text-gray-500">No records yet</p>}</dl>
    </section>
  );

  return (
    <AdminLayout>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Platform insights</p><h2 className="mt-1 text-3xl font-bold">Reports</h2><p className="mt-2 text-gray-500">Detailed activity, sales, and account summaries across OTIKO.</p></div>
        <button type="button" onClick={downloadSummary} disabled={loading || !!error} className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">Download summary CSV</button>
      </div>
      {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">Loading report data…</div> : <>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Users', value: data.users.length, detail: `${report.userStatus.ACTIVE ?? 0} active` },
            { label: 'Events', value: data.events.length, detail: `${report.eventStatus.PUBLISHED ?? 0} published` },
            { label: 'Organizers', value: data.organizers.length, detail: `${report.organizerStatus.APPROVED ?? 0} approved` },
            { label: 'Orders', value: data.orders.length, detail: `${report.paidOrders.length} paid` },
          ].map((item) => <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">Total {item.label.toLowerCase()}</p><p className="mt-1 text-3xl font-bold">{item.value.toLocaleString()}</p><p className="mt-2 text-sm text-gray-500">{item.detail}</p></div>)}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:col-span-2"><p className="text-sm font-medium text-blue-800">Collected revenue</p><p className="mt-1 text-3xl font-bold text-blue-950">{currency(report.paidRevenue)}</p><p className="mt-2 text-sm text-blue-800">From {report.paidOrders.length} paid orders</p></div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2"><p className="text-sm text-gray-500">Average paid order</p><p className="mt-1 text-3xl font-bold">{currency(report.paidOrders.length ? Math.round(report.paidRevenue / report.paidOrders.length) : 0)}</p><p className="mt-2 text-sm text-gray-500">Based on completed payments</p></div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statusList('Users by status', report.userStatus)}{statusList('Events by status', report.eventStatus)}{statusList('Organizers by status', report.organizerStatus)}{statusList('Orders by status', report.orderStatus)}
        </div>

        <section className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div><h3 className="text-lg font-bold">Organizer performance</h3><p className="mt-1 text-sm text-gray-500">Event activity and paid sales grouped by organizer.</p></div>
            <button type="button" onClick={downloadOrganizers} className="self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 sm:self-auto">Download organizer report CSV</button>
          </div>
          <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr>
            <th className="px-5 py-3">Organization</th><th className="px-5 py-3">Contact</th><th className="px-5 py-3">Approval</th><th className="px-5 py-3 text-right">Events</th><th className="px-5 py-3 text-right">Published</th><th className="px-5 py-3 text-right">Paid orders</th><th className="px-5 py-3 text-right">Paid revenue</th>
          </tr></thead><tbody className="divide-y divide-gray-100">
            {report.organizerStats.map(({ organizer, events, orders, revenue }) => <tr key={organizer.id}>
              <td className="px-5 py-4"><p className="font-semibold">{organizer.organizationName}</p><p className="mt-1 max-w-xs truncate text-xs text-gray-500">{organizer.description || 'No description provided'}</p></td>
              <td className="px-5 py-4"><p>{organizer.user.name}</p><p className="mt-1 text-xs text-gray-500">{organizer.user.email}</p></td>
              <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${organizer.status === 'APPROVED' ? 'bg-green-100 text-green-700' : organizer.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{organizer.status}</span><p className="mt-2 text-xs text-gray-500">Applied {date(organizer.createdAt)}</p></td>
              <td className="px-5 py-4 text-right font-semibold">{events.length}</td><td className="px-5 py-4 text-right">{events.filter((event) => event.status === 'PUBLISHED').length}</td><td className="px-5 py-4 text-right">{orders.length}</td><td className="px-5 py-4 text-right font-semibold">{currency(revenue)}</td>
            </tr>)}
            {!report.organizerStats.length && <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No organizers found</td></tr>}
          </tbody></table></div>
        </section>

        <div className="mb-8 grid gap-6 xl:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6"><h3 className="text-lg font-bold">Revenue by event</h3><p className="mt-1 text-sm text-gray-500">Paid order totals, highest first.</p></div>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-3">Event</th><th className="px-6 py-3 text-right">Revenue</th></tr></thead><tbody className="divide-y divide-gray-100">
              {Object.entries(report.revenueByEvent).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([event, revenue]) => <tr key={event}><td className="px-6 py-3 font-medium">{event}</td><td className="px-6 py-3 text-right font-semibold">{currency(revenue)}</td></tr>)}
              {!Object.keys(report.revenueByEvent).length && <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No paid event orders yet</td></tr>}
            </tbody></table></div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6"><h3 className="text-lg font-bold">Monthly revenue</h3><p className="mt-1 text-sm text-gray-500">Paid orders grouped by month.</p></div>
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-6 py-3">Month</th><th className="px-6 py-3 text-right">Revenue</th></tr></thead><tbody className="divide-y divide-gray-100">
              {Object.entries(report.revenueByMonth).sort(([a], [b]) => b.localeCompare(a)).slice(0, 8).map(([month, revenue]) => <tr key={month}><td className="px-6 py-3 font-medium">{new Date(`${month}-01T00:00:00`).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</td><td className="px-6 py-3 text-right font-semibold">{currency(revenue)}</td></tr>)}
              {!Object.keys(report.revenueByMonth).length && <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No paid orders yet</td></tr>}
            </tbody></table></div>
          </section>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4"><h3 className="text-lg font-bold">Download detailed data</h3><p className="mt-1 text-sm text-gray-500">CSV files open in spreadsheet apps such as Excel and Google Sheets.</p></div>
          <div className="flex flex-wrap gap-3">
            {[["Orders", downloadOrders], ["Events", downloadEvents], ["Users", downloadUsers]].map(([label, action]) => <button key={label as string} type="button" onClick={action as () => void} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50">Download {label as string} CSV</button>)}
          </div>
        </section>
      </>}
    </AdminLayout>
  );
}
