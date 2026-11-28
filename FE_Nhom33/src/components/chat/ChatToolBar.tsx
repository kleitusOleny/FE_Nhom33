import { Bold, Heading, Italic, Link, List, ListOrdered, TextQuote, Underline } from "lucide-react";
import { useCallback, useEffect, useState, type RefObject } from "react";

export function ChatToolBar({
    inputRef,
    onInsert,
}: {
    inputRef: RefObject<HTMLTextAreaElement | null>;
    onInsert?: () => void;
}) {
    const [active, setActive] = useState<Record<string, boolean>>({});

    const syncActive = useCallback(() => {
        const el = inputRef.current;
        if (!el) return;
        const pos = el.selectionStart ?? 0;
        const before = el.value.slice(0, pos);
        const after = el.value.slice(pos);
        const lineStart = el.value.lastIndexOf("\n", pos - 1) + 1;
        const lineEndIdx = el.value.indexOf("\n", pos);
        const line = el.value.slice(lineStart, lineEndIdx === -1 ? el.value.length : lineEndIdx);

        setActive({
            heading: /^#{1,6}\s/.test(line),
            bold: after.startsWith("**") && before.lastIndexOf("**") !== -1,
            italic: after.startsWith("*") && !after.startsWith("**") && before.lastIndexOf("*") > before.lastIndexOf("**"),
            underline: after.startsWith("++") && before.lastIndexOf("++") !== -1,
            quote: /^>\s/.test(line),
            list: /^-\s/.test(line),
            ordered: /^\d+\.\s/.test(line),
        });
    }, [inputRef]);

    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        const events = ["keyup", "mouseup", "input", "focus"] as const;
        events.forEach((evt) => el.addEventListener(evt, syncActive));
        return () => events.forEach((evt) => el.removeEventListener(evt, syncActive));
    }, [inputRef, syncActive]);

    const insertAtCursor = (element: HTMLTextAreaElement, start: string, end: string = "") => {
        const startIdx = element.selectionStart ?? 0;
        const endIdx = element.selectionEnd ?? 0;
        const before = element.value.substring(0, startIdx);
        const selected = element.value.substring(startIdx, endIdx);
        const after = element.value.substring(endIdx);


        if (startIdx < endIdx && end) {
            if (selected.startsWith(start) && selected.endsWith(end) && selected.length >= start.length + end.length) {
                const unwrapped = selected.slice(start.length, selected.length - end.length);
                element.value = before + unwrapped + after;
                element.focus();
                element.setSelectionRange(startIdx, startIdx + unwrapped.length);
            } else {
                element.value = before + start + selected + end + after;
                element.focus();
                element.setSelectionRange(startIdx + start.length, endIdx + start.length);
            }
            onInsert?.();
            syncActive();
            return;
        }

        if (startIdx === endIdx && end && after.startsWith(end)) {
            element.focus();
            element.setSelectionRange(startIdx + end.length, startIdx + end.length);
            syncActive();
            return;
        }

        element.value = before + start + selected + end + after;
        element.focus();
        const newPos = startIdx + start.length;
        element.setSelectionRange(newPos, newPos);
        onInsert?.();
        syncActive();
    };

    const handleFeature = (start: string, end: string = "") => {
        if (inputRef?.current) insertAtCursor(inputRef.current, start, end);
    };

    const handleLine = (prefix: string) => {
        if (!inputRef?.current) return;
        const element = inputRef.current;
        const startIdx = element.selectionStart ?? 0;
        const endIdx = element.selectionEnd ?? 0;

        if (startIdx < endIdx) {
            const lineStart = element.value.lastIndexOf("\n", startIdx - 1) + 1;
            const rawEnd = element.value.indexOf("\n", endIdx);
            const lineEnd = rawEnd === -1 ? element.value.length : rawEnd;
            const formatted = element.value
                .slice(lineStart, lineEnd)
                .split("\n")
                .map((line, i) => (prefix === "1. " ? `${i + 1}. ${line.replace(/^\d+\.\s/, "")}` : line.startsWith(prefix) ? line.slice(prefix.length) : `${prefix}${line}`))
                .join("\n");
            element.value = element.value.slice(0, lineStart) + formatted + element.value.slice(lineEnd);
            element.focus();
            element.setSelectionRange(lineStart, lineStart + formatted.length);
            onInsert?.();
            syncActive();
            return;
        }

        const isStartOfLine = startIdx === 0 || element.value[startIdx - 1] === "\n";
        insertAtCursor(element, isStartOfLine ? prefix : `\n${prefix}`, "");
    };

    const decorationFeature = [
        { key: "heading", name: "Tiêu đề", onClick: () => handleLine("### "), Icon: Heading },
        { key: "bold", name: "Chữ đậm", onClick: () => handleFeature("**", "**"), Icon: Bold },
        { key: "italic", name: "Chữ nghiêng", onClick: () => handleFeature("*", "*"), Icon: Italic },
        { key: "underline", name: "Chữ gạch chân", onClick: () => handleFeature("++", "++"), Icon: Underline },
        { key: "quote", name: "Trích dẫn", onClick: () => handleLine("> "), Icon: TextQuote },
        { key: "link", name: "Link", onClick: () => handleFeature("[", "](url)"), Icon: Link },
    ];

    const listAndTaskFeature = [
        { key: "list", name: "Danh sách", onClick: () => handleLine("- "), Icon: List },
        { key: "ordered", name: "Danh sách đánh số", onClick: () => handleLine("1. "), Icon: ListOrdered },
    ];

    return (
        <div className="bg-white h-12 flex items-center px-2 py-2 border-t border-gray-200">
            {decorationFeature.map((ele, index) => (
                <div title={ele.name} key={index}>
                    <ele.Icon
                        className={`rounded transition-colors cursor-pointer p-1.5 ${active[ele.key] ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                        size={"2rem"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={ele.onClick}
                    />
                </div>
            ))}
            <div className="w-px mx-1.5 h-6 bg-gray-200"></div>
            {listAndTaskFeature.map((ele, index) => (
                <div title={ele.name} key={index}>
                    <ele.Icon
                        className={`rounded transition-colors cursor-pointer p-1.5 ${active[ele.key] ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}
                        size={"2rem"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={ele.onClick}
                    />
                </div>
            ))}
        </div>
    );
}
