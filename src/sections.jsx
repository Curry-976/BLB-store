// BLB — Home sections
// Hero (3 layouts), Merch grid (3 densities), Roster, Lookbook, Manifesto

const { useState: useState_s, useEffect: useEffect_s, useRef: useRef_s } = React;

/* ─────────────────────────────────────────────
   HERO — 3 layouts: split | centered | exploded
   ───────────────────────────────────────────── */
function Hero({ layout, onAddToRadar, onViewDrop, accent }) {
  const D = window.BLB_DATA;
  if (layout === 'centered') return <HeroCentered D={D} onAddToRadar={onAddToRadar} onViewDrop={onViewDrop} accent={accent} />;
  if (layout === 'exploded') return <HeroExploded D={D} onAddToRadar={onAddToRadar} onViewDrop={onViewDrop} accent={accent} />;
  return <HeroSplit D={D} onAddToRadar={onAddToRadar} onViewDrop={onViewDrop} accent={accent} />;
}

function HeroChrome({ accent }) {
  // Subtle frame markings: corner crosshairs + side rulers
  return (
    <>
      {[
        { top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 },
      ].map((s, i) => (
        <div key={i} className="absolute w-6 h-6 pointer-events-none" style={s}>
          <span className="absolute top-1/2 left-0 right-0 h-px bg-[#1a1715]/40" />
          <span className="absolute left-1/2 top-0 bottom-0 w-px bg-[#1a1715]/40" />
        </div>
      ))}
    </>
  );
}

function HeroSplit({ D, onAddToRadar, onViewDrop, accent }) {
  return (
    <section className="relative min-h-[100vh] hl-b border-black/10 pt-[68px]">
      <HeroChrome accent={accent} />
      <div className="grid grid-cols-12 min-h-[calc(100vh-88px)]">
        {/* LEFT — type column */}
        <div className="col-span-12 lg:col-span-7 hl-r border-black/10 p-8 lg:p-14 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-[#1a1715]/50 uppercase">
            <span style={{ color: accent }}>● {D.drop.code} / {D.drop.name}</span>
            <span>014/088 · TRANSMISSION OUVERTE</span>
          </div>

          <div className="my-12 lg:my-16">
            <div className="font-eyebrow text-[#1a1715]/40 mb-6">PROCHAIN DROP — 06.06.2026 · 21:21 CET</div>
            <h1
              className="font-display leading-[0.82]"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(64px, 11vw, 200px)',
                letterSpacing: '-0.05em',
              }}
            >
              ON GUETTE.<br />
              <span style={{ color: accent }}>ON FRAPPE.</span>
            </h1>
            <p className="max-w-md font-mono text-[12px] leading-relaxed text-[#1a1715]/60 mt-8 uppercase tracking-[0.05em]">
              Huitième capsule. 14 pièces textiles + pressage vinyle limité 300 ex.
              Sérigraphie main, confection France. <span className="text-[#1a1715]">Aucun restock</span> — disparaît au coup de minuit.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-6 lg:gap-10">
            <Countdown targetISO={D.drop.target} size="md" accent={accent} />
            <div className="flex flex-col gap-3">
              <button onClick={onAddToRadar} className="btn-primary" data-magnetic>
                <span>S'INSCRIRE AU RADAR</span><span>→</span>
              </button>
              <button onClick={onViewDrop} className="btn-ghost" data-magnetic>
                <span>VOIR LE DROP COMPLET</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — image / data column */}
        <div className="col-span-12 lg:col-span-5 relative flex flex-col">
          <image-slot
            id="hero-split-main"
            shape="rect"
            placeholder="Visuel hero · drop 008"
            style={{ width: '100%', flex: 1, minHeight: '60vh' }}
          ></image-slot>
          <div className="hl-t border-black/10 grid grid-cols-3 font-mono text-[10px] tracking-[0.16em] text-[#1a1715]/60 uppercase">
            <div className="p-5 hl-r border-black/10">
              <div className="text-[#1a1715]/40">RÉFÉRENCE</div>
              <div className="text-[#1a1715] mt-2 tabular">BLB · 008 · 26</div>
            </div>
            <div className="p-5 hl-r border-black/10">
              <div className="text-[#1a1715]/40">PIÈCES</div>
              <div className="text-[#1a1715] mt-2 tabular">{D.drop.pieces} · CAPSULE</div>
            </div>
            <div className="p-5">
              <div className="text-[#1a1715]/40">PRESSAGE</div>
              <div className="text-[#1a1715] mt-2 tabular">300 · 180g</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCentered({ D, onAddToRadar, onViewDrop, accent }) {
  return (
    <section className="relative min-h-[100vh] hl-b border-black/10 pt-[68px] overflow-hidden">
      <HeroChrome accent={accent} />
      {/* full-bleed background slot */}
      <image-slot
        id="hero-centered-bg"
        shape="rect"
        placeholder="Background full-bleed"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
        }}
      ></image-slot>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.95) 100%)' }} />

      <div className="relative min-h-[calc(100vh-88px)] flex flex-col">
        {/* top frame */}
        <div className="hl-b border-black/15 px-8 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-[#1a1715]/70 uppercase">
          <span style={{ color: accent }}>● TRANSMISSION EN COURS</span>
          <span>{D.drop.code} — {D.drop.name}</span>
          <span>014 / 088</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-5xl">
            <div className="font-eyebrow text-[#1a1715]/60 mb-8">PROCHAIN DROP — 06.06.2026 · 21:21 CET</div>
            <h1
              className="font-display leading-[0.82] mb-10"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(72px, 14vw, 280px)',
                letterSpacing: '-0.055em',
              }}
            >
              ENTRER<br /><span style={{ color: accent }}>DANS LE RADAR</span>
            </h1>
            <div className="flex justify-center">
              <Countdown targetISO={D.drop.target} size="lg" accent={accent} />
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <button onClick={onAddToRadar} className="btn-primary" data-magnetic>
                <span>S'INSCRIRE AU RADAR</span><span>→</span>
              </button>
              <button onClick={onViewDrop} className="btn-ghost" data-magnetic>
                <span>VOIR LE DROP</span>
              </button>
            </div>
          </div>
        </div>

        {/* bottom frame */}
        <div className="hl-t border-black/15 px-8 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-[#1a1715]/70 uppercase">
          <span>14 PIÈCES · 300 VINYLES</span>
          <span>BLB · BLOC LIBRE BÂTARD · 75</span>
          <span className="tabular">48.8566° N · 2.3522° E</span>
        </div>
      </div>
    </section>
  );
}

function HeroExploded({ D, onAddToRadar, onViewDrop, accent }) {
  return (
    <section className="relative min-h-[100vh] hl-b border-black/10 pt-[68px]">
      <HeroChrome accent={accent} />
      <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-px bg-[#1a1715]/8 p-px">
        {/* TL — eyebrow status */}
        <div className="col-span-12 md:col-span-5 row-span-1 bg-[#F2EFE7] p-6 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-[#1a1715]/60 uppercase">
          <span style={{ color: accent }}>● {D.drop.code} / {D.drop.name}</span>
          <span>06.06.26</span>
        </div>
        {/* TR — Image-slot small */}
        <div className="col-span-12 md:col-span-7 row-span-2 bg-[#F2EFE7] relative">
          <image-slot id="hero-exp-r" shape="rect" placeholder="Visuel principal" style={{ width: '100%', height: '100%', minHeight: '60vh' }}></image-slot>
        </div>
        {/* L title */}
        <div className="col-span-12 md:col-span-5 bg-[#F2EFE7] p-8">
          <h1
            className="font-display leading-[0.82]"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(56px, 8.5vw, 150px)',
              letterSpacing: '-0.05em',
            }}
          >
            R<span style={{ color: accent }}>•</span>A<span style={{ color: accent }}>•</span>D<span style={{ color: accent }}>•</span>A<span style={{ color: accent }}>•</span>R
          </h1>
          <div className="font-eyebrow text-[#1a1715]/50 mt-4">PROTOCOLE 008 — TRANSMISSION 014</div>
        </div>
      </div>

      {/* bottom row — countdown + image + cta */}
      <div className="grid grid-cols-12 gap-px bg-[#1a1715]/8 hl-t border-black/10">
        <div className="col-span-12 md:col-span-3 bg-[#F2EFE7] relative">
          <image-slot id="hero-exp-bl" shape="rect" placeholder="Détail" style={{ width: '100%', height: '100%', minHeight: '280px' }}></image-slot>
        </div>
        <div className="col-span-12 md:col-span-6 bg-[#F2EFE7] p-8 flex flex-col justify-between">
          <p className="max-w-md font-mono text-[12px] leading-relaxed text-[#1a1715]/60 uppercase tracking-[0.05em]">
            14 pièces / 300 vinyles / aucun restock. La boutique ferme au coup de minuit, 7 jours après ouverture.
          </p>
          <Countdown targetISO={D.drop.target} size="md" accent={accent} />
        </div>
        <div className="col-span-12 md:col-span-3 bg-[#F2EFE7] p-6 flex flex-col justify-between gap-4">
          <div className="font-eyebrow text-[#1a1715]/40">[CTA]</div>
          <div className="flex flex-col gap-3">
            <button onClick={onAddToRadar} className="btn-primary justify-center w-full" data-magnetic>
              <span>S'INSCRIRE</span><span>→</span>
            </button>
            <button onClick={onViewDrop} className="btn-ghost justify-center" data-magnetic>
              <span>VOIR DROP</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MERCH GRID — 3 densities: 3 / 4 / asymmetric
   ───────────────────────────────────────────── */
function MerchGrid({ density, products, onOpen, onQuickAdd, accent }) {
  return (
    <section id="boutique" className="hl-b border-black/10">
      <SectionHeader
        index="01"
        eyebrow="Boutique — Drop 008"
        title="La capsule."
        sub="Quatorze pièces. Sérigraphie main. Quantités limitées par taille."
        accent={accent}
        
      />
      {density === '3' && <MerchGrid3 products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
      {density === '4' && <MerchGrid4 products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
      {density === 'asym' && <MerchGridAsym products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
    </section>
  );
}

function MerchGrid3({ products, onOpen, onQuickAdd }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hl-t border-black/10">
      {products.map((p, i) => (
        <ProductCard key={p.id} p={p} idx={i} cols={3} onOpen={onOpen} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}

function MerchGrid4({ products, onOpen, onQuickAdd }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 hl-t border-black/10">
      {products.map((p, i) => (
        <ProductCard key={p.id} p={p} idx={i} cols={4} onOpen={onOpen} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}

function MerchGridAsym({ products, onOpen, onQuickAdd }) {
  // 8 products laid out asymmetrically: 1 big, 2 small, 1 big, etc.
  // 12-column grid with custom spans
  const spans = [
    'col-span-12 md:col-span-7 aspect-[7/6]',  // big
    'col-span-6 md:col-span-5 aspect-[5/6]',   // small
    'col-span-6 md:col-span-4 aspect-[4/5]',   // small
    'col-span-12 md:col-span-8 aspect-[8/5]',  // wide
    'col-span-6 md:col-span-6 aspect-square',
    'col-span-6 md:col-span-6 aspect-square',
    'col-span-12 md:col-span-7 aspect-[7/5]',
    'col-span-12 md:col-span-5 aspect-[5/5]',
  ];
  return (
    <div className="grid grid-cols-12 hl-t border-black/10">
      {products.map((p, i) => (
        <div key={p.id} className={`${spans[i % spans.length]} hl-r hl-b border-black/10`}>
          <ProductCard p={p} idx={i} cols="asym" onOpen={onOpen} onQuickAdd={onQuickAdd} fill />
        </div>
      ))}
    </div>
  );
}

function ProductCard({ p, idx, cols, onOpen, onQuickAdd, fill }) {
  const [size, setSize] = useState_s(p.sizes[Math.min(1, p.sizes.length - 1)]);
  const borderRight = cols === 4 ? (idx % 4 !== 3) : cols === 3 ? (idx % 3 !== 2) : true;
  return (
    <div
      className={`product-card group relative ${fill ? 'h-full' : ''}`}
      style={{
        borderRight: borderRight && !fill ? '1px solid rgba(26,23,21,0.08)' : undefined,
        borderBottom: !fill ? '1px solid rgba(26,23,21,0.08)' : undefined,
      }}
    >
      <div className={`relative ${fill ? 'h-full' : 'aspect-[4/5]'} overflow-hidden bg-[#ECE8DD]`}>
        <image-slot id={`prod-${p.id}-a`} shape="rect" placeholder={`${p.ref} · face A`} class="pc-img-a" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
        <image-slot id={`prod-${p.id}-b`} shape="rect" placeholder={`${p.ref} · face B`} class="pc-img-b" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>

        {(p.tag || p.explicit) && (
          <div className="absolute top-3 left-3 z-10 flex gap-1.5">
            {p.tag && (
              <span className="text-[10px] tracking-wide px-2 py-1 bg-[#1a1715] text-[#F2EFE7] uppercase whitespace-nowrap font-medium">{p.tag}</span>
            )}
            {p.explicit && (
              <span className="text-[10px] tracking-wide px-2 py-1 bg-[#F2EFE7] text-[#1a1715] uppercase font-medium border border-[#1a1715]/20">Explicit</span>
            )}
          </div>
        )}

        <button onClick={() => onOpen(p)} className="absolute inset-0 z-[5]" aria-label={`Ouvrir ${p.name}`} data-magnetic />

        <div className="qa absolute left-0 right-0 bottom-0 z-20 bg-[#F2EFE7]/95 backdrop-blur-sm border-t border-[#1a1715]/10 grid grid-cols-[1fr_auto]">
          <div className="flex items-center gap-1 px-3 py-2.5 overflow-x-auto">
            {p.sizes.map((s) => (
              <button key={s} onClick={(e) => { e.stopPropagation(); setSize(s); }} className={`text-[11px] px-2.5 py-1 transition-colors ${size === s ? 'bg-[#1a1715] text-[#F2EFE7]' : 'hover:bg-[#1a1715]/5'}`} data-magnetic>{s}</button>
            ))}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onQuickAdd(p, size); }} className="px-4 py-2.5 text-[12px] font-medium bg-[#1a1715] text-[#F2EFE7] hover:bg-[#2b2622]" data-magnetic>Ajouter</button>
        </div>
      </div>

      <div className="px-4 py-4 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-medium text-[#1a1715] truncate" style={{ letterSpacing: '-0.01em' }}>{p.name}</div>
          <div className="text-[12px] text-[#1a1715]/55 mt-0.5 truncate">{p.sub}</div>
        </div>
        <div className="text-[14px] tabular shrink-0 font-medium" style={{ letterSpacing: '-0.01em' }}>{p.price} €</div>
      </div>
    </div>
  );
}

function SectionHeader({ index, eyebrow, title, sub, accent, meta }) {
  return (
    <div className="hl-b border-black/10 px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-3xl">
        {eyebrow && (
          <div className="text-[12px] text-[#1a1715]/55 mb-4">
            {eyebrow}
          </div>
        )}
        <h2
          className="leading-[1.05]"
          style={{ fontFamily: 'var(--font-h)', fontWeight: 'var(--font-h-weight)', letterSpacing: 'var(--font-h-tracking)', fontSize: 'clamp(28px, 3.4vw, 48px)' }}
        >
          {title}
        </h2>
        {sub && (
          <p className="text-[14px] text-[#1a1715]/65 mt-4 max-w-md leading-relaxed">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROSTER — interactive vertical list
   ───────────────────────────────────────────── */
function Roster({ accent }) {
  const D = window.BLB_DATA;
  const [activeId, setActiveId] = useState_s(D.artists[0].id);
  const active = D.artists.find((a) => a.id === activeId);

  return (
    <section id="roster" className="hl-b border-black/10">
      <SectionHeader
        index="02"
        eyebrow="LE LABEL — ROSTER"
        title="LES SIGNATURES."
        sub="Six entités. Du producteur anonyme à la cellule visuelle. Une famille — pas une écurie."
        accent={accent}
        meta="ROSTER 2026 · 6 ENTITÉS"
      />
      <div className="grid grid-cols-12 hl-t border-black/10 min-h-[560px]">
        {/* LEFT — list */}
        <div className="col-span-12 lg:col-span-7 hl-r border-black/10">
          {D.artists.map((a, i) => (
            <button
              key={a.id}
              className="roster-row block w-full text-left hl-b border-black/10 px-6 md:px-10 py-6 hover:bg-[#1a1715]/[0.02] transition-colors"
              data-active={a.id === activeId ? '1' : '0'}
              onMouseEnter={() => setActiveId(a.id)}
              onFocus={() => setActiveId(a.id)}
              data-magnetic
            >
              <div className="flex items-baseline justify-between gap-6">
                <div className="flex items-baseline gap-6 min-w-0">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/30 tabular shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display leading-none transition-colors"
                    style={{
                      fontWeight: 900,
                      fontSize: 'clamp(36px, 5vw, 68px)',
                      letterSpacing: '-0.04em',
                      color: a.id === activeId ? '#1a1715' : 'rgba(26,23,21,0.6)',
                    }}
                  >
                    {a.name}
                  </span>
                </div>
                <div className="text-right font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1715]/40 shrink-0 hidden md:block">
                  <div>{a.style}</div>
                  <div className="text-[#1a1715]/30 mt-1">{a.city}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT — reveal panel */}
        <div className="col-span-12 lg:col-span-5 relative bg-[#F2EFE7] flex flex-col">
          <div className="relative flex-1 min-h-[300px]">
            {D.artists.map((a) => (
              <div
                key={a.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: a.id === activeId ? 1 : 0, pointerEvents: a.id === activeId ? 'auto' : 'none' }}
              >
                <image-slot
                  id={`artist-${a.id}`}
                  shape="rect"
                  placeholder={`Portrait · ${a.name}`}
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
                {/* artist name overlay */}
                <div className="absolute bottom-6 left-6 right-6 mix-blend-difference">
                  <div className="font-display leading-none" style={{ fontWeight: 900, fontSize: 'clamp(48px, 7vw, 110px)', letterSpacing: '-0.05em', color: '#1a1715' }}>
                    {a.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* artist data */}
          <div className="hl-t border-black/10 p-6 md:p-8 grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1715]/60">
            <div>
              <div className="text-[#1a1715]/40">STYLE</div>
              <div className="text-[#1a1715] mt-1">{active.style}</div>
            </div>
            <div>
              <div className="text-[#1a1715]/40">VILLE</div>
              <div className="text-[#1a1715] mt-1">{active.city}</div>
            </div>
            <div>
              <div className="text-[#1a1715]/40">CHEZ BLB</div>
              <div className="text-[#1a1715] mt-1 tabular">DEPUIS {active.since}</div>
            </div>
            <div>
              <div className="text-[#1a1715]/40">CATALOGUE</div>
              <div className="text-[#1a1715] mt-1 tabular">{active.tracks ?? '—'} TITRES</div>
            </div>
            <p className="col-span-2 font-mono text-[12px] text-[#1a1715]/70 leading-relaxed normal-case tracking-normal mt-2">
              {active.bio}
            </p>
            <div className="col-span-2 mt-2">
              <button className="btn-ghost" data-magnetic>
                <span>FICHE COMPLÈTE</span><span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   LOOKBOOK — full-bleed editorial
   ───────────────────────────────────────────── */
function Lookbook({ accent }) {
  return (
    <section id="lookbook" className="hl-b border-black/10">
      <SectionHeader
        index="03"
        eyebrow="Lookbook"
        title="En terrain."
        sub="Capsule 008 photographiée à La Friche, Marseille, en mars 2026. Direction artistique : Atelier BLB."
        accent={accent}
        
      />

      <div className="grid grid-cols-12 hl-t border-black/10">
        <div className="col-span-12 md:col-span-8 hl-r border-black/10 relative" style={{ minHeight: 540 }}>
          <image-slot id="look-1" shape="rect" placeholder="Lookbook · plan large" style={{ width: '100%', height: '100%' }}></image-slot>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <div className="hl-b border-black/10 relative" style={{ flex: 1, minHeight: 270 }}>
            <image-slot id="look-2" shape="rect" placeholder="Détail textile" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
          <div className="relative" style={{ flex: 1, minHeight: 270 }}>
            <image-slot id="look-3" shape="rect" placeholder="Portrait" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 hl-t border-black/10">
        <div className="col-span-12 md:col-span-4 hl-r border-black/10 p-8 md:p-12 flex flex-col justify-between gap-10">
          <div className="space-y-3 text-[13px]">
            <div className="flex justify-between hl-b border-black/10 pb-3">
              <span className="text-[#1a1715]/45">Photo</span><span>Atelier BLB</span>
            </div>
            <div className="flex justify-between hl-b border-black/10 pb-3">
              <span className="text-[#1a1715]/45">Stylisme</span><span>Juno L.</span>
            </div>
            <div className="flex justify-between hl-b border-black/10 pb-3">
              <span className="text-[#1a1715]/45">Direction artistique</span><span>BLB</span>
            </div>
            <div className="flex justify-between hl-b border-black/10 pb-3">
              <span className="text-[#1a1715]/45">Casting</span><span>Maison</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1a1715]/45">Lieu</span><span>La Friche, Marseille</span>
            </div>
          </div>
          <button className="btn-ghost self-start" data-magnetic>
            <span>Voir les 14 images</span><span>→</span>
          </button>
        </div>
        <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-px bg-[#1a1715]/8">
          <div className="bg-[#F2EFE7] relative" style={{ minHeight: 280 }}>
            <image-slot id="look-4" shape="rect" placeholder="Lookbook · 04" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
          <div className="bg-[#F2EFE7] relative" style={{ minHeight: 280 }}>
            <image-slot id="look-5" shape="rect" placeholder="Lookbook · 05" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MANIFESTO — text-only brutal block
   ───────────────────────────────────────────── */
function Manifesto({ accent }) {
  return (
    <section id="manifeste" className="hl-b border-black/10 bg-[#F2EFE7]">
      <SectionHeader
        index="04"
        eyebrow="MANIFESTE — DOCUMENT INTERNE"
        title="POURQUOI ON FAIT ÇA."
        accent={accent}
        meta="LECTURE · ~2 MIN"
      />
      <div className="grid grid-cols-12 hl-t border-black/10">
        <div className="col-span-12 lg:col-span-3 hl-r border-black/10 p-8 md:p-10 font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/50 space-y-3">
          <div className="text-[#1a1715]/30">[ARTICLE 01]</div>
          <div>NE PAS DEMANDER DE PERMISSION.</div>
          <div className="text-[#1a1715]/30 pt-4">[ARTICLE 02]</div>
          <div>SORTIR LA MUSIQUE QUAND ELLE EST PRÊTE — PAS QUAND L'ALGO LE DEMANDE.</div>
          <div className="text-[#1a1715]/30 pt-4">[ARTICLE 03]</div>
          <div>PRESSER PHYSIQUE. CHAQUE FOIS.</div>
          <div className="text-[#1a1715]/30 pt-4">[ARTICLE 04]</div>
          <div>AUCUN PARTENAIRE QUI N'A PAS LU L'ARTICLE 01.</div>
        </div>
        <div className="col-span-12 lg:col-span-9 p-8 md:p-14">
          <p
            className="font-display leading-[1.05] text-[#1a1715]"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(28px, 3.4vw, 60px)',
              letterSpacing: '-0.025em',
              textWrap: 'pretty',
            }}
          >
            BLB n'est pas un label. C'est un <span style={{ color: accent }}>protocole</span>. On signe des artistes
            qu'on aime, on presse leurs disques quand on veut, on retire tout quand <span style={{ textDecoration: 'line-through', color: 'rgba(26,23,21,0.4)' }}>ça marche</span> ça
            ne nous parle plus. <span className="text-[#1a1715]/50">Pas de stream, pas d'attaché de presse, pas de stratégie de
            contenu.</span> Une newsletter, un pressage, un site qui s'éteint le 7. Si tu lis cette page, c'est que tu
            es déjà au bon endroit.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/40">
            <span>SIGNÉ — LA DIRECTION, PARIS, 14.05.2026</span>
            <span>VERSION 02 · RÉVISÉE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   JOURNAL — list of recent posts
   ───────────────────────────────────────────── */
function Journal({ accent }) {
  const D = window.BLB_DATA;
  return (
    <section id="journal" className="hl-b border-black/10">
      <SectionHeader
        index="05"
        eyebrow="JOURNAL — TRANSMISSIONS"
        title="DERNIÈRES NOTES."
        accent={accent}
        meta={`${D.journal.length} ENTRÉES · MAI 2026`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 hl-t border-black/10">
        {D.journal.map((j, i) => (
          <article
            key={i}
            className={`p-6 md:p-10 hl-b border-black/10 ${i < 2 ? 'md:hl-r md:border-black/10' : ''} hover:bg-[#1a1715]/[0.02] transition-colors group cursor-pointer`}
            style={i < 2 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}
            data-magnetic
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/40 uppercase mb-6">
              <span style={{ color: accent }}>{j.kind}</span>
              <span className="tabular">{j.date}</span>
            </div>
            <h3 className="font-display leading-tight" style={{ fontWeight: 900, fontSize: 'clamp(24px, 2.2vw, 36px)', letterSpacing: '-0.03em' }}>
              {j.title}
            </h3>
            <p className="font-mono text-[12px] text-[#1a1715]/55 mt-4 leading-relaxed">
              {j.excerpt}
            </p>
            <div className="mt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-[#1a1715]/50 group-hover:text-[#1a1715] transition-colors inline-flex items-center gap-2">
              LIRE LA NOTE <span>→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, {
  Hero, MerchGrid, Lookbook, SectionHeader,
});
