import type { CreateEventInput, AdminOrderRow, OrganizerOrderRow, AdminEventRow, OrganizerEventRow, OrganizerRow, SessionUser, UserRow, ApiEvent, ApiCategory, ApiOrder } from './types';

const apiBaseUrl = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`;

type Session = { accessToken: string; user: SessionUser };

function token(): string | null {
  return localStorage.getItem('otiko_access_token');
}

function authHeaders(): Record<string, string> {
  const t = token();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error('The API URL is not configured. Set VITE_API_URL in your hosting provider build environment and redeploy.');
  }
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

export const getOrganizers = async () => {
  const users = await request<{
    id: string; name: string; email: string; phone: string; status: string; createdAt: string;
    organizerProfile?: { id: string; organizationName: string; description: string | null; status: string; approvedAt: string | null; createdAt: string } | null;
  }[]>('/admin/organizers');
  return users.flatMap((user) => user.organizerProfile ? [{
    ...user.organizerProfile,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, status: user.status },
  }] : []) as OrganizerRow[];
};
export const approveOrganizer = (id: string) => request(`/admin/organizers/${id}/approve`, { method: 'PATCH' });
export const rejectOrganizer = (id: string, reason: string) => request(`/admin/organizers/${id}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) });
export const getAdminEvents = () => request<AdminEventRow[]>('/admin/events');
export const setEventStatus = (id: string, status: string) =>
  request(`/admin/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const deleteEvent = (id: string) => request(`/admin/events/${id}`, { method: 'DELETE' });

export const getMyEvents = () => request<OrganizerEventRow[]>('/events/organizer/me');
export const createEvent = (input: CreateEventInput) => {
  const ticketTypes = (input.ticketTypes ?? []).map((ticket) => ({
    ...ticket,
    salesStart: input.startDate,
    salesEnd: input.endDate,
  }));
  return request<OrganizerEventRow>('/events', { method: 'POST', body: JSON.stringify({ ...input, ticketTypes }) });
};
export const organizerSetEventStatus = (id: string, status: string) =>
  status === 'PUBLISHED'
    ? request(`/events/${id}/publish`, { method: 'POST' })
    : request(`/events/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const organizerDeleteEvent = (id: string) => request(`/events/${id}`, { method: 'DELETE' });

export const getCategories = () => request<ApiCategory[]>('/categories');
export const getEvents = () => request<ApiEvent[]>('/events');
export const getEvent = (id: string) => request<ApiEvent>(`/events/${id}`);

export const getAdminOrders = () => request<AdminOrderRow[]>('/admin/orders');
export const getOrganizerOrders = () => request<OrganizerOrderRow[]>('/orders/organizer');
export const getMyOrders = () => request<ApiOrder[]>('/orders/my');
