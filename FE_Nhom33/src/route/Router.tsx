import {createBrowserRouter} from "react-router-dom";
import Error from "./Error.tsx";
import Layout from "./Layout.tsx";
import Home from "../components/Home.tsx";
import Login from "../components/authentication/Login.tsx";
import Register from "../components/authentication/Register.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <Error/>,

        element: <Layout/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            {
                path:"login",
                element: <Login/>,
            },
            {
                path:"register",
                element: <Register/>,
            },
            {
                path:"chat",
                element: null,
            },
            {
                path: "error",
                element: <Error />,
            },
            {
                path: "*",
                element: <Error />,
            },
        ]
    }
])