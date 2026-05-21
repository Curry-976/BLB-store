// BLB — Sections boutique-only (minimalist)
// Categories, Archives, Atelier, FAQ

const { useState: useState_b } = React;

// helper: capitalize first letter
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/* ─────────────────────────────────────────────
   CATÉGORIES
   ───────────────────────────────────────────── */
function Categories({ accent, onShop }) {
  const D = window.BLB_DATA;
  const [hover, setHover] = useState_b(null);
  return (
    <section id="categories" className="hl-b border-black/10">
      <SectionHeader
        eyebrow="Catégories"
        title="Acheter par type."
        sub="Trois familles : textile, pressage et accessoires. Toutes les pièces du drop courant, et accès aux archives par catégorie."
        accent={accent}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 hl-t border-black/10">
        {D.categories.map((c, i) => (
          <button
            key={c.id}
            onClick={() => onShop && onShop(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            className="group text-left p-10 md:p-12 relative overflow-hidden min-h-[340px] transition-colors hover:bg-[#1a1715]/[0.02]"
            style={{ borderRight: i < 2 ? '1px solid rgba(26,23,21,0.1)' : undefined }}
            data-magnetic
          >
            <div className="text-[12px] text-[#1a1715]/45 mb-6">
              {String(c.count).padStart(2, '0')} références
            </div>
            <div
              className="leading-[1.05] mb-5"
              style={{
                fontFamily: 'var(--font-h)',
                fontWeight: 'var(--font-h-weight)',
                fontSize: 'clamp(28px, 3vw, 44px)',
                letterSpacing: 'var(--font-h-tracking)',
              }}
            >
              {cap(c.name)}
            </div>
            <p className="text-[14px] text-[#1a1715]/65 leading-relaxed">
              {c.blurb}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[13px] font-medium text-[#1a1715]">
              <span>Explorer</span>
              <span
                className="inline-block transition-transform duration-300"
                style={{ transform: hover === c.id ? 'translateX(6px)' : 'translateX(0)' }}
              >
                →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ARCHIVES
   ───────────────────────────────────────────── */
function Archives({ accent }) {
  const D = window.BLB_DATA;
  return (
    <section id="archives" className="hl-b border-black/10">
      <SectionHeader
        eyebrow="Archives"
        title="Drops 001 à 007."
        sub="Sept drops depuis 2022. Tous épuisés, aucun restocké. Conservés ici pour mémoire."
        accent={accent}
      />
      <div className="hl-t border-black/10">
        {/* table header */}
        <div className="hidden md:grid grid-cols-12 px-6 md:px-12 py-4 text-[11px] text-[#1a1715]/45 hl-b border-black/10">
          <div className="col-span-1">Drop</div>
          <div className="col-span-4">Nom</div>
          <div className="col-span-2">Saison</div>
          <div className="col-span-2">Pièces</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-1 text-right">Fiche</div>
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
      className="hl-b border-black/10 relative overflow-hidden group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* slide-in image preview on hover */}
      <div
        className="absolute right-0 top-0 bottom-0 transition-all duration-500 z-0 pointer-events-none"
        style={{
          width: hover ? '36%' : '0%',
          opacity: hover ? 0.5 : 0,
        }}
      >
        <image-slot
          id={`archive-${d.code}`}
          shape="rect"
          placeholder={`Drop ${d.code}`}
          style={{ width: '100%', height: '100%' }}
        ></image-slot>
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(242,239,231,0.9) 0%, transparent 30%)' }}
        />
      </div>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="relative z-10 grid grid-cols-12 px-6 md:px-12 py-5 md:py-6 items-center hover:bg-[#1a1715]/[0.02] transition-colors gap-y-2"
        data-magnetic
      >
        <div className="col-span-2 md:col-span-1 tabular text-[20px] text-[#1a1715]/35 font-medium" style={{ letterSpacing: '-0.02em' }}>
          {d.code}
        </div>
        <div className="col-span-10 md:col-span-4">
          <div className="text-[18px] md:text-[20px] leading-tight font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}>{cap(d.name)}</div>
          <div className="text-[12px] text-[#1a1715]/45 mt-1 tabular">{d.year}</div>
        </div>
        <div className="col-span-4 md:col-span-2 text-[13px] text-[#1a1715]/65">{cap(d.season)}</div>
        <div className="col-span-4 md:col-span-2 text-[13px] text-[#1a1715]/65 tabular">
          {String(d.pieces).padStart(2, '0')} pièces
        </div>
        <div className="col-span-4 md:col-span-2 text-[12px]">
          <span className="inline-flex items-center gap-2 text-[#1a1715]/65">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1a1715]/40" />
            <span>Épuisé</span>
          </span>
        </div>
        <div className="hidden md:flex md:col-span-1 justify-end text-[13px] text-[#1a1715]/45 group-hover:text-[#1a1715] transition-colors">
          Voir →
        </div>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ATELIER
   ───────────────────────────────────────────── */
function Atelier({ accent }) {
  const D = window.BLB_DATA;
  const A = D.atelier;
  return (
    <section id="atelier" className="hl-b border-black/10">
      <SectionHeader
        eyebrow="Atelier"
        title="Fabrication."
        sub="Comment les pièces sont faites — de la matière première au colis scellé."
        accent={accent}
      />

      {/* hero block: pull quote + image */}
      <div className="grid grid-cols-12 hl-t border-black/10">
        <div className="col-span-12 lg:col-span-7 hl-r border-black/10 p-10 md:p-16 flex flex-col justify-between gap-12">
          <h3
            className="leading-[1.05]"
            style={{
              fontFamily: 'var(--font-h)',
              fontWeight: 'var(--font-h-weight)',
              fontSize: 'clamp(32px, 4vw, 60px)',
              letterSpacing: 'var(--font-h-tracking)',
            }}
          >
            Fait à la main, à Paris,<br />à petits lots.
          </h3>
          <p className="text-[14px] text-[#1a1715]/70 leading-relaxed max-w-md">
            {A.intro}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 relative" style={{ minHeight: 440 }}>
          <image-slot
            id="atelier-hero"
            shape="rect"
            placeholder="Atelier · sérigraphie"
            style={{ width: '100%', height: '100%' }}
          ></image-slot>
        </div>
      </div>

      {/* stats — simpler */}
      <div className="grid grid-cols-2 md:grid-cols-4 hl-t border-black/10">
        {A.stats.map((s, i) => (
          <div
            key={s.l}
            className="p-8 md:p-10 hl-b border-black/10"
            style={i < A.stats.length - 1 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}
          >
            <div
              className="tabular font-medium"
              style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(36px, 4vw, 56px)', letterSpacing: '-0.03em' }}
            >
              {s.k}
            </div>
            <div className="text-[12px] text-[#1a1715]/55 mt-2 max-w-[14ch]">
              {cap(s.l.toLowerCase())}
            </div>
          </div>
        ))}
      </div>

      {/* steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 hl-t border-black/10">
        {A.steps.map((s, i) => (
          <div
            key={s.n}
            className="p-8 hl-b border-black/10 relative"
            style={i < A.steps.length - 1 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}
          >
            <div className="text-[12px] text-[#1a1715]/45 tabular">{s.n}</div>
            <div
              className="leading-tight mt-4 font-medium"
              style={{ fontFamily: 'var(--font-h)', fontSize: '18px', letterSpacing: '-0.02em' }}
            >
              {cap(s.t.toLowerCase())}
            </div>
            <p className="text-[13px] text-[#1a1715]/65 leading-relaxed mt-2">
              {s.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────── */
function FAQ({ accent }) {
  const D = window.BLB_DATA;
  const [openIdx, setOpenIdx] = useState_b(0);
  return (
    <section id="faq" className="hl-b border-black/10">
      <SectionHeader
        eyebrow="Questions"
        title="Les questions qui reviennent."
        sub="Si ta question n'est pas listée, écris-nous à aide@blb-store.fr."
        accent={accent}
      />
      <div className="grid grid-cols-12 hl-t border-black/10">
        {/* left — contact */}
        <div className="col-span-12 lg:col-span-4 hl-r border-black/10 p-8 md:p-12 flex flex-col justify-between gap-12">
          <div className="space-y-6 text-[13px]">
            <div>
              <div className="text-[12px] text-[#1a1715]/45 mb-1">Aide générale</div>
              <a href="mailto:aide@blb-store.fr" className="text-[#1a1715] hover:text-[#1a1715]/65 tabular" data-magnetic>aide@blb-store.fr</a>
            </div>
            <div>
              <div className="text-[12px] text-[#1a1715]/45 mb-1">Commandes et retours</div>
              <a href="mailto:commandes@blb-store.fr" className="text-[#1a1715] hover:text-[#1a1715]/65 tabular" data-magnetic>commandes@blb-store.fr</a>
            </div>
            <div>
              <div className="text-[12px] text-[#1a1715]/45 mb-1">Presse</div>
              <a href="mailto:presse@blb.fr" className="text-[#1a1715] hover:text-[#1a1715]/65 tabular" data-magnetic>presse@blb.fr</a>
            </div>
            <div className="pt-4 hl-t border-black/10">
              <div className="text-[12px] text-[#1a1715]/45 mb-1">Réponse sous</div>
              <div className="text-[#1a1715] tabular">24 à 48 h, du lundi au vendredi</div>
            </div>
          </div>
          <button className="btn-ghost self-start" data-magnetic>
            <span>Écrire à l'équipe</span><span>→</span>
          </button>
        </div>

        {/* right — accordion */}
        <div className="col-span-12 lg:col-span-8">
          {D.faq.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={i} className="hl-b border-black/10">
                <button
                  onClick={() => setOpenIdx(open ? -1 : i)}
                  className="w-full flex items-center gap-6 px-6 md:px-10 py-5 md:py-6 text-left hover:bg-[#1a1715]/[0.02] transition-colors"
                  data-magnetic
                >
                  <span className="flex-1 leading-tight font-medium text-[16px] md:text-[18px]" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.015em', color: open ? '#1a1715' : 'rgba(26,23,21,0.85)' }}>
                    {f.q}
                  </span>
                  <span className="text-xl text-[#1a1715]/55 shrink-0 font-light" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}>
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400"
                  style={{ maxHeight: open ? 220 : 0 }}
                >
                  <div className="px-6 md:px-10 pb-6">
                    <p className="text-[14px] leading-relaxed text-[#1a1715]/70 max-w-2xl">
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
