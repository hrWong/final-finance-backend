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