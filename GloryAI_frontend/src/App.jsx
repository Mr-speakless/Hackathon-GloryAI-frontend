import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { AnalysisFlowProvider } from "./features/analysis/AnalysisFlowContext";

export default function App() {
  return (
    <AnalysisFlowProvider>
      <RouterProvider router={router} />
    </AnalysisFlowProvider>
  );
}
