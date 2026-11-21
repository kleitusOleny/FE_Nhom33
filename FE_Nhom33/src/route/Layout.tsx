import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import RightSideBar from "../components/RightSideBar.tsx";
import LeftSideBar from "@/components/LeftSideBar.tsx";
import { useChatSocket } from "@/hooks/useChatSocket";

export interface LayoutOutletContext {
  showRightSidebar: boolean;
  toggleRightSidebar: () => void;
}

export default function Layout() {
  const location = useLocation();
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useChatSocket(!isAuthPage);

  if (isAuthPage) {return <Outlet />;}

  const outletContext: LayoutOutletContext = {
    showRightSidebar,
    toggleRightSidebar: () => setShowRightSidebar((prev) => !prev)
  };

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <div className="w-[384px] h-full border-r border-gray-200 bg-gray-100 shrink-0">
        <LeftSideBar />
      </div>
      <div className="flex-1 h-full min-w-0 bg-white">
        <Outlet context={outletContext} />
      </div>
      {showRightSidebar && (
        <div className="w-80 h-full border-l border-gray-300 bg-gray-100 shrink-0">
          <RightSideBar />
        </div>
      )}
    </div>
  );
}
