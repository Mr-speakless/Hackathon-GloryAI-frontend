function toNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function midpoint(item) {
  return (item.scoreMin + item.scoreMax) / 2;
}

function rangeWidth(item) {
  return item.scoreMax - item.scoreMin;
}

function boundaryDistance(score, item) {
  if (score < item.scoreMin) return item.scoreMin - score;
  if (score > item.scoreMax) return score - item.scoreMax;
  return 0;
}

export function getTopRecommendations(overallScore, db, limit = 3) {
  const products = Array.isArray(db) ? db : [];
  if (!products.length) return [];

  const score = toNumber(overallScore);
  if (score === null) {
    return products.slice(0, limit);
  }

  const inRange = products.filter((item) => score >= item.scoreMin && score <= item.scoreMax);
  const outOfRange = products.filter((item) => score < item.scoreMin || score > item.scoreMax);

  inRange.sort((a, b) => {
    const widthDiff = rangeWidth(a) - rangeWidth(b);
    if (widthDiff !== 0) return widthDiff;
    return Math.abs(score - midpoint(a)) - Math.abs(score - midpoint(b));
  });

  outOfRange.sort((a, b) => boundaryDistance(score, a) - boundaryDistance(score, b));

  const picked = [];
  const seen = new Set();
  for (const item of [...inRange, ...outOfRange]) {
    if (seen.has(item.name)) continue;
    picked.push(item);
    seen.add(item.name);
    if (picked.length >= limit) break;
  }
  return picked;
}
