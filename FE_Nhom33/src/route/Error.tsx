import {useNavigate} from "react-router-dom";

export default function Error() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-center"
            style={{minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",}}>

            <h1 className="text-5xl font-bold text-red-500 mb-3">Error, Something went wrong</h1>
            <p className="text-gray-600 text-lg mb-6">Đã xảy ra sự cố không mong muốn hoặc trang không tồn tại!</p>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition cursor-pointer">
                    Quay về trang trước
                </button>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    Về trang chủ
                </button>
            </div>
        </div>
    );
}
