import { convertMarkdownToHTML } from "simple-customize-markdown-converter";

export const MARKDOWN_PROSE_CLASS =
  "text-sm leading-relaxed break-words [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-current [&_blockquote]:pl-2 [&_blockquote]:opacity-85";

export const hasMarkdownSyntax = (text: string): boolean =>
  /(?:\*\*.+?\*\*|\*.+?\*|\+\+.+?\+\+|^#{1,6}\s|^>\s|^-\s|^\d+\.\s|\[.+?\]\(.+?\))/m.test(
    text
  );

const isUnorderedListLine = (line: string) => /^\s*[-*+]\s+/.test(line);
const isOrderedListLine = (line: string) => /^\s*\d+\.\s+/.test(line);

const normalizeAdjacentLists = (text: string): string => {
  const lines = text.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);
    if (i + 1 < lines.length) {
      const curU = isUnorderedListLine(lines[i]);
      const curO = isOrderedListLine(lines[i]);
      const nextU = isUnorderedListLine(lines[i + 1]);
      const nextO = isOrderedListLine(lines[i + 1]);
      if ((curU && nextO) || (curO && nextU)) {
        result.push("");
      }
    }
  }

  return result.join("\n");
};

export const markdownToHtml = (text: string): string =>
  convertMarkdownToHTML(normalizeAdjacentLists(text)).replace(
    /\+\+(.+?)\+\+/g,
    "<u>$1</u>"
  );
