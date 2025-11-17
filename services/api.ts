const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL || 'https://unilodge-0own.onrender.com/api';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include', // This sends cookies automatically
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ message: string; user: any }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  
  signup: (name: string, email: string, password: string) =>
    request<{
        token(arg0: string, token: any): unknown; message: string; user: any 
}>('/auth/register', {
      method: 'POST',
      body: { name, email, password },
    }),
  
  getMe: () => request<any>('/auth/me'),
  
  logout: () => 
    request<any>('/auth/logout', {
      method: 'POST',
    }),

  // Rooms
  getRooms: (params?: { type?: string; minPrice?: number; maxPrice?: number; available?: boolean }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return request<any[]>('/rooms' + query);
  },
  
  getRoom: (id: string) => request<any>(`/rooms/${id}`),
  
  createRoom: (data: any) =>
    request<any>('/rooms', {
      method: 'POST',
      body: data,
    }),
  
  updateRoom: (id: string, data: any) =>
    request<any>(`/rooms/${id}`, {
      method: 'PUT',
      body: data,
    }),
  
  deleteRoom: (id: string) =>
    request<void>(`/rooms/${id}`, {
      method: 'DELETE',
    }),

  // Bookings
  getBookings: () => request<any[]>('/bookings'),
  
  getBooking: (id: string) => request<any>(`/bookings/${id}`),
  
  createBooking: (roomId: string, checkInDate: string, checkOutDate: string) =>
    request<any>('/bookings', {
      method: 'POST',
      body: { roomId, checkInDate, checkOutDate },
    }),
  
  updateBookingStatus: (id: string, status: string) =>
    request<any>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),

  // Analytics
  getAnalytics: () => request<any>('/analytics'),
};
