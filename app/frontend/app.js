
// ── DATA ──────────────────────────────────────────────

let PLACES = [
  { name: "Go Nirvana Foundation", type: "ngo", dist: "Patrakar Colony, Jaipur", timings: "8AM – 8PM | 24×7 Emergency", serves: ["dog", "cat", "cow", "bird", "monkey", "other"], icon: "❤️", phone: "+917851032328", mapsLink: "https://www.openstreetmap.org/search?query=Go%20Nirvana%20Foundation%20Patrakar%20Colony%20Jaipur", area: "Jaipur city", emergency: true, services: "Emergency Treatment, Vaccination, Sterilization, Surgery, Shelter", acceptsStreet: true, acceptsDonations: true },
  { name: "Jaipur Animal Welfare Association", type: "ngo", dist: "Jiloi Village, Kalwar Road, Jaipur", timings: "10AM – 6PM", serves: ["dog", "cat", "other"], icon: "❤️", phone: "9983904242", mapsLink: "https://share.google/mkFvx5NJgaN42b9zW", area: "Jaipur & Nearby Villages", emergency: false, services: "Injury Care, Vaccination, Sterilization, Adoption", acceptsStreet: false, acceptsDonations: true },
  { name: "Dr. Sharma's 24x7 Animal Clinic", type: "vet", dist: "0.8 km", timings: "Open 24 hours", serves: ["dog", "cat", "bird", "other"], icon: "🏥" },
  { name: "PetCare Veterinary Hospital", type: "vet", dist: "1.2 km", timings: "8AM – 10PM", serves: ["dog", "cat", "cow"], icon: "🏥" },
  { name: "Green Pastures Animal Shelter", type: "shelter", dist: "2.1 km", timings: "9AM – 6PM", serves: ["dog", "cat", "cow", "other"], icon: "🏠" },
  { name: "Friendicoes Animal Rescue NGO", type: "ngo", dist: "1.5 km", timings: "24x7 Helpline", serves: ["dog", "cat", "bird", "monkey", "other"], icon: "❤️" },
  { name: "City Animal Ambulance Service", type: "ambulance", dist: "On call", timings: "24x7 Emergency", serves: ["dog", "cat", "cow", "bird", "other"], icon: "🚑" },
  { name: "Bird Sanctuary & Care Centre", type: "vet", dist: "3.4 km", timings: "8AM – 8PM", serves: ["bird", "other"], icon: "🏥" },
  { name: "Gau Seva Samiti Cow Shelter", type: "shelter", dist: "4.0 km", timings: "Open 24 hours", serves: ["cow"], icon: "🏠" },
  { name: "Animal Welfare NGO India", type: "ngo", dist: "2.8 km", timings: "9AM – 9PM", serves: ["dog", "cat", "cow", "bird", "monkey", "other"], icon: "❤️" },
];

const BADGE = { vet: ["badge-vet", "🩺 Veterinary"], shelter: ["badge-shelter", "🏠 Shelter"], ngo: ["badge-ngo", "❤️ NGO"], ambulance: ["badge-ambulance", "🚑 Ambulance"] };

const FIRSTAID_DATA = [
  { title: "Bleeding", icon: "🩸", color: "#C62828", steps: ["Stay calm and approach gently to avoid startling the animal", "Apply gentle pressure using a clean cloth or bandage", "Keep the animal still and warm — avoid unnecessary movement", "Do NOT remove the cloth; add more on top if soaking through", "Call a vet immediately — bleeding wounds need professional care"] },
  { title: "Fracture / Broken Bone", icon: "🦴", color: "#5C3D1E", steps: ["Do NOT attempt to set or splint the bone yourself", "Support the animal's full body weight when moving", "Use a firm flat surface (cardboard) as a stretcher", "Cover with a blanket to reduce shock and keep warm", "Rush to vet immediately — fractures require X-rays and surgery"] },
  { title: "Heat Stroke", icon: "☀️", color: "#E65100", steps: ["Move the animal to shade or cool area immediately", "Pour cool (not cold/ice) water gently over the body", "Offer small sips of water if the animal is conscious", "Fan the animal gently while getting it to cool down", "Call a vet — heat stroke can be fatal if not treated quickly"] },
  { title: "Dehydration", icon: "💧", color: "#1565C0", steps: ["Offer fresh clean water in a shallow bowl immediately", "For severe cases, do NOT force water — it may cause choking", "Check for sunken eyes, dry gums — signs of severe dehydration", "Provide shade and a cool resting spot", "Contact a vet if the animal cannot drink or is unconscious"] },
  { title: "Burns", icon: "🔥", color: "#BF360C", steps: ["Flush with cool (not cold) running water for 10–15 minutes", "Do NOT apply butter, toothpaste, or any home remedy", "Cover loosely with a clean wet cloth", "Avoid touching the burned area directly", "Take to vet immediately — burns get infected very quickly"] },
  { title: "Poisoning", icon: "☠️", color: "#4A148C", steps: ["Do NOT induce vomiting unless specifically told by vet", "Note what the animal may have eaten / swallowed", "Keep the animal calm and restrict movement", "Call animal poison helpline or vet immediately", "Bring a sample or photo of suspected poison to the vet"], warning: "Never give home remedies for poisoning — it can be fatal. Call vet first." },
];

const FEEDING_DATA = {
  dog: {
    good: [{ icon: "🍚", name: "Plain boiled rice" }, { icon: "🍗", name: "Boiled chicken (no bones)" }, { icon: "🥕", name: "Cooked vegetables" }, { icon: "🥛", name: "Fresh water always" }, { icon: "🍞", name: "Plain biscuits" }],
    bad: [{ icon: "🧅", name: "Onion & garlic — toxic to dogs" }, { icon: "🍫", name: "Chocolate — can be fatal" }, { icon: "🍇", name: "Grapes & raisins" }, { icon: "🥑", name: "Avocado" }, { icon: "🍬", name: "Anything with xylitol" }],
    seasons: [{ s: "☀️ Summer", t: "Keep multiple water bowls in shade. Avoid feeding midday heat." }, { s: "🌧️ Monsoon", t: "Dry food is better. Check for skin infections from wet fur." }, { s: "❄️ Winter", t: "Increase food quantity. Provide warm shelter material." }]
  },
  cat: {
    good: [{ icon: "🐟", name: "Cooked fish (boneless)" }, { icon: "🍗", name: "Boiled chicken" }, { icon: "🥛", name: "Small amounts of milk" }, { icon: "💧", name: "Fresh water daily" }, { icon: "🥩", name: "Cooked lean meat" }],
    bad: [{ icon: "🧅", name: "Onion & garlic" }, { icon: "🍫", name: "Chocolate" }, { icon: "🥑", name: "Avocado" }, { icon: "🍞", name: "Raw dough" }, { icon: "🍷", name: "Alcohol — extremely toxic" }],
    seasons: [{ s: "☀️ Summer", t: "Cats dehydrate fast. Extra water sources are critical." }, { s: "🌧️ Monsoon", t: "Keep cats dry. Fungal infections are common in wet season." }, { s: "❄️ Winter", t: "Provide cardboard boxes for insulation. Feed slightly more." }]
  },
  cow: {
    good: [{ icon: "🌾", name: "Dry grass & hay" }, { icon: "🫘", name: "Wheat bran" }, { icon: "🌽", name: "Green fodder" }, { icon: "💧", name: "Clean water — 40-60L daily" }, { icon: "🧂", name: "Mineral blocks" }],
    bad: [{ icon: "🧱", name: "Polythene bags — kills cows" }, { icon: "🌶️", name: "Spicy or salted food" }, { icon: "🍫", name: "Sweets & candy" }, { icon: "🍞", name: "Maida products in excess" }, { icon: "🥬", name: "Wilted or mouldy leaves" }],
    seasons: [{ s: "☀️ Summer", t: "Multiple water points. Keep them in shade between 11AM–4PM." }, { s: "🌧️ Monsoon", t: "Watch for foot-and-mouth. Keep hooves dry." }, { s: "❄️ Winter", t: "Extra fodder. Protect from cold winds with shelter." }]
  },
  bird: {
    good: [{ icon: "🌾", name: "Millets & seeds" }, { icon: "🍚", name: "Plain cooked rice" }, { icon: "🍎", name: "Small fruit pieces" }, { icon: "💧", name: "Fresh shallow water daily" }, { icon: "🫘", name: "Lentils (cooked soft)" }],
    bad: [{ icon: "🍫", name: "Chocolate & caffeine" }, { icon: "🧅", name: "Onion & garlic" }, { icon: "🍬", name: "Sugary foods" }, { icon: "🥑", name: "Avocado — toxic to birds" }, { icon: "🧂", name: "Salty snacks" }],
    seasons: [{ s: "☀️ Summer", t: "Place shallow water bowls on rooftops and balconies." }, { s: "🌧️ Monsoon", t: "Covered feeding spots keep food dry." }, { s: "❄️ Winter", t: "Sunflower seeds are great high-energy winter food." }]
  },
  monkey: {
    good: [{ icon: "🍌", name: "Bananas" }, { icon: "🍎", name: "Fruits (no citrus excess)" }, { icon: "🥜", name: "Peanuts (unsalted)" }, { icon: "💧", name: "Clean water" }, { icon: "🌾", name: "Grains & seeds" }],
    bad: [{ icon: "🍫", name: "Chocolate" }, { icon: "🧂", name: "Salted / processed food" }, { icon: "🧅", name: "Onion & garlic" }, { icon: "🍬", name: "Candy or sugary items" }, { icon: "🥤", name: "Cold drinks" }],
    seasons: [{ s: "☀️ Summer", t: "Water is priority. Monkeys can become aggressive if dehydrated." }, { s: "🌧️ Monsoon", t: "Keep a safe distance. Wet monkeys can be unpredictable." }, { s: "❄️ Winter", t: "Extra fruits for energy. Don't feed near highways." }]
  }
};

const ADOPT_ANIMALS = [
  { emoji: "🐶", name: "Bruno", type: "Male Dog, ~2 years", shelter: "Green Pastures Shelter", info: "Vaccinated, playful, house-trained. Good with children." },
  { emoji: "🐱", name: "Meow", type: "Female Cat, ~1 year", shelter: "City Animal Shelter", info: "Gentle, indoor, neutered. Loves cuddles." },
  { emoji: "🐶", name: "Sheru", type: "Male Dog, ~4 years", shelter: "Friendicoes NGO", info: "Calm, loyal, great guard dog. Fully vaccinated." },
  { emoji: "🐱", name: "Kali", type: "Female Cat, ~3 years", shelter: "PFA Shelter Delhi", info: "Independent, quiet. Perfect for small apartments." },
];

// ── RENDER FUNCTIONS ────────────────────────────────

function renderNearby(filter = 'all') {
  const grid = document.getElementById('nearbyGrid');
  const filtered = filter === 'all' ? PLACES : PLACES.filter(p => p.serves.includes(filter));
  grid.innerHTML = filtered.map(p => {
    const [bc, bl] = BADGE[p.type];
    const phone = p.phone || '1800111565';
    const mapsAction = p.mapsLink ? `window.open('${p.mapsLink}','_blank')` : `openMaps('${p.name}')`;
    const emergencyBadge = p.emergency ? `<span style="display:inline-flex;align-items:center;gap:4px;background:#FCE4EC;color:#C62828;font-size:0.68rem;font-weight:700;padding:2px 8px;border-radius:8px;margin-left:6px;">🚨 24×7 Emergency</span>` : '';
    const servicesTip = p.services ? `<div class="serves" style="margin-bottom:8px">🩺 ${p.services}</div>` : '';
    const locLine = p.area ? `<div class="dist">🗺️ Serves: ${p.area}</div><div class="dist">📍 ${p.dist}</div>` : `<div class="dist">📍 ${p.dist}</div>`;
    const donationBadge = p.acceptsDonations ? `<div style="font-size:0.75rem;color:var(--sage);font-weight:600;margin-top:4px;">🎁 Accepts Donations &amp; Volunteers</div>` : '';
    return `<div class="place-card">
      <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-bottom:14px"><span class="badge ${bc}" style="margin-bottom:0">${bl}</span>${emergencyBadge}</div>
      <h4>${p.icon} ${p.name}</h4>
      ${locLine}
      <div class="timings">⏰ ${p.timings}</div>
      ${servicesTip}
      <div class="serves">🐾 ${p.serves.map(a => ({ dog: '🐶', cat: '🐱', cow: '🐮', bird: '🐦', monkey: '🐒', other: '🐒' }[a] || a)).join(' ')}</div>
      ${donationBadge}
      <div class="place-actions" style="margin-top:12px">
        <button class="btn-call" onclick="callNumber('${phone.replace(/[^0-9]/g, '')}')">📞 Call</button>
        <button class="btn-nav" onclick="${mapsAction}">🗺️ Navigate</button>
      </div>
    </div>`;
  }).join('');
}

function renderFirstAid() {
  const grid = document.getElementById('firstaidGrid');
  const colors = { 0: '#C62828', 1: '#5C3D1E', 2: '#E65100', 3: '#1565C0', 4: '#BF360C', 5: '#4A148C' };
  grid.innerHTML = FIRSTAID_DATA.map((item, i) => `
    <div class="aid-card">
      <div class="aid-header" style="background:linear-gradient(135deg,${colors[i]}18,${colors[i]}08)">
        <div class="aid-icon">${item.icon}</div>
        <div>
          <h4>${item.title}</h4>
          <p>Step-by-step emergency guide</p>
        </div>
      </div>
      <div class="aid-body">
        <ul class="aid-steps">
          ${item.steps.map((s, j) => `<li><div class="step-num">${j + 1}</div><span>${s}</span></li>`).join('')}
        </ul>
        ${item.warning ? `<div class="aid-warning">⚠️ ${item.warning}</div>` : ''}
      </div>
    </div>`).join('');
}

function renderFeeding(animal) {
  const d = FEEDING_DATA[animal];
  if (!d) return;
  document.getElementById('feedingDisplay').innerHTML = `
    <div class="feeding-content active">
      <div class="feed-col good">
        <h4 style="color:var(--sage)">✅ What to Feed</h4>
        <div class="feed-items">${d.good.map(f => `<div class="feed-item ok"><span class="fi-icon">${f.icon}</span>${f.name}</div>`).join('')}</div>
      </div>
      <div class="feed-col bad">
        <h4 style="color:var(--coral)">❌ What NOT to Feed</h4>
        <div class="feed-items">${d.bad.map(f => `<div class="feed-item no"><span class="fi-icon">${f.icon}</span>${f.name}</div>`).join('')}</div>
      </div>
      <div class="feed-seasonal">
        <h4>🌍 Seasonal Care Tips</h4>
        <div class="seasons">${d.seasons.map(s => `<div class="season-card"><h5>${s.s}</h5><p>${s.t}</p></div>`).join('')}</div>
      </div>
    </div>`;
}

function renderAdoption(speciesFilter, locationFilter) {
  // Fetch live listings from backend with optional filters
  const grid = document.getElementById('adoptionGrid');
  grid.innerHTML = `<div style="text-align:center;padding:24px;color:var(--sky);font-weight:700">🔄 Loading adoption listings...</div>`;
  let url = '/api/listings?';
  if (speciesFilter) url += 'species=' + encodeURIComponent(speciesFilter) + '&';
  if (locationFilter) url += 'location=' + encodeURIComponent(locationFilter) + '&';
  fetch(url).then(r => r.json()).then(listings => {
    if (!listings || listings.length === 0) {
      grid.innerHTML = '<div style="text-align:center;padding:20px;color:var(--coral);font-weight:700">No listings yet — be the first to add one!</div>';
      return;
    }
    grid.innerHTML = listings.map(l => {
      const id = l._id || l.id || '';
      const vaccBadge = l.vaccination && l.vaccination !== 'Unknown' ? `<span style="display:inline-block;font-size:0.72rem;padding:2px 8px;border-radius:8px;background:${l.vaccination === 'Vaccinated' ? '#E8F5E9;color:#2E7D32' : '#FFF3E0;color:#E65100'};font-weight:600;margin-right:4px;">${l.vaccination === 'Vaccinated' ? '💉 Vaccinated' : '⚠️ ' + l.vaccination}</span>` : '';
      const locBadge = l.location ? `<span style="font-size:0.75rem;color:var(--sky);">📍 ${l.location}</span>` : '';
      const breedLine = l.breed ? ` · ${l.breed}` : '';
      return `
        <div class="adopt-card">
          <div class="adopt-img">${l.photos && l.photos[0] ? `<img data-src="${l.photos[0]}" alt="${l.name}" loading="lazy" class="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/>` : '🐾'}</div>
            <div class="adopt-body">
            <h4>${l.name}</h4>
            <div class="meta">${l.type || ''}${breedLine} &nbsp;|&nbsp; ${l.age || ''} &nbsp;|&nbsp; ${l.sex || ''}</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">${vaccBadge}${locBadge}</div>
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;line-height:1.4">${l.description || ''}</p>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <button class="adopt-btn" onclick="openAdoptModalContact('${encodeURIComponent(l.contact||'')}', '${encodeURIComponent(l.name||'')}')">📞 Contact</button>
              <button class="adopt-btn" style="background:var(--sage);color:white;" onclick="openInquiryModal('${id}', '${encodeURIComponent(l.name||'')}')">❤️ Inquire</button>
            </div>
          </div>
        </div>`;
    }).join('');
    try { setupLazyImages(grid); } catch (e) { /* ignore */ }
  }).catch(e=>{ console.error('listings fetch', e); grid.innerHTML = '<div style="text-align:center;padding:20px;color:var(--coral);font-weight:700">Unable to load listings</div>'; });
}

function openAdoptModalContact(contactEnc, nameEnc) {
  const contact = decodeURIComponent(contactEnc || '');
  const name = decodeURIComponent(nameEnc || '');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modal = document.getElementById('modal');
  modalTitle.textContent = `Contact for ${name || 'this pet'}`;
  modalBody.innerHTML = `<p style="white-space:pre-line;color:var(--text-muted)">${contact || 'Contact details not provided'}</p><p style="margin-top:8px"><button onclick="copyToClipboard('${contact.replace(/'/g,"\\'")}')">Copy contact</button></p>`;
  modal.classList.add('active');
}

function copyToClipboard(txt) { navigator.clipboard.writeText(txt).then(()=>showToast('✅ Contact copied')); }

function openListingModal() { const m = document.getElementById('listingModal'); if (m) m.classList.add('active'); }
function closeListingModal() { const m = document.getElementById('listingModal'); if (m) m.classList.remove('active'); }

async function submitListing() {
  const name = document.getElementById('listingName').value.trim();
  if (!name) return showToast('Enter a pet name');
  const form = new FormData();
  form.append('name', name);
  form.append('type', document.getElementById('listingType').value.trim());
  form.append('breed', (document.getElementById('listingBreed')?.value || '').trim());
  form.append('age', document.getElementById('listingAge').value.trim());
  form.append('sex', document.getElementById('listingSex').value.trim());
  form.append('vaccination', (document.getElementById('listingVaccination')?.value || 'Unknown').trim());
  form.append('shelter', document.getElementById('listingShelter').value.trim());
  form.append('location', (document.getElementById('listingLocation')?.value || '').trim());
  form.append('listerType', (document.getElementById('listingListerType')?.value || 'Individual').trim());
  form.append('description', document.getElementById('listingDesc').value.trim());
  form.append('contact', document.getElementById('listingContact').value.trim());
  const files = document.getElementById('listingPhotos').files;
  for (let i=0;i<files.length && i<6;i++) form.append('photos', files[i]);
  try {
    const res = await fetch('/api/listings', { method: 'POST', body: form });
    if (!res.ok) { const err = await res.json().catch(()=>({})); return showToast(err.error || 'Listing failed'); }
    showToast('✅ Listing published');
    closeListingModal();
    renderAdoption();
  } catch (e) { console.error('submitListing', e); showToast('Unable to publish listing'); }
}

// Adoption inquiry modal
function openInquiryModal(listingId, petName) {
  document.getElementById('inquiryListingId').value = listingId;
  document.getElementById('inquiryPetName').textContent = '❤️ Inquiring about: ' + decodeURIComponent(petName);
  document.getElementById('inquiryModal').classList.add('active');
}
function closeInquiryModal() { document.getElementById('inquiryModal').classList.remove('active'); }

async function submitInquiry() {
  const listingId = document.getElementById('inquiryListingId').value;
  const name = document.getElementById('inquiryName').value.trim();
  const email = document.getElementById('inquiryEmail').value.trim();
  const phone = document.getElementById('inquiryPhone').value.trim();
  const message = document.getElementById('inquiryMessage').value.trim();
  if (!name || !email) return showToast('⚠️ Name and email are required');
  try {
    const res = await fetch('/api/listings/inquiry', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, name, email, phone, message })
    });
    const data = await res.json();
    if (res.ok) { showToast('✅ ' + (data.message || 'Inquiry sent!')); closeInquiryModal(); }
    else { showToast(data.error || 'Failed to send inquiry'); }
  } catch (e) { showToast('Unable to send inquiry'); }
}

// Adoption filter
function filterAdoptions() {
  const species = (document.getElementById('adoptFilterSpecies')?.value || '').trim();
  const loc = (document.getElementById('adoptFilterLocation')?.value || '').trim();
  renderAdoption(species, loc);
}

function setDonationAmount(amt) {
  const el = document.getElementById('donationAmount');
  if (el) el.value = amt;
}

const HERO_ANIMAL_SOUND_PATHS = {
  dog: 'sounds/dog.ogg',
  cat: 'sounds/cat.ogg',
  cow: 'sounds/cow.mp3',
  bird: 'sounds/bird.mp3',
  monkey: 'sounds/monkey.mp3'
};

const HERO_ANIMAL_SOUND_MAX_MS = {
  bird: 3000,
  monkey: 4000
};

const heroAnimalSoundAvailability = {};
let activeAnimalSound = null;
let activeAnimalSoundTimeout = null;
let animalAudioContext = null;

function stopActiveAnimalSound() {
  clearTimeout(activeAnimalSoundTimeout);
  activeAnimalSoundTimeout = null;

  if (!activeAnimalSound) return;

  if (typeof activeAnimalSound.pause === 'function') {
    activeAnimalSound.pause();
    try {
      activeAnimalSound.currentTime = 0;
    } catch (e) {
      // Some browsers may reject currentTime updates before media metadata loads.
    }
  }

  if (typeof activeAnimalSound.stop === 'function') {
    activeAnimalSound.stop();
  }

  activeAnimalSound = null;
}

function getAnimalAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!animalAudioContext) animalAudioContext = new AudioContextClass();
  if (animalAudioContext.state === 'suspended') {
    animalAudioContext.resume().catch(() => {});
  }
  return animalAudioContext;
}

function scheduleAnimalTone(controller, options) {
  const ctx = controller.context;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = options.start;
  const end = start + options.duration;

  oscillator.type = options.type || 'sine';
  oscillator.frequency.setValueAtTime(options.from, start);
  if (options.to && options.to !== options.from) {
    oscillator.frequency.exponentialRampToValueAtTime(options.to, end);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(options.volume || 0.2, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(end + 0.03);

  controller.nodes.push(oscillator, gain);
}

function playSyntheticAnimalSound(animal) {
  const ctx = getAnimalAudioContext();
  if (!ctx) return;

  stopActiveAnimalSound();

  const start = ctx.currentTime + 0.02;
  const controller = {
    context: ctx,
    nodes: [],
    timeoutId: null,
    stop() {
      clearTimeout(this.timeoutId);
      this.nodes.forEach(node => {
        try {
          if (typeof node.stop === 'function') node.stop(0);
        } catch (e) {}
        try {
          node.disconnect();
        } catch (e) {}
      });
    }
  };

  const patterns = {
    dog: [
      { start: 0, duration: 0.12, from: 180, to: 90, type: 'square', volume: 0.24 },
      { start: 0.16, duration: 0.14, from: 150, to: 75, type: 'square', volume: 0.22 }
    ],
    cat: [
      { start: 0, duration: 0.45, from: 620, to: 880, type: 'sawtooth', volume: 0.14 },
      { start: 0.22, duration: 0.32, from: 880, to: 420, type: 'sine', volume: 0.12 }
    ],
    cow: [
      { start: 0, duration: 0.75, from: 115, to: 95, type: 'sawtooth', volume: 0.2 },
      { start: 0.08, duration: 0.68, from: 70, to: 60, type: 'sine', volume: 0.16 }
    ],
    bird: [
      { start: 0, duration: 0.08, from: 1400, to: 2300, type: 'sine', volume: 0.14 },
      { start: 0.11, duration: 0.08, from: 1700, to: 2700, type: 'sine', volume: 0.13 },
      { start: 0.22, duration: 0.09, from: 1200, to: 2100, type: 'sine', volume: 0.12 }
    ],
    monkey: [
      { start: 0, duration: 0.09, from: 520, to: 920, type: 'square', volume: 0.12 },
      { start: 0.12, duration: 0.08, from: 820, to: 560, type: 'square', volume: 0.12 },
      { start: 0.23, duration: 0.1, from: 600, to: 1050, type: 'square', volume: 0.11 },
      { start: 0.36, duration: 0.08, from: 900, to: 650, type: 'square', volume: 0.1 }
    ]
  };

  const pattern = patterns[animal] || patterns.dog;
  pattern.forEach(tone => {
    scheduleAnimalTone(controller, {
      ...tone,
      start: start + tone.start
    });
  });

  const length = Math.max(...pattern.map(tone => tone.start + tone.duration));
  controller.timeoutId = setTimeout(() => {
    if (activeAnimalSound === controller) activeAnimalSound = null;
  }, (length * 1000) + 150);

  activeAnimalSound = controller;
}

function playHeroAnimalSound(animal) {
  const soundPath = HERO_ANIMAL_SOUND_PATHS[animal];
  if (!soundPath) return;

  if (heroAnimalSoundAvailability[animal] === false) {
    playSyntheticAnimalSound(animal);
    return;
  }

  stopActiveAnimalSound();
  getAnimalAudioContext();

  const audio = new Audio(soundPath);
  activeAnimalSound = audio;
  let fallbackStarted = false;

  function playFallback() {
    if (fallbackStarted || activeAnimalSound !== audio) return;
    fallbackStarted = true;
    heroAnimalSoundAvailability[animal] = false;
    console.warn(`Animal sound file could not be played, using fallback: ${soundPath}`);
    playSyntheticAnimalSound(animal);
  }

  audio.addEventListener('playing', () => {
    heroAnimalSoundAvailability[animal] = true;
    const maxDuration = HERO_ANIMAL_SOUND_MAX_MS[animal];
    if (maxDuration) {
      clearTimeout(activeAnimalSoundTimeout);
      activeAnimalSoundTimeout = setTimeout(() => {
        if (activeAnimalSound === audio) stopActiveAnimalSound();
      }, maxDuration);
    }
  }, { once: true });

  audio.addEventListener('ended', () => {
    clearTimeout(activeAnimalSoundTimeout);
    activeAnimalSoundTimeout = null;
    if (activeAnimalSound === audio) activeAnimalSound = null;
  }, { once: true });

  audio.addEventListener('error', () => {
    playFallback();
  }, { once: true });

  const playRequest = audio.play();
  if (playRequest && typeof playRequest.catch === 'function') {
    playRequest.catch(() => playFallback());
  }
}

function setupHeroAnimalSounds() {
  if (window.location.protocol !== 'file:') {
    Object.entries(HERO_ANIMAL_SOUND_PATHS).forEach(([animal, soundPath]) => {
      fetch(soundPath, { method: 'HEAD', cache: 'no-store' })
        .then(response => {
          heroAnimalSoundAvailability[animal] = response.ok;
        })
        .catch(() => {
          heroAnimalSoundAvailability[animal] = false;
        });
    });
  }

  document.querySelectorAll('.hero-animal-btn[data-animal-sound]').forEach(button => {
    button.addEventListener('click', () => playHeroAnimalSound(button.dataset.animalSound));
  });
}

// ── UI INTERACTIONS ────────────────────────────────

function filterAnimal(animal, btn) {
  document.querySelectorAll('#animalSelector .animal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderNearby(animal);
}

function switchRescueTab(id, btn) {
  document.querySelectorAll('.rescue-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.rescue-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(id).classList.add('active');
}

function switchFeed(animal, btn) {
  document.querySelectorAll('.feeding-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFeeding(animal);
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ── DONATE TABS ────────────────────────────────────

function switchDonateTab(tab, btn) {
  document.querySelectorAll('.donate-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.donate-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panelId = tab === 'volunteer' ? 'donate-volunteer' : `donate-${tab}`;
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ── DONATE LIVE LOCATION ───────────────────────────

function scanNearbyDonation(mode) {
  const btnId = mode === 'items' ? 'itemsLocBtn' : 'volLocBtn';
  const resultId = mode === 'items' ? 'itemsLiveResults' : 'volLiveResults';
  const btn = document.getElementById(btnId);
  const resultsEl = document.getElementById(resultId);

  if (!navigator.geolocation) {
    showToast('⚠️ Geolocation not supported.');
    return;
  }

  btn.textContent = '⏳ Detecting location...';
  btn.disabled = true;
  resultsEl.innerHTML = '';

  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude: lat, longitude: lng } = pos.coords;
    btn.textContent = '📡 Fetching nearby places...';
    const label = mode === 'items' ? 'Drop-off' : 'Volunteer';
    const mapsSearch = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`animal shelter veterinary near ${lat},${lng}`)}`;

    const query = `[out:json];(
      node["amenity"="veterinary"](around:20000,${lat},${lng});
      node["amenity"="animal_shelter"](around:20000,${lat},${lng});
    );out 12;`;

    // Use GET — avoids CORS preflight that blocks file:// requests
    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      const data = await res.json();
      const places = data.elements.filter(e => e.tags && e.tags.name);

      btn.textContent = `✅ ${places.length} place(s) found near you`;
      btn.disabled = false;

      if (places.length === 0) {
        resultsEl.innerHTML = buildFallbackCard(mapsSearch, label);
        return;
      }

      resultsEl.innerHTML = `
        <div class="donate-live-header">🛰️ ${places.length} Live ${label} Points Near You (within 20km)</div>
        <div class="donate-live-grid">
          ${places.map(e => {
        const name = e.tags.name;
        const type = e.tags.amenity === 'veterinary' ? '🏥 Vet Clinic' : '🏠 Animal Shelter';
        const phone = e.tags.phone || e.tags['contact:phone'] || null;
        const hrs = e.tags.opening_hours || null;
        const mapsUrl = `https://www.openstreetmap.org/?mlat=${e.lat}&mlon=${e.lon}#map=17/${e.lat}/${e.lon}`;
        const actionLbl = mode === 'items' ? '🗺️ Get Directions' : '📍 Visit to Volunteer';
        return `
              <div class="donate-live-card">
                <div class="donate-live-card-top">
                  <span class="donate-live-badge">${type}</span>
                  <span class="donate-live-badge live">🛰️ Live</span>
                </div>
                <h5>${name}</h5>
                <span>${phone ? '📞 ' + phone : '📞 Number not mapped'}</span>
                ${hrs ? `<span>🕐 ${hrs}</span>` : ''}
                <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
                  <button class="ngo-btn-upi" onclick="window.open('${mapsUrl}','_blank')">${actionLbl}</button>
                  ${phone ? `<button class="ngo-btn-web" onclick="callNumber('${phone.replace(/[^0-9+]/g, '')}')">📞 Call</button>` : ''}
                </div>
              </div>`;
      }).join('')}
        </div>`;

    } catch (err) {
      clearTimeout(timer);
      btn.textContent = '🛰️ Scan My Area';
      btn.disabled = false;
      // Show helpful fallback instead of just a toast
      resultsEl.innerHTML = buildFallbackCard(mapsSearch, label);
    }
  }, () => {
    btn.textContent = '🛰️ Scan My Area';
    btn.disabled = false;
    showToast('⚠️ Location access denied. Please allow location in browser settings.');
  }, { timeout: 12000 });
}

function buildFallbackCard(mapsSearch, label) {
  return `<div class="donate-live-fallback">
    <div>
      <strong>🛰️ Live map data unavailable</strong>
      <p>This can happen when the browser restricts the external data request. Use Google Maps to manually find nearby ${label.toLowerCase()} points — it will use your location automatically.</p>
    </div>
    <a href="${mapsSearch}" target="_blank" class="donate-fallback-btn">🗺️ Open Google Maps Nearby Search</a>
  </div>`;
}

function openUPIDonate(upiId, name) {
  // On mobile: attempt to open UPI app directly
  const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`;
    return;
  }
  // On desktop: show a copy-able UPI ID dialog
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modal = document.getElementById('modal');
  modalTitle.textContent = `💳 Donate to ${name}`;
  modalBody.innerHTML = `
    <div style="text-align:center; padding: 8px 0;">
      <p style="color:var(--text-muted); margin-bottom:16px; font-size:0.93rem; line-height:1.6;">
        Open your UPI app (GPay, PhonePe, Paytm) and send to the UPI ID below, or scan via the app's QR scanner.
      </p>
      <div style="background:#F5F5F5; border-radius:14px; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; border: 2px solid var(--amber);">
        <span style="font-size:1.1rem; font-weight:800; color:var(--earth); letter-spacing:0.04em;">${upiId}</span>
        <button onclick="navigator.clipboard.writeText('${upiId}').then(()=>showToast('✅ UPI ID copied!'))" style="background:var(--amber); color:var(--earth); border:none; padding:8px 16px; border-radius:10px; font-weight:700; cursor:pointer; font-size:0.85rem;">📋 Copy</button>
      </div>
      <p style="font-size:0.8rem; color:var(--text-muted);">After payment, please share your transaction ID with <strong>${name}</strong> for confirmation.</p>
    </div>`;
  modal.classList.add('active');
}

// ── DONATIONS (Razorpay) ─────────────────────────
function openDonateModal(defaultNgo) {
  const modal = document.getElementById('donationModal');
  if (!modal) return showToast('Donation modal not available');
  if (defaultNgo) {
    const sel = document.getElementById('donationNgo');
    if (sel) sel.value = defaultNgo;
  }
  modal.classList.add('active');
}

function closeDonationModal() {
  const modal = document.getElementById('donationModal');
  if (!modal) return;
  modal.classList.remove('active');
}

async function startDonation() {
  const amountEl = document.getElementById('donationAmount');
  const ngoEl = document.getElementById('donationNgo');
  const name = document.getElementById('donationName').value || '';
  const email = document.getElementById('donationEmail').value || '';
  const phone = document.getElementById('donationPhone').value || '';
  const message = (document.getElementById('donationMessage')?.value || '').trim();
  const amount = parseFloat(amountEl && amountEl.value ? amountEl.value : 0);
  const ngo = ngoEl && ngoEl.value ? ngoEl.value : 'ResQtail General Fund';
  if (!amount || isNaN(amount) || amount < 1) return showToast('Enter a valid amount (min ₹1)');

  try {
    const res = await fetch('/api/donations/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, ngo, name, email, phone })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return showToast(err.error || 'Unable to start donation');
    }
    const data = await res.json();
    const order = data.order;
    const keyId = data.keyId;
    if (!order || !keyId) return showToast('Payment service unavailable');

    if (data.isTestMode) {
      showToast('⚠️ Razorpay not configured. Local demo order created. Set RZP_KEY_ID and RZP_KEY_SECRET to enable live payments.');
      closeDonationModal();
      return;
    }

    if (!window.Razorpay) return showToast('Payment checkout not loaded');

    const options = {
      key: keyId,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'ResQtail Donations',
      description: ngo,
      order_id: order.id,
      handler: async function (resp) {
        showToast('🔄 Verifying payment...');
        try {
          const verifyRes = await fetch('/api/donations/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              name, email, phone, ngo, message, amount: order.amount
            })
          });
          const vr = await verifyRes.json();
          if (verifyRes.ok && vr.success) {
            showToast('🙏 Thank you — donation received!');
            closeDonationModal();
          } else {
            console.error('Verification failed', vr);
            showToast(vr.error || 'Payment verification failed');
          }
        } catch (e) {
          console.error('verify error', e);
          showToast('Verification error — please contact support');
        }
      },
      prefill: { name, email, contact: phone },
      theme: { color: '#F59E0B' }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      console.error('Payment failed', resp);
      showToast('❌ Payment failed or cancelled');
    });
    rzp.open();
  } catch (err) {
    console.error('startDonation error', err);
    showToast('Unable to initiate payment');
  }
}


// ── SOS ───────────────────────────────────────────

function triggerSOS() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      showModal('sos', '', pos.coords.latitude.toFixed(4), pos.coords.longitude.toFixed(4));
    }, () => showModal('sos', '', 'N/A', 'N/A'));
  } else {
    showModal('sos', '', 'N/A', 'N/A');
  }
}

function callNumber(num) {
  showToast('📞 Calling ' + num + '...');
  setTimeout(() => { window.location.href = 'tel:' + num; }, 500);
}

function whatsappShare() {
  const msg = encodeURIComponent("🆘 EMERGENCY: An animal needs help! I am at this location. Please send rescue immediately. #ResQtail");
  window.open('https://wa.me/?text=' + msg, '_blank');
}

function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const url = `https://www.openstreetmap.org/?mlat=${pos.coords.latitude}&mlon=${pos.coords.longitude}#map=17/${pos.coords.latitude}/${pos.coords.longitude}`;
      navigator.clipboard.writeText(url).then(() => showToast('📍 Location copied to clipboard!'));
    }, () => showToast('⚠️ Location access denied'));
  }
}

function openMaps(name) {
  window.open('https://www.openstreetmap.org/search?query=' + encodeURIComponent(name), '_blank');
}

// ── MODAL ─────────────────────────────────────────

const MODALS = {
  sos: (lat, lng) => ({ title: '🆘 SOS Activated!', body: `Your location has been detected (${lat || 'unknown'}, ${lng || 'unknown'}). Emergency alert sent to nearby NGOs and volunteers! Please also call 1962 (Animal Welfare Board) directly. Help is on the way. 🐾` }),
  'donate-money': () => ({ title: '💰 Donate Money', body: 'Support Jaipur NGOs:\n\n• Go Nirvana Foundation\n  📧 contact@gonirvana.org\n  📞 +91 7851-032328\n\n• Jaipur Animal Welfare Association\n  📧 jaipuranimalwelfareassociation@gmail.com\n  📞 9983904242\n\nAccepted: Food, Money, Medicines, Volunteering, Foster Support.\nAll donations are 80G tax-exempt.' }),
  'donate-items': () => ({ title: '🍚 Donate Food & Items', body: 'Useful donations: dog/cat food, rice, biscuits, old blankets, water bowls, medicines, leashes, transport cages.\n\nDrop-off in Jaipur:\n📍 Go Nirvana Foundation\n   Near Alpha Bal Academy, Patrakar Colony\n   📞 +91 7851-032328\n\n📍 Jaipur Animal Welfare Association\n   Jiloi Village, Kalwar Road\n   📞 9983904242' }),
  volunteer: () => ({ title: '🙋 Volunteer with ResQtail', body: 'Ways to volunteer:\n\n• Foster rescued animals at home\n• Join weekend feeding drives\n• Spread awareness on social media\n• Help at adoption camps\n• Contribute your skills (vet, coding, design)\n\nContact in Jaipur:\n📧 Go Nirvana: contact@gonirvana.org\n📧 JAWA: jaipuranimalwelfareassociation@gmail.com' }),
};

function openAdoptModal(name, type, shelter, info) {
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modal = document.getElementById('modal');
  modalTitle.textContent = `❤️ Adopt ${name}`;
  modalBody.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:4rem;margin-bottom:8px;">🐾</div>
      <h4 style="font-size:1.2rem;font-weight:800;color:var(--earth);margin-bottom:4px;">${name}</h4>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:16px;">${type} &nbsp;|&nbsp; 🏠 ${shelter}</p>
      <div style="background:#FFF8F0;border-radius:12px;padding:14px 16px;text-align:left;margin-bottom:16px;font-size:0.86rem;color:var(--earth-mid);line-height:1.6;">
        <strong>📝 About ${name}:</strong><br>${info}
      </div>
      <div style="background:#F0F7FF;border-radius:12px;padding:14px 16px;text-align:left;margin-bottom:20px;font-size:0.84rem;color:#1565C0;line-height:1.65;">
        <strong>📋 Adoption Process:</strong><br>
        1️⃣ Contact the shelter &amp; fill the adoption form<br>
        2️⃣ Schedule a meet-&amp;-greet visit<br>
        3️⃣ Informal home assessment<br>
        4️⃣ Sign adoption agreement (ID &amp; address proof required)<br>
        5️⃣ Take your new family member home! 🐶
      </div>
      <div style="background:#E8F5E9;border-radius:12px;padding:12px;font-size:0.82rem;color:#2E7D32;margin-bottom:16px;">
        🎁 <strong>Adoption is FREE</strong> at all partner shelters. No fees charged.
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="window.open('https://www.openstreetmap.org/search?query=${encodeURIComponent(shelter)}','_blank')" style="flex:1;padding:12px;background:var(--sky);color:white;border:none;border-radius:12px;font-weight:700;font-size:0.9rem;cursor:pointer;">🗺️ Find ${shelter}</button>
        <button onclick="closeModal()" style="flex:1;padding:12px;background:var(--amber);color:var(--earth);border:none;border-radius:12px;font-weight:700;font-size:0.9rem;cursor:pointer;">Got it ✓</button>
      </div>
    </div>`;
  modal.classList.add('active');
}

function showModal(type, name, lat, lng) {
  const m = MODALS[type] ? MODALS[type](name || lat, lng) : null;
  if (!m) return;
  document.getElementById('modalTitle').textContent = m.title;
  // Use innerHTML to support rich content; MODALS data is internal, no XSS risk
  document.getElementById('modalBody').innerHTML = `<p style="white-space:pre-line; color:var(--text-muted); font-size:0.9rem; line-height:1.75;">${m.body}</p>`;
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}
document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ── REPORT ────────────────────────────────────────

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    showToast('📷 Photo uploaded: ' + input.files[0].name);
  }
}

function autoFillReportLocation() {
  const input = document.getElementById('reportLocation');
  if (input.value) return; // Don't overwrite if already filled
  input.placeholder = '⏳ Detecting location...';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      input.value = `📍 GPS: ${lat}, ${lng}`;
      input.placeholder = 'Enter address or click to auto-detect...';
      // Store coords in hidden fields
      const latEl = document.getElementById('reportLat');
      const lngEl = document.getElementById('reportLng');
      if (latEl) latEl.value = lat;
      if (lngEl) lngEl.value = lng;
      showToast('📍 Location detected successfully!');
    }, () => {
      input.placeholder = 'Enter address or click to auto-detect...';
      showToast('⚠️ Location access denied. Please type it manually.');
    });
  } else {
    showToast('⚠️ Geolocation not supported by your browser.');
  }
}

async function submitReport() {
  const animal = document.getElementById('reportAnimal').value;
  const urgency = document.getElementById('reportUrgency').value;
  const location = document.getElementById('reportLocation').value;
  const description = document.getElementById('reportDesc').value;
  const contact = document.getElementById('reportContact').value;
  const reporterName = (document.getElementById('reportName')?.value || '').trim();
  const reporterEmail = (document.getElementById('reportEmail')?.value || '').trim();
  const latitude = (document.getElementById('reportLat')?.value || '').trim();
  const longitude = (document.getElementById('reportLng')?.value || '').trim();

  if (!animal || !urgency || !location) {
    showToast('⚠️ Please fill required fields!');
    return;
  }
  // Build multipart form data to include photo if provided
  const form = new FormData();
  form.append('animal', animal);
  form.append('condition', urgency);
  form.append('location', location);
  form.append('description', description);
  form.append('phone', contact);
  if (latitude) form.append('latitude', latitude);
  if (longitude) form.append('longitude', longitude);
  if (reporterName) form.append('reporterName', reporterName);
  if (reporterEmail) form.append('reporterEmail', reporterEmail);
  const photoInput = document.getElementById('photoUpload');
  if (photoInput && photoInput.files && photoInput.files[0]) {
    form.append('photo', photoInput.files[0]);
  }

  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      body: form
    });
    if (res.ok) {
      showToast('✅ Report submitted to server!');
    } else {
      throw new Error('Server returned ' + res.status);
    }
  } catch (err) {
    // Save basic report locally; image not persisted in this offline fallback
    if (!localStorage.getItem('reports')) localStorage.setItem('reports', JSON.stringify([]));
    const reports = JSON.parse(localStorage.getItem('reports'));
    reports.unshift(Object.assign({}, { animal, condition: urgency, location, description, phone: contact, date: new Date().toISOString() }));
    localStorage.setItem('reports', JSON.stringify(reports));
    showToast('⚠️ Server unavailable — saved locally.');
  }

  document.getElementById('reportAnimal').value = '';
  document.getElementById('reportUrgency').value = '';
  document.getElementById('reportLocation').value = '';
  document.getElementById('reportDesc').value = '';
  document.getElementById('reportContact').value = '';
  if (document.getElementById('reportName')) document.getElementById('reportName').value = '';
  if (document.getElementById('reportEmail')) document.getElementById('reportEmail').value = '';
  if (document.getElementById('reportLat')) document.getElementById('reportLat').value = '';
  if (document.getElementById('reportLng')) document.getElementById('reportLng').value = '';
}

// ── TOAST ─────────────────────────────────────────

/* Multi-instance toast manager
   - Supports multiple independent toasts
   - Adds fade/translate animations via CSS
   - Each toast has its own close button
   - Cleans up event listeners and timeouts to avoid leaks
*/

const ToastManager = (() => {
  const containerId = 'toastContainer';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  let idCounter = 0;

  function create(message, options = {}) {
    const { duration = 2500, type = 'success' } = options;
    const id = ++idCounter;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.dataset.id = id;

    const typeSpan = document.createElement('span');
    typeSpan.className = 'toast-type';
    typeSpan.textContent = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '';

    const msgSpan = document.createElement('span');
    msgSpan.className = 'toast-message';
    msgSpan.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.innerHTML = '✕';

    let dismissed = false;
    let removerTimeout;

    function cleanup() {
      if (removerTimeout) { clearTimeout(removerTimeout); removerTimeout = null; }
      closeBtn.removeEventListener('click', onClose);
    }

    function removeAnimated() {
      if (dismissed) return;
      dismissed = true;
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        cleanup();
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }

    function onClose(e) {
      e.stopPropagation();
      removeAnimated();
    }

    closeBtn.addEventListener('click', onClose);

    toast.appendChild(typeSpan);
    toast.appendChild(msgSpan);
    toast.appendChild(closeBtn);

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    removerTimeout = setTimeout(() => removeAnimated(), duration);

    return { id, dismiss: removeAnimated };
  }

  function clearAll() {
    const toasts = Array.from(container.querySelectorAll('.toast'));
    toasts.forEach(t => {
      t.classList.remove('show');
      t.classList.add('hide');
      setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    });
  }

  return { create, clearAll };
})();

function showToast(msg, opts) {
  ToastManager.create(msg, opts);
}

// ── CHATBOT ───────────────────────────────────────

function toggleChat() {
  const w = document.getElementById('chatWindow');
  w.classList.toggle('open');
}

// Close chat when clicking outside
document.addEventListener('click', function (e) {
  const w = document.getElementById('chatWindow');
  const trigger = document.querySelector('.chat-trigger');
  if (w.classList.contains('open') && !w.contains(e.target) && !trigger.contains(e.target)) {
    w.classList.remove('open');
  }
});

function sendQuickMsg(msg) {
  document.getElementById('chatInput').value = msg;
  sendChat();
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  appendMsg('user', msg);
  appendTyping();
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, conversationId: window.resqtailConversationId || null })
    });
    removeTyping();
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      appendMsg('bot', err.error ? `⚠️ ${err.error}` : "I'm having trouble connecting right now. Please try again later.");
      return;
    }
    const data = await res.json();
    const reply = data.reply || "I'm having trouble connecting right now. Please try again or call 1962 for emergency help! 🐾";
    if (data.conversationId) window.resqtailConversationId = data.conversationId;
    appendMsg('bot', reply);
  } catch (e) {
    removeTyping();
    console.error('sendChat error', e);
    appendMsg('bot', "Connection issue! For emergencies, call 1962 or 1800-111-565 immediately. 🆘");
  }
}

function appendMsg(role, text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  const avatar = role === 'bot' ? '🐾' : '👤';
  div.innerHTML = `<div class="msg-avatar">${avatar}</div><div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typingMsg';
  div.innerHTML = `<div class="msg-avatar">🐾</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingMsg');
  if (t) t.remove();
}

// ── FIND NEARBY BROWSER ──────────────────────────

let browserUserCity = '';

// Performance helpers
let currentOverpassController = null;
const LIVE_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function cacheKey(lat, lng, radius) {
  return `live:${lat.toFixed(3)}:${lng.toFixed(3)}:${radius}`;
}

function getCachedLive(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.ts > LIVE_CACHE_TTL) { sessionStorage.removeItem(key); return null; }
    return parsed.data;
  } catch (e) { return null; }
}

function setCachedLive(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch (e) { /* ignore */ }
}

function debounce(fn, wait = 300) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function setupLazyImages(root = document) {
  const imgs = Array.from(root.querySelectorAll('img.lazy[data-src]'));
  if (!imgs.length) return;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const img = en.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.remove('lazy');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });
    imgs.forEach(i => io.observe(i));
  } else {
    imgs.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); img.classList.remove('lazy'); });
  }
}

const runBrowserSearchDebounced = debounce(() => {
  const raw = document.getElementById('browserSearchInput')?.value.trim();
  if (raw) runBrowserSearch();
}, 450);

function setChip(el, query) {
  document.querySelectorAll('.browser-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('browserSearchInput').value = query;
  runBrowserSearch();
}

function autoFillLocation() {
  const btn = document.querySelector('.browser-loc-btn');
  btn.textContent = '⏳ Detecting...';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(4);
      const lng = pos.coords.longitude.toFixed(4);
      browserUserCity = `near ${lat},${lng}`;
      btn.textContent = '📍 Location Set ✓';
      showToast('📍 Location detected! Now search to find nearby services.');
      setTimeout(() => btn.textContent = '📍 My Location', 3000);
    }, () => {
      btn.textContent = '📍 My Location';
      showToast('⚠️ Location access denied. Try typing your city in the search.');
    });
  }
}

function runBrowserSearch() {
  const raw = document.getElementById('browserSearchInput').value.trim();
  if (!raw) { showToast('⚠️ Please enter a search term first.'); return; }
  const query = browserUserCity ? raw + ' ' + browserUserCity : raw + ' India';
  const statusEl = document.getElementById('browserStatus');
  const resultsEl = document.getElementById('browserResults');

  statusEl.innerHTML = `<div class="browser-loading">🔍 Searching for "<strong>${raw}</strong>"...</div>`;
  resultsEl.innerHTML = '';

  const mapsQuery = encodeURIComponent(query);
  const osmSearchUrl = `https://www.openstreetmap.org/search?query=${mapsQuery}`;
  const justDialUrl = `https://www.justdial.com/search?q=${encodeURIComponent(raw)}&city=India`;

  // Generate smart local results
  const localResults = generateLocalResults(raw);

  setTimeout(() => {
    statusEl.innerHTML = '';
    resultsEl.innerHTML = localResults.map(r => `
      <div class="browser-result-item" onclick="window.open('${r.mapsLink}','_blank')">
        <div class="browser-result-left">
          <div class="browser-result-icon">${r.icon}</div>
          <div>
            <div class="browser-result-name">${r.name}</div>
            <div class="browser-result-meta">${r.meta}</div>
          </div>
        </div>
        <div class="browser-result-actions">
          <button class="brn-call" onclick="event.stopPropagation();callNumber('${r.phone}')">📞 Call</button>
          <button class="brn-maps" onclick="event.stopPropagation();window.open('${r.mapsLink}','_blank')">🗺️ Maps</button>
        </div>
      </div>`).join('') +
      `<div style="margin-top:16px;padding:14px 20px;background:#E8F4F8;border-radius:14px;font-size:0.85rem;color:#1565C0;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
        <span>🌐 See full live results on:</span>
        <a href="${osmSearchUrl}" target="_blank" style="font-weight:700;color:#1565C0;text-decoration:none;padding:6px 14px;background:white;border-radius:10px;border:1px solid #90CAF9;">📍 OpenStreetMap</a>
        <a href="${justDialUrl}" target="_blank" style="font-weight:700;color:#E65100;text-decoration:none;padding:6px 14px;background:white;border-radius:10px;border:1px solid #FFCC80;">🔎 JustDial</a>
        <a href="https://www.google.com/search?q=${mapsQuery}" target="_blank" style="font-weight:700;color:#2E7D32;text-decoration:none;padding:6px 14px;background:white;border-radius:10px;border:1px solid #A5D6A7;">🔍 Google</a>
      </div>`;
  }, 900);
}

function generateLocalResults(raw) {
  const q = raw.toLowerCase();
  const base = [
    { icon: '❤️', name: 'Go Nirvana Foundation – Jaipur', meta: '📍 Patrakar Colony, Jaipur · 🚨 24×7 Emergency · Vaccination, Surgery, Shelter', phone: '7851032328', mapsLink: 'https://www.openstreetmap.org/search?query=Go%20Nirvana%20Foundation%20Patrakar%20Colony%20Jaipur' },
    { icon: '❤️', name: 'Jaipur Animal Welfare Association', meta: '📍 Kalwar Road, Jaipur · 10AM–6PM · Injury Care, Sterilization, Adoption', phone: '9983904242', mapsLink: 'https://share.google/mkFvx5NJgaN42b9zW' },
    { icon: '❤️', name: 'Animal Welfare Board of India', meta: '📞 National Helpline · animal welfare authority', phone: '1962', mapsLink: 'https://www.openstreetmap.org/search?query=Animal%20Welfare%20Board%20of%20India' },
    { icon: '🏥', name: 'PFA India – People for Animals', meta: '📞 1800-111-565 · pan-India NGO network', phone: '1800111565', mapsLink: 'https://www.openstreetmap.org/search?query=People%20for%20Animals%20India' },
    { icon: '❤️', name: 'Friendicoes Animal Rescue', meta: '📍 Delhi · rescue, shelter, sterilisation', phone: '01124611139', mapsLink: 'https://www.openstreetmap.org/search?query=Friendicoes%20Delhi' },
    { icon: '🏥', name: 'Blue Cross of India', meta: '📍 Chennai · rescue & veterinary care', phone: '04422351550', mapsLink: 'https://www.openstreetmap.org/search?query=Blue%20Cross%20of%20India%20Chennai' },
    { icon: '🏠', name: 'SPCA Animal Shelter', meta: '📍 Mumbai · shelter & adoption services', phone: '02223078036', mapsLink: 'https://www.openstreetmap.org/search?query=SPCA%20Mumbai' },
    { icon: '🩺', name: 'World Vets India', meta: '📍 India · veterinary outreach & treatment', phone: '1962', mapsLink: 'https://www.openstreetmap.org/search?query=animal%20hospital%20near%20me' },
  ];
  if (q.includes('ngo') || q.includes('rescue') || q.includes('welfare')) {
    return base.filter(r => ['❤️', '🏠'].includes(r.icon));
  }
  if (q.includes('vet') || q.includes('clinic') || q.includes('doctor')) {
    return base.filter(r => ['🩺', '🏥'].includes(r.icon));
  }
  if (q.includes('hospital')) {
    return base.filter(r => r.icon === '🏥');
  }
  if (q.includes('shelter') || q.includes('adopt')) {
    return base.filter(r => ['🏠', '❤️'].includes(r.icon));
  }
  return base;
}

// ── INIT ──────────────────────────────────────────

setupHeroAnimalSounds();
renderNearby();
renderFirstAid();
renderFeeding('dog');
renderAdoption();

function detectLocationAndFetchLive() {
  const btn = document.getElementById('liveDataBtn');
  if (btn) btn.textContent = '⏳ Scanning satellites...';
  const radiusEl = document.getElementById('radiusSelect');
  const radius = radiusEl ? parseInt(radiusEl.value, 10) : 10000; // meters

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      document.querySelector('.map-placeholder p').textContent = `📍 Location detected!`;
      document.querySelector('.map-placeholder small').textContent = `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`;
      if (btn) btn.style.display = 'none';

      fetchLivePlaces(pos.coords.latitude, pos.coords.longitude, radius);
    }, (err) => {
      console.warn('Geolocation error:', err);
      showToast('⚠️ Location access denied. Using standard data.');
      if (btn) btn.textContent = '🛰️ Scan Area for Helpers';
    }, { timeout: 12000 });
  } else {
    showToast('⚠️ Geolocation not supported by your browser.');
  }
}

async function fetchLivePlaces(lat, lng, radius = 10000) {
  const grid = document.getElementById('nearbyGrid');
  grid.innerHTML = '<div style="text-align:center; padding: 40px; grid-column: 1/-1; color: var(--sky); font-weight: bold; font-size: 1.1rem;">📡 Querying live animal care centers near your location...</div>';

  try {
    // Use backend proxy (handles Overpass API + caching server-side)
    const res = await fetch(`/api/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    const results = await res.json();

    if (!results || results.length === 0) {
      grid.innerHTML = `<div style="text-align:center; padding: 40px; grid-column: 1/-1; font-weight:600; color:var(--coral);">⚠️ No animal care centers found within ${(radius/1000)} km. Try increasing radius.</div>`;
      return;
    }

    // Transform backend results into PLACES format
    const livePlaces = results.map(r => ({
      name: r.name,
      type: r.type || 'vet',
      dist: r.distance || r.address || '',
      distanceKm: r.distanceKm || Infinity,
      distanceFromUser: r.distance || '',
      timings: r.timings || 'Contact for timings',
      serves: ['dog', 'cat', 'other'],
      icon: r.type === 'shelter' ? '🏠' : '🏥',
      phone: r.phone,
      mapsLink: r.directionsUrl || '',
      area: r.address || '',
      emergency: false,
      services: r.type === 'vet' ? 'Veterinary Clinic' : 'Animal Shelter',
      acceptsStreet: true,
      acceptsDonations: false,
      latitude: r.latitude,
      longitude: r.longitude,
      address: r.address || ''
    }));

    livePlaces.sort((a, b) => (a.distanceKm || Infinity) - (b.distanceKm || Infinity));

    PLACES = [
      { name: 'Animal Welfare Board of India', type: 'ngo', dist: 'National Dispatch', timings: '24x7 Emergency', serves: ['dog', 'cat', 'cow', 'bird', 'monkey', 'other'], icon: '🚨', phone: '1962', mapsLink: '', area: 'All India', emergency: true, services: 'National Emergency Unit', acceptsStreet: true, acceptsDonations: false },
      ...livePlaces
    ];

    // Use the new renderNearby (from nearby.js if loaded, or fallback)
    if (typeof renderNearbyWithDistance === 'function') renderNearbyWithDistance();
    else renderNearby('all');
    showToast(`📡 ${livePlaces.length} live centers found within ${(radius/1000)} km`, { duration: 3000 });
  } catch (e) {
    console.error('fetchLivePlaces error:', e);
    grid.innerHTML = '<div style="text-align:center; padding: 40px; grid-column: 1/-1; font-weight:600; color:var(--coral);">⚠️ Live lookup failed. Showing default data.</div>';
    if (typeof renderNearbyWithDistance === 'function') renderNearbyWithDistance();
    else renderNearby('all');
  }
}

// ── GLOBAL UI & LOCATION ──────────────────────────

setTimeout(() => {
  // Setup Scroll Animations
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => observer.observe(r));
}, 800);

// Attach debounced search input handler
try {
  const browserSearchInput = document.getElementById('browserSearchInput');
  if (browserSearchInput) {
    browserSearchInput.addEventListener('input', runBrowserSearchDebounced);
    browserSearchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') runBrowserSearch(); });
  }
} catch (e) { /* ignore */ }
