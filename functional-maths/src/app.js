'use strict';
/* =====================================================================
   app.js: pages, practice engine, check-up, mock exam, worksheets
   ===================================================================== */
const VERSION = '__VERSION__';
const KEY = 'fsm2-progress-v1';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const main = () => $('#main');

/* ---------- progress (kept in this browser) ---------- */
function loadP() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.t) return s; } catch (e) { } return { t: {}, checkup: null, mocks: [], exam: '' }; }
let P = loadP();
function saveP() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { } }
function record(id, ok) {
  const t = P.t[id] || (P.t[id] = { a: 0, c: 0, r: [] });
  t.a++; if (ok) t.c++; t.r.push(ok ? 1 : 0); if (t.r.length > 10) t.r.shift(); saveP();
}
function status(id) {
  const t = P.t[id];
  if (!t || !t.a) return { k: 'new', l: 'Not started' };
  const n = t.r.length, s = t.r.reduce((a, b) => a + b, 0), pct = s / n;
  if (n >= 6 && pct >= 0.8) return { k: 'secure', l: 'Secure' };
  if (pct >= 0.5) return { k: 'going', l: 'Getting there' };
  return { k: 'focus', l: 'Needs work' };
}
function recentPct(id) { const t = P.t[id]; if (!t || !t.r.length) return null; return t.r.reduce((a, b) => a + b, 0) / t.r.length; }

/* ---------- question rendering ---------- */
const HINTS = { frac: 'Type a fraction like 3/4, or a mixed number like 2 1/4', prob: 'A fraction, decimal or percentage', ratio: 'Like 2:3', coord: 'Like (3, -2)' };
function inputHTML(p, id) {
  if (p.type === 'choice') return `<div class="opts" role="radiogroup">${p.options.map((o, i) => `<button type="button" class="opt" role="radio" aria-checked="false" data-v="${i}">${o}</button>`).join('')}</div>`;
  if (p.type === 'hm') return `<div class="ans hm"><input id="${id}h" class="inp short" type="text" inputmode="numeric" autocomplete="off" aria-label="hours"><span class="suf">hours</span><input id="${id}m" class="inp short" type="text" inputmode="numeric" autocomplete="off" aria-label="minutes"><span class="suf">minutes</span></div>`;
  const pre = p.pre || (p.money ? '£' : ''), im = p.type === 'num' && !p.neg ? 'decimal' : 'text';
  let hint = p.hint || HINTS[p.type] || '';
  if (p.type === 'time') hint = p.need12 ? 'Like 7:45 pm' : 'Like 14:35';
  if (p.type === 'num' && p.neg && !p.hint) hint = 'Type a minus sign for a negative number';
  return `<div class="ans">${pre ? `<span class="pre">${pre}</span>` : ''}<input id="${id}" class="inp" type="text" inputmode="${im}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your answer">${p.suf ? `<span class="suf">${p.suf}</span>` : ''}</div>${hint ? `<div class="hintline">${hint}</div>` : ''}`;
}
function qHTML(q, o = {}) {
  const t = topicById(q.topic), mk = qMarks(q), uid = o.uid || ('q' + Math.random().toString(36).slice(2, 8));
  const calc = o.calcOverride != null ? o.calcOverride : q.calc;
  let s = `<div class="qhead">${o.num ? `<span class="qnum">${o.num}</span>` : ''}<span class="qtopic">${t ? t.name : ''}</span><span class="badge ${calc ? 'calc' : 'nocalc'}">${calc ? 'Calculator allowed' : 'No calculator'}</span><span class="marks">${mk} mark${mk > 1 ? 's' : ''}</span></div>`;
  s += `<div class="stem">${q.stem}</div>`;
  q.parts.forEach((p, i) => {
    const lab = q.parts.length > 1 ? `<span class="plab">(${'abcdef'[i]})</span>` : '';
    s += `<div class="part" data-i="${i}"><div class="pq">${lab}<div>${p.q}${partMarks(p) > 1 ? ` <span class="pm">[${partMarks(p)} marks]</span>` : ''}</div></div>`;
    if (o.print && p.type === 'choice') s += `<ul class="choicelist">${p.options.map(x => `<li>${x}</li>`).join('')}</ul>`;
    else s += o.print ? `<div class="answerline">Answer: <span></span>${p.suf ? ' ' + p.suf : ''}</div>` : inputHTML(p, uid + '_' + i);
    s += '<div class="fb" aria-live="polite"></div></div>';
  });
  return s;
}
function solutionHTML(q) {
  return `<h4>Worked solution</h4><ol class="wsteps">${q.steps.map(s => `<li>${s}</li>`).join('')}</ol><p class="final"><span>Answer${q.parts.length > 1 ? 's' : ''}:</span> ${q.parts.map((p, i) => (q.parts.length > 1 ? `(${'abcdef'[i]}) ` : '') + showAns(p)).join(' &nbsp;·&nbsp; ')}</p>`;
}
function wireChoices(el, onChange) {
  $$('.opts', el).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b || b.disabled) return;
    $$('.opt', g).forEach(x => x.setAttribute('aria-checked', x === b ? 'true' : 'false'));
    if (onChange) onChange();
  }));
}
function readPart(partEl, p) {
  if (p.type === 'choice') { const b = $('.opt[aria-checked="true"]', partEl); return b ? b.dataset.v : ''; }
  if (p.type === 'hm') { const [a, b] = $$('input', partEl); return a.value + '|' + b.value; }
  return $('input', partEl).value;
}
function setPart(partEl, p, v) {
  if (v == null) return;
  if (p.type === 'choice') { $$('.opt', partEl).forEach(x => x.setAttribute('aria-checked', x.dataset.v === String(v) ? 'true' : 'false')); return; }
  if (p.type === 'hm') { const [a, b] = $$('input', partEl); const [h, m] = String(v).split('|'); a.value = h || ''; b.value = m || ''; return; }
  $('input', partEl).value = v;
}
function shownInput(p, raw) {
  if (raw == null || String(raw).replace('|', '').trim() === '') return '<em>no answer</em>';
  if (p.type === 'choice') return p.options[+raw];
  if (p.type === 'hm') { const [h, m] = String(raw).split('|'); return `${esc(h || 0)} h ${esc(m || 0)} min`; }
  return esc((p.pre || (p.money ? '£' : '')) + raw + (p.suf ? ' ' + p.suf : ''));
}
function lockQ(card) { $$('input, .opt', card).forEach(x => { x.disabled = true; }); }

/* ---------- practice engine ---------- */
function practice(el, cfg) {
  let n = 0, score = 0; const log = [];
  function next() {
    if (cfg.total && n >= cfg.total) { cfg.onFinish && cfg.onFinish(log, score); return; }
    const q = cfg.next(n); n++;
    el.innerHTML = `<div class="pbar"><span>${cfg.total ? `Question ${n} of ${cfg.total}` : `Question ${n}`}</span><span>${score} correct so far</span>${cfg.total ? `<div class="track"><i style="width:${(n - 1) / cfg.total * 100}%"></i></div>` : ''}</div>
      <article class="qcard">${qHTML(q)}
      <div class="actions"><button class="btn primary" id="chk">Check answer</button><button class="btn ghost" id="hint">Hint</button><button class="btn ghost" id="how">${cfg.skipLabel || 'Show me how'}</button></div>
      <div class="hintbox" hidden></div><div class="sol" hidden>${solutionHTML(q)}</div></article>`;
    const card = $('.qcard', el); wireChoices(card);
    let checked = false;
    const first = $('input', card); if (first && cfg.autofocus !== false && window.matchMedia('(pointer:fine)').matches) first.focus();
    card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); $('#chk', card).click(); } });
    $('#hint', card).onclick = () => { const hb = $('.hintbox', card); hb.hidden = false; hb.innerHTML = `<b>Hint:</b> ${q.steps[0]}`; $('#hint', card).disabled = true; };
    const finish = (ok, results, gaveUp) => {
      checked = true; lockQ(card); if (cfg.record !== false) record(q.topic, ok); if (ok) score++;
      log.push({ q, ok, topic: q.topic });
      $$('.part', card).forEach((pe, i) => {
        const r = results ? results[i] : { ok: false }, fb = $('.fb', pe);
        fb.className = 'fb ' + (r.ok ? 'good' : 'bad');
        fb.innerHTML = r.ok ? '<b>Correct.</b>' : `${gaveUp ? '' : '<b>Not quite.</b> '}${r.msg ? esc(r.msg) + ' ' : ''}The answer is <b>${showAns(q.parts[i])}</b>.`;
      });
      const sol = $('.sol', card); sol.hidden = false;
      if (ok && cfg.collapseOnRight !== false) { sol.innerHTML = `<details><summary>See the worked solution</summary>${solutionHTML(q)}</details>`; }
      $('#hint', card).hidden = true; $('#how', card).hidden = true;
      const b = $('#chk', card); b.textContent = cfg.total && n >= cfg.total ? (cfg.finishLabel || 'See results') : 'Next question'; b.focus({ preventScroll: true });
      const top = card.getBoundingClientRect().top; if (!ok && top < 0) card.scrollIntoView({ behavior: 'smooth' });
    };
    $('#chk', card).onclick = () => {
      if (checked) { next(); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' }); return; }
      const parts = $$('.part', card), raws = parts.map((pe, i) => readPart(pe, q.parts[i]));
      const results = q.parts.map((p, i) => checkPart(p, raws[i]));
      if (results.every(r => r.blank)) { const fb = $('.fb', parts[0]); fb.className = 'fb info'; fb.textContent = 'Type an answer first, or press “' + (cfg.skipLabel || 'Show me how') + '”.'; return; }
      const fmtIssue = results.find(r => !r.ok && r.msg && !r.blank && /^(Right value|Include|Use the 24|Equivalent)/.test(r.msg));
      if (fmtIssue && !card.dataset.warned) { card.dataset.warned = 1; results.forEach((r, i) => { const fb = $('.fb', parts[i]); if (r.msg && !r.ok) { fb.className = 'fb info'; fb.textContent = r.msg + ' Change it and check again.'; } }); return; }
      finish(results.every(r => r.ok), results, false);
    };
    $('#how', card).onclick = () => finish(false, null, true);
  }
  next();
}

/* ---------- worked example viewer ---------- */
function workedExample(el, topic) {
  const q = makeQ(topic);
  el.innerHTML = `<article class="qcard example">${qHTML(q, { print: true })}<div class="wsteps-live"><h4>Worked solution</h4><ol class="wsteps"></ol><p class="final" hidden><span>Answer${q.parts.length > 1 ? 's' : ''}:</span> ${q.parts.map((p, i) => (q.parts.length > 1 ? `(${'abcdef'[i]}) ` : '') + showAns(p)).join(' &nbsp;·&nbsp; ')}</p></div>
    <div class="actions"><button class="btn primary" id="step">Show the first step</button><button class="btn ghost" id="all">Show all steps</button><button class="btn ghost" id="another">Another example</button></div></article>`;
  $$('.answerline', el).forEach(a => a.remove());
  let k = 0; const ol = $('.wsteps', el);
  const show = () => { if (k < q.steps.length) { ol.insertAdjacentHTML('beforeend', `<li>${q.steps[k]}</li>`); k++; } if (k >= q.steps.length) { $('.final', el).hidden = false; $('#step', el).disabled = true; $('#all', el).disabled = true; $('#step', el).textContent = 'All steps shown'; } else $('#step', el).textContent = 'Next step'; };
  $('#step', el).onclick = show;
  $('#all', el).onclick = () => { while (k < q.steps.length) show(); };
  $('#another', el).onclick = () => workedExample(el, topic);
}

/* ---------- printing ---------- */
function printHTML(html) {
  const pr = $('#printRoot'); pr.innerHTML = html;
  document.body.classList.add('printing');
  const done = () => { document.body.classList.remove('printing'); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => window.print(), 60);
}

/* ---------- pages ---------- */
function setPage(html, nav) {
  main().innerHTML = html;
  $$('#nav a').forEach(a => a.classList.toggle('on', a.dataset.nav === nav));
  window.scrollTo(0, 0);
}
function areaColour(a) { return { num: 'a-num', mea: 'a-mea', dat: 'a-dat' }[a]; }
function topicCard(t) {
  const st = status(t.id), rp = recentPct(t.id);
  return `<a class="tcard ${areaColour(t.area)}" href="#t/${t.id}"><span class="tname">${t.name}</span><span class="tshort">${t.short}</span>
    <span class="tfoot"><span class="chip ${st.k}">${st.l}</span>${rp != null ? `<span class="meter" title="Last ${P.t[t.id].r.length} answers"><i style="width:${Math.round(rp * 100)}%"></i></span>` : ''}</span></a>`;
}
function focusTopics() {
  return TOPICS.filter(t => { const s = status(t.id).k; return s === 'focus' || (s === 'new' && P.checkup && P.checkup.res[t.id] === false); });
}
function daysTo(d) { if (!d) return null; const ms = new Date(d + 'T09:00:00') - new Date(); return Math.ceil(ms / 864e5); }

function pHome() {
  const secure = TOPICS.filter(t => status(t.id).k === 'secure').length, started = TOPICS.filter(t => status(t.id).k !== 'new').length;
  const best = P.mocks.length ? Math.max(...P.mocks.map(m => Math.round((m.a + m.b) / (m.aMax + m.bMax) * 100))) : null;
  const ft = focusTopics(), dl = daysTo(P.exam);
  let next;
  if (!P.checkup) next = `<div class="next"><div><h2>Start with the check-up</h2><p>One question from each of the ${TOPICS.length} topics, so you can see what you already know and what to work on first. Takes about 30 to 40 minutes, with no time limit. Have a calculator and some paper ready.</p></div><a class="btn primary big" href="#checkup">Start the check-up</a></div>`;
  else if (ft.length) next = `<div class="next"><div><h2>Your focus topics</h2><p>These need the most work right now. Read the notes, try a worked example, then practise until the topic turns green.</p><div class="chips">${ft.slice(0, 8).map(t => `<a class="chip focus" href="#t/${t.id}">${t.name}</a>`).join('')}</div></div><a class="btn primary big" href="#quick">Quick 10 on these</a></div>`;
  else next = `<div class="next"><div><h2>Keep it ticking over</h2><p>Mix up your practice with a Quick 10, or sit a full mock exam to practise your timing.</p></div><div class="row"><a class="btn primary big" href="#quick">Quick 10</a><a class="btn big" href="#mock">Mock exam</a></div></div>`;
  setPage(`<section class="hero"><p class="eyebrow">Functional Skills · Level 2 · TQUK</p><h1>Maths practice</h1><p class="lede">Notes for every topic, worked examples, endless fresh questions, timed mock exams and printable worksheets.</p></section>
  ${next}
  <div class="stats">
    <div class="stat"><b>${secure}<small>/${TOPICS.length}</small></b><span>topics secure</span></div>
    <div class="stat"><b>${started}<small>/${TOPICS.length}</small></b><span>topics started</span></div>
    <div class="stat"><b>${best != null ? best + '%' : '–'}</b><span>best mock score</span></div>
    <div class="stat exam"><b>${dl != null && dl >= 0 ? dl : '–'}</b><span>${dl != null && dl >= 0 ? (dl === 1 ? 'day to the exam' : 'days to the exam') : '<label for="examdate">Exam date</label>'}</span><input id="examdate" type="date" value="${esc(P.exam || '')}" aria-label="Exam date"></div>
  </div>
  ${AREAS.map(a => `<section class="area"><h2 class="${areaColour(a.id)}">${a.name}</h2><p class="sub">${a.blurb}</p><div class="tgrid">${TOPICS.filter(t => t.area === a.id).map(topicCard).join('')}</div></section>`).join('')}
  <section class="area"><h2>How to use this</h2><ol class="howto"><li><b>Check-up</b> once, to find your starting point.</li><li>For each focus topic: read the <b>Learn</b> notes, step through a <b>worked example</b>, then <b>practise</b>. A topic is <i>secure</i> when you get at least 8 of your last 10 right.</li><li>Every week, do a <b>Quick 10</b> mixed practice so older topics stay fresh.</li><li>In the last few weeks, sit <b>mock exams</b> under timed conditions. Aim for 70% or more before the real thing.</li></ol></section>`, 'home');
  $('#examdate').addEventListener('change', e => { P.exam = e.target.value; saveP(); pHome(); });
}

function pTopic(id, tab) {
  const t = topicById(id); if (!t) return pHome();
  tab = ['learn', 'examples', 'practise'].includes(tab) ? tab : 'learn';
  const st = status(t.id), rec = P.t[t.id];
  setPage(`<a class="back" href="#home">← All topics</a>
  <section class="thead ${areaColour(t.area)}"><p class="eyebrow">${AREAS.find(a => a.id === t.area).name}</p><h1>${t.name}</h1>
  <div class="tmeta"><span class="chip ${st.k}">${st.l}</span>${rec ? `<span>${rec.c} of ${rec.a} right overall · ${rec.r.reduce((a, b) => a + b, 0)} of your last ${rec.r.length}</span>` : ''}</div></section>
  <nav class="tabs" role="tablist">${[['learn', 'Learn'], ['examples', 'Worked examples'], ['practise', 'Practise']].map(([k, l]) => `<a role="tab" aria-selected="${k === tab}" class="${k === tab ? 'on' : ''}" href="#t/${t.id}/${k}">${l}</a>`).join('')}</nav>
  <div id="tabbody"></div>`, 'home');
  const body = $('#tabbody');
  if (tab === 'learn') {
    body.innerHTML = `<div class="learn"><div class="spec"><h3>What you need to be able to do</h3><ul>${t.spec.map(s => `<li>${s}</li>`).join('')}</ul></div>${t.learn}
      <div class="actions"><a class="btn primary" href="#t/${t.id}/examples">Next: worked examples</a><button class="btn ghost" id="pnotes">Print these notes</button></div></div>`;
    $('#pnotes').onclick = () => {
      const ex = [makeQ(t), makeQ(t)];
      printHTML(`<div class="sheet"><h1>${t.name}</h1><p class="sheetsub">Functional Skills Maths Level 2 · notes</p><div class="spec"><h3>What you need to be able to do</h3><ul>${t.spec.map(s => `<li>${s}</li>`).join('')}</ul></div>${t.learn}<h2>Worked examples</h2>${ex.map((q, i) => `<div class="pq-print"><p class="qno">Example ${i + 1}</p>${q.stem}${q.parts.map((p, j) => `<p>${q.parts.length > 1 ? `(${'abcdef'[j]}) ` : ''}${p.q}</p>`).join('')}${solutionHTML(q)}</div>`).join('')}<p class="sheetfoot">Version ${VERSION}</p></div>`);
    };
  } else if (tab === 'examples') {
    body.innerHTML = '<p class="intro">Read the question, have a go in your head or on paper, then reveal the solution one step at a time.</p><div id="ex"></div>';
    workedExample($('#ex'), t);
  } else {
    const hasNC = t.gens.some(g => !g.c), hasC = t.gens.some(g => g.c);
    body.innerHTML = `<p class="intro">Fresh questions every time. Get 8 of your last 10 right to make this topic <b>secure</b>.${hasNC && hasC ? ' Some questions are no-calculator, like Section A of the exam.' : ''}</p><div id="pr"></div>`;
    practice($('#pr'), { next: () => makeQ(t) });
  }
}

function summaryHTML(log, title) {
  const by = {}; log.forEach(l => { (by[l.topic] = by[l.topic] || { n: 0, ok: 0 }); by[l.topic].n++; if (l.ok) by[l.topic].ok++; });
  const right = log.filter(l => l.ok).length;
  return `<section class="result"><h1>${title}</h1><p class="big">${right} out of ${log.length} correct</p>
  <div class="tw"><table class="qt res"><thead><tr><th>Topic</th><th>Result</th><th></th></tr></thead><tbody>${Object.keys(by).map(id => { const t = topicById(id), b = by[id]; return `<tr><th>${t.name}</th><td class="${b.ok === b.n ? 'ok' : 'no'}">${b.ok} / ${b.n}</td><td><a href="#t/${id}">${b.ok === b.n ? 'Practise' : 'Learn and practise'} →</a></td></tr>`; }).join('')}</tbody></table></div></section>`;
}

function pCheckup() {
  const prev = P.checkup;
  setPage(`<section class="hero small"><p class="eyebrow">Check-up</p><h1>Where am I now?</h1><p class="lede">${TOPICS.length} questions, one from each topic. There is no time limit. If you don’t know how to start a question, press <b>“I haven’t learnt this yet”</b> and move on: that is useful information, not a failure.</p></section>
  ${prev ? `<div class="note">You last did the check-up on ${new Date(prev.date).toLocaleDateString('en-GB')} and got ${Object.values(prev.res).filter(Boolean).length} out of ${Object.keys(prev.res).length}. Doing it again will replace that result.</div>` : ''}
  <div id="cu"><div class="actions"><button class="btn primary big" id="go">Start the check-up</button></div></div>`, 'checkup');
  $('#go').onclick = () => {
    const order = AREAS.flatMap(a => TOPICS.filter(t => t.area === a.id));
    practice($('#cu'), { total: order.length, next: n => makeQ(order[n]), skipLabel: 'I haven’t learnt this yet', finishLabel: 'See my results', onFinish: log => {
      P.checkup = { date: Date.now(), res: Object.fromEntries(log.map(l => [l.topic, l.ok])) }; saveP();
      const miss = log.filter(l => !l.ok).map(l => topicById(l.topic));
      $('#cu').innerHTML = summaryHTML(log, 'Check-up results') + (miss.length ? `<div class="next"><div><h2>Start with these ${miss.length} topics</h2><div class="chips">${miss.map(t => `<a class="chip focus" href="#t/${t.id}">${t.name}</a>`).join('')}</div></div><a class="btn primary big" href="#t/${miss[0].id}">Start: ${miss[0].name}</a></div>` : '<div class="next"><div><h2>Excellent</h2><p>Every topic right. Sit a mock exam to practise under timed conditions.</p></div><a class="btn primary big" href="#mock">Mock exam</a></div>');
      window.scrollTo(0, 0);
    } });
  };
}

function pQuick() {
  const w = { focus: 4, going: 3, new: 2, secure: 1 };
  const pool = []; TOPICS.forEach(t => { for (let i = 0; i < w[status(t.id).k]; i++) pool.push(t); });
  const picks = []; let last = null;
  for (let i = 0; i < 10; i++) { let t; let g = 0; do { t = R.pick(pool); g++; } while (t === last && g < 20); picks.push(t); last = t; }
  setPage(`<section class="hero small"><p class="eyebrow">Quick 10</p><h1>Mixed practice</h1><p class="lede">Ten questions from across the course, weighted towards the topics you find hardest.</p></section><div id="qk"></div>`, 'quick');
  practice($('#qk'), { total: 10, next: n => makeQ(picks[n]), onFinish: log => { $('#qk').innerHTML = summaryHTML(log, 'Quick 10 results') + '<div class="actions"><a class="btn primary" href="#quick" id="again">Another Quick 10</a><a class="btn ghost" href="#home">Home</a></div>'; $('#again').onclick = e => { e.preventDefault(); pQuick(); }; window.scrollTo(0, 0); } });
}

/* ---------- mock exam ---------- */
let MOCK = null, TIMER = null;
function loadMock() { try { const m = JSON.parse(localStorage.getItem(KEY + '-mock')); if (m && m.stage) return m; } catch (e) { } return null; }
function saveMock() { try { if (MOCK) localStorage.setItem(KEY + '-mock', JSON.stringify(MOCK)); else localStorage.removeItem(KEY + '-mock'); } catch (e) { } }
function buildSection(calc, target, maxQ) {
  const by = { num: [], mea: [], dat: [] };
  R.shuffle(TOPICS).forEach(t => { if (calc === false ? t.gens.some(g => !g.c) : true) by[t.area].push(t); });
  const order = []; let more = true;
  while (more) { more = false; for (const a of ['num', 'mea', 'dat']) if (by[a].length) { order.push(by[a].shift()); more = true; } }
  const qs = []; let marks = 0;
  for (let pass = 0; pass < 2 && marks < target; pass++) for (const t of order) {
    if (marks >= target || qs.length >= maxQ) break;
    if (pass === 1 && qs.filter(q => q.topic === t.id).length > 1) continue;
    let q = calc === false ? makeQ(t, false) : (makeQ(t, true, { exam: pass === 0 }) || makeQ(t, undefined, { exam: pass === 0 }));
    if (!q) continue;
    q.calc = calc !== false; qs.push(q); marks += qMarks(q);
  }
  return qs;
}
function pMock() {
  if (!MOCK) MOCK = loadMock();
  if (MOCK && (MOCK.stage === 'A' || MOCK.stage === 'B')) return mockSection();
  if (MOCK && MOCK.stage === 'done') return mockResults();
  const hist = P.mocks.slice(-5).reverse();
  setPage(`<section class="hero small"><p class="eyebrow">Mock exam</p><h1>Timed practice paper</h1><p class="lede">Set out like the real TQUK Level 2 assessment: a short no-calculator section, then a longer calculator section.</p></section>
  <div class="mockinfo">
    <div class="sec"><h3>Section A · No calculator</h3><p>About 15 marks, mostly shorter questions. About a quarter of the marks.</p><label>Time allowed <input id="ta" type="number" min="5" max="120" value="30"> minutes</label></div>
    <div class="sec"><h3>Section B · Calculator</h3><p>About 45 marks, mostly longer real-life problems. About three quarters of the marks.</p><label>Time allowed <input id="tb" type="number" min="10" max="240" value="90"> minutes</label></div>
  </div>
  <div class="note">Timings vary a little between papers, so check the exact times with your training provider and change them above if needed. Once you finish Section A you can’t go back to it, just like the real exam. In the real exam, marks are also given for correct working, so always write it down.</div>
  <div class="actions"><button class="btn primary big" id="start">Start Section A</button></div>
  ${hist.length ? `<h2 class="h2">Your recent mocks</h2><div class="tw"><table class="qt"><thead><tr><th>Date</th><th>Section A</th><th>Section B</th><th>Total</th></tr></thead><tbody>${hist.map(m => `<tr><th>${new Date(m.date).toLocaleDateString('en-GB')}</th><td>${m.a}/${m.aMax}</td><td>${m.b}/${m.bMax}</td><td><b>${Math.round((m.a + m.b) / (m.aMax + m.bMax) * 100)}%</b></td></tr>`).join('')}</tbody></table></div>` : ''}`, 'mock');
  $('#start').onclick = () => {
    const ta = Math.max(5, +$('#ta').value || 30), tb = Math.max(10, +$('#tb').value || 90);
    MOCK = { stage: 'A', mins: { A: ta, B: tb }, qs: { A: buildSection(false, 15, 8), B: buildSection(true, 42, 15) }, ans: { A: {}, B: {} }, endAt: Date.now() + ta * 60000, started: Date.now() };
    saveMock(); mockSection();
  };
}
function mockSection() {
  const sec = MOCK.stage, qs = MOCK.qs[sec], total = qs.reduce((s, q) => s + qMarks(q), 0);
  setPage(`<div class="timerbar"><span><b>Section ${sec}</b> · ${sec === 'A' ? 'No calculator' : 'Calculator allowed'} · ${total} marks</span><span class="clock" id="clock">--:--</span></div>
  <div class="examqs">${qs.map((q, i) => `<article class="qcard exam" data-q="${i}">${qHTML(q, { num: 'Q' + (i + 1), uid: `m${sec}${i}` })}<details class="work"><summary>Working space</summary><textarea aria-label="Working for question ${i + 1}" data-w="${i}">${esc((MOCK.ans[sec]['w' + i]) || '')}</textarea></details></article>`).join('')}</div>
  <div class="finishbox" id="fin"><button class="btn primary big" id="finish">Finish Section ${sec}</button></div>`, 'mock');
  // restore answers
  $$('.qcard.exam').forEach(card => { const i = +card.dataset.q, q = qs[i]; $$('.part', card).forEach((pe, j) => setPart(pe, q.parts[j], MOCK.ans[sec][i + '_' + j])); });
  const store = () => { $$('.qcard.exam').forEach(card => { const i = +card.dataset.q, q = qs[i]; $$('.part', card).forEach((pe, j) => { MOCK.ans[sec][i + '_' + j] = readPart(pe, q.parts[j]); }); }); $$('textarea[data-w]').forEach(t => { MOCK.ans[sec]['w' + t.dataset.w] = t.value; }); saveMock(); };
  wireChoices($('.examqs'), store);
  $('.examqs').addEventListener('input', store);
  $('#finish').onclick = () => {
    const unanswered = qs.reduce((s, q, i) => s + q.parts.filter((p, j) => { const v = MOCK.ans[sec][i + '_' + j]; return v == null || String(v).replace('|', '').trim() === ''; }).length, 0);
    $('#fin').innerHTML = `<div class="confirm"><p>${unanswered ? `You have <b>${unanswered}</b> unanswered part${unanswered > 1 ? 's' : ''}. ` : ''}${sec === 'A' ? 'Once you move on you can’t come back to Section A.' : 'This will end the exam and mark your answers.'}</p><div class="row"><button class="btn primary" id="yes">${sec === 'A' ? 'Go to Section B' : 'Finish and mark'}</button><button class="btn ghost" id="no">Keep working</button></div></div>`;
    $('#yes').onclick = () => { store(); endSection(); };
    $('#no').onclick = () => mockSection();
  };
  tick();
  TIMER = setInterval(tick, 1000);
}
function tick() {
  const el = $('#clock'); if (!el || !MOCK) { clearInterval(TIMER); return; }
  const left = Math.max(0, Math.round((MOCK.endAt - Date.now()) / 1000));
  el.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')} left`;
  el.classList.toggle('low', left < 300);
  if (left <= 0) { clearInterval(TIMER); $$('.qcard.exam input, .qcard.exam .opt').forEach(x => x.disabled = true); $('#fin').innerHTML = `<div class="confirm"><p><b>Time is up.</b></p><button class="btn primary" id="yes">${MOCK.stage === 'A' ? 'Go to Section B' : 'Mark my answers'}</button></div>`; $('#yes').onclick = endSection; }
}
function endSection() {
  clearInterval(TIMER);
  if (MOCK.stage === 'A') { MOCK.stage = 'B'; MOCK.endAt = Date.now() + MOCK.mins.B * 60000; saveMock(); mockSection(); return; }
  MOCK.stage = 'done';
  const sc = { A: 0, B: 0 }, mx = { A: 0, B: 0 };
  ['A', 'B'].forEach(s => MOCK.qs[s].forEach((q, i) => {
    let all = true;
    q.parts.forEach((p, j) => { const r = checkPart(p, MOCK.ans[s][i + '_' + j]); mx[s] += partMarks(p); if (r.ok) sc[s] += partMarks(p); else all = false; });
    record(q.topic, all);
  }));
  MOCK.score = { a: sc.A, aMax: mx.A, b: sc.B, bMax: mx.B };
  P.mocks.push(Object.assign({ date: Date.now() }, MOCK.score)); saveP(); saveMock();
  mockResults();
}
function mockResults() {
  const m = MOCK.score, pct = Math.round((m.a + m.b) / (m.aMax + m.bMax) * 100);
  const by = {};
  ['A', 'B'].forEach(s => MOCK.qs[s].forEach((q, i) => { const b = by[q.topic] || (by[q.topic] = { got: 0, max: 0 }); q.parts.forEach((p, j) => { b.max += partMarks(p); if (checkPart(p, MOCK.ans[s][i + '_' + j]).ok) b.got += partMarks(p); }); }));
  const weak = Object.keys(by).filter(id => by[id].got < by[id].max).sort((x, y) => by[x].got / by[x].max - by[y].got / by[y].max);
  setPage(`<section class="result"><p class="eyebrow">Mock exam results</p><h1>${m.a + m.b} out of ${m.aMax + m.bMax} <small>(${pct}%)</small></h1>
  <div class="stats"><div class="stat"><b>${m.a}<small>/${m.aMax}</small></b><span>Section A</span></div><div class="stat"><b>${m.b}<small>/${m.bMax}</small></b><span>Section B</span></div><div class="stat"><b>${pct}%</b><span>${pct >= 70 ? 'well on track' : pct >= 55 ? 'getting close' : 'keep practising'}</span></div></div>
  <p class="note">This page marks the final answers only. The real exam also gives marks for correct working, so your real score could be higher if you show every step.</p>
  ${weak.length ? `<div class="next"><div><h2>Topics to work on</h2><div class="chips">${weak.map(id => `<a class="chip focus" href="#t/${id}">${topicById(id).name} (${by[id].got}/${by[id].max})</a>`).join('')}</div></div></div>` : ''}
  <div class="actions"><button class="btn primary" id="newmock">Start a new mock</button><a class="btn ghost" href="#home">Home</a></div>
  <h2 class="h2">Go through your answers</h2></section>
  ${['A', 'B'].map(s => `<h3 class="sechead">Section ${s}</h3>` + MOCK.qs[s].map((q, i) => {
    const res = q.parts.map((p, j) => ({ r: checkPart(p, MOCK.ans[s][i + '_' + j]), raw: MOCK.ans[s][i + '_' + j] }));
    return `<details class="qcard review ${res.every(x => x.r.ok) ? 'right' : 'wrong'}"><summary><span class="qnum">Q${i + 1}</span> ${topicById(q.topic).name} <span class="rs">${res.reduce((a, x, j) => a + (x.r.ok ? partMarks(q.parts[j]) : 0), 0)} / ${qMarks(q)}</span></summary>
    <div class="stem">${q.stem}</div>${q.parts.map((p, j) => `<div class="part"><div class="pq">${q.parts.length > 1 ? `<span class="plab">(${'abcdef'[j]})</span>` : ''}<div>${p.q}</div></div><div class="fb ${res[j].r.ok ? 'good' : 'bad'}">Your answer: ${shownInput(p, res[j].raw)} ${res[j].r.ok ? '✓' : `✗ &nbsp;Correct answer: <b>${showAns(p)}</b>`}</div></div>`).join('')}
    ${MOCK.ans[s]['w' + i] ? `<div class="mywork"><b>Your working:</b><pre>${esc(MOCK.ans[s]['w' + i])}</pre></div>` : ''}<div class="sol">${solutionHTML(q)}</div></details>`;
  }).join('')).join('')}`, 'mock');
  $('#newmock').onclick = () => { MOCK = null; saveMock(); pMock(); };
}

/* ---------- worksheets ---------- */
function pSheets() {
  setPage(`<section class="hero small"><p class="eyebrow">Worksheets</p><h1>Printable practice</h1><p class="lede">Pick topics, make a sheet of fresh questions with space for working, and print it with the answers on a separate page.</p></section>
  <form class="sheetform" id="sf">
    ${AREAS.map(a => `<fieldset><legend><label><input type="checkbox" class="all" data-a="${a.id}"> ${a.name}</label></legend>${TOPICS.filter(t => t.area === a.id).map(t => `<label class="tk"><input type="checkbox" name="t" value="${t.id}"${status(t.id).k === 'focus' ? ' checked' : ''}> ${t.name}</label>`).join('')}</fieldset>`).join('')}
    <div class="opts-row">
      <label>Questions <select id="cnt"><option>6</option><option selected>10</option><option>15</option><option>20</option></select></label>
      <label>Calculator <select id="calc"><option value="any">Mixed</option><option value="nc">No calculator only</option><option value="c">Calculator only</option></select></label>
      <label class="tk"><input type="checkbox" id="ans" checked> Answers page</label>
      <label class="tk"><input type="checkbox" id="sol" checked> Include worked solutions</label>
    </div>
    <div class="actions"><button class="btn primary" type="submit">Make worksheet</button></div>
  </form><div id="sheetout"></div>`, 'sheets');
  $$('.all').forEach(c => c.onchange = () => $$(`input[name=t]`).forEach(x => { if (topicById(x.value).area === c.dataset.a) x.checked = c.checked; }));
  $('#sf').onsubmit = e => {
    e.preventDefault();
    let ids = $$('input[name=t]:checked').map(x => x.value);
    const out = $('#sheetout');
    if (!ids.length) { out.innerHTML = '<p class="note">Tick at least one topic.</p>'; return; }
    const calc = { any: undefined, nc: false, c: true }[$('#calc').value];
    const usable = ids.map(topicById).filter(t => calc === undefined || t.gens.some(g => g.c === calc));
    if (!usable.length) { out.innerHTML = `<p class="note">None of those topics have ${calc ? 'calculator' : 'no-calculator'} questions. Choose “Mixed”, or other topics.</p>`; return; }
    const n = +$('#cnt').value, qs = []; let pool = [];
    for (let i = 0; i < n; i++) { if (!pool.length) pool = R.shuffle(usable); qs.push(makeQ(pool.shift(), calc)); }
    const withAns = $('#ans').checked, withSol = $('#sol').checked;
    const html = `<div class="sheet"><div class="sheethead"><div><h1>Functional Maths Level 2 · Practice</h1><p class="sheetsub">${[...new Set(qs.map(q => topicById(q.topic).name))].join(' · ')}</p></div><div class="namebox">Name ____________________<br>Date ____________________</div></div>
      ${qs.map((q, i) => `<div class="pq-print"><p class="qno">Question ${i + 1} <span>${q.calc ? 'Calculator allowed' : 'No calculator'} · ${qMarks(q)} mark${qMarks(q) > 1 ? 's' : ''}</span></p>${q.stem}${q.parts.map((p, j) => `<p class="ppart">${q.parts.length > 1 ? `(${'abcdef'[j]}) ` : ''}${p.q}</p>${p.type === 'choice' ? `<ul class="choicelist">${p.options.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}`).join('')}<div class="workspace"></div><p class="ansline">Answer${q.parts.length > 1 ? 's' : ''}: ____________________________</p></div>`).join('')}
      ${withAns ? `<div class="answers"><h2>Answers</h2>${qs.map((q, i) => `<div class="ansitem"><p class="qno">Question ${i + 1}: ${q.parts.map((p, j) => (q.parts.length > 1 ? `(${'abcdef'[j]}) ` : '') + showAns(p)).join(' · ')}</p>${withSol ? `<ol class="wsteps">${q.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}</div>`).join('')}</div>` : ''}
      <p class="sheetfoot">Version ${VERSION}</p></div>`;
    out.innerHTML = `<div class="actions"><button class="btn primary" id="print">Print worksheet</button><button class="btn ghost" id="remake">New questions</button></div><div class="preview">${html}</div>`;
    $('#print').onclick = () => printHTML(html);
    $('#remake').onclick = () => $('#sf').requestSubmit();
    out.scrollIntoView({ behavior: 'smooth' });
  };
}

/* ---------- exam toolkit ---------- */
function pToolkit() {
  setPage(`<section class="hero small"><p class="eyebrow">Exam toolkit</p><h1>Before the exam</h1><p class="lede">How the paper works, the formulae to learn, and how to pick up every mark you can.</p></section>
  <div class="learn toolkit">
  <h3>The exam</h3>
  <div class="tw"><table class="qt"><tbody>
  <tr><th>Section A</th><td>No calculator. Around a quarter of the marks. Short questions on number skills: written methods, fractions, percentages, rounding, reading tables.</td></tr>
  <tr><th>Section B</th><td>Calculator allowed. Around three quarters of the marks. Longer real-life problems that mix topics, often ending with a decision.</td></tr>
  <tr><th>Format</th><td>On paper or on screen, depending on your centre. On screen, there is a built-in calculator for Section B, and you type working into answer boxes.</td></tr>
  <tr><th>Timing</th><td>Commonly about 30 minutes for Section A and about 90 minutes for Section B. Check the exact times with your provider.</td></tr></tbody></table></div>
  <h3>How to answer a real-life problem</h3>
  <ol class="steps"><li><b>Read</b> the whole question twice. Underline the numbers and what it actually asks.</li><li><b>Plan</b>: what do I need to work out first? Write a short list.</li><li><b>Calculate</b>, writing every step with a label (“Cost of paint = …”).</li><li><b>Check</b>: does it make sense? Estimate, or work backwards.</li><li><b>Answer the question</b> in words, with units: “Yes, she can afford it. She will have £12.40 left.”</li></ol>
  <div class="tip"><strong>Most marks are for working.</strong> A wrong final answer with clear working can still earn most of the marks. A right answer with no working may get only one.</div>
  <h3>Formulae you must remember</h3>
  <div class="tw"><table class="qt"><tbody>
  <tr><th>Area of a rectangle</th><td>length × width</td></tr><tr><th>Area of a triangle</th><td>½ × base × height</td></tr>
  <tr><th>Area of a circle</th><td>π × r²</td></tr><tr><th>Circumference</th><td>π × d</td></tr>
  <tr><th>Volume of a cuboid</th><td>length × width × height</td></tr><tr><th>Volume of a cylinder</th><td>π × r² × h</td></tr>
  <tr><th>Mean</th><td>total ÷ how many</td></tr><tr><th>Range</th><td>largest − smallest</td></tr>
  <tr><th>Speed</th><td>distance ÷ time</td></tr><tr><th>Density</th><td>mass ÷ volume</td></tr>
  <tr><th>Percentage change</th><td>change ÷ original × 100</td></tr><tr><th>Probability</th><td>ways it can happen ÷ total outcomes</td></tr></tbody></table></div>
  <p>Formulae for other shapes (such as a trapezium, prism, cone or sphere) are given in the question.</p>
  <h3>Units to know</h3>
  <div class="tw"><table class="qt"><tbody><tr><th>Length</th><td>10 mm = 1 cm · 100 cm = 1 m · 1,000 m = 1 km</td></tr><tr><th>Mass</th><td>1,000 g = 1 kg · 1,000 kg = 1 tonne</td></tr><tr><th>Capacity</th><td>1,000 ml = 1 litre · 1 cm³ = 1 ml · 1 m³ = 1,000 litres</td></tr><tr><th>Time</th><td>60 minutes = 1 hour · 15 min = 0.25 h · 20 min = ⅓ h · 30 min = 0.5 h · 45 min = 0.75 h</td></tr></tbody></table></div>
  <h3>Calculator tips</h3>
  <ul><li>Use brackets: (45 + 30) × 2 is not the same as 45 + 30 × 2.</li><li>Use the π button.</li><li>Never type 2.15 for 2 hours 15 minutes. Type 2.25, or 2 + 15 ÷ 60.</li><li>Money answers: if the display shows 4.5, write £4.50.</li><li>Write down the full calculator display before rounding, then round.</li></ul>
  <h3>Common slips</h3>
  <ul><li>Adding the bottom numbers of fractions.</li><li>Dividing by the new amount instead of the original for percentage change.</li><li>Adding 20% back on for reverse percentages, instead of dividing by 0.8.</li><li>Forgetting to round <b>up</b> for things like packs, coaches or tins.</li><li>Using the diameter instead of the radius in π × r².</li><li>Mixing units: cm with m, minutes with hours.</li><li>Not answering the actual question: giving the total when it asked for the change.</li></ul>
  <h3>On the day</h3>
  <ul><li>Bring two black pens, a pencil, rubber, ruler, protractor and calculator (check your centre allows your model).</li><li>Start with questions you can do, then go back.</li><li>Keep an eye on the clock: roughly two minutes per mark.</li><li>Leave nothing blank. Write down any method you can.</li></ul>
  </div>`, 'toolkit');
}

/* ---------- router ---------- */
function route() {
  clearInterval(TIMER);
  const [page, a, b] = (location.hash.slice(1) || 'home').split('/');
  if (page === 't') return pTopic(a, b);
  if (page === 'checkup') return pCheckup();
  if (page === 'quick') return pQuick();
  if (page === 'mock') return pMock();
  if (page === 'sheets') return pSheets();
  if (page === 'toolkit') return pToolkit();
  pHome();
}
window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', () => {
  $('#ver').textContent = VERSION;
  $('#reset').onclick = () => {
    const box = $('#resetbox');
    box.innerHTML = `<span>Clear all progress, check-up and mock results on this device?</span> <button class="btn small danger" id="ry">Yes, clear it</button> <button class="btn small ghost" id="rn">Cancel</button>`;
    $('#ry').onclick = () => { P = { t: {}, checkup: null, mocks: [], exam: '' }; saveP(); MOCK = null; saveMock(); box.textContent = 'Progress cleared.'; route(); };
    $('#rn').onclick = () => { box.innerHTML = ''; };
  };
  route();
});
