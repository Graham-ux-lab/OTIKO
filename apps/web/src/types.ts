export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface OrganizerRow {
  id: string;
  organizationName: string;
  description: string | null;
  status: string;
  approvedAt: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string; status: string };
}

export interface AdminEventRow {
  id: string;
  title: string;
  status: string;
  startDate: string;
  location: string;
  venue: string;
  category: { name: string };
  organizer: { organizationName: string };
  _count: { ticketTypes: number; orders: number };
}

export interface OrganizerEventRow {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  category: { id: string; name: string };
  ticketTypes: { id: string; name: string; price: number; quantity: number; soldQuantity: number }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ApiTicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
}

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  posterUrl?: string;
  category: { name: string; slug: string };
  ticketTypes: ApiTicketType[];
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiOrderEvent {
  id: string;
  title: string;
}

export interface ApiOrderUser {
  id: string;
  name: string;
  email: string;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  event: ApiOrderEvent;
  user: ApiOrderUser;
  items: ApiOrderItem[];
}

export interface OrderRow {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  event: { id: string; title: string };
  user: { id: string; name: string; email: string };
  items: { id: string; quantity: number; unitPrice: number; totalPrice: number }[];
}

export interface CreateEventInput {
  title: string;
  description?: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  ticketTypes?: { name: string; price: number; quantity: number }[];
}
