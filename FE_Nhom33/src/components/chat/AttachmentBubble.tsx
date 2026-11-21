import {
    Download,
    File,
    FileArchive,
    FileSpreadsheet,
    FileText,
    Music,
    Video,
} from "lucide-react";
import {
    downloadAttachment,
    getAttachmentKind,
    getFileNameFromUrl,
} from "@/services/storageService";
import type { AttachmentValue, MessageAttachment } from "@/types/Message";

const getFileIcon = (name: string) => {
    const extension = name.split(".").pop()?.toLowerCase() ?? "";

    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
        return <FileArchive size={22} />;
    }
    if (["xls", "xlsx", "csv"].includes(extension)) {
        return <FileSpreadsheet size={22} />;
    }
    if (["mp3", "wav", "ogg", "m4a"].includes(extension)) {
        return <Music size={22} />;
    }
    if (["mp4", "webm", "mov", "m4v", "avi", "mkv"].includes(extension)) {
        return <Video size={22} />;
    }
    if (["pdf", "doc", "docx", "txt", "ppt", "pptx"].includes(extension)) {
        return <FileText size={22} />;
    }
    return <File size={22} />;
};

interface AttachmentBubbleProps {
    value: AttachmentValue;
}

export function AttachmentBubble({ value }: AttachmentBubbleProps) {
    const attachment: MessageAttachment = typeof value === "string" ? { url: value } : value;
    const kind = attachment.kind ?? getAttachmentKind(attachment.url);
    const name = attachment.name ?? getFileNameFromUrl(attachment.url);

    const handleDownload = () => {
        void downloadAttachment(attachment.url, name);
    };

    if (kind === "image") {
        return (
            <div className="group relative max-w-full">
                <img
                    src={attachment.url}
                    alt={name}
                    title={name}
                    loading="lazy"
                    className="max-w-full cursor-zoom-in rounded-lg"
                    onClick={() => window.open(attachment.url, "_blank", "noopener,noreferrer")}
                />
                <button
                    type="button"
                    onClick={handleDownload}
                    title={`Tải ${name}`}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <Download size={16} />
                </button>
            </div>
        );
    }

    if (kind === "video") {
        return (
            <div className="group relative max-w-full">
                <video
                    src={attachment.url}
                    controls
                    preload="metadata"
                    className="max-h-[360px] max-w-full rounded-lg bg-black"
                />
                <button
                    type="button"
                    onClick={handleDownload}
                    title={`Tải ${name}`}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-100 transition-opacity hover:bg-black/80 sm:opacity-0 sm:group-hover:opacity-100"
                >
                    <Download size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 text-gray-800 shadow-sm">
            <span className="shrink-0 text-indigo-500">{getFileIcon(name)}</span>
            <span className="min-w-0 flex-1 truncate text-sm" title={name}>
                {name}
            </span>
            <button
                type="button"
                onClick={handleDownload}
                title={`Tải ${name}`}
                className="shrink-0 rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600"
            >
                <Download size={18} />
            </button>
        </div>
    );
}
