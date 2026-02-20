import { useState } from "react";
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
      accentBorder: "border-lime-500",
      accentText: "text-lime-500",
      iconFilter: "brightness(0) saturate(100%) invert(67%) sepia(63%) saturate(507%) hue-rotate(55deg) brightness(97%) contrast(88%)",
    };
  }

  if (risk === "Medium" || risk === "High") {
    return {
      accentBorder: "border-orange-400",
      accentText: "text-orange-500",
      iconFilter: "brightness(0) saturate(100%) invert(61%) sepia(59%) saturate(2942%) hue-rotate(348deg) brightness(103%) contrast(101%)",
    };
  }

  return {
    accentBorder: "border-white/50",
    accentText: "text-zinc-500",
    iconFilter: "grayscale(100%)",
  };
}

function GaugeCard({ score }) {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;

  return (
    <article className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/78 px-10 py-8 shadow-sm">
      <div className="text-[11px] text-zinc-500">Overall Score</div>
      <div className="text-6xl font-semibold text-green-500">{safeScore}</div>
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
  const [isHovering, setIsHovering] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const borderClass = isPressing ? tone.accentBorder : "border-white/55";
  const backgroundClass = isPressing ? "bg-white/72" : "bg-white/35";
  const valueClass = isHovering || isPressing ? tone.accentText : "text-zinc-400";
  const labelClass = isHovering || isPressing ? tone.accentText : "text-zinc-500";
  const iconStyle = isHovering || isPressing
    ? { filter: tone.iconFilter }
    : { filter: "grayscale(100%) brightness(0.65)", opacity: 0.7 };

  return (
    <button
      type="button"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPressing(false);
      }}
      onMouseDown={() => setIsPressing(true)}
      onMouseUp={() => setIsPressing(false)}
      onBlur={() => setIsPressing(false)}
      className={`flex w-full items-center gap-3 rounded-[32px] border px-4 py-2 text-left transition ${borderClass} ${backgroundClass} ${
        isPressing ? "shadow-[0_6px_18px_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <div className="grid h-6 w-6 shrink-0 place-items-center">
        {iconSrc ? <img src={iconSrc} alt={label} className="h-6 w-6" style={iconStyle} /> : null}
      </div>
      <p className={`text-lg font-semibold leading-tight transition-colors ${labelClass}`}>
        {label}: <span className={valueClass}>{value}</span>
      </p>
    </button>
  );
}

export default function SkinReport({ report }) {
  const metricKeys = Object.keys(CARD_ICONS);
  const focusMetrics = Array.isArray(report.focusMetrics)
    ? report.focusMetrics.filter((metric) => metricKeys.includes(metric?.key))
    : [];
  const { bestLine, worstLine } = splitBestWorst(focusMetrics);

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-white/45 bg-violet-100/42 px-6 py-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <img src={skinReportTitleIcon} alt="Skin Report" className="h-6 w-6" />
        <h2 className="text-xl font-semibold text-zinc-700 md:text-2xl">Skin Report</h2>
      </div>

      <div className="flex flex-row gap-3 md:gap-6">
        <div className="flex flex-col gap-3">
          <span className="rounded-full bg-white/75 px-3 py-1 text-[11px] text-zinc-500">Skin Age: {report.skinAge}</span>
          <GaugeCard score={report.overallScore} />
        </div>

        <div className="space-y-2">
          <div className="custom-scroll h-18 overflow-y-auto pr-2">
            <p className="text-sm leading-relaxed text-zinc-500">{report.summary}</p>
          </div>

          <div className="flex flex-col gap-2 py-3">
            <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
              {bestLine.map((item, index) => {
                const cardId = `best-${item.key}-${index}`;
                return <MetricPill key={cardId} item={item} />;
              })}
            </div>

            {worstLine.length ? (
              <div className="flex flex-col gap-3 md:grid md:grid-cols-2">
                {worstLine.map((item, index) => {
                  const cardId = `worst-${item.key}-${index}`;
                  return <MetricPill key={cardId} item={item} />;
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
