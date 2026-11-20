import {useSelector} from "react-redux";
import UserChatInfo from "./rightsidebar/UserChatInfo.tsx";
import GroupChatInfo from "./rightsidebar/GroupChatInfo.tsx";
import type {RootState} from "@/store/store";

export default function RightSideBar({isActive = true}: { isActive?: boolean }) {
    const {currentTarget, roomHistory} = useSelector((state: RootState) => state.chat);

    if (!currentTarget) {
        return (<aside
                className="w-80 h-full flex flex-col bg-white text-gray-800 select-none overflow-hidden border-l border-gray-200 items-center justify-center p-6 text-center text-xs text-gray-400">
                Chọn một cuộc trò chuyện để xem chi tiết
            </aside>);
    }

    const isGroup = currentTarget.type === 1;
    const roomInfo = isGroup ? roomHistory[currentTarget.name] : undefined;
    const groupMembers = roomInfo?.members.map((m) => ({
        name: m.name, role: roomInfo.own === m.name ? "Trưởng nhóm" : "Thành viên", isLeader: roomInfo.own === m.name,
    })) ?? [];

    return (<aside
            className="w-80 h-full flex flex-col bg-white text-gray-800 select-none overflow-hidden border-l border-gray-200">
            <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
                <h3 className="font-bold text-gray-800 text-base">Thông tin hội thoại</h3>
            </div>

            {isGroup ? (<GroupChatInfo
                    groupName={currentTarget.name}
                    members={groupMembers}
                    isActive={isActive}
                />) : (<UserChatInfo name={currentTarget.name} isActive={isActive}/>)}
        </aside>);
}