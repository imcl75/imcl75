'use strict';
/* =====================================================================
   NUMBER topics
   ===================================================================== */

/* ---------------- Big numbers and negative numbers ---------------- */
addTopic({
  id: 'n-num', area: 'num', name: 'Big numbers and negative numbers', short: 'Place value, ordering, negatives in real life',
  spec: ['Read, write, order and compare positive and negative numbers of any size', 'Calculate with numbers up to one million', 'Work with negative numbers in real contexts, such as temperatures and bank balances'],
  learn: `
<h3>Place value</h3>
<p>Each column is worth ten times the column to its right. Commas split big numbers into groups of three, which makes them easier to read.</p>
<div class="tw"><table class="qt pv"><thead><tr><th>Millions</th><th>Hundred thousands</th><th>Ten thousands</th><th>Thousands</th><th>Hundreds</th><th>Tens</th><th>Ones</th></tr></thead>
<tbody><tr><td>3</td><td>0</td><td>4</td><td>0</td><td>0</td><td>0</td><td>6</td></tr></tbody></table></div>
<p>3,040,006 is <em>three million, forty thousand and six</em>. Zeros hold the place of empty columns, so never leave them out.</p>
<h3>Ordering numbers</h3>
<ul><li>Compare the biggest place value first, then work right.</li>
<li>With decimals, line up the decimal points: 0.45 is bigger than 0.405, because 4 tenths and 5 hundredths beats 4 tenths and 0 hundredths.</li>
<li>Any negative number is smaller than zero. The further a negative is from zero, the <strong>smaller</strong> it is: −12 is less than −3.</li></ul>
<h3>Negative numbers in real life</h3>
<p>Think of a number line, or a thermometer standing on its side.</p>
<div class="key"><p><strong>Going up</strong> (warmer, paying money in): move right. <strong>Going down</strong> (colder, spending): move left.</p>
<p>The difference between −9 and 14 is 9 + 14 = 23, because you go 9 up to zero and then 14 more.</p></div>
<div class="key"><p>Adding a negative is the same as subtracting: 5 + (−8) = −3.<br>Subtracting a negative is the same as adding: 4 − (−6) = 10.</p></div>
<div class="warn"><strong>Watch out:</strong> a bank balance of −£45 means you are overdrawn by £45. Paying in £60 takes you to +£15, not −£105.</div>
<div class="tip"><strong>Exam tip:</strong> when a question compares two temperatures, sketch a quick number line. It takes ten seconds and stops sign mistakes.</div>`,
  gens: [
    { c: false, f() {
      const place = R.pick(['Leeds', 'a campsite in the Peak District', 'Aberdeen', 'the school playground', 'Inverness']);
      const start = -R.int(3, 14), rise = R.int(5, 20), end = start + rise;
      return { stem: `At 6 am the temperature in ${place} was ${sn(start)}°C. By noon it had risen by ${rise} degrees.`,
        parts: [{ q: 'What was the temperature at noon?', type: 'num', ans: end, suf: '°C', neg: true }],
        steps: rise >= -start ? [`Start at ${sn(start)}. It takes ${-start} degrees to get up to 0.`, `That leaves ${rise} − ${-start} = ${end} degrees above 0.`, `${sn(start)} + ${rise} = <b>${sn(end)}°C</b>`] : [`Start at ${sn(start)} and count up ${rise}.`, `You are still below zero.`, `${sn(start)} + ${rise} = <b>${sn(end)}°C</b>`] };
    } },
    { c: false, f() {
      const [a, b] = R.shuffle(['Braemar', 'Moscow', 'Oslo', 'Toronto', 'Reykjavik']).slice(0, 1).concat(R.pick(['London', 'Madrid', 'Bristol', 'Lisbon']));
      const lo = -R.int(4, 15), hi = R.int(3, 18);
      return { stem: table(['Place', 'Temperature'], [[a, sn(lo) + '°C'], [b, hi + '°C']]),
        parts: [{ q: `What is the difference in temperature between ${a} and ${b}?`, type: 'num', ans: hi - lo, suf: 'degrees' }],
        steps: [`From ${sn(lo)} up to 0 is ${-lo} degrees.`, `From 0 up to ${hi} is ${hi} degrees.`, `Difference = ${-lo} + ${hi} = <b>${hi - lo} degrees</b>`] };
    } },
    { c: false, x: true, f() {
      const n = R.name(), bal = R.int(40, 120) + R.pick([0, 0.5, 0.2, 0.75]), spend = R.int(130, 220) + R.pick([0, 0.5, 0.3, 0.99]);
      const after = rd(bal - spend, 2), pay = R.pick([50, 60, 80, 100, 150]), fin = rd(after + pay, 2);
      return { stem: `${n} has ${gbp(bal)} in a bank account. ${n} pays a bill of ${gbp(spend)}, then pays in ${gbp(pay)}.`,
        parts: [{ q: 'What is the balance straight after paying the bill?', type: 'num', ans: after, money: true, pre: '£', neg: true, hint: 'If the account is overdrawn, type a minus sign.' },
          { q: 'What is the balance after paying in?', type: 'num', ans: fin, money: true, pre: '£', neg: true }],
        steps: [`${gbp(bal)} − ${gbp(spend)}: the bill is bigger than the balance, so the account goes below zero.`, `${gbp(spend)} − ${gbp(bal)} = ${gbp(-after)}, so the balance is <b>${gbp(after)}</b> (overdrawn).`, `${gbp(after)} + ${gbp(pay)} = <b>${gbp(fin)}</b>`] };
    } },
    { c: false, f() {
      const m = R.int(1, 9), th = R.pick([0, R.int(1, 99), R.int(100, 999)]), u = R.pick([0, R.int(1, 19), R.int(20, 999)]);
      const v = m * 1e6 + th * 1000 + u;
      return { stem: `A council report says its budget is <em>${words(v)}</em> pounds.`,
        parts: [{ q: 'Write this number in figures.', type: 'num', ans: v, pre: '£', show: gbp(v).replace('.00', '') }],
        steps: [`Millions: ${m}`, `Thousands: ${th} → ${String(th).padStart(3, '0')}`, `Hundreds, tens and ones: ${u} → ${String(u).padStart(3, '0')}`, `Put them together, keeping zeros as placeholders: <b>${fmt(v)}</b>`] };
    } },
    { c: false, f() {
      let vals;
      do { vals = [-R.int(10, 15), -R.int(2, 6) - 0.5, -R.int(1, 9) / 10, R.int(1, 9) / 10, R.int(2, 7)]; } while (new Set(vals.map(Math.abs)).size < 5);
      const asc = vals.slice().sort((a, b) => a - b);
      const byAbs = vals.slice().sort((a, b) => Math.abs(a) - Math.abs(b));
      const negRev = asc.filter(x => x < 0).reverse().concat(asc.filter(x => x >= 0));
      const desc = asc.slice().reverse();
      const show = a => a.map(x => sn(x)).join(',&nbsp; ');
      const opts = [show(asc), show(byAbs), show(negRev), show(desc)];
      return { stem: `Here are five readings from a freezer test: ${R.shuffle(vals).map(x => sn(x)).join(',&nbsp; ')}`,
        parts: [{ q: 'Which list puts them in order from <b>smallest to largest</b>?', type: 'choice', options: opts, ans: 0 }],
        steps: ['Negative numbers are all smaller than positive numbers.', `For negatives, the further from zero, the smaller: ${asc.filter(x => x < 0).map(x => sn(x)).join(' < ')}.`, `So the order is <b>${show(asc)}</b>`] };
    } },
    { c: false, f() {
      const a = R.int(1100, 1900) * 1000 + R.int(100, 999), b = a + R.int(20, 90) * 1000 + R.int(-500, 500);
      const yr = R.int(2023, 2025);
      return { stem: table(['Year', 'Visitors'], [[yr, fmt(a)], [yr + 1, fmt(b)]]),
        parts: [{ q: `How many more visitors were there in ${yr + 1} than in ${yr}?`, type: 'num', ans: b - a }],
        steps: [`Subtract: ${fmt(b)} − ${fmt(a)}`, 'Line up the columns and subtract from the ones column, exchanging where you need to.', `Answer: <b>${fmt(b - a)}</b>`, `Check by adding back: ${fmt(a)} + ${fmt(b - a)} = ${fmt(b)} ✓`] };
    } }
  ]
});

/* ---------------- Calculating without a calculator ---------------- */
addTopic({
  id: 'n-calc', area: 'num', name: 'Calculating without a calculator', short: 'Written methods and order of operations',
  spec: ['Add, subtract, multiply and divide using written methods', 'Follow the order of operations, including powers (BIDMAS)', 'Decide whether to round up or down after dividing'],
  learn: `
<p>Section A of the exam is <strong>non-calculator</strong>, worth about a quarter of the marks. These methods are the toolkit for it.</p>
<h3>Order of operations: BIDMAS</h3>
<ol class="steps"><li><b>B</b>rackets first</li><li><b>I</b>ndices (powers, like 3² = 9)</li><li><b>D</b>ivision and <b>M</b>ultiplication, working left to right</li><li><b>A</b>ddition and <b>S</b>ubtraction, working left to right</li></ol>
<div class="key"><p>4 + 3 × 5 = 4 + 15 = <b>19</b> (not 35)<br>(4 + 3) × 5 = 7 × 5 = <b>35</b><br>2 × 3² = 2 × 9 = <b>18</b> (not 36)</p></div>
<h3>Multiplying: the grid method</h3>
<p>Split numbers into tens and ones. 46 × 38:</p>
<div class="tw"><table class="qt"><thead><tr><th>×</th><th>40</th><th>6</th></tr></thead><tbody><tr><th>30</th><td>1,200</td><td>180</td></tr><tr><th>8</th><td>320</td><td>48</td></tr></tbody></table></div>
<p>1,200 + 180 + 320 + 48 = <b>1,748</b></p>
<h3>Decimals and money</h3>
<p>Split money into pounds and pence. £12.75 × 8 = (£12 × 8) + (£0.75 × 8) = £96 + £6 = <b>£102</b>.</p>
<h3>Dividing in real life: round up or down?</h3>
<div class="key"><p>427 people, coaches hold 52. 427 ÷ 52 = 8 remainder 11. Eight coaches leave 11 people behind, so you need <b>9 coaches</b> (round <b>up</b>).</p>
<p>500 eggs in boxes of 12. 500 ÷ 12 = 41 remainder 8. Only <b>41 full boxes</b> (round <b>down</b>).</p></div>
<div class="warn"><strong>Watch out:</strong> the answer to a real-life division must make sense. You can’t book 8.2 coaches.</div>
<div class="tip"><strong>Exam tip:</strong> write every step down in Section A. If you slip on one sum, you still get marks for the method.</div>`,
  gens: [
    { c: false, f() {
      const t = R.int(0, 4); let e, steps, ans;
      if (t === 0) { const a = R.int(3, 20), b = R.int(3, 9), c = R.int(3, 9); ans = a + b * c; e = `${a} + ${b} × ${c}`; steps = ['Multiplication comes before addition.', `${b} × ${c} = ${b * c}`, `${a} + ${b * c} = <b>${ans}</b>`]; }
      else if (t === 1) { const a = R.int(2, 12), b = R.int(2, 9), c = R.int(3, 8); ans = (a + b) * c; e = `(${a} + ${b}) × ${c}`; steps = ['Brackets first.', `${a} + ${b} = ${a + b}`, `${a + b} × ${c} = <b>${ans}</b>`]; }
      else if (t === 2) { const c = R.int(3, 9), q = R.int(3, 12), b = c * q, a = R.int(q + 1, 40); ans = a - q; e = `${a} − ${b} ÷ ${c}`; steps = ['Division comes before subtraction.', `${b} ÷ ${c} = ${q}`, `${a} − ${q} = <b>${ans}</b>`]; }
      else if (t === 3) { const a = R.int(4, 12), b = R.int(2, 6), c = R.int(2, 9); ans = a * a - b * c; e = `${a}² − ${b} × ${c}`; steps = ['Powers (indices) first.', `${a}² = ${a} × ${a} = ${a * a}`, `Then multiply: ${b} × ${c} = ${b * c}`, `${a * a} − ${b * c} = <b>${ans}</b>`]; }
      else { const a = R.int(8, 15), b = R.int(2, 6), c = R.int(2, 20); ans = (a - b) ** 2 + c; e = `(${a} − ${b})² + ${c}`; steps = ['Brackets first.', `${a} − ${b} = ${a - b}`, `Then the power: ${a - b}² = ${(a - b) ** 2}`, `${(a - b) ** 2} + ${c} = <b>${ans}</b>`]; }
      return { stem: 'Use the order of operations.', parts: [{ q: `Work out ${e}`, type: 'num', ans, neg: true }], steps };
    } },
    { c: false, f() {
      const a = R.int(23, 68), b = R.int(12, 39);
      const ctx = R.pick([[`A theatre has ${b} rows of seats. Each row has ${a} seats.`, 'How many seats are there altogether?'],
        [`A school orders ${b} boxes of exercise books. Each box holds ${a} books.`, 'How many books is that?'],
        [`A coach company has ${b} coaches. Each coach has ${a} seats.`, 'How many seats are there in total?']]);
      const bt = Math.floor(b / 10) * 10, bo = b % 10;
      return { stem: ctx[0], parts: [{ q: ctx[1], type: 'num', ans: a * b, m: 2 }],
        steps: [`Work out ${a} × ${b}. Split ${b} into ${bt}${bo ? ' and ' + bo : ''}.`, `${a} × ${bt} = ${fmt(a * bt)}`].concat(bo ? [`${a} × ${bo} = ${fmt(a * bo)}`, `${fmt(a * bt)} + ${fmt(a * bo)} = <b>${fmt(a * b)}</b>`] : [`Answer: <b>${fmt(a * b)}</b>`]) };
    } },
    { c: false, f() {
      if (R.coin()) {
        const cap = R.pick([48, 49, 52, 53, 57, 60, 70]), k = R.int(4, 9), r = R.int(3, cap - 5), tot = cap * k + r;
        return { stem: `${tot} pupils and staff are going on a trip. Each coach carries ${cap} people.`,
          parts: [{ q: 'How many coaches are needed?', type: 'num', ans: k + 1 }],
          steps: [`${tot} ÷ ${cap}: ${cap} × ${k} = ${cap * k}, which is ${r} short.`, `${k} coaches would leave ${r} people behind.`, `So round up: <b>${k + 1} coaches</b>`] };
      }
      const box = R.pick([6, 12, 15, 24]), k = R.int(12, 45), r = R.int(1, box - 1), tot = box * k + r;
      const item = R.pick([['eggs', 'boxes'], ['cakes', 'trays'], ['glue sticks', 'packs']]);
      return { stem: `A packer has ${tot} ${item[0]} to put into ${item[1]} of ${box}.`,
        parts: [{ q: `How many <b>full</b> ${item[1]} can be filled?`, type: 'num', ans: k }],
        steps: [`${tot} ÷ ${box} = ${k} remainder ${r}`, `The ${r} left over do not fill another one.`, `So round down: <b>${k} full ${item[1]}</b>`] };
    } },
    { c: false, f() {
      const p = R.int(3, 19) + R.pick([0.25, 0.5, 0.75, 0.45, 0.95, 0.2]), n = R.int(3, 9);
      const thing = R.pick(['cinema tickets', 'packs of printer paper', 'bags of compost', 'football shirts', 'train tickets']);
      const pd = Math.floor(p), pc = rd(p - pd, 2);
      return { stem: `${R.name()} buys ${n} ${thing} at ${gbp(p)} each.`, parts: [{ q: 'What is the total cost?', type: 'num', ans: rd(p * n, 2), money: true, pre: '£', m: 2 }],
        steps: [`Split ${gbp(p)} into ${gbp(pd)} and ${Math.round(pc * 100)}p.`, `£${pd} × ${n} = ${gbp(pd * n)}`, `${Math.round(pc * 100)}p × ${n} = ${Math.round(pc * 100 * n)}p = ${gbp(pc * n)}`, `${gbp(pd * n)} + ${gbp(pc * n)} = <b>${gbp(p * n)}</b>`] };
    } },
    { c: false, x: true, f() {
      let a, na, b, nb, tot;
      do { a = R.int(1, 4) + R.pick([0.45, 0.25, 0.75, 0.6, 0.99]); na = R.int(2, 4); b = R.pick([0.85, 0.65, 0.4, 0.55, 0.3]); nb = R.int(2, 5); tot = rd(a * na + b * nb, 2); } while (tot >= 19.5);
      const note = tot < 9.5 ? R.pick([10, 20]) : 20;
      const change = rd(note - tot, 2);
      return { stem: `${R.name()} buys ${na} notebooks at ${gbp(a)} each and ${nb} pens at ${money(b)} each, and pays with a £${note} note.`,
        parts: [{ q: 'How much change should there be?', type: 'num', ans: change, money: true, pre: '£', m: 3 }],
        steps: [`Notebooks: ${na} × ${gbp(a)} = ${gbp(a * na)}`, `Pens: ${nb} × ${money(b)} = ${gbp(b * nb)}`, `Total: ${gbp(a * na)} + ${gbp(b * nb)} = ${gbp(tot)}`, `Change: £${note} − ${gbp(tot)} = <b>${gbp(change)}</b>`] };
    } }
  ]
});

/* ---------------- Rounding and estimating ---------------- */
addTopic({
  id: 'n-est', area: 'num', name: 'Rounding and estimating', short: 'Decimal places, significant figures, checking answers',
  spec: ['Round to a given number of decimal places or significant figures', 'Estimate answers by rounding', 'Use estimation to check whether an answer is sensible'],
  learn: `
<h3>Decimal places (d.p.)</h3>
<p>Count digits after the decimal point. Look at the <em>next</em> digit: 5 or more, round up; 4 or less, leave it.</p>
<div class="key"><p>3.4672 to 2 d.p. → look at the third digit (7) → <b>3.47</b><br>8.0349 to 1 d.p. → look at the 3 → <b>8.0</b> (keep the zero: it shows the accuracy)</p></div>
<h3>Significant figures (s.f.)</h3>
<p>Start counting at the first digit that is not zero.</p>
<div class="key"><p>48,372 to 2 s.f. → <b>48,000</b> (fill the gaps with zeros so the size stays the same)<br>0.03572 to 1 s.f. → first non-zero digit is 3, next is 5 → <b>0.04</b></p></div>
<h3>Estimating</h3>
<p>Round every number to <b>1 significant figure</b>, then do the easier sum.</p>
<div class="key"><p>49.6 × 21.3 ≈ 50 × 20 = <b>1,000</b><br>812 ÷ 39 ≈ 800 ÷ 40 = <b>20</b></p></div>
<h3>Checking answers</h3>
<p>If your calculator says 4.8 × 31 = 1,488, an estimate of 5 × 30 = 150 tells you something went wrong. Usually a decimal point was missed.</p>
<div class="warn"><strong>Watch out:</strong> money answers need 2 decimal places: £4.5 should be written <b>£4.50</b>.</div>
<div class="tip"><strong>Exam tip:</strong> questions that say “use estimation to check” want to see the rounded numbers written down, not just a yes or no.</div>`,
  gens: [
    { c: false, f() {
      const dp = R.pick([1, 2]); let x;
      do { x = rd(R.int(1, 99) + R.int(1, 9999) / 10000, 4); } while (Math.round(x * Math.pow(10, dp + 1)) % 10 === 5);
      const ans = rd(x, dp), nd = String(x).split('.')[1][dp] || '0';
      return { stem: `A measurement is recorded as ${x}.`, parts: [{ q: `Round ${x} to ${dp} decimal place${dp > 1 ? 's' : ''}.`, type: 'num', ans, show: ans.toFixed(dp) }],
        steps: [`Keep ${dp} digit${dp > 1 ? 's' : ''} after the decimal point and look at the next digit: <b>${nd}</b>.`, +nd >= 5 ? `${nd} is 5 or more, so round up.` : `${nd} is 4 or less, so leave it.`, `Answer: <b>${ans.toFixed(dp)}</b>`] };
    } },
    { c: false, f() {
      let x, n;
      if (R.coin()) { n = R.pick([1, 2, 3]); do { x = R.int(10000, 99999); } while (+String(x)[n] === 5); }
      else { n = R.pick([1, 2]); do { x = rd(R.int(1001, 9999) / 100000, 5); } while (+String(x).replace('0.', '').replace(/^0+/, '')[n] === 5); }
      const ans = sf(x, n);
      return { stem: `A figure in a report is ${fmt(x)}.`, parts: [{ q: `Round ${fmt(x)} to ${n} significant figure${n > 1 ? 's' : ''}.`, type: 'num', ans, show: fmt(ans) }],
        steps: [x < 1 ? 'Start counting at the first digit that is not zero.' : 'Start counting from the first digit.', `Keep ${n} significant figure${n > 1 ? 's' : ''} and look at the next digit to decide whether to round up.`, x < 1 ? `Answer: <b>${fmt(ans)}</b>` : `Fill the other places with zeros: <b>${fmt(ans)}</b>`] };
    } },
    { c: false, f() {
      const near = (d, p) => { const base = d * Math.pow(10, p); let off = 0; while (!off) off = p === 1 ? R.int(-40, 40) / 10 : R.int(-40, 40) * Math.pow(10, p - 2); return rd(base + off, 2); };
      if (R.coin()) {
        const d1 = R.int(2, 9), d2 = R.int(2, 9), p1 = R.int(1, 2), p2 = 1, a = near(d1, p1), b = near(d2, p2);
        const A = d1 * Math.pow(10, p1), B = d2 * Math.pow(10, p2);
        return { stem: 'Use estimation. Round each number to 1 significant figure.', parts: [{ q: `Estimate ${fmt(a)} × ${fmt(b)}`, type: 'num', ans: A * B }],
          steps: [`${fmt(a)} ≈ ${fmt(A)}`, `${fmt(b)} ≈ ${fmt(B)}`, `${fmt(A)} × ${fmt(B)} = <b>${fmt(A * B)}</b>`] };
      }
      const d2 = R.int(2, 4), qd = R.int(2, Math.floor(9 / d2)), B = d2 * 10, Q = qd * 10, A = Q * B;
      const a = near(A / 100, 2), b = near(d2, 1);
      return { stem: 'Use estimation. Round each number to 1 significant figure.', parts: [{ q: `Estimate ${fmt(a)} ÷ ${fmt(b)}`, type: 'num', ans: Q }],
        steps: [`${fmt(a)} ≈ ${fmt(A)}`, `${fmt(b)} ≈ ${fmt(B)}`, `${fmt(A)} ÷ ${fmt(B)} = <b>${fmt(Q)}</b>`] };
    } },
    { c: false, f() {
      const d1 = R.int(3, 9), a = rd(d1 + R.pick([-0.3, -0.2, 0.2, 0.3, 0.1, -0.1]), 1), b = R.int(2, 8) * 10 + R.pick([-1, 1, 2, -2]);
      const est = Math.round(a) * Math.round(b / 10) * 10, real = rd(a * b, 2);
      const kind = R.int(0, 2), shown = kind === 0 ? real : kind === 1 ? rd(real * 10, 1) : rd(real / 10, 3);
      const opts = ['Yes, the answer looks about right.', `No. An estimate is ${fmt(est)}, so the answer is about 10 times too big.`, `No. An estimate is ${fmt(est)}, so the answer is about 10 times too small.`];
      const n = R.name();
      return { stem: `${n} works out ${a} × ${b} on a calculator and writes down ${fmt(shown)}.`,
        parts: [{ q: `Use an estimate to check ${n}’s answer.`, type: 'choice', options: opts, ans: kind, shuffle: false }],
        steps: [`Round each number to 1 significant figure: ${a} ≈ ${Math.round(a)}, ${b} ≈ ${Math.round(b / 10) * 10}`, `Estimate: ${Math.round(a)} × ${Math.round(b / 10) * 10} = ${fmt(est)}`, `${n} wrote ${fmt(shown)}. ${kind === 0 ? 'That is close to the estimate, so it looks right.' : kind === 1 ? 'That is about 10 times bigger than the estimate.' : 'That is about 10 times smaller than the estimate.'}`, `<b>${opts[kind]}</b>`] };
    } }
  ]
});

/* ---------------- Fractions, decimals and percentages ---------------- */
const NICE_FR = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20], [7, 20], [9, 20], [11, 20], [1, 25], [4, 25], [6, 25]];
addTopic({
  id: 'n-fdp', area: 'num', name: 'Fractions, decimals and percentages', short: 'Equivalents, fractions of amounts, mixed numbers',
  spec: ['Know the equivalence between fractions, decimals and percentages', 'Find a fraction of an amount', 'Express one number as a fraction or percentage of another', 'Order, add and subtract fractions and mixed numbers'],
  learn: `
<h3>Three ways to write the same amount</h3>
<div class="tw"><table class="qt"><thead><tr><th>Fraction</th><th>Decimal</th><th>Percentage</th></tr></thead><tbody>
<tr><td>${F(1, 2)}</td><td>0.5</td><td>50%</td></tr><tr><td>${F(1, 4)}</td><td>0.25</td><td>25%</td></tr><tr><td>${F(3, 4)}</td><td>0.75</td><td>75%</td></tr>
<tr><td>${F(1, 5)}</td><td>0.2</td><td>20%</td></tr><tr><td>${F(1, 8)}</td><td>0.125</td><td>12.5%</td></tr><tr><td>${F(1, 10)}</td><td>0.1</td><td>10%</td></tr><tr><td>${F(1, 3)}</td><td>0.333…</td><td>33.3…%</td></tr></tbody></table></div>
<div class="key"><p><b>Fraction → decimal:</b> divide the top by the bottom. 3 ÷ 8 = 0.375<br><b>Decimal → percentage:</b> multiply by 100. 0.375 → 37.5%<br><b>Percentage → fraction:</b> put it over 100 and simplify. 35% = ${F(35, 100)} = ${F(7, 20)}</p></div>
<h3>Simplifying</h3><p>Divide the top and bottom by the same number until you can’t go further. ${F(18, 24)} → ÷6 → ${F(3, 4)}.</p>
<h3>Fraction of an amount</h3><p>Divide by the bottom, multiply by the top. ${F(3, 5)} of £240: £240 ÷ 5 = £48, × 3 = <b>£144</b>.</p>
<h3>One number as a fraction of another</h3><p>18 out of 24 = ${F(18, 24)} = ${F(3, 4)} = 75%.</p>
<h3>Adding and subtracting mixed numbers</h3>
<ol class="steps"><li>Turn mixed numbers into improper fractions: 1${F(3, 4)} = ${F(7, 4)}</li><li>Make the bottoms the same (common denominator)</li><li>Add or subtract the tops</li><li>Turn back into a mixed number and simplify</li></ol>
<div class="key"><p>1${F(3, 4)} + 2${F(2, 3)} = ${F(7, 4)} + ${F(8, 3)} = ${F(21, 12)} + ${F(32, 12)} = ${F(53, 12)} = <b>4${F(5, 12)}</b></p></div>
<div class="warn"><strong>Watch out:</strong> never add the bottom numbers. ${F(1, 2)} + ${F(1, 4)} is ${F(3, 4)}, not ${F(2, 6)}.</div>
<div class="tip"><strong>Typing answers here:</strong> type fractions like 3/4 and mixed numbers like 4 5/12.</div>`,
  gens: [
    { c: false, f() {
      const [n, d] = R.pick(NICE_FR), dec = n / d, pct = rd(dec * 100, 4), t = R.int(0, 3);
      if (t === 0) return { stem: 'Convert the fraction.', parts: [{ q: `Write ${F(n, d)} as a percentage.`, type: 'num', ans: pct, suf: '%' }], steps: [`Divide: ${n} ÷ ${d} = ${fmt(dec)}`, `Multiply by 100: <b>${fmt(pct)}%</b>`] };
      if (t === 1) return { stem: 'Convert the percentage.', parts: [{ q: `Write ${fmt(pct)}% as a fraction in its simplest form.`, type: 'frac', ans: [n, d], simplest: true }], steps: [`${fmt(pct)}% = ${F(fmt(pct), 100)}${pct % 1 ? ` = ${F(pct * 10, 1000)}` : ''}`, `Simplify by dividing top and bottom by the same number: <b>${F(n, d)}</b>`] };
      if (t === 2) return { stem: 'Convert the decimal.', parts: [{ q: `Write ${fmt(dec)} as a fraction in its simplest form.`, type: 'frac', ans: [n, d], simplest: true }], steps: [`${fmt(dec)} = ${F(Math.round(dec * 1000), 1000)}`, `Simplify: <b>${F(n, d)}</b>`] };
      return { stem: 'Convert the percentage.', parts: [{ q: `Write ${fmt(pct)}% as a decimal.`, type: 'num', ans: dec }], steps: [`Divide by 100: ${fmt(pct)} ÷ 100 = <b>${fmt(dec)}</b>`] };
    } },
    { c: false, f() {
      const d = R.pick([3, 4, 5, 6, 8, 10]); let n; do { n = R.int(1, d - 1); } while (gcd(n, d) !== 1);
      const amt = d * R.int(4, 60), ans = amt / d * n;
      const ctx = R.pick([[`A school has ${amt} pupils. ${F(n, d)} of them have school dinners.`, 'How many pupils have school dinners?', ''],
        [`A charity raised £${fmt(amt)}. It spent ${F(n, d)} of the money on equipment.`, 'How much was spent on equipment?', '£'],
        [`A car journey is ${amt} miles. ${F(n, d)} of it is on motorways.`, 'How many miles are on motorways?', '']]);
      return { stem: ctx[0], parts: [{ q: ctx[1], type: 'num', ans, pre: ctx[2], money: ctx[2] === '£', show: ctx[2] ? '£' + fmt(ans) : fmt(ans) }],
        steps: [`Divide by the bottom: ${fmt(amt)} ÷ ${d} = ${fmt(amt / d)}`, `Multiply by the top: ${fmt(amt / d)} × ${n} = <b>${ctx[2]}${fmt(ans)}</b>`] };
    } },
    { c: false, f() {
      const [n, d] = R.pick(NICE_FR.filter(f => f[1] <= 25)), k = R.int(2, 6), a = n * k, b = d * k;
      const who = R.pick([['staff came to the first-aid training', 'staff'], ['pupils handed in their homework', 'pupils'], ['parents replied to the survey', 'parents']]);
      return { stem: `${a} out of ${b} ${who[0]}.`,
        parts: [{ q: `What fraction of the ${who[1]} is this? Give it in its simplest form.`, type: 'frac', ans: [n, d], simplest: true }, { q: 'What percentage is this?', type: 'num', ans: rd(n / d * 100, 4), suf: '%' }],
        steps: [`Write it as a fraction: ${F(a, b)}`, `Divide top and bottom by ${k}: <b>${F(n, d)}</b>`, `${n} ÷ ${d} = ${fmt(n / d)}, × 100 = <b>${fmt(n / d * 100)}%</b>`] };
    } },
    { c: false, f() {
      let v1, v2, v3, fr;
      do { fr = R.pick(NICE_FR.filter(f => f[0] / f[1] > 0.15 && f[0] / f[1] < 0.9)); v1 = fr[0] / fr[1]; v2 = rd(v1 + R.pick([-0.05, -0.03, 0.02, 0.04, -0.02, 0.06]), 3); v3 = rd(v1 + R.pick([-0.04, 0.01, 0.03, -0.01, 0.05]), 3); } while (new Set([v1, v2, v3]).size < 3 || v2 <= 0 || v3 <= 0);
      const items = [{ s: F(fr[0], fr[1]), v: v1 }, { s: fmt(v2), v: v2 }, { s: fmt(rd(v3 * 100, 1)) + '%', v: v3 }];
      const big = R.coin(), best = items.reduce((a, b) => (big ? b.v > a.v : b.v < a.v) ? b : a);
      return { stem: `Three shops report the share of customers who paid by card: ${items.map(i => i.s).join(',&nbsp; ')}.`,
        parts: [{ q: `Which is the <b>${big ? 'largest' : 'smallest'}</b>?`, type: 'choice', options: items.map(i => i.s), ans: items.indexOf(best) }],
        steps: ['Change them all to decimals so they are easy to compare.', items.map(i => `${i.s} = ${fmt(i.v)}`).join(',&nbsp; '), `The ${big ? 'largest' : 'smallest'} is <b>${best.s}</b>`] };
    } },
    { c: false, x: true, f() {
      const ds = [2, 3, 4, 5, 6, 8]; let d1, d2, n1, n2, w1, w2;
      do { d1 = R.pick(ds); d2 = R.pick(ds); } while (d1 === d2);
      do { n1 = R.int(1, d1 - 1); } while (gcd(n1, d1) !== 1);
      do { n2 = R.int(1, d2 - 1); } while (gcd(n2, d2) !== 1);
      w1 = R.int(1, 4); w2 = R.int(1, 3);
      const L = lcm(d1, d2), A = (w1 * d1 + n1) * (L / d1), B = (w2 * d2 + n2) * (L / d2), add = R.coin() || A <= B;
      const top = add ? A + B : A - B;
      const st = [`Improper fractions: ${w1}${F(n1, d1)} = ${F(w1 * d1 + n1, d1)} and ${w2}${F(n2, d2)} = ${F(w2 * d2 + n2, d2)}`, `Common denominator ${L}: ${F(A, L)} ${add ? '+' : '−'} ${F(B, L)}`, `${F(A, L)} ${add ? '+' : '−'} ${F(B, L)} = ${F(top, L)}`, `As a mixed number: <b>${M(top, L)}</b>`];
      if (add) return { stem: `A recipe uses ${w1}${F(n1, d1)} cups of milk and ${w2}${F(n2, d2)} cups of water.`, parts: [{ q: 'How many cups of liquid is that altogether?', type: 'frac', ans: [top, L], m: 2 }], steps: st };
      return { stem: `A plank of wood is ${w1}${F(n1, d1)} metres long. ${R.name()} cuts off ${w2}${F(n2, d2)} metres.`, parts: [{ q: 'How long is the piece that is left?', type: 'frac', ans: [top, L], suf: 'm', m: 2 }], steps: st };
    } }
  ]
});

/* ---------------- Percentages ---------------- */
function pctSteps(p, a) {
  const ten = a / 10, s = [`10% of ${fmt(a)} = ${fmt(ten)}`];
  if (p === 25 || p === 75) { s.length = 0; s.push(`25% is a quarter: ${fmt(a)} ÷ 4 = ${fmt(a / 4)}`); if (p === 75) s.push(`75% = 3 × 25% = ${fmt(a * 0.75)}`); return s; }
  if (p % 10 === 0) { s.push(`${p}% = ${p / 10} × 10% = ${fmt(ten * p / 10)}`); return s; }
  s.push(`5% is half of 10% = ${fmt(ten / 2)}`);
  if (p > 5) s.push(`${p - 5}% = ${(p - 5) / 10} × 10% = ${fmt(ten * (p - 5) / 10)}`, `${p}% = ${fmt(ten * (p - 5) / 10)} + ${fmt(ten / 2)} = ${fmt(a * p / 100)}`);
  return s;
}
addTopic({
  id: 'n-pct', area: 'num', name: 'Percentages', short: 'Increase, decrease, % change, reverse %',
  spec: ['Find a percentage of an amount, with and without a calculator', 'Increase or decrease an amount by a percentage', 'Work out a percentage change', 'Find the original amount before a percentage change (reverse percentages)'],
  learn: `
<h3>Without a calculator: build from 10%</h3>
<div class="key"><p>10% = divide by 10 · 5% = half of 10% · 1% = divide by 100 · 25% = divide by 4 · 50% = halve</p>
<p>35% of £240: 10% = £24, so 30% = £72; 5% = £12; 35% = £72 + £12 = <b>£84</b></p></div>
<h3>With a calculator: use a multiplier</h3>
<div class="key"><p><b>Increase by 12%</b> → × 1.12 · <b>Decrease by 15%</b> → × 0.85 (because 100 − 15 = 85)</p><p>£840 sofa, 15% off: 840 × 0.85 = <b>£714</b></p></div>
<h3>Percentage change</h3>
<div class="formula">Percentage change = <span class="fr"><span>change</span><span>original</span></span> × 100</div>
<p>A house goes from £180,000 to £198,000. Change = £18,000. 18,000 ÷ 180,000 × 100 = <b>10% increase</b>.</p>
<h3>Reverse percentages: finding the original</h3>
<p>After 20% off, a coat costs £64. The £64 is <b>80%</b> of the original, not 100%.</p>
<ol class="steps"><li>80% = £64</li><li>1% = £64 ÷ 80 = £0.80</li><li>100% = £0.80 × 100 = <b>£80</b></li></ol>
<div class="warn"><strong>Watch out:</strong> do not add 20% to £64. That gives £76.80, which is wrong, because the 20% was taken off the bigger original price.</div>
<p>VAT is 20%. A price <em>including</em> VAT is 120% of the price before VAT.</p>
<div class="tip"><strong>Exam tip:</strong> percentage change always divides by the <b>original</b> (old) amount.</div>`,
  gens: [
    { c: false, f() {
      const p = R.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75]), a = 20 * R.int(2, 30), ans = a * p / 100;
      const ctx = R.pick([[`A school trip costs £${a}. Parents pay a ${p}% deposit.`, 'How much is the deposit?', true], [`A garden centre has ${a} plants. ${p}% of them are sold on Saturday.`, 'How many plants are sold?', false]]);
      return { stem: ctx[0], parts: [{ q: ctx[1], type: 'num', ans, money: ctx[2], pre: ctx[2] ? '£' : '' }], steps: pctSteps(p, a).concat([`Answer: <b>${ctx[2] ? gbp(ans) : fmt(ans)}</b>`]) };
    } },
    { c: true, f() {
      const up = R.coin(), p = R.int(3, 35), a = up ? R.int(40, 180) + R.pick([0, 0.4, 0.6, 0.8]) : R.int(80, 1200);
      const mult = up ? 1 + p / 100 : 1 - p / 100, ans = rd(a * mult, 2);
      const ctx = up ? [`A monthly energy bill of ${gbp(a)} goes up by ${p}%.`, 'What is the new bill?'] : [`A sofa costs ${gbp(a)}. In a sale it is reduced by ${p}%.`, 'What is the sale price?'];
      return { stem: ctx[0], parts: [{ q: ctx[1], type: 'num', ans, money: true, pre: '£', m: 2 }],
        steps: [`${up ? 'Increase' : 'Decrease'} by ${p}% means multiply by ${fmt(mult)} (100% ${up ? '+' : '−'} ${p}% = ${up ? 100 + p : 100 - p}%).`, `${gbp(a)} × ${fmt(mult)} = ${fmt(a * mult)}`, `Round to the nearest penny: <b>${gbp(ans)}</b>`] };
    } },
    { c: true, f() {
      let old, p, nw, up;
      do { old = 20 * R.int(3, 60); p = R.int(2, 40); up = R.coin(); nw = old * (up ? 100 + p : 100 - p) / 100; } while (nw % 1 !== 0);
      const ctx = R.pick([['The number of people using a library went from', 'people', ''], ['The price of a train season ticket went from', '', '£'], ['The number of pupils on roll went from', 'pupils', '']]);
      const sh = v => ctx[2] ? '£' + fmt(v) : fmt(v) + ' ' + ctx[1];
      return { stem: `${ctx[0]} ${sh(old)} to ${sh(nw)}.`, parts: [{ q: `What is the percentage ${up ? 'increase' : 'decrease'}?`, type: 'num', ans: p, suf: '%', tol: 0.05, m: 2 }],
        steps: [`Change = ${fmt(nw)} − ${fmt(old)} = ${sn(nw - old)}`, `Divide by the <b>original</b>: ${fmt(Math.abs(nw - old))} ÷ ${fmt(old)} = ${fmt(Math.abs(nw - old) / old)}`, `× 100 = <b>${p}% ${up ? 'increase' : 'decrease'}</b>`] };
    } },
    { c: true, x: true, f() {
      if (R.coin()) {
        const orig = 5 * R.int(6, 80), p = R.pick([10, 15, 20, 25, 30, 40]), sale = rd(orig * (100 - p) / 100, 2);
        return { stem: `In a sale, everything is ${p}% off. A coat now costs ${gbp(sale)}.`, parts: [{ q: 'What was the original price?', type: 'num', ans: orig, money: true, pre: '£', m: 3 }],
          steps: [`The sale price is ${100 - p}% of the original (100% − ${p}%).`, `${100 - p}% = ${gbp(sale)}`, `1% = ${gbp(sale)} ÷ ${100 - p} = ${fmt(sale / (100 - p))}`, `100% = ${fmt(sale / (100 - p))} × 100 = <b>${gbp(orig)}</b>`] };
      }
      const ex = 5 * R.int(4, 120), inc = rd(ex * 1.2, 2);
      return { stem: `A printer costs ${gbp(inc)} including VAT at 20%.`, parts: [{ q: 'What is the price before VAT is added?', type: 'num', ans: ex, money: true, pre: '£', m: 3 }],
        steps: ['The price including VAT is 120% of the price before VAT.', `120% = ${gbp(inc)}`, `1% = ${gbp(inc)} ÷ 120 = ${fmt(inc / 120)}`, `100% = <b>${gbp(ex)}</b> (or ${gbp(inc)} ÷ 1.2)`] };
    } },
    { c: true, x: true, f() {
      let a, b, fr, p, A, B;
      do { a = R.int(30, 90); b = a + R.int(-8, 8); fr = R.pick([[1, 3], [1, 4]]); p = R.pick([20, 25, 30, 35]); A = rd(a * (1 - fr[0] / fr[1]), 2); B = rd(b * (1 - p / 100), 2); } while (Math.abs(A - B) < 0.5);
      const item = R.pick(['pair of trainers', 'kettle', 'set of headphones', 'winter coat']);
      const cheap = A < B ? 0 : 1;
      return { stem: `Two shops sell the same ${item}.` + table(['Shop', 'Price', 'Offer'], [['Shop A', gbp(a), `${F(fr[0], fr[1])} off`], ['Shop B', gbp(b), `${p}% off`]]),
        parts: [{ q: 'Which shop is cheaper?', type: 'choice', options: ['Shop A', 'Shop B'], ans: cheap, shuffle: false, m: 2 }, { q: 'How much cheaper is it?', type: 'num', ans: rd(Math.abs(A - B), 2), money: true, pre: '£' }],
        steps: [`Shop A: ${F(fr[0], fr[1])} of ${gbp(a)} = ${gbp(a * fr[0] / fr[1])}, so the price is ${gbp(a)} − ${gbp(a * fr[0] / fr[1])} = ${gbp(A)}`, `Shop B: ${gbp(b)} × ${fmt(1 - p / 100)} = ${gbp(B)}`, `<b>Shop ${cheap ? 'B' : 'A'}</b> is cheaper by ${gbp(Math.max(A, B))} − ${gbp(Math.min(A, B))} = <b>${gbp(Math.abs(A - B))}</b>`] };
    } }
  ]
});

/* ---------------- Ratio and proportion ---------------- */
addTopic({
  id: 'n-ratio', area: 'num', name: 'Ratio and proportion', short: 'Sharing, scaling recipes, best buys',
  spec: ['Simplify ratios and share amounts in a given ratio', 'Scale quantities up and down (direct proportion)', 'Solve problems involving inverse proportion', 'Compare value for money (best buys)'],
  learn: `
<h3>What a ratio means</h3><p>A ratio of adults to children of 2 : 3 means for every 2 adults there are 3 children. Simplify like a fraction: 12 : 18 → ÷6 → <b>2 : 3</b>.</p>
<h3>Sharing in a ratio</h3>
<ol class="steps"><li>Add the parts: 4 : 5 → 9 parts</li><li>Find one part: £360 ÷ 9 = £40</li><li>Multiply: 4 × £40 = £160 and 5 × £40 = £200</li><li>Check they add up: £160 + £200 = £360 ✓</li></ol>
<h3>Direct proportion: the unitary method</h3>
<p>Find the amount for <b>one</b>, then scale up. A recipe for 4 uses 300 g flour. For 1: 300 ÷ 4 = 75 g. For 10: 75 × 10 = <b>750 g</b>.</p>
<h3>Inverse proportion</h3><p>More workers means less time. 4 people take 6 hours = 24 “person-hours”. 3 people: 24 ÷ 3 = <b>8 hours</b>.</p>
<h3>Best buys</h3><p>Compare the price for the same amount, such as price per 100 g.</p>
<div class="key"><p>500 g for £1.85 → £1.85 ÷ 5 = 37p per 100 g<br>750 g for £2.70 → £2.70 ÷ 7.5 = 36p per 100 g → <b>larger pack is better value</b></p></div>
<div class="warn"><strong>Watch out:</strong> if the ratio is 3 : 4 and there are 24 girls (the 4 part), one part is 24 ÷ 4 = 6, not 24 ÷ 7.</div>
<div class="tip"><strong>Exam tip:</strong> for best-buy questions, show the working for <b>both</b> options and then say which is better. A choice without working gets no marks.</div>`,
  gens: [
    { c: false, f() {
      let a, b; do { a = R.int(1, 7); b = R.int(2, 9); } while (gcd(a, b) !== 1 || a === b);
      const k = R.pick([5, 10, 20, 25, 40, 50]), tot = (a + b) * k, [n1, n2] = R.names(2), ask = R.coin() ? 0 : 1;
      const ans = ask ? b * k : a * k;
      return { stem: `${n1} and ${n2} share £${fmt(tot)} in the ratio ${a} : ${b}.`, parts: [{ q: `How much does ${ask ? n2 : n1} get?`, type: 'num', ans, money: true, pre: '£', show: '£' + fmt(ans), m: 2 }],
        steps: [`Total parts: ${a} + ${b} = ${a + b}`, `One part: £${fmt(tot)} ÷ ${a + b} = £${k}`, `${ask ? n2 : n1} gets ${ask ? b : a} × £${k} = <b>£${fmt(ans)}</b>`] };
    } },
    { c: false, f() {
      let a, b; do { a = R.int(1, 6); b = R.int(2, 9); } while (gcd(a, b) !== 1 || a === b);
      const k = R.int(2, 8);
      return { stem: `On a school trip there are ${a * k} adults and ${b * k} children.`, parts: [{ q: 'Write the ratio of adults to children in its simplest form.', type: 'ratio', ans: [a, b] }],
        steps: [`Adults : children = ${a * k} : ${b * k}`, `Both numbers divide by ${k}.`, `Simplest form: <b>${a} : ${b}</b>`] };
    } },
    { c: false, f() {
      let a, b; do { a = R.int(2, 7); b = R.int(2, 9); } while (gcd(a, b) !== 1 || a === b);
      const k = R.int(3, 12);
      return { stem: `In a choir, the ratio of men to women is ${a} : ${b}. There are ${b * k} women.`, parts: [{ q: 'How many men are in the choir?', type: 'num', ans: a * k }],
        steps: [`The women are the “${b}” part of the ratio, so ${b} parts = ${b * k}.`, `One part = ${b * k} ÷ ${b} = ${k}`, `Men = ${a} × ${k} = <b>${a * k}</b>`] };
    } },
    { c: true, x: true, f() {
      const s = R.pick([4, 6, 8]), n = R.pick([2, 3, 5, 10, 12, 15].filter(v => v !== s)), q = s * R.pick([25, 30, 40, 45, 50, 60, 75]);
      const ing = R.pick(['flour', 'sugar', 'butter', 'rice']), need = rd(q / s * n, 1);
      let enough = R.coin(), have = enough ? Math.ceil((need + 1) / 50) * 50 : Math.floor((need - 1) / 50) * 50;
      if (have <= 0) { enough = true; have = Math.ceil((need + 1) / 50) * 50; }
      return { stem: `A recipe for ${s} people uses ${q} g of ${ing}. ${R.name()} is cooking for ${n} people and has ${have} g of ${ing}.`,
        parts: [{ q: `How much ${ing} is needed for ${n} people?`, type: 'num', ans: need, suf: 'g', tol: 0.05, m: 2 }, { q: `Is there enough ${ing}?`, type: 'choice', options: ['Yes', 'No'], ans: enough ? 0 : 1, shuffle: false }],
        steps: [`For 1 person: ${q} ÷ ${s} = ${fmt(q / s)} g`, `For ${n} people: ${fmt(q / s)} × ${n} = <b>${fmt(need)} g</b>`, `${have} g is ${enough ? 'more' : 'less'} than ${fmt(need)} g, so <b>${enough ? 'yes, there is enough' : 'no, there is not enough'}</b>.`] };
    } },
    { c: true, x: true, f() {
      let s1, s2, p1, p2, u1, u2;
      do { s1 = R.pick([250, 400, 500, 600]); s2 = R.pick([750, 1000, 1200, 1500]); p1 = rd(R.int(80, 300) / 100, 2); p2 = rd(p1 * s2 / s1 * (R.coin() ? 1 + R.int(4, 12) / 100 : 1 - R.int(4, 12) / 100), 2); u1 = p1 / s1 * 10000; u2 = p2 / s2 * 10000; } while (Math.abs(u1 - u2) < 0.4);
      const item = R.pick(['coffee', 'cereal', 'washing powder', 'pasta']), best = u2 < u1 ? 1 : 0;
      const opts = [`Small pack (${s1} g)`, `Large pack (${s2} g)`];
      return { stem: `A shop sells ${item} in two sizes.` + table(['Pack', 'Size', 'Price'], [['Small', s1 + ' g', gbp(p1)], ['Large', s2 + ' g', gbp(p2)]]),
        parts: [{ q: 'Which pack is better value for money?', type: 'choice', options: opts, ans: best, shuffle: false, m: 3 }],
        steps: ['Work out the price of 100 g for each pack.', `Small: ${gbp(p1)} ÷ ${s1 / 100} = ${fmt(u1, 1)}p per 100 g`, `Large: ${gbp(p2)} ÷ ${s2 / 100} = ${fmt(u2, 1)}p per 100 g`, `The <b>${best ? 'large' : 'small'} pack</b> is cheaper per 100 g, so it is better value.`] };
    } },
    { c: false, f() {
      const r = R.pick([4, 5, 6, 8, 10]), k = R.int(3, 9), rem = R.int(1, r - 1), kids = r * k + rem;
      return { stem: `For a school trip, there must be at least 1 adult for every ${r} children. ${kids} children are going.`, parts: [{ q: 'What is the smallest number of adults needed?', type: 'num', ans: k + 1 }],
        steps: [`${kids} ÷ ${r} = ${k} remainder ${rem}`, `${k} adults could only look after ${r * k} children, leaving ${rem} without an adult.`, `So round up: <b>${k + 1} adults</b>`] };
    } }
  ]
});

/* ---------------- Formulae ---------------- */
addTopic({
  id: 'n-formula', area: 'num', name: 'Formulae and expressions', short: 'Substitution, word formulae, using formulae backwards',
  spec: ['Use formulae written in words', 'Substitute numbers into formulae written with letters (symbols)', 'Follow the order of operations, including powers and negative numbers'],
  learn: `
<h3>Formulae in words</h3><p>“Cook for 20 minutes per 500 g, plus an extra 20 minutes.” For 2.5 kg: 2,500 ÷ 500 = 5 lots of 500 g → 5 × 20 = 100 minutes, + 20 = <b>120 minutes</b>.</p>
<div class="warn"><strong>Watch out:</strong> make the units match first. 2.5 kg is 2,500 g.</div>
<h3>Formulae with letters</h3><p>Letters stand for numbers. Swap each letter for its number, then use BIDMAS.</p>
<div class="formula">C = 45 + 30h</div>
<p>30h means 30 × h. When h = 3.5: C = 45 + 30 × 3.5 = 45 + 105 = <b>150</b>.</p>
<h3>Working backwards</h3><p>If the bill C was £150, how many hours? Undo each step in reverse: 150 − 45 = 105, then 105 ÷ 30 = <b>3.5 hours</b>.</p>
<h3>Powers and negatives</h3>
<div class="key"><p>3a² means 3 × a × a, not (3a)². When a = 4: 3 × 16 = 48.<br>When b = −5: 2b = −10, so 3a² − 2b = 48 − (−10) = <b>58</b>.</p></div>
<div class="tip"><strong>Exam tip:</strong> write the formula out with the numbers in place before you calculate. It earns a method mark straight away.</div>`,
  gens: [
    { c: true, x: true, f() {
      const kg = R.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5]), per = R.pick([20, 25, 30]), extra = R.pick([20, 25, 30]);
      const mins = kg * 1000 / 500 * per + extra, eat = R.pick([17, 18, 19]) * 60 + R.pick([0, 30]), start = eat - mins;
      return { stem: `A guide says: <em>cook a chicken for ${per} minutes per 500 g, plus an extra ${extra} minutes</em>. ${R.name()} has a ${kg} kg chicken and wants it to be ready at ${hhmm(eat)}.`,
        parts: [{ q: 'How long should the chicken cook for, in minutes?', type: 'num', ans: mins, suf: 'minutes', m: 2 }, { q: 'What time should it go in the oven?', type: 'time', ans: start }],
        steps: [`${kg} kg = ${fmt(kg * 1000)} g. Number of 500 g lots: ${fmt(kg * 1000)} ÷ 500 = ${kg * 2}`, `${kg * 2} × ${per} = ${kg * 2 * per} minutes, + ${extra} = <b>${mins} minutes</b> (${hm(mins)})`, `Count back ${hm(mins)} from ${hhmm(eat)}: <b>${hhmm(start)}</b>`] };
    } },
    { c: true, x: true, f() {
      const call = R.pick([35, 40, 45, 50, 60]), rate = R.pick([25, 30, 35, 40, 45]), h = R.pick([1.5, 2, 2.5, 3, 3.5, 4]), h2 = R.pick([1, 1.5, 2, 2.5, 3, 4, 5].filter(v => v !== h));
      const C = call + rate * h, C2 = call + rate * h2;
      return { stem: `A plumber works out the cost of a job, in pounds, with the formula <span class="formula inline">C = ${call} + ${rate}h</span> where h is the number of hours.`,
        parts: [{ q: `Work out C when h = ${h}.`, type: 'num', ans: C, money: true, pre: '£' }, { q: `Another job costs ${gbp(C2)}. How many hours did it take?`, type: 'num', ans: h2, suf: h2 === 1 ? 'hour' : 'hours', m: 2 }],
        steps: [`C = ${call} + ${rate} × ${h} = ${call} + ${fmt(rate * h)} = <b>${gbp(C)}</b>`, `Work backwards: ${fmt(C2)} − ${call} = ${fmt(C2 - call)}`, `${fmt(C2 - call)} ÷ ${rate} = <b>${fmt(h2)} ${h2 === 1 ? 'hour' : 'hours'}</b>`] };
    } },
    { c: true, f() {
      if (R.coin()) {
        const c = R.int(-10, 35), f = rd(1.8 * c + 32, 1);
        return { stem: 'To change degrees Celsius (C) to degrees Fahrenheit (F), use <span class="formula inline">F = 1.8C + 32</span>', parts: [{ q: `Change ${sn(c)}°C to Fahrenheit.`, type: 'num', ans: f, suf: '°F', neg: true, tol: 0.05 }],
          steps: [`F = 1.8 × ${c < 0 ? '(' + sn(c) + ')' : c} + 32`, `1.8 × ${c < 0 ? '(' + sn(c) + ')' : c} = ${sn(rd(1.8 * c, 1))}`, `${sn(rd(1.8 * c, 1))} + 32 = <b>${sn(f)}°F</b>`] };
      }
      const base = R.pick([3, 3.5, 4]), perm = R.pick([1.8, 2, 2.2, 2.5]), m = R.int(3, 15), fare = rd(base + perm * m, 2);
      return { stem: `A taxi fare in pounds is worked out with <span class="formula inline">fare = ${base} + ${perm} × miles</span>`, parts: [{ q: `What is the fare for a ${m}-mile journey?`, type: 'num', ans: fare, money: true, pre: '£' }],
        steps: [`fare = ${base} + ${perm} × ${m}`, `${perm} × ${m} = ${fmt(perm * m)}`, `${base} + ${fmt(perm * m)} = <b>${gbp(fare)}</b>`] };
    } },
    { c: false, f() {
      const a = R.int(2, 6) * (R.coin() ? 1 : -1), b = R.int(2, 9) * (R.coin() ? 1 : -1), k = R.int(2, 4), j = R.int(2, 5);
      const ans = k * a * a - j * b;
      return { stem: `a = ${sn(a)} and b = ${sn(b)}`, parts: [{ q: `Work out ${k}a² − ${j}b`, type: 'num', ans, neg: true, m: 2 }],
        steps: [`a² = ${a < 0 ? '(' + sn(a) + ')' : a} × ${a < 0 ? '(' + sn(a) + ')' : a} = ${a * a}${a < 0 ? ' (a negative times a negative is positive)' : ''}`, `${k}a² = ${k} × ${a * a} = ${k * a * a}`, `${j}b = ${j} × ${b < 0 ? '(' + sn(b) + ')' : b} = ${sn(j * b)}`, `${k * a * a} − ${j * b < 0 ? '(' + sn(j * b) + ')' : j * b} = <b>${sn(ans)}</b>`] };
    } },
    { c: true, x: true, f() {
      let fa, pa, fb, mins, A, B;
      do { fa = R.pick([8, 10, 12, 15]); pa = R.pick([3, 4, 5, 6]); fb = R.pick([18, 20, 22, 25, 30]); mins = 10 * R.int(10, 40); A = rd(fa + pa * mins / 100, 2); B = fb; } while (Math.abs(A - B) < 1);
      const n = R.name(), best = A < B ? 0 : 1;
      return { stem: `${n} uses about ${mins} minutes of calls a month and is choosing a phone plan.` + table(['Plan', 'Cost'], [['Plan A', `£${fa} a month, plus ${pa}p per minute`], ['Plan B', `£${fb} a month, unlimited minutes`]]),
        parts: [{ q: `Which plan is cheaper for ${n}?`, type: 'choice', options: ['Plan A', 'Plan B'], ans: best, shuffle: false, m: 2 }, { q: 'How much would the cheaper plan cost each month?', type: 'num', ans: Math.min(A, B), money: true, pre: '£' }],
        steps: [`Plan A: ${mins} × ${pa}p = ${mins * pa}p = ${gbp(mins * pa / 100)}`, `Plan A total: £${fa} + ${gbp(mins * pa / 100)} = ${gbp(A)}`, `Plan B: ${gbp(B)}`, `<b>Plan ${best ? 'B' : 'A'}</b> is cheaper, at <b>${gbp(Math.min(A, B))}</b> a month.`] };
    } }
  ]
});
