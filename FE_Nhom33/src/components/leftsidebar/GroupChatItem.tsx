import { BsPeopleFill } from "react-icons/bs";
import type { ChatTarget } from "@/store/slice/chatSlice";

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
    <div className="w-full flex justify-center relative group shrink-0">
      <span
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-indigo-600 transition-all duration-200 
          ${isSelected ? "h-8" : "h-0 group-hover:h-4"}`}/>

      <button type="button"
        onClick={() => onSelect(chat)}
        title={chat.name}
        aria-label={chat.name}
        className="relative cursor-pointer focus:outline-none">
        <div
          className={`w-11 h-11 flex items-center justify-center font-bold text-sm text-white shadow-xs bg-linear-to-tr from-purple-600 to-indigo-500 transition-all duration-200 ${
            isSelected
              ? "rounded-2xl ring-2 ring-indigo-600 ring-offset-2 ring-offset-gray-100"
              : "rounded-full group-hover:rounded-2xl"}`}>
          {chat.name.charAt(0).toUpperCase()}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center text-indigo-600 shadow-xs">
          <BsPeopleFill size={9} />
        </span>
      </button>
    </div>
  );
}
