'use strict';
/* =====================================================================
   core.js: random helpers, number formatting, answer checking, diagrams
   ===================================================================== */

const TOPICS = [];
const AREAS = [
  { id: 'num', name: 'Number', blurb: 'Whole numbers, fractions, decimals, percentages, ratio and formulae' },
  { id: 'mea', name: 'Measures, shape and space', blurb: 'Money, units, time, area, volume, scale and angles' },
  { id: 'dat', name: 'Handling data', blurb: 'Averages, probability, tables, charts and scatter graphs' }
];
function addTopic(t) { TOPICS.push(t); }
function topicById(id) { return TOPICS.find(t => t.id === id); }

/* ---------- exam weighting ----------
   Average marks per 60-mark TQUK Level 2 paper, from 5 papers (2 sample, 3 past),
   counted part by part. SEC_A_W is the share of those marks in Section A (no calculator). */
const EXAM_W = { 'n-pct': 7.4, 'm-area': 5.6, 'n-ratio': 5.6, 'n-calc': 5.6, 'n-fdp': 5.2, 'd-avg': 5.2,
  'm-money': 3.6, 'm-compound': 3.0, 'm-shape': 2.8, 'm-volume': 2.6, 'n-formula': 2.4,
  'd-grouped': 2.2, 'm-convert': 2.2, 'n-num': 2.2, 'd-prob': 1.8, 'm-scale': 1.2, 'n-est': 1.2, 'm-time': 0.2, 'd-charts': 0 };
const SEC_A_W = { 'n-calc': 3.4, 'n-fdp': 3.0, 'm-compound': 2.0, 'n-pct': 1.2, 'd-prob': 1.2 };
const TIERS = [
  { k: 1, name: 'Start here', marks: 'about 35 of the 60 marks', blurb: 'These six come up in every TQUK paper. Together they are worth about the pass mark.' },
  { k: 2, name: 'Next', marks: 'about 14 marks', blurb: 'Usually one question each, often inside a longer problem.' },
  { k: 3, name: 'Leave until last', marks: '2 marks or fewer each', blurb: 'Worth learning once the topics above are secure.' }
];
function examW(id) { return EXAM_W[id] || 0; }
function tierOf(id) { const w = examW(id); return w >= 5 ? 1 : w >= 2.4 ? 2 : 3; }
function byWeight(list) { const k = Object.keys(EXAM_W); return (list || TOPICS).slice().sort((a, b) => examW(b.id) - examW(a.id) || k.indexOf(a.id) - k.indexOf(b.id)); }
function marksLabel(id) { const w = examW(id); if (w >= 1) { const n = Math.round(w); return `≈${n} mark${n === 1 ? '' : 's'} a paper`; } return w > 0 ? 'Rarely tested' : 'Not on TQUK papers so far'; }

/* ---------- random ---------- */
const NAMES = ['Sam', 'Priya', 'Tom', 'Aisha', 'Jordan', 'Megan', 'Ravi', 'Chloe', 'Dan', 'Zara', 'Ben', 'Leah',
  'Kofi', 'Hannah', 'Marek', 'Ellie', 'Omar', 'Grace', 'Josh', 'Nadia', 'Callum', 'Freya', 'Imran', 'Rosie'];
const R = {
  int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: a => a[Math.floor(Math.random() * a.length)],
  shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  step: (a, b, s) => rd(a + s * R.int(0, Math.floor((b - a) / s + 1e-9)), 6),
  coin: () => Math.random() < 0.5,
  name: () => R.pick(NAMES),
  names: n => R.shuffle(NAMES).slice(0, n)
};

/* ---------- numbers ---------- */
function rd(x, dp = 2) { const f = Math.pow(10, dp); return Math.round(x * f + (x >= 0 ? 1e-7 : -1e-7)) / f; }
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return a / gcd(a, b) * b; }
function simp(n, d) { const g = gcd(n, d) || 1; return [n / g, d / g]; }
function sf(x, n) { return Number(Number(x).toPrecision(n)); }
/* number with thousands commas; dp = fixed decimal places (optional) */
function fmt(x, dp) {
  const neg = x < 0; x = Math.abs(x);
  const s = dp === undefined
    ? rd(x, 6).toLocaleString('en-GB', { maximumFractionDigits: 6 })
    : rd(x, dp).toLocaleString('en-GB', { minimumFractionDigits: dp, maximumFractionDigits: dp });
  return (neg ? '−' : '') + s;
}
const sn = fmt; // signed display (uses a true minus sign)
function gbp(x) { return (x < 0 ? '−' : '') + '£' + fmt(rd(Math.abs(x), 2), 2); }
function money(x) { return Math.abs(x) < 1 && x !== 0 ? Math.round(Math.abs(x) * 100) + 'p' : gbp(x); }
/* fractions */
function F(n, d) { return `<span class="fr"><span>${n}</span><span>${d}</span></span>`; }
function M(n, d) { // improper n/d -> mixed number HTML
  const [a, b] = simp(n, d);
  if (b === 1) return String(a);
  const w = Math.floor(a / b), r = a % b;
  return w ? `${w}&nbsp;${F(r, b)}` : F(r, b);
}
function fracText(n, d) { const [a, b] = simp(n, d); if (b === 1) return String(a); const w = Math.floor(a / b), r = a % b; return w ? `${w} ${r}/${b}` : `${r}/${b}`; }
function hhmm(m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
function hm(m) { const h = Math.floor(m / 60), mi = m % 60; return (h ? h + (h === 1 ? ' hour' : ' hours') : '') + (h && mi ? ' ' : '') + (mi || !h ? mi + ' minutes' : ''); }
function twelve(m) { const h = Math.floor(m / 60) % 24, mi = m % 60; const ap = h >= 12 ? 'pm' : 'am'; const h12 = h % 12 === 0 ? 12 : h % 12; return `${h12}:${String(mi).padStart(2, '0')} ${ap}`; }
function an(x) { return /^(8|11|18|[aeiou])/i.test(String(x)) ? 'an' : 'a'; }
function An(x) { return an(x) === 'an' ? 'An' : 'A'; }
function ord(n) { const s = n % 100; if (s >= 11 && s <= 13) return n + 'th'; return n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'); }
function pl(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
function bearing(b) { return String(b).padStart(3, '0') + '°'; }

function words(n) {
  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const u100 = x => x < 20 ? ones[x] : tens[Math.floor(x / 10)] + (x % 10 ? '-' + ones[x % 10] : '');
  const u1000 = x => { const h = Math.floor(x / 100), r = x % 100; let s = ''; if (h) s = ones[h] + ' hundred'; if (r) s += (h ? ' and ' : '') + u100(r); return s; };
  const m = Math.floor(n / 1e6), th = Math.floor(n / 1000) % 1000, u = n % 1000, out = [];
  if (m) out.push(u1000(m) + ' million');
  if (th) out.push(u1000(th) + ' thousand');
  if (u) out.push((u < 100 && (m || th) ? 'and ' : '') + u1000(u));
  return out.join(', ').replace(/, and /g, ' and ');
}

/* ---------- answer checking ---------- */
function clean(s) {
  let t = String(s == null ? '' : s).trim().toLowerCase().replace(/[−–—]/g, '-').replace(/,/g, '').replace(/\u00a0/g, ' ');
  t = t.replace(/(\d)\s*¼/g, '$1 1/4').replace(/(\d)\s*½/g, '$1 1/2').replace(/(\d)\s*¾/g, '$1 3/4').replace(/¼/g, '1/4').replace(/½/g, '1/2').replace(/¾/g, '3/4');
  t = t.replace(/^\((.*)\)$/, '$1').replace(/^-\s+/, '-').replace(/(\d)\s+and\s+(\d+\s*\/)/, '$1 $2').replace(/^(\d+)-(\d+\s*\/\s*\d+)$/, '$1 $2');
  if (/^-?\d{1,3}( \d{3})+(\.\d+)?$/.test(t)) t = t.replace(/ /g, '');
  return t;
}
function parseVal(s) {
  let t = clean(s); if (!t) return null;
  t = t.replace(/^[a-z]\s*=\s*/, '');
  let pct = false, pence = false;
  const hadPound = /£/.test(t);
  t = t.replace(/[£€$]/g, '').trim().replace(/^-\s+/, '-');
  if (/%\s*$/.test(t)) { pct = true; t = t.replace(/%\s*$/, '').trim(); }
  if (/^-?[\d.]+\s*p$/.test(t)) { pence = !hadPound; t = t.replace(/\s*p$/, ''); }
  t = t.replace(/\s*[a-z°][a-z°²³\/.\s\d]*$/, '').trim();
  let m;
  if ((m = t.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) {
    const sg = m[1] ? -1 : 1, w = +m[2], n = +m[3], d = +m[4]; if (!d) return null;
    return { v: sg * (w + n / d), kind: 'mixed', n: sg * (w * d + n), d, pct, pence };
  }
  if ((m = t.match(/^(-?\d+)\s*\/\s*(\d+)$/))) { const n = +m[1], d = +m[2]; if (!d) return null; return { v: n / d, kind: 'frac', n, d, pct, pence }; }
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) return { v: parseFloat(t), kind: 'dec', pct, pence };
  return null;
}
function parseTime(s) {
  let t = clean(s).replace(/\s/g, '').replace(/a\.m\.?/, 'am').replace(/p\.m\.?/, 'pm').replace(/\./g, ':');
  const pm = /pm$/.test(t), am = /am$/.test(t);
  t = t.replace(/(am|pm)$/, '');
  let h, mi, mm;
  if ((mm = t.match(/^(\d{1,2}):(\d{2})$/))) { h = +mm[1]; mi = +mm[2]; }
  else if ((mm = t.match(/^(\d{3,4})$/))) { h = Math.floor(+mm[1] / 100); mi = +mm[1] % 100; }
  else if ((mm = t.match(/^(\d{1,2})$/)) && (am || pm)) { h = +mm[1]; mi = 0; }
  else return null;
  if (mi > 59 || h > 23) return null;
  if (pm && h > 12) return { m: h * 60 + mi, ampm: false };
  if ((am || pm) && (h > 12 || h === 0)) return null;
  if (pm && h < 12) h += 12;
  if (am && h === 12) h = 0;
  return { m: h * 60 + mi, ampm: am || pm };
}
function normText(s) { return clean(s).replace(/\s+/g, '').replace(/\.$/, ''); }

function checkPart(p, raw) {
  const blank = raw == null || String(raw).replace(/[|~]/g, '').trim() === '';
  if (blank) return { ok: false, blank: true };
  switch (p.type) {
    case 'choice': return { ok: +raw === p.ans };
    case 'num': {
      const r = parseVal(raw); if (!r) return { ok: false, msg: 'That doesn’t look like a number.' };
      let v = r.v; if (r.pence && p.money) v /= 100;
      const tol = p.tol != null ? p.tol : (p.money ? 0.005 : 1e-6);
      return { ok: Math.abs(v - p.ans) <= tol + 1e-9 };
    }
    case 'frac': {
      const r = parseVal(raw); if (!r) return { ok: false, msg: 'Type a fraction like 3/4, or a mixed number like 2 1/4.' };
      const ok = Math.abs(r.v - p.ans[0] / p.ans[1]) < 1e-9;
      if (ok && p.simplest) {
        if (r.kind === 'dec') return { ok: false, msg: 'Right value, but give it as a fraction.' };
        if (gcd(r.n, r.d) !== 1) return { ok: false, msg: 'Right value, but simplify the fraction fully.' };
      }
      return { ok };
    }
    case 'prob': {
      const r = parseVal(raw); if (!r) return { ok: false, msg: 'Type a fraction, decimal or percentage.' };
      let v = r.v; if (r.pct) v /= 100;
      if (v > 1 || v < 0) return { ok: false, msg: 'A probability is always between 0 and 1.' };
      return { ok: Math.abs(v - p.ans) <= (r.kind === 'dec' ? 0.0051 : 1e-9) };
    }
    case 'ratio': {
      const parts = clean(raw).split(/\s*:\s*/).map(Number);
      if (parts.some(isNaN)) return { ok: false, msg: 'Type a ratio like 2:3.' };
      const ok = parts.length === p.ans.length && parts.every((x, i) => x === p.ans[i]);
      if (!ok && parts.length === p.ans.length && parts.every(x => x > 0) && parts.every((x, i) => Math.abs(x / parts[0] - p.ans[i] / p.ans[0]) < 1e-9))
        return { ok: false, msg: 'Equivalent, but not in its simplest form.' };
      return { ok };
    }
    case 'time': {
      const t = parseTime(raw); if (!t) return { ok: false, msg: 'Type a time like 14:35.' };
      if (p.need12 && !t.ampm) return { ok: false, msg: 'Include am or pm for the 12-hour clock.' };
      if (p.need24 && t.ampm) return { ok: false, msg: 'Use the 24-hour clock, with no am or pm.' };
      if (!p.need12 && !t.ampm && t.m !== p.ans && t.m + 720 === p.ans) return { ok: false, msg: 'Use the 24-hour clock for afternoon times (for example 14:35), or add pm.' };
      return { ok: t.m === p.ans };
    }
    case 'hm': {
      const [h, mi] = String(raw).split('|').map(x => x.trim() === '' ? 0 : Number(x));
      if (isNaN(h) || isNaN(mi)) return { ok: false, msg: 'Type whole numbers of hours and minutes.' };
      return { ok: h * 60 + mi === p.ans };
    }
    case 'coord': {
      const m = String(raw).replace(/[−–—]/g, '-').replace(/[()\s]/g, '').split(/[,;]/).map(Number);
      if (m.length !== 2 || m.some(isNaN)) return { ok: false, msg: 'Type coordinates like (3, -2).' };
      return { ok: m[0] === p.ans[0] && m[1] === p.ans[1] };
    }
    case 'text': { const n = normText(raw); return { ok: p.accept.some(a => normText(a) === n) }; }
    case 'decide': {
      const [c, ...vals] = String(raw).split('~'), m = partMarks(p);
      const cOk = c !== '' && +c === p.ans, subs = p.subs.map((s, i) => checkPart(s, vals[i])), nOk = subs.every(r => r.ok);
      const fmtMsg = subs.find(r => !r.ok && r.msg && /^(Right value|Include|Use the 24|Equivalent)/.test(r.msg));
      if (fmtMsg) return { ok: false, msg: fmtMsg.msg, got: 0 };
      if (cOk && nOk) return { ok: true };
      if (nOk) return c === '' ? { ok: false, got: m - 1, msg: 'Include your decision too: choose Yes or No.' } : { ok: false, got: m - 1, msg: 'Your number is right, but the decision doesn’t match it.' };
      if (cOk) return { ok: false, got: 0, msg: 'Right decision, but the number that proves it is wrong. In the exam, a yes or no with no correct number to back it up gets no marks.' };
      const other = subs.find(r => r.msg); return { ok: false, got: 0, msg: other ? other.msg : '' };
    }
  }
  return { ok: false };
}

function showAns(p) {
  if (p.show) return p.show;
  switch (p.type) {
    case 'num': return p.money ? gbp(p.ans) : (p.pre || '') + fmt(p.ans, p.dp) + (p.suf ? (/^[%°]/.test(p.suf) ? '' : ' ') + p.suf : '');
    case 'frac': return M(p.ans[0], p.ans[1]);
    case 'prob': return String(p.ans);
    case 'choice': return p.options[p.ans];
    case 'ratio': return p.ans.join(' : ');
    case 'time': return p.need12 ? twelve(p.ans) : hhmm(p.ans);
    case 'hm': return hm(p.ans);
    case 'coord': return `(${sn(p.ans[0])}, ${sn(p.ans[1])})`;
    case 'text': return p.accept[0];
    case 'decide': return `${p.options[p.ans]}. ${p.subs.map(s => (s.label ? s.label + ': ' : '') + showAns(s)).join(', ')}`;
  }
  return '';
}
function partMarks(p) { return p.m || 1; }
/* a decision ("Is X correct?") that only scores fully with the number that proves it */
function decide(q, yes, subs, m) { return { q, type: 'decide', options: ['Yes', 'No'], ans: yes ? 0 : 1, subs, m: m || 3 }; }
function qMarks(q) { return q.parts.reduce((s, p) => s + partMarks(p), 0); }

/* make a question from a topic. calc: true = calculator question, false = non-calculator, undefined = either */
function makeQ(topic, calc, opts = {}) {
  let gens = topic.gens.filter(g => calc === undefined || g.c === calc);
  if (opts.exam) { const ex = gens.filter(g => g.x); if (ex.length) gens = ex; }
  if (!gens.length) return null;
  const g = R.pick(gens);
  const q = g.f();
  q.topic = topic.id; q.calc = g.c;
  q.parts.forEach(p => { if (p.type === 'choice' && p.shuffle !== false) shuffleChoice(p); });
  return q;
}
function shuffleChoice(p) {
  const idx = R.shuffle(p.options.map((_, i) => i));
  p.options = idx.map(i => p.options[i]);
  p.ans = idx.indexOf(p.ans);
}

/* ---------- diagrams (SVG) ---------- */
const S = {
  wrap: (w, h, inner, label = 'Diagram') => `<svg class="dia" viewBox="0 0 ${rd(w, 1)} ${rd(h, 1)}" width="${rd(w, 1)}" role="img" aria-label="${label}">${inner}</svg>`,
  t: (x, y, s, a = 'middle', c = '') => `<text x="${rd(x, 1)}" y="${rd(y, 1)}" text-anchor="${a}"${c ? ` class="${c}"` : ''}>${s}</text>`,
  line: (x1, y1, x2, y2, c = 'edge') => `<line x1="${rd(x1, 1)}" y1="${rd(y1, 1)}" x2="${rd(x2, 1)}" y2="${rd(y2, 1)}" class="${c}"/>`,
  poly: (pts, c = 'shape') => `<polygon points="${pts.map(p => rd(p[0], 1) + ',' + rd(p[1], 1)).join(' ')}" class="${c}"/>`,
  note: '<text x="4" y="12" class="small">Not drawn accurately</text>'
};
function dRect(l, w, u) {
  const s = Math.min(240 / l, 150 / w), ox = 60, oy = 24, W = l * s, H = w * s;
  return S.wrap(ox + W + 30, oy + H + 30, S.poly([[ox, oy], [ox + W, oy], [ox + W, oy + H], [ox, oy + H]]) +
    S.t(ox + W / 2, oy + H + 20, `${fmt(l)} ${u}`) + S.t(ox - 8, oy + H / 2 + 4, `${fmt(w)} ${u}`, 'end'), 'rectangle');
}
function dLshape(W, H, a, b, u) {
  const s = Math.min(240 / W, 170 / H), ox = 62, oy = 30, P = (x, y) => [ox + x * s, oy + y * s];
  let g = S.note + S.poly([P(0, 0), P(a, 0), P(a, H - b), P(W, H - b), P(W, H), P(0, H)]);
  g += S.t(ox + a * s / 2, oy - 8, `${a} ${u}`) + S.t(ox - 8, oy + H * s / 2 + 4, `${H} ${u}`, 'end') +
    S.t(ox + W * s / 2, oy + H * s + 20, `${W} ${u}`) + S.t(ox + W * s + 8, oy + (H - b / 2) * s + 4, `${b} ${u}`, 'start');
  return S.wrap(ox + W * s + 64, oy + H * s + 32, g, 'L-shaped plan');
}
function dTri(b, h, u) {
  const s = Math.min(240 / b, 150 / h), ox = 30, oy = 24, B = b * s, Hh = h * s, ax = ox + B * 0.32;
  let g = S.note + S.poly([[ox, oy + Hh], [ox + B, oy + Hh], [ax, oy]]);
  g += S.line(ax, oy, ax, oy + Hh, 'dash') + `<polyline points="${rd(ax, 1)},${rd(oy + Hh - 10, 1)} ${rd(ax + 10, 1)},${rd(oy + Hh - 10, 1)} ${rd(ax + 10, 1)},${rd(oy + Hh, 1)}" class="edge thin"/>`;
  g += S.t(ox + B / 2, oy + Hh + 20, `${fmt(b)} ${u}`) + S.t(ax + 14, oy + Hh / 2, `${fmt(h)} ${u}`, 'start');
  return S.wrap(ox + B + 30, oy + Hh + 30, g, 'triangle');
}
function dCircle(v, isD, u) {
  const r = 70, cx = 100, cy = 90;
  let g = S.note + `<circle cx="${cx}" cy="${cy}" r="${r}" class="shape"/><circle cx="${cx}" cy="${cy}" r="3" class="dot"/>`;
  if (isD) g += S.line(cx - r, cy, cx + r, cy, 'edge') + S.t(cx, cy - 8, `${fmt(v)} ${u}`);
  else g += S.line(cx, cy, cx + r, cy, 'edge') + S.t(cx + r / 2, cy - 8, `${fmt(v)} ${u}`);
  return S.wrap(200, 180, g, 'circle');
}
function dSemiRect(l, w, u) {
  const s = Math.min(200 / l, 120 / w), ox = 60, oy = 26, L = l * s, Wd = w * s, r = Wd / 2;
  let g = S.note + `<path d="M${ox},${oy} H${rd(ox + L, 1)} A${rd(r, 1)},${rd(r, 1)} 0 0 1 ${rd(ox + L, 1)},${rd(oy + Wd, 1)} H${ox} Z" class="shape"/>`;
  g += S.line(ox + L, oy, ox + L, oy + Wd, 'dash');
  g += S.t(ox + L / 2, oy + Wd + 20, `${fmt(l)} ${u}`) + S.t(ox - 8, oy + Wd / 2 + 4, `${fmt(w)} ${u}`, 'end');
  return S.wrap(ox + L + r + 24, oy + Wd + 30, g, 'rectangle with a semicircle');
}
function dTrap(a, b, h, u) {
  const s = Math.min(240 / b, 130 / h), ox = 30, oy = 30, B = b * s, A = a * s, Hh = h * s, off = (B - A) / 2;
  let g = S.note + S.poly([[ox, oy + Hh], [ox + B, oy + Hh], [ox + off + A, oy], [ox + off, oy]]);
  g += S.line(ox + off, oy, ox + off, oy + Hh, 'dash');
  g += S.t(ox + off + A / 2, oy - 8, `${fmt(a)} ${u}`) + S.t(ox + B / 2, oy + Hh + 20, `${fmt(b)} ${u}`) + S.t(ox + off + 6, oy + Hh / 2 + 4, `${fmt(h)} ${u}`, 'start');
  return S.wrap(ox + B + 30, oy + Hh + 30, g, 'trapezium');
}
function dCuboid(l, w, h, u) {
  const s = Math.min(200 / (l + w * 0.5), 130 / (h + w * 0.4)), ox = 40, L = l * s, H = h * s, dx = w * s * 0.5, dy = w * s * 0.4, oy = 20 + dy;
  let g = S.note + S.poly([[ox, oy], [ox + L, oy], [ox + L, oy + H], [ox, oy + H]]) +
    S.poly([[ox, oy], [ox + dx, oy - dy], [ox + L + dx, oy - dy], [ox + L, oy]], 'shape top') +
    S.poly([[ox + L, oy], [ox + L + dx, oy - dy], [ox + L + dx, oy + H - dy], [ox + L, oy + H]], 'shape side');
  g += S.t(ox + L / 2, oy + H + 20, `${fmt(l)} ${u}`) + S.t(ox - 8, oy + H / 2 + 4, `${fmt(h)} ${u}`, 'end') + S.t(ox + L + dx / 2 + 8, oy + H - dy / 2 + 12, `${fmt(w)} ${u}`, 'start');
  return S.wrap(ox + L + dx + 70, oy + H + 30, g, 'cuboid');
}
function dCyl(r, h, u, isD) {
  const rx = 60, ry = 16, cx = 100, top = 30, H = 130;
  let g = S.note + `<path d="M${cx - rx},${top} V${top + H} A${rx},${ry} 0 0 0 ${cx + rx},${top + H} V${top}" class="shape"/>` +
    `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" class="shape top"/><circle cx="${cx}" cy="${top}" r="2.5" class="dot"/>`;
  g += isD ? S.line(cx - rx, top, cx + rx, top) + S.t(cx, top - 6 - ry, `${fmt(r)} ${u}`) : S.line(cx, top, cx + rx, top) + S.t(cx + rx / 2, top - 6 - ry + 4, `${fmt(r)} ${u}`);
  g += S.t(cx + rx + 8, top + H / 2, `${fmt(h)} ${u}`, 'start');
  return S.wrap(240, top + H + ry + 12, g, 'cylinder');
}
function dTriAngles(labels) { // labels at [bottom-left, bottom-right, top]
  const A = [30, 160], B = [250, 160], C = [95, 30];
  return S.wrap(280, 185, S.note + S.poly([A, B, C]) + S.t(A[0] + 30, A[1] - 10, labels[0]) + S.t(B[0] - 38, B[1] - 8, labels[1]) + S.t(C[0] + 4, C[1] + 34, labels[2]), 'triangle with angles');
}
function dLine(labels) { // angles on a straight line: 2 or 3 parts
  const cx = 150, cy = 120, L = 130;
  let g = S.note + S.line(cx - L, cy, cx + L, cy);
  const dirs = labels.length === 2 ? [62] : [48, 118];
  dirs.forEach(a => { const r = a * Math.PI / 180; g += S.line(cx, cy, cx + Math.cos(r) * 110, cy - Math.sin(r) * 110); });
  const mids = labels.length === 2 ? [31, 121] : [24, 83, 149];
  labels.forEach((t, i) => { const r = mids[i] * Math.PI / 180; g += S.t(cx + Math.cos(r) * 48, cy - Math.sin(r) * 48 + 5, t); });
  return S.wrap(300, 140, g, 'angles on a straight line');
}
function dPoint(labels) {
  const cx = 130, cy = 110; let g = S.note;
  const dirs = labels.length === 3 ? [20, 150, 255] : [20, 105, 200, 290];
  dirs.forEach(a => { const r = a * Math.PI / 180; g += S.line(cx, cy, cx + Math.cos(r) * 95, cy - Math.sin(r) * 95); });
  labels.forEach((t, i) => { const a1 = dirs[i], a2 = i + 1 < dirs.length ? dirs[i + 1] : dirs[0] + 360; const r = (a1 + a2) / 2 * Math.PI / 180; g += S.t(cx + Math.cos(r) * 45, cy - Math.sin(r) * 45 + 5, t); });
  return S.wrap(260, 220, g, 'angles around a point');
}
function dQuad(labels) {
  const P = [[40, 170], [260, 180], [230, 40], [90, 30]];
  const L = [[70, 158], [228, 164], [208, 66], [100, 58]];
  return S.wrap(300, 200, S.note + S.poly(P) + labels.map((t, i) => S.t(L[i][0], L[i][1], t)).join(''), 'quadrilateral');
}
function dGrid(points, lo = -5, hi = 5) {
  const s = 24, n = hi - lo, ox = 24, oy = 14, X = v => ox + (v - lo) * s, Y = v => oy + (hi - v) * s;
  let g = '';
  for (let v = lo; v <= hi; v++) { g += S.line(X(v), Y(lo), X(v), Y(hi), 'gl') + S.line(X(lo), Y(v), X(hi), Y(v), 'gl'); }
  g += S.line(X(lo), Y(0), X(hi), Y(0), 'ax') + S.line(X(0), Y(lo), X(0), Y(hi), 'ax');
  for (let v = lo; v <= hi; v++) { if (v) { g += S.t(X(v), Y(0) + 14, sn(v), 'middle', 'small') + S.t(X(0) - 5, Y(v) + 4, sn(v), 'end', 'small'); } }
  g += S.t(X(hi) + 10, Y(0) + 4, 'x', 'start') + S.t(X(0), Y(hi) - 2, 'y');
  points.forEach(p => { g += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.5" class="pt"/>` + S.t(X(p.x) + 8, Y(p.y) - 7, p.label, 'start', 'bold'); });
  return S.wrap(ox + n * s + 24, oy + n * s + 22, g, 'coordinate grid');
}
/* axes for graphs. o: {x0,x1,xs,y0,y1,ys,xl,yl,minor} */
function axes(o) {
  const W = o.w || 420, H = o.h || 300, L = 58, B = 46, Tm = 14, Rm = 18, pw = W - L - Rm, ph = H - B - Tm;
  const X = v => L + (v - o.x0) / (o.x1 - o.x0) * pw, Y = v => Tm + ph - (v - o.y0) / (o.y1 - o.y0) * ph;
  let g = '';
  if (o.minor) {
    if (!o.noXminor) for (let v = o.x0; v <= o.x1 + 1e-9; v += o.xs / o.minor) g += S.line(X(v), Tm, X(v), Tm + ph, 'gm');
    for (let v = o.y0; v <= o.y1 + 1e-9; v += o.ys / o.minor) g += S.line(L, Y(v), L + pw, Y(v), 'gm');
  }
  for (let v = o.x0; v <= o.x1 + 1e-9; v += o.xs) g += S.line(X(v), Tm, X(v), Tm + ph, 'gl') + (o.noXnums ? '' : S.t(X(v), Tm + ph + 16, fmt(rd(v, 4)), 'middle', 'small'));
  for (let v = o.y0; v <= o.y1 + 1e-9; v += o.ys) g += S.line(L, Y(v), L + pw, Y(v), 'gl') + S.t(L - 6, Y(v) + 4, fmt(rd(v, 4)), 'end', 'small');
  g += S.line(L, Tm + ph, L + pw, Tm + ph, 'ax') + S.line(L, Tm, L, Tm + ph, 'ax');
  g += S.t(L + pw / 2, H - 8, o.xl) + `<text transform="translate(15 ${rd(Tm + ph / 2, 1)}) rotate(-90)" text-anchor="middle">${o.yl}</text>`;
  return { g, X, Y, W, H, L, Tm, pw, ph };
}
function dScatter(pts, o, line) {
  const a = axes(o); let g = a.g;
  if (line) g += S.line(a.X(line[0]), a.Y(line[1]), a.X(line[2]), a.Y(line[3]), 'bestfit');
  pts.forEach(p => { const x = a.X(p[0]), y = a.Y(p[1]); g += `<path d="M${rd(x - 4, 1)},${rd(y - 4, 1)}L${rd(x + 4, 1)},${rd(y + 4, 1)}M${rd(x - 4, 1)},${rd(y + 4, 1)}L${rd(x + 4, 1)},${rd(y - 4, 1)}" class="cross"/>`; });
  return S.wrap(a.W, a.H, g, 'scatter graph');
}
function dConv(o, factor) {
  const a = axes(o); let g = a.g;
  const xEnd = Math.min(o.x1, o.y1 / factor);
  g += S.line(a.X(0), a.Y(0), a.X(xEnd), a.Y(xEnd * factor), 'plot');
  return S.wrap(a.W, a.H, g, 'conversion graph');
}
function dBars(cats, vals, o) {
  const a = axes(Object.assign({ x0: 0, x1: cats.length, xs: 1, noXnums: true }, o)); let g = a.g;
  const bw = a.pw / cats.length * 0.6;
  cats.forEach((c, i) => {
    const x = a.X(i + 0.5) - bw / 2, y = a.Y(vals[i]);
    g += `<rect x="${rd(x, 1)}" y="${rd(y, 1)}" width="${rd(bw, 1)}" height="${rd(a.Y(0) - y, 1)}" class="bar"/>` + S.t(a.X(i + 0.5), a.Y(0) + 16, c, 'middle', 'small');
  });
  return S.wrap(a.W, a.H, g, 'bar chart');
}
function table(head, rows, cls = '') {
  return `<div class="tw"><table class="qt ${cls}"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
