import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isValidEmail } from '../../utils/validation';

export default function CheckoutPage() {
  const { eventId, ticketId } = useParams();
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const price = ticketId === 'vip' ? 5000 : ticketId === 'vvip' ? 10000 : 1500;
  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address so we can send your tickets.');
      return;
    }
    setComplete(true);
  }
  if (complete) return <main className="grid min-h-screen place-items-center bg-gray-50 p-4"><section className="max-w-md rounded-2xl bg-white p-8 text-center shadow"><h1 className="text-3xl font-bold text-green-600">Booking confirmed</h1><p className="mt-3 text-gray-600">Your ticket confirmation and tickets have been sent to <strong>{form.email}</strong>.</p><Link to="/my-tickets" className="mt-6 inline-block rounded-xl bg-purple-700 px-6 py-3 font-bold text-white">View my tickets</Link></section></main>;
  return <main className="min-h-screen bg-gray-50"><nav className="bg-white shadow-sm"><div className="mx-auto flex max-w-3xl justify-between p-4"><Link to="/" className="text-2xl font-extrabold text-purple-700">OTIKO</Link><Link to={`/events/${eventId}`}>Back to event</Link></div></nav><form onSubmit={submit} className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-8 shadow"><p className="font-semibold text-amber-600">Checkout</p><h1 className="mt-1 text-3xl font-bold">Secure your tickets</h1><div className="mt-6 grid gap-4"><label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label><label>M-Pesa phone<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="mt-1 block w-full rounded-lg border p-3" /></label></div>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 rounded-xl bg-gray-50 p-4"><span>Kenya Music Festival · {ticketId}</span><strong className="float-right text-purple-700">KSh {price.toLocaleString()}</strong></div><button className="mt-6 w-full rounded-xl bg-amber-600 py-3 font-bold text-white">Confirm booking</button></form></main>;
}
