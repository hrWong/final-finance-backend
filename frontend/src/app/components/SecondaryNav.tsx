import { ChevronDown } from "lucide-react";

const tabs = [
  { id: "common", label: "常见", active: true },
  { id: "capitalization", label: "笔记花", active: false },
  { id: "dividend", label: "股息", active: false },
  { id: "development", label: "发展", active: false },
  { id: "maintain", label: "报持", active: false },
  { id: "finance", label: "理财", active: false, hasDot: true },
];

export function SecondaryNav() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-1 pb-3 relative flex items-center gap-1 ${
              tab.active
                ? "text-[#0D99FF] font-medium"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.hasDot && (
              <span className="w-1.5 h-1.5 bg-[#0D99FF] rounded-full"></span>
            )}
            {tab.active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D99FF]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="选择一个类别或资产....."
          className="w-80 px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
}