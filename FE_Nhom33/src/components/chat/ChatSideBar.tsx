import { MessageCircleMore } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActiveIndex, setMenuState } from "@/redux/slices/featureSlice";
import type { ReduxState } from "@/constants/ReduxState";

export function ChatSideBar() {
    const featureIndex = useSelector((state: ReduxState) => state.featureSlice.activeIndex)
    const navigate = useNavigate()
    const dispatcher = useDispatch()

    // Only one feature: Tin nhắn
    const listFeature = [
        {
            name: 'Tin nhắn',
            icon: <MessageCircleMore />
        }
    ]

    return (
        <>
            <div className="hidden p-1 gap-2 lg:flex flex-col justify-between h-full bg-indigo-500 dark:bg-gray-900/40">
                <div>
                    {listFeature.map((ele, index) => (
                        <div
                            key={index}
                            className={`p-3 my-1 rounded-md flex flex-col items-center justify-center hover:bg-indigo-800/50 text-neutral-50 ${featureIndex === index && "bg-indigo-900 hover:bg-indigo-800"}`}
                            title={ele.name}
                            onClick={() => {
                                dispatcher(setActiveIndex(index))
                                if (index === 0) {
                                    dispatcher(setMenuState(true))
                                    if (featureIndex !== 0) navigate("/chat")
                                }
                            }}
                        >
                            {ele.icon}
                        </div>
                    ))}

                </div>

                <div className="">
                    {/* User avatar placeholder - optional, could keep */}
                    <img
                        className="rounded-2xl p-1"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                        alt="User"
                    />
                </div>
            </div>
            <div className="z-100 bg-indigo-500 block lg:hidden shadow w-full h-16 fixed bottom-0">
                <div className="flex justify-between px-4">
                    <div className="flex flex-1 h-16 gap-6 justify-center">
                        {listFeature.map((ele, index) => (
                            <div
                                key={index}
                                className={`p-1 px-2 my-1 rounded-md flex flex-col items-center justify-center hover:bg-indigo-800/50 text-neutral-50 ${featureIndex === index && "bg-indigo-900 hover:bg-indigo-800"}`}
                                title={ele.name}
                                onClick={() => {
                                    dispatcher(setActiveIndex(index))
                                    if (index === 0) {
                                        dispatcher(setMenuState(true))
                                        if (featureIndex !== 0) navigate("/chat")
                                    }
                                }}
                            >
                                {ele.icon}
                                <p className="text-xs mt-1">{ele.name}</p>
                            </div>
                        ))}

                        {/* User avatar */}
                        <img
                            className="px-2 my-1.5 w-12 h-12 rounded-full border p-2 bg-white text-black border-black bg-gray-150 flex justify-center items-center"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}


