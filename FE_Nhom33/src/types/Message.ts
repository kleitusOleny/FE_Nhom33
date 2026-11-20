export interface Message {
    type: "chat" | "sticker" | "attachment"
    content: string,
    attachment: string[]
}

