import {QuickActions, MediaSection, FilesSection, PrivacySection} from "./SharedSections.tsx";

// interface UserChatInfoProps {
//     name?: string;
//     isActive?: boolean;
// }

export default function UserChatInfo({name = "Nguyễn Văn A", isActive = true}) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="p-6 flex flex-col items-center text-center border-b border-gray-100">
                <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500
                     text-white flex items-center justify-center font-bold text-2xl shadow-md">
                        {name.charAt(0)}
                    </div>
                    <span className={`absolute bottom-1 right-1 w-4 h-4 border-2 border-white rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                </div>

                <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`}></span>
                    <span className={`text-xs font-medium ${isActive ? "text-emerald-600" : "text-gray-500"}`}>{isActive ? "Đang hoạt động" : "Không hoạt động"}</span>
                </div>
                <QuickActions isGroup={false} />
            </div>
            <MediaSection />
            <FilesSection />
            <PrivacySection isGroup={false} />
        </div>
    );
}