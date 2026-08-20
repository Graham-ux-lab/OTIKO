import { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getEvents, getCategories } from '../api';

const categoryIconMap: Record<string, 'music' | 'laptop' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'ticket'> = {
  Concerts: 'music',
  Conferences: 'chart',
  Comedy: 'comedy',
  Sports: 'sport',
  Parties: 'party',
  Theatre: 'theatre',
};

const fallbackEvents: { id: string; title: string; date: string; location: string; price: number; category: string; description: string; icon: 'music' | 'laptop' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'ticket' }[] = [
  { id: 'fallback-1', title: 'Kenya Music Festival 2026', date: '15 Sep 2026', location: 'Nairobi', price: 1500, category: 'Concerts', description: 'A three-day celebration of Kenyan music featuring top artists.', icon: 'music' },
  { id: 'fallback-2', title: 'Tech Summit Nairobi', date: '20 Oct 2026', location: 'KICC, Nairobi', price: 3000, category: 'Conferences', description: 'Africa\'s leading tech conference bringing together innovators and investors.', icon: 'chart' },
  { id: 'fallback-3', title: 'Comedy Night Live', date: '30 Sep 2026', location: 'Sarit Centre, Nairobi', price: 800, category: 'Comedy', description: 'An evening of non-stop laughter with Kenya\'s best comedians.', icon: 'comedy' },
  { id: 'fallback-4', title: 'Marathon Nairobi', date: '10 Nov 2026', location: 'Nairobi National Park', price: 1200, category: 'Sports', description: 'Run through the wild. 42KM, 21KM, and 10KM categories available.', icon: 'sport' },
  { id: 'fallback-5', title: 'Beach Party', date: '25 Dec 2026', location: 'Diani Beach', price: 2500, category: 'Parties', description: 'Ring in the holidays with a beach party like no other.', icon: 'party' },
  { id: 'fallback-6', title: 'Theatre Night', date: '05 Oct 2026', location: 'Nairobi Playhouse', price: 1800, category: 'Theatre', description: 'Award-winning local stage performance.', icon: 'theatre' },
];

const gradients = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-green-500 to-emerald-500',
  'from-rose-500 to-red-500',
  'from-indigo-500 to-purple-500',
];

export default function ExplorePage() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('search') ?? '');
  const [category, setCategory] = useState(params.get('category') ?? 'All');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState(fallbackEvents);
  const [categories, setCategories] = useState<{ name: string; icon: 'music' | 'laptop' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'ticket' }[]>([]);

  useEffect(() => {
    void getEvents()
      .then((data) => {
        if (data.length) {
          const mapped = data.map((event) => ({
            id: event.id,
            title: event.title,
            date: new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(event.startDate)),
            location: event.location,
            price: event.ticketTypes.length ? Math.min(...event.ticketTypes.map((ticket) => ticket.price)) : 0,
            category: event.category.name,
            description: event.description,
            icon: categoryIconMap[event.category.name] ?? 'ticket',
          }));
          setEvents(mapped);
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    void getCategories()
      .then((data) => {
        if (data.length) {
          const mapped = data.map((cat) => ({
            name: cat.name,
            icon: categoryIconMap[cat.name] ?? 'ticket',
          }));
          setCategories(mapped);
        }
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
  const visibleEvents = useMemo(() => events.filter((event) => (category === 'All' || event.category === category) && event.title.toLowerCase().includes(query.toLowerCase())), [events, category, query]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/explore" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Explore</Link>
            <Link to="/my-tickets" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">My Tickets</Link>
            <Link to="/profile" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Profile</Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-24 pt-32 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 animate-float rounded-full bg-pink-400/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="animate-fade-in-up opacity-0-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5 text-sm font-bold shadow-lg">
              <Icon name="search" className="h-4 w-4" /> Discover
            </span>
          </div>
          <h1 className="mt-6 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-6xl">
            Explore <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            Find your next unforgettable experience across Kenya.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section id="filters" data-animate className={`py-8 transition-all duration-700 ${isVisible('filters') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="rounded-3xl bg-white p-4 shadow-xl md:p-6">
            <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-5 py-3 transition focus-within:ring-2 focus-within:ring-purple-500">
              <Icon name="search" className="h-5 w-5 text-gray-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events by name, artist, or venue..." className="w-full bg-transparent text-gray-900 outline-none" />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    category === cat.name ? 'bg-purple-700 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <Icon name={cat.icon} className="h-4 w-4" />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="results" data-animate className={`py-8 transition-all duration-700 ${isVisible('results') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="flex items-center justify-between">
            <p className="text-gray-600"><span className="font-bold text-gray-900">{visibleEvents.length}</span> events found</p>
            <Link to="/" className="text-sm font-semibold text-purple-700 transition hover:text-purple-800">Back to Home</Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className={`group overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-2 hover:shadow-2xl ${isVisible('results') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 100}` : ''}`}
              >
                <div className={`relative h-48 bg-gradient-to-r ${gradients[index % gradients.length]} transition group-hover:scale-105`}>
                  <div className="grid h-full place-items-center text-white">
                    <Icon name={event.icon} className="h-16 w-16 transition group-hover:scale-110" />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{event.category}</span>
                  <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{event.date}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:text-purple-700 transition">{event.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600"><Icon name="pin" className="h-4 w-4 text-amber-600" />{event.location}</p>
                  {event.description && <p className="mt-2 text-sm text-gray-500 line-clamp-2">{event.description}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    <strong className="text-lg text-purple-700">From KSh {event.price.toLocaleString()}</strong>
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition group-hover:bg-purple-700 group-hover:text-white">Book Now <Icon name="arrow" className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visibleEvents.length === 0 && (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-400">
                <Icon name="search" className="h-8 w-8" />
              </div>
              <p className="text-gray-500">No events match your search.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <strong className="text-3xl text-purple-400">OTIKO</strong>
          <p className="mt-3 max-w-xs mx-auto text-gray-400">Discover, book, and experience the best events in Kenya.</p>
          <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500">
            <p>© 2026 OTIKO.ke. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}