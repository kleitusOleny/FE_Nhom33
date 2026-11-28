import { useState } from "react";
import {
  BsBell,
  BsSearch,
  BsPinAngle,
  BsPersonPlus,
  BsImage,
  BsFileEarmarkText,
  BsLink45Deg,
  BsChevronDown,
  BsChevronUp,
  BsTrash,
  BsBoxArrowRight,
  BsShieldX,
} from "react-icons/bs";

export function QuickActions({
  isGroup = false,
  onAddMember,}: {
  isGroup?: boolean;
  onAddMember?: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-5">
      <button
        type="button"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition">
          <BsBell size={18} />
        </div>
        <span className="text-[11px] font-medium">Báo thức</span>
      </button>

      <button
        type="button"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition">
          <BsSearch size={18} />
        </div>
        <span className="text-[11px] font-medium">Tìm kiếm</span>
      </button>

      {isGroup && (
        <button
          type="button"
          onClick={onAddMember}
          className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition">
            <BsPersonPlus size={18} />
          </div>
          <span className="text-[11px] font-medium">Thêm bạn</span>
        </button>
      )}

      <button
        type="button"
        className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition">
          <BsPinAngle size={18} />
        </div>
        <span className="text-[11px] font-medium">Ghim tin</span>
      </button>
    </div>
  );
}

export interface SharedFile {
  name: string;
  url?: string;
  size?: string;
  date?: string;
}

// 2. Khối Ảnh & Video đã gửi dùng chung
export function MediaSection({ media = [] }: { media?: string[] }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-4 border-b border-gray-100">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BsImage size={17} className="text-gray-500" />
          <span>Ảnh & Video đã gửi ({media.length})</span>
        </div>
        {isOpen ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
      </button>

      {isOpen && (
        media.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400 text-center">
            Chưa có ảnh hoặc video nào
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {media.map((url, idx) => (
              <a
                key={`${url}-${idx}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-md border border-gray-200 hover:opacity-90 transition"
              >
                <img
                  src={url}
                  alt={`media-${idx}`}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// 3. Khối Tài liệu & File chia sẻ dùng chung
export function FilesSection({ files = [] }: { files?: SharedFile[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 border-b border-gray-100">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BsFileEarmarkText size={17} className="text-gray-500" />
          <span>Tài liệu đã chia sẻ ({files.length})</span>
        </div>
        {isOpen ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
      </button>

      {isOpen && (
        files.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400 text-center">
            Chưa có tài liệu nào
          </p>
        ) : (
          <div className="mt-3 space-y-2 text-xs">
            {files.map((file, i) => (
              <a
                key={`${file.name}-${i}`}
                href={file.url || "#"}
                target={file.url ? "_blank" : undefined}
                rel={file.url ? "noopener noreferrer" : undefined}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <BsFileEarmarkText size={16} className="text-blue-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    {file.size && <span className="text-[10px] text-gray-400">{file.size}</span>}
                  </div>
                </div>
                {file.date && <span className="text-[10px] text-gray-400 shrink-0">{file.date}</span>}
              </a>
            ))}
          </div>
        )
      )}
    </div>
  );
}

// 4. Khối Tùy chọn & Bảo mật dùng chung
export function PrivacySection({
  isGroup = false,
  onLeaveGroup,
  leaveError,
}: {
  isGroup?: boolean;
  onLeaveGroup?: () => void;
  leaveError?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BsLink45Deg size={18} className="text-gray-500" />
          <span>Tùy chọn & Bảo mật</span>
        </div>
        {isOpen ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-1.5 text-xs">
          <button
            type="button"
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition text-left cursor-pointer"
          >
            <BsTrash size={15} className="text-gray-500" />
            <span>Xóa lịch sử trò chuyện</span>
          </button>

          {isGroup ? (
            <button
              type="button"
              onClick={onLeaveGroup}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
            >
              <BsBoxArrowRight size={15} />
              <span>Rời khỏi nhóm</span>
            </button>
          ) : (
            <button
              type="button"
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
            >
              <BsShieldX size={15} />
              <span>Chặn người dùng này</span>
            </button>
          )}

          {leaveError && (
            <p className="px-2 pt-1 text-[11px] text-red-500">{leaveError}</p>
          )}
        </div>
      )}
    </div>
  );
}
