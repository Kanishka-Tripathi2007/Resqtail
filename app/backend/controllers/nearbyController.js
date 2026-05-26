const https = require('https');
const http = require('http');

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const DEFAULT_RADIUS = 5000;
const USER_AGENT = 'ResQtail/1.0 (animal-rescue-platform; contact@resqtail.org)';

const OVERPASS_ENDPOINTS = [
  { hostname: 'overpass-api.de', path: '/api/interpreter', proto: 'https' },
];

const ANIMAL_NAME_PATTERN = '(animal|pet|vet|veterinary|clinic|hospital|shelter|rescue|ngo|welfare|pfa|spca|dog|cat|cow|paws)';

function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache) {
    if (now - value.ts > CACHE_TTL) cache.delete(key);
  }
}

function httpRequest(options, postData = '') {
  const proto = options._proto === 'http' ? http : https;
  const requestOptions = { ...options };
  delete requestOptions._proto;

  return new Promise((resolve, reject) => {
    const req = proto.request(requestOptions, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        try {
          const redirectUrl = new URL(res.headers.location);
          resolve(httpRequest({
            _proto: redirectUrl.protocol === 'http:' ? 'http' : 'https',
            hostname: redirectUrl.hostname,
            path: redirectUrl.pathname + redirectUrl.search,
            method: requestOptions.method,
            headers: requestOptions.headers,
            timeout: requestOptions.timeout,
          }, postData));
        } catch (error) {
          reject(new Error(`Bad redirect URL from ${requestOptions.hostname}`));
        }
        return;
      }

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Invalid JSON from ${requestOptions.hostname}`));
          }
          return;
        }
        reject(new Error(`${requestOptions.hostname} responded ${res.statusCode}`));
      });
    });

    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error(`${requestOptions.hostname} timed out`)));
    if (postData) req.write(postData);
    req.end();
  });
}

async function fetchFromEndpoint(endpoint, query) {
  const postData = `data=${encodeURIComponent(query)}`;

  return httpRequest({
    _proto: endpoint.proto,
    hostname: endpoint.hostname,
    path: endpoint.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    },
    timeout: 8000,
  }, postData);
}

async function fetchOverpass(query) {
  const errors = [];

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const result = await fetchFromEndpoint(endpoint, query);
      console.log(`[Overpass] Success from ${endpoint.hostname}`);
      return result;
    } catch (error) {
      errors.push(`${endpoint.hostname}: ${error.message}`);
      console.warn(`[Overpass] Failed on ${endpoint.hostname}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  throw new Error(`All Overpass endpoints failed: ${errors.join(' | ')}`);
}

function overpassLine(selector, radius, lat, lng) {
  return `
    node${selector}(around:${radius},${lat},${lng});
    way${selector}(around:${radius},${lat},${lng});
    relation${selector}(around:${radius},${lat},${lng});
  `;
}

function buildOverpassQuery(type, radius, lat, lng) {
  const groups = [];

  if (type === 'all' || type === 'vets') {
    groups.push(overpassLine('["amenity"="veterinary"]', radius, lat, lng));
    groups.push(overpassLine('["healthcare"="veterinary"]', radius, lat, lng));
  }

  if (type === 'all' || type === 'shelters') {
    groups.push(overpassLine('["amenity"="animal_shelter"]', radius, lat, lng));
    groups.push(overpassLine('["amenity"="animal_boarding"]', radius, lat, lng));
    groups.push(overpassLine('["social_facility"="animal_shelter"]', radius, lat, lng));
  }

  if (type === 'all' || type === 'ngos') {
    groups.push(overpassLine(`["office"="ngo"]["name"~"${ANIMAL_NAME_PATTERN}",i]`, radius, lat, lng));
    groups.push(overpassLine(`["amenity"="social_facility"]["name"~"${ANIMAL_NAME_PATTERN}",i]`, radius, lat, lng));
  }

  if (type === 'all' || type === 'clinics') {
    groups.push(overpassLine(`["amenity"~"^(clinic|hospital)$"]["name"~"${ANIMAL_NAME_PATTERN}",i]`, radius, lat, lng));
    groups.push(overpassLine(`["healthcare"~"^(clinic|hospital)$"]["name"~"${ANIMAL_NAME_PATTERN}",i]`, radius, lat, lng));
    groups.push(overpassLine('["amenity"="veterinary"]', radius, lat, lng));
  }

  return `[out:json][timeout:20];(${groups.join('\n')});out center tags;`;
}

function getBoundingBox(lat, lng, radiusMeters) {
  const earthRadiusMeters = 6371000;
  const dLat = (radiusMeters / earthRadiusMeters) * (180 / Math.PI);
  const dLng = (radiusMeters / (earthRadiusMeters * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);
  return `${(lng - dLng).toFixed(6)},${(lat + dLat).toFixed(6)},${(lng + dLng).toFixed(6)},${(lat - dLat).toFixed(6)}`;
}

function nominatimTerms(type) {
  if (type === 'vets') return ['veterinary clinic', 'animal hospital', 'pet clinic'];
  if (type === 'shelters') return ['animal shelter', 'animal rescue shelter'];
  if (type === 'ngos') return ['animal NGO', 'animal welfare NGO', 'animal rescue NGO'];
  if (type === 'clinics') return ['animal clinic', 'animal hospital', 'veterinary hospital'];
  return ['veterinary clinic', 'animal shelter', 'animal NGO', 'animal hospital'];
}

async function searchNominatim(lat, lng, type, radius) {
  const viewbox = getBoundingBox(lat, lng, radius);
  const allResults = [];

  for (const term of nominatimTerms(type)) {
    const path = `/search?format=json&q=${encodeURIComponent(term)}&viewbox=${viewbox}&bounded=1&limit=12&addressdetails=1`;
    try {
      const results = await httpRequest({
        _proto: 'https',
        hostname: 'nominatim.openstreetmap.org',
        path,
        method: 'GET',
        headers: {
          'User-Agent': USER_AGENT,
          'Accept-Language': 'en',
          Accept: 'application/json',
        },
        timeout: 10000,
      });
      if (Array.isArray(results)) allResults.push(...results);
    } catch (error) {
      console.warn(`[Nominatim] ${term} failed: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1100));
  }

  return allResults;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  if (!Number.isFinite(km)) return 'Distance unavailable';
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

function osmDirectionsUrl(lat, lon) {
  return `https://www.openstreetmap.org/directions?to=${encodeURIComponent(`${lat},${lon}`)}`;
}

function addressFromTags(tags = {}) {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:place'],
    tags['addr:city'],
    tags['addr:postcode'],
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : (tags['addr:full'] || tags.address || '');
}

function phoneFromTags(tags = {}) {
  return tags.phone ||
    tags['contact:phone'] ||
    tags['phone:mobile'] ||
    tags.mobile ||
    tags['contact:mobile'] ||
    null;
}

function classifyTags(tags = {}) {
  const amenity = String(tags.amenity || '').toLowerCase();
  const healthcare = String(tags.healthcare || '').toLowerCase();
  const office = String(tags.office || '').toLowerCase();
  const socialFacility = String(tags.social_facility || '').toLowerCase();
  const name = String(tags.name || '').toLowerCase();

  if (amenity === 'animal_shelter' || amenity === 'animal_boarding' || socialFacility === 'animal_shelter') return 'shelter';
  if (office === 'ngo' || name.includes('ngo') || name.includes('welfare') || name.includes('rescue')) return 'ngo';
  if (amenity === 'hospital' || healthcare === 'hospital') return 'hospital';
  if (amenity === 'clinic' || healthcare === 'clinic') return 'clinic';
  if (amenity === 'veterinary' || healthcare === 'veterinary' || name.includes('vet')) return 'vet';
  return 'unknown';
}

function normalizeOverpassElement(element, userLat, userLng) {
  const tags = element.tags || {};
  const lat = Number(element.lat || (element.center && element.center.lat));
  const lon = Number(element.lon || (element.center && element.center.lon));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const type = classifyTags(tags);
  const distKm = haversine(userLat, userLng, lat, lon);

  return {
    id: `${element.type || 'node'}:${element.id}`,
    name: tags.name || tags.operator || tags.brand || `Unnamed ${type === 'unknown' ? 'help point' : type}`,
    type,
    category: type,
    address: addressFromTags(tags),
    phone: phoneFromTags(tags),
    distance: formatDistance(distKm),
    distanceKm: Math.round(distKm * 10) / 10,
    directionsUrl: osmDirectionsUrl(lat, lon),
    timings: tags.opening_hours || 'Contact for timings',
    latitude: lat,
    longitude: lon,
    source: 'overpass',
  };
}

function normalizeNominatimResult(result, userLat, userLng, type) {
  const lat = parseFloat(result.lat);
  const lon = parseFloat(result.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const distKm = haversine(userLat, userLng, lat, lon);
  const displayParts = String(result.display_name || '').split(',').map((part) => part.trim()).filter(Boolean);
  const inferredType = type === 'all' ? classifyTags({ name: displayParts[0] || '', amenity: result.type, healthcare: result.class }) : type.replace(/s$/, '');

  return {
    id: `nominatim:${result.place_id || `${lat}:${lon}`}`,
    name: displayParts[0] || `Unnamed ${inferredType}`,
    type: inferredType === 'vet' ? 'vet' : inferredType,
    category: inferredType === 'vet' ? 'vet' : inferredType,
    address: displayParts.slice(1, 5).join(', '),
    phone: null,
    distance: formatDistance(distKm),
    distanceKm: Math.round(distKm * 10) / 10,
    directionsUrl: osmDirectionsUrl(lat, lon),
    timings: 'Contact for timings',
    latitude: lat,
    longitude: lon,
    source: 'nominatim',
  };
}

function defaultNearbyData() {
  return [
    {
      name: 'Animal Welfare Board of India',
      type: 'ngo',
      address: 'National emergency helpline',
      phone: '1962',
      distance: 'Distance unavailable',
      distanceKm: null,
      directionsUrl: '',
      timings: '24x7 emergency',
      source: 'default',
    },
    {
      name: 'Go Nirvana Foundation',
      type: 'ngo',
      address: 'Patrakar Colony, Jaipur',
      phone: '7851032328',
      distance: 'Distance unavailable',
      distanceKm: null,
      directionsUrl: '',
      timings: '8AM - 8PM | 24x7 emergency',
      source: 'default',
    },
  ];
}

exports.getNearby = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseInt(req.query.radius, 10) || DEFAULT_RADIUS;
    const type = ['all', 'vets', 'shelters', 'ngos', 'clinics'].includes(req.query.type)
      ? req.query.type
      : 'all';
    const forceRefresh = req.query.force === '1' || req.query.force === 'true';

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.json(defaultNearbyData());
    }

    const cacheKey = `nearby:${type}:${lat.toFixed(4)}:${lng.toFixed(4)}:${radius}`;
    if (!forceRefresh) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return res.json(cached.data);
      }
    }

    let results = [];

    try {
      const query = buildOverpassQuery(type, radius, lat, lng);
      const data = await fetchOverpass(query);
      const seen = new Set();
      results = (data.elements || [])
        .map((element) => normalizeOverpassElement(element, lat, lng))
        .filter(Boolean)
        .filter((place) => {
          const key = `${place.latitude.toFixed(5)}:${place.longitude.toFixed(5)}:${place.name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    } catch (error) {
      console.warn(`[Nearby] Overpass failed: ${error.message}`);
    }

    if (results.length === 0 && req.query.fallback === 'nominatim') {
      try {
        const nominatimResults = await searchNominatim(lat, lng, type, radius);
        const seen = new Set();
        results = nominatimResults
          .map((result) => normalizeNominatimResult(result, lat, lng, type))
          .filter(Boolean)
          .filter((place) => place.distanceKm <= radius / 1000 * 1.2)
          .filter((place) => {
            const key = `${place.latitude.toFixed(5)}:${place.longitude.toFixed(5)}:${place.name}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      } catch (error) {
        console.warn(`[Nearby] Nominatim fallback failed: ${error.message}`);
      }
    }

    results.sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
    cache.set(cacheKey, { ts: Date.now(), data: results });
    if (cache.size > 100) cleanCache();

    res.json(results);
  } catch (error) {
    console.error('getNearby error:', error.message || error);
    res.json(defaultNearbyData());
  }
};

exports.reverseGeocode = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }

    const cacheKey = `geo:${lat.toFixed(5)}:${lng.toFixed(5)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return res.json(cached.data);
    }

    const result = await httpRequest({
      _proto: 'https',
      hostname: 'nominatim.openstreetmap.org',
      path: `/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en',
        Accept: 'application/json',
      },
      timeout: 9000,
    });

    const addr = result.address || {};
    const responseData = {
      display_name: result.display_name || '',
      suburb: addr.suburb || addr.neighbourhood || '',
      city: addr.city || addr.town || addr.village || '',
      state: addr.state || '',
      country: addr.country || '',
      postcode: addr.postcode || '',
      road: addr.road || '',
      short: addr.suburb || addr.city || addr.town || addr.village || addr.state || 'Unknown',
    };

    cache.set(cacheKey, { ts: Date.now(), data: responseData });
    res.json(responseData);
  } catch (error) {
    console.error('reverseGeocode error:', error.message || error);
    res.json({
      display_name: '',
      suburb: '',
      city: '',
      state: '',
      country: '',
      postcode: '',
      road: '',
      short: 'Unknown',
      error: 'Geocoding failed',
    });
  }
};
