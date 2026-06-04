import {
  HealthResponseSchema,
  PlanResponseSchema,
  PlanListResponseSchema,
  PlantListResponseSchema,
  CompanionsResultSchema,
  LayoutResultSchema,
  TimingResultSchema,
  type HealthResponse,
  type PlanResponse,
  type PlanListResponse,
  type PlantListResponse,
  type CompanionsResult,
  type LayoutResult,
  type TimingResult,
  type CreatePlanRequest,
  type UpdateInputsRequest,
  type UpdateCompanionsRequest,
  type UpdateLayoutRequest,
  type UpdateTimingRequest,
} from '@gpb/shared';

const BASE = import.meta.env.VITE_API_BASE ?? '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
  }
}

async function request<T>(
  method: string,
  path: string,
  schema: { parse: (v: unknown) => T },
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new ApiError(`${res.status} ${res.statusText}`, res.status, json);
  return schema.parse(json);
}

export const api = {
  getHealth: (): Promise<HealthResponse> => request('GET', '/health', HealthResponseSchema),
  listPlans: (): Promise<PlanListResponse> => request('GET', '/plans', PlanListResponseSchema),
  createPlan: (body: CreatePlanRequest): Promise<PlanResponse> =>
    request('POST', '/plans', PlanResponseSchema, body),
  getPlan: (id: string): Promise<PlanResponse> =>
    request('GET', `/plans/${encodeURIComponent(id)}`, PlanResponseSchema),
  updateInputs: (id: string, body: UpdateInputsRequest): Promise<PlanResponse> =>
    request('PATCH', `/plans/${encodeURIComponent(id)}/inputs`, PlanResponseSchema, body),
  getCompanionsRecommendations: (id: string): Promise<CompanionsResult> =>
    request('GET', `/plans/${encodeURIComponent(id)}/companions/recommendations`, CompanionsResultSchema),
  updateCompanions: (id: string, body: UpdateCompanionsRequest): Promise<PlanResponse> =>
    request('PATCH', `/plans/${encodeURIComponent(id)}/companions`, PlanResponseSchema, body),
  getLayoutSuggestion: (id: string): Promise<LayoutResult> =>
    request('GET', `/plans/${encodeURIComponent(id)}/layout/suggestion`, LayoutResultSchema),
  updateLayout: (id: string, body: UpdateLayoutRequest): Promise<PlanResponse> =>
    request('PATCH', `/plans/${encodeURIComponent(id)}/layout`, PlanResponseSchema, body),
  getTimingSuggestion: (id: string): Promise<TimingResult> =>
    request('GET', `/plans/${encodeURIComponent(id)}/timing/suggestion`, TimingResultSchema),
  updateTiming: (id: string, body: UpdateTimingRequest): Promise<PlanResponse> =>
    request('PATCH', `/plans/${encodeURIComponent(id)}/timing`, PlanResponseSchema, body),
  renderFinal: (id: string): Promise<PlanResponse> =>
    request('POST', `/plans/${encodeURIComponent(id)}/final`, PlanResponseSchema),
  finalMarkdownUrl: (id: string): string => `${BASE}/plans/${encodeURIComponent(id)}/final.md`,
  listPlants: (): Promise<PlantListResponse> => request('GET', '/plants', PlantListResponseSchema),
};

export function getHealth(): Promise<HealthResponse> {
  return api.getHealth();
}
