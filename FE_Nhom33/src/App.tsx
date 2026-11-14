import { RouterProvider } from 'react-router-dom';
import router from './routes/index.tsx';
import './App.css';
import { useEffect } from 'react';
import { useSelector } from "react-redux";
import type { ReduxState } from "@/constants/ReduxState.ts";
import {useSocketConnection} from "@/socket/useSocketConnection.ts";
function App() {
    useSocketConnection();
    const theme = useSelector((state: ReduxState) => state.userPageState.theme);
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <RouterProvider router={router} />
    );
}

export default App;
