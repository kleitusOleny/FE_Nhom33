import { useEffect, useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WebsocketInstance } from "@/socket/WebsocketInstance";
import { WebSocketEvent } from "@/socket/types/WebSoketMessage";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ws = WebsocketInstance.getInstance();
    const unsubscribe = ws.subscribe(WebSocketEvent.LOGIN, (res) => {
      setLoading(false);
      if (res.status === "success") {
        localStorage.setItem("re_login_code", res.data.RE_LOGIN_CODE);
        localStorage.setItem("username", username.trim());
        navigate("/chat");
      } else {
        setError("Đăng nhập thất bại, sai tên đăng nhập hoặc mật khẩu");
      }
    });
    return unsubscribe;
  }, [navigate, username]);

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    WebsocketInstance.getInstance().send(WebSocketEvent.LOGIN, {
      user: trimmedUser,
      pass: password,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-center gap-1 mb-6 select-none">
          <h2 className="text-center text-2xl font-bold text-gray-800">Chào mừng trở lại</h2>
          <h3 className="text-center text-1xl text-gray-800">Đăng nhập để tiếp tục cuộc trò chuyện</h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 select-none">Tên đăng nhập</label>
            <input type="text"
              placeholder="VD: nguyenan"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 select-none">Nhập mật khẩu</label>
            <input type="password"
              placeholder="VD: nguyenan@2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2 text-sm outline-none transition focus:border-blue-950 focus:ring-1 focus:ring-blue-100"/>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-700 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60 cursor-pointer">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <div className="mt-2 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}