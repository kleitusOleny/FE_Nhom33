import {
    SendMsgAuthenticationPayload, SendMsgCheckUserExistPayload, SendMsgCheckUserOnlinePayload,
    SendMsgCheckUserPayload,
    SendMsgGetChatPayload,
    SendMsgGetUserListPayload,
    SendMsgLogOutPayload, SendMsgOutRoomPayload,
    SendMsgReLoginPayload,
    SendMsgRoomManagementPayload,
    SendMsgSendChatPayload,
} from "./WebsocketSendPayload"
import {WEBSOCKET_ACTION, WebSocketEvent} from "./WebSoketMessage"

interface SendMessageDetail<K extends WebSocketEvent, V> {
    action: typeof WEBSOCKET_ACTION,
    data: {
        event: K,
        data: V
    }
}

export interface WsSendMsgPayloadMap {
    [WebSocketEvent.REGISTER]: SendMsgAuthenticationPayload,
    [WebSocketEvent.LOGIN]: SendMsgAuthenticationPayload,
    [WebSocketEvent.RE_LOGIN]: SendMsgReLoginPayload,
    [WebSocketEvent.LOGOUT]: SendMsgLogOutPayload,
    [WebSocketEvent.CREATE_ROOM]: SendMsgRoomManagementPayload,
    [WebSocketEvent.JOIN_ROOM]: SendMsgRoomManagementPayload,
    [WebSocketEvent.GET_ROOM_CHAT_MES]: SendMsgGetChatPayload,
    [WebSocketEvent.GET_PEOPLE_CHAT_MES]: SendMsgGetChatPayload,
    [WebSocketEvent.SEND_CHAT_TO_PEOPLE]: SendMsgSendChatPayload,
    [WebSocketEvent.SEND_CHAT_TO_ROOM]: SendMsgSendChatPayload,
    [WebSocketEvent.CHECK_USER]: SendMsgCheckUserPayload,
    [WebSocketEvent.GET_USER_LIST]: SendMsgGetUserListPayload,
    [WebSocketEvent.OUT_ROOM]: SendMsgOutRoomPayload,
    [WebSocketEvent.CHECK_USER_ONLINE]: SendMsgCheckUserOnlinePayload,
    [WebSocketEvent.CHECK_USER_EXIST]: SendMsgCheckUserExistPayload
}

export type WsSendMessage<K extends keyof WsSendMsgPayloadMap> = SendMessageDetail<K, WsSendMsgPayloadMap[K]>