import type { CreateEventInput, OrderRow, AdminEventRow, OrganizerEventRow, OrganizerRow, SessionUser, UserRow, ApiEvent, ApiCategory, ApiOrder } from './types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type Session = { accessToken: string; user: SessionUser };

function token(): string | null {
  return localStorage.getItem('otiko_access_token');
}

function authHeaders(): Record<string, string> {
  const t = token();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...init?.headers },
    ...init,
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
    throw new Error(Array.isArray(body?.message) ? body.message[0] : body?.message ?? 'Request failed');
  }
  return response.json() as Promise<T>;
}

export async function login(emailOrPhone: string, password: string) {
  const session = await request<Session>('/auth/login', { method: 'POST', body: JSON.stringify({ emailOrPhone, password }) });
  localStorage.setItem('otiko_access_token', session.accessToken);
  return session;
}

export async function register(name: string, email: string, phone: string, password: string) {
  const session = await request<Session>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, phone, password }) });
  localStorage.setItem('otiko_access_token', session.accessToken);
  return session;
}

export function logout() {
  localStorage.removeItem('otiko_access_token');
}

export function getProfile() {
  return request<SessionUser>('/auth/me');
}

export const getUsers = () => request<UserRow[]>('/admin/users');
export const setUserStatus = (id: string, status: string) =>
  request<UserRow>(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const getOrganizers = () => request<OrganizerRow[]>('/admin/organizers');
export const approveOrganizer = (id: string) => request(`/admin/organizers/${id}/approve`, { method: 'PATCH' });
export const rejectOrganizer = (id: string) => request(`/admin/organizers/${id}/reject`, { method: 'PATCH' });
export const applyOrganizer = (input: { organizationName: string; description: string; phone: string; website?: string }) =>
  request<OrganizerRow>('/organizer/apply', { method: 'POST', body: JSON.stringify(input) });

export const getAdminEvents = () => request<AdminEventRow[]>('/admin/events');
export const setEventStatus = (id: string, status: string) =>
  request(`/admin/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteEvent = (id: string) => request(`/admin/events/${id}`, { method: 'DELETE' });

export const getMyEvents = () => request<OrganizerEventRow[]>('/organizer/events');
export const createEvent = (input: CreateEventInput) =>
  request<OrganizerEventRow>('/organizer/events', { method: 'POST', body: JSON.stringify(input) });
export const organizerSetEventStatus = (id: string, status: string) =>
  request(`/organizer/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const organizerDeleteEvent = (id: string) => request(`/organizer/events/${id}`, { method: 'DELETE' });

export const getCategories = () => request<ApiCategory[]>('/categories');
export const getEvents = () => request<ApiEvent[]>('/events');
export const getEvent = (id: string) => request<ApiEvent>(`/events/${id}`);

export const getAdminOrders = () => request<OrderRow[]>('/orders/admin');
export const getOrganizerOrders = () => request<OrderRow[]>('/orders/organizer');
export const getMyOrders = () => request<ApiOrder[]>('/orders/my');
