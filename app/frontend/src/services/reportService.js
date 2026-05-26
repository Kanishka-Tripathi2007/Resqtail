export function buildAnimalReport({
  animalType,
  condition,
  description,
  photoUrl = null,
  location,
  address,
}) {
  return {
    animalType,
    condition,
    description,
    photoUrl,
    location: {
      lat: Number(location.lat),
      lon: Number(location.lon),
      accuracy: Number(location.accuracy),
    },
    address: address || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export async function submitAnimalReport({
  report,
  photoFile,
  reporterName = '',
  reporterEmail = '',
  phone = '',
}) {
  const form = new FormData();

  form.append('animalType', report.animalType);
  form.append('animal', report.animalType);
  form.append('condition', report.condition);
  form.append('description', report.description || '');
  form.append('address', report.address || '');
  form.append('location', report.address || `${report.location.lat}, ${report.location.lon}`);
  form.append('latitude', String(report.location.lat));
  form.append('longitude', String(report.location.lon));
  form.append('accuracy', String(report.location.accuracy));
  form.append('status', report.status);
  form.append('createdAt', report.createdAt);
  form.append('phone', phone);

  if (reporterName) form.append('reporterName', reporterName);
  if (reporterEmail) form.append('reporterEmail', reporterEmail);
  if (photoFile) form.append('photo', photoFile);

  const response = await fetch('/api/reports', {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || body.message || 'Report could not be submitted.');
  }

  return response.json();
}

