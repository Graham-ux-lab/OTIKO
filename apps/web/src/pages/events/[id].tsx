import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { events } from '../../data/events';
import { Icon } from '../../components/Icon';

export default function EventDetailsPage() {
  const { id } = useParams();
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [delivery, setDelivery] = useState({ email: '', phone: '' });
  
  const event = events.find(e => e.id === Number(id)) || events[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">OTIKO</Link>
          <div className="flex gap-4">
            <Link to="/explore" className="text-gray-700">Explore</Link>
            <Link to="/login" className="text-gray-700">Login</Link>
          </div>
        </div>
      </nav>

      <div className="relative h-96">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 text-white w-full">
            <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">{event.category}</span>
            <h1 className="text-4xl font-bold mt-2">{event.title}</h1>
            <p className="mt-2">by {event.organizer}</p>
            <div className="flex gap-4 mt-4">
              <span> {event.date}</span>
              <span> {event.time}</span>
              <span> {event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-600">{event.description}</p>
              <div className="mt-4 flex gap-4">
                <span className="text-gray-600"> {event.venue}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-4">Select Tickets</h2>
            <div className="space-y-4">
              {event.ticketTypes.map(ticket => (
                <button
                  type="button"
                  key={ticket.id}
                  className={`w-full border-2 text-left rounded-xl p-4 cursor-pointer transition ${selectedTicket === ticket.id ? 'border-purple-700 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                  onClick={() => setSelectedTicket(ticket.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{ticket.name}</span>
                    <span className="font-bold text-purple-700">KSh {ticket.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-500">{ticket.available} available</p>
                </button>
              ))}
            </div>
            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="text-sm font-bold text-gray-900">Send tickets to</p>
              <p className="mt-1 text-xs text-gray-500">Enter an email address or phone number for ticket delivery.</p>
              <label className="mt-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-400"><Icon name="mail" className="h-4 w-4" /><input type="email" value={delivery.email} onChange={(e) => setDelivery({ ...delivery, email: e.target.value })} placeholder="Email address" className="w-full bg-transparent text-sm text-gray-900 outline-none" /></label>
              <label className="mt-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-400"><Icon name="ticket" className="h-4 w-4" /><input type="tel" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} placeholder="Phone number" className="w-full bg-transparent text-sm text-gray-900 outline-none" /></label>
            </div>
            <Link
              to={selectedTicket && (delivery.email || delivery.phone) ? `/checkout/${event.id}/${selectedTicket}` : '#'}
              className={`w-full mt-5 block text-center py-3 rounded-xl font-bold transition ${selectedTicket && (delivery.email || delivery.phone) ? 'bg-purple-700 text-white hover:bg-purple-800' : 'pointer-events-none bg-gray-100 text-gray-400'}`}
            >
              {selectedTicket ? (delivery.email || delivery.phone ? 'Continue to checkout' : 'Add ticket delivery details') : 'Select a Ticket'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



