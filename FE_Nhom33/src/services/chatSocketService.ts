import { WebsocketInstance } from "@/socket/WebsocketInstance";
import { WebSocketEvent } from "@/socket/types/WebSoketMessage";
import type { ChatTarget } from "@/store/slice/chatSlice";

export const chatSocketService = {
  fetchUserList() {
    WebsocketInstance.getInstance().send(WebSocketEvent.GET_USER_LIST, {});
  },

  fetchChatHistory(target: ChatTarget, page = 1) {
    const ws = WebsocketInstance.getInstance();
    if (target.type === 1) {
      ws.send(WebSocketEvent.GET_ROOM_CHAT_MES, { name: target.name, page });
    } else {
      ws.send(WebSocketEvent.GET_PEOPLE_CHAT_MES, { name: target.name, page });
    }
  },

  sendMessage(target: ChatTarget, mes: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.SEND_CHAT_TO_PEOPLE, {
      type: target.type === 1 ? "room" : "people",
      to: target.name,
      mes,
    });
  },

  createRoom(name: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.CREATE_ROOM, { name });
  },

  joinRoom(name: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.JOIN_ROOM, { name });
  },

  leaveRoom(name: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.OUT_ROOM, { name });
  },

  checkUserExist(user: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.CHECK_USER_EXIST, { user });
  },

  checkUserOnline(user: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.CHECK_USER_ONLINE, { user });
  },

  reLogin(user: string, code: string) {
    WebsocketInstance.getInstance().send(WebSocketEvent.RE_LOGIN, { user, code });
  },

  logout() {
    WebsocketInstance.getInstance().send(WebSocketEvent.LOGOUT, {});
  },
};
