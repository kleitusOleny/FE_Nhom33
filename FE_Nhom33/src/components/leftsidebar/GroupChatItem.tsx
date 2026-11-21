import { BsPeopleFill } from "react-icons/bs";
import type { ChatTarget } from "@/store/slice/chatSlice";
import { DateUtil } from "@/utils/DateUtil";

interface GroupChatItemProps {
  chat: ChatTarget;
  isSelected: boolean;
  onSelect: (chat: ChatTarget) => void;
}

export default function GroupChatItem({
  chat,
  isSelected,
  onSelect,
}: GroupChatItemProps) {
  return (
    <div
      onClick={() => onSelect(chat)}
      className={`p-3.5 flex items-center gap-3 cursor-pointer transition ${
        isSelected
          ? "bg-blue-50/80 border-l-4 border-blue-600"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs bg-gradient-to-tr from-purple-600 to-indigo-500">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center text-indigo-600 shadow-xs">
          <BsPeopleFill size={9} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <h4
            className={`text-sm truncate ${
              isSelected
                ? "font-bold text-blue-900"
                : "font-medium text-gray-800"
            }`}
          >
            {chat.name}
          </h4>
          <span className="text-[11px] text-gray-400">
            {DateUtil.formatChatTime(chat.actionTime)}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">
          {chat.memberCount !== undefined
            ? `${chat.memberCount} thành viên`
            : "Nhóm chat"}
        </p>
      </div>
    </div>
  );
}
