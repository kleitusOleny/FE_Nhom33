export type MessagePayloadType = "chat" | "sticker" | "attachment";

export type AttachmentKind = "image" | "video" | "file";

export interface MessageAttachment {
    url: string;
    name?: string;
    kind?: AttachmentKind;
}
export type AttachmentValue = string | MessageAttachment;

export interface MessageContent {
    type: MessagePayloadType;
    content: string;
    attachment: AttachmentValue[];
}
