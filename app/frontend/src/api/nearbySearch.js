export const DEFAULT_RADIUS_METERS = 5000;

const NEARBY_TTL_MS = 5 * 60 * 1000;
const nearbyCache = new Map();

const TYPE_LABELS = {
  all: 'help',
  vets: 'vets',
  shelters: 'animal shelters',
  ngos: 'NGOs',
  clinics: 'clinics and hospitals',
};

const CATEGORY_LABELS = {
  vet: 'Veterinary clinic',
  shelter: 'Animal shelter',
  ngo: 'Animal NGO',
  clinic: 'Clinic',
  hospital: 'Hospital',
  unknown: 'Nearby help',
};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

export function distanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km) {
  if (!Number.isFinite(km)) return 'Distance unavailable';
  if (km < 1) return `${Math.max(1, Math.round(km * 1000))} m`;
  return `${km.toFixed(1)} km`;
}

export function formatRadius(radiusMeters = DEFAULT_RADIUS_METERS) {
  const km = radiusMeters / 1000;
  return Number.isInteger(km) ? `${km} km` : `${km.toFixed(1)} km`;
}

export function getTypeLabel(type = 'all') {
  return TYPE_LABELS[type] || TYPE_LABELS.all;
}

export function getCategoryLabel(category = 'unknown') {
  return CATEGORY_LABELS[category] || CATEGORY_LABELS.unknown;
}

export function osmDirectionsUrl(lat, lon) {
  return `https://www.openstreetmap.org/directions?to=${encodeURIComponent(
    `${lat},${lon}`
  )}`;
}

function normalizeCategory(type) {
  const value = String(type || '').toLowerCase();
  if (value.includes('shelter')) return 'shelter';
  if (value.includes('ngo') || value.includes('welfare') || value.includes('rescue')) return 'ngo';
  if (value.includes('hospital')) return 'hospital';
  if (value.includes('clinic')) return 'clinic';
  if (value.includes('vet')) return 'vet';
  return value || 'unknown';
}

function matchesHelpType(place, type) {
  if (type === 'all') return true;
  if (type === 'vets') return place.category === 'vet';
  if (type === 'shelters') return place.category === 'shelter';
  if (type === 'ngos') return place.category === 'ngo';
  if (type === 'clinics') return ['clinic', 'hospital', 'vet'].includes(place.category);
  return true;
}

function normalizePlace(place, userLocation) {
  const lat = Number(place.latitude ?? place.lat);
  const lon = Number(place.longitude ?? place.lon ?? place.lng);
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);
  const computedDistance = hasCoords
    ? distanceKm(userLocation.lat, userLocation.lon, lat, lon)
    : Number(place.distanceKm);
  const category = normalizeCategory(place.type || place.category);

  return {
    id: place.id || `${place.name || 'unnamed'}-${lat}-${lon}`,
    name: place.name || `Unnamed ${getCategoryLabel(category).toLowerCase()}`,
    category,
    type: category,
    phone: place.phone || place.mobile || null,
    address: place.address || '',
    openingHours: place.timings || place.opening_hours || 'Contact for timings',
    lat: hasCoords ? lat : null,
    lon: hasCoords ? lon : null,
    distanceKm: Number.isFinite(computedDistance) ? computedDistance : null,
    distance: place.distance || formatDistance(computedDistance),
    directionsUrl:
      hasCoords ? osmDirectionsUrl(lat, lon) : place.directionsUrl || '',
    source: place.source || 'overpass',
    raw: place,
  };
}

function makeCacheKey({ lat, lon, radius, type }) {
  return [
    Number(lat).toFixed(4),
    Number(lon).toFixed(4),
    radius || DEFAULT_RADIUS_METERS,
    type || 'all',
  ].join(':');
}

export async function searchNearbyHelp({
  lat,
  lon,
  radius = DEFAULT_RADIUS_METERS,
  type = 'all',
  force = false,
}) {
  const key = makeCacheKey({ lat, lon, radius, type });
  const cached = nearbyCache.get(key);

  if (!force && cached && Date.now() - cached.cachedAt < NEARBY_TTL_MS) {
    return cached.value;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 18000);

  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lon),
      radius: String(radius),
      type,
    });
    if (force) params.set('force', '1');

    const response = await fetch(`/api/nearby?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Nearby search failed.');
    }

    const data = await response.json();
    const userLocation = { lat, lon };
    const places = (Array.isArray(data) ? data : [])
      .map((place) => normalizePlace(place, userLocation))
      .filter((place) => matchesHelpType(place, type))
      .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));

    nearbyCache.set(key, { cachedAt: Date.now(), value: places });
    return places;
  } finally {
    window.clearTimeout(timeout);
  }
}

