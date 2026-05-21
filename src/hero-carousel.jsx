// BLB — Hero carousel (swipeable, drag, auto-advance)
// Remplace l'ancien Hero. Plusieurs slides : drop, pièce forte, archives, carte cadeau.

const { useState: useStateH, useEffect: useEffectH, useRef: useRefH, useCallback: useCallbackH, useMemo: useMemoH } = React;

// ─────────────────────────────────────────────
// Slide configurations — drop, vinyle, archives, gift card
// ─────────────────────────────────────────────
function getHeroSlides({ D, accent, onGoDrop, onOpenProduct, onGoArchives, onAddToRadar }) {
  const vinyle = D.products.find((p) => p.id === 'p02');
  return [
    {
      id: 'drop',
      kind: 'drop',
      tag: 'PROTOCOLE 008',
      eyebrow: 'PROCHAIN DROP — 06.06.2026 · 21:21 CET',
      titleA: 'ON GUETTE.',
      titleB: 'ON FRAPPE.',
      sub: "Huitième capsule. 14 pièces textiles + pressage vinyle limité 300 ex. Sérigraphie main, confection France. Aucun restock — disparaît au coup de minuit.",
      slotId: 'hero-slide-drop',
      meta: [
        { k: 'RÉF', v: 'BLB · 008 · 26' },
        { k: 'PIÈCES', v: '14 · CAPSULE' },
        { k: 'PRESSAGE', v: '300 · 180g' },
      ],
      primaryCta: { label: "S'INSCRIRE AU RADAR", onClick: onAddToRadar },
      secondaryCta: { label: "VOIR LE DROP COMPLET", onClick: onGoDrop },
      hasCountdown: true,
    },
    {
      id: 'vinyle',
      kind: 'product',
      tag: 'PIÈCE PHARE',
      eyebrow: 'PRESSAGE LIMITÉ · 300 EXEMPLAIRES',
      titleA: 'PROTOCOLE 008',
      titleB: 'LP 12".',
      sub: "12 titres inédits pressés sur vinyle 180g. Pochette gatefold sérigraphiée à la main. Numéroté individuellement, jamais restocké.",
      slotId: 'hero-slide-vinyle',
      meta: [
        { k: 'FORMAT', v: '12" · 180g' },
        { k: 'TIRAGE', v: '300 EX.' },
        { k: 'PRIX', v: '38€' },
      ],
      primaryCta: { label: 'AJOUTER · 38€', onClick: () => onOpenProduct(vinyle) },
      secondaryCta: { label: 'VOIR LA FICHE', onClick: () => onOpenProduct(vinyle) },
    },
    {
      id: 'archives',
      kind: 'archives',
      tag: 'ARCHIVE OUVERTE',
      eyebrow: 'TROIS ANS · SEPT DROPS · ZÉRO RESTOCK',
      titleA: '07 DROPS.',
      titleB: 'TOUS ÉPUISÉS.',
      sub: "Le catalogue complet conservé pour mémoire. Du PROTOTYPE 001 au NOCTURNE 007. Aucun n'a été restocké. Aucun ne le sera.",
      slotId: 'hero-slide-archives',
      meta: [
        { k: 'DROPS', v: '07 · 2022→2025' },
        { k: 'PIÈCES TOTAL', v: '62' },
        { k: 'RESTOCKÉES', v: '00' },
      ],
      primaryCta: { label: 'EXPLORER LES ARCHIVES', onClick: onGoArchives },
      secondaryCta: null,
    },
    {
      id: 'giftcard',
      kind: 'giftcard',
      tag: 'CARTE CADEAU',
      eyebrow: 'OFFRIR BLB — DE 30€ À 300€',
      titleA: 'PASSER',
      titleB: "LE RELAIS.",
      sub: "Carte cadeau dématérialisée. Valide 12 mois sur l'ensemble du catalogue — drop courant, archives et prochaines transmissions.",
      slotId: 'hero-slide-gift',
      meta: [
        { k: 'MONTANT', v: '30€ → 300€' },
        { k: 'VALIDITÉ', v: '12 MOIS' },
        { k: 'FORMAT', v: 'DIGITAL' },
      ],
      primaryCta: { label: 'OFFRIR UNE CARTE', onClick: () => alert('Démo — carte cadeau non implémentée.') },
      secondaryCta: null,
    },
  ];
}

// ─────────────────────────────────────────────
// HeroCarousel
// ─────────────────────────────────────────────
function HeroCarousel({ accent, autoAdvance, slideStyle, onGoDrop, onOpenProduct, onGoArchives, onAddToRadar }) {
  const D = window.BLB_DATA;
  const slides = useMemoH(
    () => getHeroSlides({ D, accent, onGoDrop, onOpenProduct, onGoArchives, onAddToRadar }),
    // Recreate when callbacks change — they're stable enough
    [accent]
  );
  const [idx, setIdx] = useStateH(0);
  const [dragX, setDragX] = useStateH(0);
  const [dragging, setDragging] = useStateH(false);
  const [paused, setPaused] = useStateH(false);
  const trackRef = useRefH(null);
  const startRef = useRefH({ x: 0, y: 0, w: 0, captured: false });

  const goTo = useCallbackH((i) => {
    const n = slides.length;
    setIdx(((i % n) + n) % n);
  }, [slides.length]);
  const next = useCallbackH(() => goTo(idx + 1), [idx, goTo]);
  const prev = useCallbackH(() => goTo(idx - 1), [idx, goTo]);

  // Auto-advance
  useEffectH(() => {
    if (!autoAdvance || paused || dragging) return;
    const id = setTimeout(() => next(), 6000);
    return () => clearTimeout(id);
  }, [idx, autoAdvance, paused, dragging, next]);

  // Keyboard nav
  useEffectH(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Drag handlers
  const onPointerDown = (e) => {
    if (e.target.closest('button, a, image-slot')) return; // don't hijack button clicks
    if (!trackRef.current) return;
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: trackRef.current.offsetWidth,
      captured: false,
    };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    if (!dragging || !trackRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    // Once the user moves >8px horizontally, capture the gesture so click handlers don't fire
    if (!startRef.current.captured && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      startRef.current.captured = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    }
    if (startRef.current.captured) setDragX(dx);
  };
  const onPointerUp = (e) => {
    if (!dragging) return;
    const w = startRef.current.w || 1;
    const threshold = Math.min(160, w * 0.18);
    if (dragX < -threshold) next();
    else if (dragX > threshold) prev();
    setDragX(0);
    setDragging(false);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
  };

  const w = trackRef.current?.offsetWidth || 1;
  const offsetPct = -(idx * 100) + (dragX / w) * 100;

  return (
    <section
      className="relative hl-b border-white/10 pt-[88px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* sticky top bar with slide info */}
      <div className="hl-b border-white/10 px-5 md:px-8 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/60 uppercase tabular gap-4">
        <div className="flex items-center gap-4">
          <span style={{ color: accent }}>● {slides[idx].tag}</span>
          <span className="hidden md:inline text-white/40">{slides[idx].eyebrow}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="tabular text-white/70">{String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* track */}
      <div
        ref={trackRef}
        className="relative select-none"
        style={{ cursor: dragging ? 'grabbing' : 'default', touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${offsetPct}%)`,
            transition: dragging ? 'none' : 'transform .6s cubic-bezier(.22,.65,.2,1)',
            willChange: 'transform',
          }}
        >
          {slides.map((s, i) => (
            <div key={s.id} className="w-full shrink-0">
              <HeroSlide
                slide={s}
                style={slideStyle}
                accent={accent}
                D={D}
                active={i === idx}
                tabIndex={i === idx ? 0 : -1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center hl-white-strong bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black transition-colors"
        aria-label="Précédent"
        data-magnetic
      >
        <span className="font-mono text-lg">←</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center hl-white-strong bg-black/40 backdrop-blur-sm hover:bg-white hover:text-black transition-colors"
        aria-label="Suivant"
        data-magnetic
      >
        <span className="font-mono text-lg">→</span>
      </button>

      {/* bottom dots + progress bar */}
      <div className="hl-t border-white/10 px-5 md:px-8 py-4 flex items-center gap-6 bg-black">
        {/* progress bar */}
        <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
          <div
            key={`${idx}-${paused || dragging}`}
            className="absolute left-0 top-0 bottom-0 origin-left"
            style={{
              width: '100%',
              background: accent,
              transform: 'scaleX(0)',
              animation: autoAdvance && !paused && !dragging
                ? 'hero-progress 6s linear forwards'
                : 'none',
            }}
          />
        </div>
        {/* dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className="group p-2 -m-2"
              aria-label={`Slide ${i + 1}: ${s.tag}`}
              data-magnetic
            >
              <span
                className="block h-px transition-all duration-300"
                style={{
                  width: i === idx ? 28 : 16,
                  background: i === idx ? accent : 'rgba(255,255,255,0.35)',
                }}
              />
            </button>
          ))}
        </div>
        {/* slide labels (desktop) */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`tabular hover:text-white transition-colors ${i === idx ? 'text-white' : ''}`}
              data-magnetic
            >
              {String(i + 1).padStart(2, '0')} · {s.tag}
            </button>
          ))}
        </div>
      </div>

      {/* hero progress keyframes (scoped inline) */}
      <style>{`
        @keyframes hero-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────
// HeroSlide — 2 styles: editorial (split) | cover (full bleed)
// ─────────────────────────────────────────────
function HeroSlide({ slide: s, style, accent, D, active, tabIndex }) {
  if (style === 'cover') return <HeroSlideCover slide={s} accent={accent} D={D} tabIndex={tabIndex} />;
  return <HeroSlideEditorial slide={s} accent={accent} D={D} tabIndex={tabIndex} />;
}

function HeroSlideEditorial({ slide: s, accent, D, tabIndex }) {
  return (
    <div className="grid grid-cols-12 min-h-[78vh]">
      {/* LEFT — type column */}
      <div className="col-span-12 lg:col-span-7 hl-r border-white/10 p-8 lg:p-14 flex flex-col justify-between">
        <div className="font-eyebrow text-white/40 mb-6">{s.eyebrow}</div>

        <div className="my-8 lg:my-12">
          <h1
            className="font-display leading-[0.82]"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(48px, 8vw, 132px)',
              letterSpacing: '-0.05em',
            }}
          >
            {s.titleA}
            <br />
            <span style={{ color: accent }}>{s.titleB}</span>
          </h1>
          <p className="max-w-md font-mono text-[12px] leading-relaxed text-white/60 mt-8 uppercase tracking-[0.05em]">
            {s.sub}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-6 lg:gap-10">
          {s.hasCountdown && D && (
            <Countdown targetISO={D.drop.target} size="md" accent={accent} />
          )}
          <div className="flex flex-col gap-3">
            {s.primaryCta && (
              <button
                onClick={(e) => { e.stopPropagation(); s.primaryCta.onClick(); }}
                className="btn-primary"
                tabIndex={tabIndex}
                data-magnetic
              >
                <span>{s.primaryCta.label}</span><span>→</span>
              </button>
            )}
            {s.secondaryCta && (
              <button
                onClick={(e) => { e.stopPropagation(); s.secondaryCta.onClick(); }}
                className="btn-ghost"
                tabIndex={tabIndex}
                data-magnetic
              >
                <span>{s.secondaryCta.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — image */}
      <div className="col-span-12 lg:col-span-5 relative flex flex-col">
        <image-slot
          id={s.slotId}
          shape="rect"
          placeholder={`Visuel · ${s.tag}`}
          style={{ width: '100%', flex: 1, minHeight: '52vh' }}
        ></image-slot>
        {s.meta && (
          <div className="hl-t border-white/10 grid grid-cols-3 font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
            {s.meta.map((m, i) => (
              <div
                key={m.k}
                className={`p-4 lg:p-5 ${i < s.meta.length - 1 ? 'hl-r border-white/10' : ''}`}
                style={i < s.meta.length - 1 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}
              >
                <div className="text-white/40">{m.k}</div>
                <div className="text-white mt-2 tabular">{m.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeroSlideCover({ slide: s, accent, D, tabIndex }) {
  return (
    <div className="relative min-h-[82vh]">
      <image-slot
        id={s.slotId + '-cover'}
        shape="rect"
        placeholder={`Background · ${s.tag}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      ></image-slot>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.95) 100%)',
        }}
      />
      <div className="relative min-h-[82vh] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-5xl">
            <div className="font-eyebrow text-white/70 mb-8">{s.eyebrow}</div>
            <h1
              className="font-display leading-[0.82] mb-10"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(56px, 11vw, 200px)',
                letterSpacing: '-0.055em',
              }}
            >
              {s.titleA}
              <br />
              <span style={{ color: accent }}>{s.titleB}</span>
            </h1>
            {s.hasCountdown && D && (
              <div className="flex justify-center mb-10">
                <Countdown targetISO={D.drop.target} size="md" accent={accent} />
              </div>
            )}
            <p className="max-w-xl mx-auto font-mono text-[12px] leading-relaxed text-white/70 uppercase tracking-[0.05em]">
              {s.sub}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {s.primaryCta && (
                <button
                  onClick={(e) => { e.stopPropagation(); s.primaryCta.onClick(); }}
                  className="btn-primary"
                  tabIndex={tabIndex}
                  data-magnetic
                >
                  <span>{s.primaryCta.label}</span><span>→</span>
                </button>
              )}
              {s.secondaryCta && (
                <button
                  onClick={(e) => { e.stopPropagation(); s.secondaryCta.onClick(); }}
                  className="btn-ghost"
                  tabIndex={tabIndex}
                  data-magnetic
                >
                  <span>{s.secondaryCta.label}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* bottom meta strip */}
        {s.meta && (
          <div className="hl-t border-white/15 grid grid-cols-3 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase backdrop-blur-sm bg-black/30">
            {s.meta.map((m, i) => (
              <div
                key={m.k}
                className={`p-4 lg:p-5 ${i < s.meta.length - 1 ? 'hl-r border-white/15' : ''}`}
                style={i < s.meta.length - 1 ? { borderRight: '1px solid rgba(255,255,255,0.15)' } : undefined}
              >
                <div className="text-white/50">{m.k}</div>
                <div className="text-white mt-2 tabular">{m.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// useMemo lives in App scope but we need it here — re-alias
window.HeroCarousel = HeroCarousel;
