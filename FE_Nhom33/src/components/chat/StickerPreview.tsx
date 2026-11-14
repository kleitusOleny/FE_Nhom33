import { useState } from "react";

export function StickerPreview({
    src,
    preview,
    onSelect,
}: {
    src: string;
    preview: string;
    onSelect: (src: string) => void;
}) {
    const [loading, setLoading] = useState(true);

    return (
        <div
            className="h-20 p-1 cursor-pointer hover:bg-neutral-400/30 rounded"
            onClick={() => onSelect(src)}
        >
            {loading && (
                <img
                    src={preview}
                    alt="Sticker preview"
                    className="object-contain w-full h-full opacity-70"
                />
            )}
            <img
                src={src}
                alt="Sticker"
                onLoad={() => setLoading(false)}
                className={`object-contain w-full h-full ${loading ? "hidden" : ""}`}
            />
        </div>
    );
}
