import { MessageCircleMore } from "lucide-react";

export function ChatSideBar({ onOpenMenu }: { onOpenMenu: () => void }) {
    // Only one feature: Tin nhắn
    const listFeature = [
        {
            name: "Tin nhắn",
            icon: <MessageCircleMore />,
        },
    ];

    return (
        <>
            <div className="hidden p-1 gap-2 lg:flex flex-col justify-between h-full bg-indigo-500 dark:bg-gray-900/40">
                <div>
                    {listFeature.map((feature, index) => (
                        <div
                            key={index}
                            className="p-3 my-1 rounded-md flex flex-col items-center justify-center hover:bg-indigo-800/50 text-neutral-50 bg-indigo-900"
                            title={feature.name}
                            onClick={onOpenMenu}
                        >
                            {feature.icon}
                        </div>
                    ))}
                </div>

                <div>
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
                        {listFeature.map((feature, index) => (
                            <div
                                key={index}
                                className="p-1 px-2 my-1 rounded-md flex flex-col items-center justify-center hover:bg-indigo-800/50 text-neutral-50 bg-indigo-900"
                                title={feature.name}
                                onClick={onOpenMenu}
                            >
                                {feature.icon}
                                <p className="text-xs mt-1">{feature.name}</p>
                            </div>
                        ))}

                        <img
                            className="px-2 my-1.5 w-12 h-12 rounded-full border p-2 bg-white text-black border-black bg-gray-150 flex justify-center items-center"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                            alt="User"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
