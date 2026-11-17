import { Cloud, Group, MessageSquarePlus, Search, User, X } from "lucide-react";
import { useState } from "react";

interface ChatTarget {
    name: string;
    type: 0 | 1;
    actionTime?: string;
}

interface ChatMenuBarProps {
    chats: ChatTarget[];
    currentTarget: ChatTarget | null;
    currentUsername: string;
    onSelectChat: (chat: ChatTarget) => void;
    onCreateChat: (name: string) => void;
    onCreateRoom: (name: string) => void;
    onJoinRoom: (name: string) => void;
}

const formatTime = (time?: string) => {
    if (!time) return "";

    const date = new Date(time);
    const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };

    if (date.toDateString() !== new Date().toDateString()) {
        options.day = "2-digit";
        options.month = "2-digit";
        options.year = "numeric";
    }

    return date.toLocaleTimeString("vi-VN", options);
};

interface RoomModalProps {
    title: string;
    placeholder: string;
    value: string;
    submitLabel: string;
    onChange: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
}

function RoomModal({
    title,
    placeholder,
    value,
    submitLabel,
    onChange,
    onClose,
    onSubmit,
}: RoomModalProps) {
    return (
        <div
            className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 shadow-xl p-4"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        type="button"
                        className="rounded p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                        onClick={onClose}
                        aria-label="Đóng"
                    >
                        <X size="1.25rem" />
                    </button>
                </div>

                <input
                    autoFocus
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSubmit();
                    }}
                    placeholder={placeholder}
                    maxLength={100}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-indigo-500 dark:bg-gray-700"
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-lg px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        onClick={onClose}
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-400 disabled:bg-indigo-300"
                        onClick={onSubmit}
                        disabled={!value.trim()}
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ChatMenuBar({
    chats,
    currentTarget,
    currentUsername,
    onSelectChat,
    onCreateChat,
    onCreateRoom,
    onJoinRoom,
}: ChatMenuBarProps) {
    const [isInputFocused, setInputFocusState] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [joinRoomOpen, setJoinRoomOpen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [joinRoomName, setJoinRoomName] = useState("");

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchValue.trim().toLowerCase())
    );

    const isChatExist = chats.some(
        (chat) => chat.name.toLowerCase() === searchValue.trim().toLowerCase()
    );
    const isSelf = searchValue.trim().toLowerCase() === currentUsername.toLowerCase();

    const handleCreateNewChat = () => {
        const name = searchValue.trim();
        if (!name) return;

        onCreateChat(name);
        setSearchValue("");
    };

    const submitCreateRoom = () => {
        const name = roomName.trim();
        if (!name) return;

        onCreateRoom(name);
        setRoomName("");
        setCreateRoomOpen(false);
    };

    const submitJoinRoom = () => {
        const name = joinRoomName.trim();
        if (!name) return;

        onJoinRoom(name);
        setJoinRoomName("");
        setJoinRoomOpen(false);
    };

    return (
        <div className="h-full flex flex-col mb-12 lg:mb-0">
            {/* Header */}
            <div className="flex gap-2 justify-center items-center px-2 py-2 h-fit border-b min-h-16">
                <div
                    className={`w-full flex items-center gap-1 border rounded-md bg-gray-200/60 ${isInputFocused ? "border-neutral-500" : ""}`}
                >
                    <Search size="1rem" className="ms-3 me-1" />
                    <input
                        className="w-full py-2 focus:outline-0 bg-transparent"
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        onFocus={() => setInputFocusState(true)}
                        onBlur={() => setInputFocusState(false)}
                    />
                </div>

                {/* Room menu */}
                <div className="relative">
                    <div
                        className={`p-2 rounded-lg cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-700 ${roomMenuOpen ? "bg-neutral-200" : ""}`}
                        title="Nhóm"
                        onClick={() => setRoomMenuOpen((open) => !open)}
                    >
                        <Group />
                    </div>
                    {roomMenuOpen && (
                        <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-lg border bg-white shadow-lg dark:bg-gray-800">
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                onClick={() => {
                                    setRoomMenuOpen(false);
                                    setCreateRoomOpen(true);
                                }}
                            >
                                Tạo nhóm
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                onClick={() => {
                                    setRoomMenuOpen(false);
                                    setJoinRoomOpen(true);
                                }}
                            >
                                Tham gia nhóm
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-2 flex-1 overflow-y-auto">
                {/* Create new chat */}
                {searchValue && !isChatExist && !isSelf && (
                    <div
                        className="flex items-center gap-3 px-2 py-3 rounded-md my-2 cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-dashed border-indigo-300"
                        onClick={handleCreateNewChat}
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center shrink-0">
                            <MessageSquarePlus size="1.2rem" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-medium text-sm truncate">Nhắn tin cho "{searchValue}"</p>
                            <p className="text-xs opacity-70 truncate">Bắt đầu cuộc hội thoại mới</p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {filteredChats.length === 0 && !searchValue && (
                    <p className="text-center text-gray-400 mt-4">Chưa có tin nhắn nào</p>
                )}

                {filteredChats.map((chat) => {
                    const isCurrentUser = chat.name === currentUsername;
                    const label = isCurrentUser ? "My Document" : chat.name;

                    return (
                        <div
                            key={`${chat.type}-${chat.name}`}
                            className={`flex items-center gap-3 px-2 py-2 rounded-md my-2 cursor-pointer transition-colors ${currentTarget?.name === chat.name && currentTarget.type === chat.type
                                ? "bg-indigo-100"
                                : "hover:bg-neutral-100"
                                }`}
                            onClick={() => onSelectChat(chat)}
                        >
                            <div
                                className={`w-10 h-10 border rounded-full flex items-center justify-center shrink-0 ${isCurrentUser ? "bg-blue-400" : "bg-neutral-200"}`}
                            >
                                {isCurrentUser ? (
                                    <Cloud size="1.2rem" className="text-white" fill="white" />
                                ) : (
                                    <User size="1.2rem" className="text-gray-500" />
                                )}
                            </div>

                            <div className="w-full overflow-hidden">
                                <div className="flex justify-between mb-1">
                                    <p className="font-medium truncate max-w-[70%]">{label}</p>
                                    <p className="text-neutral-500 text-xs shrink-0">
                                        {formatTime(chat.actionTime)}
                                    </p>
                                </div>
                                <p className="text-neutral-500 text-sm truncate">
                                    {isCurrentUser ? "" : chat.type === 0 ? "Người dùng" : "Nhóm chat"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {createRoomOpen && (
                <RoomModal
                    title="Tạo nhóm"
                    placeholder="Nhập tên nhóm..."
                    value={roomName}
                    submitLabel="Tạo"
                    onChange={setRoomName}
                    onClose={() => setCreateRoomOpen(false)}
                    onSubmit={submitCreateRoom}
                />
            )}

            {joinRoomOpen && (
                <RoomModal
                    title="Tham gia nhóm"
                    placeholder="Nhập tên nhóm..."
                    value={joinRoomName}
                    submitLabel="Tham gia"
                    onChange={setJoinRoomName}
                    onClose={() => setJoinRoomOpen(false)}
                    onSubmit={submitJoinRoom}
                />
            )}
        </div>
    );
}
