export interface EventImage {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  price: number;
  category: string;
  image: string;
  description: string;
  organizer: string;
  ticketTypes: { id: number; name: string; price: number; available: number; quantity: number; description: string }[];
}

export const events: EventImage[] = [
  {
    id: 1,
    title: 'Kenya Music Festival 2026',
    date: 'Sep 15, 2026',
    time: '6:00 PM - 11:00 PM',
    location: 'Nairobi, Kenya',
    venue: 'Kasarani Stadium',
    price: 1500,
    category: 'Concerts',
    image: '/images/events/concert1.jpg',
    description: 'The biggest music festival in East Africa featuring top artists',
    organizer: 'East Africa Events Ltd',
    ticketTypes: [
      { id: 1, name: 'Regular', price: 1500, available: 500, quantity: 3000, description: 'Standard entry' },
      { id: 2, name: 'VIP', price: 5000, available: 200, quantity: 1500, description: 'Premium viewing area' },
      { id: 3, name: 'VVIP', price: 10000, available: 50, quantity: 500, description: 'Backstage access' },
    ],
  },
  {
    id: 2,
    title: 'Tech Summit Nairobi',
    date: 'Oct 20, 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'Nairobi, Kenya',
    venue: 'KICC',
    price: 3000,
    category: 'Conferences',
    image: '/images/events/tech1.jpg',
    description: 'Leading tech conference in Africa',
    organizer: 'Tech Events Kenya',
    ticketTypes: [
      { id: 1, name: 'Regular', price: 3000, available: 200, quantity: 1000, description: 'Full conference access' },
      { id: 2, name: 'Student', price: 1500, available: 50, quantity: 200, description: 'Student discount' },
    ],
  },
  {
    id: 3,
    title: 'Comedy Night Live',
    date: 'Sep 30, 2026',
    time: '7:30 PM - 10:00 PM',
    location: 'Nairobi, Kenya',
    venue: 'Sarit Centre',
    price: 800,
    category: 'Comedy',
    image: '/images/events/comedy1.jpg',
    description: 'A night of laughter with top comedians',
    organizer: 'Laugh Factory',
    ticketTypes: [
      { id: 1, name: 'Regular', price: 800, available: 150, quantity: 500, description: 'General admission' },
      { id: 2, name: 'VIP', price: 2000, available: 30, quantity: 100, description: 'Front row seats' },
    ],
  },
  {
    id: 4,
    title: 'Nairobi Marathon',
    date: 'Nov 5, 2026',
    time: '6:00 AM - 2:00 PM',
    location: 'Nairobi, Kenya',
    venue: 'Nyayo Stadium',
    price: 2000,
    category: 'Sports',
    image: '/images/events/marathon1.jpg',
    description: 'Annual Nairobi marathon event',
    organizer: 'Sports Kenya',
    ticketTypes: [
      { id: 1, name: 'Participant', price: 2000, available: 500, quantity: 2000, description: 'Race participation' },
      { id: 2, name: 'Spectator', price: 500, available: 1000, quantity: 5000, description: 'Watch the race' },
    ],
  },
  {
    id: 5,
    title: 'Beach Party Mombasa',
    date: 'Dec 24, 2026',
    time: '8:00 PM - Late',
    location: 'Mombasa, Kenya',
    venue: 'Diani Beach',
    price: 1000,
    category: 'Parties',
    image: '/images/events/party1.jpg',
    description: 'Christmas beach party in Mombasa',
    organizer: 'Coast Parties',
    ticketTypes: [
      { id: 1, name: 'Entry', price: 1000, available: 300, quantity: 1000, description: 'Beach party access' },
      { id: 2, name: 'VIP', price: 3000, available: 50, quantity: 200, description: 'VIP area access' },
    ],
  },
  {
    id: 6,
    title: 'Kenya Fashion Week',
    date: 'Oct 10, 2026',
    time: '3:00 PM - 9:00 PM',
    location: 'Nairobi, Kenya',
    venue: 'Sarit Centre',
    price: 2500,
    category: 'Theatre',
    image: '/images/events/fashion1.jpg',
    description: 'Showcasing African fashion designers',
    organizer: 'Fashion Council',
    ticketTypes: [
      { id: 1, name: 'General', price: 2500, available: 100, quantity: 500, description: 'Fashion show access' },
      { id: 2, name: 'Front Row', price: 5000, available: 20, quantity: 100, description: 'Front row seats' },
    ],
  },
];