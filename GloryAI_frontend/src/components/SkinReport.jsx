export default function SkinReport({ report }) {
  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";
  const focusMetrics = report.focusMetrics ?? [];

  return (
    <section className="rounded-xl bg-white/35 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-3xl font-semibold text-zinc-700">Skin Report</h2>
        <button type="button" className={`rounded-lg bg-white/80 px-2.5 py-1.5 text-xs ${interactiveClass}`}>
          查看完整报告
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-zinc-700">{report.summary}</p>
      <p className="mt-1 text-xs text-zinc-700">
        皮肤类型：{report.skinType} | 皮肤年龄：{report.skinAge} | 总分：{report.overallScore}
      </p>

      <h3 className="mt-3 mb-2 text-xl">core metrics</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {focusMetrics.map((metric) => (
          <article key={metric.key} className="rounded-lg bg-white/45 p-2">
            <strong className="block text-base">{metric.label}</strong>
            <p className="text-xs">
              分数：{metric.score} | 风险：{metric.risk}
            </p>
          </article>
        ))}
      </div>

      <h3 className="mt-3 mb-2 text-xl">main issue</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {report.topIssues.slice(0, 2).map((issue) => (
          <article key={issue.key} className="flex items-center gap-2 rounded-lg bg-white/45 p-2">
            <div className="h-10 w-10 rounded-md bg-zinc-300/80" />
            <div>
              <strong className="block text-xl leading-none">{issue.label}</strong>
              <p className="text-sm">风险：{issue.risk}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
