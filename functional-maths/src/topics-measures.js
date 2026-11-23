'use strict';
/* =====================================================================
   MEASURES, SHAPE AND SPACE topics
   ===================================================================== */

/* ---------------- Money ---------------- */
addTopic({
  id: 'm-money', area: 'mea', name: 'Money: pay, budgets, VAT and interest', short: 'Wages, profit and loss, VAT, interest, credit',
  spec: ['Calculate amounts of money, rates of pay and budgets', 'Work out profit and loss', 'Calculate VAT, discounts and credit (instalment) costs', 'Calculate simple and compound interest'],
  learn: `
<h3>Pay and overtime</h3><p>“Time and a half” means 1.5 × the normal hourly rate. “Double time” means 2 ×.</p>
<div class="key"><p>£12.40 an hour, 37.5 hours, plus 6 hours at time and a half:<br>37.5 × £12.40 = £465.00 · overtime rate = £12.40 × 1.5 = £18.60 · 6 × £18.60 = £111.60<br>Total = <b>£576.60</b></p></div>
<h3>VAT</h3><p>VAT is 20%. Price with VAT = price × 1.2. To remove VAT, divide by 1.2.</p>
<h3>Profit and loss</h3><div class="formula">Profit = money taken − costs</div><p>If the answer is negative, it is a loss.</p>
<h3>Simple interest</h3><p>The same amount of interest every year, worked out on the starting amount only.</p>
<div class="key"><p>£2,400 at 3% for 4 years: 3% of £2,400 = £72 a year · £72 × 4 = <b>£288</b></p></div>
<h3>Compound interest</h3><p>Interest is added each year, so next year you earn interest on the interest too.</p>
<div class="formula">Final amount = start × (1 + <span class="fr"><span>rate</span><span>100</span></span>)<sup>years</sup></div>
<div class="key"><p>£5,000 at 2.5% for 3 years: 5,000 × 1.025³ = <b>£5,384.45</b></p></div>
<h3>Buying on credit</h3><p>Add the deposit and all the monthly payments, then compare with the cash price.</p>
<div class="warn"><strong>Watch out:</strong> always give money to 2 decimal places, and round to the nearest penny only at the end.</div>
<div class="tip"><strong>Exam tip:</strong> budget questions usually end with a decision (“Can she afford it?”). Show the total, then answer the question in words.</div>`,
  gens: [
    { c: true, x: true, f() {
      const rate = rd(R.int(105, 148) * 0.1, 2), h = R.pick([30, 35, 37.5, 40]), ot = R.int(2, 8), n = R.name();
      const basic = rd(rate * h, 2), otr = rd(rate * 1.5, 3), otp = rd(otr * ot, 2), tot = rd(basic + otp, 2);
      return { stem: `${n} is paid ${gbp(rate)} an hour for a basic ${h}-hour week. Overtime is paid at time and a half. One week ${n} works ${h} hours plus ${ot} hours of overtime.`,
        parts: [{ q: `How much does ${n} earn that week?`, type: 'num', ans: tot, money: true, pre: '£', m: 3 }],
        steps: [`Basic pay: ${h} × ${gbp(rate)} = ${gbp(basic)}`, `Overtime rate: ${gbp(rate)} × 1.5 = £${fmt(otr)}`, `Overtime pay: ${ot} × £${fmt(otr)} = ${gbp(otp)}`, `Total: ${gbp(basic)} + ${gbp(otp)} = <b>${gbp(tot)}</b>`] };
    } },
    { c: true, f() {
      const ex = R.int(20, 600) + R.pick([0, 0.5, 0.99, 0.49, 0.25]), vat = rd(ex * 0.2, 2), tot = rd(ex + vat, 2);
      const item = R.pick(['laptop repair', 'van hire', 'office chair', 'set of tyres', 'boiler service']);
      return { stem: `${An(item)} ${item} costs ${gbp(ex)} before VAT. VAT is charged at 20%.`,
        parts: [{ q: 'How much is the VAT?', type: 'num', ans: vat, money: true, pre: '£' }, { q: 'What is the total price including VAT?', type: 'num', ans: tot, money: true, pre: '£' }],
        steps: [`10% of ${gbp(ex)} = £${fmt(ex / 10)}, so 20% = £${fmt(rd(ex / 5, 4))} = ${gbp(vat)} to the nearest penny`, `Total = ${gbp(ex)} + ${gbp(vat)} = <b>${gbp(tot)}</b>`, `(Or in one step: ${gbp(ex)} × 1.2 = ${gbp(tot)})`] };
    } },
    { c: true, f() {
      const P = R.pick([800, 1200, 1500, 2400, 3500, 5000, 6000]), r = R.pick([2, 2.5, 3, 3.5, 4, 5]), n = R.int(2, 6);
      const yr = P * r / 100, I = rd(yr * n, 2);
      return { stem: `${R.name()} puts ${gbp(P).replace('.00', '')} into a savings account that pays ${r}% <b>simple</b> interest a year.`,
        parts: [{ q: `How much interest is earned in ${n} years?`, type: 'num', ans: I, money: true, pre: '£', m: 2 }, { q: `How much is in the account after ${n} years?`, type: 'num', ans: rd(P + I, 2), money: true, pre: '£' }],
        steps: [`Interest for one year: ${r}% of ${gbp(P)} = ${gbp(yr)}`, `For ${n} years: ${gbp(yr)} × ${n} = <b>${gbp(I)}</b>`, `Total: ${gbp(P)} + ${gbp(I)} = <b>${gbp(P + I)}</b>`] };
    } },
    { c: true, x: true, f() {
      const P = R.int(5, 80) * 100, r = R.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5]), n = R.int(2, 5), m = 1 + r / 100;
      const v = rd(P * Math.pow(m, n), 2), yrs = [];
      for (let i = 1; i <= n; i++) yrs.push(`End of year ${i}: ${gbp(P * Math.pow(m, i))}`);
      return { stem: `${gbp(P).replace('.00', '')} is invested at ${r}% <b>compound</b> interest a year.`,
        parts: [{ q: `What is it worth after ${n} years?`, type: 'num', ans: v, money: true, pre: '£', tol: 0.02, m: 2 }, { q: 'How much interest has been earned?', type: 'num', ans: rd(v - P, 2), money: true, pre: '£', tol: 0.02 }],
        steps: [`Multiplier: 100% + ${r}% = ${fmt(m)}`, `${fmt(P)} × ${fmt(m)}<sup>${n}</sup> = <b>${gbp(v)}</b>`, yrs.join('<br>'), `Interest = ${gbp(v)} − ${gbp(P)} = <b>${gbp(v - P)}</b>`] };
    } },
    { c: true, x: true, f() {
      const all = [['Pack of A4 card', 4.85], ['Glue sticks, box of 12', 6.49], ['Paint set', 12.99], ['Brushes, pack of 10', 3.75], ['Sugar paper, pack of 50', 5.6], ['Pencil crayons, class pack', 9.25], ['Scissors', 1.2]];
      const items = R.shuffle(all).slice(0, R.int(3, 4)).map(([nme, p]) => ({ nme, p, q: R.int(2, 10) }));
      const tot = rd(items.reduce((s, i) => s + i.p * i.q, 0), 2);
      let budget; do { budget = Math.round(tot * (0.85 + Math.random() * 0.3) / 5) * 5; } while (Math.abs(budget - tot) < 1);
      const ok = tot <= budget;
      return { stem: `A teaching assistant is ordering art supplies. The budget is £${budget}.` + table(['Item', 'Price each', 'Number needed'], items.map(i => [i.nme, gbp(i.p), i.q])),
        parts: [{ q: 'What is the total cost of the order?', type: 'num', ans: tot, money: true, pre: '£', m: 3 }, { q: 'Is the order within the budget?', type: 'choice', options: ['Yes', 'No'], ans: ok ? 0 : 1, shuffle: false }],
        steps: items.map(i => `${i.nme}: ${i.q} × ${gbp(i.p)} = ${gbp(i.p * i.q)}`).concat([`Total: <b>${gbp(tot)}</b>`, `${gbp(tot)} is ${ok ? 'less than' : 'more than'} £${budget}, so <b>${ok ? 'yes, it is within budget' : `no, it is ${gbp(tot - budget)} over budget`}</b>.`]) };
    } },
    { c: true, f() {
      let C, made, sold, p, prof;
      do { C = rd(R.int(1200, 3200) / 100, 2); made = R.int(24, 60); sold = made - R.int(0, 10); p = R.pick([0.5, 0.6, 0.75, 0.8, 1]); prof = rd(sold * p - C, 2); } while (Math.abs(prof) < 1);
      return { stem: `For a school cake sale, the ingredients for ${made} cakes cost ${gbp(C)}. ${sold} cakes are sold at ${money(p)} each.`,
        parts: [{ q: 'Did the sale make a profit or a loss?', type: 'choice', options: ['Profit', 'Loss'], ans: prof >= 0 ? 0 : 1, shuffle: false }, { q: 'How much profit or loss was made?', type: 'num', ans: Math.abs(prof), money: true, pre: '£', m: 2 }],
        steps: [`Money taken: ${sold} × ${money(p)} = ${gbp(sold * p)}`, `Profit = ${gbp(sold * p)} − ${gbp(C)} = ${gbp(prof)}`, prof >= 0 ? `Positive, so a <b>profit of ${gbp(prof)}</b>.` : `Negative, so a <b>loss of ${gbp(-prof)}</b>.`] };
    } },
    { c: true, x: true, f() {
      const P = R.int(12, 40) * 50, dp = R.pick([10, 15, 20]), mo = R.pick([12, 18, 24]);
      const dep = P * dp / 100, mp = Math.ceil((P - dep) * (1 + R.int(6, 18) / 100) / mo / 5) * 5, tot = dep + mp * mo;
      const item = R.pick(['washing machine', 'sofa', 'laptop', 'e-bike']);
      return { stem: `${An(item)} ${item} costs £${fmt(P)} cash. On credit, you pay a ${dp}% deposit and then ${mo} monthly payments of £${mp}.`,
        parts: [{ q: 'What is the total cost on credit?', type: 'num', ans: tot, money: true, pre: '£', m: 2 }, { q: 'How much more is this than the cash price?', type: 'num', ans: tot - P, money: true, pre: '£' }],
        steps: [`Deposit: ${dp}% of £${fmt(P)} = £${fmt(dep)}`, `Payments: ${mo} × £${mp} = £${fmt(mp * mo)}`, `Total on credit: £${fmt(dep)} + £${fmt(mp * mo)} = <b>£${fmt(tot)}</b>`, `Extra cost: £${fmt(tot)} − £${fmt(P)} = <b>£${fmt(tot - P)}</b>`] };
    } },
    { c: true, x: true, f() {
      const P = R.int(30, 90) * 100, r = R.pick([2.5, 3, 3.5, 4, 4.5, 5]), n = R.int(2, 5), m = 1 + r / 100, v = rd(P * Math.pow(m, n), 2);
      let car; do { car = Math.round((v + R.int(-400, 400)) / 50) * 50; } while (Math.abs(car - v) < 30);
      const ok = v >= car, nm = R.name(), yrs = [];
      for (let i = 1; i <= n; i++) yrs.push(`End of year ${i}: ${gbp(P * Math.pow(m, i))}`);
      return { stem: `${nm} puts £${fmt(P)} into a savings account that pays ${r}% <b>compound</b> interest a year, and adds no more money. ${nm} wants to buy a used car that costs £${fmt(car)}.`,
        parts: [decide(`After ${n} years, will ${nm} have enough money to buy the car? Choose Yes or No, and give the amount in the account after ${n} years.`, ok, [{ label: `Amount after ${n} years`, type: 'num', ans: v, money: true, pre: '£', tol: 0.02 }], 4)],
        steps: [`Multiplier: 100% + ${r}% = ${fmt(m)}`, `${fmt(P)} × ${fmt(m)}<sup>${n}</sup> = <b>${gbp(v)}</b>`, yrs.join('<br>'),
          ok ? `${gbp(v)} is more than £${fmt(car)}, so <b>Yes</b>, ${nm} can buy the car.` : `${gbp(v)} is less than £${fmt(car)}, so <b>No</b>. ${nm} will be ${gbp(car - v)} short.`] };
    } }
  ]
});

/* ---------------- Units and conversions ---------------- */
addTopic({
  id: 'm-convert', area: 'mea', name: 'Units and conversions', short: 'Metric units, imperial, currency, conversion graphs',
  spec: ['Convert between metric units', 'Convert between metric and imperial units using a conversion factor or a conversion graph', 'Convert between currencies'],
  learn: `
<h3>Metric units</h3>
<div class="tw"><table class="qt"><tbody>
<tr><th>Length</th><td>10 mm = 1 cm · 100 cm = 1 m · 1,000 m = 1 km</td></tr>
<tr><th>Mass</th><td>1,000 g = 1 kg · 1,000 kg = 1 tonne</td></tr>
<tr><th>Capacity</th><td>1,000 ml = 1 litre · 100 cl = 1 litre · 1 cm³ holds 1 ml</td></tr></tbody></table></div>
<div class="key"><p><b>Big unit → small unit:</b> multiply (there will be more of them). 2.45 km = 2,450 m<br><b>Small unit → big unit:</b> divide. 850 g = 0.85 kg</p></div>
<h3>Metric and imperial</h3><p>The question will give you the conversion. Decide whether to multiply or divide by asking: should the answer be bigger or smaller?</p>
<div class="key"><p>1 mile ≈ 1.6 km. 45 miles = 45 × 1.6 = <b>72 km</b> (km are smaller, so more of them)<br>1 kg ≈ 2.2 lb. 15 lb = 15 ÷ 2.2 = <b>6.8 kg</b></p></div>
<h3>Currency</h3><p>“£1 = €1.16” means multiply pounds by 1.16 to get euros, and divide euros by 1.16 to get pounds.</p>
<h3>Conversion graphs</h3><p>Go across from one axis to the line, then down (or up) to the other axis. Work out what one small square is worth first.</p>
<div class="warn"><strong>Watch out:</strong> 1 m² is not 100 cm². It is 100 × 100 = 10,000 cm², because both sides are converted.</div>
<div class="tip"><strong>Exam tip:</strong> check your answer makes sense. 45 miles cannot be 28 km, because a km is shorter than a mile.</div>`,
  gens: [
    { c: false, f() {
      const c = R.pick([['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['litres', 'ml', 1000], ['tonnes', 'kg', 1000]]);
      if (R.coin()) { const v = rd(R.int(105, 9950) / R.pick([100, 1000]), 3), a = rd(v * c[2], 4);
        return { stem: 'Convert the measurement.', parts: [{ q: `Change ${fmt(v)} ${c[0]} to ${c[1]}.`, type: 'num', ans: a, suf: c[1] }], steps: [`1 ${c[0].replace(/s$/, '')} = ${fmt(c[2])} ${c[1]}`, `Big unit to small unit, so multiply: ${fmt(v)} × ${fmt(c[2])} = <b>${fmt(a)} ${c[1]}</b>`] }; }
      const v = R.int(5, 9999), a = rd(v / c[2], 4);
      return { stem: 'Convert the measurement.', parts: [{ q: `Change ${fmt(v)} ${c[1]} to ${c[0]}.`, type: 'num', ans: a, suf: c[0] }], steps: [`${fmt(c[2])} ${c[1]} = 1 ${c[0].replace(/s$/, '')}`, `Small unit to big unit, so divide: ${fmt(v)} ÷ ${fmt(c[2])} = <b>${fmt(a)} ${c[0]}</b>`] };
    } },
    { c: true, f() {
      const c = R.pick([['miles', 'km', 1.6, '1 mile ≈ 1.6 km'], ['kg', 'pounds (lb)', 2.2, '1 kg ≈ 2.2 lb'], ['inches', 'cm', 2.54, '1 inch = 2.54 cm'], ['gallons', 'litres', 4.55, '1 gallon ≈ 4.55 litres']]);
      if (R.coin()) { const v = R.int(3, 120), a = rd(v * c[2], 1);
        return { stem: `Use ${c[3]}.`, parts: [{ q: `Change ${v} ${c[0]} to ${c[1]}. Give your answer to 1 decimal place.`, type: 'num', ans: a, tol: 0.051, show: `${a.toFixed(1)} ${c[1]}` }], steps: [`${c[1]} are smaller units, so the number gets bigger: multiply.`, `${v} × ${c[2]} = ${fmt(v * c[2])}`, `To 1 d.p.: <b>${a.toFixed(1)} ${c[1]}</b>`] }; }
      const v = R.int(5, 150), a = rd(v / c[2], 1);
      return { stem: `Use ${c[3]}.`, parts: [{ q: `Change ${v} ${c[1]} to ${c[0]}. Give your answer to 1 decimal place.`, type: 'num', ans: a, tol: 0.051, show: `${a.toFixed(1)} ${c[0]}` }], steps: [`${c[0]} are bigger units, so the number gets smaller: divide.`, `${v} ÷ ${c[2]} = ${fmt(rd(v / c[2], 4))}`, `To 1 d.p.: <b>${a.toFixed(1)} ${c[0]}</b>`] };
    } },
    { c: true, x: true, f() {
      const c = R.pick([['euros', '€', 1.16], ['US dollars', '$', 1.27], ['euros', '€', 1.14], ['US dollars', '$', 1.31]]);
      const a = R.int(15, 80) * 10, f = rd(a * c[2], 2), spent = Math.floor(f * (0.6 + Math.random() * 0.3)), left = rd(f - spent, 2), back = rd(left / c[2], 2);
      const n = R.name();
      return { stem: `${n} changes £${a} into ${c[0]} before a holiday. The exchange rate is £1 = ${c[1]}${c[2]}. On holiday ${n} spends ${c[1]}${spent}.`,
        parts: [{ q: `How many ${c[0]} does ${n} get?`, type: 'num', ans: f, tol: 0.005, pre: c[1], show: c[1] + fmt(f, 2) }, { q: `${n} changes the rest back at the same rate. How many pounds is that?`, type: 'num', ans: back, money: true, pre: '£', tol: 0.011, m: 2 }],
        steps: [`£${a} × ${c[2]} = <b>${c[1]}${fmt(f, 2)}</b>`, `Left over: ${c[1]}${fmt(f, 2)} − ${c[1]}${spent} = ${c[1]}${fmt(left, 2)}`, `Back to pounds, divide: ${fmt(left, 2)} ÷ ${c[2]} = <b>${gbp(back)}</b>`] };
    } },
    { c: false, f() {
      if (R.coin()) {
        const o = { x0: 0, x1: 50, xs: 10, y0: 0, y1: 80, ys: 10, minor: 5, xl: 'Miles', yl: 'Kilometres' };
        if (R.coin()) { const m = 5 * R.int(1, 9); return { stem: 'The graph converts between miles and kilometres.' + dConv(o, 1.6), parts: [{ q: `Use the graph to change ${m} miles into kilometres.`, type: 'num', ans: m * 1.6, tol: 2, suf: 'km', show: `${fmt(m * 1.6)} km (anything from ${fmt(m * 1.6 - 2)} to ${fmt(m * 1.6 + 2)} is fine)` }], steps: ['On the miles axis, each small square is 2 miles. On the km axis, each small square is 2 km.', `Go up from ${m} miles to the line, then across to the km axis.`, `It reads about <b>${fmt(m * 1.6)} km</b>.`] }; }
        const k = 8 * R.int(1, 9); return { stem: 'The graph converts between miles and kilometres.' + dConv(o, 1.6), parts: [{ q: `Use the graph to change ${k} km into miles.`, type: 'num', ans: k / 1.6, tol: 2, suf: 'miles', show: `${fmt(k / 1.6)} miles (anything from ${fmt(k / 1.6 - 2)} to ${fmt(k / 1.6 + 2)} is fine)` }], steps: ['Each small square on the km axis is 2 km; on the miles axis it is 2 miles.', `Go across from ${k} km to the line, then down to the miles axis.`, `It reads about <b>${fmt(k / 1.6)} miles</b>.`] };
      }
      const o = { x0: 0, x1: 20, xs: 5, y0: 0, y1: 45, ys: 5, minor: 5, xl: 'Kilograms', yl: 'Pounds (lb)' };
      const kg = 5 * R.int(1, 4); return { stem: 'The graph converts between kilograms and pounds.' + dConv(o, 2.2), parts: [{ q: `Use the graph to change ${kg} kg into pounds.`, type: 'num', ans: kg * 2.2, tol: 1.01, suf: 'lb', show: `${fmt(kg * 2.2)} lb (anything from ${fmt(kg * 2.2 - 1)} to ${fmt(kg * 2.2 + 1)} is fine)` }], steps: ['Each small square across is 1 kg; each small square up is 1 lb.', `Go up from ${kg} kg to the line, then across.`, `It reads about <b>${fmt(kg * 2.2)} lb</b>.`] };
    } },
    { c: false, f() {
      const L = R.pick([1.5, 2, 2.5, 3]), cup = R.pick([150, 200, 250, 300, 330]), ml = L * 1000, n = Math.floor(ml / cup), rem = ml - n * cup;
      return { stem: `A jug holds ${L} litres of squash. Each cup holds ${cup} ml.`, parts: [{ q: 'How many cups can be filled completely?', type: 'num', ans: n }],
        steps: [`Make the units the same: ${L} litres = ${fmt(ml)} ml`, `${fmt(ml)} ÷ ${cup} = ${n}${rem ? ` remainder ${rem}` : ''}`, rem ? `The ${rem} ml left over is not a full cup, so <b>${n} cups</b>.` : `<b>${n} cups</b>`] };
    } }
  ]
});

/* ---------------- Speed, density, rates ---------------- */
addTopic({
  id: 'm-compound', area: 'mea', name: 'Speed, density and rates', short: 'Compound measures: speed, density, rates of flow and pay',
  spec: ['Calculate using compound measures, including speed, density and rates of pay'],
  learn: `
<p>A compound measure joins two measurements, like miles <b>per</b> hour or grams <b>per</b> cm³. The word “per” means “divide by”.</p>
<div class="tri-wrap"><div class="tri"><span>D</span><span>S</span><span>T</span></div><div><p class="formula">Speed = Distance ÷ Time</p><p class="formula">Distance = Speed × Time</p><p class="formula">Time = Distance ÷ Speed</p></div></div>
<p>Cover the one you want: what is left shows the sum.</p>
<h3>Minutes are not decimals</h3>
<div class="key"><p>2 hours 15 minutes is <b>2.25 hours</b>, not 2.15. Divide the minutes by 60: 15 ÷ 60 = 0.25.<br>1.5 hours is 1 hour <b>30</b> minutes, not 1 hour 50.</p></div>
<div class="tw"><table class="qt"><thead><tr><th>Minutes</th><th>15</th><th>20</th><th>30</th><th>40</th><th>45</th></tr></thead><tbody><tr><th>Hours</th><td>0.25</td><td>0.333…</td><td>0.5</td><td>0.666…</td><td>0.75</td></tr></tbody></table></div>
<h3>Density</h3><div class="formula">Density = Mass ÷ Volume</div><p>Same triangle idea: Mass = Density × Volume.</p>
<h3>Other rates</h3><p>Litres per minute, pages per minute, pounds per hour: divide the total by the time to get the rate, or multiply the rate by the time to get the total.</p>
<div class="tip"><strong>Exam tip:</strong> write the units on your answer. “60” scores less well than “60 mph”.</div>`,
  gens: [
    { c: true, x: true, f() {
      const t = R.pick([[1, 15], [1, 30], [1, 45], [2, 15], [2, 30], [3, 20], [2, 40], [1, 20]]), hrs = t[0] + t[1] / 60;
      const s = t[1] % 20 === 0 ? 3 * R.int(10, 23) : 4 * R.int(8, 17), d = rd(s * hrs, 4);
      return { stem: `A delivery driver travels ${fmt(d)} miles in ${t[0]} hour${t[0] > 1 ? 's' : ''} ${t[1]} minutes.`, parts: [{ q: 'What is the average speed in miles per hour?', type: 'num', ans: s, suf: 'mph', tol: 0.05, m: 2 }],
        steps: [`Change the time into hours: ${t[1]} minutes = ${t[1]} ÷ 60 = ${fmt(rd(t[1] / 60, 4))} hours, so the time is ${fmt(rd(hrs, 4))} hours.`, `Speed = distance ÷ time = ${fmt(d)} ÷ ${fmt(rd(hrs, 4))}`, `= <b>${s} mph</b>`] };
    } },
    { c: true, f() {
      let s, t, d; do { s = R.pick([40, 48, 50, 60, 64, 70]); t = 15 * R.int(4, 20); d = s * t / 60; } while (d % 1);
      return { stem: `A coach travels ${d} km at an average speed of ${s} km/h.`, parts: [{ q: 'How long does the journey take?', type: 'hm', ans: t, m: 2 }],
        steps: [`Time = distance ÷ speed = ${d} ÷ ${s} = ${fmt(t / 60)} hours`, `${fmt(t / 60 - Math.floor(t / 60))} of an hour = ${fmt(t / 60 - Math.floor(t / 60))} × 60 = ${t % 60} minutes`, `<b>${hm(t)}</b>`] };
    } },
    { c: true, f() {
      const s = R.pick([12, 15, 18, 24, 45, 48, 54, 60, 66]), m = R.pick([20, 30, 40, 45, 90, 100]), d = rd(s * m / 60, 2);
      return { stem: `${R.name()} ${s < 30 ? 'cycles' : 'drives'} at an average speed of ${s} km/h for ${m} minutes.`, parts: [{ q: 'How far is that?', type: 'num', ans: d, suf: 'km', tol: 0.01 }],
        steps: [`${m} minutes = ${m} ÷ 60 = ${fmt(rd(m / 60, 4))} hours`, `Distance = speed × time = ${s} × ${fmt(rd(m / 60, 4))} = <b>${fmt(d)} km</b>`] };
    } },
    { c: true, f() {
      const mat = R.pick([['aluminium', 2.7], ['oak', 0.75], ['steel', 7.8], ['copper', 8.96], ['glass', 2.5], ['brass', 8.5]]), V = 10 * R.int(2, 50), mass = rd(mat[1] * V, 2);
      if (R.coin()) return { stem: `A block of ${mat[0]} has a mass of ${fmt(mass)} g and a volume of ${V} cm³.`, parts: [{ q: 'Work out its density.', type: 'num', ans: mat[1], suf: 'g/cm³', tol: 0.005 }], steps: ['Density = mass ÷ volume', `${fmt(mass)} ÷ ${V} = <b>${fmt(mat[1])} g/cm³</b>`] };
      return { stem: `The density of ${mat[0]} is ${mat[1]} g/cm³. A ${mat[0]} part has a volume of ${V} cm³.`, parts: [{ q: 'What is its mass?', type: 'num', ans: mass, suf: 'g', tol: 0.01 }], steps: ['Mass = density × volume', `${mat[1]} × ${V} = <b>${fmt(mass)} g</b>`] };
    } },
    { c: false, f() {
      if (R.coin()) { const r = R.pick([8, 10, 12, 15, 20, 25]), t = R.int(6, 40), cap = r * t;
        return { stem: `A water tank holds ${fmt(cap)} litres. A pump fills it at ${r} litres per minute.`, parts: [{ q: 'How many minutes will it take to fill the empty tank?', type: 'num', ans: t, suf: 'minutes' }], steps: ['Time = amount ÷ rate', `${fmt(cap)} ÷ ${r} = <b>${t} minutes</b>`] }; }
      let r, copies, pages; do { r = R.pick([15, 20, 25, 30, 40]); copies = R.int(20, 60); pages = R.pick([4, 6, 8, 10, 12]); } while ((copies * pages) % r);
      const t = copies * pages / r;
      return { stem: `A school printer prints ${r} pages per minute. ${R.name()} needs ${copies} copies of ${an(pages)} ${pages}-page booklet.`, parts: [{ q: 'How many minutes will the printing take?', type: 'num', ans: rd(t, 2), suf: 'minutes', tol: 0.05 }], steps: [`Total pages: ${copies} × ${pages} = ${copies * pages}`, `Time = ${copies * pages} ÷ ${r} = <b>${fmt(rd(t, 2))} minutes</b>`] };
    } },
    { c: true, f() {
      const rate = rd(R.int(220, 340) * 0.05, 2), h = R.pick([6, 7.5, 8, 12, 16, 22.5, 30]), pay = rd(rate * h, 2);
      return { stem: `${R.name()} earns ${gbp(pay)} for working ${h} hours.`, parts: [{ q: 'What is the hourly rate of pay?', type: 'num', ans: rate, money: true, pre: '£' }], steps: ['Rate of pay = pay ÷ hours', `${gbp(pay)} ÷ ${h} = <b>${gbp(rate)} per hour</b>`] };
    } }
  ]
});

/* ---------------- Time and timetables ---------------- */
addTopic({
  id: 'm-time', area: 'mea', name: 'Time and timetables', short: '12 and 24-hour clock, durations, timetables',
  spec: ['Read and convert between the 12-hour and 24-hour clock', 'Calculate durations and finishing times', 'Read and use timetables to plan journeys'],
  learn: `
<h3>The 24-hour clock</h3><p>From 1 pm onwards, add 12 to the hour (12:30 pm stays as 12:30). 7:45 pm → <b>19:45</b>. Before 10 am, add a leading zero: 9:05 am → <b>09:05</b>. Midnight is 00:00.</p>
<h3>Working out how long</h3><p>Count on in friendly jumps: to the next whole hour, then whole hours, then the minutes left.</p>
<div class="key"><p>09:47 to 13:15: 09:47 → 10:00 is 13 min · 10:00 → 13:00 is 3 h · 13:00 → 13:15 is 15 min<br>Total: 3 hours 28 minutes</p></div>
<div class="warn"><strong>Watch out:</strong> do not subtract times like ordinary numbers. 13:15 − 9:47 on a calculator gives 3.68, which is meaningless, because there are 60 minutes in an hour, not 100.</div>
<h3>Timetables</h3><p>Each <b>column</b> is one bus or train. Read down a column to follow one journey. To arrive by a time, find the last column that reaches your stop on or before it, then read up to the departure time.</p>
<div class="tip"><strong>Exam tip:</strong> mark the column you are using with a ruler or your finger. Most timetable mistakes come from slipping into the next column.</div>`,
  gens: [
    { c: false, f() {
      const m = R.int(13, 23) * 60 + R.pick([0, 5, 15, 20, 30, 35, 45, 50, 55]);
      if (R.coin()) return { stem: 'A meeting is booked for ' + twelve(m) + '.', parts: [{ q: 'Write this time using the 24-hour clock.', type: 'time', ans: m, need24: true }], steps: ['The time is pm (after midday), so add 12 to the hour.', `${Math.floor(m / 60) - 12} + 12 = ${Math.floor(m / 60)}`, `<b>${hhmm(m)}</b>`] };
      const am = R.int(1, 11) * 60 + R.pick([5, 10, 25, 40]);
      if (R.coin()) return { stem: `A train departs at ${hhmm(am)}.`, parts: [{ q: 'Write this time using the 12-hour clock (with am or pm).', type: 'time', ans: am, need12: true }], steps: ['The hour is less than 12, so it is in the morning.', `<b>${twelve(am)}</b>`] };
      return { stem: `A train departs at ${hhmm(m)}.`, parts: [{ q: 'Write this time using the 12-hour clock (with am or pm).', type: 'time', ans: m, need12: true }], steps: ['The hour is more than 12, so it is pm. Subtract 12 from the hour.', `${Math.floor(m / 60)} − 12 = ${Math.floor(m / 60) - 12}`, `<b>${twelve(m)}</b>`] };
    } },
    { c: false, f() {
      const dep = R.int(6, 14) * 60 + R.int(1, 59), dur = R.int(40, 320), arr = dep + dur;
      const toHr = 60 - dep % 60, mid = Math.floor(arr / 60) - Math.ceil(dep / 60), last = arr % 60;
      return { stem: `A train leaves at ${hhmm(dep)} and arrives at ${hhmm(arr)}.`, parts: [{ q: 'How long is the journey?', type: 'hm', ans: dur, m: 2 }],
        steps: mid >= 0 ? [`${hhmm(dep)} → ${hhmm(dep + toHr)} is ${pl(toHr, 'minute')}`, ...(mid ? [`${hhmm(dep + toHr)} → ${hhmm(Math.floor(arr / 60) * 60)} is ${mid} hour${mid === 1 ? '' : 's'}`] : []), `${hhmm(Math.floor(arr / 60) * 60)} → ${hhmm(arr)} is ${pl(last, 'minute')}`, `Total: ${toHr} + ${last} = ${toHr + last} minutes${mid ? `, plus ${mid} hour${mid === 1 ? '' : 's'}` : ''} = <b>${hm(dur)}</b>`] : [`${hhmm(dep)} → ${hhmm(arr)} is <b>${hm(dur)}</b>`] };
    } },
    { c: false, x: true, f() {
      const stops = ['Town Centre', 'Hospital', 'Retail Park', 'Railway Station'], gaps = [R.int(6, 14), R.int(5, 12), R.int(8, 18)];
      const off = [0, gaps[0], gaps[0] + gaps[1], gaps[0] + gaps[1] + gaps[2]], first = 8 * 60 + R.int(0, 30), every = R.pick([20, 25, 30, 35]);
      const buses = [0, 1, 2, 3, 4].map(i => first + i * every);
      const k = R.int(1, 3), arriveBy = buses[k] + off[3] + R.int(2, every - 3);
      return { stem: 'Here is part of a bus timetable.' + table(['Stop'].concat(buses.map((_, i) => 'Bus ' + (i + 1))), stops.map((s, j) => [s].concat(buses.map(b => hhmm(b + off[j]))))) + `${R.name()} needs to be at the ${stops[3]} by ${hhmm(arriveBy)}.`,
        parts: [{ q: `What is the latest time they can leave the ${stops[0]}?`, type: 'time', ans: buses[k], m: 2 }, { q: `How many minutes does the bus take from the ${stops[0]} to the ${stops[3]}?`, type: 'num', ans: off[3], suf: 'minutes' }],
        steps: [`Read along the ${stops[3]} row: the last bus arriving by ${hhmm(arriveBy)} gets there at ${hhmm(buses[k] + off[3])} (bus ${k + 1}).`, `Read up that column to the ${stops[0]}: <b>${hhmm(buses[k])}</b>`, `Journey time: ${hhmm(buses[k])} → ${hhmm(buses[k] + off[3])} = <b>${off[3]} minutes</b>`] };
    } },
    { c: false, f() {
      const start = R.int(8, 13) * 60 + R.pick([0, 15, 30, 45, 50]), n = R.int(2, 4), len = R.pick([35, 40, 45, 50, 55]), br = R.pick([10, 15, 20]), end = start + n * len + (n - 1) * br;
      return { stem: `A training day starts at ${hhmm(start)}. There are ${n} sessions of ${len} minutes, with a ${br}-minute break between each session.`, parts: [{ q: 'What time does the last session finish?', type: 'time', ans: end, m: 2 }],
        steps: [`Sessions: ${n} × ${len} = ${n * len} minutes`, `Breaks: there are ${n - 1} break${n > 2 ? 's' : ''} between ${n} sessions, so ${n - 1} × ${br} = ${(n - 1) * br} minutes`, `Total: ${n * len + (n - 1) * br} minutes = ${hm(n * len + (n - 1) * br)}`, `${hhmm(start)} + ${hm(n * len + (n - 1) * br)} = <b>${hhmm(end)}</b>`] };
    } }
  ]
});

/* ---------------- Perimeter and area ---------------- */
function piTol(v, v314, dp) { return Math.abs(v - v314) + 0.5 * Math.pow(10, -dp) + 1e-9; }
addTopic({
  id: 'm-area', area: 'mea', name: 'Perimeter and area', short: 'Rectangles, triangles, circles, composite shapes',
  spec: ['Calculate perimeters and areas of 2D shapes, including triangles, circles and composite shapes', 'Formulae are given for shapes other than rectangles, triangles and circles'],
  learn: `
<h3>Perimeter</h3><p>The distance all the way round the edge. Add every side, including ones you have to work out.</p>
<h3>Area formulae you must know</h3>
<div class="tw"><table class="qt"><tbody>
<tr><th>Rectangle</th><td>length × width</td></tr>
<tr><th>Triangle</th><td>½ × base × <b>perpendicular</b> height</td></tr>
<tr><th>Circle area</th><td>π × r²</td></tr>
<tr><th>Circle circumference</th><td>π × d (or 2 × π × r)</td></tr></tbody></table></div>
<p>Other formulae, such as the trapezium ½(a + b)h, are given in the question.</p>
<div class="key"><p>A circle with diameter 10 cm has radius 5 cm.<br>Area = π × 5² = π × 25 = <b>78.5 cm²</b> · Circumference = π × 10 = <b>31.4 cm</b></p></div>
<h3>Composite shapes</h3><p>Split the shape into rectangles (and triangles or half circles), find each area, then add. Missing sides come from the sides you know.</p>
<h3>Real-life area problems</h3><ol class="steps"><li>Work out the area</li><li>Divide by what one pack (tin, roll) covers</li><li>Round <b>up</b> to whole packs: you cannot buy 6.7 packs</li><li>Multiply by the price</li></ol>
<div class="warn"><strong>Watch out:</strong> area units are squared (m², cm²). Perimeter units are not.</div>
<div class="tip"><strong>Exam tip:</strong> use the π button on the calculator. Using 3.14 is usually accepted too, but say which you used.</div>`,
  gens: [
    { c: false, x: true, f() {
      let W, H, a, b; do { W = R.int(8, 16); H = R.int(6, 12); a = R.int(3, W - 3); b = R.int(2, H - 3); } while (W - a < 2);
      const area = a * H + (W - a) * b;
      return { stem: `Here is a plan of a classroom floor. All corners are right angles.` + dLshape(W, H, a, b, 'm'),
        parts: [{ q: 'Work out the area of the floor.', type: 'num', ans: area, suf: 'm²', m: 3 }, { q: 'Work out the perimeter of the floor.', type: 'num', ans: 2 * (W + H), suf: 'm', m: 2 }],
        steps: [`Split into two rectangles. Left part: ${a} × ${H} = ${a * H} m²`, `Right part: width ${W} − ${a} = ${W - a} m, height ${b} m, so ${W - a} × ${b} = ${(W - a) * b} m²`, `Area = ${a * H} + ${(W - a) * b} = <b>${area} m²</b>`, `Missing sides: ${W - a} m and ${H} − ${b} = ${H - b} m`, `Perimeter = ${a} + ${H - b} + ${W - a} + ${b} + ${W} + ${H} = <b>${2 * (W + H)} m</b>`] };
    } },
    { c: false, f() {
      const b = 2 * R.int(2, 10), h = R.int(3, 15);
      return { stem: 'A triangular sign has these measurements.' + dTri(b, h, 'cm'), parts: [{ q: 'Work out the area of the sign.', type: 'num', ans: b * h / 2, suf: 'cm²', m: 2 }],
        steps: ['Area of a triangle = ½ × base × height', `½ × ${b} × ${h} = ${b / 2} × ${h} = <b>${b * h / 2} cm²</b>`] };
    } },
    { c: true, f() {
      const ctx = R.pick([['a circular rug', 'm', [0.6, 0.75, 0.8, 1, 1.2]], ['a round table top', 'cm', [40, 45, 50, 55, 60]], ['a circular flower bed', 'm', [1, 1.5, 2, 2.5, 3, 3.5]], ['a clock face', 'cm', [10, 12, 14, 15, 18, 20]], ['a round pond', 'm', [1.2, 1.5, 2, 2.4, 3]]]);
      const u = ctx[1], r = R.pick(ctx[2]), isD = R.coin(), v = isD ? rd(2 * r, 2) : r, area = R.coin();
      const val = area ? Math.PI * r * r : Math.PI * 2 * r, v314 = area ? 3.14 * r * r : 3.14 * 2 * r, ans = rd(val, 1), su = area ? u + '²' : u;
      return { stem: `Here is ${ctx[0]}.` + dCircle(v, isD, u), parts: [{ q: `Work out its ${area ? 'area' : 'circumference'}. Give your answer to 1 decimal place.`, type: 'num', ans, tol: piTol(val, v314, 1), suf: su, show: `${ans.toFixed(1)} ${su}`, m: 2 }],
        steps: (isD ? [`The diameter is ${fmt(v)} ${u}, so the radius is ${fmt(r)} ${u}.`] : [`The radius is ${fmt(r)} ${u}${area ? '' : `, so the diameter is ${fmt(rd(2 * r, 2))} ${u}`}.`]).concat(area ? [`Area = π × r² = π × ${fmt(r)}² = π × ${fmt(rd(r * r, 4))}`, `= ${fmt(rd(val, 3))}… = <b>${ans.toFixed(1)} ${su}</b>`] : [`Circumference = π × d = π × ${fmt(rd(2 * r, 2))}`, `= ${fmt(rd(val, 3))}… = <b>${ans.toFixed(1)} ${su}</b>`]) };
    } },
    { c: true, x: true, f() {
      const l = rd(R.int(38, 65) / 10, 1), w = rd(R.int(25, 37) / 10, 1), area = rd(l * w, 2), cov = R.pick([1.5, 2, 2.2, 2.5]), packs = Math.ceil(area / cov - 1e-9), price = R.int(14, 34) + 0.99;
      return { stem: `A rectangular room is ${l} m long and ${w} m wide. Flooring is sold in packs that cover ${cov} m². Each pack costs ${gbp(price)}.`,
        parts: [{ q: 'What is the area of the floor?', type: 'num', ans: area, suf: 'm²', tol: 0.005 }, { q: 'How many packs are needed?', type: 'num', ans: packs, m: 2 }, { q: 'How much will the packs cost?', type: 'num', ans: rd(packs * price, 2), money: true, pre: '£' }],
        steps: [`Area = ${l} × ${w} = <b>${fmt(area)} m²</b>`, `Packs: ${fmt(area)} ÷ ${cov} = ${fmt(rd(area / cov, 3))}`, `Round up, because a part pack is still a whole pack to buy: <b>${packs} packs</b>`, `Cost: ${packs} × ${gbp(price)} = <b>${gbp(packs * price)}</b>`] };
    } },
    { c: true, x: true, f() {
      const l = R.int(6, 14), w = 2 * R.int(2, 5), r = w / 2, val = l * w + 0.5 * Math.PI * r * r, v314 = l * w + 0.5 * 3.14 * r * r, ans = rd(val, 1);
      return { stem: 'A lawn is a rectangle with a semicircle on one end.' + dSemiRect(l, w, 'm'), parts: [{ q: 'Work out the area of the lawn. Give your answer to 1 decimal place.', type: 'num', ans, tol: piTol(val, v314, 1), suf: 'm²', show: `${ans.toFixed(1)} m²`, m: 3 }],
        steps: [`Rectangle: ${l} × ${w} = ${l * w} m²`, `The semicircle’s diameter is ${w} m, so its radius is ${r} m.`, `Semicircle: ½ × π × ${r}² = ${fmt(rd(0.5 * Math.PI * r * r, 3))} m²`, `Total: ${l * w} + ${fmt(rd(0.5 * Math.PI * r * r, 3))} = <b>${ans.toFixed(1)} m²</b>`] };
    } },
    { c: true, f() {
      let a, b, h; do { a = R.int(4, 10) / 2; b = R.int(8, 18) / 2; h = R.int(4, 10) / 2; } while (b - a < 1);
      return { stem: 'A patio is a trapezium. Area of a trapezium = ½(a + b)h' + dTrap(a, b, h, 'm'), parts: [{ q: 'Work out the area.', type: 'num', ans: (a + b) / 2 * h, suf: 'm²', m: 2 }],
        steps: [`a = ${a}, b = ${b}, h = ${h}`, `½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h}`, `= ${fmt((a + b) / 2)} × ${h} = <b>${fmt((a + b) / 2 * h)} m²</b>`] };
    } },
    { c: true, f() {
      const l = R.int(8, 25), w = R.int(5, 15), gate = R.pick([1, 1.5, 2]), cost = rd(R.int(18, 45) + R.pick([0, 0.5]), 2), len = 2 * (l + w) - gate;
      return { stem: `A rectangular play area is ${l} m by ${w} m. It needs a fence all the way round, except for a gate ${gate} m wide. Fencing costs ${gbp(cost)} per metre.`,
        parts: [{ q: 'How many metres of fencing are needed?', type: 'num', ans: len, suf: 'm', m: 2 }, { q: 'How much will the fencing cost?', type: 'num', ans: rd(len * cost, 2), money: true, pre: '£' }],
        steps: [`Perimeter: ${l} + ${w} + ${l} + ${w} = ${2 * (l + w)} m`, `Take off the gate: ${2 * (l + w)} − ${gate} = <b>${fmt(len)} m</b>`, `Cost: ${fmt(len)} × ${gbp(cost)} = <b>${gbp(len * cost)}</b>`] };
    } },
    { c: true, x: true, f() {
      const nm = R.name(), med = R.coin();
      let area, dia, aSteps, intro;
      if (med) {
        let W, H, a, b; do { W = R.int(5, 9); H = R.int(4, 8); a = R.int(2, W - 2); b = R.int(2, H - 2); } while (W - a < 2);
        area = a * H + (W - a) * b; dia = dLshape(W, H, a, b, 'm');
        intro = `${nm} is putting new flooring in a kitchen. Here is a plan of the floor. All corners are right angles.`;
        aSteps = [`Split into two rectangles: ${a} × ${H} = ${a * H} m² and ${W - a} × ${b} = ${(W - a) * b} m²`, `Area = ${a * H} + ${(W - a) * b} = <b>${area} m²</b>`];
      } else {
        let a, b, h; do { a = R.int(3, 6); b = R.int(6, 10); h = R.int(3, 6); } while (b - a < 2);
        area = (a + b) / 2 * h; dia = dTrap(a, b, h, 'm');
        intro = `${nm} is paving a patio in the shape of a trapezium. Area of a trapezium = ½(a + b)h`;
        aSteps = [`½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h}`, `Area = ${fmt((a + b) / 2)} × ${h} = <b>${fmt(area)} m²</b>`];
      }
      const raw = med ? (() => { let v; do { v = []; for (let i = 0; i < 5; i++) v.push(R.int(24, 64)); } while (new Set(v).size < 5); return v; })() : modeList(6, 24, 48);
      const prices = raw.map(x => x / 2), st = statsOf(prices), price = med ? st.med : st.mode, cost = rd(area * price, 2);
      let budget; do { budget = Math.round((cost + R.int(-80, 80)) / 10) * 10; } while (Math.abs(budget - cost) < 5);
      const ok = cost <= budget, word = med ? 'median' : 'mode';
      return { stem: `${intro}${dia}<p>${nm} looks up the price per m² from ${prices.length} ${med ? 'suppliers' : 'websites'}:</p><div class="data">${prices.map(p => gbp(p)).join(', &nbsp;')}</div><p>${nm} decides to pay the ${word} price${med ? '' : ' (the price that comes up most often)'}.</p>`,
        parts: [{ q: `Work out the area of the ${med ? 'floor' : 'patio'}.`, type: 'num', ans: area, suf: 'm²', tol: 0.005, m: 2 },
          { q: `What is the ${word} price per m²?`, type: 'num', ans: price, money: true, pre: '£' },
          decide(`${nm} has £${fmt(budget)} to spend. Is that enough? Choose Yes or No, and give the total cost.`, ok, [{ label: 'Total cost', type: 'num', ans: cost, money: true, pre: '£' }], 3)],
        steps: aSteps.concat([med ? `Prices in order: ${st.s.map(p => gbp(p)).join(', ')}. The middle one is <b>${gbp(price)}</b>` : `${gbp(price)} comes up most often, so the mode is <b>${gbp(price)}</b>`,
          `Total cost: ${fmt(area)} × ${gbp(price)} = <b>${gbp(cost)}</b>`, ok ? `${gbp(cost)} is less than £${fmt(budget)}, so <b>Yes</b>, it is enough.` : `${gbp(cost)} is more than £${fmt(budget)}, so <b>No</b>. ${nm} is ${gbp(cost - budget)} short.`]) };
    } },
    { c: true, x: true, f() {
      const l = rd(R.int(30, 55) / 10, 1), w = rd(R.int(25, 40) / 10, 1), h = 2.4, door = 1.6, win = R.pick([1.2, 1.5, 2]);
      const walls = rd(2 * (l + w) * h, 2), A = rd(walls - door - win, 2), cov = R.pick([10, 12, 13, 15]), tins = Math.ceil(2 * A / cov - 1e-9), price = R.int(14, 27) + 0.99, cost = rd(tins * price, 2);
      let budget; do { budget = Math.round((cost + R.int(-40, 40)) / 10) * 10; } while (Math.abs(budget - cost) < 3);
      const ok = cost <= budget, nm = R.name();
      return { stem: `${nm} is painting the four walls of a room. The room is ${fmt(l)} m long and ${fmt(w)} m wide, and the walls are ${h} m high. There is a door with an area of ${door} m² and a window with an area of ${win} m², which will not be painted.<p>${nm} will give the walls <b>2 coats</b>. One tin of paint covers ${cov} m² with one coat, and costs ${gbp(price)}.</p>`,
        parts: [{ q: 'Work out the area of wall to be painted.', type: 'num', ans: A, suf: 'm²', tol: 0.005, m: 2 },
          decide(`${nm} has £${budget} to spend on paint. Is that enough? Choose Yes or No, and give the number of tins needed and the total cost.`, ok, [{ label: 'Number of tins', type: 'num', ans: tins }, { label: 'Total cost', type: 'num', ans: cost, money: true, pre: '£' }], 3)],
        steps: [`Perimeter of the room: 2 × (${fmt(l)} + ${fmt(w)}) = ${fmt(rd(2 * (l + w), 1))} m`, `Area of all four walls: ${fmt(rd(2 * (l + w), 1))} × ${h} = ${fmt(walls)} m²`, `Take off the door and window: ${fmt(walls)} − ${door} − ${win} = <b>${fmt(A)} m²</b>`,
          `Two coats: ${fmt(A)} × 2 = ${fmt(rd(2 * A, 2))} m²`, `Tins: ${fmt(rd(2 * A, 2))} ÷ ${cov} = ${fmt(rd(2 * A / cov, 3))}. Round up: <b>${tins} tins</b>`, `Cost: ${tins} × ${gbp(price)} = <b>${gbp(cost)}</b>`,
          ok ? `${gbp(cost)} is less than £${budget}, so <b>Yes</b>, it is enough.` : `${gbp(cost)} is more than £${budget}, so <b>No</b>. ${nm} is ${gbp(cost - budget)} short.`] };
    } },
    { c: true, x: true, f() {
      let d, roll, C, rolls;
      do { d = R.pick([2, 2.4, 2.5, 3, 3.2, 3.6, 4, 4.5, 5]); roll = R.pick([2, 2.5, 3]); C = Math.PI * d; rolls = Math.ceil(C / roll); } while (Math.ceil(3.14 * d / roll) !== rolls || rolls - C / roll < 0.08);
      const bought = rolls + R.pick([-1, 0, 1]), ok = bought >= rolls, nm = R.name(), ans = rd(C, 1);
      return { stem: `${nm} wants to put a fence around the edge of a circular pond. The pond has a diameter of ${fmt(d)} m. Fencing is sold in rolls ${fmt(roll)} m long.` + dCircle(d, true, 'm'),
        parts: [{ q: 'Work out the circumference of the pond. Give your answer to 1 decimal place.', type: 'num', ans, tol: piTol(C, 3.14 * d, 1), suf: 'm', show: `${ans.toFixed(1)} m`, m: 2 },
          decide(`${nm} has bought ${bought} rolls. Is that enough? Choose Yes or No, and give the number of rolls needed.`, ok, [{ label: 'Rolls needed', type: 'num', ans: rolls }], 2)],
        steps: [`Circumference = π × d = π × ${fmt(d)} = ${fmt(rd(C, 3))}… = <b>${ans.toFixed(1)} m</b>`, `Rolls: ${fmt(rd(C, 3))} ÷ ${fmt(roll)} = ${fmt(rd(C / roll, 3))}. Round up: <b>${rolls} rolls</b>`,
          ok ? `${bought} rolls is enough, so <b>Yes</b>.` : `${bought} rolls is not enough, so <b>No</b>. ${nm} needs 1 more roll.`] };
    } }
  ]
});

/* ---------------- Volume and surface area ---------------- */
addTopic({
  id: 'm-volume', area: 'mea', name: 'Volume and surface area', short: 'Cuboids, cylinders, capacity, packing',
  spec: ['Use formulae to find volumes and surface areas of 3D shapes, including cylinders', 'Formulae are given for 3D shapes other than cuboids and cylinders'],
  learn: `
<h3>Volume</h3><p>Volume is the space inside a 3D shape, in cubic units (cm³, m³).</p>
<div class="tw"><table class="qt"><tbody><tr><th>Cuboid</th><td>length × width × height</td></tr><tr><th>Cylinder</th><td>π × r² × h (area of the circle × height)</td></tr></tbody></table></div>
<div class="key"><p>Fish tank 60 cm × 30 cm × 40 cm = 72,000 cm³.<br><b>1,000 cm³ = 1 litre</b>, so it holds 72,000 ÷ 1,000 = <b>72 litres</b>.<br><b>1 m³ = 1,000 litres</b>.</p></div>
<h3>Surface area</h3><p>The total area of all the faces. A cuboid has 6 faces in 3 matching pairs:</p>
<div class="formula">Surface area = 2 × (lw + lh + wh)</div>
<h3>Packing problems</h3><p>Work out how many fit along each edge, then multiply. A 60 × 40 × 30 box holds 20 × 20 × 10 cartons as 3 × 2 × 3 = <b>18</b>.</p>
<div class="warn"><strong>Watch out:</strong> make all lengths the same unit before multiplying. 2 m × 50 cm × 30 cm will not work until you write 200 cm.</div>
<div class="tip"><strong>Exam tip:</strong> when a question mixes m³ and litres, write the conversion as a separate line of working.</div>`,
  gens: [
    { c: true, x: true, f() {
      const l = 5 * R.int(6, 20), w = 5 * R.int(4, 10), h = 5 * R.int(4, 12), V = l * w * h;
      return { stem: 'A fish tank is a cuboid.' + dCuboid(l, w, h, 'cm'), parts: [{ q: 'Work out the volume of the tank.', type: 'num', ans: V, suf: 'cm³', m: 2 }, { q: 'How many litres of water does it hold when full? (1,000 cm³ = 1 litre)', type: 'num', ans: V / 1000, suf: 'litres' }],
        steps: [`Volume = ${l} × ${w} × ${h} = <b>${fmt(V)} cm³</b>`, `Litres: ${fmt(V)} ÷ 1,000 = <b>${fmt(V / 1000)} litres</b>`] };
    } },
    { c: true, f() {
      const isD = R.coin(), r = R.int(20, 35), h = 5 * R.int(12, 20), cm3 = Math.PI * r * r * h, val = cm3 / 1000, v314 = 3.14 * r * r * h / 1000, ans = Math.round(val);
      return { stem: `A cylindrical water butt has ${isD ? 'a diameter' : 'a radius'} of ${isD ? 2 * r : r} cm and a height of ${h} cm. (1,000 cm³ = 1 litre)` + dCyl(isD ? 2 * r : r, h, 'cm', isD), parts: [{ q: 'How many litres does it hold when full? Give your answer to the nearest litre.', type: 'num', ans, tol: piTol(val, v314, 0), suf: 'litres', m: 3 }],
        steps: (isD ? [`Radius = ${2 * r} ÷ 2 = ${r} cm`] : []).concat([`Volume = π × r² × h = π × ${r}² × ${h}`, `= π × ${r * r} × ${h} = ${fmt(rd(cm3, 1))} cm³`, `In litres: ${fmt(rd(cm3, 1))} ÷ 1,000 = ${fmt(rd(val, 3))}`, `To the nearest litre: <b>${fmt(ans)} litres</b>`]) };
    } },
    { c: false, f() {
      const l = R.int(3, 12), w = R.int(2, 10), h = R.int(2, 9), sa = 2 * (l * w + l * h + w * h);
      return { stem: 'A gift box is a closed cuboid.' + dCuboid(l, w, h, 'cm'), parts: [{ q: 'Work out the total surface area of the box.', type: 'num', ans: sa, suf: 'cm²', m: 3 }],
        steps: [`Top and bottom: 2 × ${l} × ${w} = ${2 * l * w}`, `Front and back: 2 × ${l} × ${h} = ${2 * l * h}`, `Two ends: 2 × ${w} × ${h} = ${2 * w * h}`, `Total: ${2 * l * w} + ${2 * l * h} + ${2 * w * h} = <b>${sa} cm²</b>`] };
    } },
    { c: false, x: true, f() {
      const s = [R.pick([10, 15, 20]), R.pick([10, 15, 20]), R.pick([5, 10, 15])], k = [R.int(2, 6), R.int(2, 5), R.int(2, 4)], B = s.map((v, i) => v * k[i]);
      return { stem: `Small boxes measure ${s[0]} cm × ${s[1]} cm × ${s[2]} cm. They are packed, all the same way up, into a crate measuring ${B[0]} cm × ${B[1]} cm × ${B[2]} cm.`,
        parts: [{ q: 'What is the greatest number of small boxes that fit in the crate?', type: 'num', ans: k[0] * k[1] * k[2], m: 2 }],
        steps: [`Along the length: ${B[0]} ÷ ${s[0]} = ${k[0]}`, `Along the width: ${B[1]} ÷ ${s[1]} = ${k[1]}`, `Up the height: ${B[2]} ÷ ${s[2]} = ${k[2]}`, `${k[0]} × ${k[1]} × ${k[2]} = <b>${k[0] * k[1] * k[2]} boxes</b>`] };
    } },
    { c: true, x: true, f() {
      const l = R.pick([1.5, 1.8, 2, 2.4, 3]), w = R.pick([0.6, 0.8, 1, 1.2]), d = R.pick([0.25, 0.3, 0.4, 0.5]), V = rd(l * w * d, 4), L = rd(V * 1000, 2), bags = Math.ceil(L / 50 - 1e-9);
      return { stem: `A school garden club is filling a raised bed ${l} m long, ${w} m wide and ${d} m deep with compost. Compost comes in 50-litre bags. (1 m³ = 1,000 litres)`,
        parts: [{ q: 'What is the volume of the bed in m³?', type: 'num', ans: V, suf: 'm³', tol: 0.0005 }, { q: 'How many bags of compost are needed?', type: 'num', ans: bags, m: 2 }],
        steps: [`Volume = ${l} × ${w} × ${d} = <b>${fmt(V)} m³</b>`, `In litres: ${fmt(V)} × 1,000 = ${fmt(L)} litres`, `Bags: ${fmt(L)} ÷ 50 = ${fmt(rd(L / 50, 3))}`, `Round up: <b>${bags} bags</b>`] };
    } }
  ]
});

/* ---------------- Scale drawings ---------------- */
addTopic({
  id: 'm-scale', area: 'mea', name: 'Scale drawings and maps', short: 'Map scales, plans, real measurements',
  spec: ['Calculate actual dimensions from scale drawings', 'Create a scale diagram from actual measurements'],
  learn: `
<h3>Two ways to write a scale</h3>
<div class="key"><p><b>“1 cm represents 2 m”</b>: every 1 cm on the plan is 2 m in real life. 7.5 cm on the plan → 7.5 × 2 = <b>15 m</b>.</p>
<p><b>Ratio 1 : 50</b>: everything in real life is 50 times bigger, in the <b>same units</b>. 9 cm on the plan → 9 × 50 = 450 cm = <b>4.5 m</b>.</p></div>
<h3>Map scales</h3><p>1 : 25,000 means 1 cm on the map is 25,000 cm in real life.</p>
<ol class="steps"><li>Multiply by the scale: 6 cm × 25,000 = 150,000 cm</li><li>÷ 100 to get metres: 1,500 m</li><li>÷ 1,000 to get km: <b>1.5 km</b></li></ol>
<p>Shortcut: on a 1 : 25,000 map, 4 cm = 1 km. On a 1 : 50,000 map, 2 cm = 1 km.</p>
<h3>Drawing to scale</h3><p>Go the other way: divide the real length by the scale. A 4 m wall at 1 : 50 → 400 cm ÷ 50 = <b>8 cm</b> on the plan.</p>
<div class="tip"><strong>Exam tip:</strong> when you draw a plan, use a sharp pencil and a ruler, label each length, and write the scale on the drawing.</div>`,
  gens: [
    { c: true, f() {
      const sc = R.pick([25000, 50000]), cm = rd(R.int(3, 24) / 2, 1), cmR = cm * sc, km = cmR / 100000;
      return { stem: `A walking map has a scale of 1 : ${fmt(sc)}. Two villages are ${cm} cm apart on the map.`, parts: [{ q: 'What is the real distance between them, in kilometres?', type: 'num', ans: km, suf: 'km', m: 2 }],
        steps: [`Real distance = ${cm} × ${fmt(sc)} = ${fmt(cmR)} cm`, `÷ 100 = ${fmt(cmR / 100)} m`, `÷ 1,000 = <b>${fmt(km)} km</b>`] };
    } },
    { c: false, f() {
      const real = R.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7.5]), plan = real * 100 / 50;
      if (R.coin()) return { stem: 'A plan of a classroom is drawn to a scale of 1 : 50.', parts: [{ q: `The real wall is ${real} m long. How long is it on the plan, in cm?`, type: 'num', ans: plan, suf: 'cm' }], steps: [`${real} m = ${real * 100} cm`, `${real * 100} ÷ 50 = <b>${fmt(plan)} cm</b>`] };
      return { stem: 'A plan of a classroom is drawn to a scale of 1 : 50.', parts: [{ q: `A wall is ${fmt(plan)} cm long on the plan. How long is the real wall, in metres?`, type: 'num', ans: real, suf: 'm' }], steps: [`${fmt(plan)} × 50 = ${fmt(plan * 50)} cm`, `÷ 100 = <b>${fmt(real)} m</b>`] };
    } },
    { c: false, x: true, f() {
      const x = R.pick([2, 4, 5]), l = rd(R.int(6, 16) / 2, 1), w = rd(R.int(4, 12) / 2, 1);
      return { stem: `On a plan of a car park, 1 cm represents ${x} m. The car park is ${l} cm long and ${w} cm wide on the plan.`,
        parts: [{ q: 'How long is the real car park?', type: 'num', ans: l * x, suf: 'm' }, { q: 'What is the real area of the car park?', type: 'num', ans: rd(l * x * w * x, 2), suf: 'm²', m: 2 }],
        steps: [`Real length: ${l} × ${x} = <b>${fmt(l * x)} m</b>`, `Real width: ${w} × ${x} = ${fmt(w * x)} m`, `Area: ${fmt(l * x)} × ${fmt(w * x)} = <b>${fmt(rd(l * x * w * x, 2))} m²</b>`, '(Convert to real lengths first. Multiplying the plan area by the scale does not work.)'] };
    } },
    { c: true, f() {
      let gap, sofa; do { gap = rd(R.int(30, 60) / 10, 1); sofa = rd(R.int(150, 290) / 100, 2); } while (Math.abs(gap * 50 / 100 - sofa) < 0.05);
      const real = gap * 50 / 100, fits = sofa <= real;
      return { stem: `On a 1 : 50 plan, the space for a sofa measures ${gap} cm. The sofa is ${sofa} m wide.`, parts: [{ q: 'Will the sofa fit in the space?', type: 'choice', options: ['Yes', 'No'], ans: fits ? 0 : 1, shuffle: false, m: 2 }],
        steps: [`Real space: ${gap} × 50 = ${fmt(gap * 50)} cm = ${fmt(real)} m`, `The sofa is ${sofa} m.`, `${fits ? `${sofa} m ≤ ${fmt(real)} m, so <b>yes, it fits</b>.` : `${sofa} m is more than ${fmt(real)} m, so <b>no, it does not fit</b>.`}`] };
    } }
  ]
});

/* ---------------- Angles, coordinates and 3D shapes ---------------- */
addTopic({
  id: 'm-shape', area: 'mea', name: 'Angles, coordinates and 3D shapes', short: 'Angle facts, bearings, coordinates, plans and elevations',
  spec: ['Calculate values of angles and use bearings', 'Use coordinates in 2D, positive and negative, to describe positions', 'Understand and use common 2D representations of 3D objects, including plans and elevations'],
  learn: `
<h3>Angle facts</h3>
<div class="tw"><table class="qt"><tbody><tr><th>On a straight line</th><td>add up to 180°</td></tr><tr><th>Around a point</th><td>add up to 360°</td></tr><tr><th>In a triangle</th><td>add up to 180°</td></tr><tr><th>In a quadrilateral</th><td>add up to 360°</td></tr><tr><th>Right angle</th><td>90°</td></tr></tbody></table></div>
<p>An isosceles triangle has two equal sides and two equal angles.</p>
<h3>Bearings</h3><p>Measured clockwise from North, always written with three figures: 065°, not 65°. The bearing back the other way differs by 180°: if B is on 065° from A, then A is on 065° + 180° = <b>245°</b> from B.</p>
<h3>Coordinates</h3><p>(x, y): go <b>across</b> first, then <b>up or down</b>. “Along the corridor, then up the stairs.” (−3, 2) is 3 left and 2 up.</p>
<h3>Plans and elevations</h3>
<div class="tw"><table class="qt"><tbody><tr><th>Plan</th><td>the view from directly above</td></tr><tr><th>Front elevation</th><td>the view from the front</td></tr><tr><th>Side elevation</th><td>the view from the side</td></tr></tbody></table></div>
<p>A cereal box 20 cm wide, 30 cm tall and 7 cm deep: plan is 20 × 7, front elevation is 20 × 30, side elevation is 7 × 30. A cylinder standing up has a circle for its plan and a rectangle for its elevations.</p>
<div class="tip"><strong>Exam tip:</strong> diagrams marked “not drawn accurately” must be worked out with angle facts, not measured with a protractor.</div>`,
  gens: [
    { c: false, f() {
      if (R.coin()) { let a, b; do { a = R.int(25, 95); b = R.int(25, 95); } while (a + b > 160); const x = 180 - a - b;
        return { stem: 'Here is a triangle.' + dTriAngles([a + '°', b + '°', 'x']), parts: [{ q: 'Work out the size of angle x.', type: 'num', ans: x, suf: '°' }], steps: ['Angles in a triangle add up to 180°.', `${a} + ${b} = ${a + b}`, `x = 180 − ${a + b} = <b>${x}°</b>`] }; }
      const apex = 2 * R.int(10, 60), base = (180 - apex) / 2;
      return { stem: 'Here is an isosceles triangle. The two angles at the bottom are equal.' + dTriAngles(['y', 'y', apex + '°']), parts: [{ q: 'Work out the size of angle y.', type: 'num', ans: base, suf: '°' }], steps: ['Angles in a triangle add up to 180°.', `The two equal angles add up to 180 − ${apex} = ${180 - apex}°`, `y = ${180 - apex} ÷ 2 = <b>${base}°</b>`] };
    } },
    { c: false, f() {
      const t = R.int(0, 2);
      if (t === 0) { const a = R.int(25, 80), b = R.int(25, 70), x = 180 - a - b; return { stem: 'The angles lie on a straight line.' + dLine([a + '°', 'x', b + '°']), parts: [{ q: 'Work out the size of angle x.', type: 'num', ans: x, suf: '°' }], steps: ['Angles on a straight line add up to 180°.', `x = 180 − ${a} − ${b} = <b>${x}°</b>`] }; }
      if (t === 1) { const a = R.int(60, 120), b = R.int(50, 110), c = R.int(50, 90), x = 360 - a - b - c; return { stem: 'The angles meet at a point.' + dPoint([a + '°', b + '°', 'x', c + '°']), parts: [{ q: 'Work out the size of angle x.', type: 'num', ans: x, suf: '°' }], steps: ['Angles around a point add up to 360°.', `${a} + ${b} + ${c} = ${a + b + c}`, `x = 360 − ${a + b + c} = <b>${x}°</b>`] }; }
      const a = R.int(70, 110), b = R.int(65, 100), c = R.int(70, 115), x = 360 - a - b - c; return { stem: 'Here is a quadrilateral.' + dQuad([a + '°', b + '°', c + '°', 'x']), parts: [{ q: 'Work out the size of angle x.', type: 'num', ans: x, suf: '°' }], steps: ['Angles in a quadrilateral add up to 360°.', `${a} + ${b} + ${c} = ${a + b + c}`, `x = 360 − ${a + b + c} = <b>${x}°</b>`] };
    } },
    { c: false, f() {
      let b; do { b = 5 * R.int(2, 70); } while (b === 180);
      const back = (b + 180) % 360;
      return { stem: `A ship sails from port A to a lighthouse L on a bearing of ${bearing(b)}.`, parts: [{ q: 'What bearing must the ship sail on to go straight back from L to A?', type: 'num', ans: back, suf: '°', show: bearing(back) }],
        steps: ['The return journey is in the opposite direction, so the bearing changes by 180°.', b < 180 ? `${b} + 180 = ${back}` : `${b} − 180 = ${back}`, `<b>${bearing(back)}</b> (bearings always have three figures)`] };
    } },
    { c: false, x: true, f() {
      let x1, x2, y1, y2; do { x1 = R.int(-5, 1); x2 = R.int(x1 + 2, 5); y1 = R.int(-5, 1); y2 = R.int(y1 + 2, 5); } while (x1 === 0 && y1 === 0);
      const pts = [{ label: 'A', x: x1, y: y2 }, { label: 'B', x: x2, y: y2 }, { label: 'C', x: x2, y: y1 }];
      return { stem: 'A, B and C are three corners of a rectangle ABCD.' + dGrid(pts),
        parts: [{ q: 'Write down the coordinates of C.', type: 'coord', ans: [x2, y1] }, { q: 'Write down the coordinates of D, the fourth corner.', type: 'coord', ans: [x1, y1] }],
        steps: [`C is ${Math.abs(x2)} ${x2 < 0 ? 'left' : 'right'} and ${Math.abs(y1)} ${y1 < 0 ? 'down' : 'up'}: <b>(${sn(x2)}, ${sn(y1)})</b>`, `D must be directly below A and level with C.`, `So D has A’s x-coordinate (${sn(x1)}) and C’s y-coordinate (${sn(y1)}): <b>(${sn(x1)}, ${sn(y1)})</b>`] };
    } },
    { c: false, f() {
      if (R.coin()) {
        let w, h; do { w = R.int(15, 30); h = R.int(25, 40); } while (h - w < 3); const d = R.int(5, 12), view = R.int(0, 2);
        const names = ['plan (the view from above)', 'front elevation', 'side elevation'], dims = [[w, d], [w, h], [d, h]];
        const opts = [`Rectangle ${w} cm by ${d} cm`, `Rectangle ${w} cm by ${h} cm`, `Rectangle ${d} cm by ${h} cm`, `Square ${w} cm by ${w} cm`];
        return { stem: `A cereal box is ${w} cm wide, ${h} cm tall and ${d} cm deep. It stands upright on a shelf, facing you.`, parts: [{ q: `Which describes its <b>${names[view]}</b>?`, type: 'choice', options: opts, ans: view }],
          steps: ['Plan: from above you see the width and the depth.', 'Front elevation: from the front you see the width and the height.', 'Side elevation: from the side you see the depth and the height.', `So the ${names[view]} is a <b>rectangle ${dims[view][0]} cm by ${dims[view][1]} cm</b>.`] };
      }
      const sh = R.pick([['cuboid', 6, 12, 8], ['triangular prism', 5, 9, 6], ['square-based pyramid', 5, 8, 5], ['cube', 6, 12, 8], ['tetrahedron (triangular-based pyramid)', 4, 6, 4]]), k = R.int(1, 3), what = ['faces', 'edges', 'vertices (corners)'][k - 1];
      return { stem: `Think about a ${sh[0]}.`, parts: [{ q: `How many ${what} does it have?`, type: 'num', ans: sh[k] }], steps: [`A ${sh[0]} has ${sh[1]} faces, ${sh[2]} edges and ${sh[3]} vertices.`, `So it has <b>${sh[k]} ${what}</b>.`] };
    } }
  ]
});
