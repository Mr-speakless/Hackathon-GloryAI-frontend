import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { analyzeSkin } from "../../services/api";
import { buildReport } from "../../utils/skinAnalysis";

const AnalysisFlowContext = createContext(null);

export function AnalysisFlowProvider({ children }) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [maskIndex, setMaskIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    };
  }, [uploadedImageUrl]);

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
  const currentMaskUrl = useMemo(() => {
    if (!currentMaskKey) return null;
    return analysisData?.skin_analysis?.[currentMaskKey]?.mask_url ?? null;
  }, [analysisData, currentMaskKey]);

  function queueAnalysis(file) {
    setError("");
    const nextUrl = URL.createObjectURL(file);
    setUploadedImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setPendingFile(file);
    setAnalysisData(null);
    setMaskIndex(0);
  }

  async function runQueuedAnalysis() {
    if (!pendingFile || isAnalyzing) return false;
    setIsAnalyzing(true);
    setError("");

    try {
      const result = await analyzeSkin(pendingFile);
      setAnalysisData(result?.normalized ?? result);
      setPendingFile(null);
      return true;
    } catch (err) {
      setError(err.message || "分析失败");
      setPendingFile(null);
      return false;
    } finally {
      setIsAnalyzing(false);
    }
  }

  function switchMask(step) {
    if (!masks.length) return;
    setMaskIndex((prev) => (prev + step + masks.length) % masks.length);
  }

  function resetAll() {
    setPendingFile(null);
    setAnalysisData(null);
    setError("");
    setIsAnalyzing(false);
    setMaskIndex(0);
    setUploadedImageUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
  }

  const value = {
    uploadedImageUrl,
    pendingFile,
    analysisData,
    error,
    isAnalyzing,
    report,
    masks,
    maskIndex,
    currentMaskKey,
    currentMaskScore,
    currentMaskUrl,
    queueAnalysis,
    runQueuedAnalysis,
    switchMask,
    resetAll,
    setError,
  };

  return <AnalysisFlowContext.Provider value={value}>{children}</AnalysisFlowContext.Provider>;
}

export function useAnalysisFlow() {
  const context = useContext(AnalysisFlowContext);
  if (!context) {
    throw new Error("useAnalysisFlow must be used within AnalysisFlowProvider");
  }
  return context;
}
