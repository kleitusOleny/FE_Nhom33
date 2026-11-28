import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { WebsocketInstance } from "@/socket/WebsocketInstance";
import { WebSocketEvent } from "@/socket/types/WebSoketMessage";
import { chatSocketService } from "@/services/chatSocketService";
import { logout } from "@/store/slice/authSlice";
import {
  addIncomingMessage, resetChatState, setCurrentTarget, setPeopleHistory, setRoomHistory, setUserList,
  type ChatMessage, type ChatTarget,
} from "@/store/slice/chatSlice";

import type { AppDispatch, RootState } from "@/store/store";

export function useChatSocket(enabled: boolean) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const currentTarget = useSelector(
    (state: RootState) => state.chat.currentTarget
  );

  const currentTargetRef = useRef<ChatTarget | null>(currentTarget);
  useEffect(() => {
    currentTargetRef.current = currentTarget;
  }, [currentTarget]);

  useEffect(() => {
    if (!enabled) return;

    const ws = WebsocketInstance.getInstance();
    const myUsername = (localStorage.getItem("username") || "").trim();

    const unsubUserList = ws.subscribe(WebSocketEvent.GET_USER_LIST, (res) => {
      if (res.status === "success") {
        const mapped: ChatTarget[] = res.data.map((item) => ({
          name: item.name,
          type: item.type === 1 ? 1 : 0,
          actionTime: item.actionTime,
        }));
        dispatch(setUserList(mapped));
      }
    });

    const unsubPeopleHistory = ws.subscribe(
      WebSocketEvent.GET_PEOPLE_CHAT_MES,
      (res) => {
        if (res.status === "success") {
          const list = Array.isArray(res.data) ? res.data : [];
          let targetName = currentTargetRef.current?.name || "";
          if (list.length > 0 && myUsername) {
            const first = list[0];
            targetName = first.name === myUsername ? first.to : first.name;
          }
          if (targetName) {
            dispatch(setPeopleHistory({ targetName, messages: list }));
          }
        }
      }
    );

    const unsubRoomHistory = ws.subscribe(
      WebSocketEvent.GET_ROOM_CHAT_MES,
      (res) => {
        if (res.status === "success") {
          const raw = res.data as unknown as {
            name: string;
            own?: string;
            userList?: { id: number; name: string }[];
            user?: { id: number; name: string }[];
            chatData?: ChatMessage[];
            chatMess?: ChatMessage[];
          };
          dispatch(
            setRoomHistory({
              name: raw.name,
              own: raw.own,
              members: raw.userList ?? raw.user ?? [],
              messages: raw.chatData ?? raw.chatMess ?? [],
            })
          );
        }
      }
    );

    const unsubSendChat = ws.subscribe(
      WebSocketEvent.SEND_CHAT_TO_PEOPLE,
      (res) => {
        if (res.status === "success") {
          const raw = res.data as unknown as ChatMessage & {
            to?: string;
            type?: number;
          };
          const msgType: 0 | 1 = raw.type === 1 ? 1 : 0;
          const targetName =
            msgType === 1
              ? raw.to || ""
              : raw.name === myUsername
                ? raw.to || ""
                : raw.name;
          if (targetName) {
            dispatch(
              addIncomingMessage({
                targetName,
                type: msgType,
                message: {
                  ...raw,
                  id: raw.id ?? Date.now(),
                  createAt: raw.createAt ?? new Date().toISOString(),
                },
              })
            );
          }
        }
      }
    );

    const unsubReLogin = ws.subscribe(WebSocketEvent.RE_LOGIN, (res) => {
      if (res.status === "success") {
        localStorage.setItem("re_login_code", res.data.RE_LOGIN_CODE);
        chatSocketService.fetchUserList();
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("re_login_code");
        dispatch(setCurrentTarget(null));
        navigate("/login");
      }
    });

    const unsubLogout = ws.subscribe(WebSocketEvent.LOGOUT, (res) => {
      if (res.status === "success") {
        dispatch(logout());
        dispatch(resetChatState());
        navigate("/login");
      }
    });

    const unsubAuth = ws.subscribe("AUTH" as WebSocketEvent, () => {
      const user = localStorage.getItem("username");
      const code = localStorage.getItem("re_login_code");
      if (user && code) {
        chatSocketService.reLogin(user, code);
      } else {
        navigate("/login");
      }
    });

    chatSocketService.fetchUserList();

    return () => {
      unsubUserList();
      unsubPeopleHistory();
      unsubRoomHistory();
      unsubSendChat();
      unsubReLogin();
      unsubLogout();
      unsubAuth();
    };
  }, [dispatch, enabled, navigate]);

  useEffect(() => {
    if (!enabled || !currentTarget) return;
    chatSocketService.fetchChatHistory(currentTarget, 1);
  }, [currentTarget, enabled]);
}
