import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrganizerLayout } from '../../components/OrganizerLayout';
import { getCategories, createEvent } from '../../api';
import type { Category } from '../../types';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ title: '', description: '', categoryId: '', startDate: '', endDate: '', venue: '', location: '' });
  const [ticket, setTicket] = useState({ name: 'General Admission', price: 1000, quantity: 100 });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setMessage('Could not load categories'));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await createEvent({
        title: form.title,
        description: form.description,
        categoryId: form.categoryId,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        venue: form.venue,
        location: form.location,
        ticketTypes: [{ name: ticket.name, price: Number(ticket.price), quantity: Number(ticket.quantity) }],
      });
      navigate('/organizer/events');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  }

  const field = 'mt-2 flex items-center gap-3 rounded-lg border border-gray-200 px-3';
  return (
    <OrganizerLayout>
      <h2 className="text-3xl font-bold mb-8">Create Event</h2>
      {message && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{message}</p>}
      <form onSubmit={submit} className="bg-white rounded-lg shadow p-8 space-y-5 max-w-2xl">
        <label className="block text-sm font-semibold text-gray-700">Title
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field + ' w-full py-3'} placeholder="Event title" />
        </label>
        <label className="block text-sm font-semibold text-gray-700">Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field + ' w-full py-3'} rows={3} placeholder="Short description" />
        </label>
        <label className="block text-sm font-semibold text-gray-700">Category
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className={field + ' w-full py-3 bg-white'}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-semibold text-gray-700">Start date
            <input required type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={field + ' w-full py-3'} />
          </label>
          <label className="block text-sm font-semibold text-gray-700">End date
            <input required type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={field + ' w-full py-3'} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-semibold text-gray-700">Venue
            <input required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className={field + ' w-full py-3'} placeholder="Venue" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">Location
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field + ' w-full py-3'} placeholder="City" />
          </label>
        </div>
        <fieldset className="border rounded-lg p-4">
          <legend className="text-sm font-semibold text-gray-700 px-2">Ticket type</legend>
          <div className="grid grid-cols-3 gap-4">
            <label className="block text-sm font-semibold text-gray-700">Name
              <input value={ticket.name} onChange={(e) => setTicket({ ...ticket, name: e.target.value })} className={field + ' w-full py-3'} />
            </label>
            <label className="block text-sm font-semibold text-gray-700">Price (KSh)
              <input type="number" min="0" value={ticket.price} onChange={(e) => setTicket({ ...ticket, price: Number(e.target.value) })} className={field + ' w-full py-3'} />
            </label>
            <label className="block text-sm font-semibold text-gray-700">Quantity
              <input type="number" min="1" value={ticket.quantity} onChange={(e) => setTicket({ ...ticket, quantity: Number(e.target.value) })} className={field + ' w-full py-3'} />
            </label>
          </div>
        </fieldset>
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-purple-700 py-3 font-semibold text-white hover:bg-purple-800 disabled:opacity-60">{submitting ? 'Creating...' : 'Create Event (Draft)'}</button>
      </form>
    </OrganizerLayout>
  );
}
