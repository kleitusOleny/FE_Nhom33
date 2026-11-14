import { useState } from "react";
import { checkPasswordCriteria } from "./Verification";

export default function Register() {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const rules = checkPasswordCriteria(password, rePassword);

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <form className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
          <div className="flex flex-col items-center justify-center gap-1 mb-6 select-none">
            <h2 className="text-center text-2xl font-bold text-gray-800">Đăng kí tài khoản</h2>
            <h3 className="text-center text-1xl text-gray-800">Cùng tham gia trò chuyện với mọi người</h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 select-none">Tên đăng nhập</label>
                <input type="text" placeholder="VD: nguyenan" className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
            </div>
            <div className="flex flex-col gap-1.5">
                <div>
                    <label className="text-sm font-medium text-gray-700 select-none">Nhập mật khẩu</label>
                    <input type="password" 
                    placeholder="VD: nguyenan@2" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center select-none">
                        <input type="checkbox" disabled 
                        checked={rules.hasMinLength}
                        className="mr-2 leading-tight"/>
                        <span className={`text-sm leading-none transition-colors ${rules.hasMinLength ? "text-emerald-600" : "text-gray-700"}`}>Mật khẩu bao gồm ít nhất 8 kí tự</span>
                    </div>
                    <div className="flex items-center select-none">
                        <input type="checkbox" disabled 
                        checked={rules.hasUpperLower}
                        className="mr-2 leading-tight"/>
                        <span className={`text-sm leading-none transition-colors ${rules.hasUpperLower ? "text-emerald-600" : "text-gray-700"}`}>Mật khẩu bao gồm kí tự viết hoa, viết thường</span>
                    </div>
                    <div className="flex items-center select-none">
                        <input type="checkbox" disabled 
                        checked={rules.hasSpecialChar}
                        className="mr-2 leading-tight"/>
                        <span className={`text-sm leading-none transition-colors ${rules.hasSpecialChar ? "text-emerald-600" : "text-gray-700"}`}>Mật khẩu bao gồm kí tự đặc biệt</span>
                    </div>
                    <div className="flex items-center select-none">
                        <input type="checkbox" disabled 
                        checked={rules.hasNumber}
                        className="mr-2 leading-tight"/>
                        <span className={`text-sm leading-none transition-colors ${rules.hasNumber ? "text-emerald-600" : "text-gray-700"}`}>Mật khẩu bao gồm số</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <div>
                    <label className="text-sm font-medium text-gray-700 select-none">Nhập lại mật khẩu</label>
                    <input type="password" 
                    placeholder="VD: nguyenan@2"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
                </div>
                <div className="flex items-center select-none mt-2">
                    <input type="checkbox" disabled 
                    checked={rules.isMatched}
                    className="mr-2 leading-tight"/>
                    <span className={`text-sm leading-none transition-colors ${rules.isMatched ? "text-emerald-600" : "text-gray-700"}`}>Phải trùng kí tự nhập mật khẩu</span>
                </div>
            </div>
            <button type="submit" className="mt-2 w-full rounded-lg bg-cyan-600 py-2.5 font-medium text-white transition hover:bg-cyan-700 cursor-pointer">
              Đăng kí
            </button>
          </div>
        </form>
      </div>
    );
}