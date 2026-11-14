import {BsSearch, BsPersonPlus, BsPeople} from "react-icons/bs";

export default function Search() {
    return (
        <div className="p-3 border-b border-gray-200 flex items-center gap-2 bg-white">
            <div className="relative flex-1">
                <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                <input type="text" placeholder="Tìm kiếm..." className="w-full pl-9 pr-3 py-2 border rounded text-sm h-7"/>
            </div>

            <button
                type="button"
                title="Thêm người"
                className={"p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition cursor-pointer"}>
                <BsPersonPlus size={19}/>
            </button>

            <button
                type="button"
                title="Thêm nhóm"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition cursor-pointer">
                <BsPeople size={19}/>
            </button>
        </div>
    );
}