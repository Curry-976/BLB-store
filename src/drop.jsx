// BLB — Drop teaser page

const { useState: useState_d, useEffect: useEffect_d } = React;

function DropPage({ onBack, accent, products, onAddToRadar }) {
  const D = window.BLB_DATA;

  return (
    <div className="pt-[88px]">
      {/* back */}
      <div className="hl-b border-white/10 px-6 md:px-10 py-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
        <button onClick={onBack} className="hover:text-white inline-flex items-center gap-2" data-magnetic>
          <span>←</span> RETOUR ACCUEIL
        </button>
        <span style={{ color: accent }}>● TRANSMISSION 014 / 088 — OUVERTE</span>
      </div>

      {/* hero */}
      <section className="relative hl-b border-white/10 overflow-hidden">
        <image-slot id="drop-bg" shape="rect" placeholder="Fond drop teaser"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.92) 80%)' }} />
        <div className="relative px-6 md:px-10 py-20 md:py-32 text-center">
          <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/60 mb-6">
            {D.drop.code} — {D.drop.name} · 06.06.2026 · 21:21 CET
          </div>
          <div
            className="font-display leading-[0.78] mx-auto"
            style={{
              fontWeight: 900,
              fontSize: 'clamp(80px, 18vw, 360px)',
              letterSpacing: '-0.07em',
              maxWidth: '14ch',
            }}
          >
            DROP <span style={{ color: accent }}>008</span>
          </div>
          <div className="mt-12 flex justify-center">
            <Countdown targetISO={D.drop.target} size="lg" accent={accent} />
          </div>
          <p className="max-w-xl mx-auto font-mono text-[12px] leading-relaxed text-white/65 mt-10 uppercase tracking-[0.05em]">
            {D.drop.blurb}
          </p>
          <div className="mt-10 flex justify-center gap-3 flex-wrap">
            <button onClick={onAddToRadar} className="btn-primary" data-magnetic>
              <span>S'INSCRIRE AU RADAR</span><span>→</span>
            </button>
            <button onClick={onBack} className="btn-ghost" data-magnetic>
              <span>EXPLORER LE LABEL</span>
            </button>
          </div>
        </div>
      </section>

      {/* manifest list */}
      <section className="hl-b border-white/10">
        <SectionHeader
          index="—"
          eyebrow="CONTENU DU PROTOCOLE"
          title="MANIFESTE DU DROP."
          sub="14 pièces · 12 titres · 1 vinyle · 1 cassette. Tout livré dans un emballage scellé sérigraphié."
          accent={accent}
          meta="OUVERTURE 06.06.26 · 21:21 CET"
        />
        <div className="grid grid-cols-12 hl-t border-white/10 font-mono text-[11px]">
          <div className="col-span-12 hl-b border-white/10 grid grid-cols-12 px-6 md:px-10 py-4 tracking-[0.18em] uppercase text-white/40">
            <div className="col-span-1">#</div>
            <div className="col-span-2">RÉF</div>
            <div className="col-span-4">PIÈCE</div>
            <div className="col-span-2">CATÉGORIE</div>
            <div className="col-span-2">DISPO</div>
            <div className="col-span-1 text-right">PRIX</div>
          </div>
          {products.map((p, i) => (
            <div key={p.id} className="col-span-12 grid grid-cols-12 px-6 md:px-10 py-5 hl-b border-white/8 hover:bg-white/[0.02] transition-colors group" data-magnetic>
              <div className="col-span-1 text-white/50 tabular">{String(i + 1).padStart(2, '0')}</div>
              <div className="col-span-2 text-white/70 tracking-[0.1em]">{p.ref}</div>
              <div className="col-span-4">
                <div className="font-display text-lg leading-tight" style={{ fontWeight: 900, letterSpacing: '-0.02em' }}>{p.name}</div>
                <div className="text-[10px] text-white/40 tracking-[0.1em] uppercase mt-0.5">{p.sub}</div>
              </div>
              <div className="col-span-2 text-white/60 tracking-[0.1em] uppercase text-[10px]">
                {p.id === 'p02' || p.id === 'p07' ? 'PRESSAGE' : 'TEXTILE'}
              </div>
              <div className="col-span-2">
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${p.stock === 'BAS' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-white/70 tracking-[0.1em] uppercase text-[10px]">{p.stock}</span>
              </div>
              <div className="col-span-1 text-right tabular">{p.price}€</div>
            </div>
          ))}
        </div>
      </section>

      {/* protocol grid — 4 step block */}
      <section className="hl-b border-white/10">
        <SectionHeader
          index="—"
          eyebrow="PROTOCOLE — MODE D'EMPLOI"
          title="COMMENT ÇA SE PASSE."
          accent={accent}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 hl-t border-white/10">
          {[
            { n: '01', t: 'INSCRIRE TON ÉMAIL', d: "Le radar t'envoie un lien d'accès 24h avant ouverture." },
            { n: '02', t: 'ACCÈS PRIORITAIRE', d: "Tu rentres sur la boutique avant le grand public. Tout est dispo pendant 1h." },
            { n: '03', t: 'OUVERTURE PUBLIQUE', d: "À 22:21, tout le monde peut acheter ce qu'il reste — premier arrivé, premier servi." },
            { n: '04', t: 'FERMETURE', d: "Le 13.06 à minuit, on retire la boutique. Les invendus partent au pilon." },
          ].map((s, i) => (
            <div key={s.n} className={`p-8 md:p-10 ${i < 3 ? 'md:hl-r' : ''} hl-b border-white/10`}
              style={i < 3 ? { borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}>
              <div className="font-display tabular text-6xl text-white/15" style={{ fontWeight: 900, letterSpacing: '-0.04em' }}>{s.n}</div>
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-white mt-6">{s.t}</div>
              <p className="font-mono text-[12px] text-white/55 mt-3 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* sign up */}
      <section className="px-6 md:px-10 py-20 md:py-32 text-center hl-b border-white/10">
        <div className="font-eyebrow text-white/50 mb-6">DERNIÈRE ÉTAPE</div>
        <h2 className="font-display leading-[0.9]" style={{ fontWeight: 900, fontSize: 'clamp(48px, 8vw, 130px)', letterSpacing: '-0.04em' }}>
          ENTRER<br />DANS LE <span style={{ color: accent }}>RADAR</span>.
        </h2>
        <RadarSignup accent={accent} />
      </section>
    </div>
  );
}

function RadarSignup({ accent }) {
  const [email, setEmail] = useState_d('');
  const [sent, setSent] = useState_d(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
    setTimeout(() => { setSent(false); setEmail(''); }, 4500);
  };
  return (
    <form onSubmit={submit} className="mt-12 max-w-xl mx-auto">
      <div className="flex hl-white-strong">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.fr"
          data-cursor="text"
          className="flex-1 bg-transparent px-5 py-5 outline-none font-mono text-[14px] placeholder-white/30"
        />
        <button type="submit" className="px-8 py-5 bg-white text-black font-mono text-[12px] tracking-[0.22em] hover:bg-white/80 transition-colors" data-magnetic>
          {sent ? 'INSCRIT ✓' : 'M\'INSCRIRE →'}
        </button>
      </div>
      <div className="mt-4 font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
        1 ÉMAIL · ZÉRO SPAM · RÉSILIATION 1 CLIC
      </div>
      {sent && (
        <div className="mt-6 font-mono text-[11px] text-white/70 tracking-[0.05em] uppercase" style={{ color: accent }}>
          ● TU ES SUR LE RADAR. RDV LE 06.06.26 — 21:21 CET.
        </div>
      )}
    </form>
  );
}

window.DropPage = DropPage;
