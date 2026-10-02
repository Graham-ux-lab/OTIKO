import type { ApiCategory, ApiTicketType, AdminEventRow, AdminOrderRow, OrganizerRow, UserRow } from '../types';

const API_BASE = `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api`;

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status?: string;
    organizerProfile?: { id: string; organizationName: string; status: string };
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  posterUrl: string | null;
  category: { name: string; slug: string };
  ticketTypes: ApiTicketType[];
  status: string;
  organizer: { user: { name: string } };
}

export type Category = ApiCategory;

export interface CheckoutOrder {
  orderNumber: string;
  checkoutRequestId: string;
  message: string;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!import.meta.env.VITE_API_URL) {
    throw new Error('The API URL is not configured. Set VITE_API_URL in your hosting provider build environment and redeploy.');
  }
  const token = localStorage.getItem('otiko_access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(API_BASE + endpoint, { ...options, headers });
  const data = await response.json().catch(() => null) as { message?: string | string[] } | null;
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return data as T;
}

export const api = {
  login: (emailOrPhone: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ emailOrPhone, password }) }),

  registerOrganizer: (data: { name: string; email: string; phone: string; password: string; organizationName: string; description: string }) =>
    apiRequest<{ message: string; user: AuthResponse['user'] }>('/auth/register/organizer', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => apiRequest<AuthResponse['user']>('/auth/me'),

  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  verifyEmail: (token: string) =>
    apiRequest<{ message: string }>(`/auth/verify-email/${encodeURIComponent(token)}`, { method: 'POST' }),

  getEvents: (params?: string) => apiRequest<Event[]>(`/events${params ? `?${params}` : ''}`),
  getEvent: (id: string) => apiRequest<Event>(`/events/${encodeURIComponent(id)}`),
  getCategories: () => apiRequest<ApiCategory[]>('/categories'),
  getMyEvents: () => apiRequest<Event[]>('/events/organizer/me'),
  createEvent: (data: Record<string, unknown>) => apiRequest<Event>('/events', { method: 'POST', body: JSON.stringify(data) }),
  publishEvent: (id: string) => apiRequest<Event>(`/events/${encodeURIComponent(id)}/publish`, { method: 'POST' }),

  initiateCheckout: (data: { eventId: string; ticketTypeId: string; customerName: string; customerEmail: string; customerPhone: string }) =>
    apiRequest<CheckoutOrder>('/payments/checkout', { method: 'POST', body: JSON.stringify(data) }),
  getCheckoutStatus: (orderNumber: string) =>
    apiRequest<{ status: string }>(`/payments/status/${encodeURIComponent(orderNumber)}`),

  getAdminDashboard: () => apiRequest<{ totalUsers: number; totalOrganizers: number; totalEvents: number; totalOrders: number; pendingApprovals: number; totalRevenue: number }>('/admin/dashboard'),
  getAdminUsers: () => apiRequest<UserRow[]>('/admin/users'),
  setAdminUserStatus: (id: string, status: string) => apiRequest<UserRow>(`/admin/users/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminOrganizers: (status?: string) => apiRequest<OrganizerRow[]>(`/admin/organizers${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  getAdminOrganizer: (id: string) => apiRequest<OrganizerRow>(`/admin/organizers/${encodeURIComponent(id)}`),
  approveOrganizer: (id: string) => apiRequest<{ message: string; emailSent: boolean }>(`/admin/organizers/${encodeURIComponent(id)}/approve`, { method: 'PATCH' }),
  rejectOrganizer: (id: string, reason: string) => apiRequest(`/admin/organizers/${encodeURIComponent(id)}/reject`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  getAdminEvents: () => apiRequest<AdminEventRow[]>('/admin/events'),
  getAdminOrders: () => apiRequest<AdminOrderRow[]>('/admin/orders'),
};
