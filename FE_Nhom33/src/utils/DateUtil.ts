export type DateInput = string | number | Date | null | undefined;

export const DateUtil = {
  parse(input: DateInput): Date | null {
    if (input === null || input === undefined || input === "") return null;
    if (input instanceof Date) {
      return Number.isNaN(input.getTime()) ? null : input;
    }
    if (typeof input === "string") {
      const normalized =
        input.includes(" ") && !input.includes("T")
          ? input.replace(" ", "T")
          : input;
      const date = new Date(normalized);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? null : date;
  },

  formatTime(input: DateInput): string {
    const date = DateUtil.parse(input);
    if (!date) return "";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  },

  formatChatTime(input: DateInput): string {
    const date = DateUtil.parse(input);
    if (!date) return "";

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diffDays = Math.round(
      (today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return DateUtil.formatTime(date);
    if (diffDays === 1) return "Hôm qua";

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },

  formatFullDateTime(input: DateInput): string {
    const date = DateUtil.parse(input);
    if (!date) return "";
    const time = DateUtil.formatTime(date);
    const day = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return `${time} ${day}`;
  },

  formatRelative(input: DateInput): string {
    const date = DateUtil.parse(input);
    if (!date) return "";

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return "Vừa xong";

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays <= 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },
};

export default DateUtil;
