import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const filteredChats = userList.filter((chat) =>
    chat.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleSelectChat = (chat: ChatTarget) => {
    dispatch(setCurrentTarget(chat));
  };

  return (
    <aside className="w-80 h-full flex flex-col bg-white border-r border-gray-200 select-none">
      <Search onSearchChange={setKeyword} />
      <ChatFilterBar onTabChange={(tab) => setFilterTab(tab)} />

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {loadingUserList && filteredChats.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            Đang tải danh sách cuộc trò chuyện...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400">
            Không có cuộc trò chuyện nào
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isSelected =
              currentTarget?.name === chat.name &&
              currentTarget?.type === chat.type;

            return chat.type === 1 ? (
              <GroupChatItem
                key={`1-${chat.name}`}
                chat={chat}
                isSelected={isSelected}
                onSelect={handleSelectChat}
              />
            ) : (
              <UserChatItem
                key={`0-${chat.name}`}
                chat={chat}
                isSelected={isSelected}
                onSelect={handleSelectChat}
              />
            );
          })
        )}
      </div>
    </aside>
  );
}
