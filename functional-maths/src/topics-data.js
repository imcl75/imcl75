'use strict';
/* =====================================================================
   HANDLING DATA topics
   ===================================================================== */

function modeList(n, lo, hi) { // list with exactly one mode
  let v; do {
    v = []; for (let i = 0; i < n - 1; i++) v.push(R.int(lo, hi));
    v.push(R.pick(v));
    const c = {}; v.forEach(x => c[x] = (c[x] || 0) + 1);
    const top = Math.max(...Object.values(c));
    if (Object.values(c).filter(x => x === top).length === 1) return R.shuffle(v);
  } while (true);
}
function statsOf(v) {
  const s = v.slice().sort((a, b) => a - b), n = s.length, sum = s.reduce((a, b) => a + b, 0);
  const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  const c = {}; s.forEach(x => c[x] = (c[x] || 0) + 1); const top = Math.max(...Object.values(c));
  const mode = +Object.keys(c).find(k => c[k] === top);
  return { s, n, sum, mean: sum / n, med, mode, range: s[n - 1] - s[0] };
}

/* ---------------- Averages and range ---------------- */
addTopic({
  id: 'd-avg', area: 'dat', name: 'Averages and range', short: 'Mean, median, mode, range, comparing data',
  spec: ['Calculate the mean, median, mode and range of a set of data', 'Use the mean, median, mode and range to compare two sets of data'],
  learn: `
<div class="tw"><table class="qt"><tbody>
<tr><th>Mean</th><td>Add them all up, divide by how many there are</td></tr>
<tr><th>Median</th><td>Put them in order; the middle value. With an even number of values, it is halfway between the middle two</td></tr>
<tr><th>Mode</th><td>The value that appears most often</td></tr>
<tr><th>Range</th><td>Biggest − smallest. It measures how spread out the data is</td></tr></tbody></table></div>
<div class="key"><p>Data: 4, 7, 7, 9, 13 · Mean = 40 ÷ 5 = <b>8</b> · Median = <b>7</b> · Mode = <b>7</b> · Range = 13 − 4 = <b>9</b></p></div>
<h3>Comparing two sets of data</h3><p>Make <b>two</b> comparisons: one about the average, one about the spread. Then say what they mean in real life.</p>
<div class="key"><p>Class A: mean 64, range 30. Class B: mean 58, range 12.<br>“Class A scored higher on average. Class B’s scores were more consistent, because their range is smaller.”</p></div>
<h3>Finding a missing value</h3><p>If the mean of 5 numbers is 12, their total is 5 × 12 = 60. Take away the numbers you know to find the missing one.</p>
<div class="warn"><strong>Watch out:</strong> the range is a single number (13 − 4 = 9), not “4 to 13”. A smaller range means more consistent.</div>
<div class="tip"><strong>Exam tip:</strong> for the median, cross off values from each end in pairs. Write the ordered list down first.</div>`,
  gens: [
    { c: false, f() {
      const n = R.int(7, 10), v = modeList(n, 3, 30), st = statsOf(v), ask = R.pick(['median', 'mode', 'range']);
      const ctx = R.pick(['the number of books read by members of a reading group this year', 'the scores in a spelling test', 'the number of minutes some trains were late', 'the number of people at a weekly fitness class']);
      const steps = { median: [`In order: ${st.s.join(', ')}`, n % 2 ? `There are ${n} values, so the middle one is value number ${(n + 1) / 2}.` : `There are ${n} values, so the middle is between values ${n / 2} and ${n / 2 + 1}: ${st.s[n / 2 - 1]} and ${st.s[n / 2]}.`, n % 2 ? `Median = <b>${st.med}</b>` : `Median = (${st.s[n / 2 - 1]} + ${st.s[n / 2]}) ÷ 2 = <b>${fmt(st.med)}</b>`],
        mode: [`In order: ${st.s.join(', ')}`, `${st.mode} appears most often.`, `Mode = <b>${st.mode}</b>`],
        range: [`Biggest = ${st.s[n - 1]}, smallest = ${st.s[0]}`, `Range = ${st.s[n - 1]} − ${st.s[0]} = <b>${st.range}</b>`] };
      return { stem: `Here are ${ctx}:<div class="data">${v.join(', &nbsp;')}</div>`, parts: [{ q: `Work out the <b>${ask}</b>.`, type: 'num', ans: st[ask === 'median' ? 'med' : ask] }], steps: steps[ask] };
    } },
    { c: true, f() {
      const n = R.int(6, 10), v = []; for (let i = 0; i < n; i++) v.push(R.int(8, 24) + R.pick([0, 0, 0.5]));
      const st = statsOf(v), ans = rd(st.mean, 1);
      return { stem: `The temperature at noon (°C) on ${n} days was:<div class="data">${v.join(', &nbsp;')}</div>`, parts: [{ q: 'Work out the mean temperature. Give your answer to 1 decimal place.', type: 'num', ans, tol: 0.051, suf: '°C', show: ans.toFixed(1) + '°C', m: 2 }],
        steps: [`Total: ${v.join(' + ')} = ${fmt(st.sum)}`, `Divide by ${n}: ${fmt(st.sum)} ÷ ${n} = ${fmt(rd(st.mean, 4))}`, `To 1 d.p.: <b>${ans.toFixed(1)}°C</b>`] };
    } },
    { c: true, x: true, f() {
      let A, B, sa, sb;
      do { A = []; B = []; for (let i = 0; i < 6; i++) { A.push(R.int(40, 95)); B.push(R.int(50, 85)); } sa = statsOf(A); sb = statsOf(B); } while (Math.abs(sa.mean - sb.mean) < 1 || sa.range === sb.range);
      const aHigher = sa.mean > sb.mean, aCons = sa.range < sb.range;
      const st = (hi, cons) => `${hi} had the higher mean, and ${cons} was more consistent.`;
      const opts = [st('Group A', 'Group A'), st('Group A', 'Group B'), st('Group B', 'Group A'), st('Group B', 'Group B')];
      const ans = (aHigher ? 0 : 2) + (aCons ? 0 : 1);
      return { stem: 'Two groups of apprentices took the same maths quiz. Here are their scores (%).' + table(['Group', 'Scores'], [['Group A', A.join(', ')], ['Group B', B.join(', ')]]),
        parts: [{ q: 'Use the mean and the range to compare the two groups. Which statement is correct?', type: 'choice', options: opts, ans, shuffle: false, m: 4 }],
        steps: [`Group A: mean = ${sa.sum} ÷ 6 = ${fmt(rd(sa.mean, 1))}, range = ${sa.s[5]} − ${sa.s[0]} = ${sa.range}`, `Group B: mean = ${sb.sum} ÷ 6 = ${fmt(rd(sb.mean, 1))}, range = ${sb.s[5]} − ${sb.s[0]} = ${sb.range}`, `Group ${aHigher ? 'A' : 'B'} has the higher mean, so did better on average.`, `Group ${aCons ? 'A' : 'B'} has the smaller range, so its scores were more consistent.`, `<b>${opts[ans]}</b>`] };
    } },
    { c: false, f() {
      const n = R.int(4, 6), m = R.int(8, 25), known = []; for (let i = 0; i < n - 1; i++) known.push(R.int(Math.max(1, m - 8), m + 8));
      const miss = n * m - known.reduce((a, b) => a + b, 0);
      if (miss <= 0) return this.f();
      return { stem: `The mean of ${n} numbers is ${m}. ${n - 1} of the numbers are:<div class="data">${known.join(', &nbsp;')}</div>`,
        parts: [{ q: 'What is the missing number?', type: 'num', ans: miss, m: 2 }],
        steps: [`The total of all ${n} numbers is ${n} × ${m} = ${n * m}`, `The ones you know add up to ${known.join(' + ')} = ${known.reduce((a, b) => a + b, 0)}`, `Missing number = ${n * m} − ${known.reduce((a, b) => a + b, 0)} = <b>${miss}</b>`] };
    } },
    { c: true, x: true, f() {
      const ctx = R.pick([
        { a: 'Team A', b: 'Team B', intro: 'A manager compares two sales teams. Here are the number of sales each team made in 5 weeks.', what: 'made more sales on average', lo: 20, hi: 60, d: 'Week' },
        { a: 'Café North', b: 'Café South', intro: 'The owner of two cafés counts how many customers each café had on 5 days.', what: 'had more customers on average', lo: 80, hi: 160, d: 'Day' },
        { a: 'Driver A', b: 'Driver B', intro: 'A depot records how many parcels two drivers delivered on 5 days.', what: 'delivered more parcels on average', lo: 60, hi: 120, d: 'Day' }]);
      let A, B, sa, sb;
      do { A = []; B = []; for (let i = 0; i < 5; i++) { A.push(R.int(ctx.lo, ctx.hi)); B.push(R.int(ctx.lo + 8, ctx.hi - 8)); } sa = statsOf(A); sb = statsOf(B); } while (Math.abs(sa.mean - sb.mean) < 1.5 || Math.abs(sa.range - sb.range) < 3);
      const X = R.coin() ? 'a' : 'b', Y = R.coin() ? 'a' : 'b';
      const t1 = X === 'a' ? sa.mean > sb.mean : sb.mean > sa.mean, t2 = Y === 'a' ? sa.range < sb.range : sb.range < sa.range;
      const hiM = sa.mean > sb.mean ? ctx.a : ctx.b, loR = sa.range < sb.range ? ctx.a : ctx.b;
      return { stem: ctx.intro + table([''].concat([1, 2, 3, 4, 5].map(i => `${ctx.d} ${i}`)), [[ctx.a].concat(A), [ctx.b].concat(B)]) + `<p>Claim 1: “${ctx[X]} ${ctx.what}.”<br>Claim 2: “${ctx[Y]} was more consistent.”</p>`,
        parts: [decide('Is claim 1 correct? Choose Yes or No, and give the mean for each.', t1, [{ label: `Mean for ${ctx.a}`, type: 'num', ans: sa.mean }, { label: `Mean for ${ctx.b}`, type: 'num', ans: sb.mean }], 2),
          decide('Is claim 2 correct? Choose Yes or No, and give the range for each.', t2, [{ label: `Range for ${ctx.a}`, type: 'num', ans: sa.range }, { label: `Range for ${ctx.b}`, type: 'num', ans: sb.range }], 2)],
        steps: [`Mean for ${ctx.a}: (${A.join(' + ')}) ÷ 5 = ${sa.sum} ÷ 5 = ${fmt(sa.mean)}`, `Mean for ${ctx.b}: (${B.join(' + ')}) ÷ 5 = ${sb.sum} ÷ 5 = ${fmt(sb.mean)}`,
          `${hiM} has the higher mean, so claim 1 is <b>${t1 ? 'correct (Yes)' : 'not correct (No)'}</b>.`,
          `Range for ${ctx.a}: ${sa.s[4]} − ${sa.s[0]} = ${sa.range}. Range for ${ctx.b}: ${sb.s[4]} − ${sb.s[0]} = ${sb.range}`,
          `A smaller range means more consistent. ${loR} has the smaller range, so claim 2 is <b>${t2 ? 'correct (Yes)' : 'not correct (No)'}</b>.`] };
    } }
  ]
});

/* ---------------- Frequency tables and grouped data ---------------- */
addTopic({
  id: 'd-grouped', area: 'dat', name: 'Frequency tables and grouped data', short: 'Mean from a table, estimated mean, modal class',
  spec: ['Calculate the mean from a frequency table', 'Estimate the mean of a grouped frequency distribution from discrete data', 'Identify the modal class and the class containing the median'],
  learn: `
<h3>Mean from a frequency table</h3><p>The frequency tells you how many times each value happens. Multiply each value by its frequency, add these up, then divide by the total frequency.</p>
<div class="tw"><table class="qt"><thead><tr><th>Pets</th><th>Frequency (f)</th><th>Pets × f</th></tr></thead><tbody><tr><td>0</td><td>5</td><td>0</td></tr><tr><td>1</td><td>8</td><td>8</td></tr><tr><td>2</td><td>4</td><td>8</td></tr><tr><td>3</td><td>3</td><td>9</td></tr><tr><th>Total</th><th>20</th><th>25</th></tr></tbody></table></div>
<p>Mean = 25 ÷ 20 = <b>1.25 pets</b>. Divide by 20 (the number of people), not by 4 (the number of rows).</p>
<h3>Grouped data: estimating the mean</h3><p>You don’t know the exact values, so use the <b>midpoint</b> of each group.</p>
<div class="key"><p>Midpoint of 0–4 is (0 + 4) ÷ 2 = 2. Midpoint of 10–19 is 14.5.</p></div>
<ol class="steps"><li>Find each midpoint</li><li>Midpoint × frequency for each row</li><li>Add up that column</li><li>Divide by the total frequency</li></ol>
<p>It is an <b>estimate</b> because we used midpoints instead of the real values.</p>
<h3>Modal class and median class</h3><p>The modal class is the group with the highest frequency. For the median, find the middle position, (n + 1) ÷ 2, and count down the frequencies until you reach it.</p>
<div class="tip"><strong>Exam tip:</strong> add the extra columns to the table in the question. It keeps your working tidy and earns method marks.</div>`,
  gens: [
    { c: true, x: true, f() {
      const w = R.pick([5, 10]), g = R.int(4, 5), f = []; for (let i = 0; i < g; i++) f.push(R.int(2, 15));
      const lows = f.map((_, i) => i * w), mids = lows.map(l => (l + l + w - 1) / 2), N = f.reduce((a, b) => a + b, 0), fx = mids.map((m, i) => m * f[i]), sum = fx.reduce((a, b) => a + b, 0);
      const ans = rd(sum / N, 1), mi = f.indexOf(Math.max(...f)), modal = f.filter(x => x === f[mi]).length === 1;
      const labels = lows.map(l => `${l}–${l + w - 1}`);
      const ctx = R.pick(['Number of books borrowed from the school library per pupil this term', 'Number of goals scored by teams in a five-a-side league this season', 'Number of emails received in a day']);
      const parts = [{ q: 'Work out an estimate of the mean. Give your answer to 1 decimal place.', type: 'num', ans, tol: 0.051, show: ans.toFixed(1), m: 3 }];
      if (modal) parts.push({ q: 'Which is the modal class?', type: 'choice', options: labels, ans: mi, shuffle: false });
      return { stem: `${ctx}:` + table(['Group', 'Frequency'], labels.map((l, i) => [l, f[i]])), parts,
        steps: [table(['Group', 'Midpoint', 'Frequency', 'Midpoint × frequency'], labels.map((l, i) => [l, fmt(mids[i]), f[i], fmt(fx[i])]).concat([['Total', '', N, fmt(sum)]]), 'working'), `Estimated mean = ${fmt(sum)} ÷ ${N} = ${fmt(rd(sum / N, 3))}`, `To 1 d.p.: <b>${ans.toFixed(1)}</b>`].concat(modal ? [`Modal class: the highest frequency is ${f[mi]}, so <b>${labels[mi]}</b>`] : []) };
    } },
    { c: true, f() {
      const vals = [0, 1, 2, 3, 4], f = vals.map(() => R.int(1, 14)), N = f.reduce((a, b) => a + b, 0), fx = vals.map((v, i) => v * f[i]), sum = fx.reduce((a, b) => a + b, 0), ans = rd(sum / N, 2);
      const ctx = R.pick([['Number of children', 'families'], ['Number of pets', 'households'], ['Number of days off sick', 'staff']]);
      return { stem: `A survey asked some ${ctx[1]} a question.` + table([ctx[0], 'Frequency'], vals.map((v, i) => [v, f[i]])),
        parts: [{ q: `How many ${ctx[1]} were surveyed?`, type: 'num', ans: N }, { q: 'Work out the mean. Give your answer to 2 decimal places.', type: 'num', ans, tol: 0.0051, show: ans.toFixed(2), m: 2 }],
        steps: [`Total frequency: ${f.join(' + ')} = <b>${N}</b>`, table([ctx[0], 'Frequency', 'Value × frequency'], vals.map((v, i) => [v, f[i], fx[i]]).concat([['Total', N, sum]]), 'working'), `Mean = ${sum} ÷ ${N} = ${fmt(rd(sum / N, 4))}`, `To 2 d.p.: <b>${ans.toFixed(2)}</b>`] };
    } },
    { c: false, f() {
      const w = 10, g = 5, f = []; for (let i = 0; i < g; i++) f.push(R.int(1, 12));
      const N = f.reduce((a, b) => a + b, 0), labels = f.map((_, i) => `${i * w}–${i * w + w - 1}`);
      if (N % 2 === 0) f[g - 1]++;
      const N2 = f.reduce((a, b) => a + b, 0), pos = (N2 + 1) / 2;
      let c = 0, k = 0; while (c + f[k] < pos) { c += f[k]; k++; }
      const cum = []; let run = 0; f.forEach(x => { run += x; cum.push(run); });
      return { stem: 'Ages of people at a community event:' + table(['Age (years)', 'Frequency'], labels.map((l, i) => [l, f[i]])),
        parts: [{ q: 'Which group contains the median age?', type: 'choice', options: labels, ans: k, shuffle: false, m: 2 }],
        steps: [`Total: ${f.join(' + ')} = ${N2} people`, `The median is the (${N2} + 1) ÷ 2 = ${ord(pos)} person.`, `Running totals: ${cum.map((x, i) => `${labels[i]} → ${x}`).join(', ')}`, `The ${ord(pos)} person is in <b>${labels[k]}</b>`] };
    } }
  ]
});

/* ---------------- Probability ---------------- */
addTopic({
  id: 'd-prob', area: 'dat', name: 'Probability', short: 'Single and combined events, two-way tables',
  spec: ['Express probabilities as fractions, decimals and percentages', 'Work out the probability of combined events, using diagrams and tables, including two-way tables', 'Work out expected frequencies'],
  learn: `
<div class="formula">Probability = <span class="fr"><span>number of ways it can happen</span><span>total number of outcomes</span></span></div>
<p>Probabilities go from 0 (impossible) to 1 (certain). Write them as fractions, decimals or percentages: ${F(1, 4)} = 0.25 = 25%. Never write “1 in 4” or “1 : 4” in the exam.</p>
<div class="key"><p>A bag has 3 red, 5 blue and 2 green counters (10 altogether). P(blue) = ${F(5, 10)} = ${F(1, 2)}<br>P(<b>not</b> blue) = 1 − ${F(1, 2)} = ${F(1, 2)}</p></div>
<h3>Combined events: list every outcome</h3><p>Two spinners or two dice: draw a sample-space table.</p>
<div class="tw"><table class="qt small"><thead><tr><th>+</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><th>1</th><td>2</td><td>3</td><td>4</td></tr><tr><th>2</th><td>3</td><td>4</td><td>5</td></tr><tr><th>3</th><td>4</td><td>5</td><td>6</td></tr><tr><th>4</th><td>5</td><td>6</td><td>7</td></tr></tbody></table></div>
<p>12 outcomes; a total of 5 happens 3 times, so P(total of 5) = ${F(3, 12)} = ${F(1, 4)}.</p>
<h3>Two-way tables</h3><p>Rows and columns add up to totals. Use the totals to fill gaps, then read probabilities from the cells: the cell value over the overall total.</p>
<h3>Expected frequency</h3><div class="formula">Expected number = probability × number of trials</div><p>P(rain) = 0.3 over 30 days → 0.3 × 30 = <b>9 rainy days</b> expected.</p>
<div class="tip"><strong>Typing answers here:</strong> fractions like 3/10, decimals like 0.3, or percentages like 30% are all accepted.</div>`,
  gens: [
    { c: false, f() {
      const cols = ['red', 'blue', 'green', 'yellow'], n = cols.map(() => R.int(1, 9)), N = n.reduce((a, b) => a + b, 0), i = R.int(0, 3), not = R.coin();
      const k = not ? N - n[i] : n[i], [a, b] = simp(k, N);
      return { stem: `A bag has ${n.map((x, j) => `${x} ${cols[j]}`).join(', ').replace(/, ([^,]*)$/, ' and $1')} counters. One counter is taken at random.`,
        parts: [{ q: `What is the probability that it is ${not ? '<b>not</b> ' : ''}${cols[i]}?`, type: 'prob', ans: k / N, show: `${F(a, b)}${b !== N ? ` (or ${F(k, N)})` : ''}` }],
        steps: [`Total counters: ${n.join(' + ')} = ${N}`, not ? `Not ${cols[i]}: ${N} − ${n[i]} = ${k}` : `${cols[i]} counters: ${k}`, b !== N ? `Probability = ${F(k, N)} = <b>${F(a, b)}</b>` : `Probability = <b>${F(k, N)}</b>`] };
    } },
    { c: false, x: true, f() {
      const rows = ['Year 5', 'Year 6'], cols = ['School dinner', 'Packed lunch', 'Goes home'], d = rows.map(() => cols.map(() => R.int(4, 30)));
      const rt = d.map(r => r.reduce((a, b) => a + b, 0)), ct = cols.map((_, j) => d[0][j] + d[1][j]), T = rt[0] + rt[1];
      const hr = R.int(0, 1), hc = R.int(0, 2), miss = d[hr][hc];
      let pr, pc; do { pr = R.int(0, 1); pc = R.int(0, 2); } while (pr === hr && pc === hc);
      const cell = (r, c) => r === hr && c === hc ? '?' : d[r][c];
      const [a, b] = simp(d[pr][pc], T);
      return { stem: 'The table shows how pupils in two year groups have lunch.' + table([''].concat(cols, ['Total']), rows.map((r, i) => [r].concat(cols.map((_, j) => cell(i, j)), [rt[i]])).concat([['Total'].concat(ct, [T])])),
        parts: [{ q: 'What number is missing from the table?', type: 'num', ans: miss }, { q: `A pupil is picked at random. What is the probability they are in ${rows[pr]} <b>and</b> have ${cols[pc].toLowerCase()}?`, type: 'prob', ans: d[pr][pc] / T, show: `${F(d[pr][pc], T)}${b !== T ? ` = ${F(a, b)}` : ''}`, m: 2 }],
        steps: [`The ${rows[hr]} row total is ${rt[hr]}. The other cells in that row add up to ${rt[hr] - miss}.`, `Missing number = ${rt[hr]} − ${rt[hr] - miss} = <b>${miss}</b>`, `${rows[pr]} and ${cols[pc].toLowerCase()}: ${d[pr][pc]} pupils out of ${T} altogether`, `Probability = <b>${F(d[pr][pc], T)}</b>${b !== T ? ` = ${F(a, b)}` : ''}`] };
    } },
    { c: false, f() {
      const A = R.pick([4, 5, 6]), B = R.pick([3, 4, 6]), kind = R.int(0, 2);
      const grid = []; for (let i = 1; i <= A; i++) { const row = []; for (let j = 1; j <= B; j++) row.push(i + j); grid.push(row); }
      let target, test, desc;
      if (kind === 0) { target = R.int(4, A + B - 1); test = (i, j) => i + j === target; desc = `the total is ${target}`; }
      else if (kind === 1) { target = R.int(A + B - 3, A + B - 1); test = (i, j) => i + j > target; desc = `the total is more than ${target}`; }
      else { test = (i, j) => i === j; desc = 'both spinners land on the same number'; }
      let k = 0; for (let i = 1; i <= A; i++) for (let j = 1; j <= B; j++) if (test(i, j)) k++;
      const N = A * B, [a, b] = simp(k, N);
      const tbl = `<div class="tw"><table class="qt small"><thead><tr><th>+</th>${Array.from({ length: B }, (_, j) => `<th>${j + 1}</th>`).join('')}</tr></thead><tbody>${grid.map((r, i) => `<tr><th>${i + 1}</th>${r.map((v, j) => `<td${test(i + 1, j + 1) ? ' class="hit"' : ''}>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      return { stem: `Spinner A is numbered 1 to ${A}. Spinner B is numbered 1 to ${B}. Both are fair. Both spinners are spun and the numbers are added.`,
        parts: [{ q: `What is the probability that ${desc}?`, type: 'prob', ans: k / N, show: `${F(k, N)}${b !== N ? ` = ${F(a, b)}` : ''}`, m: 2 }],
        steps: [`Make a sample-space table of all ${A} × ${B} = ${N} outcomes:` + tbl, `The highlighted outcomes match: there are ${k}.`, `Probability = <b>${F(k, N)}</b>${b !== N ? ` = ${F(a, b)}` : ''}`] };
    } },
    { c: true, f() {
      const late = R.coin(), p = late ? R.pick([0.05, 0.1, 0.15, 0.2, 0.25]) : R.pick([0.02, 0.04, 0.05]), n = late ? R.pick([20, 40, 60, 80, 120, 200]) : R.pick([50, 100, 200, 300, 500]);
      const asPct = R.coin(), ps = asPct ? fmt(p * 100) + '%' : fmt(p);
      const ctx = ([[`The probability that a train is late is ${ps}.`, `${n} trains run this week. How many would you expect to be late?`], [`The probability that a battery from a factory is faulty is ${ps}.`, `A shop orders ${n} batteries. How many would you expect to be faulty?`]])[late ? 0 : 1];
      return { stem: ctx[0], parts: [{ q: ctx[1], type: 'num', ans: rd(p * n, 4) }], steps: ['Expected number = probability × number of trials', `${ps} × ${n} = ${fmt(p)} × ${n} = <b>${fmt(rd(p * n, 4))}</b>`] };
    } },
    { c: false, f() {
      const ev = R.pick([['a 6', 1], ['an even number', 3], ['a number less than 3', 2], ['a 5 or a 6', 2]]), side = R.pick(['heads', 'tails']);
      const [a, b] = simp(ev[1], 12);
      return { stem: 'A fair coin is flipped and a fair six-sided dice is rolled.', parts: [{ q: `What is the probability of getting ${side} <b>and</b> ${ev[0]}?`, type: 'prob', ans: ev[1] / 12, show: `${F(ev[1], 12)}${b !== 12 ? ` = ${F(a, b)}` : ''}`, m: 2 }],
        steps: ['List the outcomes: H1, H2, … H6, T1, T2, … T6. That is 2 × 6 = 12 outcomes.', `Outcomes that are ${side} and ${ev[0]}: ${ev[1]}`, `Probability = <b>${F(ev[1], 12)}</b>${b !== 12 ? ` = ${F(a, b)}` : ''}`] };
    } }
  ]
});

/* ---------------- Charts and scatter graphs ---------------- */
const SCAT = [
  { t: 'pos', xl: 'Hours of revision', yl: 'Test score (%)', x0: 0, x1: 10, xs: 2, y0: 0, y1: 100, ys: 20, m: 6.5, c: 25, nz: 9, what: 'test scores tend to go up as hours of revision go up' },
  { t: 'pos', xl: 'Temperature (°C)', yl: 'Ice creams sold', x0: 10, x1: 30, xs: 5, y0: 0, y1: 120, ys: 20, m: 4.5, c: -30, nz: 12, what: 'more ice creams are sold on warmer days' },
  { t: 'neg', xl: 'Age of car (years)', yl: 'Value (£1,000s)', x0: 0, x1: 10, xs: 2, y0: 0, y1: 20, ys: 4, m: -1.6, c: 18, nz: 2, what: 'older cars tend to be worth less' },
  { t: 'neg', xl: 'Temperature (°C)', yl: 'Hot drinks sold', x0: 0, x1: 25, xs: 5, y0: 0, y1: 80, ys: 20, m: -2.4, c: 72, nz: 8, what: 'fewer hot drinks are sold on warmer days' },
  { t: 'none', xl: 'Shoe size', yl: 'Reading test score', x0: 3, x1: 11, xs: 2, y0: 0, y1: 50, ys: 10, what: 'there is no link between shoe size and reading score' },
  { t: 'none', xl: 'House number', yl: 'Hours of TV a week', x0: 0, x1: 60, xs: 10, y0: 0, y1: 30, ys: 5, what: 'there is no link between house number and TV watched' }
];
function corr(p) { const n = p.length, mx = p.reduce((s, q) => s + q[0], 0) / n, my = p.reduce((s, q) => s + q[1], 0) / n; let sxy = 0, sxx = 0, syy = 0; p.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }); return sxy / Math.sqrt(sxx * syy); }
function scatPts(cx, n = 11) {
  for (let g = 0; g < 200; g++) { const p = scatTry(cx, n), r = corr(p); if (cx.t === 'none' ? Math.abs(r) < 0.2 : Math.abs(r) > 0.75) return p; }
  return scatTry(cx, n);
}
function scatTry(cx, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = rd(cx.x0 + (cx.x1 - cx.x0) * (0.05 + 0.9 * Math.random()), 1);
    const y = cx.t === 'none' ? cx.y0 + (cx.y1 - cx.y0) * (0.1 + 0.8 * Math.random()) : cx.m * x + cx.c + (Math.random() * 2 - 1) * cx.nz;
    pts.push([x, Math.min(cx.y1 * 0.98, Math.max(cx.y0 + (cx.y1 - cx.y0) * 0.02, y))]);
  }
  return pts;
}
addTopic({
  id: 'd-charts', area: 'dat', name: 'Charts and scatter graphs', short: 'Bar charts, pie charts, correlation, lines of best fit',
  spec: ['Read and interpret bar charts and pie charts', 'Draw and interpret scatter diagrams and recognise positive and negative correlation', 'Use a line of best fit to make estimates'],
  learn: `
<h3>Reading charts</h3><p>Before reading any values, check the scale: what is each grid line worth?</p>
<h3>Pie charts</h3><p>The whole circle (360°) stands for the total.</p>
<div class="formula">Angle = <span class="fr"><span>frequency</span><span>total</span></span> × 360°</div>
<div class="key"><p>60 people asked, 15 chose tea: 15 ÷ 60 × 360 = <b>90°</b>. Shortcut: 360 ÷ 60 = 6° per person, so 15 × 6 = 90°.</p></div>
<p>Going backwards: an 18° slice when 1 person = 6° is 18 ÷ 6 = <b>3 people</b>.</p>
<h3>Scatter graphs and correlation</h3>
<div class="tw"><table class="qt"><tbody>
<tr><th>Positive correlation</th><td>both go up together: points slope up from left to right</td></tr>
<tr><th>Negative correlation</th><td>one goes up as the other goes down: points slope down</td></tr>
<tr><th>No correlation</th><td>points scattered everywhere, no pattern</td></tr></tbody></table></div>
<p>Always explain what the correlation means in context: “older cars tend to be worth less”.</p>
<h3>Line of best fit</h3><p>A straight line through the middle of the points, with roughly as many points above it as below. To estimate, go up from the x-value to the line, then across to the y-axis.</p>
<div class="warn"><strong>Watch out:</strong> correlation does not prove one thing causes the other. And estimates far outside the data are unreliable.</div>`,
  gens: [
    { c: false, f() {
      const cx = R.pick(SCAT), pts = scatPts(cx), o = Object.assign({}, cx);
      const ans = { pos: 0, neg: 1, none: 2 }[cx.t];
      return { stem: 'The scatter graph shows some data.' + dScatter(pts, o), parts: [{ q: 'What type of correlation does the graph show?', type: 'choice', options: ['Positive correlation', 'Negative correlation', 'No correlation'], ans, shuffle: false }],
        steps: [cx.t === 'pos' ? 'The points slope upwards from left to right.' : cx.t === 'neg' ? 'The points slope downwards from left to right.' : 'The points are spread all over, with no pattern.', `So it shows <b>${['positive', 'negative', 'no'][ans]} correlation</b>: ${cx.what}.`] };
    } },
    { c: false, x: true, f() {
      const cx = R.pick(SCAT.filter(s => s.t !== 'none')), pts = scatPts(cx, 12), o = Object.assign({ minor: 2 }, cx);
      const yAt = x => cx.m * x + cx.c;
      let xa = cx.x0, xb = cx.x1; if (yAt(xa) < cx.y0) xa = (cx.y0 - cx.c) / cx.m; if (yAt(xb) < cx.y0) xb = (cx.y0 - cx.c) / cx.m; if (yAt(xa) > cx.y1) xa = (cx.y1 - cx.c) / cx.m; if (yAt(xb) > cx.y1) xb = (cx.y1 - cx.c) / cx.m;
      let x0; do { x0 = cx.x0 + cx.xs / 2 * R.int(1, 2 * (cx.x1 - cx.x0) / cx.xs - 1); } while (x0 <= Math.min(xa, xb) || x0 >= Math.max(xa, xb));
      const y0 = rd(yAt(x0), 1);
      return { stem: 'The scatter graph shows some data, with a line of best fit drawn on.' + dScatter(pts, o, [xa, yAt(xa), xb, yAt(xb)]),
        parts: [{ q: `Use the line of best fit to estimate the ${cx.yl.replace(/ \(.*\)/, '').toLowerCase()} when the ${cx.xl.replace(/ \(.*\)/, '').toLowerCase()} is ${fmt(x0)}.${/\(£/.test(cx.yl) ? ` Give your answer in ${cx.yl.match(/\((.*)\)/)[1]}.` : ''}`, type: 'num', ans: y0, tol: cx.ys / 4 + 0.01, show: `about ${fmt(y0)} (anything from ${fmt(rd(y0 - cx.ys / 4, 1))} to ${fmt(rd(y0 + cx.ys / 4, 1))} is fine)`, m: 2 }],
        steps: [`Find ${fmt(x0)} on the horizontal axis.`, 'Go straight up to the line of best fit, then straight across to the vertical axis.', `It reads about <b>${fmt(y0)}</b>.`] };
    } },
    { c: false, f() {
      const T = R.pick([36, 60, 72, 90, 120, 180]), per = 360 / T, cats = R.pick([['Tea', 'Coffee', 'Hot chocolate', 'Water'], ['Car', 'Bus', 'Walk', 'Bike'], ['Football', 'Netball', 'Swimming', 'Dance']]);
      let f; do { f = [R.int(1, T / 2), R.int(1, T / 3), R.int(1, T / 4)]; f.push(T - f[0] - f[1] - f[2]); } while (f[3] < 1);
      const i = R.int(0, 3);
      if (R.coin()) return { stem: `${T} people were asked a question. The results will be shown in a pie chart.` + table(['Answer', 'Frequency'], cats.map((c, j) => [c, f[j]])), parts: [{ q: `What angle should the “${cats[i]}” slice be?`, type: 'num', ans: f[i] * per, suf: '°', m: 2 }],
        steps: [`360° ÷ ${T} people = ${fmt(per)}° per person`, `${cats[i]}: ${f[i]} × ${fmt(per)}° = <b>${fmt(f[i] * per)}°</b>`] };
      return { stem: `A pie chart shows the answers of ${T} people. The “${cats[i]}” slice has an angle of ${fmt(f[i] * per)}°.`, parts: [{ q: `How many people chose ${cats[i]}?`, type: 'num', ans: f[i], m: 2 }],
        steps: [`360° ÷ ${T} people = ${fmt(per)}° per person`, `${fmt(f[i] * per)}° ÷ ${fmt(per)}° = <b>${f[i]} people</b>`] };
    } },
    { c: false, f() {
      const cats = R.pick([['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ['Car', 'Bus', 'Walk', 'Bike', 'Train']]), v = cats.map(() => R.int(2, 28));
      const i = R.int(0, 4); let j; do { j = R.int(0, 4); } while (j === i || v[j] === v[i]);
      const hi = v[i] > v[j] ? i : j, lo = hi === i ? j : i;
      const lbl = cats[0] === 'Mon' ? ['Visitors to the library each day', 'Visitors', 'Day'] : ['How staff travel to work', 'Number of staff', 'Travel'];
      return { stem: `${lbl[0]}:` + dBars(cats, v, { y0: 0, y1: 30, ys: 5, minor: 5, noXminor: true, xl: lbl[2], yl: lbl[1] }),
        parts: [{ q: `How many more for ${cats[hi]} than for ${cats[lo]}?`, type: 'num', ans: v[hi] - v[lo] }, { q: 'What is the total for all five bars?', type: 'num', ans: v.reduce((a, b) => a + b, 0) }],
        steps: ['Each small grid line is worth 1.', `${cats[hi]} = ${v[hi]}, ${cats[lo]} = ${v[lo]}`, `Difference: ${v[hi]} − ${v[lo]} = <b>${v[hi] - v[lo]}</b>`, `Total: ${v.join(' + ')} = <b>${v.reduce((a, b) => a + b, 0)}</b>`] };
    } }
  ]
});
