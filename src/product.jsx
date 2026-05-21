// BLB — Product detail page (minimalist cream)

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
      {/* breadcrumb */}
      <div className="hl-b border-black/10 px-6 md:px-12 py-4 flex items-center justify-between text-[12px] text-[#1a1715]/65">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="hover:text-[#1a1715] inline-flex items-center gap-2" data-magnetic>
            <span>←</span> Retour
          </button>
          <span className="text-[#1a1715]/25">/</span>
          <span>Boutique</span>
          <span className="text-[#1a1715]/25">/</span>
          <span className="text-[#1a1715] tabular">{product.ref}</span>
        </div>
        <div className="hidden md:block text-[12px] text-[#1a1715]/45 tabular">
          Stock — {product.stock === 'BAS' ? 'bas' : 'disponible'}
        </div>
      </div>

      <div className="grid grid-cols-12">
        {/* LEFT — image gallery */}
        <div className="col-span-12 lg:col-span-7 hl-r border-black/10">
          <div className="relative aspect-[5/6] bg-[#ECE8DD]">
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
            <div className="absolute top-4 right-4 text-[11px] text-[#1a1715]/70 bg-[#F2EFE7]/80 backdrop-blur-sm px-2 py-1 tabular">
              {String(activeImg + 1).padStart(2, '0')} / 03
            </div>
          </div>
          <div className="grid grid-cols-3 hl-t border-black/10">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`aspect-square relative transition-opacity ${activeImg === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                style={i < 2 ? { borderRight: '1px solid rgba(26,23,21,0.1)' } : undefined}
                data-magnetic
              >
                <image-slot
                  id={`pdp-${product.id}-${i}`}
                  shape="rect"
                  placeholder={`vue ${i + 1}`}
                  style={{ width: '100%', height: '100%' }}
                ></image-slot>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — product info */}
        <div className="col-span-12 lg:col-span-5 sticky top-[68px] self-start">
          <div className="p-8 md:p-12 hl-b border-black/10">
            <div className="flex items-center gap-2 mb-6">
              {product.tag && (
                <span className="text-[10px] tracking-wide px-2 py-1 bg-[#1a1715] text-[#F2EFE7] uppercase font-medium">{product.tag}</span>
              )}
              {product.explicit && (
                <span className="text-[10px] tracking-wide px-2 py-1 bg-[#F2EFE7] text-[#1a1715] uppercase font-medium border border-[#1a1715]/25">Explicit</span>
              )}
              <span className="text-[12px] text-[#1a1715]/45 ml-auto tabular">{product.ref}</span>
            </div>
            <h1 className="leading-[1.05] font-medium" style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(28px, 3vw, 44px)', letterSpacing: '-0.025em' }}>
              {product.name}
            </h1>
            <div className="text-[14px] text-[#1a1715]/65 mt-2">
              {product.sub}
            </div>
            <div className="mt-6 flex items-baseline justify-between hl-b border-black/10 pb-6">
              <div className="tabular font-medium" style={{ fontFamily: 'var(--font-h)', fontSize: '28px', letterSpacing: '-0.02em' }}>{product.price} €</div>
              <div className="text-[12px] text-[#1a1715]/55">TVA incluse · Livraison France offerte dès 80 €</div>
            </div>
          </div>

          {/* size selector */}
          <div className="p-8 md:p-12 hl-b border-black/10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[12px] text-[#1a1715]/55">Taille</div>
              <button className="text-[12px] text-[#1a1715]/55 hover:text-[#1a1715] underline-offset-2 hover:underline" data-magnetic>
                Guide des tailles →
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 text-[13px] transition-colors ${size === s ? 'bg-[#1a1715] text-[#F2EFE7]' : 'border border-[#1a1715]/15 hover:border-[#1a1715]/50'}`}
                  data-magnetic
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + add */}
          <div className="p-8 md:p-12 hl-b border-black/10">
            <div className="flex items-center gap-4 mb-5">
              <div className="text-[12px] text-[#1a1715]/55">Quantité</div>
              <div className="flex items-center border border-[#1a1715]/20">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 hover:bg-[#1a1715]/5" style={{ borderRight: '1px solid rgba(26,23,21,0.15)' }} data-magnetic>−</button>
                <span className="w-12 text-center tabular text-[13px]">{String(qty).padStart(2, '0')}</span>
                <button onClick={() => setQty(Math.min(8, qty + 1))} className="w-10 h-10 hover:bg-[#1a1715]/5" style={{ borderLeft: '1px solid rgba(26,23,21,0.15)' }} data-magnetic>+</button>
              </div>
            </div>
            <button onClick={submit} className="btn-primary w-full justify-center" data-magnetic>
              <span>{added ? '✓ Ajouté au panier' : `Ajouter — ${product.price * qty} €`}</span>
              <span>→</span>
            </button>
            <button onClick={onOpenCart} className="btn-ghost w-full justify-center mt-3" data-magnetic>
              <span>Voir le panier</span><span>→</span>
            </button>
          </div>

          {/* description + accordions */}
          <div className="p-8 md:p-12 space-y-5 text-[14px] text-[#1a1715]/75 leading-relaxed">
            <p>{product.desc}</p>
            <Accordion title="Détails techniques">
              <ul className="space-y-1.5 text-[#1a1715]/70 text-[13.5px]">
                <li>· Coton 240 g/m² ou molleton brossé</li>
                <li>· Sérigraphie 3 passages, encres écologiques</li>
                <li>· Confection France — atelier Mile-End</li>
                <li>· Étiquette tissée intérieure numérotée</li>
              </ul>
            </Accordion>
            <Accordion title="Livraison et retours">
              <p className="text-[#1a1715]/70 text-[13.5px]">Expédition sous 5 à 10 jours après la clôture du drop. Retours acceptés sous 14 jours, frais à la charge du client. Pas de retour sur les pressages vinyle ou cassette ouverts.</p>
            </Accordion>
            <Accordion title="Entretien">
              <p className="text-[#1a1715]/70 text-[13.5px]">Lavage à 30 °C sur l'envers, sans adoucissant. Séchage à plat. Ne pas repasser sur la sérigraphie.</p>
            </Accordion>
          </div>
        </div>
      </div>

      {/* related */}
      <div className="hl-t border-black/10">
        <SectionHeader
          eyebrow="Dans la même capsule"
          title="Aussi du Drop 008."
          accent={accent}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 hl-t border-black/10">
          {related.map((p, i) => (
            <ProductCardMini key={p.id} p={p} idx={i} onOpen={() => onBack && onBack()} last={i === 3} />
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
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-[14px] font-medium text-[#1a1715] hover:text-[#1a1715]/70" data-magnetic>
        <span>{title}</span>
        <span className="text-[#1a1715]/45 text-lg font-light" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform .25s' }}>+</span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? 400 : 0 }}>
        <div className="pt-3">{children}</div>
      </div>
    </div>
  );
}

function ProductCardMini({ p, idx, last }) {
  return (
    <div className="aspect-[4/5] relative bg-[#ECE8DD]"
      style={{ borderRight: !last ? '1px solid rgba(26,23,21,0.08)' : undefined }}>
      <image-slot id={`mini-${p.id}`} shape="rect" placeholder={p.ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}></image-slot>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#F2EFE7]/95 backdrop-blur-sm border-t border-[#1a1715]/10 flex items-end justify-between">
        <div className="min-w-0">
          <div className="text-[14px] font-medium truncate" style={{ fontFamily: 'var(--font-h)', letterSpacing: '-0.015em' }}>{p.name}</div>
          <div className="text-[11px] text-[#1a1715]/55 mt-0.5 tabular">{p.ref}</div>
        </div>
        <div className="tabular text-[14px] shrink-0 font-medium">{p.price} €</div>
      </div>
    </div>
  );
}

window.ProductPage = ProductPage;
