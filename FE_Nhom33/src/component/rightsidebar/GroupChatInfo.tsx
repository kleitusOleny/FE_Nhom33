import { useState } from "react";
import { BsPeople, BsChevronDown, BsChevronUp } from "react-icons/bs";
import {QuickActions, MediaSection, FilesSection, PrivacySection} from "./SharedSections.tsx";

// interface Member {
//     name: string;
//     role: string;
//     isLeader?: boolean;
// }

// interface GroupChatInfoProps {
//     groupName?: string;
//     members?: Member[];
//     isActive?: boolean;
//     onAddMember?: () => void;
// }

export default function GroupChatInfo({groupName = "Nhóm Đồ Án 33", members = [
                                              { name: "Bạn (Trưởng nhóm)", role: "Trưởng nhóm", isLeader: true },
                                              { name: "Nguyễn Văn A", role: "Thành viên", isLeader: false },
                                          ], isActive = true, onAddMember}) {
    const [openMembers, setOpenMembers] = useState(true);

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
                <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                        N33
                    </div>
                    <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                </div>

                <h4 className="font-semibold text-gray-900 text-lg">{groupName}</h4>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                    <span className={`text-xs font-medium ${isActive ? "text-emerald-600" : "text-gray-500"}`}>
                        {isActive ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                </div>
                <QuickActions isGroup={true} onAddMember={onAddMember} />
            </div>

            <div className="p-4 border-b border-gray-100">
                <button type="button" onClick={() => setOpenMembers(!openMembers)}
                    className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <BsPeople size={17} className="text-gray-500" />
                        <span>Thành viên nhóm ({members.length})</span>
                    </div>
                    {openMembers ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                </button>

                {openMembers && (
                    <div className="mt-3 space-y-2.5">
                        {members.map((member, i) => (
                            <div key={i} className="flex items-center justify-between text-xs py-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[11px]">
                                        {member.name.charAt(0)}
                                    </div>
                                    <span className="text-gray-800 font-medium truncate max-w-[130px]">
                                        {member.name}
                                    </span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                        member.isLeader ? "bg-amber-100 text-amber-700 font-semibold" : "text-gray-400"}`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <MediaSection />
            <FilesSection />
            <PrivacySection isGroup={true} />
        </div>
    );
}