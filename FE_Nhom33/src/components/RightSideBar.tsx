import {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import UserChatInfo from "./rightsidebar/UserChatInfo.tsx";
import GroupChatInfo from "./rightsidebar/GroupChatInfo.tsx";
import type {SharedFile} from "./rightsidebar/SharedSections.tsx";
import {WebsocketInstance} from "@/socket/WebsocketInstance";
import {WebSocketEvent} from "@/socket/types/WebSoketMessage";
import {chatSocketService} from "@/services/chatSocketService";
import {getAttachmentKind, getFileNameFromUrl} from "@/services/storageService";
import {removeChatTarget, type ChatMessage} from "@/store/slice/chatSlice";
import type {AppDispatch, RootState} from "@/store/store";
import {DateUtil} from "@/utils/DateUtil";

interface ParsedAttachment {
    url: string;
    name?: string;
    kind?: "image" | "video" | "file";
}

function extractAttachmentsFromMessages(messages: ChatMessage[]) {
    const media: string[] = [];
    const files: SharedFile[] = [];

    messages.forEach((msg) => {
        if (!msg.mes) return;
        try {
            const parsed = JSON.parse(msg.mes) as {
                type?: string; attachment?: Array<string | ParsedAttachment>;
            };
            if (parsed?.type !== "attachment" || !Array.isArray(parsed.attachment)) {
                return;
            }

            const dateLabel = DateUtil.formatChatTime(msg.createAt);
            parsed.attachment.forEach((item) => {
                const url = typeof item === "string" ? item : item?.url;
                if (!url) return;

                const kind = typeof item === "object" && item?.kind ? item.kind : getAttachmentKind(url);

                if (kind === "image" || kind === "video") {
                    media.push(url);
                } else {
                    const name = (typeof item === "object" && item?.name) || getFileNameFromUrl(url);
                    files.push({name, url, date: dateLabel});
                }
            });
        } catch {

        }
    });

    return {media: media.reverse(), files: files.reverse()};
}

export default function RightSideBar() {
    const dispatch = useDispatch<AppDispatch>();
    const {currentTarget, roomHistory, peopleHistory, onlineUsers} = useSelector((state: RootState) => state.chat);

    const [leaveError, setLeaveError] = useState<string | null>(null);
    const pendingLeaveRoomRef = useRef("");

    useEffect(() => {
        const ws = WebsocketInstance.getInstance();

        const unsubOutRoom = ws.subscribe(WebSocketEvent.OUT_ROOM, (res) => {
            const roomName = pendingLeaveRoomRef.current;
            pendingLeaveRoomRef.current = "";
            if (res.status === "success") {
                if (roomName) {
                    setLeaveError(null);
                    dispatch(removeChatTarget({name: roomName, type: 1}));
                }
            } else {
                setLeaveError(res.mes || "Không thể rời khỏi nhóm");
            }
        });

        return () => {
            unsubOutRoom();
        };
    }, [dispatch]);

    const isGroup = currentTarget?.type === 1;
    const roomInfo = currentTarget && isGroup ? roomHistory[currentTarget.name] : undefined;

    const conversationMessages = useMemo(() => {
        if (!currentTarget) return [];
        return isGroup ? roomHistory[currentTarget.name]?.messages ?? [] : peopleHistory[currentTarget.name] ?? [];
    }, [currentTarget, isGroup, peopleHistory, roomHistory]);

    const {media, files} = useMemo(() => extractAttachmentsFromMessages(conversationMessages), [conversationMessages]);

    if (!currentTarget) {
        return (<aside
                className="w-80 h-full flex flex-col bg-white text-gray-800 select-none overflow-hidden border-l border-gray-200 items-center justify-center p-6 text-center text-xs text-gray-400">
                Chọn một cuộc trò chuyện để xem chi tiết
            </aside>);
    }

    const groupMembers = roomInfo?.members.map((m) => ({
        name: m.name, role: roomInfo.own === m.name ? "Trưởng nhóm" : "Thành viên", isLeader: roomInfo.own === m.name,
    })) ?? [];

    const isActive = isGroup ? true : (onlineUsers[currentTarget.name] ?? false);

    const handleLeaveGroup = () => {
        setLeaveError(null);
        pendingLeaveRoomRef.current = currentTarget.name;
        chatSocketService.leaveRoom(currentTarget.name);
    };

    return (<aside
            className="w-80 h-full flex flex-col bg-white text-gray-800 select-none overflow-hidden border-l border-gray-200">
            <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white">
                <h3 className="font-bold text-gray-800 text-base">Thông tin hội thoại</h3>
            </div>

            {isGroup ? (<GroupChatInfo
                    groupName={currentTarget.name}
                    members={groupMembers}
                    media={media}
                    files={files}
                    isActive={isActive}
                    onLeaveGroup={handleLeaveGroup}
                    leaveError={leaveError}
                />) : (<UserChatInfo
                    name={currentTarget.name}
                    media={media}
                    files={files}
                    isActive={isActive}
                />)}
        </aside>);
}