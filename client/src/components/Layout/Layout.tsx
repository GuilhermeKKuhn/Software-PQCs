import { Outlet } from "react-router-dom";
import { SidebarMenu } from "../SidebarMenu/SidebarMenu";
import { NavBar } from "../NavBar/index";

export function Layout() {
  return (
    <div className="d-flex flex-column vh-100">
      <NavBar />
      <div className="d-flex flex-grow-1">
        <aside className="bg-white border-end" style={{ width: "250px" }}>
          <SidebarMenu />
        </aside>
        <main className="flex-grow-1 p-4 bg-light overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
