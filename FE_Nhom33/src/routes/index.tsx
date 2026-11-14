import { createBrowserRouter } from "react-router-dom";
import { MainChatUIComponent } from "@/components/chat";

const route = createBrowserRouter([
    {
        path: "/",
        element: <MainChatUIComponent />,
    },
    {
        path: "/chat",
        element: <MainChatUIComponent />,
    },
]);

export default route;
