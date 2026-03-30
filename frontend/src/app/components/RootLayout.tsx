import { Outlet } from "react-router";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header />
      <Outlet />
      
      {/* Help Button */}
      <button className="fixed bottom-8 right-8 w-12 h-12 bg-[#0D99FF] hover:bg-[#0088ee] text-white rounded-full shadow-lg flex items-center justify-center">
        <span className="text-xl">?</span>
      </button>
    </div>
  );
}
