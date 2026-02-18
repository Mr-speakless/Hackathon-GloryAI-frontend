import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisFlow } from "../../features/analysis/AnalysisFlowContext";

function ScanningBadge() {
  return (
    <div className="rounded-full border border-white/70 bg-white/25 px-6 py-2 text-lg text-zinc-800 backdrop-blur-sm">
      Scanning... &gt;&gt; 100%
    </div>
  );
}

export function ScanningPage() {
  const navigate = useNavigate();
  const { pendingFile, analysisData, isAnalyzing, runQueuedAnalysis, uploadedImageUrl } = useAnalysisFlow();

  useEffect(() => {
    if (analysisData) {
      navigate("/report", { replace: true });
      return;
    }

    if (!pendingFile && !isAnalyzing) {
      navigate("/skin-lab", { replace: true });
      return;
    }

    let cancelled = false;
    async function run() {
      const ok = await runQueuedAnalysis();
      if (cancelled) return;
      navigate(ok ? "/report" : "/skin-lab", { replace: true });
    }

    if (pendingFile && !isAnalyzing) {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [analysisData, isAnalyzing, navigate, pendingFile, runQueuedAnalysis]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#a49eed] via-[#e6d7c4] to-[#f2ddbd] px-4 py-10 text-zinc-900 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <div className="relative h-[58vh] w-full max-w-[420px] min-h-[340px] overflow-hidden rounded-xl shadow-lg">
          {uploadedImageUrl ? (
            <img src={uploadedImageUrl} alt="scanning target" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-white/45 text-zinc-600">Waiting image...</div>
          )}

          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-y-0 left-1/2 w-[4px] -translate-x-1/2 animate-pulse bg-cyan-300/80 blur-[1px]" />
        </div>

        <ScanningBadge />
      </div>
    </main>
  );
}
