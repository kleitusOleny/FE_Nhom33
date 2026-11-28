import {BsSearch, BsPersonPlus, BsPeople} from "react-icons/bs";

interface SearchProps {
    value?: string;
    onSearchChange?: (keyword: string) => void;
    onAddUser?: () => void;
    onAddGroup?: () => void;
}

export default function Search({
                                   value, onSearchChange, onAddUser, onAddGroup,
                               }: SearchProps) {
    return (<div className="p-3 border-b border-gray-200 flex items-center gap-2 bg-white">
            <div className="relative flex-1">
                <BsSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />
                <input
                    type="text"
                    value={value ?? ""}
                    placeholder="Tìm kiếm..."
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border rounded text-sm h-7"
                />
            </div>

            <button
                type="button"
                title="Thêm người"
                onClick={onAddUser}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition cursor-pointer"
            >
                <BsPersonPlus size={19}/>
            </button>

            <button
                type="button"
                title="Thêm nhóm"
                onClick={onAddGroup}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition cursor-pointer"
            >
                <BsPeople size={19}/>
            </button>
        </div>);
}