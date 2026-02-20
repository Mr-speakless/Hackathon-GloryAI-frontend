export default function AnalysisInProgressCard({
  visible,
  title = "Analyzing your image...",
  description = "AI is mapping skin signals. This usually takes a few seconds.",
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 px-4 backdrop-blur-[2px]">
      <div className="ai-border-breathe relative w-[min(90vw,420px)] rounded-3xl bg-gradient-to-r from-[#a49eed] via-[#e6d7c4] to-[#f2ddbd] p-[1.5px] shadow-[0_24px_60px_rgba(77,69,124,0.35)]">
        <article
          role="status"
          aria-live="polite"
          className="relative overflow-hidden rounded-3xl bg-white/92 px-6 py-6 text-zinc-800"
        >
          <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 ai-shimmer-sweep bg-gradient-to-r from-transparent via-white/45 to-transparent" />

          <div className="relative flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#cfc5f0] bg-gradient-to-br from-[#ede8fb] via-white to-[#f7ebda]">
              <span className="ai-core-pulse block h-5 w-5 rounded-full bg-gradient-to-br from-[#8f85df] to-[#e8d7bb]" />
              <span className="absolute h-8 w-8 rounded-full border border-[#b9afe8]/70" />
            </div>
            <div>
              <h3 className="text-xl font-semibold leading-tight text-zinc-800">{title}</h3>
              <p className="mt-1 text-sm text-zinc-600">{description}</p>
            </div>
          </div>

          <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-zinc-200/90">
            <div className="ai-shimmer-sweep absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-[#8f85df] via-[#d9c9d2] to-[#e8d7bb]" />
          </div>
        </article>
      </div>
    </div>
  );
}
