import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Clock4,
    Flame,
    Frown,
    Heart,
    Search,
    Smile,
    X,
} from "lucide-react";
import { StickerPreview } from "./StickerPreview";

interface StickerOption {
    emoji: string;
    label: string;
    category: "smile" | "sad" | "love";
}

interface StickerItem {
    src: string;
    preview: string;
}

const STICKERS: StickerOption[] = [
    { emoji: "😎", label: "cool", category: "smile" },
    { emoji: "😀", label: "smile vui", category: "smile" },
    { emoji: "😂", label: "laugh cười", category: "smile" },
    { emoji: "🤣", label: "rofl cười", category: "smile" },
    { emoji: "😊", label: "happy vui", category: "smile" },
    { emoji: "😉", label: "wink nháy mắt", category: "smile" },
    { emoji: "🥰", label: "love yêu", category: "love" },
    { emoji: "😍", label: "love yêu", category: "love" },
    { emoji: "😘", label: "kiss hôn", category: "love" },
    { emoji: "❤️", label: "heart tim", category: "love" },
    { emoji: "💖", label: "heart tim", category: "love" },
    { emoji: "💘", label: "heart tim", category: "love" },
    { emoji: "😢", label: "sad buồn", category: "sad" },
    { emoji: "😭", label: "cry khóc", category: "sad" },
    { emoji: "😞", label: "sad buồn", category: "sad" },
    { emoji: "🥺", label: "plead buồn", category: "sad" },
    { emoji: "💔", label: "broken heart tan vỡ", category: "sad" },
    { emoji: "😩", label: "tired mệt", category: "sad" },
    { emoji: "🔥", label: "fire lửa", category: "smile" },
    { emoji: "👍", label: "like thích", category: "smile" },
    { emoji: "👏", label: "clap vỗ tay", category: "smile" },
    { emoji: "🎉", label: "party tiệc", category: "smile" },
    { emoji: "💪", label: "strong mạnh", category: "smile" },
    { emoji: "🙌", label: "hooray hoan hô", category: "smile" },
];

const STORAGE_KEY = "stickerHistory";
const PAGE_SIZE = 8;

const makeSticker = (emoji: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><text x="50%" y="50%" font-size="84" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`
    )}`;

const readHistory = (): string[] => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
        return Array.isArray(stored) ? stored.filter((item) => typeof item === "string") : [];
    } catch {
        return [];
    }
};

export default function StickerPicker({
    onSelect,
    onClose,
}: {
    onSelect: (src: string) => void;
    onClose: () => void;
}) {
    const [stickers, setStickers] = useState<string[]>(readHistory);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [key, setKey] = useState("trending");

    const selectSticker = [
        { key: "history", icon: <Clock4 size="1.5rem" /> },
        { key: "trending", icon: <Flame size="1.5rem" /> },
        { key: "search", icon: <Search size="1.5rem" /> },
        { key: "smile", icon: <Smile size="1.5rem" /> },
        { key: "sad", icon: <Frown size="1.5rem" /> },
        { key: "love", icon: <Heart size="1.5rem" /> },
    ];

    const query = search.trim().toLowerCase();

    const items: StickerItem[] =
        key === "history"
            ? stickers.map((src) => ({ src, preview: src }))
            : STICKERS.filter((sticker) => {
                const matchesCategory =
                    key === "trending" || key === "search" || sticker.category === key;
                const matchesSearch =
                    key !== "search" || !query || sticker.label.includes(query);
                return matchesCategory && matchesSearch;
            }).map((sticker) => {
                const src = makeSticker(sticker.emoji);
                return { src, preview: src };
            });

    const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    const visibleItems = items.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    const hasNext = currentPage < pageCount;

    const changeTab = (nextKey: string) => {
        setKey(nextKey);
        setPage(1);
    };

    const handleSelect = (src: string) => {
        const nextHistory = [src, ...stickers.filter((item) => item !== src)].slice(0, 24);
        setStickers(nextHistory);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
        } catch {
            /* LocalStorage không khả dụng */
        }
        onSelect(src);
        onClose();
    };

    return (
        <div className="absolute right-0 bottom-full mb-3 overflow-hidden rounded-xl shadow-xl z-50 bg-white text-gray-800 border border-gray-200 w-90">
            <div className="relative flex items-center justify-center px-3 py-2 border-b border-gray-200 bg-white">
                <p className="text-base font-semibold text-gray-800">Sticker</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-2 p-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                    aria-label="Đóng"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="flex gap-2 justify-between px-3 py-2.5 border-b border-gray-100">
                <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    maxLength={50}
                    className="px-3 py-1.5 w-full border border-gray-300 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
                <button
                    type="button"
                    className="px-3 py-1.5 shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition cursor-pointer"
                    onClick={() => changeTab("search")}
                >
                    Tìm kiếm
                </button>
            </div>
            {visibleItems.length > 0 ? (
                <div className="overflow-y-auto h-80 p-2 grid grid-cols-4 gap-2 bg-white">
                    {visibleItems.map((item, index) => (
                        <StickerPreview
                            key={`${item.src}-${index}`}
                            src={item.src}
                            preview={item.preview}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>
            ) : (
                <div className="h-80 text-center content-center text-gray-400 text-sm bg-white">
                    Không có sticker
                </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-1">
                <button
                    type="button"
                    className={`p-2 rounded transition ${currentPage - 1 > 0 ? "text-gray-600 cursor-pointer hover:bg-gray-200/70" : "text-gray-300 cursor-not-allowed"}`}
                    disabled={currentPage - 1 <= 0}
                    onClick={() => setPage(currentPage - 1)}
                >
                    <ChevronLeft size="1.4rem" />
                </button>

                <div className="flex justify-center">
                    {selectSticker.map((select) => (
                        <button
                            type="button"
                            key={select.key}
                            className={`p-2 rounded transition cursor-pointer ${key === select.key ? "text-blue-600 bg-blue-100/70" : "text-gray-500 hover:bg-gray-200/70 hover:text-gray-800"}`}
                            onClick={() => changeTab(select.key)}
                        >
                            {select.icon}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className={`p-2 rounded transition ${hasNext ? "text-gray-600 cursor-pointer hover:bg-gray-200/70" : "text-gray-300 cursor-not-allowed"}`}
                    disabled={!hasNext}
                    onClick={() => setPage(currentPage + 1)}
                >
                    <ChevronRight size="1.4rem" />
                </button>
            </div>
        </div>
    );
}
