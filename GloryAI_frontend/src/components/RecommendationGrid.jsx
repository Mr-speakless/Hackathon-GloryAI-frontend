function ProductCard({ item }) {
  return (
    <article className="min-h-[112px] rounded-xl border border-white/45 bg-white/65 p-2.5 shadow-sm backdrop-blur-sm">
      <div className="flex items-start gap-2.5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-zinc-200 text-[11px] text-zinc-600">图片</div>
        <div className="min-w-0">
          <h4 className="text-xl leading-tight text-zinc-700 md:text-2xl">{item.name}</h4>
          <p className="text-sm leading-tight text-zinc-500">{item.brand}</p>
          <p className="mt-1 line-clamp-3 text-xs leading-tight text-zinc-500">{item.description}</p>
        </div>
      </div>
    </article>
  );
}

export default function RecommendationGrid({ title, items }) {
  const hasBackendItems = Array.isArray(items) && items.length > 0;
  const fallbackItems = [
    { name: "Moisturize", brand: "GLory.AI Picks", description: "Hydrate\nRestore\nFirm" },
    { name: "Restore", brand: "GLory.AI Picks", description: "Hydrate\nRestore\nFirm" },
    { name: "Protect", brand: "GLory.AI Picks", description: "Hydrate\nRestore\nFirm" },
  ];
  const displayItems = (hasBackendItems ? items : fallbackItems).slice(0, 3);

  return (
    <section className="rounded-xl border border-white/35 bg-white/25 px-4 py-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-lg text-zinc-500">{title}</h3>
        {!hasBackendItems ? <span className="text-[10px] text-zinc-500/70">static fallback</span> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {displayItems.map((item) => (
          <ProductCard key={`${title}-${item.name}`} item={item} />
        ))}
      </div>
    </section>
  );
}
