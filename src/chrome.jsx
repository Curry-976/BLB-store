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
   Header (floating, backdrop-blur) + mobile menu
   ───────────────────────────────────────────── */
function Header({ onNavigate, cartCount, onOpenCart, view }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const D = window.BLB_DATA;
  const allNav = [...(D.nav || [])];

  const handleNav = (href) => {
    setMenuOpen(false);
    onNavigate(href.replace('#', ''));
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1000]"
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(140%)' : 'blur(8px)',
          background: scrolled ? 'rgba(242,239,231,0.78)' : 'rgba(242,239,231,0.35)',
          borderBottom: scrolled ? '1px solid rgba(26,23,21,0.10)' : '1px solid transparent',
          transition: 'background .3s, backdrop-filter .3s, border-color .3s',
        }}
      >
        <div className="px-6 md:px-10 py-5 grid grid-cols-3 items-center">
          {/* left nav — desktop only */}
          <nav className="hidden md:flex items-center gap-7">
            {D.nav.slice(0, 3).map((n) => (
              <button
                key={n.label}
                onClick={() => handleNav(n.href)}
                className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1715]/75 hover:text-[#1a1715] transition-colors"
                data-magnetic
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <span
              className="block h-px bg-[#1a1715] transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block h-px bg-[#1a1715] transition-all duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-px bg-[#1a1715] transition-all duration-300 origin-center"
              style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </button>

          {/* logo */}
          <button
            onClick={() => handleNav('home')}
            className="font-display text-[26px] leading-none text-[#1a1715] text-center select-none"
            style={{ fontWeight: 900, letterSpacing: '0.01em' }}
            data-magnetic
          >
            BLB
          </button>

          {/* right nav — desktop only + panier always visible */}
          <nav className="flex items-center gap-7 justify-end">
            {D.nav.slice(3).map((n) => (
              <button
                key={n.label}
                onClick={() => handleNav(n.href)}
                className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1715]/75 hover:text-[#1a1715] transition-colors hidden md:inline"
                data-magnetic
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={onOpenCart}
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1715] inline-flex items-center gap-2 hover:text-[#1a1715]/70 transition-colors"
              data-magnetic
            >
              <span>Panier</span>
              <span className="tabular text-[#1a1715]/55">({String(cartCount).padStart(2, '0')})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-[999] md:hidden flex flex-col"
        style={{
          background: '#F2EFE7',
          transform: `translateX(${menuOpen ? '0' : '-100%'})`,
          transition: 'transform .4s cubic-bezier(.2,.7,.2,1)',
        }}
        aria-hidden={!menuOpen}
      >
        <div className="pt-[80px] px-8 flex-1 flex flex-col justify-center">
          <nav className="flex flex-col gap-1">
            {allNav.map((n, i) => (
              <button
                key={n.label}
                onClick={() => handleNav(n.href)}
                className="text-left py-4 font-display text-[clamp(32px,8vw,52px)] leading-tight text-[#1a1715] hover:text-[#1a1715]/50 transition-colors"
                style={{ fontWeight: 700, letterSpacing: '-0.02em', borderBottom: '1px solid rgba(26,23,21,0.08)' }}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/35 mr-3 align-middle">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {n.label}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); onOpenCart(); }}
              className="text-left py-4 font-display text-[clamp(32px,8vw,52px)] leading-tight text-[#1a1715] hover:text-[#1a1715]/50 transition-colors"
              style={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/35 mr-3 align-middle">
                {String(allNav.length + 1).padStart(2, '0')}
              </span>
              Panier
              <span className="font-mono text-[14px] ml-3 text-[#1a1715]/40">({String(cartCount).padStart(2, '0')})</span>
            </button>
          </nav>
        </div>

        <div className="px-8 py-8 font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/35 uppercase">
          BLB — Bloc Libre Bâtard · Protocole 008
        </div>
      </div>
    </>
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
          background: '#F2EFE7',
          borderLeft: '1px solid rgba(26,23,21,0.12)',
          transform: `translateX(${open ? 0 : 100}%)`,
          transition: 'transform .45s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div className="px-6 py-5 hl-b border-black/10 flex items-center justify-between">
          <div>
            <div className="font-eyebrow text-[#1a1715]/50">PANIER</div>
            <div className="font-display text-xl mt-1">{String(items.length).padStart(2, '0')} {items.length === 1 ? 'pièce' : 'pièces'}</div>
          </div>
          <button onClick={onClose} className="font-mono text-xs tracking-[0.2em] text-[#1a1715]/70 hover:text-[#1a1715]" data-magnetic>
            FERMER ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/40 uppercase">— vide —</div>
              <div className="font-display text-2xl mt-4 text-[#1a1715]/80">Le panier est vide.</div>
              <div className="font-mono text-[11px] text-[#1a1715]/40 mt-2">Inscris-toi au radar pour ne pas rater le prochain drop.</div>
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="px-6 py-5 hl-b border-black/8 flex items-start gap-4">
                <div className="w-20 h-24 bg-[#1a1715]/5 hl-white shrink-0 flex items-center justify-center font-mono text-[10px] text-[#1a1715]/30 tracking-widest">
                  {it.ref}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-[#1a1715]/40 uppercase">{it.sub}</div>
                  <div className="font-display text-lg leading-tight mt-1">{it.name}</div>
                  <div className="font-mono text-[11px] text-[#1a1715]/50 mt-2">
                    TAILLE {it.size} · QTÉ {it.qty}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm tabular">{it.price * it.qty}€</div>
                  <button
                    onClick={() => onRemove(i)}
                    className="font-mono text-[10px] tracking-[0.18em] text-[#1a1715]/40 hover:text-[#1a1715] mt-3"
                    data-magnetic
                  >
                    RETIRER
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hl-t border-black/10 px-6 py-5">
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-[#1a1715]/60 uppercase mb-2">
            <span>SOUS-TOTAL</span>
            <span className="text-[#1a1715] text-sm tabular">{total}€</span>
          </div>
          <div className="font-mono text-[10px] text-[#1a1715]/40 mb-4">Livraison calculée à l'étape suivante · 14 jours pour changer d'avis</div>
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
  return (
    <div className="hl-t hl-b border-black/10 bg-[#F2EFE7] overflow-hidden">
      <div className="marquee py-3.5">
        {[0, 1, 2].map((k) => (
          <div key={k} className="marquee-track font-mono text-[11px] tracking-[0.28em] uppercase text-[#1a1715]/65">
            {items.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-12">
                <span>{it}</span>
                <span className="text-[#1a1715]/20">—</span>
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
    <footer className="hl-t border-black/10 bg-[#F2EFE7] text-[#1a1715] relative">
      {/* main grid */}
      <div className="grid grid-cols-12 hl-b border-black/10 text-[11px] font-mono">
        {/* newsletter */}
        <div className="col-span-12 md:col-span-5 hl-r border-black/10 p-8 md:p-10">
          <div className="font-eyebrow text-[#1a1715]/40 mb-4">NEWSLETTER</div>
          <div className="font-display text-2xl md:text-3xl leading-tight max-w-sm mb-6" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            Rejoindre le radar.<br />Recevoir les drops en avant-première.
          </div>
          <form onSubmit={submit} className="flex hl-white">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@email.fr"
              data-cursor="text"
              className="flex-1 bg-transparent px-4 py-3.5 outline-none font-mono text-[12px] placeholder-[#1a1715]/30"
            />
            <button type="submit" className="px-5 py-3.5 bg-[#1a1715] text-[#F2EFE7] font-mono text-[11px] tracking-[0.2em] hover:bg-[#1a1715]/85" data-magnetic>
              {submitted ? '✓ INSCRIT' : "S'INSCRIRE"}
            </button>
          </form>
          <div className="mt-3 text-[10px] tracking-[0.15em] text-[#1a1715]/35 uppercase">
            Une fois par drop — désinscription en un clic
          </div>
        </div>

        {/* nav columns */}
        <div className="col-span-6 md:col-span-2 hl-r border-black/10 p-8 md:p-10">
          <div className="font-eyebrow text-[#1a1715]/40 mb-4">Boutique</div>
          <ul className="space-y-2.5 text-[#1a1715]/65">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Drop 008</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Catégories</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Archives</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Cartes cadeau</a></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2 hl-r border-black/10 p-8 md:p-10">
          <div className="font-eyebrow text-[#1a1715]/40 mb-4">Aide</div>
          <ul className="space-y-2.5 text-[#1a1715]/65">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Guide tailles</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Livraison</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Retours</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Contact</a></li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3 p-8 md:p-10">
          <div className="font-eyebrow text-[#1a1715]/40 mb-4">Suivre</div>
          <ul className="space-y-2.5 text-[#1a1715]/65">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Instagram</span><span className="text-[#1a1715]/30">@blb.store</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>TikTok</span><span className="text-[#1a1715]/30">@blb.fr</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Bandcamp</span><span className="text-[#1a1715]/30">blb.bandcamp</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Discord</span><span className="text-[#1a1715]/30">/blb-radar</span></a></li>
          </ul>
        </div>
      </div>

      {/* wordmark */}
      <div className="px-6 md:px-10 py-10 hl-b border-black/10 flex items-baseline justify-between gap-6 flex-wrap">
        <div
          className="font-display leading-none select-none"
          style={{
            fontWeight: 900,
            fontSize: 'clamp(56px, 9vw, 140px)',
            letterSpacing: '-0.04em',
          }}
        >
          BLB
        </div>
        <div className="text-right font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/40 uppercase max-w-xs">
          <div className="text-[#1a1715]/60">{D.brand.long}</div>
          <div className="mt-1">{D.brand.estab}</div>
        </div>
      </div>

      {/* legal */}
      <div className="px-6 md:px-10 py-5 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono tracking-[0.16em] uppercase text-[#1a1715]/40">
        <div className="flex gap-5 flex-wrap">
          <span>© 2026 BLB SAS</span>
          <a href="#" className="hover:text-[#1a1715]/80" data-magnetic>CGV</a>
          <a href="#" className="hover:text-[#1a1715]/80" data-magnetic>Mentions légales</a>
          <a href="#" className="hover:text-[#1a1715]/80" data-magnetic>Cookies</a>
          <a href="#" className="hover:text-[#1a1715]/80" data-magnetic>Confidentialité</a>
        </div>
        <div className="flex gap-5">
          <span>Paiement sécurisé</span>
          <span className="text-[#1a1715]/60">Visa · Mastercard · Apple Pay · PayPal</span>
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
            <span className={`${sizes.lbl} font-mono tracking-[0.2em] text-[#1a1715]/40 mt-2`}>{u.l}</span>
          </div>
          {i < arr.length - 1 && <span className="mx-2 text-[#1a1715]/20 text-3xl">:</span>}
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  MagneticCursor, Grain, Header, CartDrawer, Ticker, Footer,
  Countdown, useCountdown,
});
