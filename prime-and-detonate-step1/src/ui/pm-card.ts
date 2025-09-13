// Mobile-first Party Member Card utilities (vanilla)
// Provides: renderCard(rootEl, data) to update values live and pmCardHtml(data, avatarSrc)

export type PrimeType = 'Arc' | 'Void' | 'Thermal' | 'Kinetic';

export type PmCardData = {
  id: string;
  name: string;
  role: string;
  status: string; // 'ACTIVE' | 'DOWN'
  primes: Array<{ type: PrimeType }>;
  stats: {
    sh: { cur: number; max: number };
    hp: { cur: number; max: number };
    sp: { cur: number; max: number };
  };
};

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, n));
}

function pct(cur: number, max: number): number {
  const safeMax = Math.max(1, Number(max ?? 1));
  const safeCur = Math.max(0, Number(cur ?? 0));
  return clampPct(Math.round((safeCur / safeMax) * 100));
}

// Round values to a logical precision for UI
function fmt(n: number): string {
  const num = Number(n ?? 0);
  const abs = Math.abs(num);
  const decimals = abs >= 10 ? 0 : 1;
  return Number.isFinite(num) ? String(Number(num.toFixed(decimals))) : '0';
}

export function renderCard(root: HTMLElement, data: PmCardData): void {
  if (!root || !data) return;

  const nameEl = root.querySelector('.pm-name');
  if (nameEl) nameEl.textContent = data.name ?? '';

  const roleEl = root.querySelector('.pm-role');
  if (roleEl) roleEl.textContent = data.role ?? '';

  const primesPill = root.querySelector('.pm-primes') as HTMLElement | null;
  const primeCount = Array.isArray(data.primes) ? data.primes.length : 0;
  if (primesPill) primesPill.textContent = primeCount ? `${primeCount} Prime${primeCount > 1 ? 's' : ''}` : 'No Primes';

  const statusPill = root.querySelector('.pm-status') as HTMLElement | null;
  const status = (data.status || 'ACTIVE').toUpperCase();
  const isActive = status === 'ACTIVE';
  if (statusPill) {
    statusPill.textContent = status;
    statusPill.classList.toggle('pm-active', isActive);
    statusPill.classList.toggle('pm-down', !isActive);
  }

  const defs: Array<{ key: 'sh' | 'hp' | 'sp'; label: string }> = [
    { key: 'sh', label: 'Shields' },
    { key: 'hp', label: 'Health' },
    { key: 'sp', label: 'Special' },
  ];

  defs.forEach(({ key, label }) => {
    const cur = Number((data.stats as any)?.[key]?.cur ?? 0);
    const max = Math.max(1, Number((data.stats as any)?.[key]?.max ?? 1));
    const percent = pct(cur, max);

    const bar = root.querySelector(`.pm-bar.${key}`) as HTMLElement | null;
    const fill = root.querySelector(`.pm-fill.${key}`) as HTMLElement | null;
    const val = root.querySelector(`.pm-val.${key}`) as HTMLElement | null;

    if (fill) fill.style.width = `${percent}%`;
    if (val) val.textContent = `${fmt(cur)}/${fmt(max)}`;
    if (bar) {
      bar.setAttribute('aria-label', label);
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', String(fmt(max)));
      bar.setAttribute('aria-valuenow', String(fmt(cur)));
      bar.setAttribute('role', 'progressbar');
    }
  });
}

export function pmCardHtml(data: PmCardData, avatarSrc: string): string {
  const primeCount = Array.isArray(data.primes) ? data.primes.length : 0;
  const status = (data.status || 'ACTIVE').toUpperCase();
  const activeClass = status === 'ACTIVE' ? 'pm-active' : 'pm-down';

  const shPct = pct(data.stats.sh.cur, data.stats.sh.max);
  const hpPct = pct(data.stats.hp.cur, data.stats.hp.max);
  const spPct = pct(data.stats.sp.cur, data.stats.sp.max);

  return `
  <div class="pm-card ${status === 'ACTIVE' ? 'is-active' : 'is-down'}" data-actor-id="${data.id}">
    <img class="pm-avatar" src="${avatarSrc}" alt="${data.name} portrait" />
    <div class="pm-main">
      <div class="pm-top">
        <div class="pm-name">${data.name}</div>
        <div class="pm-badges">
          <span class="pm-pill pm-primes">${primeCount ? `${primeCount} Prime${primeCount > 1 ? 's' : ''}` : 'No Primes'}</span>
          <span class="pm-pill pm-status ${activeClass}">${status}</span>
        </div>
      </div>
      <div class="pm-role">${data.role}</div>

      <div class="pm-stat">
        <span class="pm-label">SH</span>
        <div class="pm-bar sh" role="progressbar" aria-label="Shields" aria-valuemin="0" aria-valuemax="${fmt(data.stats.sh.max)}" aria-valuenow="${fmt(data.stats.sh.cur)}">
          <div class="pm-fill sh" style="width:${shPct}%"></div>
          <span class="pm-val sh">${fmt(data.stats.sh.cur)}/${fmt(data.stats.sh.max)}</span>
        </div>
      </div>

      <div class="pm-stat">
        <span class="pm-label">HP</span>
        <div class="pm-bar hp" role="progressbar" aria-label="Health" aria-valuemin="0" aria-valuemax="${fmt(data.stats.hp.max)}" aria-valuenow="${fmt(data.stats.hp.cur)}">
          <div class="pm-fill hp" style="width:${hpPct}%"></div>
          <span class="pm-val hp">${fmt(data.stats.hp.cur)}/${fmt(data.stats.hp.max)}</span>
        </div>
      </div>

      <div class="pm-stat">
        <span class="pm-label">SP</span>
        <div class="pm-bar sp" role="progressbar" aria-label="Special" aria-valuemin="0" aria-valuemax="${fmt(data.stats.sp.max)}" aria-valuenow="${fmt(data.stats.sp.cur)}">
          <div class="pm-fill sp" style="width:${spPct}%"></div>
          <span class="pm-val sp">${fmt(data.stats.sp.cur)}/${fmt(data.stats.sp.max)}</span>
        </div>
      </div>
    </div>
  </div>`;
}


