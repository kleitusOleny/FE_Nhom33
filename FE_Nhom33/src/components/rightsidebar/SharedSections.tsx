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

// 2. Khối Ảnh & Video đã gửi dùng chung
export function MediaSection() {
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
          <span>Ảnh & Video đã gửi</span>
        </div>
        {isOpen ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-square bg-gray-100 hover:bg-gray-200 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-400 transition cursor-pointer"
            >
              Ảnh {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 3. Khối Tài liệu & File chia sẻ dùng chung
export function FilesSection() {
  const [isOpen, setIsOpen] = useState(false);

  const sampleFiles = [
    { name: "Bao_cao_tuan_3.pdf", size: "2.4 MB", date: "12/11/2026" },
    { name: "So_do_kien_truc.png", size: "850 KB", date: "10/11/2026" },
    { name: "Tai_lieu_yeu_cau.docx", size: "1.1 MB", date: "08/11/2026" },
  ];

  return (
    <div className="p-4 border-b border-gray-100">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <BsFileEarmarkText size={17} className="text-gray-500" />
          <span>Tài liệu đã chia sẻ</span>
        </div>
        {isOpen ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 text-xs">
          {sampleFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <BsFileEarmarkText size={16} className="text-blue-600 shrink-0" />
                <div className="truncate">
                  <p className="font-medium text-gray-800 truncate">{file.name}</p>
                  <span className="text-[10px] text-gray-400">{file.size}</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0">{file.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 4. Khối Tùy chọn & Bảo mật dùng chung
export function PrivacySection({ isGroup = false }: { isGroup?: boolean }) {
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
        </div>
      )}
    </div>
  );
}
