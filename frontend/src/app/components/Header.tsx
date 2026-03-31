import { Plus, Search, User } from "lucide-react";
import { NavLink, Link } from "react-router";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center">
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive ? "text-[#6366F1] font-medium" : "text-gray-600 hover:text-gray-900"
                }
              >
                仪表盘
              </NavLink>
              <NavLink 
                to="/analysis" 
                className={({ isActive }) => 
                  isActive ? "text-[#6366F1] font-medium" : "text-gray-600 hover:text-gray-900"
                }
              >
                分析
              </NavLink>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                作品集
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link 
              to="/add-holding"
              className="px-4 py-2 bg-[#E0F2FE] text-[#0284C7] rounded-lg flex items-center gap-2 hover:bg-[#d0ebfd]"
            >
              <Plus className="w-4 h-4" />
              添加
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}