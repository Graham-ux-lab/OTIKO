import { Link, useParams } from 'react-router-dom';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  return <main className="min-h-screen bg-gray-50 p-8"><Link to="/explore" className="text-blue-600">Explore events</Link><h1 className="mt-8 text-3xl font-bold">Event details</h1><p className="mt-3 text-gray-600">Event {eventId} will be loaded from the API.</p></main>;
}
