import { Plus, Sparkles, TrendingUp } from "lucide-react";
import { NavLink, Link } from "react-router";

interface HeaderProps {
  onToggleAi: () => void;
  isAiOpen: boolean;
}

export function Header({ onToggleAi, isAiOpen }: HeaderProps) {
  return (
    <header
      className={`bg-white border-b border-gray-200 sticky top-0 z-50 h-[73px] transition-all duration-300 ease-in-out ${isAiOpen ? "pr-[400px]" : "pr-0"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-8 py-4 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation Item 1 */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm group-hover:bg-indigo-700 transition-colors">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl tracking-tighter flex items-center">
                <span className="font-extrabold text-slate-800">Fin</span>
                <span className="font-black text-indigo-600">Pulse</span>
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-[#6366F1] font-bold" : "text-gray-600 hover:text-gray-900 font-medium"
                }
              >
                仪表盘
              </NavLink>
              <NavLink
                to="/analysis"
                className={({ isActive }) =>
                  isActive ? "text-[#6366F1] font-bold" : "text-gray-600 hover:text-gray-900 font-medium"
                }
              >
                我的持仓
              </NavLink>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleAi}
              className={`p-2 px-4 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${isAiOpen
                ? "bg-[#6366F1] text-white shadow-lg active:scale-95"
                : "text-gray-700 hover:bg-gray-50 border border-gray-200 bg-white shadow-sm"
                }`}
            >
              <Sparkles className={`w-4 h-4 ${isAiOpen ? "fill-white" : ""}`} />
              AI 助手
            </button>

            <Link
              to="/add-holding"
              className="px-4 py-2 bg-[#E0F2FE] text-[#0284C7] rounded-lg flex items-center gap-2 hover:bg-[#d0ebfd] font-bold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              添加
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}