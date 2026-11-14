import UserChatInfo from "./rightsidebar/UserChatInfo.tsx";
import GroupChatInfo from "./rightsidebar/GroupChatInfo.tsx";

export default function RightSideBar({isGroup = false, isActive = true,}) {
    return (
        <aside className="w-80 h-full flex flex-col bg-white text-gray-800 select-none overflow-hidden border-l border-gray-200">
            <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
                <h3 className="font-bold text-gray-800 text-base">Thông tin hội thoại</h3>
            </div>

            {isGroup ? (<GroupChatInfo isActive={isActive} onAddMember />):(<UserChatInfo isActive={isActive} />)}
        </aside>
    );
}