import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { InfrastructureCategory, AreaInfo, InfrastructureItem, SimulationResult } from '../types';
import { calculateHaversineDistanceKm, AREA_DEMOGRAPHICS } from '../data/palgharData';
import { getPlaceIntelligence, PlaceIntelligence } from '../services/facilityIntelligence';
import {
  Activity,
  GraduationCap,
  Train,
  Bus,
  Building2,
  Sparkles,
  MapPin,
  RotateCcw,
  Layers,
  X,
  Compass,
  Search,
  Navigation,
  AlertTriangle,
  Users,
  Zap,
  Shield,
  ChevronUp,
  ChevronDown,
  PanelRightClose,
  PanelRightOpen,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { simulateInfrastructurePlacement, resetSimulation, searchGISFacilities } from '../services/aiService';

export type HeatmapTab =
  | 'off'
  | 'healthcare'
  | 'education'
  | 'transport'
  | 'priority'
  | 'growth'
  | 'standard';

interface InteractiveMapProps {
  areas: AreaInfo[];
  features: InfrastructureItem[];
  selectedAreaName: string;
  onSelectAreaName: (name: string) => void;
  onUpdateAreas?: (areas: AreaInfo[]) => void;
  onOpenAiPlanner: () => void;
  onSelectFacility?: (facility: InfrastructureItem) => void;
  activeHeatmapTab?: HeatmapTab;
  onSelectHeatmapTab?: (tab: HeatmapTab) => void;
  darkMode: boolean;
}

const CATEGORY_META: Record<
  InfrastructureCategory,
  { label: string; color: string; icon: string; clusterGroup: 'healthcare' | 'education' | 'transport' | 'government' }
> = {
  hospital: { label: 'Hospital', color: '#ef4444', icon: '🏥', clusterGroup: 'healthcare' },
  clinic: { label: 'Clinic / PHC', color: '#f43f5e', icon: '🩺', clusterGroup: 'healthcare' },
  school: { label: 'School', color: '#3b82f6', icon: '🏫', clusterGroup: 'education' },
  college: { label: 'Degree College', color: '#8b5cf6', icon: '🎓', clusterGroup: 'education' },
  university: { label: 'University / Institute', color: '#a855f7', icon: '🏛️', clusterGroup: 'education' },
  railway: { label: 'Railway Station', color: '#f59e0b', icon: '🚆', clusterGroup: 'transport' },
  bus: { label: 'Bus Terminal', color: '#06b6d4', icon: '🚌', clusterGroup: 'transport' },
  government: { label: 'Civic / Gov Office', color: '#64748b', icon: '🏛️', clusterGroup: 'government' },
  police: { label: 'Police Station', color: '#2563eb', icon: '👮', clusterGroup: 'government' },
  fire: { label: 'Fire Station', color: '#ea580c', icon: '🚒', clusterGroup: 'government' },
  park: { label: 'Park / Reserve', color: '#10b981', icon: '🌳', clusterGroup: 'government' },
  bank: { label: 'Bank / Financial Hub', color: '#4f46e5', icon: '🏦', clusterGroup: 'government' },
};

function getGisColor(score: number): string {
  if (score >= 70) return '#22C55E'; // Low deficit / Good (Green)
  if (score >= 52) return '#FACC15'; // Medium (Yellow)
  if (score >= 38) return '#F97316'; // High deficit (Orange)
  return '#DC2626'; // Critical deficit (Red)
}

function getPriorityGisColor(priorityScore: number): string {
  if (priorityScore >= 55) return '#DC2626'; // Critical (Red)
  if (priorityScore >= 42) return '#F97316'; // High (Orange)
  if (priorityScore >= 32) return '#FACC15'; // Medium (Yellow)
  return '#22C55E'; // Low priority / Adequate (Green)
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  areas,
  features,
  selectedAreaName,
  onSelectAreaName,
  onUpdateAreas,
  onOpenAiPlanner,
  onSelectFacility,
  activeHeatmapTab = 'off',
  onSelectHeatmapTab,
  darkMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const heatmapLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const bufferGroupRef = useRef<L.LayerGroup | null>(null);
  const gapGroupRef = useRef<L.LayerGroup | null>(null);
  const simulationGroupRef = useRef<L.LayerGroup | null>(null);
  const clusterGroupRef = useRef<any>(null);
  const markersMapRef = useRef<Record<string, L.Marker>>({});

  // Active layer toggles
  const [activeCategories, setActiveCategories] = useState<Record<InfrastructureCategory, boolean>>({
    hospital: true,
    school: true,
    college: true,
    university: true,
    railway: true,
    bus: true,
    government: true,
    clinic: false,
    police: false,
    fire: false,
    park: false,
    bank: false,
  });

  // Current inspected area
  const [inspectArea, setInspectArea] = useState<AreaInfo>(
    areas.find((a) => a.name.toLowerCase() === selectedAreaName.toLowerCase()) || areas[0]
  );

  // ISSUE 2: Selected Facility for Place Information Panel
  const [selectedPlace, setSelectedPlace] = useState<InfrastructureItem | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Active heatmap state
  const [currentHeatmap, setCurrentHeatmap] = useState<HeatmapTab>(
    activeHeatmapTab === 'standard' ? 'off' : activeHeatmapTab || 'off'
  );

  // Buffer Analysis toggle
  const [showBuffers, setShowBuffers] = useState(false);
  const [bufferDistance, setBufferDistance] = useState<1 | 3 | 5>(3);

  // Gap Analysis toggle
  const [showGaps, setShowGaps] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<InfrastructureItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Smart Planning Simulation Mode State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationType, setSimulationType] = useState<
    'hospital' | 'school' | 'college' | 'bus' | 'park' | 'government'
  >('hospital');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulatingLoading, setSimulatingLoading] = useState(false);

  // Responsive state
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [isMobileSheetExpanded, setIsMobileSheetExpanded] = useState(false);

  // Resolved intelligence for selected place
  const selectedPlaceIntelligence: PlaceIntelligence | null = useMemo(() => {
    if (!selectedPlace) return null;
    return getPlaceIntelligence(selectedPlace, features);
  }, [selectedPlace, features]);

  // Sync external heatmap changes
  useEffect(() => {
    if (activeHeatmapTab) {
      setCurrentHeatmap(activeHeatmapTab === 'standard' ? 'off' : activeHeatmapTab);
    }
  }, [activeHeatmapTab]);

  // Sync selected area prop
  useEffect(() => {
    if (selectedAreaName && selectedAreaName !== 'All') {
      const match = areas.find((a) => a.name.toLowerCase() === selectedAreaName.toLowerCase());
      if (match) {
        setInspectArea(match);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([match.lat, match.lng], 13, {
            duration: 1.2,
            easeLinearity: 0.25,
          });
        }
      }
    }
  }, [selectedAreaName, areas]);

  // Handle map resizing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isSidePanelOpen]);

  // Initialize Map and Leaflet Panes
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.56, 72.82],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(osmTileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: darkMode ? 'osm-dark-filter' : '',
    }).addTo(map);

    const heatmapPane = map.createPane('heatmapPane');
    heatmapPane.style.zIndex = '350';

    const polygonPane = map.createPane('polygonPane');
    polygonPane.style.zIndex = '450';

    heatmapLayerGroupRef.current = L.layerGroup([], { pane: 'heatmapPane' }).addTo(map);
    polygonLayerGroupRef.current = L.layerGroup([], { pane: 'polygonPane' }).addTo(map);
    bufferGroupRef.current = L.layerGroup([], { pane: 'overlayPane' }).addTo(map);
    gapGroupRef.current = L.layerGroup([], { pane: 'overlayPane' }).addTo(map);
    simulationGroupRef.current = L.layerGroup([], { pane: 'overlayPane' }).addTo(map);

    // ========================================================================
    // ISSUE 1 & 5: STABLE MARKER CLUSTERING (Fixed anchor, Spiderfy, Animations)
    // ========================================================================
    const clusterGroup = (L as any).markerClusterGroup({
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true,
      spiderfyDistanceMultiplier: 1.6,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      animateAddingMarkers: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: (cluster: any) => {
        const markers = cluster.getAllChildMarkers();
        let hc = 0;
        let edu = 0;
        let tr = 0;
        let gov = 0;

        for (const m of markers) {
          const group = m.options?.dataClusterGroup;
          if (group === 'healthcare') hc++;
          else if (group === 'education') edu++;
          else if (group === 'transport') tr++;
          else gov++;
        }

        let clusterColor = '#DC2626';
        const maxVal = Math.max(hc, edu, tr, gov);
        if (maxVal === edu) clusterColor = '#2563EB';
        else if (maxVal === tr) clusterColor = '#F97316';
        else if (maxVal === gov) clusterColor = '#06B6D4';
        else clusterColor = '#DC2626';

        const count = cluster.getChildCount();
        const size = count < 10 ? 34 : count < 50 ? 40 : 46;

        // FIXED ANCHOR & FIXED CENTER ORIGIN (NO transform on hover)
        return L.divIcon({
          html: `
            <div class="gis-cluster-inner" style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${clusterColor};
            ">
              ${count}
            </div>
          `,
          className: 'gis-marker-cluster',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          popupAnchor: [0, -size / 2],
        });
      },
    });

    clusterGroup.addTo(map);
    clusterGroupRef.current = clusterGroup;

    mapInstanceRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isSimulating && inspectArea) {
        handleExecuteSimulation(inspectArea.name, simulationType, e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size when side panel collapses or expands to prevent layout distortion
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [isSidePanelOpen]);

  // Sync theme
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const osmTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(osmTileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: darkMode ? 'osm-dark-filter' : '',
    }).addTo(mapInstanceRef.current);
  }, [darkMode]);

  // Render Heatmaps & Polygons
  useEffect(() => {
    if (!heatmapLayerGroupRef.current || !polygonLayerGroupRef.current) return;

    heatmapLayerGroupRef.current.clearLayers();
    polygonLayerGroupRef.current.clearLayers();

    // 1. Heatmap Layer (BELOW polygons, opacity 30%)
    if (currentHeatmap !== 'off' && currentHeatmap !== 'standard') {
      areas.forEach((area) => {
        let score = area.accessibilityScore;
        let heatmapColor = '#0EA5E9';

        if (currentHeatmap === 'healthcare') {
          score = area.breakdown.healthcare;
          heatmapColor = getGisColor(score);
        } else if (currentHeatmap === 'education') {
          score = area.breakdown.education;
          heatmapColor = getGisColor(score);
        } else if (currentHeatmap === 'transport') {
          score = area.breakdown.transportation;
          heatmapColor = getGisColor(score);
        } else if (currentHeatmap === 'priority') {
          score = area.developmentPriorityScore;
          heatmapColor = getPriorityGisColor(score);
        } else if (currentHeatmap === 'growth') {
          score = area.growthPotentialScore;
          heatmapColor = getGisColor(score);
        }

        const heatPoly = L.polygon(area.boundary, {
          pane: 'heatmapPane',
          fillColor: heatmapColor,
          fillOpacity: 0.22, // 20-25% opacity ensures underlying map remains visible
          stroke: false,
          interactive: false,
        });

        heatPoly.addTo(heatmapLayerGroupRef.current!);
      });
    }

    // 2. Area Boundary Polygons (ABOVE heatmap, 2.5px stroke, 100% boundary opacity)
    areas.forEach((area) => {
      const isSelected = inspectArea?.name.toLowerCase() === area.name.toLowerCase();

      let tooltipScore = area.accessibilityScore;
      if (currentHeatmap === 'healthcare') tooltipScore = area.breakdown.healthcare;
      else if (currentHeatmap === 'education') tooltipScore = area.breakdown.education;
      else if (currentHeatmap === 'transport') tooltipScore = area.breakdown.transportation;
      else if (currentHeatmap === 'priority') tooltipScore = area.developmentPriorityScore;
      else if (currentHeatmap === 'growth') tooltipScore = area.growthPotentialScore;

      const boundaryPoly = L.polygon(area.boundary, {
        pane: 'polygonPane',
        stroke: true,
        color: isSelected ? '#38BDF8' : '#60A5FA',
        weight: isSelected ? 3.5 : 2.5,
        opacity: 1.0,
        fillColor: isSelected ? '#38BDF8' : '#0EA5E9',
        fillOpacity: isSelected ? 0.08 : 0.02,
        className: isSelected ? 'admin-boundary-polygon admin-boundary-selected' : 'admin-boundary-polygon',
      });

      const tooltipHtml = `
        <div style="padding: 12px 14px; font-family: system-ui, sans-serif; color: #FFFFFF; min-width: 220px; line-height: 1.45;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-size: 15px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.01em;">${area.name}</span>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(56, 189, 248, 0.2); color: #38BDF8; padding: 2px 7px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.4);">
              ${area.priorityRank}
            </span>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 4px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Population:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${area.population}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Accessibility Score:</span>
              <strong style="color: #38BDF8; font-family: monospace; font-size: 12px;">${tooltipScore}/100</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Hospitals:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${area.counts.hospitals}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Schools:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${area.counts.schools}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Railway Stations:</span>
              <strong style="color: #FFFFFF; font-family: monospace;">${area.counts.railways}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Coverage %:</span>
              <strong style="color: #22C55E; font-family: monospace;">${area.coverageAnalysis.coverage1km}%</strong>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94A3B8; font-weight: 500;">Priority Rank:</span>
              <strong style="color: #F59E0B; font-family: monospace;">${area.priorityRank}</strong>
            </div>
          </div>
        </div>
      `;

      boundaryPoly.bindTooltip(tooltipHtml, {
        sticky: true,
        className: 'gis-dark-tooltip',
        opacity: 1,
      });

      boundaryPoly.on('mouseover', (e) => {
        const layer = e.target as L.Polygon;
        layer.setStyle({
          weight: 3.5,
          color: '#38BDF8',
          fillOpacity: 0.12,
        });
      });

      boundaryPoly.on('mouseout', (e) => {
        const layer = e.target as L.Polygon;
        layer.setStyle({
          weight: isSelected ? 3.5 : 2.5,
          color: isSelected ? '#38BDF8' : '#60A5FA',
          fillOpacity: isSelected ? 0.08 : 0.02,
        });
      });

      boundaryPoly.on('click', () => {
        setInspectArea(area);
        setSelectedPlace(null); // Reset place selection to view area dossier
        onSelectAreaName(area.name);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([area.lat, area.lng], 13, {
            duration: 1.2,
            easeLinearity: 0.25,
          });
        }
      });

      boundaryPoly.addTo(polygonLayerGroupRef.current!);
    });
  }, [areas, inspectArea, currentHeatmap]);

  // Catchment Buffers rendering
  useEffect(() => {
    if (!bufferGroupRef.current) return;
    bufferGroupRef.current.clearLayers();

    if (!showBuffers) return;

    const targetFacilities = features.filter(
      (f) =>
        f.category === 'hospital' ||
        f.category === 'railway' ||
        (f.category === 'school' && f.subcategory.includes('College'))
    );

    targetFacilities.forEach((item) => {
      const radiusMeters = bufferDistance * 1000;
      const color =
        item.category === 'hospital'
          ? '#ef4444'
          : item.category === 'railway'
          ? '#f59e0b'
          : '#3b82f6';

      const circle = L.circle([item.lat, item.lng], {
        radius: radiusMeters,
        color,
        fillColor: color,
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      });

      circle.bindTooltip(
        `<div class="font-bold text-[10px] text-white">${item.name} (${bufferDistance}km Catchment Zone)</div>`,
        { sticky: true, className: 'gis-dark-tooltip' }
      );

      circle.addTo(bufferGroupRef.current!);
    });
  }, [showBuffers, bufferDistance, features]);

  // ==========================================================================
  // ISSUE 1 & 2: MEMOIZED STABLE MARKERS (NO jumping/hover glitch, RESTORED place panel)
  // ==========================================================================
  useEffect(() => {
    if (!clusterGroupRef.current) return;
    clusterGroupRef.current.clearLayers();
    markersMapRef.current = {};

    const filtered = features.filter((p) => activeCategories[p.category]);

    filtered.forEach((item) => {
      const meta = CATEGORY_META[item.category] || CATEGORY_META.hospital;
      const placeInfo = getPlaceIntelligence(item, features);

      // STABLE FIXED ICON:
      // - fixed iconSize: [28, 28]
      // - fixed iconAnchor: [14, 14]
      // - fixed popupAnchor: [0, -16]
      // - NO scale, NO translateY, transform-origin center
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `
          <div class="custom-pin-inner" style="background-color: ${item.isSimulated ? '#a855f7' : meta.color};">
            ${meta.icon}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      const marker = L.marker([item.lat, item.lng], {
        icon: customIcon,
        dataCategory: item.category,
        dataClusterGroup: meta.clusterGroup,
      } as any);

      const osmLink = `https://www.openstreetmap.org/?mlat=${item.lat}&mlon=${item.lng}#map=17/${item.lat}/${item.lng}`;
      const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;

      // ======================================================================
      // ISSUE 2: RESTORED PLACE INFORMATION POPUP (High contrast #FFFFFF/#F8FAFC text)
      // Displays: Name, Address, Category, Area, Distance, Coverage, Description,
      // Nearby Facilities, Accessibility Contribution, Development Impact, AI Recommendation
      // ======================================================================
      const popupHtml = `
        <div style="min-width: 290px; max-width: 340px; padding: 4px; font-family: system-ui, -apple-system, sans-serif; line-height: 1.45; color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 5px;">
            <div style="display: flex; gap: 4px; align-items: center;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${meta.color}; background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px;">
                ${item.isSimulated ? '✨ SIMULATED' : placeInfo.category}
              </span>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #38BDF8; background: rgba(56,189,248,0.15); padding: 2px 6px; border-radius: 4px;">
                ${placeInfo.area}
              </span>
            </div>
            <span style="font-size: 11px; color: #34D399; font-weight: 800; font-family: monospace;">
              ${placeInfo.scoreContribution}
            </span>
          </div>
          
          <div style="font-size: 16px; font-weight: 900; color: #FFFFFF; margin-bottom: 4px; line-height: 1.25;">
            ${placeInfo.name}
          </div>
          
          <div style="font-size: 11px; color: #F8FAFC; margin-bottom: 3px;">
            <span style="color: #94A3B8; font-weight: 600;">Address:</span> ${placeInfo.address}
          </div>

          <div style="font-size: 11px; color: #F8FAFC; margin-bottom: 3px;">
            <span style="color: #94A3B8; font-weight: 600;">Distance from Center:</span> <strong style="color: #38BDF8;">${placeInfo.distanceFromCenter}</strong>
          </div>

          <div style="font-size: 10px; color: #34D399; background: rgba(52, 211, 153, 0.12); padding: 3px 6px; border-radius: 6px; border: 1px solid rgba(52, 211, 153, 0.25); margin-bottom: 5px; font-weight: 700;">
            ✓ ${placeInfo.operationalStatus}
          </div>

          <div style="font-size: 11px; color: #F8FAFC; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px; margin-bottom: 5px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="color: #94A3B8; font-size: 10px; font-weight: 700; text-transform: uppercase;">Development Impact:</div>
            ${placeInfo.developmentImpact}
          </div>

          <div style="font-size: 11px; color: #F8FAFC; background: rgba(168, 85, 247, 0.12); padding: 6px; border-radius: 6px; margin-bottom: 6px; border: 1px solid rgba(168, 85, 247, 0.25);">
            <div style="color: #C084FC; font-size: 10px; font-weight: 800; text-transform: uppercase;">✨ AI Recommendation:</div>
            ${placeInfo.aiRecommendation}
          </div>

          ${
            placeInfo.nearbyFacilities.length > 0
              ? `<div style="font-size: 10px; color: #E2E8F0; margin-bottom: 6px;">
                  <span style="color: #94A3B8; font-weight: 700;">Nearby Facilities:</span>
                  ${placeInfo.nearbyFacilities.map((n) => ` ${n.name} (${n.distance})`).join(' · ')}
                </div>`
              : ''
          }

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px;">
            <a href="${gmapsLink}" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: #FFFFFF; text-decoration: underline;">
              Google Maps ↗
            </a>
            <a href="${osmLink}" target="_blank" rel="noopener noreferrer" style="font-weight: 700; color: #38BDF8; text-decoration: underline;">
              OpenStreetMap ↗
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        autoPan: true,
        autoPanPadding: L.point(24, 24),
        maxWidth: 380,
        className: 'gis-popup-clean',
      });

      // CLICK HANDLER: Selects place, closes previous dossier, opens new facility dossier
      marker.on('click', () => {
        setSelectedPlace(item);

        const areaMatch = areas.find((a) => a.name === item.area);
        if (areaMatch) {
          setInspectArea(areaMatch);
          onSelectAreaName(areaMatch.name);
        }
        if (onSelectFacility) {
          onSelectFacility(item);
        }
        if (!isSidePanelOpen) {
          setIsSidePanelOpen(true);
        }
      });

      clusterGroupRef.current.addLayer(marker);
      markersMapRef.current[item.id] = marker;
      markersMapRef.current[item.name.toLowerCase()] = marker;
    });
  }, [features, activeCategories, areas]);

  // Infrastructure Gaps Visualization
  useEffect(() => {
    if (!gapGroupRef.current) return;
    gapGroupRef.current.clearLayers();

    if (!showGaps) return;

    const gapNodes = [
      {
        area: 'Nalasopara',
        lat: 19.418,
        lng: 72.828,
        category: 'Healthcare Deficit',
        title: 'Critical Gap: Nalasopara East Secondary Healthcare',
        desc: '7.1 Lakh population with only 0.72 beds/1k (WHO benchmark 2.0). 7.4 km travel to nearest major public hospital.',
        recommendation: 'Build 200-Bed Municipal Multispecialty Hospital (Est. ₹160 Cr, +18 score)',
        color: '#DC2626',
      },
      {
        area: 'Boisar',
        lat: 19.798,
        lng: 72.756,
        category: 'Healthcare Deficit',
        title: 'Industrial Hazmat Gap: Tarapur Chemical Burn & Trauma Crisis',
        desc: 'Tarapur MIDC has 1,200+ chemical manufacturing plants with zero specialized burn trauma center within 15 km.',
        recommendation: 'Build 80-Bed Chemical Burn & Industrial Trauma Center (Est. ₹95 Cr, +16 score)',
        color: '#DC2626',
      },
      {
        area: 'Virar',
        lat: 19.467,
        lng: 72.825,
        category: 'Healthcare Deficit',
        title: 'Secondary Healthcare Gap: Virar East Clinic Shortage',
        desc: 'Acute deficit of 100+ bed municipal tertiary hospital in eastern suburban corridor.',
        recommendation: 'Build 150-Bed Virar East Municipal Hospital (Est. ₹135 Cr, +14 score)',
        color: '#DC2626',
      },
      {
        area: 'Palghar',
        lat: 19.696,
        lng: 72.766,
        category: 'Education Deficit',
        title: 'Tertiary Education Gap: Government Medical College Absence',
        desc: 'District Headquarters lacks a public tertiary teaching hospital and medical college.',
        recommendation: 'Build 400-Bed Government Medical College & Campus (Est. ₹280 Cr, +15 score)',
        color: '#2563EB',
      },
      {
        area: 'Vasai',
        lat: 19.382,
        lng: 72.833,
        category: 'Transport Deficit',
        title: 'Transit Divide Gap: Railway Overbridge Choke',
        desc: '45-minute commuter vehicular bottleneck across single railway overbridge dividing East and West Vasai.',
        recommendation: 'Build Vasai East-West Arterial Elevated Bypass Flyover (Est. ₹110 Cr, +12 score)',
        color: '#F97316',
      },
    ];

    gapNodes.forEach((gap) => {
      const alertHtml = `
        <div style="background-color: ${gap.color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 15px; box-shadow: 0 0 16px ${gap.color}; border: 2.5px solid white;">
          ⚠️
        </div>
      `;

      const gapIcon = L.divIcon({
        className: 'gap-pin',
        html: alertHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([gap.lat, gap.lng], { icon: gapIcon });

      const popupHtml = `
        <div style="min-width: 260px; max-width: 320px; padding: 4px; font-family: system-ui, sans-serif; line-height: 1.45; color: #FFFFFF;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; background: rgba(220, 38, 38, 0.2); color: #F87171; padding: 2px 7px; border-radius: 9999px;">
              ${gap.category}
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #CBD5E1;">${gap.area}</span>
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">
            ${gap.title}
          </div>
          <div style="font-size: 11px; color: #CBD5E1; margin-bottom: 6px;">
            ${gap.desc}
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #34D399; background: rgba(16, 185, 129, 0.12); padding: 6px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3);">
            🛠️ <strong>Recommended:</strong> ${gap.recommendation}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(gapGroupRef.current!);
    });
  }, [showGaps]);

  // Search Submit
  const handleSearchSubmit = async (e?: React.FormEvent, customTerm?: string) => {
    if (e) e.preventDefault();
    const term = (customTerm || searchQuery).trim();
    if (!term) return;

    setIsSearching(true);
    try {
      const results = await searchGISFacilities(term);
      setSearchResults(results);
      if (results.length > 0) {
        handleSelectSearchResult(results[0]);
      }
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (facility: InfrastructureItem) => {
    setSearchResults([]);
    setSearchQuery(facility.name);
    setSelectedPlace(facility); // ISSUE 2: Opens Place Information Panel

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([facility.lat, facility.lng], 15, {
        duration: 1.4,
        easeLinearity: 0.25,
      });

      setTimeout(() => {
        const marker =
          markersMapRef.current[facility.id] ||
          markersMapRef.current[facility.name.toLowerCase()];
        if (marker) {
          marker.openPopup();
        }
      }, 1400);
    }

    const areaMatch = areas.find((a) => a.name === facility.area);
    if (areaMatch) {
      setInspectArea(areaMatch);
      onSelectAreaName(areaMatch.name);
    }
  };

  // Execute simulation
  const handleExecuteSimulation = async (
    targetAreaName: string,
    facType: 'hospital' | 'school' | 'college' | 'bus' | 'park' | 'government',
    clickLat?: number,
    clickLng?: number
  ) => {
    setSimulatingLoading(true);
    try {
      const res = await simulateInfrastructurePlacement({
        areaName: targetAreaName,
        facilityType: facType,
        lat: clickLat,
        lng: clickLng,
      });

      setSimulationResult(res);

      if (simulationGroupRef.current && mapInstanceRef.current) {
        simulationGroupRef.current.clearLayers();
        const simLat = res.simulatedFeature.lat;
        const simLng = res.simulatedFeature.lng;

        const pulseCircle = L.circle([simLat, simLng], {
          radius: 2000,
          color: '#a855f7',
          fillColor: '#c084fc',
          fillOpacity: 0.28,
          weight: 2.5,
          dashArray: '6, 6',
        });
        pulseCircle.addTo(simulationGroupRef.current);

        mapInstanceRef.current.flyTo([simLat, simLng], 13.5, { duration: 1 });
      }

      if (onUpdateAreas) {
        const updatedAreas = areas.map((a) => {
          if (a.name === targetAreaName) {
            return {
              ...a,
              accessibilityScore: res.afterScore,
              developmentScore: res.newScores?.developmentScore ?? a.developmentScore,
              infrastructureScore: res.newScores?.infrastructureScore ?? a.infrastructureScore,
              growthPotentialScore: res.newScores?.growthPotentialScore ?? a.growthPotentialScore,
              coverageAnalysis: res.coverageAnalysis ?? a.coverageAnalysis,
              counts: res.newCounts ?? a.counts,
              breakdown: res.newBreakdown ?? a.breakdown,
              categoryLabel: res.categoryLabel,
            };
          }
          return a;
        });
        onUpdateAreas(updatedAreas);
        const match = updatedAreas.find((a) => a.name === targetAreaName);
        if (match) setInspectArea(match);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingLoading(false);
    }
  };

  const handleResetSimulation = async () => {
    if (simulationGroupRef.current) {
      simulationGroupRef.current.clearLayers();
    }
    setSimulationResult(null);
    setIsSimulating(false);
    try {
      const freshAreas = await resetSimulation();
      if (onUpdateAreas) onUpdateAreas(freshAreas);
      if (freshAreas.length > 0) setInspectArea(freshAreas[0]);
    } catch (e) {
      console.warn('Simulation reset error', e);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ==================================================================== */}
      {/* MAIN MAP CONTAINER + RESTORED PLACE INFORMATION / AREA SIDE PANEL     */}
      {/* ==================================================================== */}
      <div className="relative w-full h-[76vh] min-h-[620px] max-h-[820px] flex flex-col lg:flex-row gap-3.5 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-950 p-2 sm:p-3">
        
        {/* Map Container */}
        <div
          className="relative h-full rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 transition-all duration-300 flex-1 min-w-0"
        >
          {/* Top Left: Search Bar (z-[1000]) */}
          <div className="absolute top-3 left-3 z-[1000] w-64 sm:w-72 md:w-80 pointer-events-auto">
            <form
              onSubmit={(e) => handleSearchSubmit(e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-xl text-xs"
            >
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                type="text"
                placeholder="Search facility (e.g. St John College)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length >= 2) {
                    searchGISFacilities(e.target.value).then(setSearchResults);
                  } else {
                    setSearchResults([]);
                  }
                }}
                className="bg-transparent w-full text-white focus:outline-none placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 max-h-60 overflow-y-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-1.5 space-y-1 text-xs z-[1001]">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    className="p-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{item.name}</span>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {item.area}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#F8FAFC] line-clamp-1">{item.address}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      {item.subcategory} · {item.area}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Right: Floating Action Controls (z-[1200]) */}
          <div className="absolute top-3 right-3 z-[1200] flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => setShowGaps(!showGaps)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-xl border transition cursor-pointer active:scale-95 ${
                showGaps
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                  : 'bg-slate-900/95 border-slate-700/80 text-[#E2E8F0] hover:border-rose-400'
              }`}
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${showGaps ? 'text-white' : 'text-rose-400'}`} />
              <span className="hidden sm:inline">Gaps</span>
            </button>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => setShowBuffers(!showBuffers)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition cursor-pointer active:scale-95 ${
                  showBuffers
                    ? 'bg-blue-600 text-white'
                    : 'text-[#CBD5E1] hover:text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Buffers</span>
              </button>

              {showBuffers && (
                <div className="flex items-center gap-0.5 px-1">
                  {([1, 3, 5] as const).map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setBufferDistance(dist)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                        bufferDistance === dist
                          ? 'bg-white text-slate-900'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {dist}k
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md transition active:scale-95 cursor-pointer ${
                isSimulating
                  ? 'bg-purple-600 text-white ring-2 ring-purple-300'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">Simulate</span>
            </button>

            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="hidden md:flex items-center justify-center p-2 rounded-xl bg-slate-900/95 border border-slate-700/80 text-[#E2E8F0] hover:text-white transition cursor-pointer"
              title={isSidePanelOpen ? 'Collapse Side Panel' : 'Expand Side Panel'}
            >
              {isSidePanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </button>
          </div>

          {/* Sub-top Right: Heatmap Toggles (z-[1200]) */}
          <div className="absolute top-14 right-3 z-[1200] hidden sm:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-xl text-xs font-semibold pointer-events-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CBD5E1] px-2">
              Heatmap:
            </span>
            {[
              { id: 'off', label: 'Off', icon: Layers, color: '#94A3B8' },
              { id: 'healthcare', label: 'Healthcare', icon: Activity, color: '#ef4444' },
              { id: 'education', label: 'Education', icon: GraduationCap, color: '#3b82f6' },
              { id: 'transport', label: 'Transport', icon: Train, color: '#f59e0b' },
              { id: 'priority', label: 'Priority', icon: AlertTriangle, color: '#dc2626' },
              { id: 'growth', label: 'Growth', icon: Zap, color: '#0ea5e9' },
            ].map(({ id, label, icon: Icon, color }) => {
              const active = currentHeatmap === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setCurrentHeatmap(id as HeatmapTab);
                    if (onSelectHeatmapTab) onSelectHeatmapTab(id as HeatmapTab);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-[11px] ${
                    active
                      ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: active ? undefined : color }} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Permanent GIS Legend (z-[1200]) */}
          <div className="absolute bottom-6 right-14 z-[1200] p-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl text-xs space-y-1.5 pointer-events-auto">
            <div className="text-[10px] font-extrabold text-[#FFFFFF] uppercase tracking-wider border-b border-slate-800 pb-1 flex items-center justify-between gap-2">
              <span>Infrastructure Density</span>
              <span className="text-[9px] text-[#38BDF8] font-mono font-bold">GIS Scale</span>
            </div>
            <div className="space-y-1 text-[11px] font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shrink-0" />
                <span className="text-white">Low Deficit (Adequate)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] shrink-0" />
                <span className="text-white">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] shrink-0" />
                <span className="text-white">High Deficit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] shrink-0" />
                <span className="text-white">Critical Deficit</span>
              </div>
            </div>
          </div>

          {/* Quick Jump Focus Area Selector (z-[1200]) */}
          <div className="absolute bottom-6 left-3 z-[1200] flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-xl text-xs font-semibold pointer-events-auto">
            <span className="px-2 text-[#CBD5E1] font-bold uppercase text-[10px] hidden sm:inline">
              Focus:
            </span>
            {areas.map((a) => {
              const isSelected = inspectArea?.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    setInspectArea(a);
                    setSelectedPlace(null);
                    onSelectAreaName(a.name);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([a.lat, a.lng], 13, {
                        duration: 1.2,
                        easeLinearity: 0.25,
                      });
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl transition cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500 text-white font-extrabold shadow-sm'
                      : 'text-[#CBD5E1] hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {a.name}
                </button>
              );
            })}
          </div>

          {/* Simulation Overlay Form (z-[1200]) */}
          {isSimulating && (
            <div className="absolute top-14 left-3 z-[1200] p-4 rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-purple-500/40 shadow-2xl space-y-3 w-80 text-xs pointer-events-auto animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b pb-2 border-slate-800">
                <div className="flex items-center gap-2 font-black text-sm text-purple-400">
                  <Sparkles className="w-4 h-4" />
                  <span>GIS Asset Simulator</span>
                </div>
                <button
                  onClick={() => setIsSimulating(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-[#CBD5E1]">
                Simulate a municipal asset in <strong className="text-white">{inspectArea?.name}</strong> to project score deltas:
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { type: 'hospital', label: 'Hospital', icon: '🏥' },
                  { type: 'school', label: 'School', icon: '🏫' },
                  { type: 'college', label: 'College', icon: '🎓' },
                  { type: 'bus', label: 'Bus Hub', icon: '🚌' },
                  { type: 'park', label: 'Park', icon: '🌳' },
                  { type: 'government', label: 'Civic Hub', icon: '🏛️' },
                ].map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSimulationType(type as any)}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-0.5 transition cursor-pointer ${
                      simulationType === type
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-[#CBD5E1] hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => inspectArea && handleExecuteSimulation(inspectArea.name, simulationType)}
                disabled={simulatingLoading}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
              >
                {simulatingLoading ? 'Recalculating GIS Scores...' : `Add ${simulationType.toUpperCase()} in ${inspectArea?.name}`}
              </button>

              {simulationResult && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b pb-1 border-purple-800/80">
                    <span className="text-[10px] font-extrabold text-purple-300 uppercase">Impact Delta</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                      {simulationResult.delta} Pts
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Accessibility Score:</span>
                    <div className="font-mono font-bold">
                      <span className="line-through text-slate-500 mr-1.5">{simulationResult.beforeScore}</span>
                      <span className="text-purple-400 font-black">{simulationResult.afterScore}/100</span>
                    </div>
                  </div>
                  <button
                    onClick={handleResetSimulation}
                    className="text-rose-400 hover:underline flex items-center gap-1 cursor-pointer font-bold text-[10px] pt-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Baseline
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Leaflet Map DOM Element */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* ================================================================== */}
        {/* ISSUE 2 & REQUIREMENT 2: RESPONSIVE PLACE DOSSIER / AREA PANEL     */}
        {/* Desktop: max 420px | Tablet: max 360px | z-index: 1100             */}
        {/* ================================================================== */}
        {isSidePanelOpen && (
          <aside className="hidden md:flex md:w-[360px] lg:w-[420px] max-w-[420px] shrink-0 h-full rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-4 lg:p-5 overflow-y-auto flex-col justify-between space-y-4 text-white shadow-2xl z-[1100] animate-in fade-in duration-200">
            {selectedPlace && selectedPlaceIntelligence ? (
              /* ============================================================ */
              /* 1. PLACE INFORMATION CARD (When a Facility is Clicked)       */
              /* ============================================================ */
              <div className="space-y-4">
                {/* Back / Navigation Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="text-xs text-sky-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to {inspectArea.name}</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                    title="Close Facility Card"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Facility Header & Badges */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-[#E2E8F0] border border-slate-700">
                      {selectedPlaceIntelligence.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {selectedPlaceIntelligence.area}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      {selectedPlaceIntelligence.scoreContribution}
                    </span>
                  </div>

                  <h3 className="text-[22px] font-black text-white leading-tight tracking-tight">
                    {selectedPlaceIntelligence.name}
                  </h3>

                  <p className="text-[13px] text-[#F8FAFC] leading-snug">
                    {selectedPlaceIntelligence.address}
                  </p>
                </div>

                {/* Spatial Coordinates & Distance */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-0.5">
                    <span className="text-[12px] font-semibold text-slate-300 block">Distance</span>
                    <span className="text-[14px] font-bold font-mono text-[#38BDF8] block">
                      {selectedPlaceIntelligence.distanceFromCenter}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-slate-300">Coordinates</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedPlaceIntelligence.coordinates);
                          setCopiedCoords(true);
                          setTimeout(() => setCopiedCoords(false), 2000);
                        }}
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer font-mono font-bold"
                      >
                        {copiedCoords ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCoords ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-white block truncate">
                      {selectedPlaceIntelligence.coordinates}
                    </span>
                  </div>
                </div>

                {/* Service Coverage Radius */}
                <div className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Service Coverage Radius</span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] leading-relaxed">
                    {selectedPlaceIntelligence.coverageRadius}
                  </p>
                </div>

                {/* Facility Description & Operational Status */}
                <div className="p-3.5 rounded-xl border border-slate-700/80 bg-slate-800/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">Facility Description</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      {selectedPlaceIntelligence.operationalStatus}
                    </span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] leading-relaxed">
                    {selectedPlaceIntelligence.description}
                  </p>
                </div>

                {/* Accessibility Impact & Infrastructure Contribution */}
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Accessibility Score Contribution</span>
                    </span>
                    <span className="font-mono text-sm font-black text-emerald-300">
                      {selectedPlaceIntelligence.scoreContribution}
                    </span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] leading-relaxed">
                    <strong>Development Impact:</strong> {selectedPlaceIntelligence.developmentImpact}
                  </p>
                </div>

                {/* AI Recommendation */}
                <div className="p-3.5 rounded-xl border border-purple-500/40 bg-purple-950/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Urban Planner Recommendation</span>
                  </div>
                  <p className="text-xs text-[#F8FAFC] font-medium leading-relaxed">
                    {selectedPlaceIntelligence.aiRecommendation}
                  </p>
                </div>

                {/* Nearby Facilities */}
                {selectedPlaceIntelligence.nearbyFacilities.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-xs font-bold text-slate-300 block">Nearby Facilities</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedPlaceIntelligence.nearbyFacilities.map((n) => {
                        const matchObj = features.find((f) => f.id === n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (matchObj) handleSelectSearchResult(matchObj);
                            }}
                            className="p-2 rounded-lg border border-slate-800 hover:border-emerald-500/60 bg-slate-800/60 cursor-pointer transition text-xs"
                          >
                            <div className="font-bold text-white truncate">{n.name}</div>
                            <div className="font-mono text-[10px] text-emerald-400">{n.distance}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* External Mapping & Direction Links */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedPlaceIntelligence.lat},${selectedPlaceIntelligence.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[#F8FAFC] font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-sky-400" />
                  </a>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedPlaceIntelligence.lat}&mlon=${selectedPlaceIntelligence.lng}#map=17/${selectedPlaceIntelligence.lat}/${selectedPlaceIntelligence.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[#F8FAFC] font-bold text-[11px] flex items-center justify-center gap-1.5 transition"
                  >
                    <span>OpenStreetMap</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>
            ) : (
              /* ============================================================ */
              /* 2. AREA OVERVIEW (When no specific facility is selected)    */
              /* ============================================================ */
              <div className="space-y-4">
                {/* Header Ribbon with Badges */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    {inspectArea.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {inspectArea.priorityRank}
                  </span>
                </div>

                {/* Area Name: 28px */}
                <div>
                  <h3 className="text-[28px] font-black text-white leading-tight tracking-tight">
                    {inspectArea.name}
                  </h3>
                  <p className="text-[14px] font-medium text-[#94A3B8]">
                    {inspectArea.taluka} Taluka · Palghar District
                  </p>
                </div>

                {/* Accessibility Score Card: 24px */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[#94A3B8]">
                      Accessibility Score
                    </span>
                    <div className="text-[24px] font-black font-mono text-emerald-400">
                      {inspectArea.accessibilityScore}/100
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${inspectArea.accessibilityScore}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#CBD5E1]">
                    <span>1km Coverage: <strong className="text-white font-mono">{inspectArea.coverageAnalysis.coverage1km}%</strong></span>
                    <span>Beds: <strong className="text-white font-mono">{inspectArea.coverageAnalysis.bedsPer1000}/1k</strong></span>
                  </div>
                </div>

                {/* Demographics: Population 18px */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-0.5">
                    <span className="text-[14px] font-medium text-[#94A3B8] block">
                      Population
                    </span>
                    <span className="text-[18px] font-bold font-mono text-white block">
                      {inspectArea.population}
                    </span>
                    <span className="text-[11px] text-[#CBD5E1] block">Registered</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-0.5">
                    <span className="text-[14px] font-medium text-[#94A3B8] block">
                      Density
                    </span>
                    <span className="text-[18px] font-bold font-mono text-white block truncate">
                      {inspectArea.populationDensity.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#CBD5E1] block">Residents/km²</span>
                  </div>
                </div>

                {/* Facility Counts: 18px */}
                <div className="space-y-2">
                  <span className="text-[14px] font-semibold text-[#94A3B8] block">
                    Facility Counts
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Hospitals</span>
                      <span className="text-[18px] font-bold font-mono text-white">
                        {inspectArea.counts.hospitals}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Schools</span>
                      <span className="text-[18px] font-bold font-mono text-white">
                        {inspectArea.counts.schools}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Rail Stations</span>
                      <span className="text-[18px] font-bold font-mono text-white">
                        {inspectArea.counts.railways}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sector Accessibility Breakdown */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[14px] font-semibold text-[#94A3B8] block">
                    Sector Accessibility Index
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#CBD5E1]">Healthcare</span>
                      <span className="font-mono font-bold text-white">{inspectArea.breakdown.healthcare}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#CBD5E1]">Education</span>
                      <span className="font-mono font-bold text-white">{inspectArea.breakdown.education}/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#CBD5E1]">Transit</span>
                      <span className="font-mono font-bold text-white">{inspectArea.breakdown.transportation}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              {selectedPlace ? (
                <>
                  <button
                    onClick={onOpenAiPlanner}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                    <span>Ask AI Urban Planner</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#F8FAFC] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to {inspectArea.name} Dossier</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      const el = document.getElementById('area-intelligence-dossier');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>View Full Intelligence Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onOpenAiPlanner}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#E2E8F0] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Ask AI Urban Planner</span>
                  </button>
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ==================================================================== */}
      {/* MOBILE BOTTOM SHEET UI (Shows Place or Area Intelligence)             */}
      {/* ==================================================================== */}
      <div className="block md:hidden w-full rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden text-white z-[1100]">
        {selectedPlace && selectedPlaceIntelligence ? (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                  {selectedPlaceIntelligence.category}
                </span>
                <span className="text-xs text-[#94A3B8]">{selectedPlaceIntelligence.area}</span>
              </div>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-xs text-sky-400 font-bold"
              >
                ← Back
              </button>
            </div>

            <h3 className="text-[20px] font-black text-white leading-tight">
              {selectedPlaceIntelligence.name}
            </h3>
            <p className="text-xs text-[#F8FAFC]">
              {selectedPlaceIntelligence.address}
            </p>

            <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300">Distance from Center:</span>
                <strong className="text-sky-400">{selectedPlaceIntelligence.distanceFromCenter}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Score Contribution:</span>
                <strong className="text-emerald-400">{selectedPlaceIntelligence.scoreContribution}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs">
              <strong className="text-purple-300 block mb-1">AI Recommendation:</strong>
              <p className="text-[#F8FAFC]">{selectedPlaceIntelligence.aiRecommendation}</p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPlaceIntelligence.lat},${selectedPlaceIntelligence.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-slate-800 border border-slate-700 text-[#F8FAFC] font-bold text-xs"
              >
                Google Maps ↗
              </a>
              <a
                href={`https://www.openstreetmap.org/?mlat=${selectedPlaceIntelligence.lat}&mlon=${selectedPlaceIntelligence.lng}#map=17/${selectedPlaceIntelligence.lat}/${selectedPlaceIntelligence.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center rounded-xl bg-slate-800 border border-slate-700 text-[#F8FAFC] font-bold text-xs"
              >
                OpenStreetMap ↗
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div
              onClick={() => setIsMobileSheetExpanded(!isMobileSheetExpanded)}
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                    {inspectArea.categoryLabel}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-medium">{inspectArea.taluka} Taluka</span>
                </div>
                <h3 className="text-[28px] font-black text-white leading-tight">
                  {inspectArea.name}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[12px] text-[#94A3B8] font-medium block">Score</span>
                  <span className="text-[24px] font-black font-mono text-emerald-400 block">
                    {inspectArea.accessibilityScore}
                  </span>
                </div>
                <div className="p-1 rounded-lg bg-slate-800 text-slate-400">
                  {isMobileSheetExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>

            {isMobileSheetExpanded && (
              <div className="p-4 pt-0 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[14px] font-medium text-[#94A3B8] block">Population</span>
                    <span className="text-[18px] font-bold font-mono text-white block">{inspectArea.population}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[14px] font-medium text-[#94A3B8] block">Density</span>
                    <span className="text-[18px] font-bold font-mono text-white block">{inspectArea.populationDensity.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[14px] font-semibold text-[#94A3B8] block mb-1.5">Facility Counts</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Hospitals</span>
                      <span className="text-[18px] font-bold font-mono text-white">{inspectArea.counts.hospitals}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Schools</span>
                      <span className="text-[18px] font-bold font-mono text-white">{inspectArea.counts.schools}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <span className="text-[11px] text-[#CBD5E1] block">Rail</span>
                      <span className="text-[18px] font-bold font-mono text-white">{inspectArea.counts.railways}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('area-intelligence-dossier');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <span>Explore Detailed Area Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
