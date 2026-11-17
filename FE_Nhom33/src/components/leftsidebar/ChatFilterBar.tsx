import {useState} from "react";
import {BsChevronDown, BsThreeDots} from "react-icons/bs";

export interface ChatFilterBarProps {
    onTabChange?: (tab: "priority" | "pinned") => void;
    onFilterClick?: () => void;
    onMoreClick?: () => void;
}

export default function ChatFilterBar({onTabChange, onFilterClick, onMoreClick,}: ChatFilterBarProps) {
    const [activeTab, setActiveTab] = useState("priority");

    const handleTabClick = (tab: "priority" | "pinned") => {
        setActiveTab(tab);
        if (onTabChange) onTabChange(tab);
    };

    return (
        <div
            className="w-full px-4 border-b border-gray-200 flex items-center justify-between text-sm select-none bg-white">
            <div className="flex items-center gap-6">
                <button type="button" onClick={() => handleTabClick("priority")}
                        className={`relative pb-2.5 pt-2 text-sm font-medium transition cursor-pointer ${
                            activeTab === "priority"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600 -mb-[1px]"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    Ưu tiên
                </button>

                <button type="button" onClick={() => handleTabClick("pinned")}
                        className={`relative pb-2.5 pt-2 text-sm font-medium transition cursor-pointer ${
                            activeTab === "pinned"
                                ? "text-blue-600 font-semibold border-b-2 border-blue-600 -mb-[1px]"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                >
                    Đã ghim
                </button>
            </div>

            <div className="flex items-center gap-2 pb-1 text-gray-500">
                <button type="button" onClick={onFilterClick}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                >
                    <span>Phân loại</span>
                    <BsChevronDown size={11} className="text-gray-500 mt-0.5"/>
                </button>

                <button type="button" onClick={onMoreClick}
                    className="p-1.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
                    title="Tùy chọn khác">
                    <BsThreeDots size={16}/>
                </button>
            </div>
        </div>
    );
}
