function ProductCard({ item }) {
  return (
    <article className="min-h-[112px] rounded-lg border border-zinc-300 bg-zinc-200 p-2.5">
      <div className="grid h-9 w-12 place-items-center rounded-md bg-zinc-300 text-[10px]">图片</div>
      <h4 className="mt-1 text-lg leading-tight">{item.name}</h4>
      <p className="text-xs leading-tight">{item.brand}</p>
      <p className="line-clamp-2 text-xs leading-tight">{item.description}</p>
    </article>
  );
}

export default function RecommendationGrid({ title, items }) {
  const hasBackendItems = Array.isArray(items) && items.length > 0;
  const fallbackItems = [
    { name: "基础洁面", brand: "GLory.AI Picks", description: "后端推荐未接入时展示的静态占位建议。" },
    { name: "修护保湿", brand: "GLory.AI Picks", description: "优先稳定屏障与补水，避免过度叠加功效。" },
    { name: "日间防晒", brand: "GLory.AI Picks", description: "白天防晒作为基础护理默认项。" },
  ];
  const displayItems = (hasBackendItems ? items : fallbackItems).slice(0, 3);

  return (
    <section className="rounded-xl bg-zinc-300 px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-2xl">{title}</h3>
        {!hasBackendItems ? <span className="text-xs text-zinc-600">静态占位推荐</span> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {displayItems.map((item) => (
          <ProductCard key={`${title}-${item.name}`} item={item} />
        ))}
      </div>
    </section>
  );
}
