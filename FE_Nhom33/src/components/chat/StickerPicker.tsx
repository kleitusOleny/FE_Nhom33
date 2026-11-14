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
        <div className="fixed overflow-hidden rounded-lg shadow bottom-14 z-50 bg-white dark:bg-gray-800 border w-90">
            <div className="relative">
                <p className="shadow text-lg p-2 font-semibold text-center">Sticker</p>
                <X
                    className="absolute right-2 top-3 hover:bg-neutral-300/30 rounded cursor-pointer"
                    onClick={onClose}
                />
            </div>
            <hr />
            <div className="flex gap-2 justify-between px-3 mb-2 pt-2">
                <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    maxLength={50}
                    className="p-2 w-full border rounded-lg"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                    }}
                />
                <button
                    type="button"
                    className="border w-30 bg-indigo-500 text-white rounded-lg cursor-pointer dark:bg-neutral-400/30 dark:hover:bg-neutral-300/30 hover:bg-indigo-500/50"
                    onClick={() => changeTab("search")}
                >
                    Tìm kiếm
                </button>
            </div>
            {visibleItems.length > 0 ? (
                <div className="overflow-y-auto h-80 p-2 grid grid-cols-4 gap-2">
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
                <div className="h-80 text-center content-center text-neutral-500">
                    Không có sticker
                </div>
            )}

            <div className="flex justify-between">
                <button
                    type="button"
                    className={`p-2 ${currentPage - 1 > 0 ? "text-neutral-500 dark:text-neutral-100 cursor-pointer hover:bg-neutral-300/30" : "text-neutral-300 dark:text-neutral-500"}`}
                    disabled={currentPage - 1 <= 0}
                    onClick={() => setPage(currentPage - 1)}
                >
                    <ChevronLeft size="1.5rem" />
                </button>

                <div className="flex justify-center">
                    {selectSticker.map((select) => (
                        <button
                            type="button"
                            key={select.key}
                            className={`p-2 dark:text-neutral-100 text-neutral-500 cursor-pointer ${key === select.key ? "text-yellow-700 bg-neutral-300/30" : "hover:bg-neutral-300/30"}`}
                            onClick={() => changeTab(select.key)}
                        >
                            {select.icon}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className={`p-2 ${hasNext ? "text-neutral-500 dark:text-neutral-100 cursor-pointer hover:bg-neutral-300/30" : "text-neutral-300 dark:text-neutral-500"}`}
                    disabled={!hasNext}
                    onClick={() => setPage(currentPage + 1)}
                >
                    <ChevronRight size="1.5rem" />
                </button>
            </div>
        </div>
    );
}
