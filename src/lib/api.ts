import axios from 'axios';
import type { ApiPost, ApiUser, PaginatedResponse } from '@/lib/types';

const API_BASE_URL = 'https://responserift.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export async function fetchUsers(offset = 0, limit = 20) {
  const { data } = await api.get<PaginatedResponse<ApiUser>>('/users', {
    params: { limit, offset },
  });
  return data;
}

export async function fetchUser(userId: number) {
  const { data } = await api.get<ApiUser>(`/users/${userId}`);
  return data;
}

export async function fetchPosts(userId: number) {
  const { data } = await api.get<PaginatedResponse<ApiPost>>('/posts', {
    params: { userId, limit: 50, offset: 0 },
  });
  return data.results.filter((post) => post.userId === userId);
}

export async function sendPost(userId: number, body: string) {
  const { data } = await api.post<ApiPost>('/posts', {
    userId,
    title: 'Message',
    body,
  });
  return data;
}
