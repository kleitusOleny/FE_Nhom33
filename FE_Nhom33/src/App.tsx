import { RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import router from "./routes/index.tsx";

function App() {
    useEffect(() => {
        const theme = localStorage.getItem("theme");
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, []);

    return <RouterProvider router={router} />;
}

export default App;
