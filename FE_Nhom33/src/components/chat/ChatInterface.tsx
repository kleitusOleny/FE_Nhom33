import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import {
    FileText,
    Image,
    Loader2,
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
import { useUpload } from "@/hooks/useUpload";
import { validateAttachment } from "@/services/storageService";
import type { AttachmentValue } from "@/types/Message";
import {
    hasMarkdownSyntax,
    MARKDOWN_PROSE_CLASS,
    markdownToHtml,
} from "@/utils/markdownUtil";

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
    attachment: AttachmentValue[] = []
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
    const [inputText, setInputText] = useState("");
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [openStickerPicker, setOpenStickerPicker] = useState(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const { progress, isUploading, startMultipleUpload } = useUpload();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const resizeTextarea = () => {
        if (!textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    };

    const handleInput = () => {
        const val = textareaRef.current?.value ?? "";
        setInputText(val);
        setHasContent(Boolean(val.trim()));
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
        setInputText(textarea.value);
        setHasContent(Boolean(textarea.value.trim()));
        resizeTextarea();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.nativeEvent.isComposing || event.key !== "Enter") return;

        event.preventDefault();
        if (event.altKey) {
            insertText("\n");
        } else {
            void handleSend();
        }
    };

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        const accepted: PendingFile[] = [];
        const errors: string[] = [];

        files.forEach((file) => {
            const validation = validateAttachment(file);
            if (validation.ok) {
                accepted.push({ file, url: URL.createObjectURL(file) });
            } else {
                errors.push(`${file.name}: ${validation.message}`);
            }
        });

        if (accepted.length > 0) {
            setPendingFiles((prev) => [...prev, ...accepted]);
        }
        setUploadError(errors.join("\n"));
        event.target.value = "";
    };

    const removeFile = (index: number) => {
        setPendingFiles((prev) => {
            const target = prev[index];
            if (target) URL.revokeObjectURL(target.url);
            return prev.filter((_, fileIndex) => fileIndex !== index);
        });
    };

    const handleSend = async () => {
        if (isUploading) return;

        const text = textareaRef.current?.value.trim() ?? "";
        if (!text && pendingFiles.length === 0) return;

        setUploadError("");
        let attachments: AttachmentValue[] = [];

        if (pendingFiles.length > 0) {
            const result = await startMultipleUpload(
                "chat",
                pendingFiles.map((item) => item.file)
            );

            if (!result.result) {
                setUploadError(result.message);
                return;
            }

            attachments = result.attachments;
            if (result.errors.length > 0) {
                setUploadError(result.message);
            }

            pendingFiles.forEach((item) => URL.revokeObjectURL(item.url));
        }

        const type = attachments.length > 0 ? "attachment" : "chat";
        onSend(makePayload(type, text, attachments));

        if (textareaRef.current) textareaRef.current.value = "";
        setInputText("");
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
                    {(isUploading || uploadError) && (
                        <div className="px-2 pb-1 text-xs">
                            {isUploading ? (
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span className="shrink-0">Đang tải lên {progress}%</span>
                                    <div className="h-1 flex-1 overflow-hidden rounded bg-gray-200">
                                        <div
                                            className="h-full rounded bg-indigo-500 transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <p className="whitespace-pre-line text-red-500">{uploadError}</p>
                            )}
                        </div>
                    )}

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
                                        disabled={isUploading}
                                        title={isUploading ? "Đang tải lên, không thể xoá" : "Xoá tệp"}
                                        className={`absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl z-10 ${isUploading ? "cursor-not-allowed opacity-40" : "opacity-80 hover:opacity-100"}`}
                                    >
                                        <X size={12} />
                                    </button>
                                    {item.file.type.startsWith("image/") ? (
                                        <img
                                            src={item.url}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : item.file.type.startsWith("video/") ? (
                                        <video
                                            src={item.url}
                                            muted
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full gap-1 text-[10px] text-center p-1 bg-white">
                                            <FileText size={18} className="shrink-0 text-indigo-500" />
                                            <span className="w-full truncate" title={item.file.name}>
                                                {item.file.name}
                                            </span>
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
                    />

                    {hasMarkdownSyntax(inputText) && (
                        <div className="mx-3 mb-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 max-h-28 overflow-y-auto">
                            <p className="text-[11px] font-semibold text-gray-400 mb-1">
                                Xem trước:
                            </p>
                            <div
                                className={MARKDOWN_PROSE_CLASS}
                                dangerouslySetInnerHTML={{
                                    __html: markdownToHtml(inputText),
                                }}
                            />
                        </div>
                    )}

                    <div className="min-h-4 flex p-2 pt-0">
                        <textarea
                            className="min-w-0 text-md bg-neutral-200/75 rounded-3xl p-2 ps-4 flex-1 resize-none border-none outline-none focus:ring-0 focus:ring-offset-0"
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            ref={textareaRef}
                            rows={1}
                            placeholder={`Nhập tin nhắn gửi tới ${targetLabel}...`}
                        />

                        <div className="flex items-start px-3 justify-end gap-3">
                            <div className="relative flex items-start justify-end gap-3 pt-2">
                                <Image
                                    size="1.5rem"
                                    className={`text-gray-600 hover:text-blue-600 transition-colors ${isUploading ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                                    onClick={() => {
                                        if (!isUploading) {
                                            setOpenStickerPicker(false);
                                            setOpenEmojiPicker(false);
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                />
                                <Sticker
                                    size="1.5rem"
                                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                                    onClick={() => {
                                        setOpenEmojiPicker(false);
                                        setOpenStickerPicker((open) => !open);
                                    }}
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
                                    className="cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                                    onClick={() => {
                                        setOpenStickerPicker(false);
                                        setOpenEmojiPicker((open) => !open);
                                    }}
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
                                    onClick={() => { void handleSend(); }}
                                    disabled={isUploading || (!hasContent && pendingFiles.length === 0)}
                                    className={`rounded-full p-2 transition-colors text-white ${isUploading || (!hasContent && pendingFiles.length === 0)
                                        ? "bg-blue-300 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                        }`}
                                >
                                    {isUploading ? (
                                        <Loader2 size="1.25rem" className="animate-spin" />
                                    ) : (
                                        <SendHorizonal size="1.25rem" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
