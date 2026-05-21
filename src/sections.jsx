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
          <span className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />
          <span className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40" />
        </div>
      ))}
    </>
  );
}

function HeroSplit({ D, onAddToRadar, onViewDrop, accent }) {
  return (
    <section className="relative min-h-[100vh] hl-b border-white/10 pt-[88px]">
      <HeroChrome accent={accent} />
      <div className="grid grid-cols-12 min-h-[calc(100vh-88px)]">
        {/* LEFT — type column */}
        <div className="col-span-12 lg:col-span-7 hl-r border-white/10 p-8 lg:p-14 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
            <span style={{ color: accent }}>● {D.drop.code} / {D.drop.name}</span>
            <span>014/088 · TRANSMISSION OUVERTE</span>
          </div>

          <div className="my-12 lg:my-16">
            <div className="font-eyebrow text-white/40 mb-6">PROCHAIN DROP — 06.06.2026 · 21:21 CET</div>
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
            <p className="max-w-md font-mono text-[12px] leading-relaxed text-white/60 mt-8 uppercase tracking-[0.05em]">
              Huitième capsule. 14 pièces textiles + pressage vinyle limité 300 ex.
              Sérigraphie main, confection France. <span className="text-white">Aucun restock</span> — disparaît au coup de minuit.
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
          <div className="hl-t border-white/10 grid grid-cols-3 font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
            <div className="p-5 hl-r border-white/10">
              <div className="text-white/40">RÉFÉRENCE</div>
              <div className="text-white mt-2 tabular">BLB · 008 · 26</div>
            </div>
            <div className="p-5 hl-r border-white/10">
              <div className="text-white/40">PIÈCES</div>
              <div className="text-white mt-2 tabular">{D.drop.pieces} · CAPSULE</div>
            </div>
            <div className="p-5">
              <div className="text-white/40">PRESSAGE</div>
              <div className="text-white mt-2 tabular">300 · 180g</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCentered({ D, onAddToRadar, onViewDrop, accent }) {
  return (
    <section className="relative min-h-[100vh] hl-b border-white/10 pt-[88px] overflow-hidden">
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
        <div className="hl-b border-white/15 px-8 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase">
          <span style={{ color: accent }}>● TRANSMISSION EN COURS</span>
          <span>{D.drop.code} — {D.drop.name}</span>
          <span>014 / 088</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-5xl">
            <div className="font-eyebrow text-white/60 mb-8">PROCHAIN DROP — 06.06.2026 · 21:21 CET</div>
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
        <div className="hl-t border-white/15 px-8 py-3 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase">
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
    <section className="relative min-h-[100vh] hl-b border-white/10 pt-[88px]">
      <HeroChrome accent={accent} />
      <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-px bg-white/8 p-px">
        {/* TL — eyebrow status */}
        <div className="col-span-12 md:col-span-5 row-span-1 bg-black p-6 flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-white/60 uppercase">
          <span style={{ color: accent }}>● {D.drop.code} / {D.drop.name}</span>
          <span>06.06.26</span>
        </div>
        {/* TR — Image-slot small */}
        <div className="col-span-12 md:col-span-7 row-span-2 bg-black relative">
          <image-slot id="hero-exp-r" shape="rect" placeholder="Visuel principal" style={{ width: '100%', height: '100%', minHeight: '60vh' }}></image-slot>
        </div>
        {/* L title */}
        <div className="col-span-12 md:col-span-5 bg-black p-8">
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
          <div className="font-eyebrow text-white/50 mt-4">PROTOCOLE 008 — TRANSMISSION 014</div>
        </div>
      </div>

      {/* bottom row — countdown + image + cta */}
      <div className="grid grid-cols-12 gap-px bg-white/8 hl-t border-white/10">
        <div className="col-span-12 md:col-span-3 bg-black relative">
          <image-slot id="hero-exp-bl" shape="rect" placeholder="Détail" style={{ width: '100%', height: '100%', minHeight: '280px' }}></image-slot>
        </div>
        <div className="col-span-12 md:col-span-6 bg-black p-8 flex flex-col justify-between">
          <p className="max-w-md font-mono text-[12px] leading-relaxed text-white/60 uppercase tracking-[0.05em]">
            14 pièces / 300 vinyles / aucun restock. La boutique ferme au coup de minuit, 7 jours après ouverture.
          </p>
          <Countdown targetISO={D.drop.target} size="md" accent={accent} />
        </div>
        <div className="col-span-12 md:col-span-3 bg-black p-6 flex flex-col justify-between gap-4">
          <div className="font-eyebrow text-white/40">[CTA]</div>
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
    <section id="boutique" className="hl-b border-white/10">
      <SectionHeader
        index="01"
        eyebrow="BOUTIQUE — PROTOCOLE 008"
        title="LA CAPSULE"
        sub="14 pièces. Sérigraphie main. Quantités limitées par taille."
        accent={accent}
        meta={`${products.length} RÉFÉRENCES · LIVRAISON 14 JOURS`}
      />
      {density === '3' && <MerchGrid3 products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
      {density === '4' && <MerchGrid4 products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
      {density === 'asym' && <MerchGridAsym products={products} onOpen={onOpen} onQuickAdd={onQuickAdd} />}
    </section>
  );
}

function MerchGrid3({ products, onOpen, onQuickAdd }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 hl-t border-white/10">
      {products.map((p, i) => (
        <ProductCard key={p.id} p={p} idx={i} cols={3} onOpen={onOpen} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  );
}

function MerchGrid4({ products, onOpen, onQuickAdd }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 hl-t border-white/10">
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
    <div className="grid grid-cols-12 hl-t border-white/10">
      {products.map((p, i) => (
        <div key={p.id} className={`${spans[i % spans.length]} hl-r hl-b border-white/10`}>
          <ProductCard p={p} idx={i} cols="asym" onOpen={onOpen} onQuickAdd={onQuickAdd} fill />
        </div>
      ))}
    </div>
  );
}

function ProductCard({ p, idx, cols, onOpen, onQuickAdd, fill }) {
  const [size, setSize] = useState_s(p.sizes[Math.min(1, p.sizes.length - 1)]);
  const borderRight = cols === 4 ? (idx % 4 !== 3) : cols === 3 ? (idx % 3 !== 2) : true;
  const rowBottom = true;
  return (
    <div
      className={`product-card group hl-white relative ${fill ? 'h-full' : 'aspect-[4/5]'}`}
      style={{
        borderRight: borderRight && !fill ? '1px solid rgba(255,255,255,0.1)' : undefined,
        borderBottom: rowBottom && !fill ? '1px solid rgba(255,255,255,0.1)' : undefined,
        border: fill ? 'none' : undefined,
      }}
    >
      {/* image A */}
      <image-slot
        id={`prod-${p.id}-a`}
        shape="rect"
        placeholder={`${p.ref} · face A`}
        class="pc-img-a"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      ></image-slot>
      {/* image B (hover) */}
      <image-slot
        id={`prod-${p.id}-b`}
        shape="rect"
        placeholder={`${p.ref} · face B`}
        class="pc-img-b"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      ></image-slot>

      {/* badges top */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
        <div className="flex gap-2">
          {p.tag && (
            <span className="font-mono text-[9px] tracking-[0.18em] px-2 py-1 bg-white text-black uppercase whitespace-nowrap">
              {p.tag}
            </span>
          )}
          {p.explicit && <span className="explicit-badge">EXPLICIT</span>}
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] text-white/70 tabular">
          {String(idx + 1).padStart(2, '0')}
        </span>
      </div>

      {/* meta top */}
      <div className="absolute bottom-[68px] left-3 right-3 z-10 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">{p.ref}</div>
          <div className="font-display text-2xl leading-tight mt-1">{p.name}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm tabular">{p.price}€</div>
        </div>
      </div>

      {/* full-click → open */}
      <button
        onClick={() => onOpen(p)}
        className="absolute inset-0 z-[5]"
        aria-label={`Ouvrir ${p.name}`}
        data-magnetic
      />

      {/* quick add bar */}
      <div className="qa absolute left-0 right-0 bottom-0 z-20 bg-white text-black hl-t border-black/20 grid grid-cols-[1fr_auto]">
        <div className="flex items-center gap-1 px-3 py-3 overflow-x-auto">
          {p.sizes.map((s) => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); setSize(s); }}
              className={`font-mono text-[10px] tracking-[0.15em] px-2 py-1 border ${size === s ? 'bg-black text-white border-black' : 'border-black/30 hover:border-black'}`}
              data-magnetic
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onQuickAdd(p, size); }}
          className="px-4 py-3 font-mono text-[11px] tracking-[0.18em] bg-black text-white hover:bg-neutral-800"
          data-magnetic
        >
          + AJOUTER
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ index, eyebrow, title, sub, accent, meta }) {
  return (
    <div className="hl-b border-white/10 px-6 md:px-10 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4 font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
            <span style={{ color: accent }}>[{index}]</span>
            <span>{eyebrow}</span>
          </div>
          <h2 className="font-display leading-[0.9]" style={{ fontWeight: 900, fontSize: 'clamp(40px, 6vw, 96px)', letterSpacing: '-0.04em' }}>
            {title}
          </h2>
          {sub && <p className="font-mono text-[12px] text-white/60 mt-4 max-w-md uppercase tracking-[0.05em]">{sub}</p>}
        </div>
        {meta && (
          <div className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase text-right">
            {meta}
          </div>
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
    <section id="roster" className="hl-b border-white/10">
      <SectionHeader
        index="02"
        eyebrow="LE LABEL — ROSTER"
        title="LES SIGNATURES."
        sub="Six entités. Du producteur anonyme à la cellule visuelle. Une famille — pas une écurie."
        accent={accent}
        meta="ROSTER 2026 · 6 ENTITÉS"
      />
      <div className="grid grid-cols-12 hl-t border-white/10 min-h-[560px]">
        {/* LEFT — list */}
        <div className="col-span-12 lg:col-span-7 hl-r border-white/10">
          {D.artists.map((a, i) => (
            <button
              key={a.id}
              className="roster-row block w-full text-left hl-b border-white/10 px-6 md:px-10 py-6 hover:bg-white/[0.02] transition-colors"
              data-active={a.id === activeId ? '1' : '0'}
              onMouseEnter={() => setActiveId(a.id)}
              onFocus={() => setActiveId(a.id)}
              data-magnetic
            >
              <div className="flex items-baseline justify-between gap-6">
                <div className="flex items-baseline gap-6 min-w-0">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 tabular shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display leading-none transition-colors"
                    style={{
                      fontWeight: 900,
                      fontSize: 'clamp(36px, 5vw, 68px)',
                      letterSpacing: '-0.04em',
                      color: a.id === activeId ? '#fff' : 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {a.name}
                  </span>
                </div>
                <div className="text-right font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 shrink-0 hidden md:block">
                  <div>{a.style}</div>
                  <div className="text-white/30 mt-1">{a.city}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT — reveal panel */}
        <div className="col-span-12 lg:col-span-5 relative bg-black flex flex-col">
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
                  <div className="font-display leading-none" style={{ fontWeight: 900, fontSize: 'clamp(48px, 7vw, 110px)', letterSpacing: '-0.05em', color: '#fff' }}>
                    {a.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* artist data */}
          <div className="hl-t border-white/10 p-6 md:p-8 grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/60">
            <div>
              <div className="text-white/40">STYLE</div>
              <div className="text-white mt-1">{active.style}</div>
            </div>
            <div>
              <div className="text-white/40">VILLE</div>
              <div className="text-white mt-1">{active.city}</div>
            </div>
            <div>
              <div className="text-white/40">CHEZ BLB</div>
              <div className="text-white mt-1 tabular">DEPUIS {active.since}</div>
            </div>
            <div>
              <div className="text-white/40">CATALOGUE</div>
              <div className="text-white mt-1 tabular">{active.tracks ?? '—'} TITRES</div>
            </div>
            <p className="col-span-2 font-mono text-[12px] text-white/70 leading-relaxed normal-case tracking-normal mt-2">
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
    <section id="lookbook" className="hl-b border-white/10">
      <SectionHeader
        index="03"
        eyebrow="ÉDITORIAL — LOOKBOOK"
        title="EN TERRAIN."
        sub="Capsule 008 photographiée à La Friche, Marseille, en mars 2026. Direction artistique : Atelier BLB."
        accent={accent}
        meta="14 IMAGES · MARS 2026"
      />

      <div className="grid grid-cols-12 hl-t border-white/10">
        <div className="col-span-12 md:col-span-8 hl-r border-white/10 relative" style={{ minHeight: 540 }}>
          <image-slot id="look-1" shape="rect" placeholder="Lookbook · plan large" style={{ width: '100%', height: '100%' }}></image-slot>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase mix-blend-difference">
            <span>FRAME 01 / 14 — CAPSULE 008 · LA FRICHE</span>
            <span className="tabular">35MM · F1.8 · 1/125</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col">
          <div className="hl-b border-white/10 relative" style={{ flex: 1, minHeight: 270 }}>
            <image-slot id="look-2" shape="rect" placeholder="Détail textile" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
          <div className="relative" style={{ flex: 1, minHeight: 270 }}>
            <image-slot id="look-3" shape="rect" placeholder="Portrait LØUVE" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 hl-t border-white/10">
        <div className="col-span-12 md:col-span-4 hl-r border-white/10 p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="font-eyebrow text-white/40 mb-4">[CRÉDITS]</div>
            <div className="space-y-3 font-mono text-[11px] tracking-[0.05em] text-white/70 uppercase">
              <div className="flex justify-between hl-b border-white/10 pb-2"><span className="text-white/40">PHOTO</span><span>ATELIER</span></div>
              <div className="flex justify-between hl-b border-white/10 pb-2"><span className="text-white/40">STYLISME</span><span>JUNO L.</span></div>
              <div className="flex justify-between hl-b border-white/10 pb-2"><span className="text-white/40">DA</span><span>BLB</span></div>
              <div className="flex justify-between hl-b border-white/10 pb-2"><span className="text-white/40">CASTING</span><span>MAISON</span></div>
              <div className="flex justify-between"><span className="text-white/40">LIEU</span><span>LA FRICHE · 13</span></div>
            </div>
          </div>
          <button className="btn-ghost mt-8 self-start" data-magnetic>
            <span>VOIR LES 14 IMAGES</span><span>→</span>
          </button>
        </div>
        <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-px bg-white/8">
          <div className="bg-black relative" style={{ minHeight: 280 }}>
            <image-slot id="look-4" shape="rect" placeholder="Lookbook · 04" style={{ width: '100%', height: '100%' }}></image-slot>
          </div>
          <div className="bg-black relative" style={{ minHeight: 280 }}>
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
    <section id="manifeste" className="hl-b border-white/10 bg-black">
      <SectionHeader
        index="04"
        eyebrow="MANIFESTE — DOCUMENT INTERNE"
        title="POURQUOI ON FAIT ÇA."
        accent={accent}
        meta="LECTURE · ~2 MIN"
      />
      <div className="grid grid-cols-12 hl-t border-white/10">
        <div className="col-span-12 lg:col-span-3 hl-r border-white/10 p-8 md:p-10 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 space-y-3">
          <div className="text-white/30">[ARTICLE 01]</div>
          <div>NE PAS DEMANDER DE PERMISSION.</div>
          <div className="text-white/30 pt-4">[ARTICLE 02]</div>
          <div>SORTIR LA MUSIQUE QUAND ELLE EST PRÊTE — PAS QUAND L'ALGO LE DEMANDE.</div>
          <div className="text-white/30 pt-4">[ARTICLE 03]</div>
          <div>PRESSER PHYSIQUE. CHAQUE FOIS.</div>
          <div className="text-white/30 pt-4">[ARTICLE 04]</div>
          <div>AUCUN PARTENAIRE QUI N'A PAS LU L'ARTICLE 01.</div>
        </div>
        <div className="col-span-12 lg:col-span-9 p-8 md:p-14">
          <p
            className="font-display leading-[1.05] text-white"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(28px, 3.4vw, 60px)',
              letterSpacing: '-0.025em',
              textWrap: 'pretty',
            }}
          >
            BLB n'est pas un label. C'est un <span style={{ color: accent }}>protocole</span>. On signe des artistes
            qu'on aime, on presse leurs disques quand on veut, on retire tout quand <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)' }}>ça marche</span> ça
            ne nous parle plus. <span className="text-white/50">Pas de stream, pas d'attaché de presse, pas de stratégie de
            contenu.</span> Une newsletter, un pressage, un site qui s'éteint le 7. Si tu lis cette page, c'est que tu
            es déjà au bon endroit.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
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
    <section id="journal" className="hl-b border-white/10">
      <SectionHeader
        index="05"
        eyebrow="JOURNAL — TRANSMISSIONS"
        title="DERNIÈRES NOTES."
        accent={accent}
        meta={`${D.journal.length} ENTRÉES · MAI 2026`}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 hl-t border-white/10">
        {D.journal.map((j, i) => (
          <article
            key={i}
            className={`p-6 md:p-10 hl-b border-white/10 ${i < 2 ? 'md:hl-r md:border-white/10' : ''} hover:bg-white/[0.02] transition-colors group cursor-pointer`}
            style={i < 2 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}
            data-magnetic
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-6">
              <span style={{ color: accent }}>{j.kind}</span>
              <span className="tabular">{j.date}</span>
            </div>
            <h3 className="font-display leading-tight" style={{ fontWeight: 900, fontSize: 'clamp(24px, 2.2vw, 36px)', letterSpacing: '-0.03em' }}>
              {j.title}
            </h3>
            <p className="font-mono text-[12px] text-white/55 mt-4 leading-relaxed">
              {j.excerpt}
            </p>
            <div className="mt-6 font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 group-hover:text-white transition-colors inline-flex items-center gap-2">
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
