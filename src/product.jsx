// BLB — Product detail page

const { useState: useState_p, useEffect: useEffect_p } = React;

function ProductPage({ product, products, onBack, onAdd, onOpenCart, accent }) {
  const [size, setSize] = useState_p(product.sizes[0]);
  const [qty, setQty] = useState_p(1);
  const [activeImg, setActiveImg] = useState_p(0);
  const [added, setAdded] = useState_p(false);
  useEffect_p(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSize(product.sizes[0]);
    setQty(1);
    setActiveImg(0);
  }, [product.id]);

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  const submit = () => {
    onAdd(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pt-[68px]">
      {/* breadcrumb / back */}
      <div className="hl-b border-black/10 px-6 md:px-10 py-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:text-[#1a1715] inline-flex items-center gap-2" data-magnetic>
            <span>←</span> RETOUR BOUTIQUE
          </button>
          <span className="text-[#1a1715]/20">/</span>
          <span>BOUTIQUE</span>
          <span className="text-[#1a1715]/20">/</span>
          <span style={{ color: accent }}>{product.ref}</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>{product.tag || 'STANDARD'}</span>
          <span className="tabular">STOCK · {product.stock}</span>
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* LEFT — image gallery */}
        <div className="col-span-12 lg:col-span-7 hl-r border-black/10">
          <div className="relative aspect-[5/6]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: activeImg === i ? 1 : 0, pointerEvents: activeImg === i ? 'auto' : 'none' }}>
                <image-slot
                  id={`pdp-${product.id}-${i}`}
                  shape="rect"
                  placeholder={`${product.ref} · vue ${i + 1}`}
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
              </div>
            ))}
            {/* image index */}
            <div className="absolute top-4 right-4 font-mono text-[10px] tracking-[0.2em] text-[#1a1715]/70 bg-[#1a1715]/40 px-2 py-1 hl-white-strong tabular">
              {String(activeImg + 1).padStart(2, '0')} / 03
            </div>
          </div>
          {/* thumbs */}
          <div className="grid grid-cols-3 hl-t border-black/10">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square relative hl-r border-black/10 last:border-r-0 transition-opacity ${activeImg === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                data-magnetic
              >
                <image-slot
                  id={`pdp-${product.id}-${i}`}
                  shape="rect"
                  placeholder={`vue ${i + 1}`}
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
                {activeImg === i && (
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — product info */}
        <div className="col-span-12 lg:col-span-5 sticky top-[68px] self-start">
          <div className="p-6 md:p-10 hl-b border-black/10">
            <div className="flex items-center gap-2 mb-6">
              {product.tag && (
                <span className="font-mono text-[9px] tracking-[0.18em] px-2 py-1 bg-[#1a1715] text-[#F2EFE7] uppercase">
                  {product.tag}
                </span>
              )}
              {product.explicit && <span className="explicit-badge">EXPLICIT</span>}
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/40 ml-auto">{product.ref}</span>
            </div>
            <h1 className="font-display leading-[0.92]" style={{ fontWeight: 900, fontSize: 'clamp(40px, 4.4vw, 68px)', letterSpacing: '-0.04em' }}>
              {product.name}
            </h1>
            <div className="font-mono text-[12px] tracking-[0.04em] uppercase text-[#1a1715]/55 mt-3">
              {product.sub}
            </div>
            <div className="mt-6 flex items-baseline justify-between hl-b border-black/10 pb-6">
              <div className="font-display tabular" style={{ fontWeight: 900, fontSize: '40px' }}>{product.price}€</div>
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/40">TVA INCLUSE · LIV. INCLUSE FR</div>
            </div>
          </div>

          {/* size selector */}
          <div className="p-6 md:p-10 hl-b border-black/10">
            <div className="flex items-center justify-between mb-4">
              <div className="font-eyebrow text-[#1a1715]/50">TAILLE</div>
              <button className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1a1715]/40 hover:text-[#1a1715]" data-magnetic>
                GUIDE DES TAILLES ↗
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 font-mono text-[12px] tracking-[0.15em] transition-colors ${size === s ? 'bg-[#1a1715] text-[#F2EFE7] border border-black' : 'border border-black/15 hover:border-black/50'}`}
                  data-magnetic
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + add */}
          <div className="p-6 md:p-10 hl-b border-black/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="font-eyebrow text-[#1a1715]/50">QUANTITÉ</div>
              <div className="flex items-center hl-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hl-r border-black/15 font-mono hover:bg-[#1a1715]/5" data-magnetic>−</button>
                <span className="w-12 text-center font-mono tabular">{String(qty).padStart(2, '0')}</span>
                <button onClick={() => setQty(Math.min(8, qty + 1))} className="w-10 h-10 hl-l border-black/15 font-mono hover:bg-[#1a1715]/5" data-magnetic>+</button>
              </div>
            </div>
            <button onClick={submit} className="btn-primary w-full justify-center" data-magnetic>
              <span>{added ? '✓ AJOUTÉ AU PANIER' : `AJOUTER · ${product.price * qty}€`}</span>
              <span>→</span>
            </button>
            <button onClick={onOpenCart} className="btn-ghost w-full justify-center mt-3" data-magnetic>
              <span>VOIR LE PANIER</span><span>→</span>
            </button>
          </div>

          {/* description + accordion */}
          <div className="p-6 md:p-10 space-y-5 font-mono text-[12px] text-[#1a1715]/70 leading-relaxed">
            <p>{product.desc}</p>
            <Accordion title="DÉTAILS TECHNIQUES">
              <ul className="space-y-1.5 text-[#1a1715]/60">
                <li>· Coton 240gsm / molleton brossé</li>
                <li>· Sérigraphie 3 passages — encres écologiques</li>
                <li>· Confection France · atelier Mile-End</li>
                <li>· Étiquette tissée intérieure numérotée</li>
              </ul>
            </Accordion>
            <Accordion title="LIVRAISON & RETOURS">
              <p className="text-[#1a1715]/60">Expédition sous 5–10 jours après clôture du drop. Retours acceptés sous 14 jours, frais à la charge du client. Une fois la transmission terminée, les invendus partent au pilon.</p>
            </Accordion>
            <Accordion title="ENTRETIEN">
              <p className="text-[#1a1715]/60">Lavage 30°C envers, sans adoucissant. Séchage à plat. Ne pas repasser sur la sérigraphie.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="hl-t border-black/10">
        <SectionHeader
          index="—"
          eyebrow="DANS LA MÊME CAPSULE"
          title="AUSSI DU DROP 008."
          accent={accent}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 hl-t border-black/10">
          {related.map((p, i) => (
            <ProductCardMini key={p.id} p={p} idx={i} onOpen={() => onAdd && onBack && onBack()} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState_p(false);
  return (
    <div className="hl-t border-black/10 pt-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase text-[#1a1715] hover:text-[#1a1715]/80" data-magnetic>
        <span>{title}</span>
        <span className="text-[#1a1715]/50">{open ? '−' : '+'}</span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 400 : 0 }}>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}

function ProductCardMini({ p, idx }) {
  return (
    <div className="aspect-[4/5] product-card relative hl-r hl-b border-black/10">
      <image-slot id={`mini-${p.id}`} shape="rect" placeholder={p.ref} class="pc-img-a" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      <div className="absolute bottom-0 left-0 right-0 p-4 hl-t border-black/10 bg-[#1a1715]/40 backdrop-blur-sm flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#1a1715]/50">{p.ref}</div>
          <div className="font-display text-lg leading-tight mt-1">{p.name}</div>
        </div>
        <div className="font-mono tabular text-sm">{p.price}€</div>
      </div>
    </div>
  );
}

window.ProductPage = ProductPage;
