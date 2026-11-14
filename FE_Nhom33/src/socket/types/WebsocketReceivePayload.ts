export interface ReceiveMsgLoginPayload {
    RE_LOGIN_CODE: string
}

export interface ReceiveMsgReLoginPayload {
    RE_LOGIN_CODE: string
}

export interface ChatDataRoom { id: number, name: string, type: number, to: string, mes: string, createAt: string }
export interface ReceiveMsgSendChatRoomPayload {
    id: number,
    name: string,
    type: number,
    to: string,
    mes: string,
    createAt?: string,
}
export interface ReceiveMsgRoomManagementPayload {
    id: number,
    name: string,
    own: string,
    userList: { id: number, name: string }[],
    chatData: ChatDataRoom[]
}

export interface ReceiveMsgGetChatRoomPayload {
    id: number,
    name: string,
    own: string,
    userList: { id: number, name: string }[],
    chatData: ChatDataRoom[]
}

export interface ReceiveMsgGetChatPeoplePayload {
    id: number,
    name: string,
    type: number,
    to: string,
    mes: string,
    createAt: string
}

export interface ReceiveMsgSendChatPayload { }

export interface ReceiveMsgCheckUserPayload {
    status: boolean
}

export interface ReceiveMsgGetUserListPayload {
    name: string,
    type: number,
    actionTime: string
}
export interface ReceiveOutRoomPayload {
    name: string;
}
export interface ReceiveCheckUserOnlinePayload {
    user: string;
    status: boolean;
}

export interface ReceiveCheckUserExistPayload {
    user: string;
    exists: boolean;
}