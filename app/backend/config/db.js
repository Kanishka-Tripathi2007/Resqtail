const mongoose = require('mongoose');
const dns = require('dns');
const { URL } = require('url');

/**
 * Resolve a mongodb+srv:// URI into a standard mongodb:// URI.
 * This works around environments where Node.js's driver-level SRV
 * resolution fails but the OS DNS works fine.
 */
const resolveSrvUri = (srvUri) => {
  return new Promise((resolve, reject) => {
    try {
      // Parse: mongodb+srv://user:pass@host/db?params
      const cleaned = srvUri.replace('mongodb+srv://', 'https://');
      const parsed = new URL(cleaned);
      const srvHost = parsed.hostname;
      const user = parsed.username;
      const pass = parsed.password;
      const dbName = parsed.pathname.replace('/', '') || 'resqtail';
      const params = parsed.search; // ?retryWrites=true&w=majority...

      dns.resolveSrv(`_mongodb._tcp.${srvHost}`, (err, addresses) => {
        if (err) return reject(err);
        if (!addresses || addresses.length === 0) return reject(new Error('No SRV records found'));

        // Also get TXT records for default options (authSource, replicaSet)
        dns.resolveTxt(srvHost, (txtErr, txtRecords) => {
          const hostList = addresses.map(a => `${a.name}:${a.port}`).join(',');
          let txtParams = '';
          if (!txtErr && txtRecords && txtRecords.length > 0) {
            txtParams = txtRecords.map(r => r.join('')).join('&');
          }

          // Build standard mongodb:// URI
          let directUri = `mongodb://${user}:${encodeURIComponent(pass)}@${hostList}/${dbName}`;
          const allParams = [txtParams, params ? params.slice(1) : '', 'ssl=true'].filter(Boolean).join('&');
          if (allParams) directUri += `?${allParams}`;

          console.log('🔧 Resolved SRV → direct connection with', addresses.length, 'hosts');
          resolve(directUri);
        });
      });
    } catch (parseErr) {
      reject(parseErr);
    }
  });
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resqtail';
  const isAtlas = uri.startsWith('mongodb+srv');
  const timeout = isAtlas ? 15000 : 3000;

  // Use Google public DNS for Atlas connections — many local routers
  // cannot resolve SRV records which mongodb+srv:// requires
  if (isAtlas) {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  }

  // ── Attempt 1: Try the URI as-is ──
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: timeout });
    console.log(`✅ MongoDB Connected${isAtlas ? ' (Atlas)' : ' (Local)'}`);
    return;
  } catch (err) {
    // If it's not an SRV issue, or it's not an Atlas URI, give up
    if (!isAtlas || !err.message.includes('querySrv')) {
      console.warn('⚠️ MongoDB not available; continuing with filesystem fallback.');
      console.warn(err.message || err);
      return;
    }
    console.warn('⚠️ SRV lookup failed, attempting manual DNS resolution...');
  }

  // ── Attempt 2: Manually resolve SRV and connect with standard URI ──
  try {
    const directUri = await resolveSrvUri(uri);
    await mongoose.connect(directUri, { serverSelectionTimeoutMS: timeout });
    console.log('✅ MongoDB Connected (Atlas — via manual SRV resolve)');
  } catch (err) {
    console.warn('⚠️ MongoDB not available; continuing with filesystem fallback.');
    console.warn(err.message || err);
  }
};

module.exports = connectDB;