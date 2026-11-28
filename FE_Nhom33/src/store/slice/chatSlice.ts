import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ChatTarget {
  name: string;
  type: 0 | 1;
  actionTime?: string;
  memberCount?: number;
}

export interface ChatMessage {
  id: number;
  name: string;
  to?: string;
  type?: number;
  mes: string;
  createAt: string;
}

export interface RoomMember {
  id: number;
  name: string;
}

export interface RoomData {
  name: string;
  own?: string;
  members: RoomMember[];
  messages: ChatMessage[];
}

interface ChatState {
  userList: ChatTarget[];
  currentTarget: ChatTarget | null;
  peopleHistory: Record<string, ChatMessage[]>;
  roomHistory: Record<string, RoomData>;
  onlineUsers: Record<string, boolean>;
  loadingUserList: boolean;
  loadingMessages: boolean;
  error: string | null;
}

const initialState: ChatState = {
  userList: [],
  currentTarget: null,
  peopleHistory: {},
  roomHistory: {},
  onlineUsers: {},
  loadingUserList: false,
  loadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoadingUserList(state, action: PayloadAction<boolean>) {
      state.loadingUserList = action.payload;
    },
    setLoadingMessages(state, action: PayloadAction<boolean>) {
      state.loadingMessages = action.payload;
    },
    setChatError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loadingUserList = false;
      state.loadingMessages = false;
    },
    setUserList(state, action: PayloadAction<ChatTarget[]>) {
      state.userList = action.payload;
      state.loadingUserList = false;
      state.error = null;
      if (!state.currentTarget && action.payload.length > 0) {
        state.currentTarget = action.payload[0];
      }
    },
    setCurrentTarget(state, action: PayloadAction<ChatTarget | null>) {
      state.currentTarget = action.payload;
    },
    openOrAddChatTarget(state, action: PayloadAction<ChatTarget>) {
      const target = action.payload;
      const existing = state.userList.find(
        (c) =>
          c.type === target.type &&
          c.name.toLowerCase() === target.name.toLowerCase()
      );
      if (existing) {
        state.currentTarget = existing;
      } else {
        state.userList.unshift(target);
        state.currentTarget = target;
      }
    },
    removeChatTarget(
      state,
      action: PayloadAction<{ name: string; type: 0 | 1 }>
    ) {
      state.userList = state.userList.filter(
        (c) =>
          !(c.type === action.payload.type && c.name === action.payload.name)
      );
      if (
        state.currentTarget?.type === action.payload.type &&
        state.currentTarget.name === action.payload.name
      ) {
        state.currentTarget = state.userList[0] ?? null;
      }
      if (action.payload.type === 1) {
        delete state.roomHistory[action.payload.name];
      } else {
        delete state.peopleHistory[action.payload.name];
      }
    },
    setPeopleHistory(
      state,
      action: PayloadAction<{ targetName: string; messages: ChatMessage[] }>
    ) {
      const sorted = [...action.payload.messages].sort((a, b) => a.id - b.id);
      state.peopleHistory[action.payload.targetName] = sorted;
      state.loadingMessages = false;
    },
    setRoomHistory(state, action: PayloadAction<RoomData>) {
      const sorted = [...action.payload.messages].sort((a, b) => a.id - b.id);
      state.roomHistory[action.payload.name] = {
        ...action.payload,
        messages: sorted,
      };
      state.loadingMessages = false;
      const target = state.userList.find(
        (c) => c.type === 1 && c.name === action.payload.name
      );
      if (target) {
        target.memberCount = action.payload.members.length;
      }
      if (
        state.currentTarget?.type === 1 &&
        state.currentTarget.name === action.payload.name
      ) {
        state.currentTarget.memberCount = action.payload.members.length;
      }
    },
    addIncomingMessage(
      state,
      action: PayloadAction<{
        targetName: string;
        type: 0 | 1;
        message: ChatMessage;
      }>
    ) {
      const { targetName, type, message } = action.payload;

      if (type === 1) {
        const room = state.roomHistory[targetName];
        if (room) {
          room.messages.push(message);
        } else {
          state.roomHistory[targetName] = {
            name: targetName,
            members: [],
            messages: [message],
          };
        }
      } else {
        const list = state.peopleHistory[targetName] ?? [];
        list.push(message);
        state.peopleHistory[targetName] = list;
      }

      const existing = state.userList.find(
        (c) => c.type === type && c.name === targetName
      );
      if (existing) {
        existing.actionTime = message.createAt;
      } else {
        state.userList.unshift({
          name: targetName,
          type,
          actionTime: message.createAt,
        });
      }
    },
    setUserOnlineStatus(
      state,
      action: PayloadAction<{ username: string; status: boolean }>
    ) {
      state.onlineUsers[action.payload.username] = action.payload.status;
    },
    resetChatState() {
      return initialState;
    },
  },
});

export const {
  setLoadingUserList,
  setLoadingMessages,
  setChatError,
  setUserList,
  setCurrentTarget,
  openOrAddChatTarget,
  removeChatTarget,
  setPeopleHistory,
  setRoomHistory,
  addIncomingMessage,
  setUserOnlineStatus,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
