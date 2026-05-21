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
      tag: 'Drop 008',
      eyebrow: 'Prochain drop — 6 juin 2026, 21h21',
      titleA: 'Protocole 008.',
      titleB: 'Radar.',
      sub: "Huitième capsule. 14 pièces textiles et un pressage vinyle limité. Sérigraphie main, confection France. Une fois épuisé, jamais restocké.",
      slotId: 'hero-slide-drop',
      meta: [
        { k: 'Référence', v: 'BLB · 008' },
        { k: 'Pièces', v: '14' },
        { k: 'Vinyle', v: '300 ex.' },
      ],
      primaryCta: { label: "S'inscrire au radar", onClick: onAddToRadar },
      secondaryCta: { label: 'Voir le drop', onClick: onGoDrop },
      hasCountdown: true,
    },
    {
      id: 'vinyle',
      kind: 'product',
      tag: 'Pièce phare',
      eyebrow: 'Pressage limité — 300 exemplaires',
      titleA: 'Protocole 008.',
      titleB: 'LP 12".',
      sub: "12 titres pressés sur vinyle 180 grammes. Pochette gatefold sérigraphiée à la main. Numéroté individuellement.",
      slotId: 'hero-slide-vinyle',
      meta: [
        { k: 'Format', v: '12", 180g' },
        { k: 'Tirage', v: '300 ex.' },
        { k: 'Prix', v: '38 €' },
      ],
      primaryCta: { label: 'Ajouter — 38 €', onClick: () => onOpenProduct(vinyle) },
      secondaryCta: { label: 'Voir la fiche', onClick: () => onOpenProduct(vinyle) },
    },
    {
      id: 'archives',
      kind: 'archives',
      tag: 'Archives',
      eyebrow: 'Trois ans, sept drops, zéro restock',
      titleA: 'Sept drops.',
      titleB: 'Tous épuisés.',
      sub: "Le catalogue complet, du Prototype 001 au Nocturne 007. Conservé pour mémoire. Aucun ne sera jamais restocké.",
      slotId: 'hero-slide-archives',
      meta: [
        { k: 'Drops', v: '07 · 2022-2025' },
        { k: 'Pièces', v: '62' },
        { k: 'Restocks', v: '0' },
      ],
      primaryCta: { label: 'Explorer les archives', onClick: onGoArchives },
      secondaryCta: null,
    },
    {
      id: 'giftcard',
      kind: 'giftcard',
      tag: 'Carte cadeau',
      eyebrow: 'De 30 à 300 €',
      titleA: 'Offrir BLB.',
      titleB: null,
      sub: "Carte cadeau dématérialisée. Valide 12 mois sur l'ensemble du catalogue — drop courant, archives et transmissions à venir.",
      slotId: 'hero-slide-gift',
      meta: [
        { k: 'Montant', v: '30 → 300 €' },
        { k: 'Validité', v: '12 mois' },
        { k: 'Format', v: 'Digital' },
      ],
      primaryCta: { label: 'Offrir une carte', onClick: () => alert('Démo — carte cadeau non implémentée.') },
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
      className="relative hl-b border-black/10 pt-[68px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center hl-white-strong bg-[#1a1715]/30 backdrop-blur-sm hover:bg-[#1a1715] hover:text-[#F2EFE7] transition-colors"
        aria-label="Précédent"
        data-magnetic
      >
        <span className="font-mono text-lg">←</span>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 items-center justify-center hl-white-strong bg-[#1a1715]/30 backdrop-blur-sm hover:bg-[#1a1715] hover:text-[#F2EFE7] transition-colors"
        aria-label="Suivant"
        data-magnetic
      >
        <span className="font-mono text-lg">→</span>
      </button>

      {/* bottom indicator strip */}
      <div className="hl-t border-black/10 px-6 md:px-10 py-5 flex items-center gap-6 bg-[#F2EFE7]">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/45 tabular shrink-0">
          {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
        {/* progress bar */}
        <div className="flex-1 h-px bg-[#1a1715]/10 relative overflow-hidden">
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
        <div className="flex items-center gap-2 shrink-0">
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
                  background: i === idx ? accent : 'rgba(26,23,21,0.3)',
                }}
              />
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
    <div className="grid grid-cols-12 min-h-[80vh]">
      {/* LEFT — type column */}
      <div className="col-span-12 lg:col-span-7 hl-r border-black/10 p-10 lg:p-16 flex flex-col justify-between">
        <div className="text-[12px] text-[#1a1715]/55">
          {s.eyebrow}
        </div>

        <div className="my-10 lg:my-14">
          <h1
            className="leading-[1.02]"
            style={{
              fontFamily: 'var(--font-h)',
              fontWeight: 'var(--font-h-weight)',
              fontSize: 'clamp(40px, 5.5vw, 92px)',
              letterSpacing: 'var(--font-h-tracking)',
            }}
          >
            {s.titleA}
            {s.titleB && <><br />{s.titleB}</>}
          </h1>
          <p className="max-w-md text-[14px] leading-relaxed text-[#1a1715]/70 mt-6" style={{ textWrap: 'pretty' }}>
            {s.sub}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-8 lg:gap-12">
          {s.hasCountdown && D && (
            <Countdown targetISO={D.drop.target} size="sm" accent={accent} />
          )}
          <div className="flex flex-col items-start gap-2.5">
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
          placeholder={s.tag}
          style={{ width: '100%', flex: 1, minHeight: '52vh' }}
        ></image-slot>
        {s.meta && (
          <div className="hl-t border-black/10 grid grid-cols-3 text-[12px]">
            {s.meta.map((m, i) => (
              <div
                key={m.k}
                className="p-5 lg:p-6"
                style={i < s.meta.length - 1 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}
              >
                <div className="text-[#1a1715]/45 text-[11px]">{m.k}</div>
                <div className="text-[#1a1715] mt-1.5 tabular font-medium">{m.v}</div>
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
        placeholder={s.tag}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      ></image-slot>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(242,239,231,0.55) 0%, rgba(242,239,231,0.55) 50%, rgba(242,239,231,0.92) 100%)',
        }}
      />
      <div className="relative min-h-[82vh] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-3xl">
            <div className="text-[12px] text-[#1a1715]/55 mb-6">
              {s.eyebrow}
            </div>
            <h1
              className="leading-[1.02] mb-8"
              style={{
                fontFamily: 'var(--font-h)',
                fontWeight: 'var(--font-h-weight)',
                fontSize: 'clamp(48px, 6.5vw, 112px)',
                letterSpacing: 'var(--font-h-tracking)',
              }}
            >
              {s.titleA}
              {s.titleB && <><br />{s.titleB}</>}
            </h1>
            {s.hasCountdown && D && (
              <div className="flex justify-center mb-8">
                <Countdown targetISO={D.drop.target} size="sm" accent={accent} />
              </div>
            )}
            <p className="max-w-xl mx-auto text-[14px] leading-relaxed text-[#1a1715]/75" style={{ textWrap: 'pretty' }}>
              {s.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
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

        {s.meta && (
          <div className="hl-t border-black/15 grid grid-cols-3 text-[12px] backdrop-blur-sm bg-[#F2EFE7]/55">
            {s.meta.map((m, i) => (
              <div
                key={m.k}
                className="p-5 lg:p-6"
                style={i < s.meta.length - 1 ? { borderRight: '1px solid rgba(26,23,21,0.12)' } : undefined}
              >
                <div className="text-[#1a1715]/45 text-[11px]">{m.k}</div>
                <div className="text-[#1a1715] mt-1.5 tabular font-medium">{m.v}</div>
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
