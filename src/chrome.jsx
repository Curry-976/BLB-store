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

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
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
          {/* hamburger — mobile only */}
          <div className="flex items-center">
            <button
              className="md:hidden flex flex-col justify-center gap-[5px] w-8 h-8 shrink-0"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <span className="block h-px bg-[#1a1715] transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
              <span className="block h-px bg-[#1a1715] transition-all duration-200"
                style={{ opacity: menuOpen ? 0 : 1 }} />
              <span className="block h-px bg-[#1a1715] transition-all duration-300 origin-center"
                style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
            </button>
            {/* left nav — desktop only */}
            <nav className="hidden md:flex items-center gap-6">
              {D.nav.slice(0, 3).map((n) => (
                <button
                  key={n.label}
                  onClick={() => handleNav(n.href)}
                  className="text-[13px] text-[#1a1715]/75 hover:text-[#1a1715] transition-colors"
                  data-magnetic
                >
                  {cap(n.label)}
                </button>
              ))}
            </nav>
          </div>

          {/* logo */}
          <button
            onClick={() => handleNav('home')}
            className="text-[22px] leading-none text-[#1a1715] text-center select-none font-medium"
            style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}
            data-magnetic
          >
            BLB
          </button>

          {/* right nav — desktop links hidden on mobile, panier always visible */}
          <nav className="flex items-center gap-6 justify-end">
            {D.nav.slice(3).map((n) => (
              <button
                key={n.label}
                onClick={() => handleNav(n.href)}
                className="text-[13px] text-[#1a1715]/75 hover:text-[#1a1715] transition-colors hidden md:inline"
                data-magnetic
              >
                {cap(n.label)}
              </button>
            ))}
            <button
              onClick={onOpenCart}
              className="text-[13px] text-[#1a1715] inline-flex items-center gap-2 hover:text-[#1a1715]/65 transition-colors"
              data-magnetic
            >
              <span>Panier</span>
              <span className="tabular text-[#1a1715]/55">({String(cartCount).padStart(2, '0')})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu — slide-in from left */}
      <div
        className="fixed inset-0 z-[999] md:hidden flex flex-col"
        style={{
          background: '#F2EFE7',
          transform: `translateX(${menuOpen ? '0' : '-100%'})`,
          transition: 'transform .4s cubic-bezier(.2,.7,.2,1)',
        }}
        aria-hidden={!menuOpen}
      >
        <div className="pt-[76px] px-8 flex-1 flex flex-col justify-center">
          <nav className="flex flex-col">
            {allNav.map((n, i) => (
              <button
                key={n.label}
                onClick={() => handleNav(n.href)}
                className="text-left py-4 text-[#1a1715] hover:text-[#1a1715]/50 transition-colors flex items-baseline gap-4"
                style={{
                  fontFamily: 'var(--font-h)',
                  fontSize: 'clamp(30px, 7vw, 48px)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  borderBottom: '1px solid rgba(26,23,21,0.08)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(26,23,21,0.3)', flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {cap(n.label)}
              </button>
            ))}
            <button
              onClick={() => { setMenuOpen(false); onOpenCart(); }}
              className="text-left py-4 text-[#1a1715] hover:text-[#1a1715]/50 transition-colors flex items-baseline gap-4"
              style={{
                fontFamily: 'var(--font-h)',
                fontSize: 'clamp(30px, 7vw, 48px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(26,23,21,0.3)', flexShrink: 0 }}>
                {String(allNav.length + 1).padStart(2, '0')}
              </span>
              Panier
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'rgba(26,23,21,0.35)', marginLeft: '8px' }}>
                ({String(cartCount).padStart(2, '0')})
              </span>
            </button>
          </nav>
        </div>

        <div className="px-8 py-8" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(26,23,21,0.3)', textTransform: 'uppercase' }}>
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
          background: 'rgba(26,23,21,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] z-[1101] flex flex-col"
        style={{
          background: '#F2EFE7',
          borderLeft: '1px solid rgba(26,23,21,0.12)',
          transform: `translateX(${open ? 0 : 100}%)`,
          transition: 'transform .45s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        <div className="px-6 py-5 hl-b border-black/10 flex items-center justify-between">
          <div>
            <div className="text-[12px] text-[#1a1715]/55">Panier</div>
            <div className="text-[20px] mt-0.5 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}>{String(items.length).padStart(2, '0')} {items.length === 1 ? 'pièce' : 'pièces'}</div>
          </div>
          <button onClick={onClose} className="text-[13px] text-[#1a1715]/65 hover:text-[#1a1715]" data-magnetic>
            Fermer ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-[12px] text-[#1a1715]/45">— vide —</div>
              <div className="text-[20px] mt-3 text-[#1a1715]/80 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}>Le panier est vide.</div>
              <div className="text-[13px] text-[#1a1715]/55 mt-2 max-w-[26ch] mx-auto">Inscris-toi au radar pour ne pas rater le prochain drop.</div>
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="px-6 py-5 hl-b border-black/10 flex items-start gap-4">
                <div className="w-20 h-24 bg-[#ECE8DD] shrink-0 flex items-center justify-center text-[11px] text-[#1a1715]/40 tabular">
                  {it.ref}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#1a1715]/55 truncate">{it.sub}</div>
                  <div className="text-[16px] leading-tight mt-1 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.015em' }}>{it.name}</div>
                  <div className="text-[12px] text-[#1a1715]/55 mt-2">
                    Taille {it.size} · qté {it.qty}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[14px] tabular font-medium">{it.price * it.qty} €</div>
                  <button
                    onClick={() => onRemove(i)}
                    className="text-[12px] text-[#1a1715]/50 hover:text-[#1a1715] mt-3 underline-offset-2 hover:underline"
                    data-magnetic
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="hl-t border-black/10 px-6 py-5">
          <div className="flex items-center justify-between text-[13px] text-[#1a1715]/65 mb-2">
            <span>Sous-total</span>
            <span className="text-[#1a1715] text-[15px] tabular font-medium">{total} €</span>
          </div>
          <div className="text-[12px] text-[#1a1715]/50 mb-4">Livraison calculée à l'étape suivante · 14 jours pour changer d'avis</div>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="btn-primary w-full justify-center disabled:opacity-40"
            data-magnetic
          >
            <span>Passer la commande</span>
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
    <footer className="hl-t border-black/10 text-[#1a1715] relative">
      <div className="grid grid-cols-12 hl-b border-black/10 text-[13px]">
        {/* newsletter */}
        <div className="col-span-12 md:col-span-5 hl-r border-black/10 p-8 md:p-12">
          <div className="text-[12px] text-[#1a1715]/55 mb-4">Newsletter</div>
          <div className="text-[20px] md:text-[24px] leading-tight max-w-sm mb-6 font-medium" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.02em' }}>
            Rejoindre le radar.<br />Recevoir les drops en avant-première.
          </div>
          <form onSubmit={submit} className="flex border border-[#1a1715]/20">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse@email.fr"
              data-cursor="text"
              className="flex-1 bg-transparent px-4 py-3.5 outline-none text-[13px] placeholder-[#1a1715]/35"
            />
            <button type="submit" className="px-5 py-3.5 bg-[#1a1715] text-[#F2EFE7] text-[13px] font-medium hover:bg-[#2b2622]" data-magnetic>
              {submitted ? '✓ Inscrit' : "S'inscrire"}
            </button>
          </form>
          <div className="mt-3 text-[12px] text-[#1a1715]/45">
            Une fois par drop — désinscription en un clic
          </div>
        </div>

        {/* nav columns */}
        <div className="col-span-6 md:col-span-2 hl-r border-black/10 p-8 md:p-12">
          <div className="text-[12px] text-[#1a1715]/45 mb-4">Boutique</div>
          <ul className="space-y-2.5 text-[#1a1715]/70">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Drop 008</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Catégories</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Archives</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Cartes cadeau</a></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2 hl-r border-black/10 p-8 md:p-12">
          <div className="text-[12px] text-[#1a1715]/45 mb-4">Aide</div>
          <ul className="space-y-2.5 text-[#1a1715]/70">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Guide des tailles</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Livraison</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Retours</a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715]">Contact</a></li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-3 p-8 md:p-12">
          <div className="text-[12px] text-[#1a1715]/45 mb-4">Suivre</div>
          <ul className="space-y-2.5 text-[#1a1715]/70">
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Instagram</span><span className="text-[#1a1715]/35 tabular">@blb.store</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>TikTok</span><span className="text-[#1a1715]/35 tabular">@blb.fr</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Bandcamp</span><span className="text-[#1a1715]/35 tabular">blb.bandcamp</span></a></li>
            <li><a href="#" data-magnetic className="hover:text-[#1a1715] inline-flex justify-between w-full"><span>Discord</span><span className="text-[#1a1715]/35 tabular">/blb-radar</span></a></li>
          </ul>
        </div>
      </div>

      {/* wordmark */}
      <div className="px-6 md:px-12 py-12 hl-b border-black/10 flex items-baseline justify-between gap-6 flex-wrap">
        <div
          className="leading-none select-none font-medium"
          style={{
            fontFamily: 'var(--font-h)',
            fontSize: 'clamp(48px, 7vw, 96px)',
            letterSpacing: '-0.04em',
          }}
        >
          BLB
        </div>
        <div className="text-right text-[12px] text-[#1a1715]/55 max-w-xs">
          <div>Bloc Libre Bâtard</div>
          <div className="mt-1 text-[#1a1715]/45">Paris — depuis 2019</div>
        </div>
      </div>

      {/* legal */}
      <div className="px-6 md:px-12 py-5 flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#1a1715]/55">
        <div className="flex gap-5 flex-wrap">
          <span>© 2026 BLB SAS</span>
          <a href="#" className="hover:text-[#1a1715]" data-magnetic>CGV</a>
          <a href="#" className="hover:text-[#1a1715]" data-magnetic>Mentions légales</a>
          <a href="#" className="hover:text-[#1a1715]" data-magnetic>Cookies</a>
          <a href="#" className="hover:text-[#1a1715]" data-magnetic>Confidentialité</a>
        </div>
        <div className="flex gap-5">
          <span>Paiement sécurisé</span>
          <span className="text-[#1a1715]/40">Visa · Mastercard · Apple Pay · PayPal</span>
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
    sm: { num: 'text-[28px]', lbl: 'text-[10px]', gap: 'gap-4' },
    md: { num: 'text-[40px]', lbl: 'text-[11px]', gap: 'gap-5' },
    lg: { num: 'text-[56px] md:text-[72px]', lbl: 'text-[11px]', gap: 'gap-7' },
  }[size];
  const pad = (n) => String(n).padStart(2, '0');
  if (done) {
    return <div className="text-2xl font-medium" style={{ color: accent }}>Radar activé →</div>;
  }
  return (
    <div className={`flex items-baseline ${sizes.gap} tabular`}>
      {[
        { v: pad(d), l: 'jours' },
        { v: pad(h), l: 'h' },
        { v: pad(m), l: 'min' },
        { v: pad(s), l: 'sec' },
      ].map((u, i, arr) => (
        <div key={u.l} className="flex flex-col">
          <span className={`${sizes.num} leading-none font-medium`} style={{ letterSpacing: '-0.03em' }}>{u.v}</span>
          <span className={`${sizes.lbl} text-[#1a1715]/45 mt-2`}>{u.l}</span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  MagneticCursor, Grain, Header, CartDrawer, Ticker, Footer,
  Countdown, useCountdown,
});
