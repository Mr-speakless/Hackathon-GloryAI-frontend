import RecommendationGrid from "./RecommendationGrid";
import SkinReport from "./SkinReport";

export default function ReportPage({
  uploadedImageUrl,
  masks,
  onPrevMask,
  onNextMask,
  report,
  recommendations,
  onReset,
  currentMaskKey,
  currentMaskScore,
  currentMaskUrl,
}) {
  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";

  return (
    <main className="grid min-h-screen w-screen gap-4 overflow-hidden bg-gradient-to-br from-[#a49eed] via-[#e6d7c4] to-[#f2ddbd] px-4 py-4 text-zinc-900 md:h-screen md:grid-cols-[34%_66%] md:px-5 md:py-5">
      <section className="grid min-h-[360px] grid-rows-[1fr_auto] gap-3 overflow-hidden md:h-full">
        {uploadedImageUrl ? (
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-zinc-300/70 shadow-lg">
            <img className="h-full w-full object-cover" src={uploadedImageUrl} alt="用户上传图片" />
            {currentMaskUrl ? (
              <img
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-multiply"
                src={currentMaskUrl}
                alt={`mask-${currentMaskKey}`}
              />
            ) : null}
          </div>
        ) : (
          <div className="grid h-full w-full place-items-center rounded-xl bg-zinc-300 text-2xl">皮肤检测返回的图片</div>
        )}

        <div className="rounded-xl bg-white/40 p-3 backdrop-blur-sm">
          <div className="flex w-full flex-wrap justify-center gap-4">
            <button
              className={`rounded-lg bg-zinc-300 px-3 py-1 text-xl disabled:cursor-not-allowed disabled:opacity-50 ${interactiveClass}`}
              disabled={!masks.length}
              onClick={onPrevMask}
            >
              &lt;
            </button>
            <span className="text-base sm:text-lg md:text-xl">
              皮肤检测分析：{currentMaskKey ?? "暂无"}
              {typeof currentMaskScore === "number" ? ` · ${currentMaskScore}` : ""}
            </span>
            <button
              className={`rounded-lg bg-zinc-300 px-3 py-1 text-xl disabled:cursor-not-allowed disabled:opacity-50 ${interactiveClass}`}
              disabled={!masks.length}
              onClick={onNextMask}
            >
              &gt;
            </button>
          </div>
          <small className="mt-1 block w-full text-center text-sm md:text-base">两侧按钮切换不同分析，后续加AI护肤后效果</small>
        </div>
      </section>

      <section className="grid h-full grid-rows-[auto_auto_auto_auto] gap-3 overflow-y-auto pr-1 pb-28 md:pb-24">
        {report ? <SkinReport report={report} /> : null}
        <RecommendationGrid title="新手推荐" items={recommendations?.beginner ?? []} />
        <RecommendationGrid title="进阶推荐" items={recommendations?.intermediate ?? []} />
        <button
          className={`w-full rounded-lg bg-white/80 px-3 py-2 text-center text-xl hover:bg-white ${interactiveClass}`}
          onClick={onReset}
        >
          重新检测
        </button>
      </section>
    </main>
  );
}
