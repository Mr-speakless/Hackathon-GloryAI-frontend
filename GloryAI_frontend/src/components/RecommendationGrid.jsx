function ProductCard({ item }) {
  return (
    <article className="min-h-[112px] rounded-lg bg-zinc-200 p-2.5">
      <div className="grid h-9 w-12 place-items-center rounded-md bg-zinc-300 text-[10px]">图片</div>
      <h4 className="mt-1 text-lg leading-tight">{item.name}</h4>
      <p className="text-xs leading-tight">{item.brand}</p>
      <p className="line-clamp-2 text-xs leading-tight">{item.description}</p>
    </article>
  );
}

export default function RecommendationGrid({ title, items }) {
  return (
    <section className="rounded-xl bg-zinc-300 px-4 py-3">
      <h3 className="mb-2 text-2xl">{title}</h3>
      <div className="grid gap-2 md:grid-cols-3">
        {items.slice(0, 3).map((item) => (
          <ProductCard key={`${title}-${item.name}`} item={item} />
        ))}
      </div>
    </section>
  );
}
