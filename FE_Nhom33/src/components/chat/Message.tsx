import { User } from "lucide-react";

interface MessageContent {
    type: "chat" | "sticker" | "attachment";
    content: string;
    attachment: string[];
}

interface MessageProps {
    rawMessage: string;
    isOwner: boolean;
    username: string;
    time: string;
}

const extractMessageContent = (rawMessage: string): MessageContent => {
    if (!rawMessage) {
        return { type: "chat", content: "", attachment: [] };
    }

    try {
        const parsed = JSON.parse(rawMessage);
        if (typeof parsed === "object" && parsed !== null) {
            if (parsed.type || parsed.content || parsed.attachment) {
                return {
                    type: parsed.type ?? "chat",
                    content: parsed.content ?? "",
                    attachment: parsed.attachment ?? [],
                };
            }
        }
    } catch {
        /* Nội dung không phải JSON, hiển thị dạng text */
    }

    return { type: "chat", content: String(rawMessage), attachment: [] };
};

const formatTime = (time: string) => {
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

export function Message({ rawMessage, isOwner, username, time }: MessageProps) {
    const contentObj = extractMessageContent(rawMessage);
    if (!contentObj.content && contentObj.attachment.length === 0) return null;

    const formattedTime = formatTime(time);

    return (
        <div className="w-full">
            <div className={`flex gap-1 ${isOwner ? "justify-end" : "justify-start"}`}>
                {!isOwner && (
                    <div className="w-10 h-10 my-1 rounded-full border p-2 border-black bg-gray-150 flex justify-center items-center bg-white shrink-0">
                        <User size={20} />
                    </div>
                )}
                <div className="max-w-[60%] lg:max-w-[50%]">
                    <div className="overflow-x-auto">
                        {contentObj.type === "sticker" && (
                            <div className="p-2">
                                {!isOwner && (
                                    <p className="text-gray-500 text-xs font-semibold mb-1">
                                        <span className="bg-gray-300 p-1 px-2 rounded-lg">
                                            {username}
                                        </span>
                                    </p>
                                )}
                                <img
                                    src={contentObj.content}
                                    alt="Sticker"
                                    className="w-32 h-32 object-contain"
                                />
                                {formattedTime && (
                                    <div className="w-full flex justify-end">
                                        <p className={`${isOwner ? "text-indigo-200" : "text-gray-500"} text-end rounded text-[10px] mt-2`}>
                                            <span className="w-fit p-1 rounded-lg bg-neutral-300">
                                                {formattedTime}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {contentObj.type === "attachment" && (
                            <div className={`flex flex-col ${isOwner ? "items-end" : "items-start"} gap-1 my-1`}>
                                {contentObj.attachment.map((url, index) => (
                                    <img
                                        key={`${url.slice(0, 24)}-${index}`}
                                        src={url}
                                        alt="Attachment"
                                        className="max-w-full rounded-lg"
                                    />
                                ))}
                                {(contentObj.content || formattedTime) && (
                                    <div className={`w-fit mt-1 p-2 px-3 rounded-2xl shadow-sm ${isOwner ? "bg-indigo-600 text-white" : "bg-white"}`}>
                                        {contentObj.content}
                                        {formattedTime && (
                                            <div className="w-full flex justify-end">
                                                <p className={`${isOwner ? "text-indigo-200" : "text-gray-500"} text-end rounded text-[10px] mt-2`}>
                                                    <span className="w-fit p-1 rounded-lg">
                                                        {formattedTime}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {(contentObj.type === "chat" || !contentObj.type) && (
                            <div className={`mt-1 p-2 px-3 break-words rounded-2xl shadow-sm ${isOwner ? "bg-indigo-600 text-white" : "bg-white"}`}>
                                {!isOwner && (
                                    <p className="text-gray-500 text-xs font-semibold mb-1">
                                        {username}
                                    </p>
                                )}
                                {contentObj.content}
                                {formattedTime && (
                                    <div className="w-full flex justify-end">
                                        <p className={`${isOwner ? "text-indigo-200" : "text-gray-500"} text-end rounded text-[10px] mt-2`}>
                                            <span className="w-fit p-1 rounded-lg">
                                                {formattedTime}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
