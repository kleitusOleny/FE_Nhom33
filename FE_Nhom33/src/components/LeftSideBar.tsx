import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Popover from "@radix-ui/react-popover";
import { LogOut, Settings } from "lucide-react";
import { BsPeopleFill } from "react-icons/bs";
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
  const { userList, currentTarget, onlineUsers, loadingUserList } = useSelector(
    (state: RootState) => state.chat
  );

  const [keyword, setKeyword] = useState("");
  const [_filterTab, setFilterTab] = useState<"priority" | "pinned">("priority");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const groupChats = userList.filter((chat) => chat.type === 1);
  const dmChats = userList.filter(
    (chat) =>
      chat.type === 0 &&
      chat.name.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  const handleSelectChat = (chat: ChatTarget) => {
    dispatch(setCurrentTarget(chat));
  };

  const handleLogout = () => {
    setMenuOpen(false);
    if (WebsocketInstance.getInstance().getSocket?.readyState === WebSocket.OPEN) {
      chatSocketService.logout();
    } else {
      alert("Không thể đăng xuất. Kết nối WebSocket chưa được thiết lập");
    }
  };

  return (
    <aside className="w-full h-full flex flex-row bg-white select-none">
      {/* Left rail: account menu + active group chats */}
      <div className="w-16 shrink-0 h-full bg-gray-100 border-r border-gray-200 flex flex-col items-center py-3 gap-2.5 overflow-y-auto">
        <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              title="Menu tài khoản"
              className="w-11 h-11 rounded-2xl bg-white border border-gray-200 text-indigo-600 flex items-center justify-center shadow-xs shrink-0 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <BsPeopleFill size={18} />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="right"
              align="start"
              sideOffset={8}
              className="z-50 w-48 rounded-xl bg-white border border-gray-200 shadow-lg p-1.5 text-sm text-gray-700"
            >
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left cursor-pointer"
              >
                <Settings size={16} />
                <span>Cài đặt</span>
              </button>
              <div className="my-1 h-px bg-gray-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        <div className="w-8 h-px bg-gray-300 shrink-0" />

        {groupChats.length === 0 && !loadingUserList ? (
          <div
            title="Chưa có nhóm nào"
            className="w-11 h-11 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0"
          >
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
                onSelect={handleSelectChat}
              />
            );
          })
        )}
      </div>

      {/* Right column: Search, filter bar & DM list */}
      <div className="flex-1 min-w-0 h-full flex flex-col bg-white border-r border-gray-200">
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
                  isOnline={Boolean(onlineUsers[chat.name])}
                  onSelect={handleSelectChat}
                />
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
