export type MessagePayloadType = "chat" | "sticker" | "attachment";

export type AttachmentKind = "image" | "video" | "file";

export interface MessageAttachment {
    url: string;
    name?: string;
    kind?: AttachmentKind;
}

/**
 * Tin nhắn cũ chỉ lưu URL dạng string, tin nhắn mới lưu object để giữ
 * tên file gốc và loại file. Renderer cần hỗ trợ cả hai.
 */
export type AttachmentValue = string | MessageAttachment;

export interface MessageContent {
    type: MessagePayloadType;
    content: string;
    attachment: AttachmentValue[];
}
