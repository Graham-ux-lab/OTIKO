import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getMyOrders } from '../api';

type Ticket = {
  id: string;
  event: string;
  date: string;
  type: string;
  status: string;
  price: number;
  seat?: string;
  venue?: string;
  gate?: string;
};

const fallbackTickets: Ticket[] = [
  { id: 'TKT-2026-001', event: 'Kenya Music Festival 2026', date: '15 Sep 2026', type: 'VIP', status: 'Upcoming', price: 5000, seat: 'A-12', venue: 'KICC', gate: 'Gate 3' },
  { id: 'TKT-2026-002', event: 'Comedy Night Live', date: '30 Sep 2026', type: 'Regular', status: 'Upcoming', price: 800, seat: 'B-05', venue: 'Sarit Centre', gate: 'Gate 1' },
];

export default function MyTicketsPage() {
  const [query, setQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [tickets, setTickets] = useState<Ticket[]>(fallbackTickets);

  useEffect(() => {
    void getMyOrders()
      .then((orders) => {
        const mapped: Ticket[] = orders.map((order) => ({
          id: order.orderNumber || order.id,
          event: order.event.title,
          date: new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(order.createdAt)),
          type: order.items[0]?.unitPrice ? 'Standard' : 'Ticket',
          status: order.status,
          price: order.totalAmount,
          venue: order.event.title,
          gate: 'Gate 1',
        }));
        setTickets(mapped.length ? mapped : fallbackTickets);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);
  const visibleTickets = tickets.filter((ticket) => ticket.event.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/explore" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Explore</Link>
            <Link to="/profile" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Profile</Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-20 pt-32 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="animate-fade-in-up opacity-0-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5 text-sm font-bold shadow-lg">
              <Icon name="ticket" className="h-4 w-4" /> Your Events
            </span>
          </div>
          <h1 className="mt-6 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-6xl">
            My <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">Tickets</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            All your bookings in one place. Tap any ticket to view details and check in.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section id="tickets" data-animate className={`py-12 transition-all duration-700 ${isVisible('tickets') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-extrabold">Your Bookings</h2>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by event name..."
              className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {visibleTickets.map((ticket, index) => (
              <article
                key={ticket.id}
                className={`group overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl ${isVisible('tickets') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 200}` : ''}`}
              >
                <div className="relative bg-gradient-to-r from-purple-700 to-blue-800 p-6 text-white">
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold">{ticket.status}</span>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-purple-200">Ticket ID</p>
                    <p className="font-mono text-lg font-bold">{ticket.id}</p>
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-sm text-purple-200">Event</p>
                      <h3 className="text-xl font-bold">{ticket.event}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-purple-200">Date</p>
                      <p className="font-semibold">{ticket.date}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-700">
                        <Icon name="ticket" className="h-4 w-4" />
                      </span>
                      {ticket.type}
                    </span>
                    {ticket.venue && (
                      <span className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-700">
                          <Icon name="pin" className="h-4 w-4" />
                        </span>
                        {ticket.venue}
                      </span>
                    )}
                    {ticket.seat && (
                      <span className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-purple-700">
                          <Icon name="calendar" className="h-4 w-4" />
                        </span>
                        Seat {ticket.seat}
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total paid</p>
                      <strong className="text-xl text-purple-700">KSh {ticket.price.toLocaleString()}</strong>
                    </div>
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="animate-pulse-glow rounded-full bg-purple-700 px-6 py-2.5 font-semibold text-white transition hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {visibleTickets.length === 0 && (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-400">
                <Icon name="search" className="h-8 w-8" />
              </div>
              <p className="text-gray-500">No tickets match your search.</p>
            </div>
          )}
        </section>
      </main>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative max-w-md w-full rounded-3xl bg-white shadow-2xl animate-scale-in overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold">{selectedTicket.status}</span>
                <button onClick={() => setSelectedTicket(null)} className="rounded-full bg-white/20 p-2 transition hover:bg-white/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <h3 className="mt-4 text-2xl font-bold">{selectedTicket.event}</h3>
              <p className="mt-1 text-purple-200">{selectedTicket.date}</p>
            </div>
            <div className="p-6">
              <div className="rounded-2xl border-2 border-dashed border-purple-200 p-6">
                <div className="mx-auto flex max-w-[200px] items-center justify-center rounded-xl bg-white p-4 shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify({ id: selectedTicket.id, event: selectedTicket.event, date: selectedTicket.date, seat: selectedTicket.seat, gate: selectedTicket.gate }))}`}
                    alt="Ticket QR Code"
                    className="h-44 w-44"
                  />
                </div>
                <p className="mt-4 text-center text-sm text-gray-500">Scan this code at the entrance</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">Ticket ID</span>
                  <span className="font-mono font-semibold">{selectedTicket.id}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">Type</span>
                  <span className="font-semibold">{selectedTicket.type}</span>
                </div>
                {selectedTicket.seat && (
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <span className="text-sm text-gray-600">Seat</span>
                    <span className="font-semibold">{selectedTicket.seat}</span>
                  </div>
                )}
                {selectedTicket.gate && (
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <span className="text-sm text-gray-600">Gate</span>
                    <span className="font-semibold">{selectedTicket.gate}</span>
                  </div>
                )}
                {selectedTicket.venue && (
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                    <span className="text-sm text-gray-600">Venue</span>
                    <span className="font-semibold">{selectedTicket.venue}</span>
                  </div>
                )}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="font-bold text-purple-700">KSh {selectedTicket.price.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="mt-6 w-full rounded-xl bg-purple-700 py-3 font-semibold text-white transition hover:bg-purple-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}