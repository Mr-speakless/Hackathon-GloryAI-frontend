import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReportPage from "../../components/ReportPage";
import { useAnalysisFlow } from "../../features/analysis/AnalysisFlowContext";

export function SkinReportPage() {
  const navigate = useNavigate();
  const {
    uploadedImageUrl,
    analysisData,
    report,
    masks,
    currentMaskKey,
    currentMaskScore,
    currentMaskUrl,
    switchMask,
    resetAll,
  } = useAnalysisFlow();

  useEffect(() => {
    if (!analysisData) {
      navigate("/skin-lab", { replace: true });
    }
  }, [analysisData, navigate]);

  if (!analysisData || !report) {
    return null;
  }

  return (
    <ReportPage
      uploadedImageUrl={uploadedImageUrl}
      masks={masks}
      onPrevMask={() => switchMask(-1)}
      onNextMask={() => switchMask(1)}
      report={report}
      recommendations={analysisData?.recommendations}
      onReset={() => {
        resetAll();
        navigate("/skin-lab");
      }}
      currentMaskKey={currentMaskKey}
      currentMaskScore={currentMaskScore}
      currentMaskUrl={currentMaskUrl}
    />
  );
}
