export type InfrastructureCategory =
  | 'hospital'
  | 'clinic'
  | 'school'
  | 'college'
  | 'university'
  | 'railway'
  | 'bus'
  | 'government'
  | 'police'
  | 'fire'
  | 'park'
  | 'bank';

export type CoverageCategory = 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';

export interface InfrastructureItem {
  id: string;
  name: string;
  category: InfrastructureCategory;
  subcategory: string;
  lat: number;
  lng: number;
  address?: string;
  area: string;
  details: string;
  distanceKm?: number;
  osmType?: string;
  isSimulated?: boolean;
}

export interface AreaCoverageAnalysis {
  coverage1km: number;
  coverage3km: number;
  coverage5km: number;
  deficitScore?: number;
  bedsPer1000: number;
  schoolsPer10000?: number;
  criticalMissing?: string;
}

export interface DevelopmentOpportunity {
  id: string;
  title: string;
  sector: 'healthcare' | 'education' | 'transport' | 'civic' | 'recreation';
  reason: string;
  impactScore: number;
  estimatedCost: string;
  priority: 'Critical' | 'High' | 'Medium';
  timeframe: string;
  timeline?: string;
  implementationDifficulty?: 'Low' | 'Medium' | 'High';
  targetLocation: string;
}

export interface AreaSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
}

export interface AreaInfo {
  id: string;
  name: string;
  taluka: string;
  lat: number;
  lng: number;
  population: string;
  populationNum: number;
  areaSizeKm2: number;
  populationDensity: number;
  boundary: [number, number][];
  accessibilityScore: number;
  developmentScore: number;
  infrastructureScore: number;
  growthPotentialScore: number;
  currentDevelopmentStatus?: string;
  infrastructureMaturity?: string;
  categoryLabel: CoverageCategory;
  categoryColor: string;
  priorityRank: string;
  developmentPriorityScore: number;
  gaps?: {
    lackingHospitals: boolean;
    hospitalGapReason: string;
    lackingSchools: boolean;
    schoolGapReason: string;
    lackingTransport: boolean;
    transportGapReason: string;
    lackingGov: boolean;
    govGapReason: string;
  };
  coverageAnalysis: AreaCoverageAnalysis;
  breakdown: {
    healthcare: number;
    education: number;
    transportation: number;
    government: number;
  };
  counts: {
    hospitals: number;
    clinics: number;
    schools: number;
    colleges: number;
    universities: number;
    railways: number;
    buses: number;
    govs: number;
    police: number;
    fire: number;
    parks: number;
    banks: number;
    total: number;
  };
  swot: AreaSWOT;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  developmentOpportunities: DevelopmentOpportunity[];
  simulatedImpact?: string;
  nearestMissingFacility?: string;
  priorityActions?: string[];
  futureSuggestions?: string;
}

export interface SimulationResult {
  areaName: string;
  beforeScore: number;
  afterScore: number;
  delta: string;
  simulatedFeature: InfrastructureItem;
  facilityType?: string;
  beforeScores?: {
    accessibilityScore: number;
    developmentScore: number;
    infrastructureScore: number;
    growthPotentialScore: number;
  };
  newScores?: {
    accessibilityScore: number;
    developmentScore: number;
    infrastructureScore: number;
    growthPotentialScore: number;
  };
  beforeCoverage?: AreaCoverageAnalysis;
  coverageAnalysis?: AreaCoverageAnalysis;
  newBreakdown: {
    healthcare: number;
    education: number;
    transportation: number;
    government: number;
  };
  newCounts?: any;
  categoryLabel: CoverageCategory;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
