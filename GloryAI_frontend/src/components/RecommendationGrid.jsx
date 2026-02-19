const imageModules = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const imageMap = Object.fromEntries(
  Object.entries(imageModules).map(([path, src]) => [path.split("/").pop(), src]),
);

function formatPrice(price) {
  if (typeof price === "number" && Number.isFinite(price)) {
    return `$${price.toFixed(2)}`;
  }

  const parsed = Number(price);
  if (typeof price === "string" && Number.isFinite(parsed)) {
    return `$${parsed.toFixed(2)}`;
  }

  return price || "-";
}

function ProductCard({ item }) {
  const imageSrc = imageMap[item.imageFile] || "";

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-white/45 bg-white/55 p-3">
      <div className="h-48 w-full overflow-hidden rounded-lg bg-zinc-100">
        {imageSrc ? (
          <img className="h-full w-full object-contain" src={imageSrc} alt={item.name} loading="lazy" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-zinc-400">No image</div>
        )}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-zinc-900 break-words whitespace-normal">{item.name}</h4>
        <p className="mt-1 text-xs text-zinc-500 break-words whitespace-normal">{item.brand}</p>
        <p className="text-sm font-medium text-zinc-900">{formatPrice(item.price)}</p>
      </div>
    </article>
  );
}

export default function RecommendationGrid({ title, items }) {
  const displayItems = Array.isArray(items) && items.length > 0 ? items.slice(0, 3) : [];

  return (
    <section className="flex flex-col items-center justify-center rounded-xl border border-white/35 bg-white/25 px-6 py-6 backdrop-blur-sm">
      <div className="flex w-full flex-col">
        <div className="mb-2 flex w-full justify-center">
          <h3 className="text-center text-lg text-zinc-500">{title}</h3>
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          {displayItems.map((item) => (
            <ProductCard key={`${title}-${item.name}`} item={item} />
          ))}
          {!displayItems.length ? <p className="text-sm text-zinc-500">No recommendation data.</p> : null}
        </div>
      </div>
    </section>
  );
}
