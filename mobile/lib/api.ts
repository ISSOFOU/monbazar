import Constants from 'expo-constants';

export const API_BASE: string =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) || 'https://resplendent-empanada-11d531.netlify.app';

interface RequestOptions {
  method?: string;
  token?: string | null;
  body?: unknown;
}

export async function apiFetch<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body } = options;
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (token) headers['authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = (data && (data as any).error) || `Erreur ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}
