/* Caposeo Mockup Charts — SVG helpers for CI bands, confusion matrices, calibration plots */

// ── CI Band Line Chart ──────────────────────────────────────────────────────
function renderCIChart(containerId, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const W = el.clientWidth || 600, H = opts.height || 220;
  const pad = { t: 16, r: 16, b: 32, l: 44 };
  const w = W - pad.l - pad.r, h = H - pad.t - pad.b;

  const weeks = opts.weeks || 24;
  const data = opts.data || generateDecaySeries(weeks, opts.archetype || 'slow_decay');
  const xScale = i => (i / (data.points.length - 1)) * w;
  const yMax = Math.max(...data.upper) * 1.1;
  const yMin = Math.min(...data.lower) * 0.9;
  const yScale = v => h - ((v - yMin) / (yMax - yMin)) * h;

  const pathD = arr => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
  const bandD = () => {
    const top = data.upper.map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
    const bot = [...data.lower].reverse().map((v, i, arr) => `L${xScale(arr.length - 1 - i)},${yScale(v)}`).join(' ');
    return `${top} ${bot} Z`;
  };

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
      <g transform="translate(${pad.l},${pad.t})">
        ${[0,.25,.5,.75,1].map(p => {
          const y = p * h;
          const val = Math.round(yMax - p * (yMax - yMin));
          return `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#dfe3ec" stroke-width="1"/>
                  <text x="-6" y="${y+4}" font-size="10" fill="#8b95a5" text-anchor="end">${val}</text>`;
        }).join('')}
        ${[0,.25,.5,.75,1].map(p => {
          const x = p * w;
          const wk = Math.round(p * weeks);
          return `<text x="${x}" y="${h+18}" font-size="10" fill="#8b95a5" text-anchor="middle">W${wk}</text>`;
        }).join('')}
        <path d="${bandD()}" fill="rgba(74,111,165,0.1)" stroke="none"/>
        <path d="${pathD(data.lower)}" fill="none" stroke="rgba(74,111,165,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="${pathD(data.upper)}" fill="none" stroke="rgba(74,111,165,0.3)" stroke-width="1" stroke-dasharray="3,2"/>
        <path d="${pathD(data.mean)}" fill="none" stroke="#4a6fa5" stroke-width="2.5" stroke-linecap="round"/>
        ${opts.alertWeek != null ? `<line x1="${xScale(opts.alertWeek)}" y1="0" x2="${xScale(opts.alertWeek)}" y2="${h}" stroke="#c94a4a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="${xScale(opts.alertWeek)+6}" y="14" font-size="10" fill="#c94a4a" font-weight="600">Alert</text>` : ''}
      </g>
    </svg>`;
}

function generateDecaySeries(weeks, archetype) {
  const points = Array.from({length: weeks}, (_, i) => i);
  let mean, noise = 8;
  if (archetype === 'slow_decay') mean = points.map(i => 320 - i * 4 + Math.sin(i*0.3)*15);
  else if (archetype === 'fast_decay') mean = points.map(i => 320 * Math.exp(-i * 0.08));
  else if (archetype === 'healthy') mean = points.map(i => 280 + i * 3 + Math.sin(i*0.5)*12);
  else if (archetype === 'seasonal') mean = points.map(i => 300 + 80*Math.sin((i/52)*2*Math.PI) + Math.random()*10);
  else mean = points.map(i => 300 + Math.sin(i*0.4)*20);
  const ci = 0.12;
  return {
    points,
    mean,
    upper: mean.map((v, i) => v + noise + v * ci * (0.8 + Math.random()*0.4)),
    lower: mean.map((v, i) => Math.max(0, v - noise - v * ci * (0.8 + Math.random()*0.4)))
  };
}

// ── Confusion Matrix ────────────────────────────────────────────────────────
function renderConfusionMatrix(containerId, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const tp = opts.tp || 470, fn = opts.fn || 30, fp = opts.fp || 15, tn = opts.tn || 485;
  const total = tp + fn + fp + tn;
  const tpr = ((tp / (tp + fn)) * 100).toFixed(1);
  const fpr = ((fp / (fp + tn)) * 100).toFixed(1);
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:auto 1fr 1fr;gap:0;font-size:0.8125rem;max-width:360px">
      <div></div>
      <div style="text-align:center;padding:0.5rem;font-weight:600;color:var(--muted-fg);font-size:0.75rem">Predicted: Decay</div>
      <div style="text-align:center;padding:0.5rem;font-weight:600;color:var(--muted-fg);font-size:0.75rem">Predicted: Healthy</div>
      <div style="padding:0.5rem;font-weight:600;color:var(--muted-fg);font-size:0.75rem;writing-mode:horizontal-tb">Actual: Decay</div>
      <div style="background:rgba(58,154,107,0.12);border:1px solid var(--border);padding:1rem;text-align:center;border-radius:0.375rem 0 0 0">
        <div style="font-size:1.5rem;font-weight:800;color:var(--success)">${tp}</div>
        <div style="color:var(--muted-fg);font-size:0.75rem;margin-top:0.25rem">True Positive</div>
      </div>
      <div style="background:rgba(201,74,74,0.08);border:1px solid var(--border);padding:1rem;text-align:center;border-radius:0 0.375rem 0 0">
        <div style="font-size:1.5rem;font-weight:800;color:var(--danger)">${fn}</div>
        <div style="color:var(--muted-fg);font-size:0.75rem;margin-top:0.25rem">False Negative</div>
      </div>
      <div style="padding:0.5rem;font-weight:600;color:var(--muted-fg);font-size:0.75rem">Actual: Healthy</div>
      <div style="background:rgba(201,74,74,0.08);border:1px solid var(--border);padding:1rem;text-align:center;border-radius:0 0 0 0.375rem">
        <div style="font-size:1.5rem;font-weight:800;color:var(--warning)">${fp}</div>
        <div style="color:var(--muted-fg);font-size:0.75rem;margin-top:0.25rem">False Positive</div>
      </div>
      <div style="background:rgba(58,154,107,0.12);border:1px solid var(--border);padding:1rem;text-align:center;border-radius:0 0 0.375rem 0">
        <div style="font-size:1.5rem;font-weight:800;color:var(--success)">${tn}</div>
        <div style="color:var(--muted-fg);font-size:0.75rem;margin-top:0.25rem">True Negative</div>
      </div>
    </div>
    <div style="display:flex;gap:2rem;margin-top:1.25rem;flex-wrap:wrap">
      <div><span style="font-weight:700;color:var(--success)">${tpr}%</span> <span style="font-size:0.8125rem;color:var(--muted-fg)">True Positive Rate</span></div>
      <div><span style="font-weight:700;color:var(--warning)">${fpr}%</span> <span style="font-size:0.8125rem;color:var(--muted-fg)">False Positive Rate</span></div>
      <div><span style="font-weight:700;color:var(--primary)">${total}</span> <span style="font-size:0.8125rem;color:var(--muted-fg)">Synthetic cases</span></div>
    </div>`;
}

// ── Calibration Plot ────────────────────────────────────────────────────────
function renderCalibrationPlot(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const W = el.clientWidth || 400, H = 260;
  const pad = { t: 16, r: 16, b: 40, l: 44 };
  const w = W - pad.l - pad.r, h = H - pad.t - pad.b;
  // Model points: close to diagonal = well-calibrated
  const pts = [[0.1,0.09],[0.2,0.21],[0.3,0.28],[0.4,0.41],[0.5,0.52],[0.6,0.58],[0.7,0.72],[0.8,0.79],[0.9,0.91]];
  const scale = v => v * w;
  const scaleY = v => h - v * h;
  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">
      <g transform="translate(${pad.l},${pad.t})">
        ${[0,.25,.5,.75,1].map(p => {
          const pct = Math.round(p*100);
          return `<line x1="${scale(p)}" y1="0" x2="${scale(p)}" y2="${h}" stroke="#dfe3ec" stroke-width="1"/>
                  <line x1="0" y1="${scaleY(p)}" x2="${w}" y2="${scaleY(p)}" stroke="#dfe3ec" stroke-width="1"/>
                  <text x="${scale(p)}" y="${h+16}" font-size="10" fill="#8b95a5" text-anchor="middle">${pct}%</text>
                  <text x="-6" y="${scaleY(p)+4}" font-size="10" fill="#8b95a5" text-anchor="end">${pct}%</text>`;
        }).join('')}
        <text x="${w/2}" y="${h+34}" font-size="10" fill="#8b95a5" text-anchor="middle">Predicted Probability</text>
        <line x1="0" y1="${h}" x2="${w}" y2="0" stroke="#c0c8d8" stroke-width="1" stroke-dasharray="4,3"/>
        <polyline points="${pts.map(([x,y]) => `${scale(x)},${scaleY(y)}`).join(' ')}" fill="none" stroke="#4a6fa5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${pts.map(([x,y]) => `<circle cx="${scale(x)}" cy="${scaleY(y)}" r="4" fill="#4a6fa5" stroke="#fff" stroke-width="1.5"/>`).join('')}
        <text x="${w-4}" y="14" font-size="10" fill="#8b95a5" text-anchor="end">Perfect calibration</text>
      </g>
    </svg>`;
}

// ── SHAP-style Feature Bars ─────────────────────────────────────────────────
function renderSHAPBars(containerId, features) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const maxVal = Math.max(...features.map(f => Math.abs(f.value)));
  el.innerHTML = features.map(f => {
    const pct = (Math.abs(f.value) / maxVal * 100).toFixed(1);
    const color = f.value > 0 ? '#c94a4a' : '#3a9a6b';
    const label = f.value > 0 ? '↑ hurts citation' : '↓ helps citation';
    return `<div style="display:grid;grid-template-columns:180px 1fr auto;align-items:center;gap:0.75rem;margin-bottom:0.625rem">
      <div style="font-size:0.8125rem;font-weight:500;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.name}</div>
      <div style="background:var(--muted);border-radius:999px;height:8px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${color};border-radius:999px;transition:width 0.5s"></div>
      </div>
      <div style="font-size:0.75rem;color:${color};white-space:nowrap">${f.value > 0 ? '+' : ''}${f.value.toFixed(2)}</div>
    </div>`;
  }).join('');
}

// ── Pulse Score Gauge ───────────────────────────────────────────────────────
function renderPulseGauge(containerId, score) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const color = score >= 75 ? '#c68a1d' : score >= 50 ? '#4a6fa5' : '#3a9a6b';
  const label = score >= 75 ? 'Rising Fast' : score >= 50 ? 'Growing' : 'Stable';
  const angle = (score / 100) * 180 - 90;
  const rad = (angle * Math.PI) / 180;
  const cx = 100, cy = 100, r = 70;
  const nx = cx + r * Math.cos(rad), ny = cy + r * Math.sin(rad);
  el.innerHTML = `
    <svg viewBox="0 0 200 120" style="width:100%;max-width:220px">
      <path d="M 30,100 A 70,70 0 0,1 170,100" fill="none" stroke="${color}22" stroke-width="14" stroke-linecap="round"/>
      <path d="M 30,100 A 70,70 0 0,1 170,100" fill="none" stroke="${color}" stroke-width="6"
            stroke-dasharray="${(score/100)*220} 220" stroke-linecap="round"/>
      <line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="5" fill="${color}"/>
      <text x="${cx}" y="${cy+22}" font-size="22" font-weight="800" fill="${color}" text-anchor="middle" font-family="Inter">${score}</text>
      <text x="${cx}" y="${cy+36}" font-size="10" fill="#8b95a5" text-anchor="middle" font-family="Inter">${label}</text>
    </svg>`;
}

// ── Decay Score Badge ───────────────────────────────────────────────────────
function decayBadge(score) {
  if (score >= 80) return `<span class="badge badge-red">🔥 Critical ${score}</span>`;
  if (score >= 60) return `<span class="badge badge-yellow">⚠ Warning ${score}</span>`;
  if (score >= 40) return `<span class="badge badge-blue">● Stable ${score}</span>`;
  return `<span class="badge badge-green">↑ Healthy ${score}</span>`;
}

// ── Init all charts on page ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-chart]').forEach(el => {
    const type = el.dataset.chart;
    const opts = el.dataset.opts ? JSON.parse(el.dataset.opts) : {};
    if (type === 'ci') renderCIChart(el.id, opts);
    else if (type === 'confusion') renderConfusionMatrix(el.id, opts);
    else if (type === 'calibration') renderCalibrationPlot(el.id);
    else if (type === 'shap') renderSHAPBars(el.id, opts.features || []);
    else if (type === 'pulse') renderPulseGauge(el.id, opts.score || 67);
  });
});
