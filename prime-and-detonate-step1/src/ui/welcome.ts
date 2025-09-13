export function mountWelcome(
  root: HTMLElement,
  onMissionSelect: () => void,
  onQuickBattle: () => void
): () => void {
  root.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'welcome-screen';
  root.appendChild(el);

  el.innerHTML = `
    <div class="min-h-[100dvh] w-full grid place-items-center bg-slate-950 text-slate-100">
      <div class="flex flex-col items-center gap-6 p-6">
        <div class="text-5xl font-extrabold tracking-widest">Prime</div>
        <div class="opacity-70">Tactical Prime and Detonate</div>
        <div class="flex flex-col sm:flex-row gap-3 mt-4">
          <button id="welcome-missions" class="big">Mission Select</button>
          <button id="welcome-battle" class="big ghost">Battle</button>
        </div>
      </div>
    </div>
  `;

  function onClick(e: Event){
    const t = e.target as HTMLElement;
    if(!t) return;
    if (t.id === 'welcome-missions') { onMissionSelect(); }
    if (t.id === 'welcome-battle') { onQuickBattle(); }
  }
  el.addEventListener('click', onClick, { passive: true } as any);

  return () => {
    el.removeEventListener('click', onClick as any);
    try { root.removeChild(el); } catch {}
  };
}


