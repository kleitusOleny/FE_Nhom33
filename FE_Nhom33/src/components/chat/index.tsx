import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ChatInterface } from "./ChatInterface";
import { ChatMenuBar } from "./ChatMenuBar";
import { ChatSideBar } from "./ChatSideBar";
import { RoomMenuBar } from "./RoomMenuBar";

interface ChatTarget {
    name: string;
    type: 0 | 1;
    actionTime?: string;
    memberCount?: number;
}

interface ChatMessage {
    id: number;
    name: string;
    mes: string;
    createAt: string;
}

const CURRENT_USERNAME = "minh";

const minutesAgo = (minutes: number) =>
    new Date(Date.now() - minutes * 60_000).toISOString();

const makePayload = (
    type: "chat" | "sticker" | "attachment",
    content: string,
    attachment: string[] = []
) => JSON.stringify({ type, content, attachment });

const svgImage = (label: string, color: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="white" font-family="Arial, sans-serif" font-size="30" text-anchor="middle" dominant-baseline="central">${label}</text></svg>`
    )}`;

const stickerImage = (emoji: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><text x="50%" y="50%" font-size="84" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`
    )}`;

const INITIAL_CHATS: ChatTarget[] = [
    { name: "Nguyễn Văn A", type: 0, actionTime: minutesAgo(3) },
    { name: "Nhóm 33", type: 1, actionTime: minutesAgo(35), memberCount: 6 },
    { name: "Trần Thị B", type: 0, actionTime: minutesAgo(180) },
    { name: CURRENT_USERNAME, type: 0, actionTime: minutesAgo(1440) },
];

const ATTACHMENTS: Record<string, string[]> = {
    "Nguyễn Văn A": [
        svgImage("Chat UI", "#6366f1"),
        svgImage("Dashboard", "#0ea5e9"),
    ],
    "Nhóm 33": [
        svgImage("Design", "#f59e0b"),
        svgImage("Meeting", "#10b981"),
        svgImage("Demo", "#ec4899"),
    ],
    [CURRENT_USERNAME]: [svgImage("Ghi chú", "#64748b")],
};

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
    "Nguyễn Văn A": [
        {
            id: 1,
            name: "Nguyễn Văn A",
            mes: makePayload("chat", "Chào Minh, giao diện chat nhìn ổn chưa?"),
            createAt: minutesAgo(30),
        },
        {
            id: 2,
            name: CURRENT_USERNAME,
            mes: makePayload("chat", "Ổn rồi, tớ đang dùng dữ liệu mẫu để tập trung vào UI."),
            createAt: minutesAgo(28),
        },
        {
            id: 3,
            name: "Nguyễn Văn A",
            mes: makePayload("attachment", "Ảnh giao diện mới nè", [svgImage("Chat UI", "#6366f1")]),
            createAt: minutesAgo(25),
        },
        {
            id: 4,
            name: "Nguyễn Văn A",
            mes: makePayload("sticker", stickerImage("👍")),
            createAt: minutesAgo(24),
        },
    ],
    "Nhóm 33": [
        {
            id: 1,
            name: "Trần Thị B",
            mes: makePayload("chat", "Cả nhóm xem lại bố cục trang chat giúp mình nhé."),
            createAt: minutesAgo(60),
        },
        {
            id: 2,
            name: "Nguyễn Văn A",
            mes: makePayload("chat", "Phần sidebar với danh sách chat ổn rồi."),
            createAt: minutesAgo(45),
        },
        {
            id: 3,
            name: CURRENT_USERNAME,
            mes: makePayload("chat", "Mình đang chỉnh lại để chỉ còn giao diện, không gọi API."),
            createAt: minutesAgo(35),
        },
    ],
    "Trần Thị B": [
        {
            id: 1,
            name: "Trần Thị B",
            mes: makePayload("chat", "Khi nào có bản demo UI gửi mình xem với nhé."),
            createAt: minutesAgo(180),
        },
    ],
    [CURRENT_USERNAME]: [
        {
            id: 1,
            name: CURRENT_USERNAME,
            mes: makePayload("chat", "Ghi chú: hoàn thiện giao diện chat trước, ghép API sau."),
            createAt: minutesAgo(1440),
        },
    ],
};

export function MainChatUIComponent() {
    const [chats, setChats] = useState<ChatTarget[]>(INITIAL_CHATS);
    const [currentTarget, setCurrentTarget] = useState<ChatTarget | null>(INITIAL_CHATS[0]);
    const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
    const [chatMenuState, setChatMenuState] = useState(true);
    const [roomMenuState, setRoomMenuState] = useState(false);
    const [viewAttachment, setViewAttachment] = useState({ state: false, index: 0 });
    const [nextMessageId, setNextMessageId] = useState(100);

    const selectChat = (chat: ChatTarget) => {
        setCurrentTarget(chat);
        setRoomMenuState(false);
        if (window.innerWidth < 1024) {
            setChatMenuState(false);
        }
    };

    const ensureChat = (name: string, type: 0 | 1): ChatTarget | null => {
        const trimmed = name.trim();
        if (!trimmed) return null;

        const existing = chats.find(
            (chat) => chat.type === type && chat.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (existing) return existing;

        const created: ChatTarget = {
            name: trimmed,
            type,
            actionTime: new Date().toISOString(),
            memberCount: type === 1 ? 2 : undefined,
        };
        setChats((prev) => [created, ...prev]);
        setMessages((prev) => ({ ...prev, [trimmed]: [] }));
        return created;
    };

    const handleCreateChat = (name: string) => {
        const chat = ensureChat(name, 0);
        if (chat) selectChat(chat);
    };

    const handleCreateRoom = (name: string) => {
        const chat = ensureChat(name, 1);
        if (chat) selectChat(chat);
    };

    const handleSend = (rawMessage: string) => {
        if (!currentTarget) return;

        const message: ChatMessage = {
            id: nextMessageId,
            name: CURRENT_USERNAME,
            mes: rawMessage,
            createAt: new Date().toISOString(),
        };

        setNextMessageId((id) => id + 1);
        setMessages((prev) => ({
            ...prev,
            [currentTarget.name]: [...(prev[currentTarget.name] ?? []), message],
        }));
        setChats((prev) =>
            prev.map((chat) =>
                chat.name === currentTarget.name ? { ...chat, actionTime: message.createAt } : chat
            )
        );
    };

    const currentMessages = currentTarget ? messages[currentTarget.name] ?? [] : [];
    const attachments = currentTarget ? ATTACHMENTS[currentTarget.name] ?? [] : [];
    const members =
        currentTarget?.type === 1
            ? [CURRENT_USERNAME, "Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"]
            : [];

    return (
        <div className="flex w-full h-screen overflow-hidden">
            <div className="lg:flex lg:w-[400px] h-full transition-all duration-300">
                <div className="z-40 lg:flex w-0 lg:w-[15%]">
                    <ChatSideBar onOpenMenu={() => setChatMenuState(true)} />
                </div>

                <div
                    className={`
                        w-full lg:w-[85%] border-r
                        fixed bg-white top-0 bottom-16 z-50
                        border-l transition-all duration-300 ease-in-out transform shadow-xl lg:shadow-none
                        ${chatMenuState
                            ? "w-full translate-x-0 opacity-100"
                            : "w-full translate-x-full opacity-0 pointer-events-none"
                        }
                        lg:relative lg:translate-x-0
                        ${chatMenuState
                            ? "lg:w-100 lg:opacity-100"
                            : "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-none"
                        }
                    `}
                >
                    <ChatMenuBar
                        chats={chats}
                        currentTarget={currentTarget}
                        currentUsername={CURRENT_USERNAME}
                        onSelectChat={selectChat}
                        onCreateChat={handleCreateChat}
                        onCreateRoom={handleCreateRoom}
                        onJoinRoom={handleCreateRoom}
                    />
                </div>
            </div>

            <div className="w-full lg:flex lg:flex-1 z-0">
                <ChatInterface
                    key={currentTarget?.name ?? "empty"}
                    currentTarget={currentTarget}
                    messages={currentMessages}
                    currentUsername={CURRENT_USERNAME}
                    onSend={handleSend}
                    closeTabState={roomMenuState}
                    onCloseTab={() => setRoomMenuState((state) => !state)}
                    onOpenMenu={() => setChatMenuState(true)}
                />
            </div>

            <div
                className={`
                    fixed bg-white h-full inset-y-0 z-50
                    border-l transition-all duration-300 ease-in-out transform shadow-xl lg:shadow-none
                    ${roomMenuState
                        ? "w-full translate-x-0 opacity-100"
                        : "w-full translate-x-full opacity-0 pointer-events-none"
                    }
                    lg:relative lg:translate-x-0
                    ${roomMenuState
                        ? "lg:w-100 lg:opacity-100"
                        : "lg:w-0 lg:opacity-0 lg:overflow-hidden lg:border-none"
                    }
                `}
            >
                <RoomMenuBar
                    currentTarget={currentTarget}
                    currentUsername={CURRENT_USERNAME}
                    members={members}
                    attachments={attachments}
                    onClose={() => setRoomMenuState(false)}
                    onViewAttachment={(index) => setViewAttachment({ state: true, index })}
                />
            </div>

            {viewAttachment.state && attachments.length > 0 && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setViewAttachment({ state: false, index: 0 })}
                >
                    <button
                        type="button"
                        className="absolute top-4 right-4 text-white hover:text-neutral-300"
                        onClick={() => setViewAttachment({ state: false, index: 0 })}
                        aria-label="Đóng"
                    >
                        <X size={30} />
                    </button>

                    {viewAttachment.index > 0 && (
                        <button
                            type="button"
                            className="absolute left-4 text-white hover:text-neutral-300"
                            onClick={(event) => {
                                event.stopPropagation();
                                setViewAttachment((state) => ({ ...state, index: state.index - 1 }));
                            }}
                            aria-label="Ảnh trước"
                        >
                            <ChevronLeft size={40} />
                        </button>
                    )}

                    <img
                        src={attachments[viewAttachment.index]}
                        alt={`attachment-${viewAttachment.index}`}
                        className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg"
                        onClick={(event) => event.stopPropagation()}
                    />

                    {viewAttachment.index < attachments.length - 1 && (
                        <button
                            type="button"
                            className="absolute right-4 text-white hover:text-neutral-300"
                            onClick={(event) => {
                                event.stopPropagation();
                                setViewAttachment((state) => ({ ...state, index: state.index + 1 }));
                            }}
                            aria-label="Ảnh sau"
                        >
                            <ChevronRight size={40} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
