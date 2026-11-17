import Search from "@/components/leftsidebar/Search.tsx";
import ChatFilterBar from "@/components/leftsidebar/ChatFilterBar.tsx";

export default function LeftSideBar() {
    return (
        <aside className="w-80 h-full flex flex-col bg-white border-r border-gray-200">
            <Search />
            <ChatFilterBar />
            <div className="flex-1 overflow-y-auto">
            </div>
        </aside>
    );
}