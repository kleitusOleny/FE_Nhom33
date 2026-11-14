import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
// import { saveAuthSession, sendChatEvent } from "../../services/wsClient";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      // giả lập ws để test validate
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/chat");

      // const res = await sendChatEvent<{ RE_LOGIN_CODE: string }>("LOGIN", {
      //   user: trimmedUser,
      //   pass: password,
      // });
      //
      // if (res.status === "success" && res.data?.RE_LOGIN_CODE) {
      //   saveAuthSession(trimmedUser, res.data.RE_LOGIN_CODE);
      //   navigate("/chat");
      //   return;
      // }
      //
      // setError(res.mes || "Đăng nhập thất bại");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-center gap-1 mb-6 select-none">
          <h2 className="text-center text-2xl font-bold text-gray-800"> Chào mừng trở lại</h2>
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
          {error && (<p className="text-sm text-red-600">{error}</p>)}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-700 py-2.5 font-medium text-white transition hover:bg-blue-800 disabled:opacity-60 cursor-pointer">
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </div>
      </form>
    </div>
  );
}