import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Icon } from '../../components/Icon';
import { isValidEmail } from '../../utils/validation';
import { api, type Event } from '../../lib/api';

export default function CheckoutPage() {
  const { eventId, ticketId } = useParams();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [startingPayment, setStartingPayment] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const selectedTicket = eventData?.ticketTypes.find((ticket) => ticket.id === ticketId);
  const price = selectedTicket?.price ?? 0;

  useEffect(() => {
    if (!eventId) return;
    api.getEvent(eventId).then(setEventData).catch((cause) => setError(cause instanceof Error ? cause.message : 'Could not load this event'));
  }, [eventId]);

  useEffect(() => {
    if (!orderNumber) return;
    let active = true;
    const refresh = async () => {
      try {
        const result = await api.getCheckoutStatus(orderNumber);
        if (active) setOrderStatus(result.status);
      } catch {
        if (active) setError('Could not check payment status. Please refresh this page in a moment.');
      }
    };
    void refresh();
    const timer = window.setInterval(refresh, 3000);
    return () => { active = false; window.clearInterval(timer); };
  }, [orderNumber]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!isValidEmail(form.email)) {
      setError('Enter a valid email address so we can send your tickets.');
      return;
    }
    if (!eventId || !ticketId || !selectedTicket) {
      setError('This ticket is no longer available. Return to the event and choose another ticket.');
      return;
    }
    setStartingPayment(true);
    try {
      const result = await api.initiateCheckout({ eventId, ticketTypeId: ticketId, customerName: form.name, customerEmail: form.email, customerPhone: form.phone });
      setOrderNumber(result.orderNumber);
      setOrderStatus('PENDING');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not start the payment');
    } finally {
      setStartingPayment(false);
    }
  }
  const complete = orderStatus === 'PAID';
  const paymentFailed = orderStatus === 'FAILED';

  return (
    <div className="checkout-page flex min-h-screen flex-col bg-[#faf9fc] text-slate-900">
      <nav className="relative z-10 border-b border-purple-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="text-3xl font-black tracking-[-.08em] text-purple-800">OTIKO<span className="text-amber-500">.</span></Link>
          <Link to={`/events/${eventId}`} className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 transition hover:text-purple-950"><Icon name="arrow" className="h-4 w-4 rotate-180" />Back to event</Link>
        </div>
      </nav>

      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-8 h-80 w-80 rounded-full bg-purple-200/50 blur-3xl checkout-glow" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl checkout-glow checkout-glow-delay" />

        {complete ? (
          <section className="relative mx-auto grid min-h-[620px] max-w-6xl place-items-center px-4 py-12">
            <div className="checkout-enter w-full max-w-lg rounded-[2rem] border border-purple-100 bg-white p-8 text-center shadow-[0_24px_80px_rgba(76,29,149,.14)] sm:p-12">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-700"><Icon name="ticket" className="h-10 w-10" /></span>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Payment confirmed</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-purple-950 sm:text-4xl">You’re on the list!</h1>
              <p className="mt-4 leading-7 text-slate-600">Order <strong className="text-slate-900">{orderNumber}</strong> is paid and a ticket has been issued for <strong className="text-slate-900">{form.email}</strong>.</p>
              <Link to="/explore" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 px-6 py-3 font-bold text-white shadow-lg shadow-purple-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">Browse more events <Icon name="arrow" className="h-5 w-5" /></Link>
            </div>
          </section>
        ) : paymentFailed ? (
          <section className="relative mx-auto grid min-h-[620px] max-w-6xl place-items-center px-4 py-12"><div className="checkout-enter w-full max-w-lg rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl sm:p-12"><span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-red-50 text-red-600"><Icon name="close" className="h-10 w-10" /></span><h1 className="mt-7 text-3xl font-black text-slate-900">Payment not completed</h1><p className="mt-4 leading-7 text-slate-600">The M-Pesa payment was cancelled or could not be completed. Please return to the event and try again.</p><Link to={`/events/${eventId}`} className="mt-8 inline-flex rounded-xl bg-purple-700 px-6 py-3 font-bold text-white">Back to event</Link></div></section>
        ) : orderNumber ? (
          <section className="relative mx-auto grid min-h-[620px] max-w-6xl place-items-center px-4 py-12"><div className="checkout-enter w-full max-w-lg rounded-[2rem] border border-purple-100 bg-white p-8 text-center shadow-xl sm:p-12"><span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-purple-50 text-purple-700"><Icon name="clock" className="h-10 w-10 animate-pulse" /></span><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-purple-700">Waiting for M-Pesa</p><h1 className="mt-2 text-3xl font-black text-purple-950">Approve the prompt on your phone</h1><p className="mt-4 leading-7 text-slate-600">Enter your M-Pesa PIN to pay KSh {price.toLocaleString()}. This page will update when Safaricom confirms the payment.</p><p className="mt-5 text-xs text-slate-400">Order {orderNumber}</p>{error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}</div></section>
        ) : (
          <div className="relative mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-14">
            <div className="checkout-enter mb-8 flex items-center justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-600">Secure checkout</p><h1 className="mt-2 text-3xl font-black tracking-tight text-purple-950 sm:text-4xl">Complete your booking</h1><p className="mt-2 text-sm text-slate-500">{eventData?.title ?? 'Loading event…'}</p></div>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:flex"><Icon name="shield" className="h-4 w-4" />Protected checkout</div>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-2 checkout-enter checkout-enter-delay" aria-label="Checkout progress">
              <div className="h-1.5 rounded-full bg-purple-700" /><div className="h-1.5 rounded-full bg-purple-200" /><div className="h-1.5 rounded-full bg-purple-200" />
            </div>

            <div className="grid items-start gap-7 lg:grid-cols-[1.15fr_.85fr]">
              <section className="checkout-enter checkout-enter-delay rounded-3xl border border-purple-100 bg-white p-6 shadow-[0_12px_35px_rgba(45,26,78,.08)] sm:p-9">
                <div className="mb-7 flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-700"><Icon name="family" className="h-6 w-6" /></span><div><h2 className="text-xl font-extrabold text-purple-950">Attendee details</h2><p className="mt-1 text-sm text-slate-500">We’ll send your tickets to this email.</p></div></div>
                <form onSubmit={submit} className="space-y-5">
                  <Field label="Full name"><input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" /></Field>
                  <Field label="Email address"><input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></Field>
                  <Field label="M-Pesa phone number"><input required type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+254 700 000 000" /></Field>
                  {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
                  <button type="submit" disabled={startingPayment || !selectedTicket} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 py-3.5 font-bold text-white shadow-lg shadow-purple-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60">{startingPayment ? 'Starting payment…' : `Pay KSh ${price.toLocaleString()} with M-Pesa`}<Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button>
                  <p className="flex items-center justify-center gap-2 text-center text-xs text-slate-400"><Icon name="lock" className="h-4 w-4" />Your details are used to deliver your ticket.</p>
                </form>
              </section>

              <aside className="checkout-enter checkout-enter-delay-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 p-6 text-white shadow-xl shadow-purple-950/15 sm:p-8 lg:sticky lg:top-8">
                <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border-[28px] border-white/5" />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Order summary</p>
                  <h2 className="mt-4 text-2xl font-black">{eventData?.title ?? 'Loading event…'}</h2>
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-purple-100"><Icon name="ticket" className="h-4 w-4" />{selectedTicket?.name ?? 'Ticket'}</p>
                  <div className="my-7 border-t border-white/15" />
                  <div className="flex justify-between text-sm text-purple-100"><span>Ticket price</span><span>KSh {price.toLocaleString()}</span></div>
                  <div className="mt-5 flex justify-between text-lg font-black"><span>Total</span><span className="text-amber-300">KSh {price.toLocaleString()}</span></div>
                  <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-6 text-purple-100"><Icon name="shield" className="h-6 w-6 shrink-0 text-amber-300" />Your booking details stay protected throughout checkout.</div>
                  <div className="mt-6 flex items-center gap-2 text-xs text-purple-200/75"><Icon name="clock" className="h-4 w-4" />Your ticket is reserved while you complete checkout.</div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <CheckoutFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="checkout-field block text-sm font-bold text-slate-700">{label}<span className="mt-2 block">{children}</span></label>;
}

function CheckoutFooter() {
  return <footer className="site-footer relative z-10 border-t border-purple-100 py-7 text-white"><div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between sm:px-6"><Link to="/" className="text-lg font-black tracking-tight text-white">OTIKO<span className="text-amber-400">.</span></Link><p>Need help? <a href="mailto:info@otiko.com" className="font-semibold text-white transition hover:text-amber-300">Contact support</a></p><p className="text-xs">© {new Date().getFullYear()} OTIKO · Secure event checkout</p></div></footer>;
}
