// BLB — Chrome: Cursor, Grain, Header, Cart drawer, Ticker, Footer
// Loaded as global window.* — used by app.jsx

const { useState, useEffect, useRef, useCallback } = React;

/* ─────────────────────────────────────────────
   Magnetic cursor
   ───────────────────────────────────────────── */
function MagneticCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: -100, y: -100, rx: -100, ry: -100 });
  const target = useRef({ x: -100, y: -100 });
  const stateRef = useRef({ over: null });

  useEffect(() => {
    // skip on touch
    if (matchMedia('(hover: none)').matches) return;
    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const onOver = (e) => {
      const t = e.target.closest('[data-magnetic], a, button, [role="button"]');
      const isText = e.target.closest('[data-cursor="text"]');
      if (!ring.current) return;
      ring.current.classList.toggle('magnetic', !!t);
      ring.current.classList.toggle('text', !!isText);
      dot.current?.classList.toggle('hidden', !!t || !!isText);
      stateRef.current.over = t;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    let raf;
    const tick = () => {
      const p = pos.current;
      const t = target.current;
      // dot follows tight, ring lerps
      p.x += (t.x - p.x) * 0.6;
      p.y += (t.y - p.y) * 0.6;
      p.rx += (t.x - p.rx) * 0.18;
      p.ry += (t.y - p.ry) * 0.18;

      // magnetic pull on buttons
      const over = stateRef.current.over;
      let rx = p.rx, ry = p.ry;
      if (over) {
        const r = over.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        rx += (cx - rx) * 0.35;
        ry += (cy - ry) * 0.35;
      }
      if (dot.current) dot.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ─────────────────────────────────────────────
   Grain
   ───────────────────────────────────────────── */
function Grain({ level }) {
  // level: 'off' | 'subtle' | 'strong'
  const op = level === 'off' ? 0 : level === 'strong' ? 0.18 : 0.07;
  useEffect(() => {
    document.documentElement.style.setProperty('--grain', op);
    document.body.classList.toggle('scanlines', level === 'strong');
  }, [op, level]);
  if (level === 'off') return null;
  return <div className="grain" aria-hidden="true" />;
}

/* ─────────────────────────────────────────────
   Header (floating, backdrop-blur)
   ───────────────────────────────────────────── */
function Header({ onNavigate, cartCount, onOpenCart, view }) {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState('');
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const fmt = (n) => String(n).padStart(2, '0');
      setTime(`${fmt(d.getHours())}:${fmt(d.getMinutes())}:${fmt(d.getSeconds())} CET`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const D = window.BLB_DATA;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1000]"
      style={{
        backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'blur(6px)',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'blur(6px)',
        background: scrolled ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.18)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: 'background .25s, backdrop-filter .25s, border-color .25s',
      }}
    >
      {/* status bar */}
      <div className="hl-b border-white/5 px-5 py-1.5 flex items-center justify-between text-[10px] font-mono tracking-[0.18em] text-white/50 uppercase tabular gap-3">
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            RADAR ACTIF
          </span>
          <span className="hidden md:inline">{D.brand.coords}</span>
        </div>
        <div className="flex items-center gap-4 whitespace-nowrap">
          <span className="hidden md:inline">{D.drop.code} · {D.drop.state}</span>
          <span>{time || '00:00:00 CET'}</span>
        </div>
      </div>

      {/* nav */}
      <div className="px-5 py-3 grid grid-cols-3 items-center">
        {/* left nav */}
        <nav className="flex items-center gap-4 lg:gap-6 min-w-0">
          {D.nav.slice(0, 3).map((n) => (
            <button
              key={n.label}
              onClick={() => onNavigate(n.href.replace('#', ''))}
              className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/80 hover:text-white transition-colors"
              data-magnetic
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* logo */}
        <button
          onClick={() => onNavigate('home')}
          className="font-display text-[28px] leading-none text-white text-center select-none"
          style={{ fontWeight: 900, letterSpacing: '-0.03em' }}
          data-magnetic
        >
          <span className="inline-flex items-baseline gap-[2px]">
            <span>B</span>
            <span className="text-white/50 text-[12px] font-mono tracking-widest mx-0.5">·</span>
            <span>L</span>
            <span className="text-white/50 text-[12px] font-mono tracking-widest mx-0.5">·</span>
            <span>B</span>
          </span>
        </button>

        {/* right nav */}
        <nav className="flex items-center gap-4 lg:gap-6 justify-end min-w-0">
          {D.nav.slice(3).map((n) => (
            <button
              key={n.label}
              onClick={() => onNavigate(n.href.replace('#', ''))}
              className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/80 hover:text-white transition-colors hidden md:inline"
              data-magnetic
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={onOpenCart}
            className="font-mono text-[11px] tracking-[0.18em] uppercase text-white inline-flex items-center gap-2 px-3 py-1.5 hl-white"
            data-magnetic
          >
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M1 3H10L9 11H2L1 3Z" />
              <path d="M3.5 3V2A2 2 0 0 1 7.5 2V3" />
            </svg>
            PANIER <span className="tabular text-white/60">[{String(cartCount).padStart(2, '0')}]</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Cart drawer (slide-in right)
   ───────────────────────────────────────────── */
function CartDrawer({ open, onClose, items, onRemove, onCheckout }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[1100] transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-[440px] z-[1101] flex flex-col"
        style={{
          background: '#0A0A0A',
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          transform: `translateX(${open ? 0 : 100}%)`,
          transition: 'transform .45s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div className="px-6 py-5 hl-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-eyebrow text-white/50">PANIER</div>
            <div className="font-display text-xl mt-1">{String(items.length).padStart(2, '0')} {items.length === 1 ? 'pièce' : 'pièces'}</div>
          </div>
          <button onClick={onClose} className="font-mono text-xs tracking-[0.2em] text-white/70 hover:text-white" data-magnetic>
            FERMER ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">— vide —</div>
              <div className="font-display text-2xl mt-4 text-white/80">Le panier est vide.</div>
              <div className="font-mono text-[11px] text-white/40 mt-2">Inscris-toi au radar pour ne pas rater le prochain drop.</div>
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="px-6 py-5 hl-b border-white/8 flex items-start gap-4">
                <div className="w-20 h-24 bg-white/5 hl-white shrink-0 flex items-center justify-center font-mono text-[10px] text-white/30 tracking-widest">
                  {it.ref}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">{it.sub}</div>
                  <div className="font-display text-lg leading-tight mt-1">{it.name}</div>
                  <div className="font-mono text-[11px] text-white/50 mt-2">
                    TAILLE {it.size} · QTÉ {it.qty}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm tabular">{it.price * it.qty}€</div>
                  <button
                    onClick={() => onRemove(i)}
                    className="font-mono text-[10px] tracking-[0.18em] text-white/40 hover:text-white mt-3"
                    data-magnetic
                  >
                    RETIRER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hl-t border-white/10 px-6 py-5">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-white/60 uppercase mb-2">
            <span>SOUS-TOTAL</span>
            <span className="text-white text-sm tabular">{total}€</span>
          </div>
          <div className="font-mono text-[10px] text-white/40 mb-4">Livraison calculée à l'étape suivante · 14 jours pour changer d'avis</div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="btn-primary w-full justify-center disabled:opacity-40"
            data-magnetic
          >
            <span>PASSER LA COMMANDE</span>
            <span>→</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────
   Ticker — scrolling marquee
   ───────────────────────────────────────────── */
function Ticker({ items, accent }) {
  const blob = items.join(' /// ') + ' /// ';
  return (
    <div className="hl-t hl-b border-white/10 bg-black overflow-hidden">
      <div className="marquee py-3">
        {[0, 1, 2].map((k) => (
          <div key={k} className="marquee-track font-mono text-[11px] tracking-[0.24em] uppercase">
            {items.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-14">
                <span style={{ color: i % 3 === 0 ? accent : '#fff' }}>{it}</span>
                <span className="text-white/30">✱</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Footer — surveillance board
   ───────────────────────────────────────────── */
function Footer({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const D = window.BLB_DATA;
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setEmail(''); }, 4000);
  };

  return (
    <footer className="hl-t border-white/10 bg-black text-white relative">
      {/* big BLB */}
      <div className="px-5 pt-16 pb-10 hl-b border-white/10">
        <div
          className="font-display leading-[0.78] select-none"
          style={{
            fontWeight: 900,
            fontSize: 'clamp(120px, 28vw, 460px)',
            letterSpacing: '-0.05em',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.6)',
            textAlign: 'center',
          }}
        >
          BLB
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
          <span>{D.brand.long}</span>
          <span>{D.brand.motto}</span>
          <span>{D.brand.estab}</span>
        </div>
      </div>

      {/* surveillance grid */}
      <div className="grid grid-cols-12 hl-b border-white/10 text-[11px] font-mono">
        {/* newsletter */}
        <div className="col-span-12 md:col-span-5 hl-r border-white/10 p-6">
          <div className="font-eyebrow text-white/40 mb-3">[01] RADAR — NEWSLETTER</div>
          <div className="font-display text-2xl leading-tight max-w-xs mb-4">
            S'inscrire au radar.<br />Recevoir les drops avant tout le monde.
          </div>
          <form onSubmit={submit} className="flex hl-white">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.fr"
              data-cursor="text"
              className="flex-1 bg-transparent px-3 py-3 outline-none font-mono text-[12px] placeholder-white/30"
            />
            <button type="submit" className="px-4 py-3 bg-white text-black font-mono text-[11px] tracking-[0.2em] hover:bg-white/80" data-magnetic>
              {submitted ? 'RADAR ✓' : 'INSCRIRE →'}
            </button>
          </form>
          <div className="mt-3 text-[10px] tracking-[0.15em] text-white/30 uppercase">
            Aucun spam · 1 transmission par drop · résiliation libre
          </div>
        </div>

        {/* nav columns */}
        <div className="col-span-6 md:col-span-2 hl-r border-white/10 p-6">
          <div className="font-eyebrow text-white/40 mb-3">[02] BOUTIQUE</div>
          <ul className="space-y-2 tracking-[0.1em] uppercase">
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Drop 008</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Catégories</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Archives</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Cartes cadeau</a></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2 hl-r border-white/10 p-6">
          <div className="font-eyebrow text-white/40 mb-3">[03] AIDE</div>
          <ul className="space-y-2 tracking-[0.1em] uppercase">
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Guide tailles</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Livraison</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Retours</a></li>
            <li><a href="#" data-magnetic className="hover:text-white text-white/70">Contact</a></li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3 p-6">
          <div className="font-eyebrow text-white/40 mb-3">[04] CANAUX</div>
          <ul className="space-y-2 tracking-[0.1em] uppercase">
            <li className="flex justify-between"><a href="#" data-magnetic className="hover:text-white text-white/70">INSTAGRAM</a><span className="text-white/30">@blb.records</span></li>
            <li className="flex justify-between"><a href="#" data-magnetic className="hover:text-white text-white/70">TIKTOK</a><span className="text-white/30">@blb.fr</span></li>
            <li className="flex justify-between"><a href="#" data-magnetic className="hover:text-white text-white/70">BANDCAMP</a><span className="text-white/30">blb.bandcamp</span></li>
            <li className="flex justify-between"><a href="#" data-magnetic className="hover:text-white text-white/70">DISCORD</a><span className="text-white/30">/blb-radar</span></li>
          </ul>
        </div>
      </div>

      {/* legal / status strip */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-[0.18em] uppercase text-white/40">
        <div className="flex gap-5">
          <span>© 2026 BLB SAS</span>
          <span>SIRET 894 002 117 00018</span>
          <a href="#" className="hover:text-white/80" data-magnetic>CGV</a>
          <a href="#" className="hover:text-white/80" data-magnetic>MENTIONS LÉGALES</a>
          <a href="#" className="hover:text-white/80" data-magnetic>COOKIES</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 bg-emerald-500 animate-pulse" />
          <span>SYSTÈME OPÉRATIONNEL · BUILD 008.2026.06</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Countdown — reusable
   ───────────────────────────────────────────── */
function useCountdown(targetISO) {
  const [t, setT] = useState(() => calc(targetISO));
  useEffect(() => {
    const id = setInterval(() => setT(calc(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);
  return t;
}
function calc(targetISO) {
  const diff = Math.max(0, new Date(targetISO) - new Date());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff <= 0 };
}

function Countdown({ targetISO, size = 'md', accent }) {
  const { d, h, m, s, done } = useCountdown(targetISO);
  const sizes = {
    sm: { num: 'text-2xl', lbl: 'text-[9px]', gap: 'gap-3' },
    md: { num: 'text-5xl md:text-6xl', lbl: 'text-[10px]', gap: 'gap-6' },
    lg: { num: 'text-7xl md:text-8xl', lbl: 'text-[11px]', gap: 'gap-8' },
  }[size];
  const pad = (n) => String(n).padStart(2, '0');
  if (done) {
    return <div className="font-display text-3xl" style={{ color: accent }}>RADAR ACTIVÉ ⏵</div>;
  }
  return (
    <div className={`flex items-baseline ${sizes.gap} font-display tabular`}>
      {[
        { v: pad(d), l: 'JOURS' },
        { v: pad(h), l: 'HEURES' },
        { v: pad(m), l: 'MIN' },
        { v: pad(s), l: 'SEC' },
      ].map((u, i, arr) => (
        <div key={u.l} className="flex items-baseline">
          <div className="flex flex-col">
            <span className={`${sizes.num} leading-none`} style={{ fontWeight: 900, letterSpacing: '-0.04em' }}>{u.v}</span>
            <span className={`${sizes.lbl} font-mono tracking-[0.2em] text-white/40 mt-2`}>{u.l}</span>
          </div>
          {i < arr.length - 1 && <span className="mx-2 text-white/20 text-3xl">:</span>}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  MagneticCursor, Grain, Header, CartDrawer, Ticker, Footer,
  Countdown, useCountdown,
});
