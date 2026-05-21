// BLB — root App

const { useState: useState_a, useEffect: useEffect_a, useMemo: useMemo_a } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "type": "mix",
  "accent": "#C0C0C0",
  "grid": "asym",
  "heroStyle": "editorial",
  "heroAuto": true,
  "grain": "subtle"
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = ['#C0C0C0', '#FFFFFF', '#9B1313'];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState_a('home');           // home | product | drop
  const [activeProduct, setActiveProduct] = useState_a(null);
  const [cart, setCart] = useState_a([]);
  const [cartOpen, setCartOpen] = useState_a(false);
  const [flashAdded, setFlashAdded] = useState_a(false);

  // Apply tweaks to document
  useEffect_a(() => {
    document.documentElement.dataset.type = t.type;
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.type, t.accent]);

  // Cart helpers
  const addItem = (p, size, qty = 1) => {
    setCart((c) => {
      const i = c.findIndex((it) => it.id === p.id && it.size === size);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...c, { id: p.id, ref: p.ref, name: p.name, sub: p.sub, price: p.price, size, qty }];
    });
    setFlashAdded(true);
    setTimeout(() => setFlashAdded(false), 1500);
  };
  const removeItem = (idx) => setCart((c) => c.filter((_, i) => i !== idx));

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Navigation
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };
  const goto = (target) => {
    if (target === 'home') { setView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (target === 'drops') { setView('drop'); window.scrollTo({ top: 0 }); return; }
    const scrollables = ['boutique', 'categories', 'archives', 'atelier', 'lookbook', 'faq'];
    if (scrollables.includes(target)) {
      if (view !== 'home') {
        setView('home');
        setTimeout(() => scrollToId(target), 80);
      } else {
        scrollToId(target);
      }
      return;
    }
  };

  const openProduct = (p) => {
    setActiveProduct(p);
    setView('product');
  };

  const D = window.BLB_DATA;

  return (
    <>
      <MagneticCursor />
      <Grain level={t.grain} />

      <Header
        onNavigate={goto}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        view={view}
      />

      {/* "added to cart" flash */}
      <div
        className="fixed top-[80px] right-6 z-[1200] font-mono text-[11px] tracking-[0.2em] uppercase px-4 py-3 bg-white text-black"
        style={{
          transform: `translateY(${flashAdded ? 0 : -20}px)`,
          opacity: flashAdded ? 1 : 0,
          transition: 'transform .25s, opacity .25s',
          pointerEvents: 'none',
        }}
      >
        ✓ AJOUTÉ AU PANIER
      </div>

      <main>
        {view === 'home' && (
          <>
            <HeroCarousel
              accent={t.accent}
              autoAdvance={t.heroAuto}
              slideStyle={t.heroStyle}
              onGoDrop={() => goto('drops')}
              onOpenProduct={openProduct}
              onGoArchives={() => scrollToId('archives')}
              onAddToRadar={() => goto('drops')}
            />
            <Ticker items={D.ticker} accent={t.accent} />
            <MerchGrid
              density={t.grid}
              products={D.products}
              accent={t.accent}
              onOpen={openProduct}
              onQuickAdd={(p, size) => addItem(p, size, 1)}
            />
            <Categories accent={t.accent} onShop={(id) => scrollToId('boutique')} />
            <Lookbook accent={t.accent} />
            <Archives accent={t.accent} />
            <Atelier accent={t.accent} />
            <FAQ accent={t.accent} />
          </>
        )}

        {view === 'product' && activeProduct && (
          <ProductPage
            product={activeProduct}
            products={D.products}
            onBack={() => { setView('home'); setTimeout(() => scrollToId('boutique'), 60); }}
            onAdd={addItem}
            onOpenCart={() => setCartOpen(true)}
            accent={t.accent}
          />
        )}

        {view === 'drop' && (
          <DropPage
            onBack={() => setView('home')}
            accent={t.accent}
            products={D.products}
            onAddToRadar={() => {
              const form = document.querySelector('input[type=email]');
              if (form) form.focus();
            }}
          />
        )}
      </main>

      <Footer onNavigate={goto} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onRemove={removeItem}
        onCheckout={() => alert('Démo — paiement non implémenté.')}
      />

      <TweaksPanel>
        <TweakSection label="Typographie" />
        <TweakRadio
          label="Système type"
          value={t.type}
          options={[
            { value: 'mono', label: 'Mono' },
            { value: 'serif', label: 'Serif' },
            { value: 'mix', label: 'Mix' },
          ]}
          onChange={(v) => setTweak('type', v)}
        />

        <TweakSection label="Accent" />
        <TweakColor
          label="Couleur d'accent"
          value={t.accent}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Hero (carousel)" />
        <TweakRadio
          label="Style des slides"
          value={t.heroStyle}
          options={[
            { value: 'editorial', label: 'Édito' },
            { value: 'cover', label: 'Cover' },
          ]}
          onChange={(v) => setTweak('heroStyle', v)}
        />
        <TweakToggle
          label="Auto-advance"
          value={t.heroAuto}
          onChange={(v) => setTweak('heroAuto', v)}
        />

        <TweakSection label="Grille merch" />
        <TweakRadio
          label="Densité"
          value={t.grid}
          options={[
            { value: '3', label: '3 col' },
            { value: '4', label: '4 col' },
            { value: 'asym', label: 'Asym' },
          ]}
          onChange={(v) => setTweak('grid', v)}
        />

        <TweakSection label="Atmosphère" />
        <TweakRadio
          label="Grain VHS"
          value={t.grain}
          options={[
            { value: 'off', label: 'Off' },
            { value: 'subtle', label: 'Subtil' },
            { value: 'strong', label: 'Fort' },
          ]}
          onChange={(v) => setTweak('grain', v)}
        />

        <TweakSection label="Navigation" />
        <TweakButton label="Voir la home" onClick={() => setView('home')} />
        <TweakButton label="Voir le drop teaser" onClick={() => setView('drop')} />
        <TweakButton label="Voir une page produit" onClick={() => openProduct(D.products[0])} />
        <TweakButton label="Ouvrir le panier" onClick={() => setCartOpen(true)} />
      </TweaksPanel>
    </>
  );
}

window.App = App;
