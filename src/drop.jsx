// BLB — Drop teaser page (minimalist cream)

const { useState: useState_d, useEffect: useEffect_d } = React;

function DropPage({ onBack, accent, products, onAddToRadar }) {
  const D = window.BLB_DATA;

  return (
    <div className="pt-[68px]">
      {/* back */}
      <div className="hl-b border-black/10 px-6 md:px-12 py-4 flex items-center justify-between text-[12px] text-[#1a1715]/65">
        <button onClick={onBack} className="hover:text-[#1a1715] inline-flex items-center gap-2" data-magnetic>
          <span>←</span> Retour accueil
        </button>
        <span>Drop 008 — ouverture le 6 juin</span>
      </div>

      {/* hero */}
      <section className="relative hl-b border-black/10 overflow-hidden">
        <image-slot id="drop-bg" shape="rect" placeholder="Drop teaser"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 60%, rgba(242,239,231,0.55) 0%, rgba(242,239,231,0.92) 80%)' }} />
        <div className="relative px-6 md:px-12 py-24 md:py-32 text-center">
          <div className="text-[12px] text-[#1a1715]/55 mb-6">
            Drop 008 — Radar · 6 juin 2026 · 21h21
          </div>
          <h1
            className="leading-[0.92] mx-auto font-medium"
            style={{
              fontFamily: 'var(--font-h)',
              fontSize: 'clamp(56px, 10vw, 168px)',
              letterSpacing: '-0.035em',
              maxWidth: '12ch',
            }}
          >
            Drop 008.
          </h1>
          <div className="mt-10 flex justify-center">
            <Countdown targetISO={D.drop.target} size="md" accent={accent} />
          </div>
          <p className="max-w-xl mx-auto text-[14px] leading-relaxed text-[#1a1715]/70 mt-8" style={{ textWrap: 'pretty' }}>
            {D.drop.blurb}
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <button onClick={onAddToRadar} className="btn-primary" data-magnetic>
              <span>S'inscrire au radar</span><span>→</span>
            </button>
            <button onClick={onBack} className="btn-ghost" data-magnetic>
              <span>Explorer la boutique</span>
            </button>
          </div>
        </div>
      </section>

      {/* manifest list */}
      <section className="hl-b border-black/10">
        <SectionHeader
          eyebrow="Contenu du drop"
          title="Liste complète."
          sub="14 pièces, dont un pressage vinyle et une cassette. Livré dans un emballage scellé."
          accent={accent}
        />
        <div className="hl-t border-black/10">
          <div className="hidden md:grid grid-cols-12 px-6 md:px-12 py-4 text-[11px] text-[#1a1715]/45 hl-b border-black/10">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Réf</div>
            <div className="col-span-4">Pièce</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-2">Disponibilité</div>
            <div className="col-span-1 text-right">Prix</div>
          </div>
          {products.map((p, i) => (
            <div key={p.id} className="grid grid-cols-12 px-6 md:px-12 py-5 hl-b border-black/10 hover:bg-[#1a1715]/[0.02] transition-colors items-center gap-y-2" data-magnetic>
              <div className="col-span-2 md:col-span-1 text-[#1a1715]/45 tabular text-[13px]">{String(i + 1).padStart(2, '0')}</div>
              <div className="col-span-10 md:col-span-2 text-[#1a1715]/65 text-[13px] tabular">{p.ref}</div>
              <div className="col-span-12 md:col-span-4">
                <div className="text-[16px] leading-tight font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.015em' }}>{p.name}</div>
                <div className="text-[12px] text-[#1a1715]/50 mt-0.5">{p.sub}</div>
              </div>
              <div className="col-span-4 md:col-span-2 text-[13px] text-[#1a1715]/65">
                {p.id === 'p02' || p.id === 'p07' ? 'Pressage' : 'Textile'}
              </div>
              <div className="col-span-4 md:col-span-2 text-[13px]">
                <span className="inline-flex items-center gap-2 text-[#1a1715]/65">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${p.stock === 'BAS' ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                  <span>{p.stock === 'BAS' ? 'Stock bas' : 'Disponible'}</span>
                </span>
              </div>
              <div className="col-span-4 md:col-span-1 text-right tabular text-[14px] font-medium">{p.price} €</div>
            </div>
          ))}
        </div>
      </section>

      {/* protocol — 4 step block */}
      <section className="hl-b border-black/10">
        <SectionHeader
          eyebrow="Mode d'emploi"
          title="Comment ça se passe."
          accent={accent}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 hl-t border-black/10">
          {[
            { n: '01', t: 'Inscription', d: "L'inscription au radar t'envoie un lien d'accès 24h avant l'ouverture." },
            { n: '02', t: 'Accès prioritaire', d: "Tu entres sur la boutique avant le grand public. Tout est disponible pendant une heure." },
            { n: '03', t: 'Ouverture publique', d: "À 22h21, tout le monde peut acheter ce qu'il reste — premier arrivé, premier servi." },
            { n: '04', t: 'Fermeture', d: "Le 13 juin à minuit, on retire la boutique. Les invendus partent au pilon." },
          ].map((s, i) => (
            <div key={s.n} className="p-8 md:p-10 hl-b border-black/10"
              style={i < 3 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}>
              <div className="tabular text-[44px] text-[#1a1715]/20 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.03em' }}>{s.n}</div>
              <div className="text-[16px] mt-6 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}>{s.t}</div>
              <p className="text-[13px] text-[#1a1715]/65 mt-2 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* sign up */}
      <section className="px-6 md:px-12 py-20 md:py-28 text-center hl-b border-black/10">
        <div className="text-[12px] text-[#1a1715]/55 mb-5">Dernière étape</div>
        <h2 className="leading-[1.05] font-medium" style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(40px, 6vw, 88px)', letterSpacing: '-0.03em' }}>
          Rejoindre le radar.
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
    <form onSubmit={submit} className="mt-10 max-w-xl mx-auto">
      <div className="flex border border-[#1a1715]/25">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="adresse@email.fr"
          data-cursor="text"
          className="flex-1 bg-transparent px-5 py-4 outline-none text-[14px] placeholder-[#1a1715]/35"
        />
        <button type="submit" className="px-7 py-4 bg-[#1a1715] text-[#F2EFE7] text-[13px] font-medium hover:bg-[#2b2622] transition-colors" data-magnetic>
          {sent ? 'Inscrit ✓' : "S'inscrire →"}
        </button>
      </div>
      <div className="mt-3 text-[12px] text-[#1a1715]/45">
        Un seul email, zéro spam, désinscription en un clic.
      </div>
      {sent && (
        <div className="mt-5 text-[13px]" style={{ color: accent }}>
          ● Tu es sur le radar. Rendez-vous le 6 juin 2026, 21h21.
        </div>
      )}
    </form>
  );
}

window.DropPage = DropPage;
