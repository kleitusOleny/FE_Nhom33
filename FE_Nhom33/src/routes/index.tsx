import { createBrowserRouter } from "react-router-dom";
import { MainChatUIComponent } from "@/components/chat";

const route = createBrowserRouter(
    [
        {
            path: "/chat",
            element: <MainChatUIComponent />
        },
    ]
)

export default route;
