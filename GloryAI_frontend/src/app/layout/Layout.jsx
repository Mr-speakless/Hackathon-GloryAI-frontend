import { Outlet } from "react-router-dom";
import { PageNav } from "./PageNav";

export function Layout() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-zinc-100">
      <Outlet />
      {/* <PageNav /> */}
    </div>
  );
}
