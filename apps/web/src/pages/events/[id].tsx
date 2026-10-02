import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Icon } from '../../components/Icon';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  description?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  status: string;
  category: { name: string; slug: string };
  ticketTypes: TicketType[];
  posterUrl: string | null;
  organizer: { user: { name: string } };
}

const formatDate = (value: string) => new Intl.DateTimeFormat('en-KE', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
}).format(new Date(value));

const formatTime = (value: string) => new Intl.DateTimeFormat('en-KE', {
  hour: '2-digit', minute: '2-digit',
}).format(new Date(value));

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Event not found');
      return;
    }
    let active = true;
    const loadEvent = async () => {
      setLoading(true);
      setError('');
      setSelectedTicket(null);
      try {
        const data: Event = await api.getEvent(id);
        if (active) setEvent(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load event');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadEvent();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50"><div className="text-center text-slate-500"><span className="mx-auto mb-4 block h-12 w-12 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" /><p>Loading event details…</p></div></main>;
  }

  if (error || !event) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl event-detail-reveal">
          <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Icon name="ticket" className="h-8 w-8" /></span>
          <h1 className="text-2xl font-bold text-slate-900">Event unavailable</h1>
          <p className="mb-6 mt-2 text-slate-500">{error || 'This event does not exist or is no longer available.'}</p>
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"><Icon name="arrow" className="h-4 w-4 rotate-180" /> Browse events</Link>
        </div>
      </main>
    );
  }

  const selectedTicketType = event.ticketTypes.find((ticket) => ticket.id === selectedTicket);
  const availableTickets = selectedTicketType ? selectedTicketType.quantity - selectedTicketType.soldQuantity : 0;
  const checkoutUrl = selectedTicket ? `/checkout/${id}/${selectedTicket}` : '#';

  return (
    <div className="event-detail-page min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"><Icon name="arrow" className="h-4 w-4 rotate-180" /><span className="hidden sm:inline">Back</span></button>
            <Link to="/" className="text-2xl font-black tracking-tight text-blue-700">OTIKO<span className="text-amber-500">.</span></Link>
          </div>
          <div className="flex items-center gap-4"><Link to="/explore" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Explore</Link><Link to="/login" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700">Login</Link></div>
        </div>
      </nav>

      <header className="relative isolate min-h-[32rem] overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
        {event.posterUrl ? <img src={event.posterUrl} alt={event.title} className="absolute inset-0 h-full w-full object-cover" /> : <div className="absolute inset-0 grid place-items-center text-white/20 event-detail-float"><Icon name="ticket" className="h-40 w-40" /></div>}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-indigo-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-slate-950/15" />
        <div className="relative mx-auto flex min-h-[32rem] max-w-7xl items-end px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="max-w-4xl event-detail-reveal">
            <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-blue-100 backdrop-blur">{event.category?.name ?? 'Featured event'}</span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-7xl">{event.title}</h1>
            {event.organizer?.user?.name && <p className="mt-4 text-lg text-blue-100">Hosted by <span className="font-semibold text-white">{event.organizer.user.name}</span></p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur"><Icon name="calendar" className="h-5 w-5 text-blue-200" />{formatDate(event.startDate)}</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur"><Icon name="clock" className="h-5 w-5 text-blue-200" />{formatTime(event.startDate)} – {formatTime(event.endDate)}</span>
              <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur"><Icon name="pin" className="h-5 w-5 text-blue-200" />{event.location}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[1fr_400px] lg:px-8">
        <section className="space-y-6 event-detail-reveal event-detail-reveal-delay">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-blue-700">The experience</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">About this event</h2>
            <p className="mt-4 whitespace-pre-wrap text-base leading-8 text-slate-600">{event.description}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><Icon name="pin" className="h-5 w-5" /></span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Venue</p><p className="mt-1 font-bold text-slate-900">{event.venue}</p><p className="text-sm text-slate-500">{event.location}</p></div>
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-purple-700 shadow-sm"><Icon name="calendar" className="h-5 w-5" /></span><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Date and time</p><p className="mt-1 font-bold text-slate-900">{formatDate(event.startDate)}</p><p className="text-sm text-slate-500">{formatTime(event.startDate)} – {formatTime(event.endDate)}</p></div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5 event-detail-reveal event-detail-reveal-delay-2 lg:sticky lg:top-24 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-sm font-bold uppercase tracking-[.15em] text-blue-700">Tickets</p><h2 className="mt-1 text-2xl font-black text-slate-900">Choose your seat</h2></div><span className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Icon name="ticket" className="h-6 w-6" /></span></div>
          <div className="mt-5 space-y-3">
            {event.ticketTypes.length === 0 && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Tickets are not available yet.</p>}
            {event.ticketTypes.map((ticket) => {
              const available = ticket.quantity - ticket.soldQuantity;
              const selected = selectedTicket === ticket.id;
              return <button key={ticket.id} type="button" disabled={available <= 0} onClick={() => setSelectedTicket(ticket.id)} className={`w-full rounded-2xl border-2 p-4 text-left transition duration-200 ${selected ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-900/5' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'} disabled:cursor-not-allowed disabled:opacity-50`}>
                <span className="flex items-start justify-between gap-3"><span><span className="block font-bold text-slate-900">{ticket.name}</span><span className="mt-1 block text-sm text-slate-500">{available > 0 ? `${available} available` : 'Sold out'}</span></span><span className="text-lg font-extrabold text-blue-700">KSh {ticket.price.toLocaleString()}</span></span>
                {ticket.description && <span className="mt-3 block border-t border-slate-100 pt-3 text-sm leading-5 text-slate-500">{ticket.description}</span>}
              </button>;
            })}
          </div>
          {selectedTicketType && <p className="mt-4 text-sm text-slate-500">Selected: <span className="font-semibold text-slate-800">{selectedTicketType.name}</span> · {availableTickets} tickets remaining</p>}
          {selectedTicket ? <Link to={checkoutUrl} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-xl">Continue to checkout <Icon name="arrow" className="h-5 w-5" /></Link> : <button type="button" disabled className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-100 px-5 py-3.5 font-bold text-slate-400">Select a ticket</button>}
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Icon name="shield" className="h-4 w-4" />Secure checkout · Prices shown in KSh</p>
        </aside>
      </main>

      <footer className="site-footer mt-8 bg-slate-950 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div><Link to="/" className="text-2xl font-black tracking-tight">OTIKO<span className="text-amber-400">.</span></Link><p className="mt-2 text-sm text-slate-400">Moments worth showing up for.</p></div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400"><Link to="/explore" className="transition hover:text-white">Explore events</Link><Link to="/about" className="transition hover:text-white">About us</Link><span className="inline-flex items-center gap-2"><Icon name="mail" className="h-4 w-4" />info@otiko.com</span></div>
        </div>
      </footer>
    </div>
  );
}
