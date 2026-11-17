import { AreaInfo, InfrastructureItem, SimulationResult } from '../types';

export interface LiveDataResponse {
  source: string;
  lastUpdated: string;
  totalFacilities?: number;
  areas: AreaInfo[];
  features: InfrastructureItem[];
}

export async function fetchLiveInfrastructure(): Promise<LiveDataResponse> {
  const res = await fetch('/api/infrastructure/live');
  if (!res.ok) throw new Error('Failed to fetch live infrastructure data');
  const json = await res.json();
  return json;
}

export async function searchGISFacilities(query: string): Promise<InfrastructureItem[]> {
  if (!query || !query.trim()) return [];
  const res = await fetch(`/api/gis/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error('Failed to search facilities');
  const json = await res.json();
  return json.results || [];
}

export async function simulateInfrastructurePlacement(params: {
  areaName: string;
  facilityType: 'hospital' | 'school' | 'college' | 'bus' | 'park' | 'government' | string;
  name?: string;
  lat?: number;
  lng?: number;
}): Promise<SimulationResult> {
  const res = await fetch('/api/infrastructure/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to run simulation');
  const json = await res.json();
  return json;
}

export async function resetSimulation(): Promise<AreaInfo[]> {
  const res = await fetch('/api/infrastructure/reset-simulation', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset simulation');
  const json = await res.json();
  return json.areas;
}

export async function fetchAreaAnalysis(params: {
  areaName: string;
  score?: number;
  breakdown?: any;
  counts?: any;
}): Promise<any> {
  const res = await fetch('/api/gemini/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to analyze area');
  const json = await res.json();
  return json.data;
}

export async function askAIChat(message: string): Promise<string> {
  const res = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Failed to communicate with AI Assistant');
  const json = await res.json();
  return json.reply;
}
