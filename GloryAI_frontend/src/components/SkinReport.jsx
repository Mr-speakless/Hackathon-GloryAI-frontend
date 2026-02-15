export default function SkinReport({ report }) {
  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";

  return (
    <section className="rounded-xl bg-zinc-300 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl">Report</h2>
        <button type="button" className={`rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs ${interactiveClass}`}>
          查看完整报告
        </button>
      </div>

      <p className="mt-2 line-clamp-2 text-sm">{report.summary}</p>
      <p className="mt-1 text-xs">
        皮肤类型：{report.skinType} | 皮肤年龄：{report.skinAge} | 总分：{report.overallScore}
      </p>

      <h3 className="mt-2 mb-2 text-xl">main issue</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {report.topIssues.slice(0, 2).map((issue) => (
          <article key={issue.key} className="flex items-center gap-2 rounded-lg bg-zinc-200 p-2">
            <div className="h-10 w-10 bg-zinc-300" />
            <div>
              <strong className="block text-xl">{issue.label}</strong>
              <p className="text-sm">风险：{issue.risk}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
