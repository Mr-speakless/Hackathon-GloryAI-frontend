import skinReportTitleIcon from "../assets/icons/SkinReportIcon.svg";
import wrinkleIcon from "../assets/icons/Wrinkle.svg";
import acneIcon from "../assets/icons/Acne.svg";
import poresIcon from "../assets/icons/Pores.svg";
import moistureIcon from "../assets/icons/Moisture.svg";
import oilinessIcon from "../assets/icons/Oilness.svg";
import rednessIcon from "../assets/icons/Redness.svg";
import darkCircleIcon from "../assets/icons/DarkCircle.svg";

function riskTone(risk) {
  if (risk === "Low") {
    return {
      border: "border-white/55",
      text: "text-lime-500",
      bg: "bg-white/35",
    };
  }

  if (risk === "Medium" || risk === "High") {
    return {
      border: "border-orange-400",
      text: "text-orange-500",
      bg: "bg-white/30",
    };
  }

  return {
    border: "border-white/50",
    text: "text-zinc-500",
    bg: "bg-white/30",
  };
}

function GaugeCard({ score }) {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;

  return (
    <article className="rounded-2xl bg-white/78 px-10 py-8 shadow-sm items-center justify-center flex flex-col  gap-2">
      <div className="text-[11px] text-zinc-500">Overall Score</div>
      <div className="text-green-500 text-6xl font-semibold ">{safeScore}</div>
      
    </article>
  );
}

const CARD_LABELS = {
  wrinkle: "Wrinkle",
  acne: "Acne",
  pore: "Pores",
  moisture: "Moisture",
  oiliness: "Oiliness",
  redness: "Redness",
  dark_circle_v2: "Dark Circle",
};

const CARD_ICONS = {
  wrinkle: wrinkleIcon,
  acne: acneIcon,
  pore: poresIcon,
  moisture: moistureIcon,
  oiliness: oilinessIcon,
  redness: rednessIcon,
  dark_circle_v2: darkCircleIcon,
};

function toRiskText(key, risk) {
  if (risk === "Low") {
    return key === "acne" ? "Good" : "Low Risk";
  }
  if (risk === "Medium") return "Medium Risk";
  if (risk === "High") return "High Risk";
  return "-";
}

function toCardMetric(metric) {
  return {
    key: metric.key,
    label: CARD_LABELS[metric.key] ?? metric.label ?? "-",
    risk: metric.risk ?? "-",
    value: toRiskText(metric.key, metric.risk),
    severity: typeof metric.severity === "number" ? metric.severity : null,
  };
}

function splitBestWorst(focusMetrics) {
  const pool = focusMetrics
    .filter((metric) => typeof metric?.severity === "number")
    .map((metric) => toCardMetric(metric));

  if (!pool.length) {
    return { bestLine: [], worstLine: [] };
  }

  const asc = [...pool].sort((a, b) => a.severity - b.severity);
  const desc = [...pool].sort((a, b) => b.severity - a.severity);
  const best = asc.slice(0, Math.min(2, asc.length));
  const worst = desc.slice(0, Math.min(2, desc.length));

  if (pool.length < 4) {
    const seen = new Set();
    const merged = [];

    for (const item of [...best, ...worst]) {
      if (seen.has(item.key)) continue;
      seen.add(item.key);
      merged.push(item);
    }

    return {
      bestLine: merged.slice(0, 2),
      worstLine: merged.slice(2),
    };
  }

  return {
    bestLine: best,
    worstLine: worst,
  };
}

function MetricPill({ item }) {
  const { label, value, risk, key } = item;
  const tone = riskTone(risk);
  const iconSrc = CARD_ICONS[key];

  return (
    <article className={`flex items-center gap-3 rounded-[32px] border px-4 py-2 ${tone.border} ${tone.bg}`}>
      <div className="grid h-6 w-6 shrink-0 place-items-center">
        {iconSrc ? <img src={iconSrc} alt={label} className="h-6 w-6 opacity-70" /> : null}
      </div>
      <p className="text-lg font-semibold leading-tight text-zinc-500">
        {label}: <span className={tone.text}>{value}</span>
      </p>
    </article>
  );
}

export default function SkinReport({ report }) {
  const metricKeys = Object.keys(CARD_ICONS);
  const focusMetrics = Array.isArray(report.focusMetrics)
    ? report.focusMetrics.filter((metric) => metricKeys.includes(metric?.key))
    : [];
  const { bestLine, worstLine } = splitBestWorst(focusMetrics);

  return (
    // 大外框
    <section className="flex flex-col rounded-2xl border border-white/45 bg-violet-100/42 py-4 px-6 gap-4 backdrop-blur-sm">
      {/* Icon + 文字 */}
      <div className="mb-2 flex items-center gap-2">
        <img src={skinReportTitleIcon} alt="Skin Report" className="h-6 w-6" />
        <h2 className="text-xl font-semibold text-zinc-700 md:text-2xl">Skin Report</h2>
      </div>
      {/* 主体内容 */}
      <div className="flex flex-row gap-3 md:gap-6">
        {/* 左侧卡片 */}
        <div className="flex flex-col gap-3">
          <span className="rounded-full bg-white/75 px-3 py-1 text-[11px] text-zinc-500">Skin Age: {report.skinAge}</span>
          <GaugeCard score={report.overallScore} />
        </div>
        {/* 右侧卡片 */}
        <div className="space-y-2">
          {/* 字段的div */}
          <div className="h-18 overflow-y-auto pr-2 custom-scroll">
            {/* 这里的字段回头随机再做 */}
            <p className="text-sm leading-relaxed text-zinc-500">{report.summary}</p>
          </div>
          {/* 卡片的div */}
          <div className="flex flex-col gap-2 py-3">
          <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
            {/* 这里显示 用户表现最好的的两个指标 并配上对应的icon icon我更新在了assests中 */}
            {bestLine.map((item, index) => (
              <MetricPill key={`status-${item.key}-${index}`} item={item} />
            ))}
          </div>
            {/* 这里显示 用户表现最差的两个指标 并配上对应的icon icon我更新在了assests中*/}
          {worstLine.length ? (
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
              {worstLine.map((item, index) => (
                <MetricPill key={`issue-${item.key}-${index}`} item={item} />
              ))}
            </div>
          ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
