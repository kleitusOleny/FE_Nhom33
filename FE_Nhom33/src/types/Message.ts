export type MessagePayloadType = "chat" | "sticker" | "attachment";

export interface MessageContent {
    type: MessagePayloadType;
    content: string;
    attachment: string[];
}

