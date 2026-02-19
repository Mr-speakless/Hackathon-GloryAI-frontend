function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function getTopRecommendations(overallScore, db, limit = 3) {
  const products = Array.isArray(db) ? db : [];
  if (!products.length) return [];

  const safeLimit = typeof limit === "number" && limit > 0 ? Math.floor(limit) : 3;
  const score = toNumber(overallScore);

  if (score === null) {
    return products.slice(0, safeLimit);
  }

  const bucket = score >= 80 ? ">80" : "<80";
  const preferred = products.filter((item) => item?.scoreRule === bucket);

  if (preferred.length) {
    return preferred.slice(0, safeLimit);
  }

  return products.slice(0, safeLimit);
}
