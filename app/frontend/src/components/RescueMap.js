import { getCategoryLabel } from '../api/nearbySearch.js';

const INDIA_CENTER = [20.5937, 78.9629];
const LEAFLET_ASSET_BASE = 'vendor/leaflet/images/';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fixLeafletDefaultIcons(L) {
  if (!L || !L.Icon || !L.Icon.Default) return;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: `${LEAFLET_ASSET_BASE}marker-icon-2x.png`,
    iconUrl: `${LEAFLET_ASSET_BASE}marker-icon.png`,
    shadowUrl: `${LEAFLET_ASSET_BASE}marker-shadow.png`,
  });
}

function buildPlacePopup(place) {
  const category = getCategoryLabel(place.category);
  const phone = place.phone ? escapeHtml(place.phone) : 'Phone not mapped';
  const address = place.address ? escapeHtml(place.address) : 'Address not mapped';
  const distance = place.distance || 'Distance unavailable';

  return `
    <div class="map-popup">
      <strong>${escapeHtml(place.name)}</strong>
      <span>${escapeHtml(category)}</span>
      <span>${escapeHtml(distance)}</span>
      <span>${phone}</span>
      <span>${address}</span>
    </div>
  `;
}

function buildUserPopup(location, address) {
  const accuracy = Number.isFinite(location.accuracy)
    ? `${Math.round(location.accuracy)} m`
    : 'Unknown';

  return `
    <div class="map-popup">
      <strong>Your current location</strong>
      <span>Accuracy: ${escapeHtml(accuracy)}</span>
      <span>${escapeHtml(address || 'Address not detected yet')}</span>
    </div>
  `;
}

export function createRescueMap({ mapId, emptyStateId }) {
  let map = null;
  let userMarker = null;
  let accuracyCircle = null;
  let placesLayer = null;
  let retryTimer = null;

  function getL() {
    return window.L || null;
  }

  function getMapElement() {
    return document.getElementById(mapId);
  }

  function setEmptyState(message) {
    const emptyState = document.getElementById(emptyStateId);
    if (!emptyState) return;
    emptyState.textContent = message || '';
    emptyState.style.display = message ? 'flex' : 'none';
  }

  function ensureMap() {
    if (map) return map;

    const L = getL();
    const mapElement = getMapElement();

    if (!L || !mapElement) {
      setEmptyState('Map is loading. Location and nearby help still work.');
      if (!retryTimer) {
        retryTimer = window.setTimeout(() => {
          retryTimer = null;
          ensureMap();
        }, 300);
      }
      return null;
    }

    fixLeafletDefaultIcons(L);
    map = L.map(mapElement, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(INDIA_CENTER, 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    placesLayer = L.layerGroup().addTo(map);
    setEmptyState('');
    window.setTimeout(() => map.invalidateSize(), 150);
    window.addEventListener('resize', () => map.invalidateSize());
    return map;
  }

  function setUserLocation(location, address = '') {
    const L = getL();
    const currentMap = ensureMap();
    if (!L || !currentMap || !location) return;

    const latLng = [location.lat, location.lon];
    if (!userMarker) {
      userMarker = L.marker(latLng).addTo(currentMap);
    } else {
      userMarker.setLatLng(latLng);
    }
    userMarker.bindPopup(buildUserPopup(location, address));

    if (accuracyCircle) accuracyCircle.remove();
    if (Number.isFinite(location.accuracy)) {
      accuracyCircle = L.circle(latLng, {
        radius: location.accuracy,
        color: '#4A9BB8',
        fillColor: '#4A9BB8',
        fillOpacity: 0.12,
        weight: 1,
      }).addTo(currentMap);
    }

    currentMap.setView(latLng, 15);
    setEmptyState('');
  }

  function setNearbyPlaces(places = [], location = null) {
    const L = getL();
    const currentMap = ensureMap();
    if (!L || !currentMap || !placesLayer) return;

    placesLayer.clearLayers();

    const bounds = [];
    if (location) bounds.push([location.lat, location.lon]);

    places.forEach((place) => {
      if (!Number.isFinite(place.lat) || !Number.isFinite(place.lon)) return;
      const marker = L.marker([place.lat, place.lon]).bindPopup(buildPlacePopup(place));
      marker.addTo(placesLayer);
      bounds.push([place.lat, place.lon]);
    });

    if (bounds.length > 1) {
      currentMap.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 });
    } else if (location) {
      currentMap.setView([location.lat, location.lon], 15);
    }
  }

  function clearNearbyPlaces() {
    if (placesLayer) placesLayer.clearLayers();
  }

  return {
    ensureMap,
    setEmptyState,
    setUserLocation,
    setNearbyPlaces,
    clearNearbyPlaces,
  };
}
