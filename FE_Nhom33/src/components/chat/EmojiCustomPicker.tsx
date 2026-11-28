import { useState } from "react";
import EmojiPicker, { Categories, Theme } from "emoji-picker-react";
import { X } from "lucide-react";

export default function EmojiCustomPicker({
    onSelect,
    onClose,
}: {
    onSelect: (emoji: string) => void;
    onClose: () => void;
}) {
    const [isDark] = useState(() =>
        document.documentElement.classList.contains("dark")
    );

    return (
        <div className="absolute right-0 bottom-full mb-3 overflow-hidden rounded-xl border border-gray-200 shadow-xl z-50 bg-white text-gray-800">
            <div className="relative flex items-center justify-center px-3 py-2 border-b border-gray-200 bg-white">
                <p className="text-base font-semibold text-gray-800">Emoji</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-2 p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                    aria-label="Đóng"
                >
                    <X size={18} />
                </button>
            </div>

            <EmojiPicker
                theme={isDark ? Theme.DARK : Theme.LIGHT}
                searchPlaceholder="Tìm kiếm emoji..."
                categories={[
                    { category: Categories.SUGGESTED, name: "Hay dùng" },
                    { category: Categories.SMILEYS_PEOPLE, name: "Mặt cười & Người" },
                    { category: Categories.ANIMALS_NATURE, name: "Động vật" },
                    { category: Categories.FOOD_DRINK, name: "Ăn uống" },
                    { category: Categories.TRAVEL_PLACES, name: "Du lịch" },
                    { category: Categories.ACTIVITIES, name: "Hoạt động" },
                    { category: Categories.OBJECTS, name: "Đồ vật" },
                    { category: Categories.SYMBOLS, name: "Biểu tượng" },
                    { category: Categories.FLAGS, name: "Cờ" },
                ]}
                previewConfig={{
                    defaultEmoji: "1f60a",
                    defaultCaption: "Chọn một biểu tượng...",
                    showPreview: true,
                }}
                onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
            />
        </div>
    );
}
