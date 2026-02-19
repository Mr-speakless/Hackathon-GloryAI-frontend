function ProductCard({ item }) {
  return (
    <article className="min-h-[112px] rounded-xl border border-white/45 bg-white/65 p-2.5 shadow-sm backdrop-blur-sm">
      <h4 className="text-xl leading-tight text-zinc-700 md:text-2xl">{item.name}</h4>
    </article>
  );
}

export default function RecommendationGrid({ title, items }) {
  const displayItems = Array.isArray(items) && items.length > 0 ? items.slice(0, 3) : [];

  return (
    <section className="rounded-xl border border-white/35 bg-white/25 px-4 py-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-lg text-zinc-500">{title}</h3>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {displayItems.map((item) => (
          <ProductCard key={`${title}-${item.name}`} item={item} />
        ))}
        {!displayItems.length ? <p className="text-sm text-zinc-500">No recommendation data.</p> : null}
      </div>
    </section>
  );
}
