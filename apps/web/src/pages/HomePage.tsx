import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useAuth } from '../auth';
import { getEvents, getCategories } from '../api';

const categoryIconMap: Record<string, 'music' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'tools' | 'family'> = {
  Concerts: 'music',
  Comedy: 'comedy',
  Sports: 'sport',
  Parties: 'party',
  Theatre: 'theatre',
  Conferences: 'chart',
  Workshops: 'tools',
  Family: 'family',
};

const fallbackEvents = [
  { id: 'fallback-1', title: 'Kenya Music Festival 2026', date: '15 Sep 2026', location: 'Nairobi, Kenya', price: 'From KSh 1,500', category: 'Concerts', icon: 'music' as const, gradient: 'from-purple-500 to-pink-500' },
  { id: 'fallback-2', title: 'Tech Summit Nairobi', date: '20 Oct 2026', location: 'KICC, Nairobi', price: 'From KSh 3,000', category: 'Conferences', icon: 'laptop' as const, gradient: 'from-blue-500 to-teal-500' },
  { id: 'fallback-3', title: 'Comedy Night Live', date: '30 Sep 2026', location: 'Sarit Centre, Nairobi', price: 'From KSh 800', category: 'Comedy', icon: 'comedy' as const, gradient: 'from-amber-500 to-orange-500' },
];

type EventCard = {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  icon: 'ticket' | 'music' | 'laptop' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'tools' | 'family';
  gradient: string;
};

const steps = [
  { title: 'Discover', description: 'Browse curated events across Kenya or search by category, date, and location.', icon: 'search' as const },
  { title: 'Book', description: 'Select tickets, checkout securely, and receive instant confirmation.', icon: 'ticket' as const },
  { title: 'Attend', description: 'Show your digital ticket at the gate and enjoy the experience.', icon: 'calendar' as const },
];

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => { logout(); navigate('/'); };
  const [events, setEvents] = useState<EventCard[]>(fallbackEvents);
  const [categories, setCategories] = useState<{ name: string; count: number; icon: 'music' | 'comedy' | 'sport' | 'party' | 'theatre' | 'chart' | 'tools' | 'family'; description: string }[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    void getEvents().then((data) => {
      if (data.length) {
        const mapped = data.slice(0, 3).map((event) => ({
          id: event.id,
          title: event.title,
          date: new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(event.startDate)),
          location: event.location,
          price: event.ticketTypes.length ? `From KSh ${Math.min(...event.ticketTypes.map((ticket) => ticket.price)).toLocaleString()}` : 'Tickets coming soon',
          category: event.category.name,
          icon: categoryIconMap[event.category.name] ?? 'ticket',
          gradient: 'from-purple-500 to-indigo-600',
        }));
        setEvents(mapped);
      }
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    void getCategories()
      .then((data) => {
        if (data.length) {
          setCategories(data.map((cat) => ({
            name: cat.name,
            count: 0,
            icon: categoryIconMap[cat.name] ?? 'ticket',
            description: cat.slug.replace(/-/g, ' '),
          })));
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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-slide-left { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slide-right { animation: slideInRight 0.8s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-shimmer { animation: shimmer 2s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient-shift 3s ease infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/explore" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Explore</Link>
            <Link to="/my-tickets" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">My Tickets</Link>
            {user ? (
              <button onClick={onLogout} className="rounded-full bg-purple-700 px-5 py-2.5 text-white transition hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-500/30">Log out</button>
            ) : (
              <>
                <Link to="/login" className="py-2 transition hover:text-purple-700">Login</Link>
                <Link to="/register" className="rounded-full bg-purple-700 px-5 py-2.5 text-white transition hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-500/30">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-24 pt-32 text-white animate-gradient">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 right-1/4 h-32 w-32 animate-float rounded-full bg-pink-400/10 blur-3xl" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 h-24 w-24 animate-float rounded-full bg-amber-400/10 blur-2xl" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-20 right-20 h-16 w-16 animate-rotate-slow rounded-full border-2 border-white/10" />
        <div className="absolute bottom-20 left-1/3 h-20 w-20 animate-rotate-slow rounded-full border-2 border-white/10" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
        <div className="relative mx-auto max-w-7xl px-4">
          <h1 className="mt-8 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-7xl">
            Discover Amazing
            <span className="block bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}>Events in Kenya</span>
          </h1>
          <p className="mt-8 max-w-2xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            Book tickets for concerts, comedy shows, sports events, and more. Your next unforgettable experience is just a click away.
          </p>
          <form onSubmit={(event) => event.preventDefault()} className="mx-auto mt-12 max-w-4xl animate-fade-in-up opacity-0-start delay-400">
            <div className="rounded-2xl bg-white/95 p-2 shadow-2xl ring-2 ring-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-amber-500/20 hover:ring-white/40">
              <div className="flex flex-col gap-2 md:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-5 py-4 transition-all duration-200 hover:bg-white hover:shadow-md focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white">
                  <Icon name="search" className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events, artists, venues..." className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400" />
                </label>
                <label className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 px-5 py-4 transition-all duration-200 hover:bg-white hover:shadow-md focus-within:ring-2 focus-within:ring-amber-400 focus-within:bg-white">
                  <Icon name="pin" className="h-5 w-5 text-gray-400 transition-colors duration-200" />
                  <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or venue" className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400" />
                </label>
                <Link to={`/explore?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-4 text-center font-bold text-white shadow-lg transition-all duration-200 hover:from-amber-700 hover:to-orange-700 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]">
                  <Icon name="search" className="h-5 w-5" />
                  Explore Events
                </Link>
              </div>
            </div>
          </form>
          <div className="mt-10 flex flex-wrap items-center gap-6 animate-fade-in opacity-0-start delay-500 text-sm text-purple-200">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> Live events updated daily</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> Instant ticket delivery</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> Secure payments</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">


        <section id="categories" data-animate className={`py-16 transition-all duration-700 ${isVisible('categories') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">Browse by Category</h2>
              <p className="mt-2 text-gray-500">Find exactly what you're looking for</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-1 font-semibold text-purple-700 transition hover:gap-2">View All <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category, index) => (
              <Link key={category.name} to={`/explore?category=${category.name}`} className={`group rounded-2xl bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${isVisible('categories') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 100}` : ''}`}>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:scale-110 group-hover:bg-purple-100">
                  <Icon name={category.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-4 font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{category.description}</p>
                <p className="mt-2 text-sm font-semibold text-purple-700">{category.count} events</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="how-it-works" data-animate className={`py-16 transition-all duration-700 ${isVisible('how-it-works') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">How It Works</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-500">Getting started with OTIKO is simple. Three easy steps to your next event.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className={`relative rounded-2xl bg-white p-8 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl ${isVisible('how-it-works') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 200}` : ''}`}>
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                  <Icon name={step.icon} className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="featured" data-animate className={`py-16 transition-all duration-700 ${isVisible('featured') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold">Featured Events</h2>
              <p className="mt-2 text-gray-500">Handpicked experiences you don't want to miss</p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-1 font-semibold text-purple-700 transition hover:gap-2">View All <Icon name="arrow" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {events.map((event, index) => (
              <Link key={event.id} to={`/events/${event.id}`} className={`group overflow-hidden rounded-3xl bg-white shadow-xl transition hover:-translate-y-3 hover:shadow-2xl ${isVisible('featured') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 200}` : ''}`}>
                <div className={`relative h-56 bg-gradient-to-r ${event.gradient} transition group-hover:scale-105`}>
                  <div className="grid h-full place-items-center text-white">
                    <Icon name={event.icon} className="h-20 w-20 transition group-hover:scale-110" />
                  </div>
                  <span className="absolute left-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{event.category}</span>
                  <span className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{event.date}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:text-purple-700">{event.title}</h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-gray-600"><Icon name="pin" className="h-4 w-4 text-amber-600" />{event.location}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <strong className="text-lg text-purple-700">{event.price}</strong>
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition group-hover:bg-purple-700 group-hover:text-white">Book Now <Icon name="arrow" className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>



        <section id="cta" data-animate className={`my-8 transition-all duration-700 ${isVisible('cta') ? 'animate-scale-in opacity-100' : 'opacity-0-start'}`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 p-8 text-white shadow-2xl md:p-16">
            <div className="absolute -right-16 -top-16 h-48 w-48 animate-float rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-8 bottom-0 h-32 w-32 animate-float rounded-full bg-pink-400/20 blur-3xl" style={{ animationDelay: '1.5s' }} />
            <div className="relative text-center">
              <h2 className="text-3xl font-extrabold md:text-4xl">Ready to host your own event?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-purple-100">List your event and reach thousands of attendees across Kenya. Fast setup, powerful tools, real-time analytics.</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 md:flex-row">
                <Link to="/apply-organizer" className="animate-pulse-glow rounded-full bg-white px-8 py-3 font-bold text-purple-700 transition hover:bg-gray-100">Become an Organizer</Link>
                <Link to="/explore" className="rounded-full border-2 border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10">Explore Events</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <strong className="text-3xl text-purple-400">OTIKO</strong>
              <p className="mt-3 max-w-xs text-gray-400">Discover, book, and experience the best events in Kenya. Your gateway to unforgettable moments.</p>
              <div className="mt-6 flex gap-4">
                <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">𝕏</span>
                <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">in</span>
                <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">ig</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white">Discover</h3>
              <Link to="/explore" className="mt-3 block text-gray-400 transition hover:text-white">All Events</Link>
              <Link to="/explore?category=Concerts" className="mt-2 block text-gray-400 transition hover:text-white">Concerts</Link>
              <Link to="/explore?category=Comedy" className="mt-2 block text-gray-400 transition hover:text-white">Comedy Shows</Link>
              <Link to="/explore?category=Sports" className="mt-2 block text-gray-400 transition hover:text-white">Sports</Link>
            </div>
            <div>
              <h3 className="font-semibold text-white">Company</h3>
              <Link to="/about" className="mt-3 block text-gray-400 transition hover:text-white">About Us</Link>
              <Link to="/apply-organizer" className="mt-2 block text-gray-400 transition hover:text-white">Become an Organizer</Link>
              <span className="mt-2 block text-gray-400 cursor-pointer transition hover:text-white">Careers</span>
              <span className="mt-2 block text-gray-400 cursor-pointer transition hover:text-white">Press</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Support</h3>
              <span className="mt-3 block text-gray-400 cursor-pointer transition hover:text-white">Help Center</span>
              <span className="mt-2 block text-gray-400 cursor-pointer transition hover:text-white">Contact Us</span>
              <span className="mt-2 block text-gray-400 cursor-pointer transition hover:text-white">Privacy Policy</span>
              <span className="mt-2 block text-gray-400 cursor-pointer transition hover:text-white">Terms of Service</span>
              <div className="mt-4 flex items-center gap-2 text-gray-400">
                <Icon name="mail" className="h-4 w-4" />
                <span>info@otiko.com</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-gray-400">
                <Icon name="pin" className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 OTIKO.ke. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
