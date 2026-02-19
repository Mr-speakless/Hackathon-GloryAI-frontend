const ISSUE_LABELS = {
  wrinkle: "wrinkle",
  acne: "acne",
  moisture: "moisture",
  oiliness: "oiliness",
  redness: "redness",
  pore: "pore",
  texture: "texture",
  radiance: "radiance",
  age_spot: "age spot",
  dark_circle_v2: "dark circle",
  eye_bag: "eye bag",
  firmness: "firmness",
  droopy_upper_eyelid: "upper eyelid laxity",
  droopy_lower_eyelid: "lowerlower eyelid laxity",
};

// Candidate list for report cards: keep only metrics that have dedicated visual icons.
const CORE_METRICS = ["wrinkle", "acne", "pore", "moisture", "oiliness", "redness", "dark_circle_v2"];
// 根据严重程度得分转换为风险等级
function toRiskLevel(severity) {
  if (severity >= 25) return "High";
  if (severity >= 20) return "Medium";
  return "Low";
}
// 根据油脂和含水量得分推断皮肤类型
function inferSkinType(oilinessScore, moistureScore) {
  const lowOil = oilinessScore < 65;
  const lowMoisture = moistureScore < 65;

  if (lowOil && lowMoisture) return "混合偏油";
  if (lowOil && !lowMoisture) return "油性";
  if (!lowOil && lowMoisture) return "偏干";
  return "中性";
}
// 构建皮肤分析报告
export function buildReport(rawData) {
  const analysis = rawData.skin_analysis ?? {};
  const isDev = typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV);

  if (isDev) {
    const diagnostics = CORE_METRICS.map((key) => {
      const score = analysis?.[key]?.ui_score;
      return {
        key,
        hasMetric: Object.prototype.hasOwnProperty.call(analysis, key),
        uiScore: score,
        isValidNumber: typeof score === "number" && Number.isFinite(score),
      };
    });

    const invalidKeys = diagnostics.filter((item) => !item.isValidNumber).map((item) => item.key);
    if (invalidKeys.length) {
      console.warn("[skinAnalysis] Invalid or missing metric ui_score detected", {
        invalidKeys,
        diagnostics,
        availableKeys: Object.keys(analysis),
      });
    } else {
      console.info("[skinAnalysis] All CORE_METRICS have valid numeric ui_score", {
        keys: CORE_METRICS,
      });
    }
  }

  const entries = Object.entries(analysis).filter(([key, value]) => {
    return typeof value?.ui_score === "number";
  });

  const issues = entries
    .map(([key, value]) => {
      const severity = 100 - value.ui_score;
      return {
        key,
        label: ISSUE_LABELS[key] ?? key,
        score: value.ui_score,
        severity,
        risk: toRiskLevel(severity),
      };
    })
    .sort((a, b) => b.severity - a.severity);

  const topIssues = issues.slice(0, 3);
  const focusMetrics = CORE_METRICS.map((key) => {
    const score = analysis?.[key]?.ui_score;
    if (typeof score !== "number") {
      return {
        key,
        label: ISSUE_LABELS[key] ?? key,
        score: "-",
        risk: "-",
        severity: null,
      };
    }

    const severity = 100 - score;
    return {
      key,
      label: ISSUE_LABELS[key] ?? key,
      score,
      risk: toRiskLevel(severity),
      severity,
    };
  });

  const oilinessScore = analysis.oiliness?.ui_score ?? 70;
  const moistureScore = analysis.moisture?.ui_score ?? 70;

  const overall = rawData?.all?.score;
  const overallScore = typeof overall === "number" ? Math.round(overall) : "-";
  const skinAge = typeof rawData?.skin_age === "number" ? rawData.skin_age : "-";

  const summaryTargets =
    topIssues.length > 0 ? topIssues.map((item) => item.label).join("、") : "细纹、毛孔、纹理与痘痘";

  return {
    summary: `Your overall skin is perfect.
While your moisture levels are excellent at 85%, our AI analysis has detected moderate concerns regarding pore texture and surface spots. To restore your natural glow, focus on targeted refinement and barrier protection.[测试版] 你的皮肤整体状态稳定，当前优先关注${summaryTargets}。建议先做基础护理，再逐步增加功能型产品。`,
    skinType: inferSkinType(oilinessScore, moistureScore),
    skinAge,
    overallScore,
    topIssues,
    focusMetrics,
  };
}
