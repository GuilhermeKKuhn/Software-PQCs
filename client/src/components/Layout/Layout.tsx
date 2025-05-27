import { Outlet } from "react-router-dom";
import { SidebarMenu } from "../SidebarMenu/SidebarMenu";
import { Topbar } from "../TopBar/TopBar";

export function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar fixo */}
      <aside className="w-64 bg-white border-r">
        <SidebarMenu />
      </aside>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-auto">
          <Outlet /> {/* Aqui entra a página atual */}
        </main>
      </div>
    </div>
  );
}
