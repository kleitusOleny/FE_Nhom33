import { Bold, Heading, Italic, Link, List, ListOrdered, TextQuote, Underline } from "lucide-react";
import type { RefObject } from "react";

export function ChatToolBar({ inputRef }: { inputRef: RefObject<HTMLTextAreaElement | null> }) {
    const insertAtCursor = (element: HTMLTextAreaElement, start: string, end: string = "") => {
        const startIdx = element.selectionStart ?? 0;
        const endIdx = element.selectionEnd ?? 0;
        const before = element.value.substring(0, startIdx);
        const selected = element.value.substring(startIdx, endIdx);
        const after = element.value.substring(endIdx);
        element.value = before + start + selected + end + after;
        element.focus();
        const newPos = startIdx + start.length;
        element.setSelectionRange(newPos, newPos);
    };

    const handleFeature = (start: string, end: string = "") => {
        if (inputRef?.current) insertAtCursor(inputRef.current, start, end);
    };

    const handleQuote = () => {
        if (!inputRef?.current) return;
        const element = inputRef.current;
        const start = element.selectionStart;
        const isStartOfLine = start === 0 || element.value[start - 1] === "\n";
        const symbol = isStartOfLine ? "> " : "\n> ";
        if (start !== null) {
            insertAtCursor(element, symbol, "\n");
        }
    };

    const handleList = () => {
        if (!inputRef?.current) return;
        const element = inputRef.current;
        const start = element.selectionStart;
        const isStartOfLine = start === 0 || element.value[start - 1] === "\n";
        const symbol = isStartOfLine ? "- " : "\n- ";
        insertAtCursor(element, symbol, "");
    };

    const handleNumbered = () => {
        if (!inputRef?.current) return;
        const element = inputRef.current;
        const start = element.selectionStart;
        const isStartOfLine = start === 0 || element.value[start - 1] === "\n";
        const symbol = isStartOfLine ? "1. " : "\n1. ";
        insertAtCursor(element, symbol, "");
    };

    const decorationFeature = [
        { name: "Tiêu đề", onClick: () => handleFeature("###", ""), Icon: Heading },
        { name: "Chữ đậm", onClick: () => handleFeature("**", ""), Icon: Bold },
        { name: "Chữ nghiêng", onClick: () => handleFeature("*", ""), Icon: Italic },
        { name: "Chữ gạch chân", onClick: () => handleFeature("++", ""), Icon: Underline },
        { name: "Trích dẫn", onClick: handleQuote, Icon: TextQuote },
        { name: "Link", onClick: () => handleFeature("[", "]("), Icon: Link },
    ];

    const listAndTaskFeature = [
        { name: "Danh sách", onClick: handleList, Icon: List },
        { name: "Danh sách đánh số", onClick: handleNumbered, Icon: ListOrdered },
    ];

    return (
        <div className="bg-white h-12 flex items-center px-2 py-2 border-t">
            {decorationFeature.map((ele, index) => (
                <div title={ele.name} key={index}>
                    <ele.Icon
                        className="rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer p-1.5"
                        size={"2rem"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={ele.onClick}
                    />
                </div>
            ))}
            <div className="w-px mx-1 h-full bg-neutral-400"></div>
            {listAndTaskFeature.map((ele, index) => (
                <div title={ele.name} key={index}>
                    <ele.Icon
                        className="rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer p-1.5"
                        size={"2rem"}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={ele.onClick}
                    />
                </div>
            ))}
        </div>
    );
}
