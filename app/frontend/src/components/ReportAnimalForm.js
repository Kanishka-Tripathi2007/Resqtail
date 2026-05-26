import { searchNearbyHelp, DEFAULT_RADIUS_METERS, formatRadius, getCategoryLabel, getTypeLabel } from '../api/nearbySearch.js';
import { reverseGeocode } from '../api/reverseGeocode.js';
import { getUserLocation } from '../utils/getUserLocation.js';
import { buildAnimalReport, submitAnimalReport } from '../services/reportService.js';
import { createRescueMap } from './RescueMap.js';

const state = {
  location: null,
  address: '',
  selectedHelpType: 'all',
  selectedAnimalType: 'all',
  nearbyResults: [],
  radius: DEFAULT_RADIUS_METERS,
  isGettingLocation: false,
  isSearching: false,
};

let rescueMap = null;

function $(id) {
  return document.getElementById(id);
}

function toast(message, type = 'success') {
  if (window.showToast) window.showToast(message, { type, duration: 3200 });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setText(id, text) {
  const element = $(id);
  if (element) element.textContent = text;
}

function setButtonLoading(id, isLoading, loadingText, idleText) {
  const button = $(id);
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : idleText;
}

function getRadius() {
  const radius = Number($('radiusSelect')?.value || DEFAULT_RADIUS_METERS);
  return Number.isFinite(radius) ? radius : DEFAULT_RADIUS_METERS;
}

function setLocationFields(location, address = '') {
  const lat = location ? Number(location.lat).toFixed(6) : '';
  const lon = location ? Number(location.lon).toFixed(6) : '';
  const accuracy = location?.accuracy ? Math.round(location.accuracy) : '';

  if ($('reportLat')) $('reportLat').value = lat;
  if ($('reportLng')) $('reportLng').value = lon;
  if ($('reportAccuracy')) $('reportAccuracy').value = accuracy;
  if ($('reportTimestamp')) $('reportTimestamp').value = location?.timestamp || '';
  if ($('reportAddress')) $('reportAddress').value = address;
  if ($('reportLocation')) {
    $('reportLocation').value = address || (lat && lon ? `${lat}, ${lon}` : '');
  }

  const gpsText = location
    ? `GPS saved: ${lat}, ${lon} | Accuracy: ${accuracy || 'unknown'} m`
    : 'No GPS location saved yet.';
  setText('reportGpsStatus', gpsText);
  setText('locAccuracyBar', location ? `Accuracy: ${accuracy || 'unknown'} m` : '');
}

function setLocationStatus(message, detail = '') {
  setText('locStatusText', message);
  setText('locStatusDetail', detail);
  setText('reportLocationStatus', detail || message);
}

function handleLocationError(error) {
  const message = error?.message || 'Location could not be detected.';
  setLocationStatus(message, 'Please allow location access or try again.');
  toast(message, 'error');
}

async function useCurrentLocation({ searchAfter = false, forceSearch = false } = {}) {
  if (state.isGettingLocation) return state.location;

  state.isGettingLocation = true;
  setButtonLoading('liveDataBtn', true, 'Getting your location...', 'Use My Current Location');
  setButtonLoading('reportLocationBtn', true, 'Getting your location...', 'Use My Current Location');
  setLocationStatus('Getting your location...', 'Please allow location access when your browser asks.');
  rescueMap?.setEmptyState('Getting your location...');

  try {
    const location = await getUserLocation();
    state.location = location;
    state.address = '';
    setLocationFields(location);
    setLocationStatus(
      'Location detected.',
      `Lat ${location.lat.toFixed(5)}, lon ${location.lon.toFixed(5)}`
    );
    rescueMap?.setUserLocation(location);

    try {
      const result = await reverseGeocode(location);
      state.address = result.address;
      setLocationFields(location, result.address);
      setLocationStatus('Location detected.', result.address);
      rescueMap?.setUserLocation(location, result.address);
    } catch (addressError) {
      setLocationStatus(
        'Location detected.',
        'Address could not be detected, but coordinates were saved.'
      );
      toast('Address could not be detected, but coordinates were saved.', 'error');
    }

    if (searchAfter) await findNearbyHelp(state.selectedHelpType, { force: forceSearch });
    return location;
  } catch (error) {
    handleLocationError(error);
    return null;
  } finally {
    state.isGettingLocation = false;
    setButtonLoading('liveDataBtn', false, 'Getting your location...', 'Use My Current Location');
    setButtonLoading('reportLocationBtn', false, 'Getting your location...', 'Use My Current Location');
  }
}

function filterByAnimalType(places) {
  if (state.selectedAnimalType === 'all') return places;
  return places;
}

function renderNearbyResults(places = state.nearbyResults) {
  const grid = $('nearbyGrid');
  if (!grid) return;

  const radiusLabel = formatRadius(state.radius);
  const typeLabel = getTypeLabel(state.selectedHelpType);
  const visiblePlaces = filterByAnimalType(places);

  if (!visiblePlaces.length) {
    grid.innerHTML = `
      <div class="nearby-empty">
        No nearby ${typeLabel} found within ${radiusLabel}. Try increasing the radius.
      </div>
    `;
    setText('reportNearbyStatus', `No nearby ${typeLabel} found within ${radiusLabel}.`);
    return;
  }

  grid.innerHTML = visiblePlaces
    .map((place) => {
      const category = getCategoryLabel(place.category);
      const phoneText = place.phone || 'Phone not mapped';
      const addressText = place.address || 'Address not mapped';
      const directionsUrl = String(place.directionsUrl || '').replace(/'/g, '%27');
      const phoneAction = place.phone
        ? `<button class="btn-call" onclick="callNumber('${String(place.phone).replace(/[^0-9+]/g, '')}')">Call</button>`
        : `<button class="btn-call" disabled>No phone</button>`;
      const mapAction = directionsUrl
        ? `<button class="btn-nav" onclick="window.open('${directionsUrl}', '_blank')">Open map</button>`
        : `<button class="btn-nav" disabled>No map</button>`;

      return `
        <div class="place-card">
          <div class="place-card-top">
            <span class="badge badge-${escapeHtml(place.category || 'ngo')}">${escapeHtml(category)}</span>
            <span class="live-source">${escapeHtml(place.source || 'OSM')}</span>
          </div>
          <h4>${escapeHtml(place.name)}</h4>
          <div class="dist">${escapeHtml(place.distance || 'Distance unavailable')}</div>
          <div class="dist">${escapeHtml(addressText)}</div>
          <div class="timings">${escapeHtml(place.openingHours || 'Contact for timings')}</div>
          <div class="serves">${escapeHtml(phoneText)}</div>
          <div class="place-actions">${phoneAction}${mapAction}</div>
        </div>
      `;
    })
    .join('');

  setText('reportNearbyStatus', `${visiblePlaces.length} nearby ${typeLabel} found within ${radiusLabel}.`);
}

async function findNearbyHelp(type = state.selectedHelpType, { force = false } = {}) {
  state.selectedHelpType = type || 'all';
  state.radius = getRadius();

  if (!state.location) {
    const location = await useCurrentLocation();
    if (!location) return [];
  }

  if (state.isSearching) return state.nearbyResults;

  state.isSearching = true;
  const typeLabel = getTypeLabel(state.selectedHelpType);
  const radiusLabel = formatRadius(state.radius);
  setText('reportNearbyStatus', `Searching nearby ${typeLabel} within ${radiusLabel}...`);
  setText('locStatusText', 'Searching nearby help...');
  setText('locStatusDetail', `Looking for ${typeLabel} within ${radiusLabel}.`);
  setButtonLoading('findNearbyBtn', true, 'Finding nearby help...', 'Find Nearby Help');

  try {
    const places = await searchNearbyHelp({
      lat: state.location.lat,
      lon: state.location.lon,
      radius: state.radius,
      type: state.selectedHelpType,
      force,
    });

    state.nearbyResults = places;
    rescueMap?.setNearbyPlaces(places, state.location);
    renderNearbyResults(places);

    if (places.length) {
      setLocationStatus('Nearby help found.', `${places.length} ${typeLabel} found within ${radiusLabel}.`);
    } else {
      setLocationStatus(`No nearby ${typeLabel} found within ${radiusLabel}.`, 'Try a wider radius or another category.');
    }

    return places;
  } catch (error) {
    console.error('Nearby search failed:', error);
    setText('reportNearbyStatus', 'Nearby help search failed. Please try again.');
    toast('Nearby help search failed. Please try again.', 'error');
    return [];
  } finally {
    state.isSearching = false;
    setButtonLoading('findNearbyBtn', false, 'Finding nearby help...', 'Find Nearby Help');
  }
}

function setActiveButton(selector, button) {
  document.querySelectorAll(selector).forEach((item) => item.classList.remove('active'));
  if (button) button.classList.add('active');
}

function getReportValues() {
  const photoInput = $('photoUpload');
  const location = state.location || {
    lat: Number($('reportLat')?.value),
    lon: Number($('reportLng')?.value),
    accuracy: Number($('reportAccuracy')?.value),
  };

  return {
    animalType: $('reportAnimal')?.value || '',
    condition: $('reportUrgency')?.value || '',
    description: $('reportDesc')?.value || '',
    address: $('reportLocation')?.value || state.address || '',
    location,
    phone: $('reportContact')?.value || '',
    reporterName: $('reportName')?.value || '',
    reporterEmail: $('reportEmail')?.value || '',
    photoFile: photoInput?.files?.[0] || null,
  };
}

function clearReportForm() {
  state.location = null;
  state.address = '';
  ['reportAnimal', 'reportUrgency', 'reportLocation', 'reportDesc', 'reportContact', 'reportName', 'reportEmail', 'reportLat', 'reportLng', 'reportAccuracy', 'reportTimestamp', 'reportAddress'].forEach((id) => {
    const element = $(id);
    if (element) element.value = '';
  });
  const photoInput = $('photoUpload');
  if (photoInput) photoInput.value = '';
  setText('photoUploadStatus', 'No photo selected yet.');
  setText('reportGpsStatus', 'No GPS location saved yet.');
  setText('reportLocationStatus', 'Location not detected yet.');
}

async function submitReport() {
  const values = getReportValues();

  if (!values.animalType || !values.condition) {
    toast('Please fill the animal type and injury condition.', 'error');
    return;
  }

  if (!Number.isFinite(Number(values.location.lat)) || !Number.isFinite(Number(values.location.lon))) {
    toast('Use My Current Location before submitting so rescuers receive GPS coordinates.', 'error');
    return;
  }

  const report = buildAnimalReport({
    animalType: values.animalType,
    condition: values.condition,
    description: values.description,
    location: values.location,
    address: values.address,
  });

  try {
    const saved = await submitAnimalReport({
      report,
      photoFile: values.photoFile,
      reporterName: values.reporterName,
      reporterEmail: values.reporterEmail,
      phone: values.phone,
    });
    toast('Report submitted with GPS location.');
    clearReportForm();
    return saved;
  } catch (error) {
    console.error('Report submit failed:', error);
    toast(error.message || 'Report could not be submitted.', 'error');
    return null;
  }
}

function handlePhotoUpload(input) {
  const file = input?.files?.[0];
  setText('photoUploadStatus', file ? `Selected: ${file.name}` : 'No photo selected yet.');
  if (file) toast(`Photo selected: ${file.name}`);
}

function initReportAnimalFlow() {
  rescueMap = createRescueMap({
    mapId: 'rescueMap',
    emptyStateId: 'mapEmptyState',
  });
  rescueMap.ensureMap();

  state.radius = getRadius();
  setLocationFields(null);
  setText('reportNearbyStatus', 'Use your location to find nearby vets, shelters, NGOs, clinics, and hospitals.');

  window.useReportCurrentLocation = () => useCurrentLocation({ searchAfter: false });
  window.autoFillReportLocation = () => useCurrentLocation({ searchAfter: false });
  window.detectLocationAndFetchLive = () => useCurrentLocation({ searchAfter: true, forceSearch: true });
  window.findReportNearbyHelp = (type = state.selectedHelpType) => findNearbyHelp(type, { force: true });
  window.findNearbyHelpByType = (type, button) => {
    state.selectedHelpType = type || 'all';
    setActiveButton('.help-filter-btn', button);
    setActiveButton('.report-help-filter', button);
    return findNearbyHelp(state.selectedHelpType, { force: true });
  };
  window.filterHelpType = (type, button) => {
    state.selectedHelpType = type || 'all';
    setActiveButton('.help-filter-btn', button);
    if (state.location) return findNearbyHelp(state.selectedHelpType, { force: true });
    setText('reportNearbyStatus', 'Use your current location to search this category.');
    return [];
  };
  window.filterAnimal = (animal, button) => {
    state.selectedAnimalType = animal || 'all';
    setActiveButton('#animalSelector .animal-btn', button);
    if (!state.nearbyResults.length) {
      setText('reportNearbyStatus', 'Use your current location to refresh nearby help.');
      return [];
    }
    renderNearbyResults();
    return state.nearbyResults;
  };
  window.onRadiusChange = () => {
    state.radius = getRadius();
    if (state.location) return findNearbyHelp(state.selectedHelpType, { force: true });
    setText('reportNearbyStatus', `Radius set to ${formatRadius(state.radius)}. Use your location to search.`);
    return [];
  };
  window.stopLocationWatch = () => {
    toast('ResQtail only gets your location after you click a location button.');
  };
  window.submitReport = submitReport;
  window.handlePhotoUpload = handlePhotoUpload;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReportAnimalFlow, { once: true });
} else {
  initReportAnimalFlow();
}
