// BLB — Sections boutique-only
// Categories, Archives, Atelier, FAQ
// Loaded after sections.jsx so SectionHeader is in window

const { useState: useState_b } = React;

/* ─────────────────────────────────────────────
   CATÉGORIES — 3 colonnes magnétiques
   ───────────────────────────────────────────── */
function Categories({ accent, onShop }) {
  const D = window.BLB_DATA;
  const [hover, setHover] = useState_b(null);
  return (
    <section id="categories" className="hl-b border-white/10">
      <SectionHeader
        index="02"
        eyebrow="BOUTIQUE — CATÉGORIES"
        title="ACHETER PAR TYPE."
        sub="Trois familles. Toutes les pièces du drop courant + accès aux archives par catégorie."
        accent={accent}
        meta="03 CATÉGORIES · DROP 008"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 hl-t border-white/10">
        {D.categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onShop && onShop(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            className={`group text-left p-8 md:p-10 ${i < 2 ? 'hl-r border-white/10' : ''} relative overflow-hidden min-h-[420px] transition-colors`}
            style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : undefined }}
            data-magnetic
          >
            {/* hover bg accent */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hover === c.id ? 0.07 : 0,
                background: `radial-gradient(circle at 30% 0%, ${accent} 0%, transparent 60%)`,
              }}
            />
            <div className="relative flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 tabular">[{c.n}]</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 tabular">
                  {String(c.count).padStart(2, '0')} RÉF.
                </span>
              </div>
              <div
                className="font-display leading-[0.85] mb-6 transition-transform duration-500"
                style={{
                  fontWeight: 900,
                  fontSize: 'clamp(40px, 4.4vw, 72px)',
                  letterSpacing: '-0.04em',
                  transform: hover === c.id ? 'translateX(8px)' : 'translateX(0)',
                }}
              >
                {c.name}
              </div>
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50 mb-4">
                {c.tags}
              </div>
              <p className="font-mono text-[12px] text-white/65 leading-relaxed">
                {c.blurb}
              </p>
              <div className="mt-auto pt-8 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase text-white">
                <span>EXPLORER</span>
                <span
                  className="inline-block transition-transform duration-300"
                  style={{ transform: hover === c.id ? 'translateX(8px)' : 'translateX(0)' }}
                >
                  →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ARCHIVES — tous les drops passés (sold-out)
   ───────────────────────────────────────────── */
function Archives({ accent }) {
  const D = window.BLB_DATA;
  return (
    <section id="archives" className="hl-b border-white/10">
      <SectionHeader
        index="04"
        eyebrow="ARCHIVES — DROPS 001 → 007"
        title="LE PASSÉ. SOLD OUT."
        sub="7 drops depuis 2022. Tous épuisés, aucun jamais restocké. Conservés ici pour mémoire — et pour rappeler la règle."
        accent={accent}
        meta="07 DROPS · 62 PIÈCES TOTAL"
      />
      <div className="grid grid-cols-12 hl-t border-white/10">
        {/* table header */}
        <div className="col-span-12 hl-b border-white/10 grid grid-cols-12 px-6 md:px-10 py-4 font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
          <div className="col-span-1">DROP</div>
          <div className="col-span-3">NOM</div>
          <div className="col-span-2">SAISON</div>
          <div className="col-span-2">PIÈCES</div>
          <div className="col-span-3">STATUT</div>
          <div className="col-span-1 text-right">FICHE</div>
        </div>
        {D.archives.map((d, i) => (
          <ArchiveRow key={d.code} d={d} idx={i} accent={accent} />
        ))}
      </div>
    </section>
  );
}

function ArchiveRow({ d, idx, accent }) {
  const [hover, setHover] = useState_b(false);
  return (
    <div
      className="col-span-12 hl-b border-white/8 relative overflow-hidden group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* slide-in image preview on hover */}
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-500 z-0"
        style={{
          width: hover ? '40%' : '0%',
          opacity: hover ? 0.35 : 0,
          background: `linear-gradient(90deg, transparent 0%, #050505 80%)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 transition-opacity duration-500 z-0"
        style={{ width: '40%', opacity: hover ? 0.5 : 0 }}
      >
        <image-slot
          id={`archive-${d.code}`}
          shape="rect"
          placeholder={`Drop ${d.code}`}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
      </div>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="relative z-10 grid grid-cols-12 px-6 md:px-10 py-6 items-center hover:bg-white/[0.015] transition-colors"
        data-magnetic
      >
        <div className="col-span-1 font-display tabular text-3xl text-white/30" style={{ fontWeight: 900, letterSpacing: '-0.04em' }}>
          {d.code}
        </div>
        <div className="col-span-3">
          <div className="font-display text-2xl leading-tight" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>{d.name}</div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40 mt-1 tabular">{d.year}</div>
        </div>
        <div className="col-span-2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/55">{d.season}</div>
        <div className="col-span-2 font-mono text-[10px] tracking-[0.18em] text-white/55 tabular">
          {String(d.pieces).padStart(2, '0')} RÉF.
        </div>
        <div className="col-span-3 font-mono text-[10px] tracking-[0.18em] uppercase">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#7f1d1d' }} />
            <span className="text-white/70">{d.status}</span>
          </span>
        </div>
        <div className="col-span-1 text-right font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 group-hover:text-white transition-colors">
          VOIR →
        </div>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ATELIER — fabrication / production
   ───────────────────────────────────────────── */
function Atelier({ accent }) {
  const D = window.BLB_DATA;
  const A = D.atelier;
  return (
    <section id="atelier" className="hl-b border-white/10 bg-black">
      <SectionHeader
        index="05"
        eyebrow="ATELIER — FABRICATION"
        title="L'ATELIER."
        sub="Comment les pièces sont faites. De la matière première au colis scellé."
        accent={accent}
        meta="PARIS 19E · 04 PERSONNES"
      />

      {/* hero block: pull quote + image */}
      <div className="grid grid-cols-12 hl-t border-white/10">
        <div className="col-span-12 lg:col-span-7 hl-r border-white/10 p-8 md:p-14 flex flex-col justify-between">
          <h3
            className="font-display leading-[0.92] whitespace-pre-line"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(36px, 5.5vw, 88px)',
              letterSpacing: '-0.04em',
            }}
          >
            FAIT À LA MAIN.
            <br />
            À <span style={{ color: accent }}>PARIS</span>.
            <br />
            À PETITS LOTS.
          </h3>
          <p className="font-mono text-[12px] text-white/60 leading-relaxed mt-10 max-w-md uppercase tracking-[0.04em]">
            {A.intro}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 relative" style={{ minHeight: 480 }}>
          <image-slot
            id="atelier-hero"
            shape="rect"
            placeholder="Atelier · sérigraphie"
            style={{ width: '100%', height: '100%' }}
          ></image-slot>
          <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-white/70 mix-blend-difference">
            <span>ATELIER · PARIS 19E</span>
            <span className="tabular">35MM</span>
          </div>
        </div>
      </div>

      {/* stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 hl-t border-white/10">
        {A.stats.map((s, i) => (
          <div
            key={s.l}
            className={`p-6 md:p-10 ${i < A.stats.length - 1 ? 'hl-r border-white/10' : ''} hl-b border-white/10`}
            style={i < A.stats.length - 1 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}
          >
            <div className="font-display tabular" style={{ fontWeight: 900, fontSize: 'clamp(48px, 6vw, 96px)', letterSpacing: '-0.05em' }}>
              {s.k}
            </div>
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mt-3 max-w-[10ch]">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      {/* steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 hl-t border-white/10">
        {A.steps.map((s, i) => (
          <div
            key={s.n}
            className={`p-6 md:p-8 ${i < A.steps.length - 1 ? 'md:hl-r border-white/10' : ''} hl-b border-white/10 relative`}
            style={i < A.steps.length - 1 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}
          >
            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 tabular">{s.n}</div>
            <div className="font-display text-2xl leading-tight mt-4" style={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
              {s.t}
            </div>
            <p className="font-mono text-[11px] text-white/55 leading-relaxed mt-3">
              {s.d}
            </p>
            {/* connecting line */}
            {i < A.steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-white/15" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ — accordion
   ───────────────────────────────────────────── */
function FAQ({ accent }) {
  const D = window.BLB_DATA;
  const [openIdx, setOpenIdx] = useState_b(0);
  return (
    <section id="faq" className="hl-b border-white/10">
      <SectionHeader
        index="06"
        eyebrow="QUESTIONS — RÉPONSES"
        title="LES QUESTIONS QUI REVIENNENT."
        sub="Si ta question n'est pas listée, écris-nous : aide@blb-store.fr"
        accent={accent}
        meta="06 ENTRÉES · MAJ 14.05.26"
      />
      <div className="grid grid-cols-12 hl-t border-white/10">
        {/* left column — contact */}
        <div className="col-span-12 lg:col-span-4 hl-r border-white/10 p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="font-eyebrow text-white/40 mb-4">[CONTACT]</div>
            <div className="space-y-4 font-mono text-[12px] uppercase tracking-[0.05em]">
              <div>
                <div className="text-white/40 text-[10px] tracking-[0.18em]">AIDE GÉNÉRALE</div>
                <a href="mailto:aide@blb-store.fr" className="text-white hover:text-white/70" data-magnetic>aide@blb-store.fr</a>
              </div>
              <div>
                <div className="text-white/40 text-[10px] tracking-[0.18em]">COMMANDES & RETOURS</div>
                <a href="mailto:commandes@blb-store.fr" className="text-white hover:text-white/70" data-magnetic>commandes@blb-store.fr</a>
              </div>
              <div>
                <div className="text-white/40 text-[10px] tracking-[0.18em]">PRESSE</div>
                <a href="mailto:presse@blb.fr" className="text-white hover:text-white/70" data-magnetic>presse@blb.fr</a>
              </div>
              <div className="pt-4 hl-t border-white/10">
                <div className="text-white/40 text-[10px] tracking-[0.18em]">RÉPONSE SOUS</div>
                <div className="text-white tabular">24 / 48 H · LUN-VEN</div>
              </div>
            </div>
          </div>
          <button className="btn-ghost mt-10 self-start" data-magnetic>
            <span>ÉCRIRE À L'ÉQUIPE</span><span>→</span>
          </button>
        </div>

        {/* right column — accordion */}
        <div className="col-span-12 lg:col-span-8">
          {D.faq.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className="hl-b border-white/10">
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="w-full flex items-baseline gap-6 px-6 md:px-10 py-6 text-left hover:bg-white/[0.02] transition-colors"
                  data-magnetic
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-white/35 tabular shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="flex-1 font-display leading-tight"
                    style={{ fontWeight: 900, fontSize: 'clamp(20px, 2vw, 30px)', letterSpacing: '-0.025em', color: open ? '#fff' : 'rgba(255,255,255,0.75)' }}
                  >
                    {f.q}
                  </span>
                  <span className="font-mono text-xl text-white/60 shrink-0" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}>
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: open ? 200 : 0 }}
                >
                  <div className="px-6 md:px-10 pb-6 pl-12 md:pl-[88px]">
                    <p className="font-mono text-[12px] leading-relaxed text-white/65 max-w-2xl">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  Categories, Archives, Atelier, FAQ,
});
