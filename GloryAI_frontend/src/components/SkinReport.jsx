import skinReportTitleIcon from "../assets/icons/SkinReportIcon.svg";

function riskTone(risk) {
  if (risk === "低") {
    return {
      border: "border-emerald-300",
      text: "text-emerald-700",
      bg: "bg-emerald-100/70",
    };
  }

  if (risk === "中") {
    return {
      border: "border-amber-300",
      text: "text-amber-700",
      bg: "bg-amber-100/75",
    };
  }

  return {
    border: "border-orange-300",
    text: "text-orange-700",
    bg: "bg-orange-100/75",
  };
}

function GaugeCard({ score }) {
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0;
  const degree = Math.round((safeScore / 100) * 180);

  return (
    <article className="rounded-2xl bg-white/78 p-2.5 shadow-sm">
      <p className="text-center text-[11px] text-zinc-500">Overall Score</p>
      <div className="relative mx-auto mt-1 h-24 w-44 overflow-hidden">
        <div
          className="absolute left-1/2 top-full h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: `conic-gradient(from 180deg, #b2a4f0 0deg ${degree}deg, #d9d8e2 ${degree}deg 180deg, transparent 180deg 360deg)`,
          }}
          aria-hidden="true"
        />
        <div className="absolute left-1/2 top-full h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-4xl font-semibold text-zinc-700">{safeScore}</p>
          <p className="text-[11px] text-zinc-500">Health Skin</p>
        </div>
      </div>
      <div className="-mt-1 flex items-center justify-between px-3 text-[10px] text-zinc-500">
        <span>0</span>
        <span>100</span>
      </div>
    </article>
  );
}

function MetricPill({ label, value, risk }) {
  const tone = riskTone(risk);

  return (
    <article className={`flex items-center justify-between rounded-xl border px-3 py-2 ${tone.border} ${tone.bg}`}>
      <span className="text-sm text-zinc-600">{label}</span>
      <span className={`text-sm font-semibold ${tone.text}`}>{value}</span>
    </article>
  );
}

function fillToThree(items) {
  const filled = [...items];
  while (filled.length < 3) {
    filled.push({ label: "-", value: "-", risk: "中" });
  }
  return filled.slice(0, 3);
}

export default function SkinReport({ report }) {
  const focusMetrics = Array.isArray(report.focusMetrics) ? report.focusMetrics : [];
  const topIssues = Array.isArray(report.topIssues) ? report.topIssues : [];

  const statusLine = fillToThree(
    focusMetrics.map((metric) => ({
      label: metric.label,
      value: metric.risk === "低" ? "Normal" : metric.risk === "中" ? "Medium" : "High",
      risk: metric.risk,
    })),
  );

  const issueLine = fillToThree(
    topIssues.map((issue) => ({
      label: issue.label,
      value: issue.risk,
      risk: issue.risk,
    })),
  );

  return (
    <section className="rounded-2xl border border-white/45 bg-violet-100/42 px-4 py-3 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <img src={skinReportTitleIcon} alt="Skin Report" className="h-6 w-6" />
        <h2 className="text-4xl font-semibold text-zinc-700 md:text-5xl">Skin Report</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-[190px_1fr]">
        <GaugeCard score={report.overallScore} />

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/75 px-3 py-1 text-[11px] text-zinc-500">Skin Age: {report.skinAge}</span>
            <p className="text-sm leading-relaxed text-zinc-500">{report.summary}</p>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            {statusLine.map((item, index) => (
              <MetricPill key={`status-${item.label}-${index}`} label={item.label} value={item.value} risk={item.risk} />
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            {issueLine.map((item, index) => (
              <MetricPill key={`issue-${item.label}-${index}`} label={item.label} value={item.value} risk={item.risk} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
