// ═══════════════════════════════════════════════════════
// ResQtail — Production-Grade Nearby Discovery System
// Stateful LocationManager + Haversine + Distance Injection
// ═══════════════════════════════════════════════════════

// ── GeoUtils: Optimized Haversine ────────────────────
const GeoUtils = (() => {
  const R = 6371; // Earth radius in km
  const toRad = d => d * 0.017453292519943295; // Math.PI / 180 precomputed
  const _cache = new Map();

  function haversine(lat1, lon1, lat2, lon2) {
    const key = `${lat1.toFixed(5)},${lon1.toFixed(5)},${lat2.toFixed(5)},${lon2.toFixed(5)}`;
    if (_cache.has(key)) return _cache.get(key);
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const km = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (_cache.size > 500) _cache.clear();
    _cache.set(key, km);
    return km;
  }

  function formatDist(km) {
    if (km < 0.1) return `${Math.round(km * 1000)} m`;
    if (km < 1) return `${Math.round(km * 100) * 10} m`;
    return `${km.toFixed(1)} km`;
  }

  function mapsUrl(lat, lng) {
    return `https://www.openstreetmap.org/directions?to=${encodeURIComponent(`${lat},${lng}`)}`;
  }

  return { haversine, formatDist, mapsUrl };
})();

// ── LocationManager: Stateful watchPosition ──────────
const LocationManager = (() => {
  // States: 'idle' | 'searching' | 'active' | 'error'
  let _state = 'idle';
  let _watchId = null;
  let _position = null; // { lat, lng, accuracy, timestamp }
  let _listeners = [];
  let _lastFetchCoords = null;

  function _notify() { _listeners.forEach(fn => { try { fn(_state, _position); } catch (e) {} }); }

  function subscribe(fn) { _listeners.push(fn); return () => { _listeners = _listeners.filter(f => f !== fn); }; }

  function start() {
    if (_watchId !== null) return;
    if (!navigator.geolocation) { _state = 'error'; _notify(); return; }
    _state = 'searching';
    _notify();
    _watchId = navigator.geolocation.watchPosition(
      pos => {
        _position = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, timestamp: Date.now() };
        _state = 'active';
        _notify();
      },
      err => { console.warn('LocationManager error:', err); _state = 'error'; _notify(); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  }

  function stop() {
    if (_watchId !== null) { navigator.geolocation.clearWatch(_watchId); _watchId = null; }
    _state = 'idle'; _notify();
  }

  function getPosition() { return _position; }
  function getState() { return _state; }
  function setLastFetch(coords) { _lastFetchCoords = coords; }
  function getLastFetch() { return _lastFetchCoords; }
  function clearLastFetch() { _lastFetchCoords = null; }

  return { start, stop, subscribe, getPosition, getState, setLastFetch, getLastFetch, clearLastFetch };
})();

// ── Data Transformation: Inject distanceFromUser ─────
function injectDistances(places, userLat, userLng) {
  return places.map(p => {
    const copy = Object.assign({}, p);
    if (typeof copy.latitude === 'number' && typeof copy.longitude === 'number') {
      copy.distanceKm = GeoUtils.haversine(userLat, userLng, copy.latitude, copy.longitude);
      copy.distanceFromUser = GeoUtils.formatDist(copy.distanceKm);
      copy.mapsLink = GeoUtils.mapsUrl(copy.latitude, copy.longitude);
    } else if (typeof copy.distanceKm === 'number') {
      copy.distanceFromUser = GeoUtils.formatDist(copy.distanceKm);
    } else {
      copy.distanceKm = Infinity;
      copy.distanceFromUser = copy.dist || '—';
    }
    return copy;
  });
}

// ── Sort & Filter ────────────────────────────────────
function filterAndSort(places, { animalFilter = 'all', radiusKm = Infinity } = {}) {
  let result = places;
  if (animalFilter !== 'all') result = result.filter(p => p.serves && p.serves.includes(animalFilter));
  if (radiusKm < Infinity) result = result.filter(p => p.emergency || (typeof p.distanceKm === 'number' && p.distanceKm <= radiusKm));
  result.sort((a, b) => {
    if (a.emergency && !b.emergency) return -1;
    if (!a.emergency && b.emergency) return 1;
    return (a.distanceKm || Infinity) - (b.distanceKm || Infinity);
  });
  return result;
}

// ── UI Sync ──────────────────────────────────────────
let _currentAnimalFilter = 'all';

function updateLocationUI(state, pos) {
  const statusText = document.getElementById('locStatusText');
  const statusDetail = document.getElementById('locStatusDetail');
  const accuracyBar = document.getElementById('locAccuracyBar');
  const scanBtn = document.getElementById('liveDataBtn');
  const stopBtn = document.getElementById('stopWatchBtn');
  const mapPlaceholder = document.getElementById('mapPlaceholder');

  if (!statusText) return;

  switch (state) {
    case 'searching':
      statusText.textContent = '⏳ Acquiring GPS signal...';
      statusDetail.textContent = 'Please allow location access when prompted';
      if (scanBtn) { scanBtn.textContent = '⏳ Scanning...'; scanBtn.disabled = true; }
      if (mapPlaceholder) mapPlaceholder.style.borderColor = 'var(--amber)';
      break;
    case 'active':
      if (!pos) break;
      statusText.textContent = '📍 Location Locked';
      statusDetail.textContent = `Lat: ${pos.lat.toFixed(4)}, Lng: ${pos.lng.toFixed(4)}`;
      if (accuracyBar) {
        accuracyBar.style.display = 'block';
        const acc = Math.round(pos.accuracy);
        accuracyBar.textContent = `📡 Accuracy: ±${acc}m ${acc < 50 ? '(Excellent)' : acc < 150 ? '(Good)' : '(Fair)'}`;
        accuracyBar.style.color = acc < 50 ? 'var(--sage)' : acc < 150 ? 'var(--sky)' : 'var(--amber-dark)';
      }
      if (scanBtn) { scanBtn.textContent = '🔄 Re-scan Area'; scanBtn.disabled = false; }
      if (stopBtn) stopBtn.style.display = 'inline-flex';
      if (mapPlaceholder) mapPlaceholder.style.borderColor = 'var(--sage)';
      break;
    case 'error':
      statusText.textContent = '⚠️ Location Unavailable';
      statusDetail.textContent = 'Access denied or timed out. Using default data.';
      if (scanBtn) { scanBtn.textContent = '🛰️ Retry Location'; scanBtn.disabled = false; }
      if (mapPlaceholder) mapPlaceholder.style.borderColor = 'var(--coral)';
      break;
    default:
      statusText.textContent = 'Live Location Map';
      statusDetail.textContent = 'Enable location access to pull actual vets and shelters near you';
      if (scanBtn) { scanBtn.textContent = '🛰️ Scan Area for Helpers'; scanBtn.disabled = false; }
      if (stopBtn) stopBtn.style.display = 'none';
      if (accuracyBar) accuracyBar.style.display = 'none';
      if (mapPlaceholder) mapPlaceholder.style.borderColor = '';
  }
}

function renderNearbyWithDistance() {
  const pos = LocationManager.getPosition();
  const radiusEl = document.getElementById('radiusSelect');
  const radiusKm = radiusEl ? parseInt(radiusEl.value, 10) / 1000 : 10;
  let data = PLACES;
  if (pos) data = injectDistances(data, pos.lat, pos.lng);
  const filtered = filterAndSort(data, { animalFilter: _currentAnimalFilter, radiusKm: pos ? radiusKm : Infinity });
  if (filtered.length === 0) {
    document.getElementById('nearbyGrid').innerHTML = `<div style="text-align:center;padding:40px;grid-column:1/-1;font-weight:600;color:var(--coral);">⚠️ No results within ${radiusKm} km. Try increasing the radius.</div>`;
    return;
  }
  _renderCards(filtered);
}

function _renderCards(list) {
  const grid = document.getElementById('nearbyGrid');
  grid.innerHTML = list.map(p => {
    const [bc, bl] = BADGE[p.type] || ['badge-ngo', '❤️ NGO'];
    const phone = p.phone || '1800111565';
    const mapsAction = p.mapsLink ? `window.open('${p.mapsLink}','_blank')` : `openMaps('${encodeURIComponent(p.name)}')`;
    const emergencyBadge = p.emergency ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#FCE4EC;color:#C62828;font-size:0.68rem;font-weight:700;padding:2px 8px;border-radius:8px;margin-left:6px;">🚨 24×7 Emergency</span>` : '';
    const servicesTip = p.services ? `<div class="serves" style="margin-bottom:8px">🩺 ${p.services}</div>` : '';
    const distBadge = p.distanceFromUser && p.distanceFromUser !== '—'
      ? `<div class="dist" style="color:var(--sky);font-weight:700;">📍 ${p.distanceFromUser}</div>` : '';
    const locLine = p.area ? `<div class="dist">🗺️ Serves: ${p.area}</div>` : '';
    const addrLine = p.address ? `<div class="dist">📍 ${p.address}</div>` : (p.dist && !distBadge ? `<div class="dist">📍 ${p.dist}</div>` : '');
    const donationBadge = p.acceptsDonations ? `<div style="font-size:0.75rem;color:var(--sage);font-weight:600;margin-top:4px;">🎁 Accepts Donations &amp; Volunteers</div>` : '';
    const sourceBadge = p.source ? `<span style="display:inline-flex;align-items:center;gap:3px;background:#E3F2FD;color:#1565C0;font-size:0.62rem;font-weight:700;padding:2px 6px;border-radius:6px;margin-left:4px;">🛰️ Live</span>` : '';
    return `<div class="place-card">
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:14px"><span class="badge ${bc}" style="margin-bottom:0">${bl}</span>${emergencyBadge}${sourceBadge}</div>
      <h4>${p.icon || '🏥'} ${p.name}</h4>
      ${distBadge}${locLine}${addrLine}
      <div class="timings">⏰ ${p.timings}</div>
      ${servicesTip}
      <div class="serves">🐾 ${(p.serves || []).map(a => ({ dog:'🐶',cat:'🐱',cow:'🐮',bird:'🐦',monkey:'🐒',other:'🐒' }[a] || a)).join(' ')}</div>
      ${donationBadge}
      <div class="place-actions" style="margin-top:12px">
        <button class="btn-call" onclick="callNumber('${(phone+'').replace(/[^0-9+]/g, '')}')">📞 Call</button>
        <button class="btn-nav" onclick="${mapsAction}">🗺️ Navigate</button>
      </div>
    </div>`;
  }).join('');
}

// ── Rewired Global Functions ─────────────────────────
// Override the old detectLocationAndFetchLive
function detectLocationAndFetchLive() {
  LocationManager.start();
  const pos = LocationManager.getPosition();
  if (pos) {
    _triggerFetch(pos, true); // force=true on explicit user action
  }
  // The subscription will handle subsequent updates
}

function stopLocationWatch() {
  LocationManager.stop();
  const stopBtn = document.getElementById('stopWatchBtn');
  if (stopBtn) stopBtn.style.display = 'none';
  showToast('📍 Location tracking stopped.');
}

function onRadiusChange() {
  // When user changes radius, always force a fresh fetch
  const pos = LocationManager.getPosition();
  if (pos) {
    LocationManager.clearLastFetch(); // Clear last fetch so _triggerFetch does a real API call
    _triggerFetch(pos, true);
  } else {
    renderNearbyWithDistance();
  }
}

let _fetchDebounceTimer = null;

/**
 * @param {Object} pos - { lat, lng }
 * @param {boolean} force - if true, bypass the "hasn't moved" check and force re-fetch from API
 */
function _triggerFetch(pos, force = false) {
  clearTimeout(_fetchDebounceTimer);
  _fetchDebounceTimer = setTimeout(() => {
    const last = LocationManager.getLastFetch();

    // Skip re-fetch ONLY if:
    //   - force is false (automatic update, not user clicking Re-scan)
    //   - AND position hasn't moved significantly (>200m)
    if (!force && last && GeoUtils.haversine(pos.lat, pos.lng, last.lat, last.lng) < 0.2) {
      renderNearbyWithDistance();
      return;
    }

    const radiusEl = document.getElementById('radiusSelect');
    const radius = radiusEl ? parseInt(radiusEl.value, 10) : 10000;
    LocationManager.setLastFetch({ lat: pos.lat, lng: pos.lng });
    fetchLivePlaces(pos.lat, pos.lng, radius, force);
  }, 400);
}

const _origFilterAnimal = typeof filterAnimal === 'function' ? filterAnimal : null;
window.filterAnimal = function(animal, btn) {
  document.querySelectorAll('#animalSelector .animal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  _currentAnimalFilter = animal;
  
  if (LocationManager.getState() === 'idle') {
    detectLocationAndFetchLive();
  } else {
    renderNearbyWithDistance();
  }
};

// ── Subscribe to LocationManager Updates ─────────────
LocationManager.subscribe((state, pos) => {
  updateLocationUI(state, pos);
  if (state === 'active' && pos) {
    _triggerFetch(pos, false); // automatic update, not forced
  }
});

// ── Override renderNearby globally ───────────────────
window.renderNearby = function(filter) {
  if (filter && filter !== 'all') _currentAnimalFilter = filter;
  else if (filter === 'all') _currentAnimalFilter = 'all';
  renderNearbyWithDistance();
};
