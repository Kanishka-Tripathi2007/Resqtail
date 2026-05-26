const DEFAULT_LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

function makeLocationError(code, message, originalError = null) {
  const error = new Error(message);
  error.code = code;
  error.originalError = originalError;
  return error;
}

function normalizeGeolocationError(error) {
  if (!error) {
    return makeLocationError('unknown', 'Location could not be detected.');
  }

  switch (error.code) {
    case error.PERMISSION_DENIED:
      return makeLocationError('permission-denied', 'Location permission denied.', error);
    case error.POSITION_UNAVAILABLE:
      return makeLocationError('location-unavailable', 'Location unavailable. Please try again.', error);
    case error.TIMEOUT:
      return makeLocationError('timeout', 'Location request timed out. Please try again.', error);
    default:
      return makeLocationError('unknown', 'Location could not be detected.', error);
  }
}

export async function getUserLocation(options = {}) {
  if (!('geolocation' in navigator)) {
    throw makeLocationError(
      'unsupported',
      'Your browser does not support geolocation.'
    );
  }

  if (window.isSecureContext === false) {
    throw makeLocationError(
      'insecure-context',
      'Location needs a secure page. Open ResQtail from http://localhost, not a file path or LAN IP.'
    );
  }

  const locationOptions = { ...DEFAULT_LOCATION_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp || Date.now(),
        });
      },
      (error) => reject(normalizeGeolocationError(error)),
      locationOptions
    );
  });
}
