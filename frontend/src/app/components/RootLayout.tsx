import { Outlet } from "react-router";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Header />
      <Outlet />
      
    </div>
  );
}
