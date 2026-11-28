import { useEffect, useState } from "react";
import { Palette, User, X } from "lucide-react";
import AccountSettings from "./AccountSettings";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"account" | "appearance">("account");

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-800 shadow-2xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h2 id="settings-modal-title" className="text-base font-semibold">Cài đặt</h2>
          <button type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col sm:flex-row min-h-85">
          <nav className="flex sm:w-48 shrink-0 flex-row sm:flex-col gap-1 border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-950/60">
            <button type="button"
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "account"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>
              <User size={16} />
              <span>Tài khoản</span>
            </button>

            <button type="button"
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "appearance"
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}>
              <Palette size={16} />
              <span>Giao diện</span>
            </button>
          </nav>

          <div className="flex-1 p-5">
            {activeTab === "account" ? (<AccountSettings />) : (
              <div className="space-y-6">
                {/* <ThemeSettings />
                <FontSizeSettings /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
