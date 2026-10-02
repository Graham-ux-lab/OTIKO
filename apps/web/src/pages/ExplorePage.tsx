import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Icon } from '../components/Icon';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
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
  category: { name: string };
  ticketTypes: TicketType[];
  posterUrl?: string | null;
  organizer: { user: { name: string } };
}

const categories = ['All Categories', 'Concerts', 'Comedy', 'Sports', 'Parties', 'Theatre', 'Conferences'];
const locations = ['All Locations', 'Nairobi', 'Mombasa', 'Kisumu'];

const formatDate = (value: string) => new Intl.DateTimeFormat('en-KE', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
}).format(new Date(value));

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const category = searchParams.get('category');
    const match = categories.find((item) => item.toLowerCase() === category?.toLowerCase());
    setSelectedCategory(match ?? 'All Categories');
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All Categories') params.append('category', selectedCategory);
        if (selectedLocation !== 'All Locations') params.append('location', selectedLocation);
        const data = await api.getEvents(params.toString());
        if (active) setEvents(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load events');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadEvents();
    return () => { active = false; };
  }, [selectedCategory, selectedLocation, reloadKey]);

  const filteredEvents = events.filter((event) =>
    `${event.title} ${event.description} ${event.venue}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const minPrice = (event: Event) => event.ticketTypes.length
    ? Math.min(...event.ticketTypes.map((ticket) => ticket.price))
    : 0;

  return (
    <div className="explore-page min-h-screen bg-slate-50 text-slate-900">
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              <Icon name="arrow" className="h-4 w-4 rotate-180" /> <span className="hidden sm:inline">Back</span>
            </button>
            <Link to="/" className="text-2xl font-black tracking-tight text-blue-700">OTIKO<span className="text-amber-500">.</span></Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/login" className="text-sm font-semibold text-slate-600 transition hover:text-blue-700">Login</Link>
            <Link to="/organizer-signup" className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:px-4">Become an organizer</Link>
          </div>
        </div>
      </nav>

      <header className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl explore-glow" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <p className="explore-enter inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100"><Icon name="search" className="h-4 w-4" /> Find your next experience</p>
          <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="explore-enter explore-enter-delay max-w-2xl">
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">Explore events<span className="text-blue-300">.</span></h1>
              <p className="mt-4 max-w-xl text-lg leading-7 text-blue-100/80">Find live music, comedy, culture, and experiences happening around you.</p>
            </div>
            <p className="text-sm font-medium text-blue-100/75">{filteredEvents.length} {filteredEvents.length === 1 ? 'experience' : 'experiences'} to explore</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="explore-enter explore-enter-delay-2 mb-9 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-label="Filter events">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Icon name="search" className="h-5 w-5 shrink-0 text-slate-400" />
              <input type="search" placeholder="Search by event, venue, or keyword" aria-label="Search events" className="min-w-0 flex-1 border-0 bg-transparent py-3 text-slate-900 outline-none focus:ring-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Icon name="ticket" className="h-5 w-5 shrink-0 text-slate-400" />
              <select aria-label="Category" className="w-full border-0 bg-transparent py-3 text-slate-700 outline-none focus:ring-0" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              <Icon name="pin" className="h-5 w-5 shrink-0 text-slate-400" />
              <select aria-label="Location" className="w-full border-0 bg-transparent py-3 text-slate-700 outline-none focus:ring-0" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                {locations.map((location) => <option key={location}>{location}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700">
              <Icon name="search" className="h-4 w-4" /> Refresh
            </button>
          </div>
        </section>

        {loading && <div className="py-16 text-center text-slate-500"><span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" /><p className="font-medium">Finding events for you…</p></div>}
        {error && <div role="alert" className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">{error}</div>}

        {!loading && filteredEvents.length === 0 && !error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon name="search" className="h-8 w-8" /></span>
            <h2 className="text-2xl font-bold text-slate-900">No events found</h2>
            <p className="mx-auto mt-2 max-w-md text-slate-500">Try a different search or clear your filters to see more experiences.</p>
          </div>
        )}

        {!loading && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <Link key={event.id} to={`/events/${event.id}`} className="event-card group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}>
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600">
                  {event.posterUrl ? <img src={event.posterUrl} alt={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="grid h-full w-full place-items-center text-white/80"><Icon name="ticket" className="h-16 w-16" /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-slate-950/35 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">{event.category?.name ?? 'Event'}</span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                    <div className="flex items-center gap-2 text-sm font-semibold"><Icon name="calendar" className="h-4 w-4" />{formatDate(event.startDate)}</div>
                    <span className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur">{event.location}</span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">{event.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{event.description}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 shrink-0 text-blue-600" />{event.venue}</p>
                    {event.organizer?.user?.name && <p className="flex items-center gap-2"><Icon name="family" className="h-4 w-4 shrink-0 text-blue-600" />Hosted by {event.organizer.user.name}</p>}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mt-5">
                    <div><span className="block text-xs font-medium uppercase tracking-wider text-slate-400">Tickets from</span><span className="mt-1 block text-lg font-extrabold text-blue-700">KSh {minPrice(event).toLocaleString()}</span></div>
                    <span className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">View event <Icon name="arrow" className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="site-footer mt-10 bg-slate-950 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-9 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div><Link to="/" className="text-2xl font-black tracking-tight">OTIKO<span className="text-amber-400">.</span></Link><p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">Discover and experience the moments worth showing up for.</p></div>
          <div><h2 className="font-bold">Explore</h2><ul className="mt-4 space-y-3 text-sm text-slate-400"><li><Link className="transition hover:text-white" to="/explore">All events</Link></li><li><Link className="transition hover:text-white" to="/about">About OTIKO</Link></li></ul></div>
          <div><h2 className="font-bold">For organizers</h2><ul className="mt-4 space-y-3 text-sm text-slate-400"><li><Link className="transition hover:text-white" to="/organizer-signup">Create an organizer account</Link></li><li><Link className="transition hover:text-white" to="/login">Organizer login</Link></li></ul></div>
          <div><h2 className="font-bold">Get in touch</h2><ul className="mt-4 space-y-3 text-sm text-slate-400"><li className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" />info@otiko.com</li><li className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4" />+254 700 000 000</li><li className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4" />Nairobi, Kenya</li></ul></div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-xs text-slate-500 sm:px-6 lg:px-8">© {new Date().getFullYear()} OTIKO. All rights reserved.</div>
      </footer>
    </div>
  );
}
