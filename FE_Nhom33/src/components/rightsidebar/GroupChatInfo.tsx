import { useState } from "react";
import { BsPeople, BsChevronDown, BsChevronUp } from "react-icons/bs";
import {
  QuickActions,
  MediaSection,
  FilesSection,
  PrivacySection,
  type SharedFile,
} from "./SharedSections.tsx";

export interface GroupMember {
  name: string;
  role?: string;
  isLeader?: boolean;
}

interface GroupChatInfoProps {
  groupName?: string;
  members?: GroupMember[];
  media?: string[];
  files?: SharedFile[];
  isActive?: boolean;
  onLeaveGroup?: () => void;
  leaveError?: string | null;
}

export default function GroupChatInfo({
  groupName = "",
  members = [],
  media = [],
  files = [],
  isActive = true,
  onLeaveGroup,
  leaveError,
}: GroupChatInfoProps) {
  const [openMembers, setOpenMembers] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
            {groupName ? groupName.charAt(0).toUpperCase() : "G"}
          </div>
          <span
            className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${
              isActive ? "bg-emerald-500" : "bg-gray-400"
            }`}
          ></span>
        </div>

        <h4 className="font-semibold text-gray-900 text-lg">{groupName}</h4>
        <div className="flex items-center justify-center gap-1.5 mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-gray-400"
            }`}
          ></span>
          <span
            className={`text-xs font-medium ${
              isActive ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            {isActive ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        </div>
        <QuickActions isGroup={true} />
      </div>

      <div className="p-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => setOpenMembers(!openMembers)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BsPeople size={17} className="text-gray-500" />
            <span>Thành viên nhóm ({members.length})</span>
          </div>
          {openMembers ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
        </button>

        {openMembers &&
          (members.length === 0 ? (
            <p className="mt-3 text-xs text-gray-400 text-center">
              Chưa có thành viên nào
            </p>
          ) : (
            <div className="mt-3 space-y-2.5">
              {members.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-800 font-medium truncate max-w-[130px]">
                      {member.name}
                    </span>
                  </div>
                  {member.role && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        member.isLeader
                          ? "bg-amber-100 text-amber-700 font-semibold"
                          : "text-gray-400"
                      }`}
                    >
                      {member.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
      </div>

      <MediaSection media={media} />
      <FilesSection files={files} />
      <PrivacySection
        isGroup={true}
        onLeaveGroup={onLeaveGroup}
        leaveError={leaveError}
      />
    </div>
  );
}
