const REVERSE_GEOCODE_TTL_MS = 10 * 60 * 1000;
const reverseGeocodeCache = new Map();

function cacheKey(lat, lon) {
  return `${Number(lat).toFixed(5)}:${Number(lon).toFixed(5)}`;
}

function buildAddress(data) {
  if (data.display_name) return data.display_name;

  return [
    data.road,
    data.suburb,
    data.city,
    data.state,
    data.postcode,
    data.country,
  ]
    .filter(Boolean)
    .join(', ');
}

export async function reverseGeocode({ lat, lon }) {
  const key = cacheKey(lat, lon);
  const cached = reverseGeocodeCache.get(key);

  if (cached && Date.now() - cached.cachedAt < REVERSE_GEOCODE_TTL_MS) {
    return cached.value;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);

  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lng: String(lon),
    });
    const response = await fetch(`/api/nearby/geocode?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('Address lookup failed.');
    }

    const data = await response.json();
    const address = buildAddress(data);

    if (!address) {
      throw new Error('Address could not be detected.');
    }

    const value = { address, raw: data };
    reverseGeocodeCache.set(key, { cachedAt: Date.now(), value });
    return value;
  } finally {
    window.clearTimeout(timeout);
  }
}

