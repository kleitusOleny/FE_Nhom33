import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function AccountSettings() {
  const authUsername = useSelector((state: RootState) => state.auth.username);
  const username = authUsername || localStorage.getItem("username") || "Chưa xác định";
  const avatarLetter = username.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Thông tin tài khoản</h3>
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
          {avatarLetter}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Tên đăng nhập</p>
          <p className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">{username}</p>
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Đang hoạt động
          </span>
        </div>
      </div>
    </div>
  );
}
