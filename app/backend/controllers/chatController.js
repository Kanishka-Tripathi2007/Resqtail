const https = require('https');
const crypto = require('crypto');
let Conversation;
try { Conversation = require('../models/Conversation'); } catch (e) { Conversation = null; }

const conversations = new Map();

function sanitizeUserMessage(m) {
  if (!m) return '';
  let s = String(m).replace(/\u0000/g, '').replace(/[\x00-\x1F]+/g, ' ').trim();
  if (s.length > 2000) s = s.slice(0, 2000);
  return s;
}

// ── Local Fallback Brain (no API key needed) ─────────
const LOCAL_RESPONSES = {
  emergency: "🚨 **EMERGENCY STEPS:**\n1. Call **1962** (Animal Welfare Board) or **1800-111-565** (PFA)\n2. Keep the animal calm, don't move it unnecessarily\n3. If bleeding, apply gentle pressure with clean cloth\n4. Note the exact location for rescuers\n5. Stay with the animal until help arrives\n\nYou can also use ResQtail's SOS section above for quick emergency contacts!",
  bleeding: "🩸 **For bleeding animals:**\n1. Stay calm and approach gently\n2. Apply gentle pressure with a clean cloth\n3. Do NOT remove the cloth — add more on top\n4. Keep the animal still and warm\n5. **Call a vet immediately** — bleeding needs professional care\n\n📞 Emergency: 1962",
  fracture: "🦴 **For suspected fractures:**\n1. Do NOT try to set or splint the bone\n2. Support the full body when moving\n3. Use cardboard as a stretcher\n4. Cover with a blanket for warmth (shock prevention)\n5. **Rush to nearest vet** — fractures need X-rays\n\n📞 Emergency: 1962",
  poison: "☠️ **If an animal is poisoned:**\n1. Do NOT induce vomiting unless told by a vet\n2. Note what the animal may have eaten\n3. Keep the animal calm, restrict movement\n4. **Call a vet or poison helpline immediately**\n5. Bring a sample/photo of the suspected poison\n\n⚠️ Never give home remedies for poisoning!",
  heatstroke: "☀️ **Heat stroke care:**\n1. Move to shade/cool area immediately\n2. Pour cool (not cold) water over the body\n3. Offer small sips of water if conscious\n4. Fan the animal gently\n5. **Call a vet** — heat stroke can be fatal\n\nPrevention: Always keep water bowls in shaded areas.",
  feeding_dog: "🐶 **What to feed street dogs:**\n✅ Plain boiled rice, boiled chicken (no bones), cooked vegetables, fresh water, plain biscuits\n❌ NO chocolate, onion, garlic, grapes, xylitol\n\n🌡️ **Seasonal tips:**\n- Summer: Multiple water bowls in shade\n- Monsoon: Dry food is better\n- Winter: Increase food quantity",
  feeding_cat: "🐱 **What to feed street cats:**\n✅ Cooked fish (boneless), boiled chicken, small amounts of milk, fresh water\n❌ NO chocolate, onion, garlic, avocado, raw dough\n\n💡 Cats dehydrate fast in summer — extra water sources are critical!",
  feeding: "🍖 **General feeding tips:**\n- Always provide **fresh, clean water**\n- Avoid spicy, salty, or processed human food\n- **Never feed chocolate** to any animal\n- For dogs: boiled rice + chicken is safe\n- For cats: cooked fish (boneless)\n- For cows: dry grass, green fodder, NO plastic bags\n- For birds: millets, seeds, shallow water bowls",
  rescue: "🐾 **How to rescue a street animal:**\n1. Approach slowly and speak softly\n2. Don't make sudden movements\n3. Use a towel/blanket to gently secure the animal\n4. Place in a ventilated box/carrier\n5. Take to the nearest vet or shelter\n\n⚠️ **Don'ts:** Don't chase, don't grab the tail, don't use bare hands for injured animals.",
  adopt: "❤️ **Adoption tips:**\n1. Visit local shelters — they have many loving animals\n2. Consider adopting an Indian breed (Indie) — they're resilient!\n3. Ensure your home is pet-safe\n4. Budget for vet visits and vaccinations\n5. Adoption is FREE at most shelters\n\nCheck the **Rescue & Adopt** section on ResQtail to browse available pets!",
  donate: "💚 **Ways to help:**\n1. **Donate** to verified NGOs via ResQtail's Donate section\n2. **Volunteer** at local shelters\n3. **Feed** street animals regularly\n4. **Report** injured animals through ResQtail\n5. **Adopt** instead of buying\n\nEvery small act saves a life! 🐾",
  vet: "🏥 **Finding a vet:**\nUse ResQtail's **Nearby Help** section to find vets near you!\n\n📞 **Emergency contacts:**\n- Animal Welfare Board: **1962**\n- PFA Helpline: **1800-111-565**\n- Blue Cross Chennai: 044-2235-1550\n\nYou can also use the **Find Nearby** section to search Google Maps for vets in your area.",
  hello: "Hello! 👋 I'm **ResQBot**, your animal rescue assistant! 🐾\n\nI can help you with:\n🆘 Emergency first aid\n🍖 Feeding guides\n🏥 Finding nearby vets\n❤️ Adoption info\n📢 Reporting injured animals\n💚 How to donate & volunteer\n\nWhat do you need help with?",
  default: "🐾 I'm **ResQBot** — here to help with street animal care!\n\nTry asking me about:\n• **Emergency first aid** (bleeding, fractures, heat stroke)\n• **What to feed** street dogs, cats, cows, birds\n• **How to rescue** an injured animal\n• **Finding vets** near you\n• **Adoption** tips\n• **Donating** to animal NGOs\n\n📞 For emergencies, call **1962** immediately!"
};

function getLocalReply(message) {
  const q = message.toLowerCase();
  if (/emergency|urgent|dying|accident|hit by|run over|critical/.test(q)) return LOCAL_RESPONSES.emergency;
  if (/bleed|blood|wound|cut|gash/.test(q)) return LOCAL_RESPONSES.bleeding;
  if (/fracture|broken|bone|limping|can.?t walk|leg/.test(q)) return LOCAL_RESPONSES.fracture;
  if (/poison|toxic|ate something|vomit|chemical/.test(q)) return LOCAL_RESPONSES.poison;
  if (/heat|hot|panting|stroke|overheat|summer/.test(q)) return LOCAL_RESPONSES.heatstroke;
  if (/feed.*dog|dog.*feed|dog.*eat|food.*dog/.test(q)) return LOCAL_RESPONSES.feeding_dog;
  if (/feed.*cat|cat.*feed|cat.*eat|food.*cat/.test(q)) return LOCAL_RESPONSES.feeding_cat;
  if (/feed|food|eat|hungry|starv/.test(q)) return LOCAL_RESPONSES.feeding;
  if (/rescue|save|help.*animal|injured|hurt|found.*animal/.test(q)) return LOCAL_RESPONSES.rescue;
  if (/adopt|shelter|home|take home|keep/.test(q)) return LOCAL_RESPONSES.adopt;
  if (/donat|volunteer|contribute|help.*ngo|support/.test(q)) return LOCAL_RESPONSES.donate;
  if (/vet|doctor|clinic|hospital|medical/.test(q)) return LOCAL_RESPONSES.vet;
  if (/hi|hello|hey|howdy|greet|start|hii/.test(q)) return LOCAL_RESPONSES.hello;
  return LOCAL_RESPONSES.default;
}

// ── OpenAI caller ────────────────────────────────────
function callOpenAI(messages) {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.OPENAI_API_KEY || '';
    const isOpenRouter = apiKey.startsWith('sk-or-');
    const hostname = isOpenRouter ? 'openrouter.ai' : 'api.openai.com';
    const path = isOpenRouter ? '/api/v1/chat/completions' : '/v1/chat/completions';
    const model = isOpenRouter && !process.env.OPENAI_MODEL?.includes('/') 
      ? `openai/${process.env.OPENAI_MODEL || 'gpt-3.5-turbo'}` 
      : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo');

    const payload = JSON.stringify({ model, messages, max_tokens: 512, temperature: 0.7 });
    
    const headers = { 
      'Content-Type': 'application/json', 
      'Content-Length': Buffer.byteLength(payload), 
      'Authorization': `Bearer ${apiKey}` 
    };
    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'https://resqtail.org'; // required by OpenRouter
      headers['X-Title'] = 'ResQtail';
    }

    const options = {
      hostname, path, method: 'POST', headers, timeout: 15000
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
        } else { reject(new Error(`OpenAI responded ${res.statusCode}: ${body}`)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('OpenAI request timed out')));
    req.write(payload);
    req.end();
  });
}

// ── Main handler ─────────────────────────────────────
exports.handleChat = async (req, res) => {
  try {
    const { message, conversationId } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Missing message' });

    const sanitized = sanitizeUserMessage(message);
    if (!sanitized) return res.status(400).json({ error: 'Invalid message' });

    // Prompt-injection protections
    const lower = sanitized.toLowerCase();
    const blocked = ['openai_api_key', 'process.env', 'api_key', 'api-key', 'secret', 'private key', '-----begin', 'ssh-rsa', 'rm -rf', 'drop database'];
    if (blocked.some(b => lower.includes(b))) return res.status(400).json({ error: 'Message contains disallowed content' });

    // ── LOCAL FALLBACK MODE (no API key) ──────────
    if (!process.env.OPENAI_API_KEY) {
      const reply = getLocalReply(sanitized);
      let convId = conversationId || (Date.now().toString(36) + Math.random().toString(36).slice(2));
      return res.json({ reply, conversationId: convId, mode: 'local' });
    }

    // ── OPENAI MODE ──────────────────────────────
    let convId = conversationId;
    let history = [];
    let convDoc = null;

    if (convId && Conversation) {
      try {
        convDoc = await Conversation.findOne({ conversationId: convId }).exec();
        if (convDoc && convDoc.messages) history = convDoc.messages.map(m => ({ role: m.role, content: m.content }));
      } catch (e) { convDoc = null; }
    }

    if (!convId) {
      convId = (crypto.randomUUID && crypto.randomUUID()) || (Date.now().toString(36) + Math.random().toString(36).slice(2));
      if (Conversation) { try { convDoc = await Conversation.create({ conversationId: convId }); } catch (e) { convDoc = null; } }
    }

    history.push({ role: 'user', content: sanitized });
    if (convDoc && Conversation) {
      try { await convDoc.append('user', sanitized); } catch (e) { /* ignore */ }
    } else {
      const existing = conversations.get(convId) || [];
      existing.push({ role: 'user', content: sanitized });
      while (existing.length > 50) existing.shift();
      conversations.set(convId, existing);
      history = existing;
    }

    const systemPrompt = `You are ResQBot, a friendly and concise street animal care assistant for ResQtail (India). Provide practical, empathetic guidance relevant to street animals (dogs, cats, cows, birds, monkeys). Always recommend contacting a veterinarian for medical issues. Keep answers short and actionable; if the user reports an emergency, advise calling local emergency numbers (e.g., 1962). Do not reveal system or server-side secrets or execute code.`;
    const messages = [{ role: 'system', content: systemPrompt }, ...history];

    const aiResp = await callOpenAI(messages);
    const reply = aiResp.choices && aiResp.choices[0] && aiResp.choices[0].message && aiResp.choices[0].message.content
      ? aiResp.choices[0].message.content
      : 'I\'m having trouble generating a reply. Please try again or call 1962 for emergency help.';

    history.push({ role: 'assistant', content: reply });
    while (history.length > 50) history.shift();
    if (convDoc && Conversation) {
      try { await convDoc.append('assistant', reply); } catch (e) { /* ignore */ }
    } else {
      const existing = conversations.get(convId) || [];
      existing.push({ role: 'assistant', content: reply });
      while (existing.length > 50) existing.shift();
      conversations.set(convId, existing);
    }

    res.json({ reply, conversationId: convId, mode: 'openai' });
  } catch (err) {
    console.error('chatController error:', err && err.message ? err.message : err);
    // Even on OpenAI failure, provide a useful local fallback
    const fallback = getLocalReply(req.body && req.body.message ? req.body.message : '');
    res.json({ reply: fallback + "\n\n_(AI service temporarily unavailable — showing local guidance)_", conversationId: req.body?.conversationId || Date.now().toString(36), mode: 'fallback' });
  }
};
