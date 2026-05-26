const http = require('http');
const qs = require('querystring');

function postForm(path, data){
  return new Promise(resolve=>{
    const body = qs.stringify(data);
    const opts = { hostname: 'localhost', port: 5000, path, method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) } };
    const req = http.request(opts, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => { console.log(path, 'STATUS', res.statusCode); console.log(b); resolve({ status: res.statusCode, body: b }); });
    });
    req.on('error', e => { console.error(path, 'ERR', e.message); resolve({ error: e }); });
    req.write(body);
    req.end();
  });
}

function postJSON(path, obj){
  return new Promise(resolve=>{
    const body = JSON.stringify(obj);
    const opts = { hostname: 'localhost', port: 5000, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } };
    const req = http.request(opts, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => { console.log(path, 'STATUS', res.statusCode); console.log(b); resolve({ status: res.statusCode, body: b }); });
    });
    req.on('error', e => { console.error(path, 'ERR', e.message); resolve({ error: e }); });
    req.write(body);
    req.end();
  });
}

function get(path){
  return new Promise(resolve=>{
    const opts = { hostname: 'localhost', port: 5000, path, method: 'GET' };
    const req = http.request(opts, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => { console.log(path, 'STATUS', res.statusCode); console.log(b); resolve({ status: res.statusCode, body: b }); });
    });
    req.on('error', e => { console.error(path, 'ERR', e.message); resolve({ error: e }); });
    req.end();
  });
}

(async ()=>{
  console.log('=== SMOKE TEST START ===');
  await postForm('/api/listings', { name: 'Smoke Pet', type: 'Dog', age: '2', sex: 'Male', description: 'Test listing', contact: '9999999999' });
  await postForm('/api/reports', { animal: 'dog', condition: 'injured', location: 'Test Street', description: 'Test desc', phone: '9999999999' });
  await postJSON('/api/donations/create-order', { amount: 10, ngo: 'Test NGO', name: 'Tester', email: 'test@example.com', phone: '9999999999' });
  await get('/api/listings');
  await get('/api/reports');
  console.log('=== SMOKE TEST END ===');
  process.exit(0);
})();
