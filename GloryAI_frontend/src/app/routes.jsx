import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { HomePage } from "./pages/HomePage";
import { SkinLabPage } from "./pages/SkinLabPage";
import { ScanningPage } from "./pages/ScanningPage";
import { SkinReportPage } from "./pages/SkinReportPage";
import { LegacyFlowPage } from "../features/legacy/LegacyFlowPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "skin-lab", element: <SkinLabPage /> },
      { path: "scanning", element: <ScanningPage /> },
      { path: "report", element: <SkinReportPage /> },
      { path: "legacy-flow", element: <LegacyFlowPage /> },
    ],
  },
]);
