import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
const base='http://127.0.0.1:3000';const stamp=Date.now();const password=randomBytes(24).toString('hex');
const fixtures=[];
async function call(path,body,cookie){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json',Origin:base}:{}),...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});let json;try{json=await r.json();}catch{json=null;}return {status:r.status,json,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
for(const path of ['/','/pricing','/docs','/docs/measurements','/sign-in','/sign-up','/demo']){const r=await fetch(base+path);assert.equal(r.status,200,path);console.log(`PASS ${path}`);}
assert.equal((await call('/api/audits')).status,401);
for(const label of ['a','b']){const account=await call('/api/auth/sign-up',{name:`QA ${label}`,email:`qa-${stamp}-${label}@example.invalid`,password,importReports:false});assert.equal(account.status,200);assert.ok(account.cookie);fixtures.push({id:account.json.data.id,email:account.json.data.email,cookie:account.cookie});}
const config={url:'https://example.com',country:'United States',language:'English',device:'Desktop',maxPages:1,keywords:['example domain'],authorized:true};
const created=await call('/api/audits',config,fixtures[0].cookie);assert.equal(created.status,201);const id=created.json.data.id;
assert.equal((await call(`/api/audits/${id}`,undefined,fixtures[1].cookie)).status,404);
const bad=await call('/api/audits',{...config,url:'https://127.0.0.1'},fixtures[0].cookie);assert.equal(bad.status,400);
const repeat=await call('/api/audits',config,fixtures[0].cookie);assert.equal(repeat.json.data.id,id);
console.log('PASS private account isolation, unsafe-target rejection, duplicate-scan prevention');
let audit;
for(let i=0;i<150;i++){const result=await call(`/api/audits/${id}`,undefined,fixtures[0].cookie);audit=result.json.data;if(!['queued','running'].includes(audit.status))break;await new Promise(r=>setTimeout(r,1000));}
assert.equal(audit.status,'completed',audit.error);assert.ok(audit.performance, audit.measurementError);assert.equal(audit.performance.source,'Lighthouse');assert.equal(typeof audit.performance.lcp,'number');assert.ok(audit.score!==null);assert.equal(audit.rankingStatus,'not_connected');assert.equal(audit.config.keywords.length,1);
console.log(`PASS real worker report: ${audit.pages.length} page; performance ${audit.performance.score}/100; LCP ${Math.round(audit.performance.lcp)} ms; ${audit.findings.length} findings`);
const logout=await call('/api/auth/sign-out',{},fixtures[0].cookie);assert.equal(logout.status,200);assert.equal((await call('/api/audits',undefined,fixtures[0].cookie)).status,401);
const login=await call('/api/auth/sign-in',{email:fixtures[0].email,password});assert.equal(login.status,200);assert.ok(login.cookie);
console.log('PASS logout invalidates session; password sign-in restores account');
writeFileSync('data/qa-fixtures.json',JSON.stringify({users:fixtures.map(f=>f.id),audit:id,passedAt:new Date().toISOString()},null,2));
const {db}=await import('../server/db.ts');
for(const fixture of fixtures){db.prepare('DELETE FROM sessions WHERE user_id=?').run(fixture.id);db.prepare('DELETE FROM audits WHERE owner_id=?').run(fixture.id);db.prepare('DELETE FROM projects WHERE owner_id=?').run(fixture.id);db.prepare('DELETE FROM secrets WHERE owner_id=?').run(fixture.id);db.prepare('DELETE FROM users WHERE id=?').run(fixture.id);}
console.log('PASS disposable test accounts and reports cleaned up');
