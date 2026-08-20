import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { getProfile, logout, getMyOrders } from '../api';

type Order = {
  id: string;
  event: string;
  date: string;
  amount: number;
  status: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; phone: string; role: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    void getProfile().then(setUser).catch(() => navigate('/login'));
  }, [navigate]);

  useEffect(() => {
    void getMyOrders()
      .then((data) => {
        const mapped: Order[] = data.map((order) => ({
          id: order.orderNumber || order.id,
          event: order.event.title,
          date: new Intl.DateTimeFormat('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(order.createdAt)),
          amount: order.totalAmount,
          status: order.status,
        }));
        setOrders(mapped);
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
  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const upcomingTickets = orders.filter((order) => order.status === 'PAID').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(147, 51, 234, 0.6); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/explore" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Explore</Link>
            <Link to="/my-tickets" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">My Tickets</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="rounded-full bg-purple-700 px-5 py-2.5 text-white transition hover:bg-purple-800 hover:shadow-lg hover:shadow-purple-500/30">Log out</button>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-20 pt-32 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animationDelay: '1s' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="animate-fade-in-up opacity-0-start">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5 text-sm font-bold shadow-lg">
              <Icon name="ticket" className="h-4 w-4" /> Welcome back
            </span>
          </div>
          <h1 className="mt-6 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-6xl">
            My <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">Profile</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            Manage your account settings and view your booking history.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section id="profile" data-animate className={`py-12 transition-all duration-700 ${isVisible('profile') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className={`md:col-span-1 ${isVisible('profile') ? 'animate-fade-in-up opacity-0-start delay-200' : ''}`}>
              <div className="rounded-3xl bg-white p-8 shadow-xl">
                <div className="text-center">
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-3xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{user?.name ?? 'Loading...'}</h2>
                  <span className="mt-2 inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">{user?.role ?? ''}</span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-purple-100 text-purple-700">
                      <Icon name="mail" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-semibold">{user?.email ?? ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-purple-100 text-purple-700">
                      <Icon name="pin" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-semibold">{user?.phone ?? ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`md:col-span-2 space-y-6 ${isVisible('profile') ? 'animate-fade-in-up opacity-0-start delay-300' : ''}`}>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20">
                      <Icon name="ticket" className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold">{upcomingTickets}</p>
                      <p className="text-sm text-purple-100">Upcoming Tickets</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20">
                      <Icon name="calendar" className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold">{orders.length}</p>
                      <p className="text-sm text-amber-100">Total Orders</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 p-6 text-white shadow-xl col-span-2 md:col-span-1">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20">
                      <Icon name="ticket" className="h-6 w-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-extrabold">KSh {totalSpent.toLocaleString()}</p>
                      <p className="text-sm text-blue-100">Total Spent</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold">Order History</h2>
                  <span className="text-sm text-gray-500">{orders.length} orders</span>
                </div>
                <div className="mt-6 space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={order.id}
                      className={`group rounded-2xl border border-gray-100 p-5 transition hover:border-purple-200 hover:shadow-lg ${isVisible('orders') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 200}` : ''}`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700">
                            <Icon name="ticket" className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition">{order.event}</h3>
                            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-bold text-purple-700">KSh {order.amount.toLocaleString()}</p>
                          </div>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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