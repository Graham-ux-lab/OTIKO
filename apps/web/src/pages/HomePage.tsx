import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, type Event, type Category } from '../lib/api';
import { Icon } from '../components/Icon';

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          api.getEvents(),
          api.getCategories(),
        ]);

        if (!active) return;

        const publishedEvents = eventsData.filter((event) => event.status === 'PUBLISHED');
        const sortedEvents = [...publishedEvents].sort(
          (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );

        setFeaturedEvents(sortedEvents.slice(0, 3));
        setTrendingEvents(sortedEvents.slice(3, 6));
        setCategories(categoriesData);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load events');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => { active = false; };
  }, []);

  const getCategoryImage = (name: string) => {
    const images: Record<string, string> = {
      Concerts: '/images/events/concert1.jpg',
      Comedy: '/images/events/comedy1.jpg',
      Sports: '/images/events/marathon1.jpg',
      Parties: '/images/events/party1.jpg',
      Theatre: '/images/events/fashion1.jpg',
      Conferences: '/images/events/tech1.jpg',
    };
    return images[name] || '/images/events/concert1.jpg';
  };

  const getCategoryIcon = (name: string): 'music' | 'comedy' | 'sport' | 'party' | 'theatre' | 'laptop' | 'calendar' => {
    const icons: Record<string, 'music' | 'comedy' | 'sport' | 'party' | 'theatre' | 'laptop'> = {
      Concerts: 'music', Comedy: 'comedy', Sports: 'sport', Parties: 'party', Theatre: 'theatre', Conferences: 'laptop',
    };
    return icons[name] || 'calendar';
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          Failed to load data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">OTIKO</Link>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/explore" className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700">Explore</Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/explore" className="text-gray-700 hover:text-blue-600 transition-colors">Explore</Link>
              <Link to="/organizer-signup" className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">Become an Organizer</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="home-hero relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
        <div className="pointer-events-none absolute -left-24 -top-28 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl home-float" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-purple-500/20 blur-3xl home-float home-float-delay" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="home-reveal">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur">
              <Icon name="calendar" className="h-4 w-4" /> Find your next moment in Kenya
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              More moments.<br /><span className="text-blue-300">More you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100/85 sm:text-xl">
              Discover concerts, gatherings, and experiences that turn ordinary weekends into unforgettable stories.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-50">
                Explore events <Icon name="arrow" className="h-5 w-5" />
              </Link>
              <a href="#categories" className="rounded-xl border border-white/25 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10">Browse categories</a>
            </div>
          </div>
          <div className="home-reveal home-reveal-delay rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-blue-200">Make plans</p><h2 className="mt-2 text-2xl font-bold">Find an experience</h2></div>
              <span className="rounded-2xl bg-white/10 p-3 text-blue-200"><Icon name="search" className="h-6 w-6" /></span>
            </div>
            <div className="space-y-3 rounded-2xl bg-white p-3 sm:p-4">
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <Icon name="search" className="h-5 w-5 shrink-0 text-gray-400" />
                <input type="search" placeholder="Search events" aria-label="Search events" className="min-w-0 flex-1 border-0 bg-transparent py-3 text-gray-900 outline-none focus:ring-0" />
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <Icon name="pin" className="h-5 w-5 shrink-0 text-gray-400" />
                <input type="text" placeholder="Choose a location" aria-label="Location" className="min-w-0 flex-1 border-0 bg-transparent py-3 text-gray-900 outline-none focus:ring-0" />
              </label>
              <Link to="/explore" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25">Search events <Icon name="arrow" className="h-5 w-5" /></Link>
            </div>
            <p className="mt-4 text-center text-sm text-blue-100/70">The Pulse of Events</p>
          </div>
        </div>
      </section>
      <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} to={'/explore?category=' + category.slug} className="home-card group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-32">
                <img src={getCategoryImage(category.name)} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl mb-1"><Icon name={getCategoryIcon(category.name)} className="mb-2 h-8 w-8" /></span>
                  <span className="font-semibold">{category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
        {featuredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Icon name="ticket" className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No featured events yet</h3>
            <p className="text-gray-600">Check back soon for exciting events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Link key={event.id} to={'/events/' + event.id} className="home-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  {event.posterUrl ? (
                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Icon name="ticket" className="h-12 w-12 text-blue-400" /></div>
                  )}
                  <span className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">{event.category?.name}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-gray-600"><Icon name="calendar" className="h-4 w-4" />{new Date(event.startDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2 text-gray-600"><Icon name="pin" className="h-4 w-4" />{event.location}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-blue-600 font-bold">From KSh {(event.ticketTypes.length ? Math.min(...event.ticketTypes.map(t => t.price)) : 0).toLocaleString()}</span>
                    <span className="inline-flex items-center gap-1 text-blue-600">Details <Icon name="arrow" className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Now</h2>
        {trendingEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Icon name="ticket" className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No trending events</h3>
            <p className="text-gray-600">Events will appear here as they gain popularity.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingEvents.map((event) => (
              <Link key={event.id} to={'/events/' + event.id} className="home-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-100">
                  {event.posterUrl ? (
                    <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Icon name="ticket" className="h-12 w-12 text-blue-400" /></div>
                  )}
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-sm text-white"><Icon name="chart" className="h-4 w-4" />Trending</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                  <p className="mt-2 flex items-center gap-2 text-gray-600"><Icon name="calendar" className="h-4 w-4" />{new Date(event.startDate).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2 text-gray-600"><Icon name="pin" className="h-4 w-4" />{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="site-footer bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">OTIKO</h3>
              <p className="text-gray-400">The Pulse of Events</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700">Login</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore Events</Link></li>
                <li><Link to="/my-tickets" className="hover:text-white transition-colors">My Tickets</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/explore?category=concerts" className="hover:text-white transition-colors">Concerts</Link></li>
                <li><Link to="/explore?category=sports" className="hover:text-white transition-colors">Sports</Link></li>
                <li><Link to="/explore?category=theatre" className="hover:text-white transition-colors">Theatre</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2"><Icon name="mail" className="h-4 w-4" />info@otiko.com</li>
                <li className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4" />+254 700 000 000</li>
                <li className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4" />Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
