import type { ChatTarget } from "@/store/slice/chatSlice";
import { DateUtil } from "@/utils/DateUtil";

interface UserChatItemProps {
  chat: ChatTarget;
  isSelected: boolean;
  onSelect: (chat: ChatTarget) => void;
}

export default function UserChatItem({
  chat,
  isSelected,
  onSelect,
}: UserChatItemProps) {
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
        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs bg-gradient-to-tr from-blue-600 to-cyan-500">
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
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
        <p className="text-xs text-gray-500 truncate">Nhấn để trò chuyện...</p>
      </div>
    </div>
  );
}
