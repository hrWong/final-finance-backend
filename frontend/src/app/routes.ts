import { createBrowserRouter } from "react-router";
import { DashboardPage } from "./pages/DashboardPage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { StockDetailPage } from "./pages/StockDetailPage";
import { AddHoldingPage } from "./pages/AddHoldingPage";
import { RootLayout } from "./components/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "analysis", Component: AnalysisPage },
      { path: "stock/:symbol", Component: StockDetailPage },
      { path: "add-holding", Component: AddHoldingPage },
    ],
  },
]);