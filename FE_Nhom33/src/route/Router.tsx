import {createBrowserRouter} from "react-router-dom";
import Error from "./Error.tsx";
import Layout from "./Layout.tsx";
import Home from "../component/Home.tsx";
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
                element: null,
            },
            {
                path:"register",
                element:null,
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