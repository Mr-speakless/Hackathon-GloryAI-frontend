import { useMemo, useState } from "react";
import RecommendationGrid from "./RecommendationGrid";
import SkinReport from "./SkinReport";
import { TopNavPill } from "./TopNavPill";
import productRecommendationDb from "../data/productRecommendationDb.json";
import { getTopRecommendations } from "../utils/recommendProducts";

export default function ReportPage({
  uploadedImageUrl,
  masks,
  onPrevMask,
  onNextMask,
  report,
  onReset,
  currentMaskKey,
  currentMaskScore,
  currentMaskUrl,
}) {
  const [overlayOn, setOverlayOn] = useState(true);

  const interactiveClass =
    "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.18)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.14)]";
  const recommendedItems = useMemo(
    () => getTopRecommendations(report?.overallScore, productRecommendationDb, 3),
    [report?.overallScore],
  );

  return (
    //这个main 负责撑满屏幕 并应用渐变背景
    <main className="flex h-screen w-screen flex-col gap-4 overflow-hidden bg-gradient-to-br from-[#aca5e8] via-[#d7c9de] to-[#e8d7bb] px-3 py-3 text-zinc-900 md:px-5 md:py-4">
      {/* 这个div 负责划分上下两栏 上栏用来放置navbar，下栏用来放置内容 */}
      <div className="flex justify-center pt-2 m-4">
        {/* nav bar */}
        <div className="flex w-full max-w-md justify-center">
          <TopNavPill activeTab="skinlab" />
        </div>
      </div>
      {/* 这个大div是主内容的div */}
      <div className="flex min-h-0 flex-1 flex-col gap-12 md:flex-row px-12">
        {/* 这是主要左侧卡片主要内容 */}
        <section className="m-4 rounded-2xl border border-[#c8bce8] bg-white/22 p-4 backdrop-blur-sm md:m-4 md:w-[35%] md:p-5">
        {/* 卡片div */}
          <div className="mx-auto flex h-full max-w-[530px] flex-col px-8">
            {/* UserUpload Picture */}
            {uploadedImageUrl ? (
              <div className="relative flex-1 overflow-hidden rounded-xl border border-white/65 bg-white shadow-[0_10px_24px_rgba(63,46,90,0.15)]">
                <img className="h-full w-full object-cover" src={uploadedImageUrl} alt="PictureUserUploaded" />
                {overlayOn && currentMaskUrl ? (
                  <img
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-multiply"
                    src={currentMaskUrl}
                    alt={`mask-${currentMaskKey}`}
                  />
                ) : null}
              </div>
            ) : (
              <div className="grid flex-1 place-items-center rounded-xl border border-white/65 bg-white/90 text-xl text-zinc-500">皮肤检测返回的图片</div>
            )}

            <div className="mt-4 rounded-xl border border-white/45 bg-white/48 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3">
                <button
                  className={`rounded-lg bg-white/85 px-3 py-1 text-lg disabled:cursor-not-allowed disabled:opacity-45 ${interactiveClass}`}
                  disabled={!masks.length}
                  onClick={onPrevMask}
                  aria-label="上一项分析"
                >
                  &lt;
                </button>
                <span className="text-base md:text-lg">
                  皮肤检测分析：{currentMaskKey ?? "暂无"}
                  {typeof currentMaskScore === "number" ? ` · ${currentMaskScore}` : ""}
                </span>
                <button
                  className={`rounded-lg bg-white/85 px-3 py-1 text-lg disabled:cursor-not-allowed disabled:opacity-45 ${interactiveClass}`}
                  disabled={!masks.length}
                  onClick={onNextMask}
                  aria-label="下一项分析"
                >
                  &gt;
                </button>
              </div>

              {/* Overlay switch */}
              <div className="mt-3 flex items-center justify-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={overlayOn}
                  aria-label="Toggle overlay"
                  onClick={() => setOverlayOn((prev) => !prev)}
                  className={`inline-flex items-center gap-3 rounded-full border px-3 py-1.5 text-sm text-zinc-700 outline-none transition-colors ${overlayOn ? "border-violet-300 bg-gradient-to-r from-[#f0dfc4] to-[#b8adef]" : "border-zinc-300 bg-white/80"
                    } focus-visible:ring-2 focus-visible:ring-violet-500`}
                >
                  <span className="font-medium">Overlay</span>
                  <span
                    className={`relative h-6 w-11 rounded-full transition-colors ${overlayOn ? "bg-violet-400/75" : "bg-zinc-300"
                      }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
    overlayOn ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
        {/* 这个section 用来做右侧的report详细内容 */}
        <section className="m-4 flex h-full min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 pb-28 md:m-4 md:pb-24 custom-scroll">
          {report ? <SkinReport report={report} /> : null}
          <RecommendationGrid title="Starter Kit Recommendations" items={recommendedItems} />
          {/* 底部 restart按钮 */}
          <div className="flex flex-1 items-center justify-center gap-8 rounded-xl border border-white/35 bg-white/22 px-4 py-3 text-lg text-zinc-500">
            <button type="button" className="transition-colors hover:text-zinc-700" onClick={onReset}>
              Regenerate  ›
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
