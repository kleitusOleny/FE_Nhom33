import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Search from "@/components/leftsidebar/Search.tsx";
import ChatFilterBar from "@/components/leftsidebar/ChatFilterBar.tsx";
import UserChatItem from "@/components/leftsidebar/UserChatItem.tsx";
import GroupChatItem from "@/components/leftsidebar/GroupChatItem.tsx";
import { WebsocketInstance } from "@/socket/WebsocketInstance";
import { WebSocketEvent } from "@/socket/types/WebSoketMessage";
import { chatSocketService } from "@/services/chatSocketService";
import {
  openOrAddChatTarget,
  setCurrentTarget,
  type ChatTarget,
} from "@/store/slice/chatSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function LeftSideBar() {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, currentTarget, loadingUserList } = useSelector(
    (state: RootState) => state.chat
  );

  const [keyword, setKeyword] = useState("");
  const [_filterTab, setFilterTab] = useState<"priority" | "pinned">("priority");
  const [actionError, setActionError] = useState<string | null>(null);
  const pendingUserRef = useRef("");

  useEffect(() => {
    const ws = WebsocketInstance.getInstance();

    const unsubCheckUser = ws.subscribe(
      WebSocketEvent.CHECK_USER_EXIST,
      (res) => {
        const targetName = pendingUserRef.current;
        pendingUserRef.current = "";

        if (res.status === "success") {
          const data = res.data as unknown as {
            status?: boolean;
            exists?: boolean;
          };
          const isUserExist = data.status ?? data.exists ?? false;
          if (isUserExist && targetName) {
            dispatch(
              openOrAddChatTarget({
                name: targetName,
                type: 0,
                actionTime: new Date().toISOString(),
              })
            );
            setKeyword("");
            setActionError(null);
          } else if (targetName) {
            setActionError(`Không tìm thấy người dùng "${targetName}"`);
          }
        } else {
          setActionError(res.mes || "Không thể kiểm tra người dùng");
        }
      }
    );

    const unsubCreateRoom = ws.subscribe(WebSocketEvent.CREATE_ROOM, (res) => {
      if (res.status === "success") {
        const roomData = res.data as unknown as {
          name: string;
          user?: { id: number }[];
        };
        dispatch(
          openOrAddChatTarget({
            name: roomData.name,
            type: 1,
            actionTime: new Date().toISOString(),
            memberCount: roomData.user?.length ?? 1,
          })
        );
        setKeyword("");
        setActionError(null);
      } else {
        setActionError(res.mes || "Tạo nhóm thất bại");
      }
    });

    return () => {
      unsubCheckUser();
      unsubCreateRoom();
    };
  }, [dispatch]);

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    if (actionError) setActionError(null);
  };

  const handleAddUser = () => {
    const targetName = keyword.trim();
    if (!targetName) {
      setActionError("Vui lòng nhập tên người dùng vào ô tìm kiếm");
      return;
    }

    const existing = userList.find(
      (c) => c.type === 0 && c.name.toLowerCase() === targetName.toLowerCase()
    );
    if (existing) {
      dispatch(setCurrentTarget(existing));
      setKeyword("");
      setActionError(null);
      return;
    }

    setActionError(null);
    pendingUserRef.current = targetName;
    chatSocketService.checkUserExist(targetName);
  };

  const handleAddGroup = () => {
    const targetName = keyword.trim();
    if (!targetName) {
      setActionError("Vui lòng nhập tên nhóm vào ô tìm kiếm");
      return;
    }

    const existing = userList.find(
      (c) => c.type === 1 && c.name.toLowerCase() === targetName.toLowerCase()
    );
    if (existing) {
      dispatch(setCurrentTarget(existing));
      setKeyword("");
      setActionError(null);
      return;
    }

    setActionError(null);
    chatSocketService.createRoom(targetName);
  };

  const filteredChats = userList.filter((chat) =>
    chat.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleSelectChat = (chat: ChatTarget) => {
    dispatch(setCurrentTarget(chat));
  };

  return (
    <aside className="w-80 h-full flex flex-col bg-white border-r border-gray-200 select-none">
      <Search
        value={keyword}
        onSearchChange={handleSearchChange}
        onAddUser={handleAddUser}
        onAddGroup={handleAddGroup}
      />

      {actionError && (
        <div className="px-3 py-1.5 bg-red-50 border-b border-red-100 text-xs text-red-600">
          {actionError}
        </div>
      )}

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
