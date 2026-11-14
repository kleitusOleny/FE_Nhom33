import {Outlet, useLocation} from "react-router-dom";
import RightSideBar from "../components/RightSideBar.tsx";
import LeftSideBar from "@/components/LeftSideBar.tsx";

export default function Layout() {
    const location = useLocation();
    const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
    if (isAuthPage) {
        return <Outlet />;
    }
    return (
        <div className="h-screen w-full flex">
            <div className="w-80 h-full border-r border-gray-200 bg-gray-100">
                <LeftSideBar/>
            </div>
            <div className="flex-1 h-full white">
                <Outlet/>
            </div>
            <div className="w-80 h-full border-l border-gray-300 bg-gray-100">
                <RightSideBar/>
            </div>
        </div>
    )
}