import { HealthResponseSchema, type HealthResponse } from '@gpb/shared';

const BASE = import.meta.env.VITE_API_BASE ?? '/api';

async function request<T>(path: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const json = await res.json();
  return schema.parse(json);
}

export function getHealth(): Promise<HealthResponse> {
  return request('/health', HealthResponseSchema);
}
