import RecommendationGrid from "./RecommendationGrid";
import SkinReport from "./SkinReport";

export default function ReportPage({
  uploadedImageUrl,
  masks,
  maskIndex,
  onPrevMask,
  onNextMask,
  report,
  recommendations,
  onReset,
}) {
  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";

  return (
    <main className="grid h-screen w-screen gap-4 overflow-hidden bg-zinc-200 px-4 py-4 text-zinc-900 md:grid-cols-[34%_66%] md:px-5 md:py-5">
      <section className="grid h-full grid-rows-[1fr_auto] gap-3 overflow-hidden">
        {uploadedImageUrl ? (
          <img
            className="h-full w-full rounded-xl bg-zinc-300 object-cover"
            src={uploadedImageUrl}
            alt="用户上传图片"
          />
        ) : (
          <div className="grid h-full w-full place-items-center rounded-xl bg-zinc-300 text-2xl">
            皮肤检测返回的图片
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex w-full flex-wrap justify-center gap-4">
            <button
              className={`justify-left rounded-lg bg-zinc-300 px-3 py-1 text-xl disabled:cursor-not-allowed disabled:opacity-50 ${interactiveClass}`}
              disabled={!masks.length}
              onClick={onPrevMask}
            >
              &lt;
            </button>
            <span className="text-xl">皮肤检测分析：{masks[maskIndex] || "-"}</span>
            <button
              className={`rounded-lg bg-zinc-300 px-3 py-1 text-xl disabled:cursor-not-allowed disabled:opacity-50 ${interactiveClass}`}
              disabled={!masks.length}
              onClick={onNextMask}
            >
              &gt;
            </button>
          </div>
          <small className="w-full text-center text-base">两侧按钮切换不同分析，后续加AI护肤后效果</small>
        </div>
      </section>

      <section className="grid h-full grid-rows-[auto_auto_auto_auto] gap-3 overflow-hidden">
        {report ? <SkinReport report={report} /> : null}
        <RecommendationGrid title="新手推荐" items={recommendations?.beginner ?? []} />
        <RecommendationGrid title="进阶推荐" items={recommendations?.intermediate ?? []} />
        <button
          className={`w-full rounded-lg bg-zinc-100 px-3 py-2 text-center text-xl hover:bg-zinc-50 ${interactiveClass}`}
          onClick={onReset}
        >
          重新检测
        </button>
      </section>
    </main>
  );
}
