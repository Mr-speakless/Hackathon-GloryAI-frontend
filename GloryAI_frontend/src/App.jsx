import { useEffect, useMemo, useState } from "react";
import AnalyzingLoader from "./components/AnalyzingLoader";
import ImageUpload from "./components/ImageUpload";
import ReportPage from "./components/ReportPage";
import { analyzeSkin } from "./services/api";
import { buildReport } from "./utils/skinAnalysis";

function App() {
  const [pageState, setPageState] = useState("upload");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");
  const [maskIndex, setMaskIndex] = useState(0);

  const report = useMemo(() => (analysisData ? buildReport(analysisData) : null), [analysisData]);
  const masks = useMemo(() => {
    const skinAnalysis = analysisData?.skin_analysis ?? {};
    return Object.keys(skinAnalysis).filter((key) => key !== "all" && key !== "skin_age");
  }, [analysisData]);

  const currentMaskKey = useMemo(() => (masks.length ? masks[maskIndex] : null), [masks, maskIndex]);
  const currentMaskScore = useMemo(() => {
    if (!currentMaskKey) return null;
    return analysisData?.skin_analysis?.[currentMaskKey]?.ui_score ?? null;
}, [analysisData, currentMaskKey]);

  

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    };
  }, [uploadedImageUrl]);

  async function handleAnalyze(file) {
    setError("");
    const nextUrl = URL.createObjectURL(file);
    setUploadedImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });

    setPageState("analyzing");

    try {
      const result = await analyzeSkin(file);
      setAnalysisData(result?.normalized ?? result);
      setMaskIndex(0);
      setPageState("report");
    } catch (err) {
      setError(err.message || "分析失败");
      setPageState("upload");
    }
  }

  function resetAll() {
    setPageState("upload");
    setUploadedImageUrl("");
    setAnalysisData(null);
    setError("");
    setMaskIndex(0);
  }

  function switchMask(step) {
    if (!masks.length) return;
    setMaskIndex((prev) => (prev + step + masks.length) % masks.length);
  }

  if (pageState === "upload") {
    return (
      <main className="h-screen w-screen overflow-hidden bg-zinc-200 px-6 py-6 text-zinc-900 md:px-8">
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <ImageUpload onSubmit={handleAnalyze} />
      </main>
    );
  }

  if (pageState === "analyzing") {
    return (
      <main className="h-screen w-screen overflow-hidden bg-zinc-200 px-6 py-6 text-zinc-900 md:px-8">
        <AnalyzingLoader />
      </main>
    );
  }

  return (
    <ReportPage
      uploadedImageUrl={uploadedImageUrl}
      masks={masks}
      maskIndex={maskIndex}
      onPrevMask={() => switchMask(-1)}
      onNextMask={() => switchMask(1)}
      report={report}
      recommendations={analysisData?.recommendations}
      onReset={resetAll}
      currentMaskKey={currentMaskKey}
      currentMaskScore={currentMaskScore}
    />
  );
}

export default App;
