import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
    Image,
    Menu,
    PanelRight,
    SendHorizonal,
    Smile,
    Sticker,
    User,
    X,
} from "lucide-react";
import { Message } from "./Message";
import { ChatToolBar } from "./ChatToolBar";
import StickerPicker from "./StickerPicker";
import EmojiCustomPicker from "./EmojiCustomPicker";

interface ChatTarget {
    name: string;
    type: 0 | 1;
    memberCount?: number;
}

interface ChatMessage {
    id: number;
    name: string;
    mes: string;
    createAt: string;
}

interface PendingFile {
    file: File;
    url: string;
}

interface ChatInterfaceProps {
    currentTarget: ChatTarget | null;
    messages: ChatMessage[];
    currentUsername: string;
    onSend: (rawMessage: string) => void;
    closeTabState: boolean;
    onCloseTab: () => void;
    onOpenMenu: () => void;
}

const makePayload = (
    type: "chat" | "sticker" | "attachment",
    content: string,
    attachment: string[] = []
) => JSON.stringify({ type, content, attachment });

export function ChatInterface({
    currentTarget,
    messages,
    currentUsername,
    onSend,
    closeTabState,
    onCloseTab,
    onOpenMenu,
}: ChatInterfaceProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [hasContent, setHasContent] = useState(false);
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [openStickerPicker, setOpenStickerPicker] = useState(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const resizeTextarea = () => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    };

    const handleInput = () => {
        setHasContent(Boolean(textareaRef.current?.value.trim()));
        resizeTextarea();
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart ?? textarea.value.length;
        const end = textarea.selectionEnd ?? start;
        textarea.value =
            textarea.value.slice(0, start) + text + textarea.value.slice(end);
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
        setHasContent(Boolean(textarea.value.trim()));
        resizeTextarea();
    };

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        setPendingFiles((prev) => [
            ...prev,
            ...files.map((file) => ({ file, url: URL.createObjectURL(file) })),
        ]);
        event.target.value = "";
    };

    const removeFile = (index: number) => {
        setPendingFiles((prev) => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((_, fileIndex) => fileIndex !== index);
        });
    };

    const handleSend = () => {
        const text = textareaRef.current?.value.trim() ?? "";
        if (!text && pendingFiles.length === 0) return;

        const attachments = pendingFiles.map((item) => item.url);
        const type = attachments.length > 0 ? "attachment" : "chat";
        onSend(makePayload(type, text, attachments));

        if (textareaRef.current) textareaRef.current.value = "";
        setHasContent(false);
        setPendingFiles([]);
        setOpenStickerPicker(false);
        setOpenEmojiPicker(false);
        resizeTextarea();
    };

    if (!currentTarget) {
        return (
            <div className="overflow-auto flex flex-col h-full items-center justify-center bg-gray-50 relative">
                <Menu
                    size="2.0rem"
                    onClick={onOpenMenu}
                    className="absolute top-4 left-4 lg:hidden p-3 bg-appchat-bluesky rounded-full shadow-md text-white active:bg-gray-100 hover:text-indigo-600 transition-colors"
                />
                <div className="text-center p-4">
                    <p className="text-xl font-semibold text-gray-700">Chào mừng đến với LongChat</p>
                    <p className="text-gray-500 mt-2">Chọn một cuộc trò chuyện để bắt đầu nhắn tin.</p>
                </div>
            </div>
        );
    }

    const targetLabel = currentTarget.name === currentUsername ? "My Document" : currentTarget.name;

    return (
        <div className="py-0 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-1 px-3 border border-gray-200 h-16">
                <div className="flex gap-3 items-center">
                    <Menu
                        size="2.5rem"
                        onClick={onOpenMenu}
                        className="lg:hidden mr-1 text-gray-600 hover:text-black p-2 rounded-full active:bg-gray-200"
                    />
                    <div className="w-12 h-12 rounded-full border p-2 border-black bg-gray-150 flex justify-center items-center">
                        <User />
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{targetLabel}</p>
                        {currentTarget.type === 1 && (
                            <p>{currentTarget.memberCount ?? 0} thành viên</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-1">
                    <PanelRight
                        size="2.25rem"
                        className={`rounded p-2 cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-400 ${closeTabState ? "bg-indigo-200 text-indigo-700" : ""}`}
                        onClick={onCloseTab}
                    />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col gap-1 w-full bg-gray-300/50 p-2">
                <div className="mt-auto" />

                {messages.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">Bắt đầu cuộc trò chuyện...</p>
                )}

                {messages.map((message) => (
                    <Message
                        key={message.id}
                        rawMessage={message.mes}
                        isOwner={message.name === currentUsername}
                        username={message.name === currentUsername ? "Bạn" : message.name}
                        time={message.createAt}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className="mb-16 lg:mb-0">
                <ChatToolBar inputRef={textareaRef} onInsert={handleInput} />
                <div className="flex flex-col p-1 pt-0">
                    {pendingFiles.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            {pendingFiles.map((item, index) => (
                                <div
                                    key={`${item.file.name}-${index}`}
                                    className="relative w-16 h-16 shrink-0 border rounded-lg bg-gray-50 overflow-hidden group"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-80 hover:opacity-100 z-10"
                                    >
                                        <X size={12} />
                                    </button>
                                    {item.file.type.startsWith("image/") ? (
                                        <img
                                            src={item.url}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[10px] text-center p-1 break-all bg-white">
                                            {item.file.name}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                    />

                    <div className="min-h-4 flex p-2 pt-0">
                        <textarea
                            className="min-w-0 text-md bg-neutral-200/75 rounded-3xl p-2 ps-4 flex-1 resize-none border-none outline-none focus:ring-0 focus:ring-offset-0"
                            onChange={handleInput}
                            ref={textareaRef}
                            rows={1}
                            placeholder={`Nhập tin nhắn tới ${targetLabel}...`}
                        />

                        <div className="flex items-start px-3 justify-end gap-3">
                            <div className="flex items-start justify-end gap-3 pt-2">
                                <Image
                                    size="1.5rem"
                                    className="cursor-pointer text-gray-700 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400"
                                    onClick={() => fileInputRef.current?.click()}
                                />
                                <Sticker
                                    size="1.5rem"
                                    className="cursor-pointer text-gray-700 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400"
                                    onClick={() => setOpenStickerPicker((open) => !open)}
                                />
                                {openStickerPicker && (
                                    <StickerPicker
                                        onSelect={(src) => {
                                            onSend(makePayload("sticker", src));
                                            setOpenStickerPicker(false);
                                        }}
                                        onClose={() => setOpenStickerPicker(false)}
                                    />
                                )}
                                <Smile
                                    size="1.5rem"
                                    className="cursor-pointer text-gray-700 dark:text-white hover:text-neutral-500 dark:hover:text-neutral-400"
                                    onClick={() => setOpenEmojiPicker((open) => !open)}
                                />
                                {openEmojiPicker && (
                                    <EmojiCustomPicker
                                        onSelect={insertText}
                                        onClose={() => setOpenEmojiPicker(false)}
                                    />
                                )}
                            </div>
                            <div className="pt-0.5">
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!hasContent && pendingFiles.length === 0}
                                    className={`cursor-pointer rounded-full p-2 transition-colors ${!hasContent && pendingFiles.length === 0
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-indigo-500 hover:bg-indigo-400 text-neutral-100"
                                        }`}
                                >
                                    <SendHorizonal size="1.25rem" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
