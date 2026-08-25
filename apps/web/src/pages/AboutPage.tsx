import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

const values = [
  { title: 'Easy Booking', description: 'Book tickets in minutes with secure M-Pesa payments and instant confirmation.', icon: 'ticket' as const },
  { title: 'Digital Tickets', description: 'Receive instant digital tickets with QR codes sent directly to your phone.', icon: 'qr' as const },
  { title: 'Secure & Trusted', description: 'Your transactions are protected with bank-grade security and encryption.', icon: 'shield' as const },
];


export default function AboutPage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

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
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .opacity-0-start { opacity: 0; }
      `}</style>

      <nav className="fixed top-0 z-50 w-full border-b border-purple-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-3xl font-extrabold text-purple-700 transition hover:scale-105">OTIKO<span className="ml-1 text-sm font-normal text-gray-500">.ke</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link to="/" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Home</Link>
            <Link to="/explore" className="relative py-2 transition hover:text-purple-700 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-purple-700 after:transition-all hover:after:w-full">Explore</Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-800 pb-28 pt-32 text-white">
        <div className="absolute -right-16 -top-16 h-64 w-64 animate-float rounded-full bg-purple-400/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute -left-16 top-32 h-48 w-48 animate-float rounded-full bg-blue-400/10 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center">
          <div className="animate-fade-in-up opacity-0-start">
            
          </div>
          <h1 className="mt-6 animate-fade-in-up opacity-0-start delay-200 text-5xl font-extrabold md:text-6xl">
            About <span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">OTIKO</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl animate-fade-in-up opacity-0-start delay-300 text-xl text-purple-100">
            We are building Kenya's most trusted events ecosystem. From local community gatherings to national festivals, 
            OTIKO empowers organizers to reach wider audiences and gives attendees seamless access to the experiences that matter most.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 animate-fade-in opacity-0-start delay-400 text-sm text-purple-200">
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 2,500+ events listed</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 180K+ tickets sold</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 32 cities</span>
          </div>
          <div className="mt-10 flex justify-center animate-fade-in opacity-0-start delay-500">
            <svg viewBox="0 0 400 120" fill="none" className="h-24 w-full max-w-md text-white/80">
              <rect x="10" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="20" y="30" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="20" y="42" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="20" y="54" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <circle cx="40" cy="80" r="12" stroke="currentColor" strokeWidth="2" />
              <path d="M35 80l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              <rect x="90" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="100" y="30" width="40" height="30" rx="4" fill="currentColor" opacity="0.5" />
              <rect x="100" y="66" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="100" y="78" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />

              <rect x="170" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="180" y="30" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="180" y="42" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="180" y="54" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <circle cx="210" cy="75" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M206 75l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

              <rect x="250" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="260" y="30" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="260" y="42" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="260" y="54" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="265" y="68" width="30" height="20" rx="4" stroke="currentColor" strokeWidth="2" />

              <rect x="330" y="20" width="60" height="80" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="340" y="30" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="340" y="42" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <rect x="340" y="54" width="40" height="6" rx="3" fill="currentColor" opacity="0.5" />
              <circle cx="360" cy="75" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M356 75l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4">
        <section id="mission" data-animate className={`py-20 transition-all duration-700 ${isVisible('mission') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className={`${isVisible('mission') ? 'animate-fade-in-up opacity-0-start delay-200' : ''}`}>
              <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">Our Mission</span>
              <h2 className="mt-4 text-3xl font-extrabold md:text-4xl">Empowering Kenya's events economy</h2>
              <p className="mt-4 text-gray-600">
                OTIKO was founded with a clear purpose: to remove friction between event organizers and attendees. 
                Too often, great events struggle with visibility, while attendees struggle with fragmented discovery and clunky checkout flows.
              </p>
              <p className="mt-4 text-gray-600">
                We provide organizers with tools to publish, promote, and manage events at scale, and we give attendees 
                a fast, trusted way to discover and book tickets using local payment methods like M-Pesa.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <span className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700">Event Discovery</span>
                <span className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700">Secure Payments</span>
                <span className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700">Digital Tickets</span>
                <span className="rounded-full border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700">Real-time Support</span>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-4 ${isVisible('mission') ? 'animate-fade-in-up opacity-0-start delay-400' : ''}`}>
              <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 p-6 text-white shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-3 opacity-80"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V7Z M9 8v8" /></svg>
                <p className="text-3xl font-extrabold"></p>
                <p className="mt-1 text-sm text-purple-100">Events listed</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-3 opacity-80"><path d="M5 4v3m14-3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" /></svg>
                <p className="text-3xl font-extrabold"></p>
                <p className="mt-1 text-sm text-amber-100">Tickets sold</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-teal-600 p-6 text-white shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-3 opacity-80"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
                <p className="text-3xl font-extrabold"></p>
                <p className="mt-1 text-sm text-blue-100">Cities covered</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-pink-600 to-rose-600 p-6 text-white shadow-xl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 mb-3 opacity-80"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-6 5 3 2 3-2 3 2 3-2M6 16l3-2 3 3 3-3 3 2" /></svg>
                <p className="text-3xl font-extrabold"></p>
                <p className="mt-1 text-sm text-pink-100">Organizers</p>
              </div>
            </div>
          </div>
        </section>

        <section id="values" data-animate className={`py-20 transition-all duration-700 ${isVisible('values') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Why Choose OTIKO</h2>
            <p className="mx-auto mt-2 max-w-xl text-gray-500">Built for Kenya, designed for everyone.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={value.title} className={`group rounded-3xl bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl ${isVisible('values') ? `animate-fade-in-up opacity-0-start delay-${(index + 1) * 200}` : ''}`}>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 transition group-hover:scale-110">
                  <Icon name={value.icon} className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-center">{value.title}</h3>
                <p className="mt-3 text-center text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <svg viewBox="0 0 600 80" fill="none" className="h-16 w-full max-w-2xl text-purple-200">
              <rect x="10" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="110" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="210" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="310" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="410" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
              <rect x="510" y="20" width="80" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </section>


        <section id="contact" data-animate className={`py-20 transition-all duration-700 ${isVisible('contact') ? 'animate-fade-in-up opacity-100' : 'opacity-0-start'}`}>
          <div className="rounded-3xl bg-white p-8 shadow-xl md:p-12">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold text-center">Get in Touch</h2>
              <p className="mt-2 text-center text-gray-500">We would love to hear from you.</p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-100 text-purple-700">
                    <Icon name="mail" className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Email</p>
                    <p className="font-semibold">info@otiko.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-100 text-purple-700">
                    <Icon name="pin" className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Location</p>
                    <p className="font-semibold">Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 rounded-2xl bg-gray-50 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-purple-100 text-purple-700">
                    <Icon name="calendar" className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">Working Hours</p>
                    <p className="font-semibold">Mon - Fri, 8am - 6pm</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <svg viewBox="0 0 400 60" fill="none" className="h-12 w-full max-w-md text-purple-100">
                  <rect x="10" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="75" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="140" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="205" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="270" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                  <rect x="335" y="10" width="50" height="40" rx="6" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 bg-gray-900 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <strong className="text-3xl text-purple-400">OTIKO</strong>
          <p className="mt-3 max-w-xs mx-auto text-gray-400">Discover, book, and experience the best events in Kenya.</p>
          <div className="mt-6 flex justify-center gap-4">
            <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">X</span>
            <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">in</span>
            <span className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-800 transition hover:bg-purple-600">ig</span>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500">
            <p>© 2026 OTIKO.ke. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}