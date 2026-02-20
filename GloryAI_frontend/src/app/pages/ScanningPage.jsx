import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysisFlow } from "../../features/analysis/AnalysisFlowContext";

// Legacy compatibility route: scanning is now handled inline on SkinLabPage.
export function ScanningPage() {
  const navigate = useNavigate();
  const { analysisData } = useAnalysisFlow();

  useEffect(() => {
    navigate(analysisData ? "/report" : "/skin-lab", { replace: true });
  }, [analysisData, navigate]);

  return null;
}
