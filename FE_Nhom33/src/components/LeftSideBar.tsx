import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsPeopleFill } from "react-icons/bs";
import Search from "@/components/leftsidebar/Search.tsx";
import ChatFilterBar from "@/components/leftsidebar/ChatFilterBar.tsx";
import UserChatItem from "@/components/leftsidebar/UserChatItem.tsx";
import GroupChatItem from "@/components/leftsidebar/GroupChatItem.tsx";
import { setCurrentTarget, type ChatTarget } from "@/store/slice/chatSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function LeftSideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, currentTarget, loadingUserList } = useSelector(
    (state: RootState) => state.chat
  );

  const [keyword, setKeyword] = useState("");
  const [_filterTab, setFilterTab] = useState<"priority" | "pinned">("priority");

  const groupChats = userList.filter((chat) => chat.type === 1);
  const dmChats = userList.filter(
    (chat) =>
      chat.type === 0 &&
      chat.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleSelectChat = (chat: ChatTarget) => {
    dispatch(setCurrentTarget(chat));
  };

  return (
    <aside className="w-full h-full flex flex-row bg-white select-none">
      {/* Left rail: active group chats */}
      <div className="w-16 shrink-0 h-full bg-gray-100 border-r border-gray-200 flex flex-col items-center py-3 gap-2.5 overflow-y-auto">
        <div
          title="Nhóm chat"
          className="w-11 h-11 rounded-2xl bg-white border border-gray-200 text-indigo-600 flex items-center justify-center shadow-xs shrink-0">
          <BsPeopleFill size={18} />
        </div>

        <div className="w-8 h-px bg-gray-300 shrink-0" />

        {groupChats.length === 0 && !loadingUserList ? (
          <div
            title="Chưa có nhóm nào"
            className="w-11 h-11 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
            <BsPeopleFill size={16} />
          </div>
        ) : (
          groupChats.map((chat) => {
            const isSelected =
              currentTarget?.name === chat.name &&
              currentTarget?.type === chat.type;

            return (
              <GroupChatItem
                key={`1-${chat.name}`}
                chat={chat}
                isSelected={isSelected}
                onSelect={handleSelectChat}/>
            );
          })
        )}
      </div>

      {/* Right column: Search, filter bar & DM list */}
      <div className="flex-1 min-w-0 h-full flex flex-col bg-white">
        <Search onSearchChange={setKeyword} />
        <ChatFilterBar onTabChange={(tab) => setFilterTab(tab)} />

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {loadingUserList && dmChats.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              Đang tải danh sách cuộc trò chuyện...
            </div>
          ) : dmChats.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">
              Không có cuộc trò chuyện nào
            </div>
          ) : (
            dmChats.map((chat) => {
              const isSelected =
                currentTarget?.name === chat.name &&
                currentTarget?.type === chat.type;

              return (
                <UserChatItem
                  key={`0-${chat.name}`}
                  chat={chat}
                  isSelected={isSelected}
                  onSelect={handleSelectChat}/>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
