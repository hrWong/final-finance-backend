import { useState } from "react";
import { Outlet } from "react-router";
import { Header } from "./Header";
import { AISidebar } from "./AISidebar";

export function RootLayout() {
  const [isAiOpen, setIsAiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col overflow-x-hidden">
      <Header onToggleAi={() => setIsAiOpen(!isAiOpen)} isAiOpen={isAiOpen} />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isAiOpen ? "mr-[400px]" : "mr-0"
          }`}
        >
          <Outlet />
        </main>

        {/* AI Sidebar */}
        {isAiOpen && (
          <div className="fixed right-0 top-[73px] bottom-0 w-[400px] bg-white border-l border-gray-200 z-40 animate-slide-in-right">
            <AISidebar onClose={() => setIsAiOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
