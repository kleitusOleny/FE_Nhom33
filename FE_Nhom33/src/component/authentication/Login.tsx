export default function Login() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="flex flex-col items-center justify-center gap-1 mb-6 select-none">
            <h2 className="text-center text-2xl font-bold text-gray-800"> Chào mừng trở lại</h2>
            <h3 className="text-center text-1xl text-gray-800">Đăng nhập để tiếp tục cuộc trò chuyện</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 select-none">Tên đăng nhập</label>
              <input type="text" placeholder="VD: nguyenan" className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 select-none">Nhập mật khẩu</label>
              <input type="password" placeholder="VD: nguyenan@2" className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
            </div>
            <button type="submit" className="mt-2 w-full rounded-lg bg-blue-700 py-2.5 font-medium text-white transition hover:bg-blue-800 cursor-pointer">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    );
}