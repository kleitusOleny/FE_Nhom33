import {
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    Cloud,
    Copy,
    ImageOff,
    Share,
    User,
} from "lucide-react";
import { useState } from "react";

interface ChatTarget {
    name: string;
    type: 0 | 1;
}

interface RoomMenuBarProps {
    currentTarget: ChatTarget | null;
    currentUsername: string;
    members: string[];
    attachments: string[];
    onClose: () => void;
    onViewAttachment: (index: number) => void;
}

export function RoomMenuBar({
    currentTarget,
    currentUsername,
    members,
    attachments,
    onClose,
    onViewAttachment,
}: RoomMenuBarProps) {
    const [memberState, setMemberState] = useState(true);
    const [attachmentState, setAttachmentState] = useState(true);
    const [copied, setCopied] = useState(false);

    if (!currentTarget) return null;

    const isCurrentUser = currentTarget.name === currentUsername;
    const title = isCurrentUser ? "My Document" : currentTarget.name;
    const inviteGroupLink =
        currentTarget.type === 1
            ? `${window.location.origin}/g/${encodeURIComponent(currentTarget.name)}`
            : "";

    const handleCopy = async () => {
        if (!inviteGroupLink) return;

        try {
            await navigator.clipboard.writeText(inviteGroupLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            /* Clipboard không khả dụng */
        }
    };

    const handleShare = async () => {
        if (!inviteGroupLink) return;

        if (navigator.share) {
            try {
                await navigator.share({ title: currentTarget.name, url: inviteGroupLink });
            } catch {
                /* Người dùng hủy chia sẻ */
            }
        } else {
            await handleCopy();
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="px-4 pt-4 lg:p-0 lg:hidden">
                <ChevronLeft
                    size="1.75rem"
                    className="cursor-pointer dark:text-white hover:text-neutral-400 dark:hover:text-neutral-500"
                    onClick={onClose}
                />
            </div>

            <div className="flex items-center justify-center flex-col gap-1 p-4">
                <div
                    className={`w-18 h-18 rounded-full border p-2 flex justify-center items-center ${isCurrentUser ? "bg-blue-400" : "bg-gray-150 border-black"}`}
                >
                    {isCurrentUser ? (
                        <Cloud size="2.5rem" className="text-white" fill="white" />
                    ) : (
                        <User size="2.5rem" />
                    )}
                </div>
                <p className="text-lg font-semibold">{title}</p>
            </div>

            <div className="px-2 overflow-y-auto">
                {/* Members */}
                {currentTarget.type === 1 && members.length > 0 && (
                    <div className="my-1">
                        <div
                            className="cursor-pointer p-2 rounded-lg flex justify-between hover:bg-neutral-100 active:bg-neutral-200"
                            onClick={() => setMemberState((state) => !state)}
                        >
                            <h5 className="font-semibold">Thành viên trong nhóm</h5>
                            {memberState ? <ChevronUp /> : <ChevronDown />}
                        </div>
                        {memberState && (
                            <div className="flex flex-col overflow-y-auto h-40 border-b">
                                {members.map((member) => (
                                    <div
                                        key={member}
                                        className="rounded cursor-pointer flex gap-2 items-center hover:bg-neutral-200 p-1"
                                    >
                                        <div className="my-1 rounded-full border p-2 border-black bg-gray-150 flex justify-center items-center bg-white shrink-0">
                                            <User size="1rem" />
                                        </div>
                                        <span>
                                            {`${member} ${currentUsername === member ? "(Bạn)" : ""}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Attachments */}
                <div className="my-1">
                    <div
                        className="cursor-pointer p-2 rounded-lg flex justify-between hover:bg-neutral-100 active:bg-neutral-200"
                        onClick={() => setAttachmentState((state) => !state)}
                    >
                        <h5 className="font-semibold">Ảnh & Video</h5>
                        {attachmentState ? <ChevronUp /> : <ChevronDown />}
                    </div>
                    {attachmentState && (
                        <div className="mt-2">
                            {attachments.length === 0 ? (
                                <div className="gap-3">
                                    <div className="flex flex-col items-center justify-center gap-2 h-40">
                                        <ImageOff size="2rem" className="text-neutral-500" />
                                        <p className="text-center text-neutral-500 text-sm">
                                            Không có ảnh & video được gửi
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-1 w-full max-h-47 overflow-y-auto">
                                    {attachments.map((attachment, index) => (
                                        <div
                                            key={`${attachment.slice(0, 24)}-${index}`}
                                            className="w-full aspect-square overflow-hidden rounded-lg"
                                        >
                                            <img
                                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                                src={attachment}
                                                alt={`attachment-${index}`}
                                                onClick={() => onViewAttachment(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Invite link */}
                {currentTarget.type === 1 && (
                    <div className="my-1 p-2">
                        <h5 className="font-semibold">Link tham gia nhóm</h5>
                        <div className="flex flex-1 truncate justify-between items-center gap-4">
                            <a
                                href={inviteGroupLink}
                                className="underline text-blue-500 hover:text-blue-400 active:text-blue-300 text-sm min-w-0"
                            >
                                <p className="truncate">{inviteGroupLink}</p>
                            </a>

                            <div className="flex gap-2 justify-end shrink-0">
                                <div
                                    className="cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 w-10 h-10 flex justify-center items-center"
                                    title={copied ? "Đã sao chép" : "Sao chép"}
                                    onClick={handleCopy}
                                >
                                    <Copy size="1.25rem" />
                                </div>
                                <div
                                    className="cursor-pointer rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 w-10 h-10 flex justify-center items-center"
                                    title="Chia sẻ"
                                    onClick={handleShare}
                                >
                                    <Share size="1.25rem" />
                                </div>
                            </div>
                        </div>
                        {copied && <p className="text-xs text-green-600 mt-1">Đã sao chép link mời</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
